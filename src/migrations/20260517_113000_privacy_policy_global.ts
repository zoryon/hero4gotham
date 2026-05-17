import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

import { defaultPrivacyPolicyContent } from '../PrivacyPolicy/defaultContent'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const content = JSON.stringify(defaultPrivacyPolicyContent)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "privacy_policy" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar DEFAULT 'Privacy Policy' NOT NULL,
      "intro" varchar DEFAULT 'Informativa sul trattamento dei dati personali ai sensi del Regolamento (UE) 2016/679 e della normativa italiana applicabile.',
      "last_updated_label" varchar DEFAULT 'Ultimo aggiornamento' NOT NULL,
      "content" jsonb,
      "meta_title" varchar DEFAULT 'Privacy Policy | Hero 4 Gotham',
      "meta_description" varchar DEFAULT 'Informativa privacy del sito Hero 4 Gotham sul trattamento dei dati personali, moduli di contatto, candidature, documenti, cookie e diritti GDPR.',
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    INSERT INTO "privacy_policy" (
      "id",
      "title",
      "intro",
      "last_updated_label",
      "content",
      "meta_title",
      "meta_description",
      "updated_at",
      "created_at"
    )
    VALUES (
      1,
      'Privacy Policy',
      'Informativa sul trattamento dei dati personali ai sensi del Regolamento (UE) 2016/679 e della normativa italiana applicabile.',
      'Ultimo aggiornamento',
      ${content}::jsonb,
      'Privacy Policy | Hero 4 Gotham',
      'Informativa privacy del sito Hero 4 Gotham sul trattamento dei dati personali, moduli di contatto, candidature, documenti, cookie e diritti GDPR.',
      now(),
      now()
    )
    ON CONFLICT ("id") DO NOTHING;

    SELECT setval(
      pg_get_serial_sequence('privacy_policy', 'id'),
      COALESCE((SELECT MAX("id") FROM "privacy_policy"), 1),
      true
    );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "privacy_policy";
  `)
}
