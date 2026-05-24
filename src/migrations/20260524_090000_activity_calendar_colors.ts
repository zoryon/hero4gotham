import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    sql.raw(`
      ALTER TABLE IF EXISTS "activities"
        ADD COLUMN IF NOT EXISTS "color" varchar;

      WITH palette(idx, color) AS (
        VALUES
          (1, '#f04e4e'),
          (2, '#f5b642'),
          (3, '#90a434'),
          (4, '#32b6a6'),
          (5, '#4f8df7'),
          (6, '#9d67ff'),
          (7, '#e955a5'),
          (8, '#f27d42')
      ),
      assigned AS (
        SELECT
          "id",
          ((row_number() OVER (ORDER BY random(), "id") - 1) % (SELECT count(*) FROM palette)) + 1 AS palette_idx
        FROM "activities"
        WHERE "color" IS NULL OR "color" = ''
      )
      UPDATE "activities"
      SET "color" = palette.color
      FROM assigned
      JOIN palette ON palette.idx = assigned.palette_idx
      WHERE "activities"."id" = assigned."id";

      CREATE INDEX IF NOT EXISTS "activities_color_idx" ON "activities" USING btree ("color");
    `),
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw(`
      DROP INDEX IF EXISTS "activities_color_idx";

      ALTER TABLE IF EXISTS "activities"
        DROP COLUMN IF EXISTS "color";
    `),
  )
}
