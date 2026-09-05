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
});
