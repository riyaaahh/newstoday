import type { Plugin } from 'payload'

const CLIENT_UPLOAD_HANDLER = 'VercelBlobClientUploadHandler'
const CLIENT_UPLOAD_PATH = '/vercel-blob-client-upload-route'

function providerPath(provider: unknown): string {
  if (typeof provider === 'string') return provider
  if (provider && typeof provider === 'object' && 'path' in provider) {
    const path = (provider as { path?: unknown }).path
    return typeof path === 'string' ? path : ''
  }
  return ''
}

/**
 * Strips Vercel Blob browser-upload wiring so media always uploads through the server.
 * Client PUTs to vercel.com/api/blob fail with 400/CORS when tokens or pathnames
 * (e.g. filenames with spaces) do not match store expectations.
 */
export const disableBlobClientUploads: Plugin = (config) => {
  if (config.admin?.components?.providers) {
    config.admin.components.providers = config.admin.components.providers.filter(
      (provider) => !providerPath(provider).includes(CLIENT_UPLOAD_HANDLER),
    )
  }

  if (config.endpoints?.length) {
    config.endpoints = config.endpoints.filter(
      (endpoint) => !endpoint.path?.startsWith(CLIENT_UPLOAD_PATH),
    )
  }

  return config
}
