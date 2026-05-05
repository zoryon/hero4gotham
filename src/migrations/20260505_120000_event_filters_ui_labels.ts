import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "event_filters"
      ADD COLUMN IF NOT EXISTS "venue_label" varchar DEFAULT 'Luogo',
      ADD COLUMN IF NOT EXISTS "all_venues_label" varchar DEFAULT 'Tutti i luoghi',
      ADD COLUMN IF NOT EXISTS "type_border" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "venue_border" boolean DEFAULT false;

    ALTER TABLE IF EXISTS "event_filters"
      ALTER COLUMN "type_label" SET DEFAULT 'Tipologia';

    ALTER TABLE IF EXISTS "event_filters"
      DROP COLUMN IF EXISTS "activity_item_border",
      DROP COLUMN IF EXISTS "activity_text_style_font_family",
      DROP COLUMN IF EXISTS "activity_text_style_font_weight",
      DROP COLUMN IF EXISTS "activity_text_style_font_style",
      DROP COLUMN IF EXISTS "activity_text_style_vertical_scale",
      DROP COLUMN IF EXISTS "activity_text_style_font_size_mobile",
      DROP COLUMN IF EXISTS "activity_text_style_font_size_desktop",
      DROP COLUMN IF EXISTS "activity_text_style_line_height",
      DROP COLUMN IF EXISTS "activity_text_style_letter_spacing",
      DROP COLUMN IF EXISTS "activity_text_style_text_transform",
      DROP COLUMN IF EXISTS "activity_text_style_color_mode",
      DROP COLUMN IF EXISTS "activity_text_style_color_global",
      DROP COLUMN IF EXISTS "activity_text_style_color_custom",
      DROP COLUMN IF EXISTS "active_activity_text_style_font_family",
      DROP COLUMN IF EXISTS "active_activity_text_style_font_weight",
      DROP COLUMN IF EXISTS "active_activity_text_style_font_style",
      DROP COLUMN IF EXISTS "active_activity_text_style_vertical_scale",
      DROP COLUMN IF EXISTS "active_activity_text_style_font_size_mobile",
      DROP COLUMN IF EXISTS "active_activity_text_style_font_size_desktop",
      DROP COLUMN IF EXISTS "active_activity_text_style_line_height",
      DROP COLUMN IF EXISTS "active_activity_text_style_letter_spacing",
      DROP COLUMN IF EXISTS "active_activity_text_style_text_transform",
      DROP COLUMN IF EXISTS "active_activity_text_style_color_mode",
      DROP COLUMN IF EXISTS "active_activity_text_style_color_global",
      DROP COLUMN IF EXISTS "active_activity_text_style_color_custom";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "event_filters"
      ALTER COLUMN "type_label" SET DEFAULT 'Tipo';

    ALTER TABLE IF EXISTS "event_filters"
      ADD COLUMN IF NOT EXISTS "activity_item_border" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "activity_text_style_font_family" varchar DEFAULT 'geistSans',
      ADD COLUMN IF NOT EXISTS "activity_text_style_font_weight" varchar DEFAULT 'black',
      ADD COLUMN IF NOT EXISTS "activity_text_style_font_style" varchar DEFAULT 'normal',
      ADD COLUMN IF NOT EXISTS "activity_text_style_vertical_scale" varchar DEFAULT 'normal',
      ADD COLUMN IF NOT EXISTS "activity_text_style_font_size_mobile" numeric DEFAULT 12,
      ADD COLUMN IF NOT EXISTS "activity_text_style_font_size_desktop" numeric DEFAULT 12,
      ADD COLUMN IF NOT EXISTS "activity_text_style_line_height" numeric DEFAULT 1,
      ADD COLUMN IF NOT EXISTS "activity_text_style_letter_spacing" varchar DEFAULT 'tight',
      ADD COLUMN IF NOT EXISTS "activity_text_style_text_transform" varchar DEFAULT 'uppercase',
      ADD COLUMN IF NOT EXISTS "activity_text_style_color_mode" varchar DEFAULT 'custom',
      ADD COLUMN IF NOT EXISTS "activity_text_style_color_global" varchar DEFAULT 'primary',
      ADD COLUMN IF NOT EXISTS "activity_text_style_color_custom" varchar DEFAULT '#f3eee5',
      ADD COLUMN IF NOT EXISTS "active_activity_text_style_font_family" varchar DEFAULT 'geistSans',
      ADD COLUMN IF NOT EXISTS "active_activity_text_style_font_weight" varchar DEFAULT 'black',
      ADD COLUMN IF NOT EXISTS "active_activity_text_style_font_style" varchar DEFAULT 'normal',
      ADD COLUMN IF NOT EXISTS "active_activity_text_style_vertical_scale" varchar DEFAULT 'normal',
      ADD COLUMN IF NOT EXISTS "active_activity_text_style_font_size_mobile" numeric DEFAULT 12,
      ADD COLUMN IF NOT EXISTS "active_activity_text_style_font_size_desktop" numeric DEFAULT 12,
      ADD COLUMN IF NOT EXISTS "active_activity_text_style_line_height" numeric DEFAULT 1,
      ADD COLUMN IF NOT EXISTS "active_activity_text_style_letter_spacing" varchar DEFAULT 'tight',
      ADD COLUMN IF NOT EXISTS "active_activity_text_style_text_transform" varchar DEFAULT 'uppercase',
      ADD COLUMN IF NOT EXISTS "active_activity_text_style_color_mode" varchar DEFAULT 'custom',
      ADD COLUMN IF NOT EXISTS "active_activity_text_style_color_global" varchar DEFAULT 'accent',
      ADD COLUMN IF NOT EXISTS "active_activity_text_style_color_custom" varchar DEFAULT '#93b51f';

    ALTER TABLE IF EXISTS "event_filters"
      DROP COLUMN IF EXISTS "venue_label",
      DROP COLUMN IF EXISTS "all_venues_label",
      DROP COLUMN IF EXISTS "type_border",
      DROP COLUMN IF EXISTS "venue_border";
  `)
}
