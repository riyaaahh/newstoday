/** Safe blob/storage key segment — ASCII alphanumerics, dots, hyphens, underscores. */
export function sanitizeUploadFilename(name: string): string {
  const trimmed = name.trim()
  const lastDot = trimmed.lastIndexOf('.')
  const base = lastDot > 0 ? trimmed.slice(0, lastDot) : trimmed
  const ext = lastDot > 0 ? trimmed.slice(lastDot) : ''

  const safeBase = base
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')

  const safeExt = ext.toLowerCase().replace(/[^a-z0-9.]/g, '')
  const filename = `${safeBase || 'file'}${safeExt || ''}`

  return filename.slice(0, 180) || 'file'
}
