import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "events"
      DROP COLUMN IF EXISTS "date_day_label",
      DROP COLUMN IF EXISTS "date_month_label";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "events"
      ADD COLUMN IF NOT EXISTS "date_day_label" varchar,
      ADD COLUMN IF NOT EXISTS "date_month_label" varchar;
  `)
}
