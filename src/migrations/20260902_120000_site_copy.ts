import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

import { siteCopyDefaults } from '../SiteCopy/defaults'

const snakeCase = (value: string) => value.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()
const quote = (value: string) => `'${value.replace(/'/g, "''")}'`

const columns = Object.entries(siteCopyDefaults).flatMap(([group, values]) =>
  Object.entries(values).map(
    ([name, defaultValue]) =>
      `"${snakeCase(group)}_${snakeCase(name)}" varchar DEFAULT ${quote(defaultValue)} NOT NULL`,
  ),
)

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    sql.raw(`
      CREATE TABLE IF NOT EXISTS "site_copy" (
        "id" serial PRIMARY KEY NOT NULL,
        ${columns.join(',\n        ')},
        "updated_at" timestamp(3) with time zone,
        "created_at" timestamp(3) with time zone
      );

      INSERT INTO "site_copy" ("id", "updated_at", "created_at")
      VALUES (1, now(), now())
      ON CONFLICT ("id") DO NOTHING;

      SELECT setval(
        pg_get_serial_sequence('site_copy', 'id'),
        COALESCE((SELECT MAX("id") FROM "site_copy"), 1),
        true
      );
    `),
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "site_copy";`)
}
