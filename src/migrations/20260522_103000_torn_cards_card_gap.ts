import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const gapValues = "'none', 'xs', 'xxs', 'sm', 'md', 'lg', 'xl'"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    sql.raw(`
      DO $$ BEGIN
        CREATE TYPE "public"."enum_pages_blocks_torn_cards_gap" AS ENUM(${gapValues});
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      DO $$ BEGIN
        CREATE TYPE "public"."enum__pages_v_blocks_torn_cards_gap" AS ENUM(${gapValues});
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      ALTER TABLE IF EXISTS "pages_blocks_torn_cards"
        ADD COLUMN IF NOT EXISTS "gap" "enum_pages_blocks_torn_cards_gap" DEFAULT 'none';

      ALTER TABLE IF EXISTS "_pages_v_blocks_torn_cards"
        ADD COLUMN IF NOT EXISTS "gap" "enum__pages_v_blocks_torn_cards_gap" DEFAULT 'none';
    `),
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw(`
      ALTER TABLE IF EXISTS "_pages_v_blocks_torn_cards" DROP COLUMN IF EXISTS "gap";
      ALTER TABLE IF EXISTS "pages_blocks_torn_cards" DROP COLUMN IF EXISTS "gap";

      DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_torn_cards_gap";
      DROP TYPE IF EXISTS "public"."enum_pages_blocks_torn_cards_gap";
    `),
  )
}
