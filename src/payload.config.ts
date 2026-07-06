import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Articles } from './collections/Articles'
import { Tags } from './collections/Tags'
import { Subscribers } from './collections/Subscribers'
import { PushSubscriptions } from './collections/PushSubscriptions'
import { Comments } from './collections/Comments'
import { Redirects } from './collections/Redirects'
import { EmbedBlock } from './blocks/Embed'
import { Homepage } from './globals/Homepage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Articles,
    Categories,
    Tags,
    Media,
    Subscribers,
    PushSubscriptions,
    Comments,
    Redirects,
    Users,
  ],
  globals: [Homepage],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, BlocksFeature({ blocks: [EmbedBlock] })],
  }),
  // Real SMTP in production (set SMTP_* env); falls back to console logging in dev.
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromName: 'NewsToday',
        defaultFromAddress: process.env.EMAIL_FROM || 'news@newstoday.test',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        },
      })
    : undefined,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || '',
    },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  // Media persists to Vercel Blob in production (ephemeral FS on serverless);
  // falls back to local disk in dev when BLOB_READ_WRITE_TOKEN is unset.
  plugins: process.env.BLOB_READ_WRITE_TOKEN
    ? [
        vercelBlobStorage({
          enabled: true,
          collections: { media: true },
          token: process.env.BLOB_READ_WRITE_TOKEN,
          // Upload straight from the browser to Blob so images aren't capped by
          // Vercel's ~4.5 MB serverless request-body limit.
          clientUploads: true,
        }),
      ]
    : [],
  sharp,
  localization: {
    locales: [
      { label: 'മലയാളം', code: 'ml' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'ml',
    fallback: true,
  },
})
