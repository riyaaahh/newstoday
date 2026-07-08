import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import type { Plugin } from 'payload'
import { APIError, Forbidden } from 'payload'

import { SITE_URL } from '@/lib/locale'

type Args = {
  addRandomSuffix?: boolean
  cacheControlMaxAge?: number
  token: string
}

const CLIENT_UPLOAD_PATH = '/vercel-blob-client-upload-route'

/**
 * Patches the Payload Vercel Blob client-upload endpoint so `handleUpload` receives
 * an explicit `callbackUrl` from SITE_URL. Without it, Vercel Blob may reject browser
 * PUTs with CORS errors when NEXT_PUBLIC_SITE_URL is unset at build time.
 */
export const patchVercelBlobClientUpload =
  ({ addRandomSuffix, cacheControlMaxAge, token }: Args): Plugin =>
  (config) => {
    const endpoint = config.endpoints?.find((e) => e.path?.startsWith(CLIENT_UPLOAD_PATH))
    if (!endpoint) return config

    endpoint.handler = async (req) => {
      const body = (await req.json!()) as HandleUploadBody

      try {
        const jsonResponse = await handleUpload({
          body,
          onBeforeGenerateToken: async (_pathname, collectionSlug: null | string) => {
            if (!collectionSlug) {
              throw new APIError('No payload was provided')
            }

            if (!req.user) {
              throw new Forbidden()
            }

            return {
              addRandomSuffix,
              cacheControlMaxAge,
              callbackUrl: SITE_URL,
            }
          },
          onUploadCompleted: async () => {},
          request: req as Request,
          token,
        })

        return Response.json(jsonResponse)
      } catch (error) {
        req.payload.logger.error(error)
        throw new APIError('storage-vercel-blob client upload route error')
      }
    }

    return config
  }
