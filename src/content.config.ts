import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Both collections are organized on disk as <collection>/<locale>/<slug>.md
// (de/en/it) — this is also Decap CMS's own "multiple folders" i18n structure,
// so the file layout doubles as the CMS's translation UI. The locale isn't
// repeated in frontmatter: it's read off the file path (see src/i18n/utils.ts).

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      publishDate: z.date(),
      updatedDate: z.date().optional(),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      // Widened from a single string to a list (FIXES-2026-09-07.md task 3):
      // the live listing shows up to two categories per post
      // ("Beziehung & Kinderwunsch, Männer im Kinderwunsch"), which a single
      // string can't hold without losing one. Re-confirmed against each
      // post's own live page (its category tag links) — two posts needed a
      // second category added, and two needed the first category's own name
      // corrected ("Herausforderungen & Ressourcen" was missing "im
      // Kinderwunsch", present on the live tag).
      category: z.array(z.string()).optional(),
      draft: z.boolean().default(false),
      // Per-page SEO, kept separate from the on-page title/description so
      // either can be tuned independently for search/social.
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
    }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      startDate: z.date(),
      endDate: z.date().optional(),
      location: z.string(), // free text: "Wien", "Graz", "Online", or a street address
      isOnline: z.boolean().default(false),
      image: image().optional(),
      imageAlt: z.string().optional(),
      price: z.string().optional(),
      registrationUrl: z.string().url().optional(),
      draft: z.boolean().default(false),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
    }),
});

// Everything that isn't a blog post or event — nav labels, footer, and every
// homepage section — lives here as one JSON file per locale. This is the
// piece Decap CMS will eventually point its editor UI at, so your wife can
// change any site text (not just blog posts) without touching code.
const linkSchema = z.object({ label: z.string(), href: z.string() });

const site = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/site' }),
  schema: z.object({
    // "native": written/reviewed by a fluent speaker. "ai-draft": machine
    // translated, not yet proofread — surfaced as a banner on the page
    // (see src/components/DraftNotice.astro) until this is flipped.
    reviewStatus: z.enum(['native', 'ai-draft']),
    meta: z.object({ title: z.string(), description: z.string() }),
    nav: z.object({
      items: z.array(
        linkSchema.extend({ children: z.array(linkSchema).optional() })
      ),
      cta: z.string(),
      ctaHref: z.string(),
    }),
    hero: z.object({
      headline: z.string(),
      paragraphs: z.array(z.string()),
      cta: z.string(),
      ctaHref: z.string(),
    }),
    painPoints: z.object({
      eyebrow: z.string(),
      // Rendered with set:html — trusted, first-party content only, never
      // user input — so a stray <em> for emphasis (matching the original's
      // own markup) can survive instead of being flattened to plain text.
      heading: z.string(),
      paragraphs: z.array(z.string()),
      quotes: z.array(z.string()),
      closing: z.string(),
    }),
    services: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      items: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          href: z.string(),
          cta: z.string(),
        })
      ),
    }),
    philosophy: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      paragraphs: z.array(z.string()),
      values: z.array(z.object({ title: z.string(), description: z.string() })),
    }),
    founder: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      paragraphs: z.array(z.string()),
      cta: z.string(),
      href: z.string(),
      imageAlt: z.string(),
    }),
    newsletter: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      paragraphs: z.array(z.string()),
      cta: z.string(),
      ctaHref: z.string(),
    }),
    footer: z.object({
      tagline: z.string(),
      newsletterEyebrow: z.string(),
      newsletterCta: z.string(),
      columns: z.array(
        z.object({ title: z.string(), links: z.array(linkSchema) })
      ),
      copyright: z.string(),
    }),
    common: z.object({
      skipToContent: z.string(),
      readMore: z.string(),
      languageSwitcherLabel: z.string(),
      draftNotice: z.string(),
      blogFallbackNotice: z.string(),
    }),
  }),
});

// Standalone marketing/legal pages re-parsed verbatim from persephone.at
// (Phase 2). One file per page under pages/<locale>/<slug>.md, same
// disk/i18n convention as blog/events above. Body is the page's full copy as
// markdown (headings/paragraphs/lists/quotes preserved in source order,
// CTAs as ordinary markdown links carrying their target URL) — deliberately
// unstructured beyond that, since different pages need very different
// components once built; only the meta fields below are typed. Inline
// images live in the markdown body as standard ![alt](path) syntax, which
// Astro's content-collection markdown pipeline optimizes automatically as
// long as the path resolves to a real local file.
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(), // on-page <title>, verbatim from the live <title> tag
      description: z.string().optional(), // meta description, when the live page has one
      sourceUrl: z.string().url(), // the persephone.at URL this was extracted from
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      // Beratung only (RUN-2026-09-07.md Phase D1 / FIXES-2026-09-07.md
      // task 2c.1): the duration/location pill badges on each format card,
      // keyed by the format's own heading ("Einzelberatung"/"Paarberatung")
      // so beratung.astro's existing per-format derivation can look them up
      // directly. Real content re-extracted from the live page, not
      // rendered anywhere in the markdown body — a badge isn't prose, so it
      // doesn't belong in the flowing markdown the way this collection's
      // body otherwise deliberately stays unstructured (see the loader
      // comment above); this is the same kind of targeted, page-specific
      // typed field heroImage/heroImageAlt already are.
      formatBadges: z.record(z.string(), z.array(z.string())).optional(),
      // Angebote only (RUN-2026-09-07.md Phase D3 / FIXES-2026-09-07.md task
      // 2b.1): the ten-statement self-recognition selector's real data — a
      // response paragraph and a recommended-offer link per statement. This
      // is the page's central interaction; earlier sessions couldn't find it
      // because it's built by a client-side script whose *data* (not just
      // its rendered output) lives directly in the live page's raw HTML —
      // re-extracted from there 2026-09-07, not invented. Structured here
      // because it's genuinely structured data (ten objects with three
      // fields each), not prose a markdown body can hold.
      recognitionPanel: z
        .object({
          statements: z.array(
            z.object({
              text: z.string(),
              bridge: z.string(), // the response paragraph
              offer: z.string(), // key into `offers` below
            })
          ),
          offers: z.record(
            z.string(),
            z.object({
              title: z.string(),
              description: z.string(),
              cta: z.string(),
              href: z.string(),
            })
          ),
        })
        .optional(),
      // Selbsthilfegruppe only (RUN-2026-09-07.md Phase D4 / FIXES-2026-09-07.md
      // task 2e.2): the three principle columns' icon + bold label. The
      // sentence under each label is real content that already survived
      // extraction (still in the markdown body, in the same order as this
      // array); only the label and which icon illustrates it were missing
      // entirely from the content collection, read directly off the owner's
      // screenshot of the live page and confirmed against its raw HTML
      // (fa-shield-alt/fa-heart/fa-users).
      principles: z.array(z.object({ icon: z.string(), label: z.string() })).optional(),
    }),
});

export const collections = { blog, events, site, pages };
