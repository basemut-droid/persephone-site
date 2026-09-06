// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: replace with the real production domain once it's decided (persephone.at or a subdomain).
  site: 'https://persephone.example',

  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en', 'it'],
    routing: {
      // German stays unprefixed at "/", matching the current live site's URLs.
      prefixDefaultLocale: false,
    },
    // Note: untranslated-content fallback is handled per-section in the
    // templates (see HomePage.astro's blog-teaser query) rather than via
    // Astro's built-in whole-page i18n fallback — the brief asks for a
    // visible "not translated yet, here's the German version" notice, not
    // a silent redirect/rewrite to a different URL.
  },

  integrations: [sitemap()],

  // NIGHT-RUN.md Phase 3.7 / OPEN-QUESTIONS.md #2: the live site has no
  // real /newsletter/ page — "e-Brief abonnieren" 301-redirects straight
  // to an external MailerLite form. src/pages/newsletter.astro used to
  // carry a full page of copy that was invented during an earlier
  // session (never sourced from the live site); this redirect matches
  // the live site's actual behavior instead, with nothing invented.
  // Astro generates a static HTML page with a meta-refresh + canonical
  // link for this route, which works under any static host.
  redirects: {
    '/newsletter': 'https://preview.mailerlite.io/forms/1771229/164345144764532398/share',
  },
});
