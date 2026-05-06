import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const themeValues = "'primary', 'secondary', 'muted', 'accent', 'green'"
const colorModeValues = "'theme', 'custom'"

const enumNames = [
  ['ct', themeValues],
  ['enum_pages_blocks_event_calendar_hdg_style_color_mode', colorModeValues],
  ['enum_pages_blocks_event_calendar_mon_style_color_mode', colorModeValues],
  ['enum_pages_blocks_event_calendar_day_style_color_mode', colorModeValues],
  ['enum_pages_blocks_event_list_hdg_style_color_mode', colorModeValues],
  ['enum_pages_blocks_event_list_ddy_style_color_mode', colorModeValues],
  ['enum_pages_blocks_event_list_dmt_style_color_mode', colorModeValues],
  ['enum_pages_blocks_event_list_ttl_style_color_mode', colorModeValues],
  ['enum_pages_blocks_event_list_desc_style_color_mode', colorModeValues],
  ['enum_pages_blocks_event_list_lnk_style_color_mode', colorModeValues],
  ['enum_pages_blocks_event_list_btn_style_color_mode', colorModeValues],
  ['enum_pages_blocks_featured_event_event_source', "'automatic', 'manual'"],
  ['enum_pages_blocks_featured_event_hdg_style_color_mode', colorModeValues],
  ['enum_pages_blocks_featured_event_ttl_style_color_mode', colorModeValues],
  ['enum_pages_blocks_featured_event_dt_style_color_mode', colorModeValues],
  ['enum_pages_blocks_featured_event_desc_style_color_mode', colorModeValues],
  ['enum_pages_blocks_featured_event_lnk_style_color_mode', colorModeValues],
  ['enum_pages_blocks_flexbox_item_sizing', "'auto', 'eventBoardColumns'"],
  ['enum__pages_v_blocks_event_calendar_hdg_style_color_mode', colorModeValues],
  ['enum__pages_v_blocks_event_calendar_mon_style_color_mode', colorModeValues],
  ['enum__pages_v_blocks_event_calendar_day_style_color_mode', colorModeValues],
  ['enum__pages_v_blocks_event_list_hdg_style_color_mode', colorModeValues],
  ['enum__pages_v_blocks_event_list_ddy_style_color_mode', colorModeValues],
  ['enum__pages_v_blocks_event_list_dmt_style_color_mode', colorModeValues],
  ['enum__pages_v_blocks_event_list_ttl_style_color_mode', colorModeValues],
  ['enum__pages_v_blocks_event_list_desc_style_color_mode', colorModeValues],
  ['enum__pages_v_blocks_event_list_lnk_style_color_mode', colorModeValues],
  ['enum__pages_v_blocks_event_list_btn_style_color_mode', colorModeValues],
  ['enum__pages_v_blocks_featured_event_event_source', "'automatic', 'manual'"],
  ['enum__pages_v_blocks_featured_event_hdg_style_color_mode', colorModeValues],
  ['enum__pages_v_blocks_featured_event_ttl_style_color_mode', colorModeValues],
  ['enum__pages_v_blocks_featured_event_dt_style_color_mode', colorModeValues],
  ['enum__pages_v_blocks_featured_event_desc_style_color_mode', colorModeValues],
  ['enum__pages_v_blocks_featured_event_lnk_style_color_mode', colorModeValues],
  ['enum__pages_v_blocks_flexbox_item_sizing', "'auto', 'eventBoardColumns'"],
] as const

const styleColumns = (
  prefix: string,
  colorModeEnum: string,
  defaults: {
    colorTheme: string
    fontFamily: string
    fontSizeDesktop: number
    fontSizeMobile: number
    fontWeight: string
    lineHeight: number
    textTransform: string
  },
) => `
  "${prefix}_font_family" "ff" DEFAULT '${defaults.fontFamily}',
  "${prefix}_font_weight" "fw" DEFAULT '${defaults.fontWeight}',
  "${prefix}_font_style" "fst" DEFAULT 'normal',
  "${prefix}_vertical_scale" "vs" DEFAULT 'normal',
  "${prefix}_font_size_mobile" numeric DEFAULT ${defaults.fontSizeMobile},
  "${prefix}_font_size_desktop" numeric DEFAULT ${defaults.fontSizeDesktop},
  "${prefix}_line_height" numeric DEFAULT ${defaults.lineHeight},
  "${prefix}_letter_spacing" "ls" DEFAULT 'tight',
  "${prefix}_text_transform" "tt" DEFAULT '${defaults.textTransform}',
  "${prefix}_color_mode" "${colorModeEnum}" DEFAULT 'theme',
  "${prefix}_color_theme" "ct" DEFAULT '${defaults.colorTheme}',
  "${prefix}_color_custom" varchar`

const layoutColumns = `
  "layout_size" "sz" DEFAULT 'default',
  "layout_margin_top" "mt" DEFAULT 'default',
  "layout_margin_right" "mr" DEFAULT 'default',
  "layout_margin_bottom" "mb" DEFAULT 'default',
  "layout_margin_left" "ml" DEFAULT 'default',
  "layout_padding_top" "pt" DEFAULT 'none',
  "layout_padding_right" "pr" DEFAULT 'none',
  "layout_padding_bottom" "pb" DEFAULT 'none',
  "layout_padding_left" "pl" DEFAULT 'none',
  "layout_scribble_border" boolean DEFAULT false`

const createBlockTable = (tableName: string, columns: string, version = false) => `
  CREATE TABLE IF NOT EXISTS "${tableName}" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" ${version ? 'serial' : 'varchar'} PRIMARY KEY NOT NULL,
    ${columns},
    ${layoutColumns},
    ${version ? '"_uuid" varchar,' : ''}
    "block_name" varchar
  );`

const calendarColumns = (version = false) => {
  const prefix = version
    ? 'enum__pages_v_blocks_event_calendar'
    : 'enum_pages_blocks_event_calendar'

  return `
    "heading" varchar DEFAULT 'Calendario eventi',
    "heading_background_image_id" integer,
    "month_offset" numeric DEFAULT 0,
    "marker_color" varchar,
    "special_border" boolean DEFAULT false,
    ${styleColumns('hdg_style', `${prefix}_hdg_style_color_mode`, {
      colorTheme: 'green',
      fontFamily: 'cinzel',
      fontSizeDesktop: 13,
      fontSizeMobile: 12,
      fontWeight: 'black',
      lineHeight: 1,
      textTransform: 'uppercase',
    })},
    ${styleColumns('mon_style', `${prefix}_mon_style_color_mode`, {
      colorTheme: 'secondary',
      fontFamily: 'cinzel',
      fontSizeDesktop: 12,
      fontSizeMobile: 12,
      fontWeight: 'black',
      lineHeight: 1,
      textTransform: 'uppercase',
    })},
    ${styleColumns('day_style', `${prefix}_day_style_color_mode`, {
      colorTheme: 'primary',
      fontFamily: 'geistMono',
      fontSizeDesktop: 10,
      fontSizeMobile: 10,
      fontWeight: 'regular',
      lineHeight: 1,
      textTransform: 'normal',
    })}`
}

const listColumns = (version = false) => {
  const prefix = version ? 'enum__pages_v_blocks_event_list' : 'enum_pages_blocks_event_list'

  return `
    "heading" varchar DEFAULT 'Prossimi eventi',
    "heading_background_image_id" integer,
    "load_more_label" varchar DEFAULT 'Carica altri eventi',
    "load_more_background_image_id" integer,
    "event_link_fallback_label" varchar DEFAULT 'Scopri di piu',
    "max_events" numeric DEFAULT 30,
    "row_height" numeric DEFAULT 128,
    "featured_badge_label" varchar DEFAULT 'In evidenza',
    "divider_color" varchar,
    ${styleColumns('hdg_style', `${prefix}_hdg_style_color_mode`, { colorTheme: 'green', fontFamily: 'cinzel', fontSizeDesktop: 14, fontSizeMobile: 13, fontWeight: 'black', lineHeight: 1, textTransform: 'uppercase' })},
    ${styleColumns('ddy_style', `${prefix}_ddy_style_color_mode`, { colorTheme: 'accent', fontFamily: 'cinzel', fontSizeDesktop: 34, fontSizeMobile: 30, fontWeight: 'black', lineHeight: 0.9, textTransform: 'uppercase' })},
    ${styleColumns('dmt_style', `${prefix}_dmt_style_color_mode`, { colorTheme: 'primary', fontFamily: 'cinzel', fontSizeDesktop: 10, fontSizeMobile: 10, fontWeight: 'black', lineHeight: 1.05, textTransform: 'uppercase' })},
    ${styleColumns('ttl_style', `${prefix}_ttl_style_color_mode`, { colorTheme: 'secondary', fontFamily: 'cinzel', fontSizeDesktop: 12, fontSizeMobile: 12, fontWeight: 'black', lineHeight: 1.1, textTransform: 'uppercase' })},
    ${styleColumns('desc_style', `${prefix}_desc_style_color_mode`, { colorTheme: 'primary', fontFamily: 'geistSans', fontSizeDesktop: 10, fontSizeMobile: 10, fontWeight: 'regular', lineHeight: 1.3, textTransform: 'normal' })},
    ${styleColumns('lnk_style', `${prefix}_lnk_style_color_mode`, { colorTheme: 'green', fontFamily: 'cinzel', fontSizeDesktop: 10, fontSizeMobile: 10, fontWeight: 'black', lineHeight: 1, textTransform: 'uppercase' })},
    ${styleColumns('btn_style', `${prefix}_btn_style_color_mode`, { colorTheme: 'green', fontFamily: 'cinzel', fontSizeDesktop: 10, fontSizeMobile: 10, fontWeight: 'black', lineHeight: 1, textTransform: 'uppercase' })}`
}

const featuredColumns = (version = false) => {
  const prefix = version
    ? 'enum__pages_v_blocks_featured_event'
    : 'enum_pages_blocks_featured_event'

  return `
    "heading" varchar DEFAULT 'Evento in evidenza',
    "heading_background_image_id" integer,
    "event_source" "${prefix}_event_source" DEFAULT 'automatic',
    "manual_event_id" integer,
    "fallback_image_id" integer,
    "link_fallback_label" varchar DEFAULT 'Scopri di piu',
    "link_background_image_id" integer,
    "special_border" boolean DEFAULT false,
    ${styleColumns('hdg_style', `${prefix}_hdg_style_color_mode`, { colorTheme: 'green', fontFamily: 'cinzel', fontSizeDesktop: 13, fontSizeMobile: 12, fontWeight: 'black', lineHeight: 1, textTransform: 'uppercase' })},
    ${styleColumns('ttl_style', `${prefix}_ttl_style_color_mode`, { colorTheme: 'accent', fontFamily: 'cinzel', fontSizeDesktop: 24, fontSizeMobile: 22, fontWeight: 'black', lineHeight: 0.95, textTransform: 'uppercase' })},
    ${styleColumns('dt_style', `${prefix}_dt_style_color_mode`, { colorTheme: 'green', fontFamily: 'cinzel', fontSizeDesktop: 12, fontSizeMobile: 12, fontWeight: 'black', lineHeight: 1, textTransform: 'uppercase' })},
    ${styleColumns('desc_style', `${prefix}_desc_style_color_mode`, { colorTheme: 'primary', fontFamily: 'geistSans', fontSizeDesktop: 11, fontSizeMobile: 11, fontWeight: 'regular', lineHeight: 1.35, textTransform: 'normal' })},
    ${styleColumns('lnk_style', `${prefix}_lnk_style_color_mode`, { colorTheme: 'green', fontFamily: 'cinzel', fontSizeDesktop: 10, fontSizeMobile: 10, fontWeight: 'black', lineHeight: 1, textTransform: 'uppercase' })}`
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const [name, values] of enumNames) {
    await db.execute(
      sql.raw(`
      DO $$ BEGIN
        CREATE TYPE "public"."${name}" AS ENUM(${values});
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `),
    )
  }

  await db.execute(
    sql.raw(`
    ALTER TABLE IF EXISTS "events"
      ADD COLUMN IF NOT EXISTS "time_label" varchar,
      ADD COLUMN IF NOT EXISTS "image_id" integer;

    ALTER TABLE IF EXISTS "pages_blocks_flexbox"
      ADD COLUMN IF NOT EXISTS "item_sizing" "enum_pages_blocks_flexbox_item_sizing" DEFAULT 'auto';

    ALTER TABLE IF EXISTS "_pages_v_blocks_flexbox"
      ADD COLUMN IF NOT EXISTS "item_sizing" "enum__pages_v_blocks_flexbox_item_sizing" DEFAULT 'auto';

    CREATE INDEX IF NOT EXISTS "events_image_idx" ON "events" USING btree ("image_id");

    DO $$ BEGIN
      ALTER TABLE "events"
        ADD CONSTRAINT "events_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ${createBlockTable('pages_blocks_event_calendar', calendarColumns())}
    ${createBlockTable('pages_blocks_event_list', listColumns())}
    ${createBlockTable('pages_blocks_featured_event', featuredColumns())}
    ${createBlockTable('_pages_v_blocks_event_calendar', calendarColumns(true), true)}
    ${createBlockTable('_pages_v_blocks_event_list', listColumns(true), true)}
    ${createBlockTable('_pages_v_blocks_featured_event', featuredColumns(true), true)}

    CREATE INDEX IF NOT EXISTS "pages_blocks_event_calendar_order_idx" ON "pages_blocks_event_calendar" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_event_calendar_parent_id_idx" ON "pages_blocks_event_calendar" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_event_calendar_path_idx" ON "pages_blocks_event_calendar" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "pages_blocks_event_calendar_heading_background_image_idx" ON "pages_blocks_event_calendar" USING btree ("heading_background_image_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_event_list_order_idx" ON "pages_blocks_event_list" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_event_list_parent_id_idx" ON "pages_blocks_event_list" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_event_list_path_idx" ON "pages_blocks_event_list" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "pages_blocks_event_list_heading_background_image_idx" ON "pages_blocks_event_list" USING btree ("heading_background_image_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_event_list_load_more_background_image_idx" ON "pages_blocks_event_list" USING btree ("load_more_background_image_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_featured_event_order_idx" ON "pages_blocks_featured_event" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_featured_event_parent_id_idx" ON "pages_blocks_featured_event" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_featured_event_path_idx" ON "pages_blocks_featured_event" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "pages_blocks_featured_event_heading_background_image_idx" ON "pages_blocks_featured_event" USING btree ("heading_background_image_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_featured_event_manual_event_idx" ON "pages_blocks_featured_event" USING btree ("manual_event_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_featured_event_fallback_image_idx" ON "pages_blocks_featured_event" USING btree ("fallback_image_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_featured_event_link_background_image_idx" ON "pages_blocks_featured_event" USING btree ("link_background_image_id");
  `),
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw(`
    DROP TABLE IF EXISTS "_pages_v_blocks_featured_event" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_event_list" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_event_calendar" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_featured_event" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_event_list" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_event_calendar" CASCADE;

    ALTER TABLE IF EXISTS "events"
      DROP CONSTRAINT IF EXISTS "events_image_id_media_id_fk",
      DROP COLUMN IF EXISTS "image_id",
      DROP COLUMN IF EXISTS "time_label";

    ALTER TABLE IF EXISTS "_pages_v_blocks_flexbox" DROP COLUMN IF EXISTS "item_sizing";
    ALTER TABLE IF EXISTS "pages_blocks_flexbox" DROP COLUMN IF EXISTS "item_sizing";
  `),
  )

  for (const [name] of [...enumNames].reverse()) {
    await db.execute(sql.raw(`DROP TYPE IF EXISTS "public"."${name}" CASCADE;`))
  }
}
