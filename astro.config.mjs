// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Hosting decided 2026-09-13 (docs/decisions.md): easyname, real domain
  // persephone.at (already owned, moved there — this was never a "pick a new
  // domain" question, only "where does it point"). Set here even while the
  // build is staged on neu.persephone.at ahead of cutover: canonical URLs
  // should already point at the real future domain, not the staging one —
  // see public/robots.txt's Sitemap line, which had the same placeholder and
  // needed the same fix, since it doesn't derive from this value.
  site: 'https://persephone.at',

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

  integrations: [
    sitemap({
      // FIXES-2026-09-07.md task 4: EN/IT are unreviewed machine
      // translations (a legal problem for a regulated professional title,
      // not a cosmetic one — see the task's own reasoning) and must not be
      // discoverable until the owner has read them line by line. Excluded
      // from the sitemap entirely; BaseLayout.astro adds `noindex` to every
      // page under these locales as the second half of the same decision.
      filter: (page) => !/\/(en|it)\//.test(new URL(page).pathname),
    }),
  ],

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
