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
      category: z.string().optional(),
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
    }),
});

export const collections = { blog, events, site, pages };
