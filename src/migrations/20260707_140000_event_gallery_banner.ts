import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "events_gallery"
      ADD COLUMN IF NOT EXISTS "is_banner" boolean DEFAULT false NOT NULL;

    WITH matching_banners AS (
      SELECT
        "events_gallery"."id",
        row_number() OVER (
          PARTITION BY "events_gallery"."_parent_id"
          ORDER BY "events_gallery"."_order", "events_gallery"."id"
        ) AS "match_number"
      FROM "events_gallery"
      INNER JOIN "events"
        ON "events"."id" = "events_gallery"."_parent_id"
       AND "events"."banner_id" = "events_gallery"."image_id"
      WHERE "events"."banner_id" IS NOT NULL
    )
    UPDATE "events_gallery"
    SET "is_banner" = true
    FROM "matching_banners"
    WHERE "events_gallery"."id" = "matching_banners"."id"
      AND "matching_banners"."match_number" = 1;

    INSERT INTO "events_gallery" (
      "_order",
      "_parent_id",
      "id",
      "image_id",
      "caption",
      "is_cover",
      "is_banner"
    )
    SELECT
      COALESCE((
        SELECT MAX("existing_gallery"."_order") + 1
        FROM "events_gallery" AS "existing_gallery"
        WHERE "existing_gallery"."_parent_id" = "events"."id"
      ), 0),
      "events"."id",
      'migrated-banner-' || "events"."id"::text,
      "events"."banner_id",
      NULL,
      false,
      true
    FROM "events"
    WHERE "events"."banner_id" IS NOT NULL
      AND NOT EXISTS (
        SELECT 1
        FROM "events_gallery"
        WHERE "events_gallery"."_parent_id" = "events"."id"
          AND "events_gallery"."image_id" = "events"."banner_id"
      );

    ALTER TABLE IF EXISTS "events"
      DROP CONSTRAINT IF EXISTS "events_banner_id_media_id_fk";

    DROP INDEX IF EXISTS "events_banner_idx";

    ALTER TABLE IF EXISTS "events"
      DROP COLUMN IF EXISTS "banner_id";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "events"
      ADD COLUMN IF NOT EXISTS "banner_id" integer;

    WITH selected_banners AS (
      SELECT
        "events_gallery"."_parent_id",
        "events_gallery"."image_id",
        row_number() OVER (
          PARTITION BY "events_gallery"."_parent_id"
          ORDER BY "events_gallery"."_order", "events_gallery"."id"
        ) AS "selection_number"
      FROM "events_gallery"
      WHERE "events_gallery"."is_banner" IS TRUE
    )
    UPDATE "events"
    SET "banner_id" = "selected_banners"."image_id"
    FROM "selected_banners"
    WHERE "events"."id" = "selected_banners"."_parent_id"
      AND "selected_banners"."selection_number" = 1;

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

    ALTER TABLE IF EXISTS "events_gallery"
      DROP COLUMN IF EXISTS "is_banner";
  `)
}
