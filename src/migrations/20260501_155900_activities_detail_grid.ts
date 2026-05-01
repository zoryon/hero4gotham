import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "act_detail_grid" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "heading" varchar DEFAULT 'Le nostre attività nel dettaglio',
      "heading_banner_image_id" integer,
      "heading_padding_x" numeric DEFAULT 34,
      "heading_padding_y" numeric DEFAULT 8,
      "heading_style_font_family" varchar DEFAULT 'cinzel',
      "heading_style_font_weight" varchar DEFAULT 'black',
      "heading_style_font_style" varchar DEFAULT 'normal',
      "heading_style_vertical_scale" varchar DEFAULT 'normal',
      "heading_style_font_size_mobile" numeric DEFAULT 16,
      "heading_style_font_size_desktop" numeric DEFAULT 22,
      "heading_style_line_height" numeric DEFAULT 1,
      "heading_style_letter_spacing" varchar DEFAULT 'wide',
      "heading_style_text_transform" varchar DEFAULT 'uppercase',
      "heading_style_color" varchar DEFAULT '#1b1b1b',
      "heading_style_max_width" numeric DEFAULT 520,
      "responsive_mobile_columns" numeric DEFAULT 1,
      "responsive_mobile_rows" numeric DEFAULT 8,
      "responsive_tablet_columns" numeric DEFAULT 1,
      "responsive_tablet_rows" numeric DEFAULT 8,
      "responsive_laptop_columns" numeric DEFAULT 2,
      "responsive_laptop_rows" numeric DEFAULT 4,
      "responsive_desktop_columns" numeric DEFAULT 2,
      "responsive_desktop_rows" numeric DEFAULT 4,
      "container_width" varchar DEFAULT 'wide',
      "cell_min_height" numeric DEFAULT 190,
      "content_padding" numeric DEFAULT 22,
      "image_fade_size" numeric DEFAULT 44,
      "grid_gap" numeric DEFAULT 0,
      "panel_bg" varchar,
      "divider_color" varchar,
      "layout_size" varchar DEFAULT 'default',
      "layout_margin_top" varchar DEFAULT 'default',
      "layout_margin_right" varchar DEFAULT 'default',
      "layout_margin_bottom" varchar DEFAULT 'default',
      "layout_margin_left" varchar DEFAULT 'default',
      "layout_padding_top" varchar DEFAULT 'none',
      "layout_padding_right" varchar DEFAULT 'none',
      "layout_padding_bottom" varchar DEFAULT 'none',
      "layout_padding_left" varchar DEFAULT 'none',
      "layout_scribble_border" boolean DEFAULT false,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "adg_acts" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "image_position" varchar DEFAULT 'left',
      "image_size" numeric DEFAULT 46,
      "title" varchar,
      "description" varchar,
      "cta" varchar,
      "cta_image_id" integer,
      "border" boolean DEFAULT false,
      "title_style_font_family" varchar DEFAULT 'cinzel',
      "title_style_font_weight" varchar DEFAULT 'black',
      "title_style_font_style" varchar DEFAULT 'normal',
      "title_style_vertical_scale" varchar DEFAULT 'normal',
      "title_style_font_size_mobile" numeric DEFAULT 16,
      "title_style_font_size_desktop" numeric DEFAULT 18,
      "title_style_line_height" numeric DEFAULT 1,
      "title_style_letter_spacing" varchar DEFAULT 'normal',
      "title_style_text_transform" varchar DEFAULT 'uppercase',
      "title_style_color" varchar DEFAULT '#90a434',
      "title_style_max_width" numeric DEFAULT 520,
      "description_style_font_family" varchar DEFAULT 'geistSans',
      "description_style_font_weight" varchar DEFAULT 'regular',
      "description_style_font_style" varchar DEFAULT 'normal',
      "description_style_vertical_scale" varchar DEFAULT 'normal',
      "description_style_font_size_mobile" numeric DEFAULT 12,
      "description_style_font_size_desktop" numeric DEFAULT 12,
      "description_style_line_height" numeric DEFAULT 1.35,
      "description_style_letter_spacing" varchar DEFAULT 'tight',
      "description_style_text_transform" varchar DEFAULT 'normal',
      "description_style_color" varchar DEFAULT '#f7f0df',
      "description_style_max_width" numeric DEFAULT 520,
      "detail_style_font_family" varchar DEFAULT 'geistSans',
      "detail_style_font_weight" varchar DEFAULT 'bold',
      "detail_style_font_style" varchar DEFAULT 'normal',
      "detail_style_vertical_scale" varchar DEFAULT 'normal',
      "detail_style_font_size_mobile" numeric DEFAULT 9,
      "detail_style_font_size_desktop" numeric DEFAULT 9,
      "detail_style_line_height" numeric DEFAULT 1.1,
      "detail_style_letter_spacing" varchar DEFAULT 'tight',
      "detail_style_text_transform" varchar DEFAULT 'uppercase',
      "detail_style_color" varchar DEFAULT '#d9d0c2',
      "detail_style_max_width" numeric DEFAULT 520,
      "cta_style_font_family" varchar DEFAULT 'cinzel',
      "cta_style_font_weight" varchar DEFAULT 'black',
      "cta_style_font_style" varchar DEFAULT 'normal',
      "cta_style_vertical_scale" varchar DEFAULT 'normal',
      "cta_style_font_size_mobile" numeric DEFAULT 10,
      "cta_style_font_size_desktop" numeric DEFAULT 10,
      "cta_style_line_height" numeric DEFAULT 1,
      "cta_style_letter_spacing" varchar DEFAULT 'tight',
      "cta_style_text_transform" varchar DEFAULT 'uppercase',
      "cta_style_color" varchar DEFAULT '#f7f0df',
      "cta_style_max_width" numeric DEFAULT 520
    );

    CREATE TABLE IF NOT EXISTS "adg_details" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "icon_id" integer,
      "text" varchar
    );

    CREATE INDEX IF NOT EXISTS "act_detail_grid_order_idx" ON "act_detail_grid" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "act_detail_grid_parent_id_idx" ON "act_detail_grid" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "act_detail_grid_path_idx" ON "act_detail_grid" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "act_detail_grid_heading_banner_image_idx" ON "act_detail_grid" USING btree ("heading_banner_image_id");

    CREATE INDEX IF NOT EXISTS "adg_acts_order_idx" ON "adg_acts" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "adg_acts_parent_id_idx" ON "adg_acts" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "adg_acts_image_idx" ON "adg_acts" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "adg_acts_cta_image_idx" ON "adg_acts" USING btree ("cta_image_id");

    CREATE INDEX IF NOT EXISTS "adg_details_order_idx" ON "adg_details" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "adg_details_parent_id_idx" ON "adg_details" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "adg_details_icon_idx" ON "adg_details" USING btree ("icon_id");

    DO $$
    BEGIN
      ALTER TABLE "act_detail_grid"
        ADD CONSTRAINT "act_detail_grid_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "act_detail_grid"
        ADD CONSTRAINT "act_detail_grid_heading_banner_image_id_media_id_fk"
        FOREIGN KEY ("heading_banner_image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "adg_acts"
        ADD CONSTRAINT "adg_acts_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "act_detail_grid"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "adg_acts"
        ADD CONSTRAINT "adg_acts_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
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
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "adg_details" CASCADE;
    DROP TABLE IF EXISTS "adg_acts" CASCADE;
    DROP TABLE IF EXISTS "act_detail_grid" CASCADE;
  `)
}
