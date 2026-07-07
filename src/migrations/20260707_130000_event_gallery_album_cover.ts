import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "events_gallery"
      ADD COLUMN IF NOT EXISTS "is_cover" boolean DEFAULT false NOT NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "events_gallery"
      DROP COLUMN IF EXISTS "is_cover";
  `)
}
