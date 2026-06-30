import { RichText } from '@payloadcms/richtext-lexical/react'

import type { Article } from '@/payload-types'

export function ArticleBody({ content }: { content: Article['content'] }) {
  return (
    <div className="prose">
      <RichText data={content} />
    </div>
  )
}
