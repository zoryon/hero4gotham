import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    DECLARE
      table_record record;
    BEGIN
      FOR table_record IN
        SELECT table_schema, table_name
        FROM information_schema.columns
        WHERE column_name = 'layout_size'
          AND table_schema = 'public'
      LOOP
        EXECUTE format(
          'ALTER TABLE %I.%I ADD COLUMN IF NOT EXISTS layout_scribble_border boolean DEFAULT false',
          table_record.table_schema,
          table_record.table_name
        );
      END LOOP;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    DECLARE
      table_record record;
    BEGIN
      FOR table_record IN
        SELECT table_schema, table_name
        FROM information_schema.columns
        WHERE column_name = 'layout_scribble_border'
          AND table_schema = 'public'
      LOOP
        EXECUTE format(
          'ALTER TABLE %I.%I DROP COLUMN IF EXISTS layout_scribble_border',
          table_record.table_schema,
          table_record.table_name
        );
      END LOOP;
    END $$;
  `)
}
