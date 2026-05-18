import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "events"
      ADD COLUMN IF NOT EXISTS "banner_id" integer;

    CREATE INDEX IF NOT EXISTS "events_banner_idx"
      ON "events" USING btree ("banner_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'events_banner_id_media_id_fk'
      ) THEN
        ALTER TABLE "events"
          ADD CONSTRAINT "events_banner_id_media_id_fk"
          FOREIGN KEY ("banner_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "events"
      DROP CONSTRAINT IF EXISTS "events_banner_id_media_id_fk";

    DROP INDEX IF EXISTS "events_banner_idx";

    ALTER TABLE IF EXISTS "events"
      DROP COLUMN IF EXISTS "banner_id";
  `)
}
