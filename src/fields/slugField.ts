import type { Field } from 'payload'

import { slugify } from '../lib/slugify'

/**
 * Localized slug field that auto-fills from a source field (default: `title`)
 * when left blank, so non-technical editors never have to craft URLs by hand.
 * Localized => each language gets its own slug (e.g. ml slug vs en slug),
 * which is what the hreflang alternates on the frontend rely on.
 */
export const slugField = (from = 'title', opts: { localized?: boolean } = {}): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  localized: opts.localized ?? true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'URL identifier. Auto-generated from the title — edit only if needed.',
  },
  hooks: {
    beforeValidate: [
      ({ value, siblingData }) => {
        if (typeof value === 'string' && value.trim().length > 0) return slugify(value)
        const source = (siblingData as Record<string, unknown>)?.[from]
        if (typeof source === 'string' && source.trim().length > 0) return slugify(source)
        return value
      },
    ],
  },
})
