import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "events"
      ADD COLUMN IF NOT EXISTS "pinned" boolean DEFAULT false NOT NULL;

    CREATE INDEX IF NOT EXISTS "events_pinned_idx"
      ON "events" USING btree ("pinned");

    CREATE UNIQUE INDEX IF NOT EXISTS "events_single_pinned_idx"
      ON "events" USING btree ("pinned")
      WHERE "pinned" IS TRUE;

    ALTER TABLE IF EXISTS "events"
      DROP COLUMN IF EXISTS "time_label";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "events_single_pinned_idx";
    DROP INDEX IF EXISTS "events_pinned_idx";

    ALTER TABLE IF EXISTS "events"
      ADD COLUMN IF NOT EXISTS "time_label" varchar,
      DROP COLUMN IF EXISTS "pinned";
  `)
}
