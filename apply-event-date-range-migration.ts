import 'dotenv/config'

import { getPayload } from 'payload'

import config from './src/payload.config'
import { up } from './src/migrations/20260903_200000_event_date_ranges'

async function main() {
  const payload = await getPayload({ config })

  await up({ db: (payload.db as typeof payload.db & { drizzle: unknown }).drizzle } as never)

  await payload.find({
    collection: 'events',
    limit: 1,
    pagination: false,
    select: { endsAt: true },
  })

  console.log('OK: migrazione degli intervalli evento applicata e verificata.')
  process.exit(0)
}

main().catch((error) => {
  console.error('ERRORE: migrazione degli intervalli evento non applicata.', error)
  process.exit(1)
})
