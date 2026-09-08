import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "activities"
      ADD COLUMN IF NOT EXISTS "hide_from_calendar_legend" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "activities"
      DROP COLUMN IF EXISTS "hide_from_calendar_legend";
  `)
}
