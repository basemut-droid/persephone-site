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
    // /newsletter/ is a generated redirect stub (Astro's `redirects`
    // config — see astro.config.mjs), not a real content page.
    if (route === '/404/' || route.startsWith('/admin/') || route === '/newsletter/') continue;
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
// 5. Every <img> has a non-empty alt, or is deliberately marked decorative.
//    BLOCKING per RUN-2026-09-07.md Phase F task 6, once task 5c gave every
//    image on the site a real choice: real alt text, or empty alt +
//    aria-hidden="true" on the same tag (not just an ancestor — this check
//    only looks at the <img> tag itself, which is also why ClosingCta.astro
//    and the other decorative-image call sites put aria-hidden directly on
//    the <Image> rather than a wrapping element).
// ---------------------------------------------------------------------
{
  const violations = [];
  for (const [route, html] of routes) {
    for (const m of html.matchAll(/<img\s[^>]*>/gi)) {
      const tag = m[0];
      const altMatch = /alt="([^"]*)"/i.exec(tag);
      const hasEmptyAlt = !altMatch || altMatch[1].trim() === '';
      if (!hasEmptyAlt) continue;
      const isMarkedDecorative = /aria-hidden="true"/i.test(tag);
      if (!isMarkedDecorative) {
        violations.push(`${route}: <img> with empty/missing alt and no aria-hidden — ${tag.slice(0, 100)}`);
      }
    }
  }
  addResult('img-alt', 'Every <img> has a non-empty alt, or is marked decorative with aria-hidden', true, violations);
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
// 6b. Every internal <a href> resolves to a built page (any of them, not
// just the language switcher's own — added after Phase 4.4 found the
// switcher wasn't the only source of dead /en/, /it/ links: the EN/IT
// homepage's own header nav, built from site/en.json and site/it.json,
// links to translated-slug subpages that were never built. See
// OPEN-QUESTIONS.md #16.
// ---------------------------------------------------------------------
{
  const violations = [];
  for (const [route, html] of routes) {
    for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"/gi)) {
      let href = m[1];
      if (!href.startsWith('/') || href.startsWith('//')) continue; // external/mailto/tel
      href = href.split(/[?#]/)[0];
      if (!href) continue; // bare "#" same-page anchor
      const normalized = href.endsWith('/') ? href : href + '/';
      if (!routes.has(normalized)) {
        violations.push(`${route}: <a href="${href}"> does not resolve to a built page`);
      }
    }
  }
  // Blocking as of RUN-2026-09-07-B1.md Phase 0.1: this was non-blocking
  // when it first caught the EN/IT dead links documented in
  // OPEN-QUESTIONS.md #7 — and got read past as a result. The report said
  // FAIL, the build still passed, and the fix never happened.
  addResult('internal-links-resolve', 'Every internal <a href> resolves to a built page', true, violations);
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
// 9. Every field defined in a collection's schema is either rendered
//    somewhere or explicitly allow-listed as intentionally unused.
//    BLOCKING per RUN-2026-09-07.md Phase F task 6 — this is the
//    mechanical version of what findings #2/#3/#4/#8 all turned out to be:
//    content sitting in a field the template never reads. The heading
//    check (#8) catches this for headings specifically, from outside,
//    against built HTML; this one catches it for ANY schema field, from
//    the template source, before a build even runs — the same principle
//    BlockTracker (src/lib/parseMarkdownBlocks.ts) applies to markdown
//    body blocks, extended to typed frontmatter fields.
//
//    Deliberately source-level, not content.config.ts-parsing: the field
//    lists below are the collections' own top-level schema keys, kept by
//    hand rather than parsed out of the zod schema, because a regex parser
//    for arbitrary nested zod objects is exactly the kind of "looks
//    thorough, silently wrong on the next schema edit" mechanism this
//    project has already been burned by once (see DESIGN-SYSTEM.md's
//    BlockTracker section). Keep this list in sync with
//    src/content.config.ts by hand when either changes.
// ---------------------------------------------------------------------
{
  const violations = [];
  const srcDir = join(root, 'src');
  const astroFiles = walk(srcDir, ['.astro']);
  const templateSrc = astroFiles.map((f) => readFileSync(f, 'utf8')).join('\n');

  // Collections with schema fields checked here. `events` is deliberately
  // excluded, not allow-listed per field: it has zero consuming pages and
  // zero real content (only .gitkeep placeholders) — a scaffold for a
  // future feature, not a case of content silently going unrendered.
  const SCHEMA_FIELDS = {
    pages: ['title', 'description', 'sourceUrl', 'heroImage', 'heroImageAlt', 'formatBadges', 'recognitionPanel', 'principles'],
    blog: ['title', 'description', 'publishDate', 'updatedDate', 'heroImage', 'heroImageAlt', 'category', 'draft', 'seoTitle', 'seoDescription'],
    site: ['reviewStatus', 'meta', 'nav', 'hero', 'painPoints', 'services', 'philosophy', 'founder', 'newsletter', 'footer', 'common'],
  };

  // Fields confirmed intentionally unrendered, with why — not a silent skip.
  const ALLOWED_UNUSED = {
    'pages.sourceUrl': 'provenance only (which live persephone.at URL this was extracted from) — never meant to be shown to a visitor',
  };

  // Known limitation: this matches the field NAME anywhere in any .astro
  // file, not "this collection's field, read off this collection's entry"
  // specifically — so a generic name like "title" or "description" used by
  // one collection could mask a genuinely-unused same-named field on
  // another. Acceptable here because the fields that share a name across
  // collections (title/description/heroImage/heroImageAlt) are already
  // heavily used everywhere; a field whose name is unique to one collection
  // (formatBadges, recognitionPanel, principles, updatedDate, category, …)
  // gets an exact, meaningful check.
  for (const [collection, fields] of Object.entries(SCHEMA_FIELDS)) {
    for (const field of fields) {
      const key = `${collection}.${field}`;
      if (ALLOWED_UNUSED[key]) continue;
      // Matches `.field`, `['field']`, or `["field"]` — the three ways
      // template code reads a frontmatter/JSON property in this codebase.
      const re = new RegExp(`\\.${field}\\b|\\[['"]${field}['"]\\]`);
      if (!re.test(templateSrc)) {
        violations.push(`${collection} collection: field "${field}" (content.config.ts) is never read by any .astro file — add real usage or an ALLOWED_UNUSED entry with a reason`);
      }
    }
  }
  addResult('schema-fields-used', "Every collection schema field is rendered or explicitly allow-listed", true, violations);
}

// ---------------------------------------------------------------------
// 10. Every <a> has an accessible name — text content or aria-label.
//    BLOCKING per docs/RUN-2026-09-07-B1.md Phase 0.2: an image-only link
//    (a blog-teaser/blog-row thumbnail wrapped in <a href>, no text inside)
//    reads to a screen reader as just "Link" — no build-check caught this
//    class of bug before now, exactly why this run's own image links slipped
//    through in the first place.
// ---------------------------------------------------------------------
{
  const violations = [];
  for (const [route, html] of routes) {
    for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
      const [, attrs, inner] = m;
      const ariaLabel = /aria-label="([^"]*)"/i.exec(attrs)?.[1]?.trim();
      const textContent = inner
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (!ariaLabel && !textContent) {
        violations.push(`${route}: <a${attrs}> has no text content and no aria-label`);
      }
    }
  }
  addResult('link-accessible-name', 'Every <a> has an accessible name (text content or aria-label)', true, violations);
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
