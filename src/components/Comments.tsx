import { formatDate, t } from '@/lib/i18n'
import type { Locale } from '@/lib/locale'
import { getApprovedComments } from '@/lib/queries'

import { CommentForm } from './CommentForm'

export async function Comments({ locale, articleId }: { locale: Locale; articleId: number }) {
  const comments = await getApprovedComments(articleId)

  return (
    <section className="comments">
      <h2 className="section-title">
        {t(locale, 'comments')} {comments.length > 0 && <span>({comments.length})</span>}
      </h2>
      <CommentForm
        articleId={articleId}
        labels={{
          name: t(locale, 'yourName'),
          comment: t(locale, 'yourComment'),
          post: t(locale, 'postComment'),
          pending: t(locale, 'commentPending'),
          error: t(locale, 'commentError'),
        }}
      />
      {comments.length === 0 ? (
        <p className="empty">{t(locale, 'noComments')}</p>
      ) : (
        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c.id} className="comment">
              <div className="comment-head">
                <span className="comment-author">{c.authorName}</span>
                <time className="comment-date" dateTime={c.createdAt}>
                  {formatDate(locale, c.createdAt)}
                </time>
              </div>
              <p className="comment-body">{c.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
