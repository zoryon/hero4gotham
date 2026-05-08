import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

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

const styleColumns = (
  prefix: string,
  defaults: {
    colorTheme: string
    fontFamily: string
    fontSizeDesktop: number
    fontSizeMobile: number
    fontWeight: string
    textTransform: string
  },
) => `
  "${prefix}_font_family" "ff" DEFAULT '${defaults.fontFamily}',
  "${prefix}_font_weight" "fw" DEFAULT '${defaults.fontWeight}',
  "${prefix}_font_style" "fst" DEFAULT 'normal',
  "${prefix}_vertical_scale" "vs" DEFAULT 'normal',
  "${prefix}_font_size_mobile" numeric DEFAULT ${defaults.fontSizeMobile},
  "${prefix}_font_size_desktop" numeric DEFAULT ${defaults.fontSizeDesktop},
  "${prefix}_letter_spacing" "ls" DEFAULT 'tight',
  "${prefix}_text_transform" "tt" DEFAULT '${defaults.textTransform}',
  "${prefix}_color_theme" "ct" DEFAULT '${defaults.colorTheme}',
  "${prefix}_color_custom" varchar`

const galleryColumns = `
  "photos_per_page" numeric DEFAULT 9,
  "mobile_columns" numeric DEFAULT 1,
  "tablet_columns" numeric DEFAULT 2,
  "desktop_columns" numeric DEFAULT 4,
  "gap" numeric DEFAULT 18,
  "load_more_label" varchar DEFAULT 'Carica altre foto',
  "load_more_background_image_id" integer,
  "empty_state_label" varchar DEFAULT 'Nessuna foto trovata',
  ${styleColumns('ttl_style', {
    colorTheme: 'primary',
    fontFamily: 'cinzel',
    fontSizeDesktop: 22,
    fontSizeMobile: 18,
    fontWeight: 'black',
    textTransform: 'uppercase',
  })},
  ${styleColumns('dt_style', {
    colorTheme: 'green',
    fontFamily: 'cinzel',
    fontSizeDesktop: 12,
    fontSizeMobile: 11,
    fontWeight: 'black',
    textTransform: 'uppercase',
  })},
  ${styleColumns('btn_style', {
    colorTheme: 'green',
    fontFamily: 'cinzel',
    fontSizeDesktop: 13,
    fontSizeMobile: 12,
    fontWeight: 'black',
    textTransform: 'uppercase',
  })},
  ${styleColumns('empty_state_style', {
    colorTheme: 'primary',
    fontFamily: 'cinzel',
    fontSizeDesktop: 16,
    fontSizeMobile: 14,
    fontWeight: 'black',
    textTransform: 'uppercase',
  })}`

const createGalleryTable = (tableName: string, version = false) => `
  CREATE TABLE IF NOT EXISTS "${tableName}" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" ${version ? `serial PRIMARY KEY` : `varchar PRIMARY KEY`},
    ${galleryColumns},
    ${layoutColumns},
    ${version ? '"_uuid" varchar,' : ''}
    "block_name" varchar
  );

  CREATE INDEX IF NOT EXISTS "${tableName}_order_idx" ON "${tableName}" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "${tableName}_parent_id_idx" ON "${tableName}" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "${tableName}_path_idx" ON "${tableName}" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "${tableName}_load_more_background_image_idx" ON "${tableName}" USING btree ("load_more_background_image_id");

  DO $$
  BEGIN
    ALTER TABLE "${tableName}"
      ADD CONSTRAINT "${tableName}_load_more_background_image_fk"
      FOREIGN KEY ("load_more_background_image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;
`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(createGalleryTable('event_gallery')))
  await db.execute(sql.raw(createGalleryTable('_event_gallery_v', true)))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw('DROP TABLE IF EXISTS "_event_gallery_v" CASCADE;'))
  await db.execute(sql.raw('DROP TABLE IF EXISTS "event_gallery" CASCADE;'))
}
