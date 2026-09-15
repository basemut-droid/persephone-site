// Splits a content-collection entry's raw markdown body (Task 2's "pages"
// collection stores one flowing markdown body per page, deliberately
// unstructured — see src/content.config.ts) into an ordered list of blocks,
// so a page composing several distinct components (Task 3) can pull out
// "the paragraphs under this heading" or "this list" without duplicating
// the copy into separate typed frontmatter fields. Handles exactly the
// markdown shapes this site's own content actually uses — headings,
// paragraphs, `- `/`*  `/`+ ` lists (all three are valid CommonMark bullet
// markers, and Decap CMS's markdown widget re-serializes existing `-`
// lists as `*` on every save through /admin/ — confirmed 2026-09-15 by a
// real CMS test save silently emptying Selbsthilfegruppe's meeting-details
// list when this only recognized `-`), and a paragraph that's just a
// single `[label](href)` link (this site's convention for a CTA) — not a
// general markdown parser.

export type MdBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'cta'; text: string; href: string }
  | { type: 'image'; alt: string; src: string };

const ctaOnlyRe = /^\[([^\]]+)\]\(([^)]+)\)$/;
const imageOnlyRe = /^!\[([^\]]*)\]\(([^)]+)\)$/;

export function parseMarkdownBlocks(body: string): MdBlock[] {
  const chunks = body
    .trim()
    .split(/\n{2,}/)
    .map((c) => c.trim())
    .filter(Boolean);

  const blocks: MdBlock[] = [];
  for (const chunk of chunks) {
    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(chunk);
    if (headingMatch) {
      blocks.push({ type: 'heading', level: headingMatch[1].length, text: headingMatch[2].trim() });
      continue;
    }
    if (chunk.split('\n').every((line) => /^[-*+]\s+/.test(line.trim()))) {
      blocks.push({
        type: 'list',
        items: chunk.split('\n').map((line) => line.trim().replace(/^[-*+]\s+/, '')),
      });
      continue;
    }
    const imageMatch = imageOnlyRe.exec(chunk);
    if (imageMatch) {
      blocks.push({ type: 'image', alt: imageMatch[1], src: imageMatch[2] });
      continue;
    }
    const ctaMatch = ctaOnlyRe.exec(chunk);
    if (ctaMatch) {
      blocks.push({ type: 'cta', text: ctaMatch[1], href: ctaMatch[2] });
      continue;
    }
    blocks.push({ type: 'paragraph', text: chunk.replace(/\n/g, ' ') });
  }
  return blocks;
}

// Returns every block following a given heading text, up to (not
// including) the next heading at the SAME level or shallower — a deeper
// sub-heading (e.g. an h4 FAQ question under an h2 section heading, as on
// Beratung's "Gut zu wissen") is content that belongs to this section, not
// a boundary. Throws if the heading isn't found, since a missing section
// means the page and its content collection entry have drifted out of
// sync — better to fail the build than render a silently-empty section.
export function section(blocks: MdBlock[], headingText: string): MdBlock[] {
  const start = blocks.findIndex((b) => b.type === 'heading' && b.text === headingText);
  if (start === -1) {
    throw new Error(`parseMarkdownBlocks: heading "${headingText}" not found in content body`);
  }
  const level = (blocks[start] as { level: number }).level;
  const rest = blocks.slice(start + 1);
  const end = rest.findIndex((b) => b.type === 'heading' && b.level <= level);
  return end === -1 ? rest : rest.slice(0, end);
}

export function paragraphs(blocks: MdBlock[]): string[] {
  return blocks.filter((b): b is { type: 'paragraph'; text: string } => b.type === 'paragraph').map((b) => b.text);
}

// Strips this site's own extraction convention of wrapping a heading's
// whole text in `**bold**` when the source's <h*> contained a <strong>
// (see docs/content-inventory.md) — used where the heading is a plain
// label, not a link.
export function stripEmphasis(text: string): string {
  return text.replace(/^\*\*(.*)\*\*$/, '$1');
}

// Content-collection bodies deliberately keep every persephone.at URL
// verbatim, dead ones included (see docs/content-audit.md's carry-forward
// note) — a faithful record of the source is Task 2's job, not the
// rebuilt page's. Rewriting a real (non-dead) absolute persephone.at URL
// to this site's own local route is the page's job at build/render time;
// this is the one place that rewrite is implemented, so every page does
// it the same way. Pass a map of specific dead-link corrections (live
// href -> real local route) for any link that needs more than the
// mechanical rewrite.
export function toLocalRoute(href: string, corrections: Record<string, string> = {}): string {
  if (corrections[href]) return corrections[href];
  return href.replace(/^https?:\/\/(www\.)?persephone\.at((?:\/[a-z0-9-]+)+\/)$/i, '$2');
}

// Same rewrite, applied to every persephone.at link inside a paragraph's
// inline text (as opposed to toLocalRoute, which takes a bare href). Path
// can be more than one segment deep (e.g. /featured/some-slug/).
export function rewriteLocalLinks(text: string, corrections: Record<string, string> = {}): string {
  return text.replace(/https?:\/\/(?:www\.)?persephone\.at(?:\/[a-z0-9-]+)+\//gi, (m) => toLocalRoute(m, corrections));
}

// Root-cause fix for docs/external-review.md finding #3/#4 (NIGHT-RUN.md
// Phase 1.2): pages used to pull blocks out of the parsed array purely by
// position (`blocks[3]`, `blocks.slice(5)`) with no record of which blocks
// a page actually intended to render. A block nobody happened to reference
// vanished from the page with no error — that's exactly how Beratung lost
// its "Was ist Beratung?"/"Formate" headings and Kontakt lost
// "Erreichbarkeit"/"Standorte": the code touched a range containing them,
// then filtered or restructured it in a way that dropped them silently.
//
// BlockTracker doesn't replace positional access — a markdown body's
// structure genuinely is positional (an eyebrow, then a title, then an
// intro paragraph, in source order) — but it makes every access accountable:
// every read through `.at()`/`.slice()`/`.section()` marks which blocks a
// page has claimed, an explicit `.exclude()` records a block a page
// deliberately isn't rendering (with a reason, so it reads as a decision in
// the diff, not a gap), and `.assertAllHandled()` — called once, at the end
// of a page's frontmatter — throws, naming the exact unhandled block, if
// anything in the source was neither claimed nor excluded. This is the
// "build-time assertion that every source block is either rendered or
// explicitly excluded by name" the external review recommended, chosen over
// a full rewrite to named frontmatter blocks because the underlying content
// actually is one flowing document per page (see src/content.config.ts's
// own comment on why) — turning it into named fields would duplicate the
// same copy into a second, harder-to-edit shape for no added safety beyond
// what accounting for every block already gives.
//
// This complements, rather than replaces, scripts/build-check.mjs's
// blocking "every source heading appears in the built page" check: that
// check catches a *heading* that silently failed to render, from outside,
// against the final HTML; BlockTracker catches any block — heading,
// paragraph, list, image, or CTA — that a page's own frontmatter never
// touched at all, from inside, at the moment the page is built.
export class BlockTracker {
  private readonly handled: boolean[];

  constructor(private readonly blocks: MdBlock[]) {
    this.handled = blocks.map(() => false);
  }

  private indexOf(block: MdBlock): number {
    const idx = this.blocks.indexOf(block);
    if (idx === -1) throw new Error('BlockTracker: block does not belong to this tracker\'s block list');
    return idx;
  }

  private markMany(items: (MdBlock | undefined | null)[]): void {
    for (const item of items) {
      if (item) this.handled[this.indexOf(item)] = true;
    }
  }

  /** Marks and returns the block at a fixed position (an eyebrow/title/intro that always sits first, by this site's own extraction convention). */
  at(i: number): MdBlock {
    this.handled[i] = true;
    return this.blocks[i];
  }

  /** Common pattern across this site's standalone pages: an eyebrow paragraph, then the page's own h1, then an intro paragraph — always the body's first three blocks, by this site's own extraction convention (see docs/content-inventory.md). Marks all three as handled. */
  heroFields(fallbackTitle: string): { eyebrow?: string; title: string; intro?: string } {
    const [b0, b1, b2] = [this.at(0), this.at(1), this.at(2)];
    return {
      eyebrow: (b0.type === 'paragraph' && b0.text) || undefined,
      title: b1.type === 'heading' ? b1.text : fallbackTitle,
      intro: (b2.type === 'paragraph' && b2.text) || undefined,
    };
  }

  /** Marks and returns blocks[start:end] — for "everything from here to the end of the body" reads. */
  slice(start: number, end?: number): MdBlock[] {
    const result = this.blocks.slice(start, end);
    const stop = end ?? this.blocks.length;
    for (let i = start; i < stop; i++) this.handled[i] = true;
    return result;
  }

  /** Marks and returns every block under a named heading (wraps `section()`) — the heading itself included, since a section addressed by name should render that name somewhere, not just its contents. */
  section(headingText: string): MdBlock[] {
    const headingIdx = this.blocks.findIndex((b) => b.type === 'heading' && b.text === headingText);
    if (headingIdx === -1) {
      throw new Error(`BlockTracker: heading "${headingText}" not found in content body`);
    }
    this.handled[headingIdx] = true;
    const result = section(this.blocks, headingText);
    this.markMany(result);
    return result;
  }

  /** Marks one or more blocks already obtained some other way (e.g. `.find()` on a `.slice()`/`.section()` result) as accounted for — a no-op for tracking purposes beyond that, since they're already inside a marked range; exists so call sites can be explicit about which specific block they mean. */
  use(...items: (MdBlock | undefined | null)[]): void {
    this.markMany(items);
  }

  /** Marks a block as deliberately not rendered. `reason` isn't checked at runtime — it exists so the exclusion reads as a decision at the call site, not a silent gap. */
  exclude(item: MdBlock | undefined | null, _reason: string): void {
    this.markMany([item]);
  }

  /** Call once a page has finished pulling content out of the body. Throws, naming every block that was neither rendered nor explicitly excluded, so a future edit that adds an unhandled section fails the build instead of vanishing. */
  assertAllHandled(pageLabel: string): void {
    const missed = this.blocks.map((b, i) => ({ b, i })).filter(({ i }) => !this.handled[i]);
    if (missed.length === 0) return;
    const list = missed
      .map(({ b, i }) => `  [${i}] ${b.type}: ${JSON.stringify(b).slice(0, 120)}`)
      .join('\n');
    throw new Error(
      `${pageLabel}: ${missed.length} content block(s) from the source body were neither rendered nor explicitly excluded via .exclude():\n${list}`
    );
  }
}

// A heading whose entire text is one `[label](href)` link — this site's
// extraction convention for a linked section title (see
// src/content/pages/de/ueber-uns.md's two closing teaser headings).
export function parseLinkHeading(text: string): { label: string; href: string } | null {
  const m = ctaOnlyRe.exec(text);
  return m ? { label: m[1], href: m[2] } : null;
}

// Renders this site's own inline-markdown conventions (**bold**, *italic*,
// [text](href)) as HTML, for use with `set:html` — trusted, first-party
// content only (this file's own extracted/authored copy, never user
// input), same trust boundary already documented in
// src/content.config.ts for painPoints.heading. A tiny escape-then-replace
// pass, not a markdown parser: safe for this known, controlled content,
// not for arbitrary text.
export function mdInlineHtml(text: string): string {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
