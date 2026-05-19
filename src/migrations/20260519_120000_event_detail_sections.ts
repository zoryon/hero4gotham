import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "events"
      ADD COLUMN IF NOT EXISTS "long_description" varchar;

    CREATE TABLE IF NOT EXISTS "events_timeline" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "time" varchar,
      "title" varchar,
      "description" varchar
    );

    CREATE TABLE IF NOT EXISTS "events_artists_and_guests" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "first_name" varchar,
      "last_name" varchar,
      "description" varchar,
      "photo_id" integer
    );

    CREATE TABLE IF NOT EXISTS "events_useful_info" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "icon_id" integer,
      "title" varchar,
      "description" varchar
    );

    CREATE INDEX IF NOT EXISTS "events_timeline_order_idx"
      ON "events_timeline" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "events_timeline_parent_id_idx"
      ON "events_timeline" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "events_artists_and_guests_order_idx"
      ON "events_artists_and_guests" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "events_artists_and_guests_parent_id_idx"
      ON "events_artists_and_guests" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "events_artists_and_guests_photo_idx"
      ON "events_artists_and_guests" USING btree ("photo_id");

    CREATE INDEX IF NOT EXISTS "events_useful_info_order_idx"
      ON "events_useful_info" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "events_useful_info_parent_id_idx"
      ON "events_useful_info" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "events_useful_info_icon_idx"
      ON "events_useful_info" USING btree ("icon_id");

    DO $$
    BEGIN
      ALTER TABLE "events_timeline"
        ADD CONSTRAINT "events_timeline_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "events_artists_and_guests"
        ADD CONSTRAINT "events_artists_and_guests_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "events_artists_and_guests"
        ADD CONSTRAINT "events_artists_and_guests_photo_id_media_id_fk"
        FOREIGN KEY ("photo_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "events_useful_info"
        ADD CONSTRAINT "events_useful_info_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "events_useful_info"
        ADD CONSTRAINT "events_useful_info_icon_id_media_id_fk"
        FOREIGN KEY ("icon_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "events_useful_info" CASCADE;
    DROP TABLE IF EXISTS "events_artists_and_guests" CASCADE;
    DROP TABLE IF EXISTS "events_timeline" CASCADE;

    ALTER TABLE IF EXISTS "events"
      DROP COLUMN IF EXISTS "long_description";
  `)
}
