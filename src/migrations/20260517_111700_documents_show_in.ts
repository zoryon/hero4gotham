import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'enum_membership_documents_privacy_documents_show_in'
      ) THEN
        CREATE TYPE "public"."enum_membership_documents_privacy_documents_show_in"
          AS ENUM ('membershipApplication', 'contactMessage');
      END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS "membership_documents_privacy_documents_show_in" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "value" "public"."enum_membership_documents_privacy_documents_show_in",
      "id" serial PRIMARY KEY NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "membership_documents_privacy_documents_show_in_order_idx"
      ON "membership_documents_privacy_documents_show_in" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "membership_documents_privacy_documents_show_in_parent_idx"
      ON "membership_documents_privacy_documents_show_in" USING btree ("_parent_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'membership_documents_privacy_documents_show_in_parent_fk'
      ) THEN
        ALTER TABLE "membership_documents_privacy_documents_show_in"
          ADD CONSTRAINT "membership_documents_privacy_documents_show_in_parent_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES "public"."membership_documents_privacy_documents"("id")
          ON DELETE cascade
          ON UPDATE no action;
      END IF;
    END $$;

    INSERT INTO "membership_documents_privacy_documents_show_in" ("_order", "_parent_id", "value")
    SELECT 1, "id", 'membershipApplication'
    FROM "membership_documents_privacy_documents"
    WHERE NOT EXISTS (
      SELECT 1
      FROM "membership_documents_privacy_documents_show_in"
      WHERE "membership_documents_privacy_documents_show_in"."_parent_id" =
        "membership_documents_privacy_documents"."id"
    );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "membership_documents_privacy_documents_show_in";
    DROP TYPE IF EXISTS "public"."enum_membership_documents_privacy_documents_show_in";
  `)
}
