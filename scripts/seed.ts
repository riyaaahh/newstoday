import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../src/payload.config'

const lexical = (text: string) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [
      {
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        children: [
          { type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 },
        ],
      },
    ],
  },
})

const run = async () => {
  const payload = await getPayload({ config: await config })

  const existingUsers = await payload.find({ collection: 'users', limit: 1 })
  const user =
    existingUsers.docs[0] ??
    (await payload.create({
      collection: 'users',
      data: { name: 'Editor', email: 'editor@newstoday.test', password: 'password123' },
    }))

  // Bilingual category (create in ml, then add the en translation)
  const category = await payload.create({
    collection: 'categories',
    locale: 'ml',
    data: { name: 'കേരളം', slug: 'keralam' },
  })
  await payload.update({
    collection: 'categories',
    id: category.id,
    locale: 'en',
    data: { name: 'Kerala', slug: 'kerala' },
  })

  // Bilingual article
  const article = await payload.create({
    collection: 'articles',
    locale: 'ml',
    data: {
      title: 'കേരളത്തിൽ മഴ ശക്തമായി തുടരുന്നു',
      slug: 'kerala-mazha-sakthamayi',
      category: category.id,
      publishedAt: new Date().toISOString(),
      excerpt: 'സംസ്ഥാനത്തുടനീളം ശക്തമായ മഴ തുടരുന്നു; ജാഗ്രതാ നിർദേശം.',
      authors: [user.id],
      content: lexical(
        'കേരളത്തിൽ കനത്ത മഴ തുടരുകയാണ്. പല ജില്ലകളിലും യെല്ലോ അലർട്ട് പ്രഖ്യാപിച്ചു.',
      ),
      _status: 'published',
    },
  })
  await payload.update({
    collection: 'articles',
    id: article.id,
    locale: 'en',
    data: {
      title: 'Heavy rain continues to lash Kerala',
      slug: 'heavy-rain-lashes-kerala',
      excerpt: 'Intense rainfall continues across the state; a yellow alert is in place.',
      content: lexical(
        'Kerala continues to experience heavy rainfall. A yellow alert has been declared in several districts.',
      ),
      _status: 'published',
    },
  })

  console.log(JSON.stringify({ ok: true, userId: user.id, categoryId: category.id, articleId: article.id }))
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
