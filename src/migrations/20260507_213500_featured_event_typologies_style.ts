import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const addTypologyStyleColumns = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    ADD COLUMN IF NOT EXISTS "typ_style_font_family" "ff" DEFAULT 'cinzel',
    ADD COLUMN IF NOT EXISTS "typ_style_font_weight" "fw" DEFAULT 'black',
    ADD COLUMN IF NOT EXISTS "typ_style_font_style" "fst" DEFAULT 'normal',
    ADD COLUMN IF NOT EXISTS "typ_style_vertical_scale" "vs" DEFAULT 'normal',
    ADD COLUMN IF NOT EXISTS "typ_style_font_size_mobile" numeric DEFAULT 9,
    ADD COLUMN IF NOT EXISTS "typ_style_font_size_desktop" numeric DEFAULT 9,
    ADD COLUMN IF NOT EXISTS "typ_style_letter_spacing" "ls" DEFAULT 'tight',
    ADD COLUMN IF NOT EXISTS "typ_style_text_transform" "tt" DEFAULT 'uppercase',
    ADD COLUMN IF NOT EXISTS "typ_style_color_theme" "ct" DEFAULT 'purple',
    ADD COLUMN IF NOT EXISTS "typ_style_color_custom" varchar;
`

const dropTypologyStyleColumns = (tableName: string) => `
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
  await db.execute(sql.raw(addTypologyStyleColumns('pages_blocks_featured_event')))
  await db.execute(sql.raw(addTypologyStyleColumns('_pages_v_blocks_featured_event')))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(dropTypologyStyleColumns('_pages_v_blocks_featured_event')))
  await db.execute(sql.raw(dropTypologyStyleColumns('pages_blocks_featured_event')))
}
