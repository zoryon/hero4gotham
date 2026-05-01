import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_torn_cards"
      DROP COLUMN IF EXISTS "background_mobile_id" CASCADE,
      DROP COLUMN IF EXISTS "background_tablet_id" CASCADE,
      DROP COLUMN IF EXISTS "background_desktop_id" CASCADE;

    ALTER TABLE IF EXISTS "_pages_v_blocks_torn_cards"
      DROP COLUMN IF EXISTS "background_mobile_id" CASCADE,
      DROP COLUMN IF EXISTS "background_tablet_id" CASCADE,
      DROP COLUMN IF EXISTS "background_desktop_id" CASCADE;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_torn_cards"
      ADD COLUMN IF NOT EXISTS "background_mobile_id" integer,
      ADD COLUMN IF NOT EXISTS "background_tablet_id" integer,
      ADD COLUMN IF NOT EXISTS "background_desktop_id" integer;

    ALTER TABLE IF EXISTS "_pages_v_blocks_torn_cards"
      ADD COLUMN IF NOT EXISTS "background_mobile_id" integer,
      ADD COLUMN IF NOT EXISTS "background_tablet_id" integer,
      ADD COLUMN IF NOT EXISTS "background_desktop_id" integer;
  `)
}
