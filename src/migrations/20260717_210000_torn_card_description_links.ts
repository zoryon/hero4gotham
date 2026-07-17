import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    sql.raw(`
      DO $$ BEGIN
        CREATE TYPE "public"."enum_pages_blocks_torn_cards_items_description_link_type" AS ENUM('whatsapp', 'email', 'phone');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      DO $$ BEGIN
        CREATE TYPE "public"."enum__pages_v_blocks_torn_cards_items_description_link_type" AS ENUM('whatsapp', 'email', 'phone');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      ALTER TABLE IF EXISTS "pages_blocks_torn_cards_items"
        ADD COLUMN IF NOT EXISTS "description_link_text" varchar,
        ADD COLUMN IF NOT EXISTS "description_link_type" "enum_pages_blocks_torn_cards_items_description_link_type",
        ADD COLUMN IF NOT EXISTS "description_link_value" varchar;

      ALTER TABLE IF EXISTS "_pages_v_blocks_torn_cards_items"
        ADD COLUMN IF NOT EXISTS "description_link_text" varchar,
        ADD COLUMN IF NOT EXISTS "description_link_type" "enum__pages_v_blocks_torn_cards_items_description_link_type",
        ADD COLUMN IF NOT EXISTS "description_link_value" varchar;
    `),
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw(`
      ALTER TABLE IF EXISTS "_pages_v_blocks_torn_cards_items"
        DROP COLUMN IF EXISTS "description_link_value",
        DROP COLUMN IF EXISTS "description_link_type",
        DROP COLUMN IF EXISTS "description_link_text";

      ALTER TABLE IF EXISTS "pages_blocks_torn_cards_items"
        DROP COLUMN IF EXISTS "description_link_value",
        DROP COLUMN IF EXISTS "description_link_type",
        DROP COLUMN IF EXISTS "description_link_text";

      DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_torn_cards_items_description_link_type";
      DROP TYPE IF EXISTS "public"."enum_pages_blocks_torn_cards_items_description_link_type";
    `),
  )
}
