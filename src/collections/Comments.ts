import type { CollectionConfig } from 'payload'

import { isEditor, isEditorField } from '../access/roles'

export const Comments: CollectionConfig = {
  slug: 'comments',
  labels: { singular: 'Comment', plural: 'Comments' },
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'article', 'approved', 'createdAt'],
    group: 'Engagement',
  },
  access: {
    // Public posts go through /api/submit-comment (local API + validation);
    // block direct REST/GraphQL creates so they can't skip that gate.
    create: () => false,
    // Public only sees approved comments; staff sees all (for moderation).
    read: ({ req }) => (req.user ? true : { approved: { equals: true } }),
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    { name: 'article', type: 'relationship', relationTo: 'articles', required: true, index: true },
    { name: 'authorName', type: 'text', required: true, maxLength: 80 },
    { name: 'body', type: 'textarea', required: true, maxLength: 2000 },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
      // Public create can't self-approve; only editors flip this.
      access: { create: isEditorField, update: isEditorField },
    },
  ],
}
