import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../src/payload.config'

/**
 * Run migrations during Vercel build. Prefer a direct (non-pooler) URL when Neon
 * provides one — DDL through PgBouncer pooled connections can fail.
 */
const resolveMigrateUrl = (): string | undefined =>
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL

const run = async () => {
  const connectionString = resolveMigrateUrl()
  if (!connectionString) {
    console.error(
      [
        'No database URL found for migrations.',
        'In Vercel: Project → Storage → add Neon Postgres, or set DATABASE_URL under Environment Variables.',
        'Checked: POSTGRES_URL_NON_POOLING, DATABASE_URL_UNPOOLED, DATABASE_URL, POSTGRES_URL',
      ].join('\n'),
    )
    process.exit(1)
  }

  if (!process.env.PAYLOAD_SECRET) {
    console.error(
      'PAYLOAD_SECRET is not set. Add it under Vercel → Project → Settings → Environment Variables.',
    )
    process.exit(1)
  }

  process.env.DATABASE_URL = connectionString

  const payload = await getPayload({ config: await config })
  await payload.db.migrate()
  console.log('Migrations complete.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
