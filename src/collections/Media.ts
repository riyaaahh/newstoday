import type { CollectionConfig } from 'payload'

import { isEditor, isStaff } from '../access/roles'
import { sanitizeUploadFilename } from '../lib/sanitizeUploadFilename'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isEditor,
  },
  hooks: {
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
    },
  ],
  upload: true,
}
