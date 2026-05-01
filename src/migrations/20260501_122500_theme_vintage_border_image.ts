import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "theme_colors"
      ADD COLUMN IF NOT EXISTS "vintage_border_image_id" integer;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'theme_colors_vintage_border_image_id_media_id_fk'
      ) THEN
        ALTER TABLE "theme_colors"
          ADD CONSTRAINT "theme_colors_vintage_border_image_id_media_id_fk"
          FOREIGN KEY ("vintage_border_image_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "theme_colors_vintage_border_image_idx"
      ON "theme_colors" USING btree ("vintage_border_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "theme_colors"
      DROP CONSTRAINT IF EXISTS "theme_colors_vintage_border_image_id_media_id_fk";

    DROP INDEX IF EXISTS "theme_colors_vintage_border_image_idx";

    ALTER TABLE "theme_colors"
      DROP COLUMN IF EXISTS "vintage_border_image_id";
  `)
}
