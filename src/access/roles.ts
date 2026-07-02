import type { Access, FieldAccess } from 'payload'

export type Role = 'admin' | 'editor' | 'author'

const roleOf = (user: unknown): Role | undefined =>
  (user as { role?: Role } | undefined)?.role

export const isAdmin: Access = ({ req }) => roleOf(req.user) === 'admin'

export const isEditor: Access = ({ req }) => {
  const r = roleOf(req.user)
  return r === 'admin' || r === 'editor'
}

export const isStaff: Access = ({ req }) => Boolean(req.user)

/** Authors may manage only their own articles; editors/admins any. */
export const canManageOwnArticle: Access = ({ req }) => {
  if (!req.user) return false
  const r = roleOf(req.user)
  if (r === 'admin' || r === 'editor') return true
  return { authors: { contains: req.user.id } }
}

/** Only admins can set/change a role. */
export const isAdminField: FieldAccess = ({ req }) => roleOf(req.user) === 'admin'
