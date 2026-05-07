import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const eventListTypologyColumns = `
  DROP COLUMN IF EXISTS "typ_style_font_weight",
  DROP COLUMN IF EXISTS "typ_style_font_style",
  DROP COLUMN IF EXISTS "typ_style_vertical_scale",
  DROP COLUMN IF EXISTS "typ_style_letter_spacing",
  DROP COLUMN IF EXISTS "typ_style_color_custom"`

const legacyBackgroundPositionColumns = `
  DROP COLUMN IF EXISTS "img_pos_m",
  DROP COLUMN IF EXISTS "img_pos_t",
  DROP COLUMN IF EXISTS "img_pos_d"`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`
    ALTER TABLE IF EXISTS "pages_blocks_event_list"
      ${eventListTypologyColumns};

    ALTER TABLE IF EXISTS "_pages_v_blocks_event_list"
      ${eventListTypologyColumns};

    ALTER TABLE IF EXISTS "pages_blocks_background_container"
      ${legacyBackgroundPositionColumns};

    ALTER TABLE IF EXISTS "_pages_v_blocks_background_container"
      ${legacyBackgroundPositionColumns};
  `))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_event_list"
      ADD COLUMN IF NOT EXISTS "typ_style_font_weight" "fw" DEFAULT 'black',
      ADD COLUMN IF NOT EXISTS "typ_style_font_style" "fst" DEFAULT 'normal',
      ADD COLUMN IF NOT EXISTS "typ_style_vertical_scale" "vs" DEFAULT 'normal',
      ADD COLUMN IF NOT EXISTS "typ_style_letter_spacing" "ls" DEFAULT 'tight',
      ADD COLUMN IF NOT EXISTS "typ_style_color_custom" varchar;

    ALTER TABLE IF EXISTS "_pages_v_blocks_event_list"
      ADD COLUMN IF NOT EXISTS "typ_style_font_weight" "fw" DEFAULT 'black',
      ADD COLUMN IF NOT EXISTS "typ_style_font_style" "fst" DEFAULT 'normal',
      ADD COLUMN IF NOT EXISTS "typ_style_vertical_scale" "vs" DEFAULT 'normal',
      ADD COLUMN IF NOT EXISTS "typ_style_letter_spacing" "ls" DEFAULT 'tight',
      ADD COLUMN IF NOT EXISTS "typ_style_color_custom" varchar;

    ALTER TABLE IF EXISTS "pages_blocks_background_container"
      ADD COLUMN IF NOT EXISTS "img_pos_m" varchar DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "img_pos_t" varchar DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "img_pos_d" varchar DEFAULT 'center';

    ALTER TABLE IF EXISTS "_pages_v_blocks_background_container"
      ADD COLUMN IF NOT EXISTS "img_pos_m" varchar DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "img_pos_t" varchar DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "img_pos_d" varchar DEFAULT 'center';
  `)
}
