import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "theme_colors"
      ADD COLUMN IF NOT EXISTS "background_background_container_overflow" varchar DEFAULT '#050505';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "theme_colors"
      DROP COLUMN IF EXISTS "background_background_container_overflow";
  `)
}
