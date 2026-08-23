import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const normalizeLatestVersions = (tableName: '_pages_v' | '_posts_v') =>
  sql.raw(`
  WITH ranked_latest AS (
    SELECT
      id,
      ROW_NUMBER() OVER (
        PARTITION BY parent_id
        ORDER BY updated_at DESC, id DESC
      ) AS latest_rank
    FROM "${tableName}"
    WHERE latest = true
      AND parent_id IS NOT NULL
  )
  UPDATE "${tableName}" AS versions
  SET latest = false
  FROM ranked_latest
  WHERE versions.id = ranked_latest.id
    AND ranked_latest.latest_rank > 1;
`)

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(normalizeLatestVersions('_pages_v'))
  await db.execute(normalizeLatestVersions('_posts_v'))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // The migration only repairs conflicting flags; no version records are removed.
  await db.execute(sql`SELECT 1;`)
}
