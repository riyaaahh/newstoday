import type { CollectionConfig } from 'payload'

import { isEditor, isStaff } from '../access/roles'
import { sanitizeUploadFilename } from '../lib/sanitizeUploadFilename'

function defaultAltFromFilename(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim()
  return base || 'Image'
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isEditor,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation, req }) => {
        if ((operation === 'create' || operation === 'update') && !data?.alt?.trim()) {
          const name = req.file?.name ?? (typeof data?.filename === 'string' ? data.filename : '')
          if (name) data!.alt = defaultAltFromFilename(name)
        }
      },
    ],
    beforeOperation: [
      ({ operation, req }) => {
        if ((operation === 'create' || operation === 'update') && req.file?.name) {
          req.file.name = sanitizeUploadFilename(req.file.name)
        }
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Defaults from the filename; edit for accessibility.' },
    },
  ],
  upload: true,
}
