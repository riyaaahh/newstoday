import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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
  collections: [Articles, Categories, Tags, Media, Subscribers, Users],
  globals: [Homepage],
  editor: lexicalEditor(),
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
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
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
