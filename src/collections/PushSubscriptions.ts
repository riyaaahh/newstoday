import type { CollectionConfig } from 'payload'

import { isEditor } from '../access/roles'
import { isAllowedPushEndpoint } from '../lib/push'

export const PushSubscriptions: CollectionConfig = {
  slug: 'push-subscriptions',
  labels: { singular: 'Push subscription', plural: 'Push subscriptions' },
  admin: {
    useAsTitle: 'endpoint',
    defaultColumns: ['endpoint', 'locale', 'createdAt'],
    group: 'Audience',
    hidden: true, // machine data, not something editors curate
  },
  access: {
    create: () => true, // browsers register their own subscription
    // Rows hold push credentials — restrict to editors/admins, not every author.
    read: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    {
      name: 'endpoint',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      // SSRF guard: only accept endpoints on known push-service hosts. Applies to
      // the custom route AND direct REST create (create access is public).
      validate: (value: unknown) =>
        isAllowedPushEndpoint(value) ? true : 'Unrecognized push endpoint host.',
    },
    { name: 'p256dh', type: 'text', required: true },
    { name: 'auth', type: 'text', required: true },
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
