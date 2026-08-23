import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "act_detail_grid"
      ADD COLUMN IF NOT EXISTS "image_darkness" numeric DEFAULT 25;

    ALTER TABLE IF EXISTS "_act_detail_grid_v"
      ADD COLUMN IF NOT EXISTS "image_darkness" numeric DEFAULT 25;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "_act_detail_grid_v"
      DROP COLUMN IF EXISTS "image_darkness";

    ALTER TABLE IF EXISTS "act_detail_grid"
      DROP COLUMN IF EXISTS "image_darkness";
  `)
}
