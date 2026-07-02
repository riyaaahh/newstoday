import type { Block } from 'payload'

export const EmbedBlock: Block = {
  slug: 'embed',
  interfaceName: 'EmbedBlock',
  labels: { singular: 'Embed', plural: 'Embeds' },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: { description: 'YouTube / Vimeo / social post URL.' },
    },
    { name: 'caption', type: 'text', localized: true },
  ],
}
