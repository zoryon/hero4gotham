import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const addScrollHintLabel = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    ADD COLUMN IF NOT EXISTS "scroll_hint_label" varchar DEFAULT 'Scorri per scoprire gli altri eventi in programma',
    DROP COLUMN IF EXISTS "load_more_label",
    DROP COLUMN IF EXISTS "load_more_background_image_id",
    DROP COLUMN IF EXISTS "btn_style_font_family",
    DROP COLUMN IF EXISTS "btn_style_font_weight",
    DROP COLUMN IF EXISTS "btn_style_font_style",
    DROP COLUMN IF EXISTS "btn_style_vertical_scale",
    DROP COLUMN IF EXISTS "btn_style_font_size_mobile",
    DROP COLUMN IF EXISTS "btn_style_font_size_desktop",
    DROP COLUMN IF EXISTS "btn_style_line_height",
    DROP COLUMN IF EXISTS "btn_style_letter_spacing",
    DROP COLUMN IF EXISTS "btn_style_text_transform",
    DROP COLUMN IF EXISTS "btn_style_color_mode",
    DROP COLUMN IF EXISTS "btn_style_color_theme",
    DROP COLUMN IF EXISTS "btn_style_color_custom";
`

const restoreLoadMoreFields = (tableName: string, colorModeEnum: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    ADD COLUMN IF NOT EXISTS "load_more_label" varchar DEFAULT 'Carica altri eventi',
    ADD COLUMN IF NOT EXISTS "load_more_background_image_id" integer,
    ADD COLUMN IF NOT EXISTS "btn_style_font_family" "ff" DEFAULT 'cinzel',
    ADD COLUMN IF NOT EXISTS "btn_style_font_weight" "fw" DEFAULT 'black',
    ADD COLUMN IF NOT EXISTS "btn_style_font_style" "fst" DEFAULT 'normal',
    ADD COLUMN IF NOT EXISTS "btn_style_vertical_scale" "vs" DEFAULT 'normal',
    ADD COLUMN IF NOT EXISTS "btn_style_font_size_mobile" numeric DEFAULT 10,
    ADD COLUMN IF NOT EXISTS "btn_style_font_size_desktop" numeric DEFAULT 10,
    ADD COLUMN IF NOT EXISTS "btn_style_line_height" numeric DEFAULT 1,
    ADD COLUMN IF NOT EXISTS "btn_style_letter_spacing" "ls" DEFAULT 'tight',
    ADD COLUMN IF NOT EXISTS "btn_style_text_transform" "tt" DEFAULT 'uppercase',
    ADD COLUMN IF NOT EXISTS "btn_style_color_mode" "${colorModeEnum}" DEFAULT 'theme',
    ADD COLUMN IF NOT EXISTS "btn_style_color_theme" "ct" DEFAULT 'green',
    ADD COLUMN IF NOT EXISTS "btn_style_color_custom" varchar,
    DROP COLUMN IF EXISTS "scroll_hint_label";
`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(addScrollHintLabel('pages_blocks_event_list')))
  await db.execute(sql.raw(addScrollHintLabel('_pages_v_blocks_event_list')))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw(
      restoreLoadMoreFields(
        '_pages_v_blocks_event_list',
        'enum__pages_v_blocks_event_list_btn_style_color_mode',
      ),
    ),
  )
  await db.execute(
    sql.raw(
      restoreLoadMoreFields(
        'pages_blocks_event_list',
        'enum_pages_blocks_event_list_btn_style_color_mode',
      ),
    ),
  )
}
