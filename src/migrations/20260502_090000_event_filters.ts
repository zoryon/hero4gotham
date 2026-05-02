import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "activities"
      ADD COLUMN IF NOT EXISTS "short_name" varchar;

    WITH numbered AS (
      SELECT
        "id",
        row_number() OVER (ORDER BY "order" ASC NULLS LAST, "id" ASC) AS row_num
      FROM "activities"
      WHERE "short_name" IS NULL OR "short_name" = ''
    )
    UPDATE "activities"
    SET "short_name" = CASE ((numbered.row_num - 1) % 8)
      WHEN 0 THEN 'Spettacoli'
      WHEN 1 THEN 'Laboratori'
      WHEN 2 THEN 'Talk'
      WHEN 3 THEN 'Party'
      WHEN 4 THEN 'Speciali'
      WHEN 5 THEN 'Community'
      WHEN 6 THEN 'Kids'
      ELSE 'Notturni'
    END
    FROM numbered
    WHERE "activities"."id" = numbered."id";

    ALTER TABLE IF EXISTS "activities"
      ALTER COLUMN "short_name" SET NOT NULL;

    ALTER TABLE IF EXISTS "events"
      ADD COLUMN IF NOT EXISTS "activity_id" integer,
      ADD COLUMN IF NOT EXISTS "venue" varchar;

    CREATE INDEX IF NOT EXISTS "events_activity_idx" ON "events" USING btree ("activity_id");
    CREATE INDEX IF NOT EXISTS "events_venue_idx" ON "events" USING btree ("venue");

    DO $$
    BEGIN
      ALTER TABLE "events"
        ADD CONSTRAINT "events_activity_id_activities_id_fk"
        FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "event_filters" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "all_events_label" varchar DEFAULT 'Tutti gli eventi',
      "filter_by_label" varchar DEFAULT 'Filtra per:',
      "search_placeholder" varchar DEFAULT 'Cerca un evento...',
      "date_label" varchar DEFAULT 'Data',
      "type_label" varchar DEFAULT 'Tipo',
      "text_color" varchar DEFAULT '#f3eee5',
      "accent_color" varchar DEFAULT '#93b51f',
      "muted_color" varchar DEFAULT 'rgba(243,238,229,0.68)',
      "activity_text_style_font_family" varchar DEFAULT 'geistSans',
      "activity_text_style_font_weight" varchar DEFAULT 'black',
      "activity_text_style_font_style" varchar DEFAULT 'normal',
      "activity_text_style_vertical_scale" varchar DEFAULT 'normal',
      "activity_text_style_font_size_mobile" numeric DEFAULT 12,
      "activity_text_style_font_size_desktop" numeric DEFAULT 12,
      "activity_text_style_line_height" numeric DEFAULT 1,
      "activity_text_style_letter_spacing" varchar DEFAULT 'tight',
      "activity_text_style_text_transform" varchar DEFAULT 'uppercase',
      "activity_text_style_color_mode" varchar DEFAULT 'custom',
      "activity_text_style_color_global" varchar DEFAULT 'primary',
      "activity_text_style_color_custom" varchar DEFAULT '#f3eee5',
      "active_activity_text_style_font_family" varchar DEFAULT 'geistSans',
      "active_activity_text_style_font_weight" varchar DEFAULT 'black',
      "active_activity_text_style_font_style" varchar DEFAULT 'normal',
      "active_activity_text_style_vertical_scale" varchar DEFAULT 'normal',
      "active_activity_text_style_font_size_mobile" numeric DEFAULT 12,
      "active_activity_text_style_font_size_desktop" numeric DEFAULT 12,
      "active_activity_text_style_line_height" numeric DEFAULT 1,
      "active_activity_text_style_letter_spacing" varchar DEFAULT 'tight',
      "active_activity_text_style_text_transform" varchar DEFAULT 'uppercase',
      "active_activity_text_style_color_mode" varchar DEFAULT 'custom',
      "active_activity_text_style_color_global" varchar DEFAULT 'accent',
      "active_activity_text_style_color_custom" varchar DEFAULT '#93b51f',
      "control_text_style_font_family" varchar DEFAULT 'geistSans',
      "control_text_style_font_weight" varchar DEFAULT 'regular',
      "control_text_style_font_style" varchar DEFAULT 'normal',
      "control_text_style_vertical_scale" varchar DEFAULT 'normal',
      "control_text_style_font_size_mobile" numeric DEFAULT 14,
      "control_text_style_font_size_desktop" numeric DEFAULT 14,
      "control_text_style_line_height" numeric DEFAULT 1.15,
      "control_text_style_letter_spacing" varchar DEFAULT 'tight',
      "control_text_style_text_transform" varchar DEFAULT 'normal',
      "control_text_style_color_mode" varchar DEFAULT 'custom',
      "control_text_style_color_global" varchar DEFAULT 'primary',
      "control_text_style_color_custom" varchar DEFAULT '#f3eee5',
      "filter_label_text_style_font_family" varchar DEFAULT 'geistSans',
      "filter_label_text_style_font_weight" varchar DEFAULT 'black',
      "filter_label_text_style_font_style" varchar DEFAULT 'normal',
      "filter_label_text_style_vertical_scale" varchar DEFAULT 'normal',
      "filter_label_text_style_font_size_mobile" numeric DEFAULT 12,
      "filter_label_text_style_font_size_desktop" numeric DEFAULT 12,
      "filter_label_text_style_line_height" numeric DEFAULT 1,
      "filter_label_text_style_letter_spacing" varchar DEFAULT 'tight',
      "filter_label_text_style_text_transform" varchar DEFAULT 'uppercase',
      "filter_label_text_style_color_mode" varchar DEFAULT 'custom',
      "filter_label_text_style_color_global" varchar DEFAULT 'accent',
      "filter_label_text_style_color_custom" varchar DEFAULT '#93b51f',
      "activity_item_border" boolean DEFAULT false,
      "search_border" boolean DEFAULT false,
      "date_border" boolean DEFAULT false,
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

    CREATE INDEX IF NOT EXISTS "event_filters_order_idx" ON "event_filters" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "event_filters_parent_id_idx" ON "event_filters" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "event_filters_path_idx" ON "event_filters" USING btree ("_path");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "event_filters" CASCADE;

    ALTER TABLE IF EXISTS "events"
      DROP CONSTRAINT IF EXISTS "events_activity_id_activities_id_fk",
      DROP COLUMN IF EXISTS "activity_id",
      DROP COLUMN IF EXISTS "venue";

    ALTER TABLE IF EXISTS "activities"
      DROP COLUMN IF EXISTS "short_name";
  `)
}
