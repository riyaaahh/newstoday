import { SiteHeader } from '@/components/SiteHeader'
import { t } from '@/lib/i18n'
import type { Locale } from '@/lib/locale'
import { getCategories } from '@/lib/queries'

const copy: Record<Locale, string[]> = {
  ml: [
    'ന്യൂസ് ടുഡേ നിങ്ങളുടെ സ്വകാര്യതയെ ബഹുമാനിക്കുന്നു. ഈ പേജ് ഞങ്ങൾ ശേഖരിക്കുന്ന വിവരങ്ങളും അവയുടെ ഉപയോഗവും വിശദീകരിക്കുന്നു.',
    'കുക്കികൾ: നിങ്ങളുടെ സമ്മതത്തോടെ മാത്രമേ അനലിറ്റിക്‌സ്, പരസ്യ കുക്കികൾ ഉപയോഗിക്കൂ. സൈറ്റ് പ്രവർത്തനത്തിന് ആവശ്യമായ അടിസ്ഥാന കുക്കികൾ ഒഴികെ.',
    'വാർത്താക്കുറിപ്പ്: വരിക്കാരാകുമ്പോൾ നൽകുന്ന ഇമെയിൽ വാർത്തകൾ അയക്കാൻ മാത്രം ഉപയോഗിക്കുന്നു. എപ്പോൾ വേണമെങ്കിലും അൺസബ്‌സ്‌ക്രൈബ് ചെയ്യാം.',
    'അഭിപ്രായങ്ങൾ: നിങ്ങൾ നൽകുന്ന പേരും അഭിപ്രായവും അവലോകനത്തിന് ശേഷം പ്രസിദ്ധീകരിക്കാം.',
    'ചോദ്യങ്ങൾക്ക്: news@newstoday.test എന്ന വിലാസത്തിൽ ബന്ധപ്പെടുക.',
  ],
  en: [
    'NewsToday respects your privacy. This page explains what we collect and how it is used.',
    'Cookies: analytics and advertising cookies load only with your consent. Basic cookies required for the site to function are exempt.',
    'Newsletter: the email you provide when subscribing is used only to send you news. You can unsubscribe at any time.',
    'Comments: the name and comment you submit may be published after moderation.',
    'Contact: for any questions, reach us at news@newstoday.test.',
  ],
}

export async function PrivacyView({ locale }: { locale: Locale }) {
  const categories = await getCategories(locale)

  return (
    <>
      <SiteHeader locale={locale} categories={categories} altPath="/privacy" />
      <main className="container article-page">
        <h1 className="article-title">{t(locale, 'privacy')}</h1>
        <div className="prose">
          {copy[locale].map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </main>
    </>
  )
}
