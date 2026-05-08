import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const oldStyleColumns = [
  'empty_state_style_font_family',
  'empty_state_style_font_weight',
  'empty_state_style_font_style',
  'empty_state_style_vertical_scale',
  'empty_state_style_font_size_mobile',
  'empty_state_style_font_size_desktop',
  'empty_state_style_letter_spacing',
  'empty_state_style_text_transform',
  'empty_state_style_color_theme',
  'empty_state_style_color_custom',
] as const

const addLabelField = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    ADD COLUMN IF NOT EXISTS "empty_state_label" varchar DEFAULT 'Non sono presenti eventi';
`

const dropLabelField = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    DROP COLUMN IF EXISTS "empty_state_label";
`

const dropOldStyleFields = (tableName: string) => `
  ALTER TABLE IF EXISTS "${tableName}"
    ${oldStyleColumns.map((column) => `DROP COLUMN IF EXISTS "${column}"`).join(',\n    ')};
`

const createEmptyStateTypographyTable = ({
  parentIdType,
  parentTable,
  tableName,
  version = false,
}: {
  parentIdType: 'integer' | 'varchar'
  parentTable: string
  tableName: string
  version?: boolean
}) => `
  CREATE TABLE IF NOT EXISTS "${tableName}" (
    "_order" integer NOT NULL,
    "_parent_id" ${parentIdType} NOT NULL,
    "id" ${version ? `serial PRIMARY KEY` : `varchar PRIMARY KEY`},
    "style_font_family" "ff" DEFAULT 'cinzel',
    "style_font_weight" "fw" DEFAULT 'black',
    "style_font_style" "fst" DEFAULT 'normal',
    "style_vertical_scale" "vs" DEFAULT 'normal',
    "style_font_size_mobile" numeric DEFAULT 14,
    "style_font_size_desktop" numeric DEFAULT 16,
    "style_letter_spacing" "ls" DEFAULT 'tight',
    "style_text_transform" "tt" DEFAULT 'uppercase',
    "style_color_theme" "ct" DEFAULT 'primary',
    "style_color_custom" varchar${version ? ',\n    "_uuid" varchar' : ''},
    CONSTRAINT "${tableName}_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "${parentTable}"("id") ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS "${tableName}_order_idx" ON "${tableName}" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "${tableName}_parent_id_idx" ON "${tableName}" USING btree ("_parent_id");
`

const backfillEmptyStateTypography = ({
  parentTable,
  tableName,
  version = false,
}: {
  parentTable: string
  tableName: string
  version?: boolean
}) => `
  DO $$
  BEGIN
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = '${parentTable}'
        AND column_name = 'empty_state_style_font_family'
    ) THEN
      EXECUTE $SQL$
        INSERT INTO "${tableName}" (
          "_order",
          "_parent_id",
          ${version ? '' : '"id",'}
          "style_font_family",
          "style_font_weight",
          "style_font_style",
          "style_vertical_scale",
          "style_font_size_mobile",
          "style_font_size_desktop",
          "style_letter_spacing",
          "style_text_transform",
          "style_color_theme",
          "style_color_custom"${version ? ', "_uuid"' : ''}
        )
        SELECT
          0,
          "id",
          ${version ? '' : `concat("id", '_empty_state_typography'),`}
          "empty_state_style_font_family",
          "empty_state_style_font_weight",
          "empty_state_style_font_style",
          "empty_state_style_vertical_scale",
          "empty_state_style_font_size_mobile",
          "empty_state_style_font_size_desktop",
          "empty_state_style_letter_spacing",
          "empty_state_style_text_transform",
          "empty_state_style_color_theme",
          "empty_state_style_color_custom"${version ? `, concat("id", '_empty_state_typography')` : ''}
        FROM "${parentTable}"
        WHERE NOT EXISTS (
          SELECT 1
          FROM "${tableName}" child
          WHERE child."_parent_id" = "${parentTable}"."id"
        )
      $SQL$;
    END IF;
  END $$;
`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(addLabelField('pages_blocks_event_list')))
  await db.execute(sql.raw(addLabelField('_pages_v_blocks_event_list')))

  await db.execute(
    sql.raw(
      createEmptyStateTypographyTable({
        parentIdType: 'varchar',
        parentTable: 'pages_blocks_event_list',
        tableName: 'pages_blocks_event_list_empty_state_typography',
      }),
    ),
  )
  await db.execute(
    sql.raw(
      createEmptyStateTypographyTable({
        parentIdType: 'integer',
        parentTable: '_pages_v_blocks_event_list',
        tableName: '_pages_v_blocks_event_list_empty_state_typography',
        version: true,
      }),
    ),
  )

  await db.execute(
    sql.raw(
      backfillEmptyStateTypography({
        parentTable: 'pages_blocks_event_list',
        tableName: 'pages_blocks_event_list_empty_state_typography',
      }),
    ),
  )
  await db.execute(
    sql.raw(
      backfillEmptyStateTypography({
        parentTable: '_pages_v_blocks_event_list',
        tableName: '_pages_v_blocks_event_list_empty_state_typography',
        version: true,
      }),
    ),
  )

  await db.execute(sql.raw(dropOldStyleFields('pages_blocks_event_list')))
  await db.execute(sql.raw(dropOldStyleFields('_pages_v_blocks_event_list')))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw('DROP TABLE IF EXISTS "_pages_v_blocks_event_list_empty_state_typography";'),
  )
  await db.execute(
    sql.raw('DROP TABLE IF EXISTS "pages_blocks_event_list_empty_state_typography";'),
  )
  await db.execute(sql.raw(dropLabelField('_pages_v_blocks_event_list')))
  await db.execute(sql.raw(dropLabelField('pages_blocks_event_list')))
}
