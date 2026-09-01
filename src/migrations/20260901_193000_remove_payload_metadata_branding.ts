import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const legacyDescription = 'An open-source website built with Payload and Next.js.'
const replacementDescription =
  'Hero 4 Gotham, associazione culturale dedicata ad arte, creatività, eventi e partecipazione.'

const normalizeMetadata = (
  tableName: 'pages' | 'posts' | 'search' | '_pages_v' | '_posts_v',
  titleColumn: 'meta_title' | 'version_meta_title',
  descriptionColumn: 'meta_description' | 'version_meta_description',
) =>
  sql.raw(`
    UPDATE "${tableName}"
    SET "${titleColumn}" = COALESCE(
      NULLIF(
        btrim(
          regexp_replace(
            "${titleColumn}",
            '(^|[[:space:]]*\\|[[:space:]]*)Payload Website Template[[:space:]]*$',
            '',
            'i'
          )
        ),
        ''
      ),
      'Hero 4 Gotham'
    )
    WHERE "${titleColumn}" ~* '(^|\\|[[:space:]]*)Payload Website Template[[:space:]]*$';

    UPDATE "${tableName}"
    SET "${descriptionColumn}" = '${replacementDescription.replaceAll("'", "''")}'
    WHERE "${descriptionColumn}" = '${legacyDescription.replaceAll("'", "''")}';
  `)

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(normalizeMetadata('pages', 'meta_title', 'meta_description'))
  await db.execute(normalizeMetadata('posts', 'meta_title', 'meta_description'))
  await db.execute(normalizeMetadata('search', 'meta_title', 'meta_description'))
  await db.execute(normalizeMetadata('_pages_v', 'version_meta_title', 'version_meta_description'))
  await db.execute(normalizeMetadata('_posts_v', 'version_meta_title', 'version_meta_description'))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Legacy branding is intentionally not restored.
  await db.execute(sql`SELECT 1;`)
}
