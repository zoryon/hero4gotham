import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const ctaColumns = `
  "right_background_id" integer,
  "cta_title" varchar DEFAULT 'Diventa socio',
  "cta_text" varchar DEFAULT 'Sostieni le nostre attivita e fai parte di una comunita che trasforma il diverso in straordinario.',
  "cta_link_type" varchar DEFAULT 'reference',
  "cta_link_new_tab" boolean,
  "cta_link_url" varchar,
  "cta_link_label" varchar,
  "cta_link_fallback_label" varchar DEFAULT 'Unisciti a noi',
  "cta_link_background_image_id" integer,
  "cta_accent_label" varchar DEFAULT 'Fai la differenza',
  "cta_glyph_id" integer,
  "cta_text_color" varchar DEFAULT '#ffffff',
  "cta_button_background_color" varchar DEFAULT '#84cc16',
  "cta_button_text_color" varchar DEFAULT '#251414',
  "cta_title_font_family" varchar DEFAULT 'cinzel',
  "cta_title_font_size" varchar DEFAULT 'compact',
  "cta_title_font_weight" varchar DEFAULT 'black',
  "cta_title_font_style" varchar DEFAULT 'normal',
  "cta_title_vertical_scale" varchar DEFAULT 'normal',
  "cta_title_letter_spacing" varchar DEFAULT 'tight',
  "cta_text_font_family" varchar DEFAULT 'geistSans',
  "cta_text_font_size" varchar DEFAULT 'small',
  "cta_text_font_weight" varchar DEFAULT 'regular',
  "cta_text_font_style" varchar DEFAULT 'normal',
  "cta_text_vertical_scale" varchar DEFAULT 'normal',
  "cta_text_letter_spacing" varchar DEFAULT 'tight',
  "cta_button_font_family" varchar DEFAULT 'cinzel',
  "cta_button_font_size" varchar DEFAULT 'small',
  "cta_button_font_weight" varchar DEFAULT 'black',
  "cta_button_font_style" varchar DEFAULT 'normal',
  "cta_button_vertical_scale" varchar DEFAULT 'normal',
  "cta_button_letter_spacing" varchar DEFAULT 'tight',
  "layout_size" "sz" DEFAULT 'default',
  "layout_margin_top" "mt" DEFAULT 'default',
  "layout_margin_right" "mr" DEFAULT 'default',
  "layout_margin_bottom" "mb" DEFAULT 'default',
  "layout_margin_left" "ml" DEFAULT 'default',
  "layout_padding_top" "pt" DEFAULT 'none',
  "layout_padding_right" "pr" DEFAULT 'none',
  "layout_padding_bottom" "pb" DEFAULT 'none',
  "layout_padding_left" "pl" DEFAULT 'none',
  "layout_scribble_border" boolean DEFAULT false`

const createCtaTable = (tableName: string, parentTable: string, version = false) => `
  CREATE TABLE IF NOT EXISTS "${tableName}" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" ${version ? 'serial PRIMARY KEY' : 'varchar PRIMARY KEY'},
    ${ctaColumns},
    ${version ? '"_uuid" varchar,' : ''}
    "block_name" varchar
  );

  CREATE INDEX IF NOT EXISTS "${tableName}_order_idx" ON "${tableName}" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "${tableName}_parent_id_idx" ON "${tableName}" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "${tableName}_path_idx" ON "${tableName}" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "${tableName}_right_background_idx" ON "${tableName}" USING btree ("right_background_id");
  CREATE INDEX IF NOT EXISTS "${tableName}_cta_link_background_image_idx" ON "${tableName}" USING btree ("cta_link_background_image_id");
  CREATE INDEX IF NOT EXISTS "${tableName}_cta_glyph_idx" ON "${tableName}" USING btree ("cta_glyph_id");

  DO $$
  BEGIN
    ALTER TABLE "${tableName}"
      ADD CONSTRAINT "${tableName}_right_background_fk"
      FOREIGN KEY ("right_background_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;

  DO $$
  BEGIN
    ALTER TABLE "${tableName}"
      ADD CONSTRAINT "${tableName}_cta_link_background_image_fk"
      FOREIGN KEY ("cta_link_background_image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;

  DO $$
  BEGIN
    ALTER TABLE "${tableName}"
      ADD CONSTRAINT "${tableName}_cta_glyph_fk"
      FOREIGN KEY ("cta_glyph_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;

  DO $$
  BEGIN
    ALTER TABLE "${tableName}"
      ADD CONSTRAINT "${tableName}_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "${parentTable}"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;
`

const ensureSourceColumns = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    ADD COLUMN IF NOT EXISTS "cta_link_background_image_id" integer,
    ADD COLUMN IF NOT EXISTS "cta_accent_label" varchar DEFAULT 'Fai la differenza';
`

const pageCustomBlockTables = [
  'act_detail_grid',
  'contact_msg',
  'event_filters',
  'event_gallery',
  'faq_accordion',
  'member_app',
  'pgs',
]

const pageVersionCustomBlockTables = [
  '_act_detail_grid_v',
  '_contact_msg_v',
  '_event_filters_v',
  '_event_gallery_v',
  '_faq_accordion_v',
  '_member_app_v',
  '_pgs_v',
]

const splitExistingBlocks = ({
  ctaTable,
  customBlockTables,
  relsTable,
  sourceTable,
  version = false,
}: {
  ctaTable: string
  customBlockTables: string[]
  relsTable: string
  sourceTable: string
  version?: boolean
}) => `
  DO $$
  DECLARE
    rec record;
    block_table record;
    block_table_prefix text := '${version ? '_pages_v_blocks_' : 'pages_blocks_'}';
    old_prefix text;
    old_prefix_pattern text;
    new_prefix text;
    source_block_id text;
  BEGIN
    IF to_regclass('public.${sourceTable}') IS NULL OR to_regclass('public.${ctaTable}') IS NULL THEN
      RETURN;
    END IF;

    FOR rec IN
      EXECUTE format(
        ${
          version
            ? `'SELECT src.* FROM %I src WHERE NOT EXISTS (SELECT 1 FROM %I existing WHERE existing."_uuid" = COALESCE(src."_uuid", src."id"::text) || %L) ORDER BY src."_parent_id", src."_path", src."_order" DESC'`
            : `'SELECT src.* FROM %I src WHERE NOT EXISTS (SELECT 1 FROM %I existing WHERE existing."id" = src."id"::text || %L) ORDER BY src."_parent_id", src."_path", src."_order" DESC'`
        },
        '${sourceTable}',
        '${ctaTable}',
        '-cta'
      )
    LOOP
      source_block_id := ${version ? `COALESCE(rec."_uuid", rec."id"::text)` : `rec."id"::text`};

      FOR block_table IN
        SELECT c.table_name AS tablename
        FROM information_schema.columns c
        WHERE c.table_schema = 'public'
          AND (
            left(c.table_name, length(block_table_prefix)) = block_table_prefix
            OR c.table_name = ANY(ARRAY[${customBlockTables
              .map((tableName) => `'${tableName}'`)
              .join(', ')}]::text[])
          )
          AND c.column_name IN ('_parent_id', '_path', '_order')
        GROUP BY c.table_name
        HAVING count(DISTINCT c.column_name) = 3
      LOOP
        EXECUTE format(
          'UPDATE %I SET "_order" = "_order" + 1 WHERE "_parent_id" = $1 AND "_path" = $2 AND "_order" > $3',
          block_table.tablename
        )
        USING rec."_parent_id", rec."_path", rec."_order";
      END LOOP;

      old_prefix := rec."_path" || '.' || rec."_order";
      new_prefix := rec."_path" || '.' || (rec."_order" + 1);
      old_prefix_pattern := replace(old_prefix, '.', E'\\.');

      EXECUTE format(
        'UPDATE %I
         SET path = regexp_replace(
           path,
           $1,
           $2 || ((regexp_match(path, $1))[1]::integer + 1)::text || ''.''
         )
         WHERE parent_id = $3
           AND path ~ $1
           AND (regexp_match(path, $1))[1]::integer > $4',
        '${relsTable}'
      )
      USING '^' || replace(rec."_path", '.', E'\\.') || '\\.([0-9]+)\\.', rec."_path" || '.', rec."_parent_id", rec."_order";

      EXECUTE format(
        ${
          version
            ? `'INSERT INTO %I (
              "_order", "_parent_id", "_path",
              "right_background_id", "cta_title", "cta_text", "cta_link_type", "cta_link_new_tab",
              "cta_link_url", "cta_link_label", "cta_link_fallback_label",
              "cta_link_background_image_id", "cta_accent_label", "cta_glyph_id",
              "cta_text_color", "cta_button_background_color", "cta_button_text_color",
              "cta_title_font_family", "cta_title_font_size", "cta_title_font_weight",
              "cta_title_font_style", "cta_title_vertical_scale", "cta_title_letter_spacing",
              "cta_text_font_family", "cta_text_font_size", "cta_text_font_weight",
              "cta_text_font_style", "cta_text_vertical_scale", "cta_text_letter_spacing",
              "cta_button_font_family", "cta_button_font_size", "cta_button_font_weight",
              "cta_button_font_style", "cta_button_vertical_scale", "cta_button_letter_spacing",
              "_uuid", "block_name"
            ) VALUES (
              $1, $2, $3,
              $4, $5, $6, $7, $8,
              $9, $10, $11,
              $12, $13, $14,
              $15, $16, $17,
              $18, $19, $20,
              $21, $22, $23,
              $24, $25, $26,
              $27, $28, $29,
              $30, $31, $32,
              $33, $34, $35,
              $36, $37
            )'`
            : `'INSERT INTO %I (
              "_order", "_parent_id", "_path", "id",
              "right_background_id", "cta_title", "cta_text", "cta_link_type", "cta_link_new_tab",
              "cta_link_url", "cta_link_label", "cta_link_fallback_label",
              "cta_link_background_image_id", "cta_accent_label", "cta_glyph_id",
              "cta_text_color", "cta_button_background_color", "cta_button_text_color",
              "cta_title_font_family", "cta_title_font_size", "cta_title_font_weight",
              "cta_title_font_style", "cta_title_vertical_scale", "cta_title_letter_spacing",
              "cta_text_font_family", "cta_text_font_size", "cta_text_font_weight",
              "cta_text_font_style", "cta_text_vertical_scale", "cta_text_letter_spacing",
              "cta_button_font_family", "cta_button_font_size", "cta_button_font_weight",
              "cta_button_font_style", "cta_button_vertical_scale", "cta_button_letter_spacing",
              "block_name"
            ) VALUES (
              $1, $2, $3, $4,
              $5, $6, $7, $8, $9,
              $10, $11, $12,
              $13, $14, $15,
              $16, $17, $18,
              $19, $20, $21,
              $22, $23, $24,
              $25, $26, $27,
              $28, $29, $30,
              $31, $32, $33,
              $34, $35, $36,
              $37
            ) ON CONFLICT ("id") DO NOTHING'`
        },
        '${ctaTable}'
      )
      USING
        rec."_order" + 1,
        rec."_parent_id",
        rec."_path",
        ${version ? '' : `source_block_id || '-cta',`}
        rec."right_background_id",
        rec."cta_title",
        rec."cta_text",
        rec."cta_link_type"::text,
        rec."cta_link_new_tab",
        rec."cta_link_url",
        rec."cta_link_label",
        rec."cta_link_fallback_label",
        rec."cta_link_background_image_id",
        rec."cta_accent_label",
        rec."cta_glyph_id",
        rec."cta_text_color",
        rec."cta_button_background_color",
        rec."cta_button_text_color",
        rec."cta_title_font_family"::text,
        rec."cta_title_font_size"::text,
        rec."cta_title_font_weight"::text,
        rec."cta_title_font_style"::text,
        rec."cta_title_vertical_scale"::text,
        rec."cta_title_letter_spacing"::text,
        rec."cta_text_font_family"::text,
        rec."cta_text_font_size"::text,
        rec."cta_text_font_weight"::text,
        rec."cta_text_font_style"::text,
        rec."cta_text_vertical_scale"::text,
        rec."cta_text_letter_spacing"::text,
        rec."cta_button_font_family"::text,
        rec."cta_button_font_size"::text,
        rec."cta_button_font_weight"::text,
        rec."cta_button_font_style"::text,
        rec."cta_button_vertical_scale"::text,
        rec."cta_button_letter_spacing"::text,
        ${version ? `source_block_id || '-cta',` : ''}
        CASE
          WHEN rec."block_name" IS NULL THEN NULL
          ELSE rec."block_name" || ' CTA'
        END;

      EXECUTE format(
        'INSERT INTO %I ("order", "parent_id", "path", "pages_id", "posts_id", "categories_id", "events_id", "media_id")
         SELECT src."order", src."parent_id", regexp_replace(src."path", $1, $2),
           src."pages_id", src."posts_id", src."categories_id", src."events_id", src."media_id"
         FROM %I src
         WHERE src."parent_id" = $3
           AND src."path" ~ $1
           AND src."path" LIKE $4
           AND NOT EXISTS (
             SELECT 1 FROM %I existing
             WHERE existing."parent_id" = src."parent_id"
               AND existing."path" = regexp_replace(src."path", $1, $2)
           )',
        '${relsTable}',
        '${relsTable}',
        '${relsTable}'
      )
      USING '^' || old_prefix_pattern || '\\.', new_prefix || '.', rec."_parent_id", old_prefix || '.ctaLink.%';
    END LOOP;
  END $$;
`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(ensureSourceColumns('pages_blocks_upcoming_events')))
  await db.execute(sql.raw(ensureSourceColumns('_pages_v_blocks_upcoming_events')))
  await db.execute(sql.raw(createCtaTable('pages_blocks_ue_cta', 'pages')))
  await db.execute(sql.raw(createCtaTable('_pages_v_blocks_ue_cta', '_pages_v', true)))
  await db.execute(
    sql.raw(
      splitExistingBlocks({
        ctaTable: 'pages_blocks_ue_cta',
        customBlockTables: pageCustomBlockTables,
        relsTable: 'pages_rels',
        sourceTable: 'pages_blocks_upcoming_events',
      }),
    ),
  )
  await db.execute(
    sql.raw(
      splitExistingBlocks({
        ctaTable: '_pages_v_blocks_ue_cta',
        customBlockTables: pageVersionCustomBlockTables,
        relsTable: '_pages_v_rels',
        sourceTable: '_pages_v_blocks_upcoming_events',
        version: true,
      }),
    ),
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw('DROP TABLE IF EXISTS "_pages_v_blocks_ue_cta" CASCADE;'))
  await db.execute(sql.raw('DROP TABLE IF EXISTS "pages_blocks_ue_cta" CASCADE;'))
}
