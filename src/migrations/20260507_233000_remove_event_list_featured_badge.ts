import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const dropFeaturedBadgeLabel = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    DROP COLUMN IF EXISTS "featured_badge_label";
`

const restoreFeaturedBadgeLabel = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    ADD COLUMN IF NOT EXISTS "featured_badge_label" varchar DEFAULT 'In evidenza';
`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(dropFeaturedBadgeLabel('pages_blocks_event_list')))
  await db.execute(sql.raw(dropFeaturedBadgeLabel('_pages_v_blocks_event_list')))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(restoreFeaturedBadgeLabel('_pages_v_blocks_event_list')))
  await db.execute(sql.raw(restoreFeaturedBadgeLabel('pages_blocks_event_list')))
}
