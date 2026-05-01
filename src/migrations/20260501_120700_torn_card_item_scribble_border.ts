import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_torn_cards_items"
      ADD COLUMN IF NOT EXISTS "scribble_border" boolean DEFAULT false;

    ALTER TABLE IF EXISTS "_pages_v_blocks_torn_cards_items"
      ADD COLUMN IF NOT EXISTS "scribble_border" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_torn_cards_items"
      DROP COLUMN IF EXISTS "scribble_border";

    ALTER TABLE IF EXISTS "_pages_v_blocks_torn_cards_items"
      DROP COLUMN IF EXISTS "scribble_border";
  `)
}
