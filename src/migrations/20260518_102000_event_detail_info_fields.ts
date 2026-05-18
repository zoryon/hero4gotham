import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "events"
      ADD COLUMN IF NOT EXISTS "venue_address" varchar,
      ADD COLUMN IF NOT EXISTS "audience" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "events"
      DROP COLUMN IF EXISTS "venue_address",
      DROP COLUMN IF EXISTS "audience";
  `)
}
