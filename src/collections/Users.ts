import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminField, isStaff } from '../access/roles'
import { slugField } from '../fields/slugField'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'slug'],
  },
  auth: true,
  access: {
    create: isAdmin,
    read: isStaff,
    update: ({ req, id }) => {
      if (!req.user) return false
      if ((req.user as { role?: string }).role === 'admin') return true
      return req.user.id === id // non-admins may only edit themselves
    },
    delete: isAdmin,
  },
  fields: [
    // Email + auth added by default
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'author',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Author', value: 'author' },
      ],
      access: { create: isAdminField, update: isAdminField },
      admin: { position: 'sidebar' },
    },
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
