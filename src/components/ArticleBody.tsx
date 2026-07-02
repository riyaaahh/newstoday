import { RichText } from '@payloadcms/richtext-lexical/react'

import type { Article } from '@/payload-types'

import { EmbedBlock } from './EmbedBlock'

export function ArticleBody({ content }: { content: Article['content'] }) {
  return (
    <div className="prose">
      <RichText
        data={content}
        converters={({ defaultConverters }) => ({
          ...defaultConverters,
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
