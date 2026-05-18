import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "events"
      ADD COLUMN IF NOT EXISTS "generate_slug" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "slug" varchar;

    UPDATE "events"
    SET "slug" = concat(
      coalesce(
        nullif(
          regexp_replace(
            regexp_replace(lower(trim("title")), '[^a-z0-9]+', '-', 'g'),
            '(^-|-$)',
            '',
            'g'
          ),
          ''
        ),
        'evento'
      ),
      '-',
      "id"
    )
    WHERE "slug" IS NULL OR btrim("slug") = '';

    CREATE UNIQUE INDEX IF NOT EXISTS "events_slug_idx" ON "events" USING btree ("slug");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "events_slug_idx";

    ALTER TABLE IF EXISTS "events"
      DROP COLUMN IF EXISTS "generate_slug",
      DROP COLUMN IF EXISTS "slug";
  `)
}
