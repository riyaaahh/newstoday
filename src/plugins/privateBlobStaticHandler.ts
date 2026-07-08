import type { CollectionConfig, Plugin } from 'payload'
import { get } from '@vercel/blob'

/**
 * Payload's default Vercel Blob staticHandler fetches blob URLs without auth.
 * That fails for private stores. Replace handlers with authenticated `get()`.
 */
export const privateBlobStaticHandler: Plugin = (config) => {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  // Only needed when using a private store (this project's current setup).
  if (!token || process.env.BLOB_ACCESS === 'public') return config

  return {
    ...config,
    collections: (config.collections || []).map((collection) => {
      if (collection.slug !== 'media') return collection
      if (!collection.upload || typeof collection.upload !== 'object') return collection

      return {
        ...collection,
        upload: {
          ...collection.upload,
          // Replace — do not append after Payload's unauthenticated handler.
          handlers: [
            async (req, { params: { filename, prefix } }) => {
              if (!filename || typeof filename !== 'string') {
                return new Response('Not Found', { status: 404 })
              }

              const name = decodeURIComponent(filename)
              const pathname =
                typeof prefix === 'string' && prefix.length > 0
                  ? `${prefix.replace(/\/$/, '')}/${name}`
                  : name

              try {
                const result = await get(pathname, {
                  access: 'private',
                  token,
                })

                if (!result) {
                  return new Response('Not Found', { status: 404 })
                }

                if (result.statusCode === 304 || !result.stream) {
                  return new Response(null, { status: 304 })
                }

                return new Response(result.stream, {
                  headers: {
                    'Cache-Control': 'public, max-age=31536000, immutable',
                    'Content-Type': result.blob.contentType || 'application/octet-stream',
                    'Content-Disposition': result.blob.contentDisposition || `inline; filename="${name}"`,
                    'X-Content-Type-Options': 'nosniff',
                  },
                })
              } catch (err) {
                req.payload.logger.error({ err, msg: 'privateBlobStaticHandler failed', pathname })
                return new Response('Internal Server Error', { status: 500 })
              }
            },
          ],
        },
      } satisfies CollectionConfig
    }),
  }
}
