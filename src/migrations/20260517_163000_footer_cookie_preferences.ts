import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    sql.raw(`
      ALTER TABLE IF EXISTS "footer_nav_items"
        ADD COLUMN IF NOT EXISTS "open_cookie_preferences" boolean DEFAULT false;

      ALTER TABLE IF EXISTS "footer_legal_links"
        ADD COLUMN IF NOT EXISTS "open_cookie_preferences" boolean DEFAULT false;

      UPDATE "footer_legal_links"
      SET "open_cookie_preferences" = true
      WHERE "id" = 'privacy-preferences';
    `),
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw(`
      ALTER TABLE IF EXISTS "footer_nav_items"
        DROP COLUMN IF EXISTS "open_cookie_preferences";

      ALTER TABLE IF EXISTS "footer_legal_links"
        DROP COLUMN IF EXISTS "open_cookie_preferences";
    `),
  )
}
