import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "theme_colors" ADD COLUMN IF NOT EXISTS "text_purple" varchar DEFAULT '#9b5098';
  `)

  await db.execute(
    sql.raw(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM pg_type type
        JOIN pg_namespace namespace ON namespace.oid = type.typnamespace
        WHERE namespace.nspname = 'public'
          AND type.typname = 'ct'
      ) THEN
        ALTER TYPE "public"."ct" ADD VALUE IF NOT EXISTS 'purple';
      END IF;
    END $$;
  `),
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "theme_colors" DROP COLUMN IF EXISTS "text_purple";
  `)
}
