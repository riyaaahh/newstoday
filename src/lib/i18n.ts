import type { Locale } from './locale'

const dict = {
  ml: {
    latest: 'പുതിയ വാർത്തകൾ',
    sections: 'വിഭാഗങ്ങൾ',
    empty: 'ലേഖനങ്ങൾ ഉടൻ വരുന്നു.',
    readMore: 'കൂടുതൽ വായിക്കുക',
    by: 'എഴുതിയത്',
    home: 'ഹോം',
  },
  en: {
    latest: 'Latest',
    sections: 'Sections',
    empty: 'Articles coming soon.',
    readMore: 'Read more',
    by: 'By',
    home: 'Home',
  },
} as const

type Key = keyof (typeof dict)['en']

export const t = (locale: Locale, key: Key): string => dict[locale][key]

export const formatDate = (locale: Locale, value?: string | null): string => {
  if (!value) return ''
  return new Intl.DateTimeFormat(locale === 'ml' ? 'ml-IN' : 'en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value))
}
