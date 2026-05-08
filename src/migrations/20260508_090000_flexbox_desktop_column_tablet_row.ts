import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const directionValue = 'desktopColumnTabletRowMobileColumn'

const directionEnums = [
  'enum_pages_blocks_flexbox_direction',
  'enum__pages_v_blocks_flexbox_direction',
] as const

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const enumName of directionEnums) {
    await db.execute(
      sql.raw(`ALTER TYPE "public"."${enumName}" ADD VALUE IF NOT EXISTS '${directionValue}';`),
    )
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "pages_blocks_flexbox"
    SET "direction" = 'column'
    WHERE "direction"::text = ${directionValue};

    UPDATE "_pages_v_blocks_flexbox"
    SET "direction" = 'column'
    WHERE "direction"::text = ${directionValue};
  `)
}
