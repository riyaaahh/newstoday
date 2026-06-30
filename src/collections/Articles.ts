import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slugField'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Article', plural: 'Articles' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    group: 'Content',
  },
  access: {
    // Public can read; drafts are filtered out at query time on the frontend.
    read: () => true,
  },
  versions: {
    drafts: {
      autosave: { interval: 375 },
      schedulePublish: true,
    },
    maxPerDoc: 25,
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'publishedAt',
          type: 'date',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayAndTime' },
            description: 'Used for ordering and the article timestamp.',
          },
        },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Short summary for listings, social cards, and the meta description fallback.',
      },
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText', required: true, localized: true },
    { name: 'authors', type: 'relationship', relationTo: 'users', hasMany: true },
    {
      type: 'group',
      name: 'meta',
      label: 'SEO',
      admin: { description: 'Optional overrides. Falls back to the title / excerpt above.' },
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
