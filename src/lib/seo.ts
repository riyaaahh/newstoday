import type { Metadata } from 'next'

import { absoluteUrl, defaultLocale, locales, localePath, type Locale } from './locale'

/**
 * Builds canonical + hreflang alternates for a page that exists in every locale.
 * `pathByLocale` maps each locale to its locale-relative path (e.g. '/kerala/foo').
 */
export function buildAlternates(
  currentLocale: Locale,
  pathByLocale: Record<Locale, string>,
): NonNullable<Metadata['alternates']> {
  const languages: Record<string, string> = {}
  for (const l of locales) languages[l] = absoluteUrl(localePath(l, pathByLocale[l]))
  languages['x-default'] = absoluteUrl(localePath(defaultLocale, pathByLocale[defaultLocale]))
  return {
    canonical: absoluteUrl(localePath(currentLocale, pathByLocale[currentLocale])),
    languages,
  }
}
