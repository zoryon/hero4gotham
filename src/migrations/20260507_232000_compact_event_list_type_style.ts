import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const dropEventTypeFontFamily = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    DROP COLUMN IF EXISTS "typ_style_font_family";
`

const restoreEventTypeFontFamily = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    ADD COLUMN IF NOT EXISTS "typ_style_font_family" "ff" DEFAULT 'cinzel';
`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(dropEventTypeFontFamily('pages_blocks_event_list')))
  await db.execute(sql.raw(dropEventTypeFontFamily('_pages_v_blocks_event_list')))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(restoreEventTypeFontFamily('_pages_v_blocks_event_list')))
  await db.execute(sql.raw(restoreEventTypeFontFamily('pages_blocks_event_list')))
}
