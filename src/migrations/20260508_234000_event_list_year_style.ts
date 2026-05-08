import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const createYearTypographyTable = ({
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
    "id" ${version ? 'serial PRIMARY KEY' : 'varchar PRIMARY KEY'},
    "style_font_size_mobile" numeric DEFAULT 9,
    "style_font_size_desktop" numeric DEFAULT 11,
    "style_vertical_scale" "vs" DEFAULT 'normal',
    "style_color_theme" "ct" DEFAULT 'primary'${version ? ',\n    "_uuid" varchar' : ''},
    CONSTRAINT "${tableName}_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "${parentTable}"("id") ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS "${tableName}_order_idx" ON "${tableName}" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "${tableName}_parent_id_idx" ON "${tableName}" USING btree ("_parent_id");
`

const backfillYearTypography = ({
  parentTable,
  tableName,
  version = false,
}: {
  parentTable: string
  tableName: string
  version?: boolean
}) => `
  INSERT INTO "${tableName}" (
    "_order",
    "_parent_id",
    ${version ? '' : '"id",'}
    "style_font_size_mobile",
    "style_font_size_desktop",
    "style_vertical_scale",
    "style_color_theme"${version ? ', "_uuid"' : ''}
  )
  SELECT
    0,
    "id",
    ${version ? '' : `concat("id", '_year_typography'),`}
    9,
    11,
    'normal',
    'primary'${version ? `, concat("id", '_year_typography')` : ''}
  FROM "${parentTable}"
  WHERE NOT EXISTS (
    SELECT 1
    FROM "${tableName}" child
    WHERE child."_parent_id" = "${parentTable}"."id"
  );
`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    sql.raw(
      createYearTypographyTable({
        parentIdType: 'varchar',
        parentTable: 'pages_blocks_event_list',
        tableName: 'pages_blocks_event_list_year_typography',
      }),
    ),
  )
  await db.execute(
    sql.raw(
      createYearTypographyTable({
        parentIdType: 'integer',
        parentTable: '_pages_v_blocks_event_list',
        tableName: '_pages_v_blocks_event_list_year_typography',
        version: true,
      }),
    ),
  )
  await db.execute(
    sql.raw(
      backfillYearTypography({
        parentTable: 'pages_blocks_event_list',
        tableName: 'pages_blocks_event_list_year_typography',
      }),
    ),
  )
  await db.execute(
    sql.raw(
      backfillYearTypography({
        parentTable: '_pages_v_blocks_event_list',
        tableName: '_pages_v_blocks_event_list_year_typography',
        version: true,
      }),
    ),
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw('DROP TABLE IF EXISTS "_pages_v_blocks_event_list_year_typography";'))
  await db.execute(sql.raw('DROP TABLE IF EXISTS "pages_blocks_event_list_year_typography";'))
}
