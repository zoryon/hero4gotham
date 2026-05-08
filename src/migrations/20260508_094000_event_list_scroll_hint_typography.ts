import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const addScrollHintTypography = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    ADD COLUMN IF NOT EXISTS "scroll_hint_style_font_family" "ff" DEFAULT 'cinzel',
    ADD COLUMN IF NOT EXISTS "scroll_hint_style_font_weight" "fw" DEFAULT 'black',
    ADD COLUMN IF NOT EXISTS "scroll_hint_style_font_style" "fst" DEFAULT 'normal',
    ADD COLUMN IF NOT EXISTS "scroll_hint_style_vertical_scale" "vs" DEFAULT 'normal',
    ADD COLUMN IF NOT EXISTS "scroll_hint_style_font_size_mobile" numeric DEFAULT 10,
    ADD COLUMN IF NOT EXISTS "scroll_hint_style_font_size_desktop" numeric DEFAULT 11,
    ADD COLUMN IF NOT EXISTS "scroll_hint_style_letter_spacing" "ls" DEFAULT 'tight',
    ADD COLUMN IF NOT EXISTS "scroll_hint_style_text_transform" "tt" DEFAULT 'uppercase',
    ADD COLUMN IF NOT EXISTS "scroll_hint_style_color_theme" "ct" DEFAULT 'green',
    ADD COLUMN IF NOT EXISTS "scroll_hint_style_color_custom" varchar;
`

const dropScrollHintTypography = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    DROP COLUMN IF EXISTS "scroll_hint_style_font_family",
    DROP COLUMN IF EXISTS "scroll_hint_style_font_weight",
    DROP COLUMN IF EXISTS "scroll_hint_style_font_style",
    DROP COLUMN IF EXISTS "scroll_hint_style_vertical_scale",
    DROP COLUMN IF EXISTS "scroll_hint_style_font_size_mobile",
    DROP COLUMN IF EXISTS "scroll_hint_style_font_size_desktop",
    DROP COLUMN IF EXISTS "scroll_hint_style_letter_spacing",
    DROP COLUMN IF EXISTS "scroll_hint_style_text_transform",
    DROP COLUMN IF EXISTS "scroll_hint_style_color_theme",
    DROP COLUMN IF EXISTS "scroll_hint_style_color_custom";
`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(addScrollHintTypography('pages_blocks_event_list')))
  await db.execute(sql.raw(addScrollHintTypography('_pages_v_blocks_event_list')))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(dropScrollHintTypography('_pages_v_blocks_event_list')))
  await db.execute(sql.raw(dropScrollHintTypography('pages_blocks_event_list')))
}
