import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "activities" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "description" varchar,
      "image_id" integer,
      "cta" varchar,
      "cta_image_id" integer,
      "order" numeric DEFAULT 0,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "activities_details" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "icon_id" integer,
      "text" varchar
    );

    CREATE INDEX IF NOT EXISTS "activities_image_idx" ON "activities" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "activities_cta_image_idx" ON "activities" USING btree ("cta_image_id");
    CREATE INDEX IF NOT EXISTS "activities_order_idx" ON "activities" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "activities_updated_at_idx" ON "activities" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "activities_created_at_idx" ON "activities" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "activities_details_order_idx" ON "activities_details" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "activities_details_parent_id_idx" ON "activities_details" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "activities_details_icon_idx" ON "activities_details" USING btree ("icon_id");

    DO $$
    BEGIN
      ALTER TABLE "activities"
        ADD CONSTRAINT "activities_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "activities"
        ADD CONSTRAINT "activities_cta_image_id_media_id_fk"
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

    ALTER TABLE IF EXISTS "act_detail_grid"
      ADD COLUMN IF NOT EXISTS "source" varchar DEFAULT 'automatic',
      ADD COLUMN IF NOT EXISTS "automatic_image_position" varchar DEFAULT 'left',
      ADD COLUMN IF NOT EXISTS "automatic_image_size" numeric DEFAULT 46,
      ADD COLUMN IF NOT EXISTS "automatic_border" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "automatic_limit" numeric DEFAULT 8,
      ADD COLUMN IF NOT EXISTS "title_style_font_family" varchar DEFAULT 'cinzel',
      ADD COLUMN IF NOT EXISTS "title_style_font_weight" varchar DEFAULT 'black',
      ADD COLUMN IF NOT EXISTS "title_style_font_style" varchar DEFAULT 'normal',
      ADD COLUMN IF NOT EXISTS "title_style_vertical_scale" varchar DEFAULT 'normal',
      ADD COLUMN IF NOT EXISTS "title_style_font_size_mobile" numeric DEFAULT 16,
      ADD COLUMN IF NOT EXISTS "title_style_font_size_desktop" numeric DEFAULT 18,
      ADD COLUMN IF NOT EXISTS "title_style_line_height" numeric DEFAULT 1,
      ADD COLUMN IF NOT EXISTS "title_style_letter_spacing" varchar DEFAULT 'normal',
      ADD COLUMN IF NOT EXISTS "title_style_text_transform" varchar DEFAULT 'uppercase',
      ADD COLUMN IF NOT EXISTS "title_style_color" varchar DEFAULT '#90a434',
      ADD COLUMN IF NOT EXISTS "title_style_max_width" numeric DEFAULT 520,
      ADD COLUMN IF NOT EXISTS "description_style_font_family" varchar DEFAULT 'geistSans',
      ADD COLUMN IF NOT EXISTS "description_style_font_weight" varchar DEFAULT 'regular',
      ADD COLUMN IF NOT EXISTS "description_style_font_style" varchar DEFAULT 'normal',
      ADD COLUMN IF NOT EXISTS "description_style_vertical_scale" varchar DEFAULT 'normal',
      ADD COLUMN IF NOT EXISTS "description_style_font_size_mobile" numeric DEFAULT 12,
      ADD COLUMN IF NOT EXISTS "description_style_font_size_desktop" numeric DEFAULT 12,
      ADD COLUMN IF NOT EXISTS "description_style_line_height" numeric DEFAULT 1.35,
      ADD COLUMN IF NOT EXISTS "description_style_letter_spacing" varchar DEFAULT 'tight',
      ADD COLUMN IF NOT EXISTS "description_style_text_transform" varchar DEFAULT 'normal',
      ADD COLUMN IF NOT EXISTS "description_style_color" varchar DEFAULT '#f7f0df',
      ADD COLUMN IF NOT EXISTS "description_style_max_width" numeric DEFAULT 520,
      ADD COLUMN IF NOT EXISTS "detail_style_font_family" varchar DEFAULT 'geistSans',
      ADD COLUMN IF NOT EXISTS "detail_style_font_weight" varchar DEFAULT 'bold',
      ADD COLUMN IF NOT EXISTS "detail_style_font_style" varchar DEFAULT 'normal',
      ADD COLUMN IF NOT EXISTS "detail_style_vertical_scale" varchar DEFAULT 'normal',
      ADD COLUMN IF NOT EXISTS "detail_style_font_size_mobile" numeric DEFAULT 9,
      ADD COLUMN IF NOT EXISTS "detail_style_font_size_desktop" numeric DEFAULT 9,
      ADD COLUMN IF NOT EXISTS "detail_style_line_height" numeric DEFAULT 1.1,
      ADD COLUMN IF NOT EXISTS "detail_style_letter_spacing" varchar DEFAULT 'tight',
      ADD COLUMN IF NOT EXISTS "detail_style_text_transform" varchar DEFAULT 'uppercase',
      ADD COLUMN IF NOT EXISTS "detail_style_color" varchar DEFAULT '#d9d0c2',
      ADD COLUMN IF NOT EXISTS "detail_style_max_width" numeric DEFAULT 520,
      ADD COLUMN IF NOT EXISTS "cta_style_font_family" varchar DEFAULT 'cinzel',
      ADD COLUMN IF NOT EXISTS "cta_style_font_weight" varchar DEFAULT 'black',
      ADD COLUMN IF NOT EXISTS "cta_style_font_style" varchar DEFAULT 'normal',
      ADD COLUMN IF NOT EXISTS "cta_style_vertical_scale" varchar DEFAULT 'normal',
      ADD COLUMN IF NOT EXISTS "cta_style_font_size_mobile" numeric DEFAULT 10,
      ADD COLUMN IF NOT EXISTS "cta_style_font_size_desktop" numeric DEFAULT 10,
      ADD COLUMN IF NOT EXISTS "cta_style_line_height" numeric DEFAULT 1,
      ADD COLUMN IF NOT EXISTS "cta_style_letter_spacing" varchar DEFAULT 'tight',
      ADD COLUMN IF NOT EXISTS "cta_style_text_transform" varchar DEFAULT 'uppercase',
      ADD COLUMN IF NOT EXISTS "cta_style_color" varchar DEFAULT '#f7f0df',
      ADD COLUMN IF NOT EXISTS "cta_style_max_width" numeric DEFAULT 520;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "activities_details" CASCADE;
    DROP TABLE IF EXISTS "activities" CASCADE;

    ALTER TABLE IF EXISTS "act_detail_grid"
      DROP COLUMN IF EXISTS "source",
      DROP COLUMN IF EXISTS "automatic_image_position",
      DROP COLUMN IF EXISTS "automatic_image_size",
      DROP COLUMN IF EXISTS "automatic_border",
      DROP COLUMN IF EXISTS "automatic_limit";
  `)
}
