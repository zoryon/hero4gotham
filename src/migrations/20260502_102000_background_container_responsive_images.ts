import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_background_container"
      ADD COLUMN IF NOT EXISTS "bg_tab_id" integer,
      ADD COLUMN IF NOT EXISTS "bg_mob_id" integer;

    ALTER TABLE IF EXISTS "_pages_v_blocks_background_container"
      ADD COLUMN IF NOT EXISTS "bg_tab_id" integer,
      ADD COLUMN IF NOT EXISTS "bg_mob_id" integer;

    CREATE INDEX IF NOT EXISTS "bg_container_bg_tab_idx"
      ON "pages_blocks_background_container" USING btree ("bg_tab_id");
    CREATE INDEX IF NOT EXISTS "bg_container_bg_mob_idx"
      ON "pages_blocks_background_container" USING btree ("bg_mob_id");
    CREATE INDEX IF NOT EXISTS "bg_container_v_bg_tab_idx"
      ON "_pages_v_blocks_background_container" USING btree ("bg_tab_id");
    CREATE INDEX IF NOT EXISTS "bg_container_v_bg_mob_idx"
      ON "_pages_v_blocks_background_container" USING btree ("bg_mob_id");

    DO $$
    BEGIN
      ALTER TABLE "pages_blocks_background_container"
        ADD CONSTRAINT "bg_container_bg_tab_media_fk"
        FOREIGN KEY ("bg_tab_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "pages_blocks_background_container"
        ADD CONSTRAINT "bg_container_bg_mob_media_fk"
        FOREIGN KEY ("bg_mob_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "_pages_v_blocks_background_container"
        ADD CONSTRAINT "bg_container_v_bg_tab_media_fk"
        FOREIGN KEY ("bg_tab_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "_pages_v_blocks_background_container"
        ADD CONSTRAINT "bg_container_v_bg_mob_media_fk"
        FOREIGN KEY ("bg_mob_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_background_container"
      DROP CONSTRAINT IF EXISTS "bg_container_bg_tab_media_fk",
      DROP CONSTRAINT IF EXISTS "bg_container_bg_mob_media_fk";

    ALTER TABLE IF EXISTS "_pages_v_blocks_background_container"
      DROP CONSTRAINT IF EXISTS "bg_container_v_bg_tab_media_fk",
      DROP CONSTRAINT IF EXISTS "bg_container_v_bg_mob_media_fk";

    DROP INDEX IF EXISTS "bg_container_bg_tab_idx";
    DROP INDEX IF EXISTS "bg_container_bg_mob_idx";
    DROP INDEX IF EXISTS "bg_container_v_bg_tab_idx";
    DROP INDEX IF EXISTS "bg_container_v_bg_mob_idx";

    ALTER TABLE IF EXISTS "pages_blocks_background_container"
      DROP COLUMN IF EXISTS "bg_tab_id",
      DROP COLUMN IF EXISTS "bg_mob_id";

    ALTER TABLE IF EXISTS "_pages_v_blocks_background_container"
      DROP COLUMN IF EXISTS "bg_tab_id",
      DROP COLUMN IF EXISTS "bg_mob_id";
  `)
}
