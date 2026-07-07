import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "payload_folders"
      ADD COLUMN IF NOT EXISTS "protected_from_events_managers" boolean DEFAULT false;

    CREATE INDEX IF NOT EXISTS "payload_folders_protected_from_events_managers_idx"
      ON "payload_folders" USING btree ("protected_from_events_managers");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "payload_folders_protected_from_events_managers_idx";

    ALTER TABLE IF EXISTS "payload_folders"
      DROP COLUMN IF EXISTS "protected_from_events_managers";
  `)
}
