import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "events_gallery" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "caption" varchar
    );

    CREATE INDEX IF NOT EXISTS "events_gallery_order_idx"
      ON "events_gallery" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "events_gallery_parent_id_idx"
      ON "events_gallery" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "events_gallery_image_idx"
      ON "events_gallery" USING btree ("image_id");

    DO $$
    BEGIN
      ALTER TABLE "events_gallery"
        ADD CONSTRAINT "events_gallery_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "events_gallery"
        ADD CONSTRAINT "events_gallery_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    INSERT INTO "events_gallery" ("_order", "_parent_id", "id", "image_id", "caption")
    SELECT 0, "events"."id", 'legacy-' || "events"."id"::text, "events"."image_id", NULL
    FROM "events"
    WHERE "events"."image_id" IS NOT NULL
      AND NOT EXISTS (
        SELECT 1
        FROM "events_gallery"
        WHERE "events_gallery"."_parent_id" = "events"."id"
      );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "events_gallery" CASCADE;
  `)
}
