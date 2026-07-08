import { RichText } from '@payloadcms/richtext-lexical/react'

import type { Article, Media } from '@/payload-types'

import { EmbedBlock } from './EmbedBlock'
import { MediaImage } from './MediaImage'

export function ArticleBody({ content }: { content: Article['content'] }) {
  return (
    <div className="prose">
      <RichText
        data={content}
        converters={({ defaultConverters }) => ({
          ...defaultConverters,
          // Render inline images uploaded into the body as optimized figures.
          upload: ({ node }: { node: { relationTo?: string; value: unknown } }) => {
            if (node.relationTo !== 'media' || typeof node.value !== 'object' || node.value === null)
              return null
            const media = node.value as Media
            return (
              <figure className="article-inline-image">
                <MediaImage media={media} sizes="(max-width: 800px) 100vw, 800px" />
                {media.alt && <figcaption>{media.alt}</figcaption>}
              </figure>
            )
          },
          blocks: {
            embed: ({ node }: { node: { fields: { url: string; caption?: string | null } } }) => (
              <EmbedBlock url={node.fields.url} caption={node.fields.caption} />
            ),
          },
        })}
      />
    </div>
  )
}
