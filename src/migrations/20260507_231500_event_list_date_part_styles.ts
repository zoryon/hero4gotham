import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const datePartColumnActions = (prefix: string, colorTheme = 'primary') => `
    ADD COLUMN IF NOT EXISTS "${prefix}_font_size_mobile" numeric DEFAULT 10,
    ADD COLUMN IF NOT EXISTS "${prefix}_font_size_desktop" numeric DEFAULT 13,
    ADD COLUMN IF NOT EXISTS "${prefix}_vertical_scale" "vs" DEFAULT 'normal',
    ADD COLUMN IF NOT EXISTS "${prefix}_color_theme" "ct" DEFAULT '${colorTheme}'`

const addDatePartColumns = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
${datePartColumnActions('month_style')},
${datePartColumnActions('weekday_style')},
${datePartColumnActions('time_style')};
`

const copyDateMetaStyle = (tableName: string) => `
  UPDATE "${tableName}"
  SET
    "month_style_font_size_mobile" = COALESCE("dmt_style_font_size_mobile", 10),
    "month_style_font_size_desktop" = COALESCE("dmt_style_font_size_desktop", 13),
    "month_style_vertical_scale" = COALESCE("dmt_style_vertical_scale", 'normal'),
    "month_style_color_theme" = COALESCE("dmt_style_color_theme", 'primary'),
    "weekday_style_font_size_mobile" = COALESCE("dmt_style_font_size_mobile", 10),
    "weekday_style_font_size_desktop" = COALESCE("dmt_style_font_size_desktop", 13),
    "weekday_style_vertical_scale" = COALESCE("dmt_style_vertical_scale", 'normal'),
    "weekday_style_color_theme" = COALESCE("dmt_style_color_theme", 'primary'),
    "time_style_font_size_mobile" = COALESCE("dmt_style_font_size_mobile", 10),
    "time_style_font_size_desktop" = COALESCE("dmt_style_font_size_desktop", 13),
    "time_style_vertical_scale" = COALESCE("dmt_style_vertical_scale", 'normal'),
    "time_style_color_theme" = COALESCE("dmt_style_color_theme", 'primary');
`

const dropLegacyDateMetaColumns = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    DROP COLUMN IF EXISTS "dmt_style_color_custom",
    DROP COLUMN IF EXISTS "dmt_style_color_theme",
    DROP COLUMN IF EXISTS "dmt_style_text_transform",
    DROP COLUMN IF EXISTS "dmt_style_letter_spacing",
    DROP COLUMN IF EXISTS "dmt_style_font_size_desktop",
    DROP COLUMN IF EXISTS "dmt_style_font_size_mobile",
    DROP COLUMN IF EXISTS "dmt_style_vertical_scale",
    DROP COLUMN IF EXISTS "dmt_style_font_style",
    DROP COLUMN IF EXISTS "dmt_style_font_weight",
    DROP COLUMN IF EXISTS "dmt_style_font_family",
    DROP COLUMN IF EXISTS "typ_style_text_transform";
`

const restoreLegacyDateMetaColumns = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    ADD COLUMN IF NOT EXISTS "dmt_style_font_family" "ff" DEFAULT 'cinzel',
    ADD COLUMN IF NOT EXISTS "dmt_style_font_weight" "fw" DEFAULT 'black',
    ADD COLUMN IF NOT EXISTS "dmt_style_font_style" "fst" DEFAULT 'normal',
    ADD COLUMN IF NOT EXISTS "dmt_style_vertical_scale" "vs" DEFAULT 'normal',
    ADD COLUMN IF NOT EXISTS "dmt_style_font_size_mobile" numeric DEFAULT 10,
    ADD COLUMN IF NOT EXISTS "dmt_style_font_size_desktop" numeric DEFAULT 13,
    ADD COLUMN IF NOT EXISTS "dmt_style_letter_spacing" "ls" DEFAULT 'tight',
    ADD COLUMN IF NOT EXISTS "dmt_style_text_transform" "tt" DEFAULT 'uppercase',
    ADD COLUMN IF NOT EXISTS "dmt_style_color_theme" "ct" DEFAULT 'primary',
    ADD COLUMN IF NOT EXISTS "dmt_style_color_custom" varchar,
    ADD COLUMN IF NOT EXISTS "typ_style_text_transform" "tt" DEFAULT 'uppercase';

  UPDATE "${tableName}"
  SET
    "dmt_style_font_size_mobile" = COALESCE("month_style_font_size_mobile", 10),
    "dmt_style_font_size_desktop" = COALESCE("month_style_font_size_desktop", 13),
    "dmt_style_vertical_scale" = COALESCE("month_style_vertical_scale", 'normal'),
    "dmt_style_color_theme" = COALESCE("month_style_color_theme", 'primary');
`

const dropDatePartColumns = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    DROP COLUMN IF EXISTS "time_style_color_theme",
    DROP COLUMN IF EXISTS "time_style_vertical_scale",
    DROP COLUMN IF EXISTS "time_style_font_size_desktop",
    DROP COLUMN IF EXISTS "time_style_font_size_mobile",
    DROP COLUMN IF EXISTS "weekday_style_color_theme",
    DROP COLUMN IF EXISTS "weekday_style_vertical_scale",
    DROP COLUMN IF EXISTS "weekday_style_font_size_desktop",
    DROP COLUMN IF EXISTS "weekday_style_font_size_mobile",
    DROP COLUMN IF EXISTS "month_style_color_theme",
    DROP COLUMN IF EXISTS "month_style_vertical_scale",
    DROP COLUMN IF EXISTS "month_style_font_size_desktop",
    DROP COLUMN IF EXISTS "month_style_font_size_mobile";
`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(addDatePartColumns('pages_blocks_event_list')))
  await db.execute(sql.raw(addDatePartColumns('_pages_v_blocks_event_list')))
  await db.execute(sql.raw(copyDateMetaStyle('pages_blocks_event_list')))
  await db.execute(sql.raw(copyDateMetaStyle('_pages_v_blocks_event_list')))
  await db.execute(sql.raw(dropLegacyDateMetaColumns('pages_blocks_event_list')))
  await db.execute(sql.raw(dropLegacyDateMetaColumns('_pages_v_blocks_event_list')))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(restoreLegacyDateMetaColumns('_pages_v_blocks_event_list')))
  await db.execute(sql.raw(restoreLegacyDateMetaColumns('pages_blocks_event_list')))
  await db.execute(sql.raw(dropDatePartColumns('_pages_v_blocks_event_list')))
  await db.execute(sql.raw(dropDatePartColumns('pages_blocks_event_list')))
}
