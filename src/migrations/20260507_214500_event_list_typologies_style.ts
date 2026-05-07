import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const addTypeStyleColumns = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    ADD COLUMN IF NOT EXISTS "typ_style_font_family" "ff" DEFAULT 'cinzel',
    ADD COLUMN IF NOT EXISTS "typ_style_font_weight" "fw" DEFAULT 'black',
    ADD COLUMN IF NOT EXISTS "typ_style_font_style" "fst" DEFAULT 'normal',
    ADD COLUMN IF NOT EXISTS "typ_style_vertical_scale" "vs" DEFAULT 'normal',
    ADD COLUMN IF NOT EXISTS "typ_style_font_size_mobile" numeric DEFAULT 10,
    ADD COLUMN IF NOT EXISTS "typ_style_font_size_desktop" numeric DEFAULT 11,
    ADD COLUMN IF NOT EXISTS "typ_style_letter_spacing" "ls" DEFAULT 'tight',
    ADD COLUMN IF NOT EXISTS "typ_style_text_transform" "tt" DEFAULT 'uppercase',
    ADD COLUMN IF NOT EXISTS "typ_style_color_theme" "ct" DEFAULT 'green',
    ADD COLUMN IF NOT EXISTS "typ_style_color_custom" varchar;
`

const dropTypeStyleColumns = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    DROP COLUMN IF EXISTS "typ_style_color_custom",
    DROP COLUMN IF EXISTS "typ_style_color_theme",
    DROP COLUMN IF EXISTS "typ_style_text_transform",
    DROP COLUMN IF EXISTS "typ_style_letter_spacing",
    DROP COLUMN IF EXISTS "typ_style_font_size_desktop",
    DROP COLUMN IF EXISTS "typ_style_font_size_mobile",
    DROP COLUMN IF EXISTS "typ_style_vertical_scale",
    DROP COLUMN IF EXISTS "typ_style_font_style",
    DROP COLUMN IF EXISTS "typ_style_font_weight",
    DROP COLUMN IF EXISTS "typ_style_font_family";
`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(addTypeStyleColumns('pages_blocks_event_list')))
  await db.execute(sql.raw(addTypeStyleColumns('_pages_v_blocks_event_list')))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(dropTypeStyleColumns('_pages_v_blocks_event_list')))
  await db.execute(sql.raw(dropTypeStyleColumns('pages_blocks_event_list')))
}
