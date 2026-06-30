import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../src/payload.config'

/**
 * Initializes Payload once, which (in non-production mode) pushes the current
 * schema to the database. Used in CI before `next build` so build-time rendering
 * can query existing tables. Run with default NODE_ENV (development).
 */
const run = async () => {
  await getPayload({ config: await config })
  console.log('Database schema pushed.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
