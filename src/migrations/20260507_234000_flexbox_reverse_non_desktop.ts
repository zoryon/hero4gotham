import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const addReverseOnNonDesktop = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    ADD COLUMN IF NOT EXISTS "reverse_on_non_desktop" boolean DEFAULT false;
`

const dropReverseOnNonDesktop = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    DROP COLUMN IF EXISTS "reverse_on_non_desktop";
`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(addReverseOnNonDesktop('pages_blocks_flexbox')))
  await db.execute(sql.raw(addReverseOnNonDesktop('_pages_v_blocks_flexbox')))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(dropReverseOnNonDesktop('_pages_v_blocks_flexbox')))
  await db.execute(sql.raw(dropReverseOnNonDesktop('pages_blocks_flexbox')))
}
