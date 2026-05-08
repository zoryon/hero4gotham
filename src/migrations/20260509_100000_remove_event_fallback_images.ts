import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    sql.raw(`
      ALTER TABLE IF EXISTS "events"
        DROP CONSTRAINT IF EXISTS "events_image_id_media_id_fk";

      DROP INDEX IF EXISTS "events_image_idx";

      ALTER TABLE IF EXISTS "events"
        DROP COLUMN IF EXISTS "image_id";

      DROP INDEX IF EXISTS "pages_blocks_featured_event_fallback_image_idx";
      DROP INDEX IF EXISTS "_pages_v_blocks_featured_event_fallback_image_idx";

      ALTER TABLE IF EXISTS "pages_blocks_featured_event"
        DROP COLUMN IF EXISTS "fallback_image_id";

      ALTER TABLE IF EXISTS "_pages_v_blocks_featured_event"
        DROP COLUMN IF EXISTS "fallback_image_id";
    `),
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw(`
      ALTER TABLE IF EXISTS "events"
        ADD COLUMN IF NOT EXISTS "image_id" integer;

      CREATE INDEX IF NOT EXISTS "events_image_idx" ON "events" USING btree ("image_id");

      DO $$ BEGIN
        ALTER TABLE "events"
          ADD CONSTRAINT "events_image_id_media_id_fk"
          FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      ALTER TABLE IF EXISTS "pages_blocks_featured_event"
        ADD COLUMN IF NOT EXISTS "fallback_image_id" integer;

      ALTER TABLE IF EXISTS "_pages_v_blocks_featured_event"
        ADD COLUMN IF NOT EXISTS "fallback_image_id" integer;

      CREATE INDEX IF NOT EXISTS "pages_blocks_featured_event_fallback_image_idx"
        ON "pages_blocks_featured_event" USING btree ("fallback_image_id");

      CREATE INDEX IF NOT EXISTS "_pages_v_blocks_featured_event_fallback_image_idx"
        ON "_pages_v_blocks_featured_event" USING btree ("fallback_image_id");
    `),
  )
}
