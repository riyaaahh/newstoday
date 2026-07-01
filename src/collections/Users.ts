import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slugField'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'slug'],
  },
  auth: true,
  fields: [
    // Email + auth added by default
    { name: 'name', type: 'text', required: true },
    slugField('name', { localized: false }),
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: { description: 'Designation shown on bylines, e.g. Senior Reporter.' },
    },
    { name: 'bio', type: 'textarea', localized: true },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
  ],
  versions: false,
}
