import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const tables = ['contact_msg', '_contact_msg_v', 'member_app', '_member_app_v']

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    sql.raw(`
      ${tables
        .map(
          (table) => `
            ALTER TABLE IF EXISTS "${table}"
              ADD COLUMN IF NOT EXISTS "enable_privacy_trigger_link" boolean DEFAULT false,
              ADD COLUMN IF NOT EXISTS "privacy_trigger_link_url" varchar;
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
              DROP COLUMN IF EXISTS "privacy_trigger_link_url",
              DROP COLUMN IF EXISTS "enable_privacy_trigger_link";
          `,
        )
        .join('\n')}
    `),
  )
}
