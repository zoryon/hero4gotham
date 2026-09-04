import 'dotenv/config'

const main = async () => {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error('DATABASE_URL mancante nel file .env')
  }

  process.env.PAYLOAD_MIGRATING = 'true'

  const [{ sql }, { getPayload }, { default: config }, { up }] = await Promise.all([
    import('@payloadcms/db-postgres'),
    import('payload'),
    import('../src/payload.config'),
    import('../src/migrations/20260904_163000_event_seo_fields'),
  ])

  const payload = await getPayload({ config })

  try {
    await up({ db: payload.db.drizzle } as never)

    const result = await payload.db.drizzle.execute(sql`
      SELECT "column_name"
      FROM "information_schema"."columns"
      WHERE "table_name" = 'events'
        AND "column_name" IN ('meta_title', 'meta_description')
      ORDER BY "column_name";
    `)
    const columns = new Set(result.rows.map((row) => (row as { column_name: string }).column_name))

    if (!columns.has('meta_title') || !columns.has('meta_description')) {
      throw new Error('Verifica fallita: le colonne SEO non risultano presenti')
    }

    console.log('Migrazione SEO eventi completata: meta_title e meta_description presenti.')
  } finally {
    await payload.destroy()
  }
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Migrazione SEO eventi fallita: ${message}`)
  process.exitCode = 1
})
