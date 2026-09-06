#!/usr/bin/env node
// Build-time integrity checks — see docs/NIGHT-RUN.md Phase 1.1/1.2.
//
// Run after `astro build` against the built `dist/` output (wired into
// `npm run build` in package.json as `astro build && node
// scripts/build-check.mjs`). Each check below is independent and reports
// every violation it finds; nothing here is fixed automatically. Checks
// marked BLOCKING exit the process with a non-zero code when they find a
// violation, which fails the build. All others are non-blocking: they
// print what they found and the script still exits 0, so the report is
// visible without stopping the build. Only the source-heading check
// (Phase 1.2) is blocking, per NIGHT-RUN.md's explicit instruction — it
// started non-blocking for Phase 1.1's first report, then flipped once the
// page-composition root cause behind it was fixed.
//
// Also writes a Markdown copy of this run's report to
// docs/build-check-report.md so it can be committed and read without
// re-running the script.

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const distDir = join(root, 'dist');
const contentPagesDir = join(root, 'src', 'content', 'pages', 'de');
const astroConfigPath = join(root, 'astro.config.mjs');

// Phase 1.1 (NIGHT-RUN.md): this script starts fully non-blocking so the
// first run can report the current state without failing anyone's build.
// Phase 1.2 flips this to `true` once the page-composition root cause is
// fixed, per the brief ("make the last check in 1.1 blocking").
const HEADING_CHECK_BLOCKING = true;

/** @type {{ id: string; title: string; blocking: boolean; violations: string[] }[]} */
const results = [];

function walk(dir, exts) {
  /** @type {string[]} */
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, exts));
    else if (exts.some((e) => entry.name.endsWith(e))) out.push(full);
  }
  return out;
}

if (!statSync(distDir, { throwIfNoEntry: false })) {
  console.error(`build-check: ${distDir} does not exist — run "astro build" first.`);
  process.exit(1);
}

const htmlFiles = walk(distDir, ['.html']);
/** route -> html content */
const routes = new Map();
for (const file of htmlFiles) {
  let route = '/' + relative(distDir, file).replace(/\\/g, '/');
  route = route.replace(/index\.html$/, '').replace(/\.html$/, '/');
  if (!route.endsWith('/')) route += '/';
  routes.set(route, readFileSync(file, 'utf8'));
}

function addResult(id, title, blocking, violations) {
  results.push({ id, title, blocking, violations });
}

// ---------------------------------------------------------------------
// 1. Every page in src/content/pages has a route, and every route has content
// ---------------------------------------------------------------------
{
  const violations = [];
  const contentSlugs = readdirSync(contentPagesDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));

  // Pages known to be intentionally NOT built as their own route (either
  // rendered under a different URL, or a source-only record). Kept as an
  // explicit, visible allowlist rather than a silent skip.
  const knownExceptions = new Set([
    'blog', // powers /blog/'s PageHero copy, not its own route
    'datenschutzerklaerung', // src/pages/datenschutz.astro is authoritative (OPEN-QUESTIONS #9); this is a verbatim archive record only
  ]);

  for (const slug of contentSlugs) {
    if (knownExceptions.has(slug)) continue;
    const expectedRoute = `/${slug}/`;
    if (!routes.has(expectedRoute)) {
      violations.push(`src/content/pages/de/${slug}.md has no built route at ${expectedRoute}`);
    }
  }

  for (const [route, html] of routes) {
    if (route.startsWith('/blog/') || route === '/' || ['/en/', '/it/', '/404/'].includes(route)) continue;
    if (html.trim().length < 200) {
      violations.push(`${route} built but its HTML is suspiciously short (${html.trim().length} chars) — likely empty content`);
    }
  }

  addResult('routes-have-content', 'Every content page has a route, every route has content', false, violations);
}

// ---------------------------------------------------------------------
// 2. Every built route is reachable from the nav or linked from another page
// ---------------------------------------------------------------------
{
  const violations = [];
  const linkTargets = new Set();
  for (const [, html] of routes) {
    for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"/gi)) {
      let href = m[1];
      if (!href.startsWith('/')) continue; // external/mailto/tel — not a build reachability concern here
      href = href.split(/[?#]/)[0];
      if (!href.endsWith('/')) href += '/';
      linkTargets.add(href);
    }
  }
  for (const route of routes.keys()) {
    // Never linked to on purpose: the 404 page, and the Decap CMS admin
    // panel (accessed directly at /admin/, not from the site's own nav).
    if (route === '/404/' || route.startsWith('/admin/')) continue;
    if (!linkTargets.has(route)) {
      violations.push(`${route} is built but no <a href> anywhere in the site points at it`);
    }
  }
  addResult('reachability', 'Every built route is reachable from the nav or another page', false, violations);
}

// ---------------------------------------------------------------------
// 3. No href anywhere points at persephone.at (all internal links relative)
// ---------------------------------------------------------------------
{
  const violations = [];
  for (const [route, html] of routes) {
    for (const m of html.matchAll(/<a\s[^>]*href="(https?:\/\/(?:www\.)?persephone\.at[^"]*)"/gi)) {
      violations.push(`${route}: <a href="${m[1]}">`);
    }
  }
  addResult('no-old-domain-links', 'No href points at persephone.at', false, violations);
}

// ---------------------------------------------------------------------
// 4. Every page has a meta description, and no two pages share one
// ---------------------------------------------------------------------
{
  const violations = [];
  /** description -> routes[] */
  const byDescription = new Map();
  for (const [route, html] of routes) {
    if (route === '/404/' || route.startsWith('/admin/')) continue;
    const m = /<meta name="description" content="([^"]*)"/i.exec(html);
    const desc = m ? m[1].trim() : '';
    if (!desc) {
      violations.push(`${route} has no meta description (empty or missing)`);
      continue;
    }
    const list = byDescription.get(desc) ?? [];
    list.push(route);
    byDescription.set(desc, list);
  }
  for (const [desc, routeList] of byDescription) {
    if (routeList.length > 1) {
      violations.push(`Shared description across ${routeList.join(', ')}: "${desc.slice(0, 80)}${desc.length > 80 ? '…' : ''}"`);
    }
  }
  addResult('meta-descriptions', 'Every page has a unique, non-empty meta description', false, violations);
}

// ---------------------------------------------------------------------
// 5. Every <img> has a non-empty alt
// ---------------------------------------------------------------------
{
  const violations = [];
  for (const [route, html] of routes) {
    for (const m of html.matchAll(/<img\s[^>]*>/gi)) {
      const tag = m[0];
      const altMatch = /alt="([^"]*)"/i.exec(tag);
      if (!altMatch || altMatch[1].trim() === '') {
        violations.push(`${route}: <img> with empty/missing alt — ${tag.slice(0, 100)}`);
      }
    }
  }
  addResult('img-alt', 'Every <img> has a non-empty alt', false, violations);
}

// ---------------------------------------------------------------------
// 6. Every locale link the language switcher renders resolves to a built page
// ---------------------------------------------------------------------
{
  const violations = [];
  for (const [route, html] of routes) {
    const switcherMatch = /<div class="lang-switcher[^>]*>[\s\S]*?<\/details>|<details class="lang-switcher"[\s\S]*?<\/details>/i.exec(html);
    const scope = switcherMatch ? switcherMatch[0] : html;
    if (!/lang-switcher/.test(html)) continue;
    for (const m of scope.matchAll(/<a\s[^>]*hreflang="(de|en|it)"[^>]*href="([^"]+)"/gi)) {
      const href = m[2];
      const normalized = href.endsWith('/') ? href : href + '/';
      if (!routes.has(normalized)) {
        violations.push(`${route}: language switcher links to ${href} (hreflang=${m[1]}), which was not built`);
      }
    }
  }
  addResult('locale-switcher-links', 'Every locale link the language switcher renders resolves to a built page', false, violations);
}

// ---------------------------------------------------------------------
// 7. `site` in astro.config.mjs is not a placeholder
// ---------------------------------------------------------------------
{
  const violations = [];
  const configSrc = readFileSync(astroConfigPath, 'utf8');
  const m = /site:\s*['"]([^'"]+)['"]/.exec(configSrc);
  const site = m?.[1] ?? '';
  if (!site || /example|localhost|TODO|placeholder/i.test(site)) {
    violations.push(`astro.config.mjs "site" is "${site}" — a placeholder, not a real production domain`);
  }
  addResult('site-domain', 'astro.config.mjs "site" is not a placeholder', false, violations);
}

// ---------------------------------------------------------------------
// 8. Every heading present in a source content file appears in the built
//    page for that route. BLOCKING per NIGHT-RUN.md Phase 1.2.
// ---------------------------------------------------------------------
{
  const violations = [];
  // Route each content page maps to; keep in sync with #1's exceptions above.
  const routeForSlug = (slug) => `/${slug}/`;
  const skip = new Set(['blog', 'datenschutzerklaerung']);

  // Headings that exist in a source file but are deliberately not rendered
  // — a decision on record (see the linked doc), not a silent drop. Every
  // other unmatched heading below is a real bug the build should surface.
  const deliberatelyExcluded = {
    'selbsthilfegruppe.md': [
      // Unremoved Avada theme demo-content default, English, never part of
      // the real page — owner decision in docs/fuer-marina.md Q4 ("bleibt
      // entfernt").
      'Your Journey to a Fulfilling Life',
      // TEMPORARY, remove when NIGHT-RUN.md Phase 3 item 1 lands: verbatim
      // source typo ("Nächtes", missing the "s") — OPEN-QUESTIONS.md #8.
      // The owner has since approved correcting it (fuer-marina.md Q1),
      // scheduled for Phase 3's batch of copy fixes, not this phase's
      // page-composition fix. Listed here only so flipping this check to
      // blocking (below) doesn't fail the build on an already-tracked,
      // already-decided, not-yet-executed fix.
      'Nächtes SHG-Treffen',
    ],
  };

  for (const file of readdirSync(contentPagesDir).filter((f) => f.endsWith('.md'))) {
    const slug = file.replace(/\.md$/, '');
    if (skip.has(slug)) continue;
    const raw = readFileSync(join(contentPagesDir, file), 'utf8');
    const body = raw.replace(/^---[\s\S]*?---\n/, ''); // strip frontmatter
    const headings = [...body.matchAll(/^#{1,6}\s+(.+)$/gm)].map((m) => m[1].trim());
    const route = routeForSlug(slug);
    const html = routes.get(route);
    if (!html) continue; // already reported by check #1
    for (const heading of headings) {
      if (deliberatelyExcluded[file]?.includes(heading)) continue;
      // Strip this site's own extraction conventions so the check compares
      // visible text: **bold** wrapper, and a heading that's just a
      // [label](href) link.
      const linkMatch = /^\[([^\]]+)\]\([^)]+\)$/.exec(heading);
      const plain = linkMatch ? linkMatch[1] : heading.replace(/^\*\*(.*)\*\*$/, '$1');
      const escaped = plain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(escaped.replace(/\s+/g, '\\s*'), 'i');
      // Strip tags before matching so heading text split across inline
      // markup (e.g. <a>) still matches, and decode the handful of named
      // entities Astro's renderer actually produces (&, ", ', <, >) so a
      // heading containing "&" doesn't false-positive against the HTML's
      // "&amp;".
      const textOnly = html
        .replace(/<[^>]+>/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      if (!re.test(textOnly)) {
        violations.push(`${route}: source heading "${heading}" (from ${file}) not found in built HTML`);
      }
    }
  }
  addResult('source-headings-render', 'Every heading in a source content file appears in its built page', HEADING_CHECK_BLOCKING, violations);
}

// ---------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------
const lines = [];
lines.push('# Build-check report');
lines.push('');
lines.push(`Generated ${new Date().toISOString()} by \`scripts/build-check.mjs\`.`);
lines.push('');

let hasBlockingViolation = false;
for (const r of results) {
  const status = r.violations.length === 0 ? 'PASS' : r.blocking ? 'FAIL (blocking)' : 'FAIL (non-blocking)';
  lines.push(`## ${r.title} — ${status}`);
  lines.push('');
  if (r.violations.length === 0) {
    lines.push('No violations found.');
  } else {
    for (const v of r.violations) lines.push(`- ${v}`);
    if (r.blocking) hasBlockingViolation = true;
  }
  lines.push('');
}

const reportPath = join(root, 'docs', 'build-check-report.md');
writeFileSync(reportPath, lines.join('\n'));

console.log(lines.join('\n'));
console.log(`Report written to ${relative(root, reportPath)}`);

if (hasBlockingViolation) {
  console.error('\nbuild-check: a BLOCKING check failed — see above.');
  process.exit(1);
}
