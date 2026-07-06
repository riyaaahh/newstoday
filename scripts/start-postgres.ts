import { existsSync } from 'node:fs'
import EmbeddedPostgres from 'embedded-postgres'

const databaseDir = new URL('../.pgdata', import.meta.url).pathname
const databaseName = 'malayalam_news'

const pg = new EmbeddedPostgres({
  databaseDir,
  user: 'postgres',
  password: 'password',
  port: 5432,
  persistent: true,
})

const start = async () => {
  if (!existsSync(`${databaseDir}/PG_VERSION`)) {
    await pg.initialise()
  }
  await pg.start()

  const client = pg.getPgClient()
  await client.connect()

  const existing = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [
    databaseName,
  ])

  if (existing.rowCount === 0) {
    await client.query(`CREATE DATABASE ${databaseName}`)
    console.log(`Created database "${databaseName}".`)
  } else {
    console.log(`Database "${databaseName}" already exists.`)
  }

  await client.end()

  console.log('PostgreSQL running at postgres://postgres:password@localhost:5432/malayalam_news')
  console.log('Press Ctrl+C to stop.')

  const shutdown = async () => {
    await pg.stop()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})
