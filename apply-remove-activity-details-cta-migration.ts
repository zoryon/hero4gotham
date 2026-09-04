import 'dotenv/config'

import { sql } from '@payloadcms/db-postgres'
import { getPayload } from 'payload'

import config from './src/payload.config'
import { up } from './src/migrations/20260903_220000_remove_activity_details_cta'

async function main() {
  const payload = await getPayload({ config })
  const database = (
    payload.db as typeof payload.db & {
      drizzle: {
        execute: (query: unknown) => Promise<{ rows: Array<Record<string, unknown>> }>
      }
    }
  ).drizzle

  await up({ db: database } as never)

  const result = await database.execute(
    sql.raw(`
    SELECT COUNT(*)::integer AS remaining
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND (
        (table_name = 'activities' AND column_name IN ('cta', 'cta_image_id'))
        OR table_name IN ('activities_details', 'adg_details', '_adg_details_v')
        OR (
          table_name IN ('act_detail_grid', '_act_detail_grid_v', 'adg_acts', '_adg_acts_v')
          AND (
            column_name IN ('cta', 'cta_image_id')
            OR column_name LIKE 'detail_style_%'
            OR column_name LIKE 'cta_style_%'
          )
        )
      )
  `),
  )
  const remaining = Number(result.rows[0]?.remaining || 0)

  if (remaining !== 0) {
    throw new Error(`Sono rimasti ${remaining} campi o tabelle da rimuovere.`)
  }

  await payload.find({
    collection: 'activities',
    limit: 1,
    pagination: false,
    select: { title: true },
  })

  console.log('OK: dettagli e CTA delle attivita rimossi e verificati.')
  process.exit(0)
}

main().catch((error) => {
  console.error('ERRORE: migrazione di rimozione dettagli/CTA non applicata.', error)
  process.exit(1)
})
