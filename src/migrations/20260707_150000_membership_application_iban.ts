import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "member_app"
      ADD COLUMN IF NOT EXISTS "iban_label" varchar DEFAULT 'IBAN / Coordinate bancarie *';

    ALTER TABLE IF EXISTS "_member_app_v"
      ADD COLUMN IF NOT EXISTS "iban_label" varchar DEFAULT 'IBAN / Coordinate bancarie *';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "member_app"
      DROP COLUMN IF EXISTS "iban_label";

    ALTER TABLE IF EXISTS "_member_app_v"
      DROP COLUMN IF EXISTS "iban_label";
  `)
}
