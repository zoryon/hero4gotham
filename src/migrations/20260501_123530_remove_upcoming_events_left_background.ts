import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_upcoming_events"
      DROP COLUMN IF EXISTS "left_background_id" CASCADE;

    ALTER TABLE IF EXISTS "_pages_v_blocks_upcoming_events"
      DROP COLUMN IF EXISTS "left_background_id" CASCADE;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_upcoming_events"
      ADD COLUMN IF NOT EXISTS "left_background_id" integer;

    ALTER TABLE IF EXISTS "_pages_v_blocks_upcoming_events"
      ADD COLUMN IF NOT EXISTS "left_background_id" integer;
  `)
}
