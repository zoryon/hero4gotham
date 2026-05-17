import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const tables = ['member_app', '_member_app_v']

const columns = [
  ['enable_statute_declaration_trigger_link', 'boolean DEFAULT false'],
  ['statute_declaration_trigger_link_url', 'varchar'],
  ['enable_purpose_declaration_trigger_link', 'boolean DEFAULT false'],
  ['purpose_declaration_trigger_link_url', 'varchar'],
  ['enable_truth_declaration_trigger_link', 'boolean DEFAULT false'],
  ['truth_declaration_trigger_link_url', 'varchar'],
  ['enable_media_consent_trigger_link', 'boolean DEFAULT false'],
  ['media_consent_trigger_link_url', 'varchar'],
] as const

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    sql.raw(`
      ${tables
        .map(
          (table) => `
            ALTER TABLE IF EXISTS "${table}"
              ${columns
                .map(([name, type]) => `ADD COLUMN IF NOT EXISTS "${name}" ${type}`)
                .join(',\n              ')};
          `,
        )
        .join('\n')}
    `),
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw(`
      ${tables
        .map(
          (table) => `
            ALTER TABLE IF EXISTS "${table}"
              ${columns
                .map(([name]) => `DROP COLUMN IF EXISTS "${name}"`)
                .join(',\n              ')};
          `,
        )
        .join('\n')}
    `),
  )
}
