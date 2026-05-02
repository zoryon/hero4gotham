import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_background_container"
      ADD COLUMN IF NOT EXISTS "image_quality" numeric DEFAULT 95,
      ADD COLUMN IF NOT EXISTS "img_pos_m" varchar DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "img_pos_t" varchar DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "img_pos_d" varchar DEFAULT 'center';

    ALTER TABLE IF EXISTS "_pages_v_blocks_background_container"
      ADD COLUMN IF NOT EXISTS "image_quality" numeric DEFAULT 95,
      ADD COLUMN IF NOT EXISTS "img_pos_m" varchar DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "img_pos_t" varchar DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "img_pos_d" varchar DEFAULT 'center';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_background_container"
      DROP COLUMN IF EXISTS "image_quality",
      DROP COLUMN IF EXISTS "img_pos_m",
      DROP COLUMN IF EXISTS "img_pos_t",
      DROP COLUMN IF EXISTS "img_pos_d";

    ALTER TABLE IF EXISTS "_pages_v_blocks_background_container"
      DROP COLUMN IF EXISTS "image_quality",
      DROP COLUMN IF EXISTS "img_pos_m",
      DROP COLUMN IF EXISTS "img_pos_t",
      DROP COLUMN IF EXISTS "img_pos_d";
  `)
}
