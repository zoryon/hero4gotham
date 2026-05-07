import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_featured_event"
      ADD COLUMN IF NOT EXISTS "background_image_id" integer;

    ALTER TABLE IF EXISTS "_pages_v_blocks_featured_event"
      ADD COLUMN IF NOT EXISTS "background_image_id" integer;

    CREATE INDEX IF NOT EXISTS "pages_blocks_featured_event_background_image_idx"
      ON "pages_blocks_featured_event" USING btree ("background_image_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_featured_event_background_image_idx"
      ON "_pages_v_blocks_featured_event" USING btree ("background_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "_pages_v_blocks_featured_event_background_image_idx";
    DROP INDEX IF EXISTS "pages_blocks_featured_event_background_image_idx";

    ALTER TABLE IF EXISTS "_pages_v_blocks_featured_event"
      DROP COLUMN IF EXISTS "background_image_id";

    ALTER TABLE IF EXISTS "pages_blocks_featured_event"
      DROP COLUMN IF EXISTS "background_image_id";
  `)
}
