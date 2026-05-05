import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    sql.raw(`
    DO $$
    DECLARE
      enum_record record;
    BEGIN
      FOR enum_record IN
        SELECT n.nspname, t.typname
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typtype = 'e'
          AND t.typname LIKE '%text_transform'
      LOOP
        EXECUTE format(
          'ALTER TYPE %I.%I ADD VALUE IF NOT EXISTS %L',
          enum_record.nspname,
          enum_record.typname,
          'sentenceCase'
        );
      END LOOP;
    END $$;
  `),
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`SELECT 1;`)
}
