import 'dotenv/config'

import { getPayload } from 'payload'

import config from './src/payload.config'
import { up } from './src/migrations/20260902_120000_site_copy'

async function main() {
  const payload = await getPayload({ config })

  await up({ db: (payload.db as typeof payload.db & { drizzle: unknown }).drizzle } as never)

  const siteCopy = await payload.findGlobal({ slug: 'siteCopy' })
  if (!siteCopy.updatedAt) throw new Error('Verifica della tabella site_copy non riuscita')

  console.log('OK: migrazione site_copy applicata e verificata.')
  process.exit(0)
}

main().catch((error) => {
  console.error('ERRORE: migrazione site_copy non applicata.', error)
  process.exit(1)
})
