/** Dummy token shape for `pnpm generate:importmap` only — never use in production. */
export const BLOB_TOKEN_IMPORTMAP_PLACEHOLDER =
  'vercel_blob_rw_buildtimegen_0000000000000000000000000000'

const PLACEHOLDER_MARKERS = ['buildtimegen', 'importmap'] as const

/** Real Vercel Blob token from Storage → Blob, or undefined when uploads use local disk. */
export function resolveBlobToken(): string | undefined {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return undefined

  const isPlaceholder = PLACEHOLDER_MARKERS.some((marker) => token.includes(marker))
  if (!isPlaceholder) return token

  if (process.env.VERCEL === '1') {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN is a placeholder, not a real Vercel Blob token. ' +
        'In Vercel Dashboard → Storage → create or connect a Blob store to this project, ' +
        'then redeploy.',
    )
  }

  // Local import-map generation needs the plugin enabled; dev without Blob uses local disk.
  return process.env.PAYLOAD_GENERATE_IMPORTMAP === 'true' ? token : undefined
}
