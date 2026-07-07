import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_variables_type" AS ENUM('text', 'number', 'date', 'boolean');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "variables" (
      "id" serial PRIMARY KEY NOT NULL,
      "unlock_editing" boolean DEFAULT false,
      "name" varchar NOT NULL,
      "type" "enum_variables_type" DEFAULT 'text' NOT NULL,
      "value" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "variables_name_idx"
      ON "variables" USING btree ("name");

    CREATE INDEX IF NOT EXISTS "variables_updated_at_idx"
      ON "variables" USING btree ("updated_at");

    CREATE INDEX IF NOT EXISTS "variables_created_at_idx"
      ON "variables" USING btree ("created_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "variables" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_variables_type";
  `)
}
