// Splits a content-collection entry's raw markdown body (Task 2's "pages"
// collection stores one flowing markdown body per page, deliberately
// unstructured — see src/content.config.ts) into an ordered list of blocks,
// so a page composing several distinct components (Task 3) can pull out
// "the paragraphs under this heading" or "this list" without duplicating
// the copy into separate typed frontmatter fields. Handles exactly the
// markdown shapes this site's own content actually uses — headings,
// paragraphs, `- ` lists, and a paragraph that's just a single
// `[label](href)` link (this site's convention for a CTA) — not a general
// markdown parser.

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
    if (chunk.split('\n').every((line) => /^-\s+/.test(line.trim()))) {
      blocks.push({
        type: 'list',
        items: chunk.split('\n').map((line) => line.trim().replace(/^-\s+/, '')),
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

// Returns every paragraph/list immediately following a given heading text,
// stopping at the next heading of any level. Throws if the heading isn't
// found, since a missing section means the page and its content collection
// entry have drifted out of sync — better to fail the build than render a
// silently-empty section.
export function section(blocks: MdBlock[], headingText: string): MdBlock[] {
  const start = blocks.findIndex((b) => b.type === 'heading' && b.text === headingText);
  if (start === -1) {
    throw new Error(`parseMarkdownBlocks: heading "${headingText}" not found in content body`);
  }
  const rest = blocks.slice(start + 1);
  const end = rest.findIndex((b) => b.type === 'heading');
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
