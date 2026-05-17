import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "membership_documents" (
      "id" serial PRIMARY KEY NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "membership_documents_privacy_documents" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "description" varchar,
      "document_id" integer
    );

    CREATE INDEX IF NOT EXISTS "membership_documents_privacy_documents_order_idx"
      ON "membership_documents_privacy_documents" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "membership_documents_privacy_documents_parent_id_idx"
      ON "membership_documents_privacy_documents" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "membership_documents_privacy_documents_document_idx"
      ON "membership_documents_privacy_documents" USING btree ("document_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'membership_documents_privacy_documents_parent_id_fk'
      ) THEN
        ALTER TABLE "membership_documents_privacy_documents"
          ADD CONSTRAINT "membership_documents_privacy_documents_parent_id_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES "public"."membership_documents"("id")
          ON DELETE cascade
          ON UPDATE no action;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'membership_documents_privacy_documents_document_id_media_id_fk'
      ) THEN
        ALTER TABLE "membership_documents_privacy_documents"
          ADD CONSTRAINT "membership_documents_privacy_documents_document_id_media_id_fk"
          FOREIGN KEY ("document_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    INSERT INTO "membership_documents" ("id", "updated_at", "created_at")
    VALUES (1, now(), now())
    ON CONFLICT ("id") DO NOTHING;

    SELECT setval(
      pg_get_serial_sequence('membership_documents', 'id'),
      COALESCE((SELECT MAX("id") FROM "membership_documents"), 1),
      true
    );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "membership_documents_privacy_documents";
    DROP TABLE IF EXISTS "membership_documents";
  `)
}
