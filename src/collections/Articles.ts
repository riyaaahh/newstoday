import type { CollectionConfig } from 'payload'

import { canManageOwnArticle, isEditor, isStaff } from '../access/roles'
import { slugField } from '../fields/slugField'
import { revalidateSite } from '../hooks/revalidate'
import { sendBreakingPush } from '../lib/push'

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
    create: isStaff,
    update: canManageOwnArticle,
    delete: isEditor,
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        // On create, add the creator as an author if none set, so authors can
        // always edit their own drafts (update access is scoped to own articles).
        if (operation === 'create' && req.user && (!data.authors || data.authors.length === 0)) {
          data.authors = [req.user.id]
        }
        // Authors submit for review; only editors/admins publish.
        const role = (req.user as { role?: string } | undefined)?.role
        if (role === 'author' && data?._status === 'published') {
          data._status = 'draft'
        }
        return data
      },
    ],
    // Only revalidate for public-facing changes — skip the ~375ms draft autosaves.
    afterChange: [
      ({ doc, previousDoc }) => {
        if (doc?._status === 'published' || previousDoc?._status === 'published') {
          revalidateSite()
        }
      },
      // Send a breaking-news push the moment a breaking article is first published.
      ({ doc, previousDoc, req }) => {
        const nowPublished =
          doc?._status === 'published' && previousDoc?._status !== 'published'
        if (nowPublished && doc?.breaking && doc?.id) {
          void sendBreakingPush(req.payload, doc.id)
        }
      },
    ],
    afterDelete: [
      ({ doc }) => {
        if (doc?._status === 'published') revalidateSite()
      },
    ],
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
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Eligible for the featured row on the homepage.',
      },
    },
    {
      name: 'breaking',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show in the breaking-news banner across the site.',
      },
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Total page views (tracked automatically).',
      },
    },
    {
      name: 'sponsored',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Label as sponsored / paid content.' },
    },
    {
      name: 'premium',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Subscriber-only (metered paywall).' },
    },
    {
      name: 'hasVideo',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Include in the Videos hub.' },
    },
    {
      name: 'isLive',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Live blog — shows a LIVE badge and updates.' },
    },
    {
      name: 'liveUpdates',
      type: 'array',
      admin: { condition: (data) => Boolean(data?.isLive) },
      fields: [
        {
          name: 'time',
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
        { name: 'title', type: 'text', localized: true },
        { name: 'body', type: 'textarea', required: true, localized: true },
      ],
    },
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
