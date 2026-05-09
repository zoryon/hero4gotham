import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_upcoming_events"
      ADD COLUMN IF NOT EXISTS "event_description_max_characters" numeric DEFAULT 140;

    ALTER TABLE IF EXISTS "_pages_v_blocks_upcoming_events"
      ADD COLUMN IF NOT EXISTS "event_description_max_characters" numeric DEFAULT 140;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_upcoming_events"
      DROP COLUMN IF EXISTS "event_description_max_characters";

    ALTER TABLE IF EXISTS "_pages_v_blocks_upcoming_events"
      DROP COLUMN IF EXISTS "event_description_max_characters";
  `)
}
