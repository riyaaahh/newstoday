import type { CollectionConfig } from 'payload'

import { isEditor } from '../access/roles'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  labels: { singular: 'Redirect', plural: 'Redirects' },
  admin: {
    useAsTitle: 'from',
    defaultColumns: ['from', 'to', 'permanent'],
    group: 'Settings',
    description: 'Redirect old URLs to new ones so links and SEO survive slug changes.',
  },
  access: {
    read: () => true,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    {
      name: 'from',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Path to match, e.g. /old-section/old-slug (include the leading slash).' },
    },
    {
      name: 'to',
      type: 'text',
      required: true,
      admin: { description: 'Destination path, e.g. /kerala/new-slug (must be an internal path).' },
      // Internal paths only — blocks open-redirect to external/phishing URLs.
      // "/foo" ok; "//evil.com" and "http://…" rejected.
      validate: (value: unknown) =>
        typeof value === 'string' && /^\/(?!\/)/.test(value)
          ? true
          : 'Must be an internal path starting with a single "/".',
    },
    {
      name: 'permanent',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Permanent (308) when checked, temporary (307) when not.' },
    },
  ],
}
