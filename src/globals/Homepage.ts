import type { GlobalConfig } from 'payload'

import { revalidateSite } from '../hooks/revalidate'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  admin: { group: 'Content' },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [() => revalidateSite()],
  },
  fields: [
    {
      name: 'leadArticle',
      type: 'relationship',
      relationTo: 'articles',
      admin: {
        description: 'The main hero story. Leave empty to auto-use the latest published article.',
      },
    },
    {
      name: 'featuredArticles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      admin: {
        description:
          'Curated stories for the featured row. Leave empty to auto-fill with the latest.',
      },
    },
  ],
}
