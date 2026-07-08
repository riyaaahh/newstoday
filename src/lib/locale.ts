export const locales = ['ml', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'ml'

export const localeLabels: Record<Locale, string> = {
  ml: 'മലയാളം',
  en: 'English',
}

export const otherLocale = (l: Locale): Locale => (l === 'ml' ? 'en' : 'ml')

/** Malayalam is the default locale and lives at the root with no prefix; English is under /en. */
export const localePrefix = (l: Locale): string => (l === defaultLocale ? '' : `/${l}`)

/** Build a public path for a locale: localePath('ml', '/kerala/foo') -> '/kerala/foo'; ('en', ...) -> '/en/kerala/foo'. */
export const localePath = (l: Locale, path = '/'): string => {
  const prefix = localePrefix(l)
  if (path === '/') return prefix || '/'
  return `${prefix}${path.startsWith('/') ? '' : '/'}${path}`
}

/** Canonical public origin — used by Payload admin, metadata, and Blob client-upload callbacks. */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (explicit) return explicit

  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/$/, '')
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, '')
  }

  return 'http://localhost:3000'
}

export const SITE_URL = resolveSiteUrl()

export const absoluteUrl = (path: string): string => `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`
