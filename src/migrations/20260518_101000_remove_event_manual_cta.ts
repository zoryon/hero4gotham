import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "events"
      DROP COLUMN IF EXISTS "link_type",
      DROP COLUMN IF EXISTS "link_new_tab",
      DROP COLUMN IF EXISTS "link_url",
      DROP COLUMN IF EXISTS "link_label";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "events"
      ADD COLUMN IF NOT EXISTS "link_type" varchar,
      ADD COLUMN IF NOT EXISTS "link_new_tab" boolean,
      ADD COLUMN IF NOT EXISTS "link_url" varchar,
      ADD COLUMN IF NOT EXISTS "link_label" varchar;
  `)
}
