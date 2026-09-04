import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const dropRemovedStyleColumns = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    DROP COLUMN IF EXISTS "detail_style_font_family",
    DROP COLUMN IF EXISTS "detail_style_font_weight",
    DROP COLUMN IF EXISTS "detail_style_font_style",
    DROP COLUMN IF EXISTS "detail_style_vertical_scale",
    DROP COLUMN IF EXISTS "detail_style_font_size_mobile",
    DROP COLUMN IF EXISTS "detail_style_font_size_desktop",
    DROP COLUMN IF EXISTS "detail_style_line_height",
    DROP COLUMN IF EXISTS "detail_style_letter_spacing",
    DROP COLUMN IF EXISTS "detail_style_text_transform",
    DROP COLUMN IF EXISTS "detail_style_color",
    DROP COLUMN IF EXISTS "detail_style_max_width",
    DROP COLUMN IF EXISTS "cta_style_font_family",
    DROP COLUMN IF EXISTS "cta_style_font_weight",
    DROP COLUMN IF EXISTS "cta_style_font_style",
    DROP COLUMN IF EXISTS "cta_style_vertical_scale",
    DROP COLUMN IF EXISTS "cta_style_font_size_mobile",
    DROP COLUMN IF EXISTS "cta_style_font_size_desktop",
    DROP COLUMN IF EXISTS "cta_style_line_height",
    DROP COLUMN IF EXISTS "cta_style_letter_spacing",
    DROP COLUMN IF EXISTS "cta_style_text_transform",
    DROP COLUMN IF EXISTS "cta_style_color",
    DROP COLUMN IF EXISTS "cta_style_max_width";
`

const restoreRemovedStyleColumns = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    ADD COLUMN IF NOT EXISTS "detail_style_font_family" "ff" DEFAULT 'geistSans',
    ADD COLUMN IF NOT EXISTS "detail_style_font_weight" "fw" DEFAULT 'bold',
    ADD COLUMN IF NOT EXISTS "detail_style_font_style" "fst" DEFAULT 'normal',
    ADD COLUMN IF NOT EXISTS "detail_style_vertical_scale" "vs" DEFAULT 'normal',
    ADD COLUMN IF NOT EXISTS "detail_style_font_size_mobile" numeric DEFAULT 9,
    ADD COLUMN IF NOT EXISTS "detail_style_font_size_desktop" numeric DEFAULT 9,
    ADD COLUMN IF NOT EXISTS "detail_style_line_height" numeric DEFAULT 1.1,
    ADD COLUMN IF NOT EXISTS "detail_style_letter_spacing" "ls" DEFAULT 'tight',
    ADD COLUMN IF NOT EXISTS "detail_style_text_transform" "tt" DEFAULT 'uppercase',
    ADD COLUMN IF NOT EXISTS "detail_style_color" varchar DEFAULT '#d9d0c2',
    ADD COLUMN IF NOT EXISTS "detail_style_max_width" numeric DEFAULT 520,
    ADD COLUMN IF NOT EXISTS "cta_style_font_family" "ff" DEFAULT 'cinzel',
    ADD COLUMN IF NOT EXISTS "cta_style_font_weight" "fw" DEFAULT 'black',
    ADD COLUMN IF NOT EXISTS "cta_style_font_style" "fst" DEFAULT 'normal',
    ADD COLUMN IF NOT EXISTS "cta_style_vertical_scale" "vs" DEFAULT 'normal',
    ADD COLUMN IF NOT EXISTS "cta_style_font_size_mobile" numeric DEFAULT 10,
    ADD COLUMN IF NOT EXISTS "cta_style_font_size_desktop" numeric DEFAULT 10,
    ADD COLUMN IF NOT EXISTS "cta_style_line_height" numeric DEFAULT 1,
    ADD COLUMN IF NOT EXISTS "cta_style_letter_spacing" "ls" DEFAULT 'tight',
    ADD COLUMN IF NOT EXISTS "cta_style_text_transform" "tt" DEFAULT 'uppercase',
    ADD COLUMN IF NOT EXISTS "cta_style_color" varchar DEFAULT '#f7f0df',
    ADD COLUMN IF NOT EXISTS "cta_style_max_width" numeric DEFAULT 520;
`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "activities_details" CASCADE;
    DROP TABLE IF EXISTS "adg_details" CASCADE;
    DROP TABLE IF EXISTS "_adg_details_v" CASCADE;

    ALTER TABLE IF EXISTS "activities"
      DROP COLUMN IF EXISTS "cta",
      DROP COLUMN IF EXISTS "cta_image_id";

    ALTER TABLE IF EXISTS "adg_acts"
      DROP COLUMN IF EXISTS "cta",
      DROP COLUMN IF EXISTS "cta_image_id";

    ALTER TABLE IF EXISTS "_adg_acts_v"
      DROP COLUMN IF EXISTS "cta",
      DROP COLUMN IF EXISTS "cta_image_id";
  `)

  await db.execute(sql.raw(dropRemovedStyleColumns('act_detail_grid')))
  await db.execute(sql.raw(dropRemovedStyleColumns('_act_detail_grid_v')))
  await db.execute(sql.raw(dropRemovedStyleColumns('adg_acts')))
  await db.execute(sql.raw(dropRemovedStyleColumns('_adg_acts_v')))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "activities"
      ADD COLUMN IF NOT EXISTS "cta" varchar,
      ADD COLUMN IF NOT EXISTS "cta_image_id" integer;

    ALTER TABLE IF EXISTS "adg_acts"
      ADD COLUMN IF NOT EXISTS "cta" varchar,
      ADD COLUMN IF NOT EXISTS "cta_image_id" integer;

    ALTER TABLE IF EXISTS "_adg_acts_v"
      ADD COLUMN IF NOT EXISTS "cta" varchar,
      ADD COLUMN IF NOT EXISTS "cta_image_id" integer;
  `)

  await db.execute(sql.raw(restoreRemovedStyleColumns('act_detail_grid')))
  await db.execute(sql.raw(restoreRemovedStyleColumns('_act_detail_grid_v')))
  await db.execute(sql.raw(restoreRemovedStyleColumns('adg_acts')))
  await db.execute(sql.raw(restoreRemovedStyleColumns('_adg_acts_v')))

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "activities_details" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "icon_id" integer,
      "text" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "adg_details" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "icon_id" integer,
      "text" varchar
    );

    CREATE TABLE IF NOT EXISTS "_adg_details_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "icon_id" integer,
      "text" varchar,
      "_uuid" varchar
    );

    CREATE INDEX IF NOT EXISTS "activities_cta_image_idx"
      ON "activities" USING btree ("cta_image_id");
    CREATE INDEX IF NOT EXISTS "adg_acts_cta_image_idx"
      ON "adg_acts" USING btree ("cta_image_id");
    CREATE INDEX IF NOT EXISTS "_adg_acts_v_cta_image_idx"
      ON "_adg_acts_v" USING btree ("cta_image_id");

    CREATE INDEX IF NOT EXISTS "activities_details_order_idx"
      ON "activities_details" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "activities_details_parent_id_idx"
      ON "activities_details" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "activities_details_icon_idx"
      ON "activities_details" USING btree ("icon_id");

    CREATE INDEX IF NOT EXISTS "adg_details_order_idx"
      ON "adg_details" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "adg_details_parent_id_idx"
      ON "adg_details" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "adg_details_icon_idx"
      ON "adg_details" USING btree ("icon_id");

    CREATE INDEX IF NOT EXISTS "_adg_details_v_order_idx"
      ON "_adg_details_v" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_adg_details_v_parent_id_idx"
      ON "_adg_details_v" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_adg_details_v_icon_idx"
      ON "_adg_details_v" USING btree ("icon_id");

    DO $$
    BEGIN
      ALTER TABLE "activities"
        ADD CONSTRAINT "activities_cta_image_id_media_id_fk"
        FOREIGN KEY ("cta_image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "adg_acts"
        ADD CONSTRAINT "adg_acts_cta_image_id_media_id_fk"
        FOREIGN KEY ("cta_image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "_adg_acts_v"
        ADD CONSTRAINT "_adg_acts_v_cta_image_id_media_id_fk"
        FOREIGN KEY ("cta_image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "activities_details"
        ADD CONSTRAINT "activities_details_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "activities_details"
        ADD CONSTRAINT "activities_details_icon_id_media_id_fk"
        FOREIGN KEY ("icon_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "adg_details"
        ADD CONSTRAINT "adg_details_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "adg_acts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "adg_details"
        ADD CONSTRAINT "adg_details_icon_id_media_id_fk"
        FOREIGN KEY ("icon_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "_adg_details_v"
        ADD CONSTRAINT "_adg_details_v_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_adg_acts_v"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "_adg_details_v"
        ADD CONSTRAINT "_adg_details_v_icon_id_media_id_fk"
        FOREIGN KEY ("icon_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)
}
