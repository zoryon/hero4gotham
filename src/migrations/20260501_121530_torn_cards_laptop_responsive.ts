import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_torn_cards"
      ADD COLUMN IF NOT EXISTS "responsive_laptop_columns" numeric DEFAULT 3,
      ADD COLUMN IF NOT EXISTS "responsive_laptop_rows" numeric DEFAULT 2;

    ALTER TABLE IF EXISTS "_pages_v_blocks_torn_cards"
      ADD COLUMN IF NOT EXISTS "responsive_laptop_columns" numeric DEFAULT 3,
      ADD COLUMN IF NOT EXISTS "responsive_laptop_rows" numeric DEFAULT 2;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_torn_cards"
      DROP COLUMN IF EXISTS "responsive_laptop_columns",
      DROP COLUMN IF EXISTS "responsive_laptop_rows";

    ALTER TABLE IF EXISTS "_pages_v_blocks_torn_cards"
      DROP COLUMN IF EXISTS "responsive_laptop_columns",
      DROP COLUMN IF EXISTS "responsive_laptop_rows";
  `)
}
