import { getRelativeLocaleUrl } from 'astro:i18n';
import { getEntry } from 'astro:content';

export const locales = ['de', 'en', 'it'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
  it: 'Italiano',
};

/** Loads this page's slice of src/content/site/<locale>.json. */
export async function getSiteContent(locale: Locale) {
  const entry = await getEntry('site', locale);
  if (!entry) {
    throw new Error(
      `Missing src/content/site/${locale}.json — every locale needs a matching file.`
    );
  }
  return entry.data;
}

/**
 * Builds the equivalent URL for `locale`, given the current page's pathname.
 * Strips whichever locale prefix (if any) is already on the path, so the
 * language switcher lands on the SAME page in the target language instead
 * of bouncing back to that language's homepage.
 */
export function localizedPath(currentPath: string, locale: Locale): string {
  const stripped = currentPath.replace(/^\/(en|it)(\/|$)/, '/');
  return getRelativeLocaleUrl(locale, stripped);
}
