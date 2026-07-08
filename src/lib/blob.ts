/** Dummy token shape for `pnpm generate:importmap` only — never use in production. */
export const BLOB_TOKEN_IMPORTMAP_PLACEHOLDER =
  'vercel_blob_rw_buildtimegen_0000000000000000000000000000'

const PLACEHOLDER_MARKERS = ['buildtimegen', 'importmap'] as const

/** Must match the Blob store type — private stores reject put({ access: 'public' }). */
export function resolveBlobAccess(): 'public' | 'private' {
  if (process.env.BLOB_ACCESS === 'public') return 'public'
  if (process.env.BLOB_ACCESS === 'private') return 'private'
  // New Vercel Blob stores default to private.
  if (process.env.VERCEL) return 'private'
  return 'public'
}

/** Real Vercel Blob token from Storage → Blob, or undefined when uploads use local disk. */
export function resolveBlobToken(): string | undefined {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return undefined

  const isPlaceholder = PLACEHOLDER_MARKERS.some((marker) => token.includes(marker))
  if (!isPlaceholder) return token

  // Import-map generation only needs the plugin shape; no real Blob uploads occur.
  if (process.env.PAYLOAD_GENERATE_IMPORTMAP === 'true') return token

  if (process.env.VERCEL === '1') {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN is a placeholder, not a real Vercel Blob token. ' +
        'In Vercel Dashboard → Storage → create or connect a Blob store to this project, ' +
        'then redeploy.',
    )
  }

  // Dev without Blob uses local disk.
  return undefined
}
