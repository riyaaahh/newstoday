import type { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Subscriber', plural: 'Subscribers' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'locale', 'createdAt'],
    group: 'Audience',
  },
  access: {
    create: () => true, // public signup
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
      // Normalize regardless of entry path (custom route or direct REST create),
      // so case variants can't evade the unique constraint.
      hooks: {
        beforeValidate: [({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value)],
      },
    },
    {
      name: 'locale',
      type: 'select',
      defaultValue: 'ml',
      options: [
        { label: 'Malayalam', value: 'ml' },
        { label: 'English', value: 'en' },
      ],
    },
  ],
}
