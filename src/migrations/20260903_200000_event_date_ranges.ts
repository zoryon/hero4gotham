import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const dropTimeStyleColumns = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    DROP COLUMN IF EXISTS "time_style_color_theme",
    DROP COLUMN IF EXISTS "time_style_vertical_scale",
    DROP COLUMN IF EXISTS "time_style_font_size_desktop",
    DROP COLUMN IF EXISTS "time_style_font_size_mobile";
`

const restoreTimeStyleColumns = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    ADD COLUMN IF NOT EXISTS "time_style_font_size_mobile" numeric DEFAULT 10,
    ADD COLUMN IF NOT EXISTS "time_style_font_size_desktop" numeric DEFAULT 13,
    ADD COLUMN IF NOT EXISTS "time_style_vertical_scale" "vs" DEFAULT 'normal',
    ADD COLUMN IF NOT EXISTS "time_style_color_theme" "ct" DEFAULT 'primary';
`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "events"
      ADD COLUMN IF NOT EXISTS "ends_at" timestamp(3) with time zone;

    CREATE INDEX IF NOT EXISTS "events_ends_at_idx"
      ON "events" USING btree ("ends_at");
  `)

  await db.execute(sql.raw(dropTimeStyleColumns('pages_blocks_event_list')))
  await db.execute(sql.raw(dropTimeStyleColumns('_pages_v_blocks_event_list')))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(restoreTimeStyleColumns('_pages_v_blocks_event_list')))
  await db.execute(sql.raw(restoreTimeStyleColumns('pages_blocks_event_list')))

  await db.execute(sql`
    DROP INDEX IF EXISTS "events_ends_at_idx";

    ALTER TABLE IF EXISTS "events"
      DROP COLUMN IF EXISTS "ends_at";
  `)
}
