import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_background" (
      "id" serial PRIMARY KEY NOT NULL,
      "background_image_id" integer,
      "bg_tab_id" integer,
      "bg_mob_id" integer,
      "image_quality" numeric DEFAULT 95,
      "image_position_mobile" varchar DEFAULT 'center',
      "image_position_tablet" varchar DEFAULT 'center',
      "image_position_desktop" varchar DEFAULT 'center',
      "overlay" varchar DEFAULT 'medium',
      "width" varchar DEFAULT 'full',
      "padding" varchar DEFAULT 'medium',
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE INDEX IF NOT EXISTS "site_background_background_image_idx"
      ON "site_background" USING btree ("background_image_id");
    CREATE INDEX IF NOT EXISTS "site_background_bg_tab_idx"
      ON "site_background" USING btree ("bg_tab_id");
    CREATE INDEX IF NOT EXISTS "site_background_bg_mob_idx"
      ON "site_background" USING btree ("bg_mob_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'site_background_background_image_id_media_id_fk'
      ) THEN
        ALTER TABLE "site_background"
          ADD CONSTRAINT "site_background_background_image_id_media_id_fk"
          FOREIGN KEY ("background_image_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'site_background_bg_tab_id_media_id_fk'
      ) THEN
        ALTER TABLE "site_background"
          ADD CONSTRAINT "site_background_bg_tab_id_media_id_fk"
          FOREIGN KEY ("bg_tab_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'site_background_bg_mob_id_media_id_fk'
      ) THEN
        ALTER TABLE "site_background"
          ADD CONSTRAINT "site_background_bg_mob_id_media_id_fk"
          FOREIGN KEY ("bg_mob_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM "site_background" WHERE "id" = 1)
        AND to_regclass('public.pages_blocks_background_container') IS NOT NULL
      THEN
        EXECUTE $seed$
          INSERT INTO "site_background" (
            "id",
            "background_image_id",
            "bg_tab_id",
            "bg_mob_id",
            "image_quality",
            "image_position_mobile",
            "image_position_tablet",
            "image_position_desktop",
            "overlay",
            "width",
            "padding",
            "updated_at",
            "created_at"
          )
          SELECT
            1,
            "background_image_id",
            "bg_tab_id",
            "bg_mob_id",
            COALESCE("image_quality", 95),
            COALESCE("image_position_mobile"::text, 'center'),
            COALESCE("image_position_tablet"::text, 'center'),
            COALESCE("image_position_desktop"::text, 'center'),
            COALESCE("overlay"::text, 'medium'),
            COALESCE("width"::text, 'full'),
            COALESCE("padding"::text, 'medium'),
            now(),
            now()
          FROM "pages_blocks_background_container"
          ORDER BY "_parent_id", "_path", "_order"
          LIMIT 1
          ON CONFLICT ("id") DO NOTHING
        $seed$;
      END IF;

      IF NOT EXISTS (SELECT 1 FROM "site_background" WHERE "id" = 1) THEN
        INSERT INTO "site_background" (
          "id",
          "background_image_id",
          "bg_tab_id",
          "bg_mob_id",
          "image_quality",
          "image_position_mobile",
          "image_position_tablet",
          "image_position_desktop",
          "overlay",
          "width",
          "padding",
          "updated_at",
          "created_at"
        )
        VALUES (
          1,
          (SELECT "id" FROM "media" WHERE "filename" = 'desktop-hero-bg-1.png' LIMIT 1),
          (SELECT "id" FROM "media" WHERE "filename" = 'tablet-hero-bg-1.png' LIMIT 1),
          (SELECT "id" FROM "media" WHERE "filename" = 'mobile-hero-bg-1.png' LIMIT 1),
          95,
          'center',
          'center',
          'center',
          'light',
          'full',
          'small',
          now(),
          now()
        )
        ON CONFLICT ("id") DO NOTHING;
      END IF;

      PERFORM setval(
        pg_get_serial_sequence('site_background', 'id'),
        COALESCE((SELECT MAX("id") FROM "site_background"), 1),
        true
      );
    END $$;

    CREATE OR REPLACE FUNCTION unwrap_background_container_blocks(
      bg_table_name text,
      block_table_prefix text
    ) RETURNS void
    LANGUAGE plpgsql
    AS $function$
    DECLARE
      bg_record record;
      block_table record;
      child_order_record record;
      child_count integer;
      order_delta integer;
      source_prefix text;
      target_prefix text;
      source_child_prefix text;
      target_child_prefix text;
    BEGIN
      IF to_regclass('public.' || bg_table_name) IS NULL THEN
        RETURN;
      END IF;

      CREATE TEMP TABLE IF NOT EXISTS background_container_migration_child_orders (
        order_num integer
      ) ON COMMIT DROP;

      FOR bg_record IN EXECUTE format(
        'SELECT "_parent_id" AS parent_id, "_path" AS path, "_order" AS block_order
         FROM %I
         ORDER BY "_parent_id", "_path", "_order" DESC',
        bg_table_name
      ) LOOP
        source_prefix := bg_record.path || '.' || GREATEST(bg_record.block_order - 1, 0)::text || '.blocks';
        target_prefix := bg_record.path;

        TRUNCATE background_container_migration_child_orders;

        FOR block_table IN
          SELECT c.table_name
          FROM information_schema.columns c
          WHERE c.table_schema = 'public'
            AND (
              left(c.table_name, length(block_table_prefix)) = block_table_prefix
              OR (
                block_table_prefix = 'pages_blocks_'
                AND c.table_name IN (
                  'act_detail_grid',
                  'contact_msg',
                  'event_filters',
                  'event_gallery',
                  'faq_accordion',
                  'member_app'
                )
              )
              OR (
                block_table_prefix = '_pages_v_blocks_'
                AND c.table_name IN (
                  '_act_detail_grid_v',
                  '_contact_msg_v',
                  '_event_filters_v',
                  '_event_gallery_v',
                  '_faq_accordion_v',
                  '_member_app_v'
                )
              )
            )
            AND c.table_name <> bg_table_name
            AND c.column_name IN ('_parent_id', '_path', '_order')
          GROUP BY c.table_name
          HAVING count(DISTINCT c.column_name) = 3
          ORDER BY c.table_name
        LOOP
          EXECUTE format(
            'INSERT INTO background_container_migration_child_orders ("order_num")
             SELECT DISTINCT "_order"
             FROM %I
             WHERE "_parent_id" = $1 AND "_path" = $2',
            block_table.table_name
          )
          USING bg_record.parent_id, source_prefix;
        END LOOP;

        SELECT count(DISTINCT "order_num")
        INTO child_count
        FROM background_container_migration_child_orders;

        order_delta := GREATEST(child_count - 1, 0);

        IF order_delta > 0 THEN
          FOR block_table IN
            SELECT c.table_name
            FROM information_schema.columns c
            WHERE c.table_schema = 'public'
              AND (
                left(c.table_name, length(block_table_prefix)) = block_table_prefix
                OR (
                  block_table_prefix = 'pages_blocks_'
                  AND c.table_name IN (
                    'act_detail_grid',
                    'contact_msg',
                    'event_filters',
                    'event_gallery',
                    'faq_accordion',
                    'member_app'
                  )
                )
                OR (
                  block_table_prefix = '_pages_v_blocks_'
                  AND c.table_name IN (
                    '_act_detail_grid_v',
                    '_contact_msg_v',
                    '_event_filters_v',
                    '_event_gallery_v',
                    '_faq_accordion_v',
                    '_member_app_v'
                  )
                )
              )
              AND c.table_name <> bg_table_name
              AND c.column_name IN ('_parent_id', '_path', '_order')
            GROUP BY c.table_name
            HAVING count(DISTINCT c.column_name) = 3
            ORDER BY c.table_name
          LOOP
            EXECUTE format(
              'UPDATE %I
               SET "_order" = "_order" + $1
               WHERE "_parent_id" = $2 AND "_path" = $3 AND "_order" > $4',
              block_table.table_name
            )
            USING order_delta, bg_record.parent_id, target_prefix, bg_record.block_order;
          END LOOP;
        END IF;

        FOR child_order_record IN
          SELECT DISTINCT "order_num"
          FROM background_container_migration_child_orders
          ORDER BY "order_num" DESC
        LOOP
          source_child_prefix := source_prefix || '.' ||
            GREATEST(child_order_record.order_num - 1, 0)::text || '.blocks';
          target_child_prefix := target_prefix || '.' ||
            GREATEST(bg_record.block_order + child_order_record.order_num - 2, 0)::text || '.blocks';

          FOR block_table IN
            SELECT c.table_name
            FROM information_schema.columns c
            WHERE c.table_schema = 'public'
              AND (
                left(c.table_name, length(block_table_prefix)) = block_table_prefix
                OR (
                  block_table_prefix = 'pages_blocks_'
                  AND c.table_name IN (
                    'act_detail_grid',
                    'contact_msg',
                    'event_filters',
                    'event_gallery',
                    'faq_accordion',
                    'member_app'
                  )
                )
                OR (
                  block_table_prefix = '_pages_v_blocks_'
                  AND c.table_name IN (
                    '_act_detail_grid_v',
                    '_contact_msg_v',
                    '_event_filters_v',
                    '_event_gallery_v',
                    '_faq_accordion_v',
                    '_member_app_v'
                  )
                )
              )
              AND c.table_name <> bg_table_name
              AND c.column_name IN ('_parent_id', '_path', '_order')
            GROUP BY c.table_name
            HAVING count(DISTINCT c.column_name) = 3
            ORDER BY c.table_name
          LOOP
            EXECUTE format(
              'UPDATE %I
               SET "_path" = $1 || substring("_path" from $2)
               WHERE "_parent_id" = $3 AND ("_path" = $4 OR "_path" LIKE $5)',
              block_table.table_name
            )
            USING
              target_child_prefix,
              length(source_child_prefix) + 1,
              bg_record.parent_id,
              source_child_prefix,
              source_child_prefix || '.%';
          END LOOP;
        END LOOP;

        FOR block_table IN
          SELECT c.table_name
          FROM information_schema.columns c
          WHERE c.table_schema = 'public'
            AND (
              left(c.table_name, length(block_table_prefix)) = block_table_prefix
              OR (
                block_table_prefix = 'pages_blocks_'
                AND c.table_name IN (
                  'act_detail_grid',
                  'contact_msg',
                  'event_filters',
                  'event_gallery',
                  'faq_accordion',
                  'member_app'
                )
              )
              OR (
                block_table_prefix = '_pages_v_blocks_'
                AND c.table_name IN (
                  '_act_detail_grid_v',
                  '_contact_msg_v',
                  '_event_filters_v',
                  '_event_gallery_v',
                  '_faq_accordion_v',
                  '_member_app_v'
                )
              )
            )
            AND c.table_name <> bg_table_name
            AND c.column_name IN ('_parent_id', '_path', '_order')
          GROUP BY c.table_name
          HAVING count(DISTINCT c.column_name) = 3
          ORDER BY c.table_name
        LOOP
          EXECUTE format(
            'UPDATE %I
             SET "_order" = $1 + "_order" - 1, "_path" = $2
             WHERE "_parent_id" = $3 AND "_path" = $4',
            block_table.table_name
          )
          USING bg_record.block_order, target_prefix, bg_record.parent_id, source_prefix;
        END LOOP;
      END LOOP;

      EXECUTE format('DELETE FROM %I', bg_table_name);
    END;
    $function$;

    CREATE OR REPLACE FUNCTION unwrap_background_container_prefix(
      source_prefix text,
      target_prefix text,
      block_table_prefix text
    ) RETURNS void
    LANGUAGE plpgsql
    AS $function$
    DECLARE
      block_table record;
    BEGIN
      FOR block_table IN
        SELECT c.table_name
        FROM information_schema.columns c
        WHERE c.table_schema = 'public'
          AND (
            left(c.table_name, length(block_table_prefix)) = block_table_prefix
            OR (
              block_table_prefix = 'pages_blocks_'
              AND c.table_name IN (
                'act_detail_grid',
                'contact_msg',
                'event_filters',
                'event_gallery',
                'faq_accordion',
                'member_app'
              )
            )
            OR (
              block_table_prefix = '_pages_v_blocks_'
              AND c.table_name IN (
                '_act_detail_grid_v',
                '_contact_msg_v',
                '_event_filters_v',
                '_event_gallery_v',
                '_faq_accordion_v',
                '_member_app_v'
              )
            )
          )
          AND c.table_name NOT LIKE '%background_container%'
          AND c.column_name IN ('_path')
        GROUP BY c.table_name
        HAVING count(DISTINCT c.column_name) = 1
        ORDER BY c.table_name
      LOOP
        EXECUTE format(
          'UPDATE %I
           SET "_path" = $1 || substring("_path" from $2)
           WHERE "_path" = $3 OR "_path" LIKE $4',
          block_table.table_name
        )
        USING
          target_prefix,
          length(source_prefix) + 1,
          source_prefix,
          source_prefix || '.%';
      END LOOP;
    END;
    $function$;

    DO $$
    BEGIN
      IF to_regclass('public.pages_blocks_background_container') IS NOT NULL THEN
        PERFORM unwrap_background_container_blocks(
          'pages_blocks_background_container',
          'pages_blocks_'
        );
      ELSE
        PERFORM unwrap_background_container_prefix(
          'layout.0.blocks',
          'layout',
          'pages_blocks_'
        );
      END IF;

      IF to_regclass('public._pages_v_blocks_background_container') IS NOT NULL THEN
        PERFORM unwrap_background_container_blocks(
          '_pages_v_blocks_background_container',
          '_pages_v_blocks_'
        );
      ELSE
        PERFORM unwrap_background_container_prefix(
          'version.layout.0.blocks',
          'version.layout',
          '_pages_v_blocks_'
        );
      END IF;
    END $$;

    DROP FUNCTION IF EXISTS unwrap_background_container_blocks(text, text);
    DROP FUNCTION IF EXISTS unwrap_background_container_prefix(text, text, text);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "site_background";
  `)
}
