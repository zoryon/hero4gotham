import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    sql.raw(`
      DO $$ BEGIN
        CREATE TYPE "public"."enum_footer_legal_links_link_type" AS ENUM('reference', 'custom');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      ALTER TABLE IF EXISTS "footer"
        ADD COLUMN IF NOT EXISTS "eyebrow" varchar DEFAULT 'ASSOCIAZIONE CULTURALE',
        ADD COLUMN IF NOT EXISTS "brand_name" varchar DEFAULT 'IL SORRISO STORTO',
        ADD COLUMN IF NOT EXISTS "description" varchar DEFAULT 'Un luogo storto al punto giusto per arte, incontri, giochi e idee fuori asse.',
        ADD COLUMN IF NOT EXISTS "legal_note" varchar DEFAULT 'Associazione culturale. Tutti i diritti riservati.';

      CREATE TABLE IF NOT EXISTS "footer_legal_links" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" varchar PRIMARY KEY NOT NULL,
        "link_type" "enum_footer_legal_links_link_type" DEFAULT 'reference',
        "link_new_tab" boolean,
        "link_url" varchar,
        "link_label" varchar NOT NULL
      );

      CREATE INDEX IF NOT EXISTS "footer_legal_links_order_idx"
        ON "footer_legal_links" USING btree ("_order");

      CREATE INDEX IF NOT EXISTS "footer_legal_links_parent_id_idx"
        ON "footer_legal_links" USING btree ("_parent_id");

      DO $$ BEGIN
        ALTER TABLE "footer_legal_links"
          ADD CONSTRAINT "footer_legal_links_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "footer"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      INSERT INTO "footer_legal_links" ("_order", "_parent_id", "id", "link_type", "link_new_tab", "link_url", "link_label")
      SELECT 0, "footer"."id", 'privacy-policy', 'custom', false, '/privacy-policy', 'Privacy Policy'
      FROM "footer"
      WHERE NOT EXISTS (
        SELECT 1 FROM "footer_legal_links" WHERE "footer_legal_links"."_parent_id" = "footer"."id"
      );

      INSERT INTO "footer_legal_links" ("_order", "_parent_id", "id", "link_type", "link_new_tab", "link_url", "link_label")
      SELECT 1, "footer"."id", 'privacy-preferences', 'custom', false, '/preferenze-privacy', 'Le tue preferenze relative alla privacy'
      FROM "footer"
      WHERE NOT EXISTS (
        SELECT 1
        FROM "footer_legal_links"
        WHERE "footer_legal_links"."_parent_id" = "footer"."id"
          AND "footer_legal_links"."id" = 'privacy-preferences'
      );
    `),
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw(`
      DROP TABLE IF EXISTS "footer_legal_links" CASCADE;

      ALTER TABLE IF EXISTS "footer"
        DROP COLUMN IF EXISTS "legal_note",
        DROP COLUMN IF EXISTS "description",
        DROP COLUMN IF EXISTS "brand_name",
        DROP COLUMN IF EXISTS "eyebrow";

      DROP TYPE IF EXISTS "public"."enum_footer_legal_links_link_type" CASCADE;
    `),
  )
}
