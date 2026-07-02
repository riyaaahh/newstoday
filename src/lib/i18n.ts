import type { Locale } from './locale'

const dict = {
  ml: {
    latest: 'പുതിയ വാർത്തകൾ',
    sections: 'വിഭാഗങ്ങൾ',
    empty: 'ലേഖനങ്ങൾ ഉടൻ വരുന്നു.',
    readMore: 'കൂടുതൽ വായിക്കുക',
    by: 'എഴുതിയത്',
    home: 'ഹോം',
    breaking: 'ബ്രേക്കിംഗ്',
    relatedNews: 'അനുബന്ധ വാർത്തകൾ',
    search: 'തിരയുക',
    searchPlaceholder: 'വാർത്തകൾ തിരയുക…',
    noResults: 'ഫലങ്ങളൊന്നും കണ്ടെത്തിയില്ല.',
    tag: 'ടാഗ്',
    moreFrom: 'കൂടുതൽ',
    share: 'പങ്കിടുക',
    copy: 'ലിങ്ക് പകർത്തുക',
    copied: 'പകർത്തി!',
    newsletterTitle: 'വാർത്തകൾ ഇൻബോക്സിൽ',
    newsletterCta: 'ദിവസവും പ്രധാന വാർത്തകൾ ഇമെയിലിൽ ലഭിക്കാൻ വരിക്കാരാകൂ.',
    emailPlaceholder: 'നിങ്ങളുടെ ഇമെയിൽ',
    subscribe: 'വരിക്കാരാകൂ',
    subscribed: 'നന്ദി! വരിക്കാരായി.',
    subscribeError: 'ക്ഷമിക്കണം, എന്തോ പിഴച്ചു.',
    consentText: 'അനുഭവം മെച്ചപ്പെടുത്താൻ ഞങ്ങൾ കുക്കികൾ ഉപയോഗിക്കുന്നു.',
    accept: 'സമ്മതിക്കുന്നു',
    decline: 'വേണ്ട',
    mostRead: 'കൂടുതൽ വായിക്കപ്പെട്ടവ',
    enableAlerts: 'ബ്രേക്കിംഗ് അലേർട്ടുകൾ',
    alertsOn: 'അലേർട്ടുകൾ ഓണാണ്',
    alertsBlocked: 'അലേർട്ടുകൾ തടഞ്ഞു',
  },
  en: {
    latest: 'Latest',
    sections: 'Sections',
    empty: 'Articles coming soon.',
    readMore: 'Read more',
    by: 'By',
    home: 'Home',
    breaking: 'Breaking',
    relatedNews: 'Related news',
    search: 'Search',
    searchPlaceholder: 'Search news…',
    noResults: 'No results found.',
    tag: 'Tag',
    moreFrom: 'More from',
    share: 'Share',
    copy: 'Copy link',
    copied: 'Copied!',
    newsletterTitle: 'News in your inbox',
    newsletterCta: 'Subscribe to get the top stories by email every day.',
    emailPlaceholder: 'Your email',
    subscribe: 'Subscribe',
    subscribed: 'Thanks! You’re subscribed.',
    subscribeError: 'Sorry, something went wrong.',
    consentText: 'We use cookies to improve your experience.',
    accept: 'Accept',
    decline: 'Decline',
    mostRead: 'Most read',
    enableAlerts: 'Breaking alerts',
    alertsOn: 'Alerts on',
    alertsBlocked: 'Alerts blocked',
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
