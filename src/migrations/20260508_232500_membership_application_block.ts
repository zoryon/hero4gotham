import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const layoutColumns = `
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

const styleColumns = (
  prefix: string,
  defaults: {
    colorTheme: string
    fontFamily: string
    fontSizeDesktop: number
    fontSizeMobile: number
    fontWeight: string
    textTransform: string
  },
) => `
  "${prefix}_font_family" "ff" DEFAULT '${defaults.fontFamily}',
  "${prefix}_font_weight" "fw" DEFAULT '${defaults.fontWeight}',
  "${prefix}_font_style" "fst" DEFAULT 'normal',
  "${prefix}_vertical_scale" "vs" DEFAULT 'normal',
  "${prefix}_font_size_mobile" numeric DEFAULT ${defaults.fontSizeMobile},
  "${prefix}_font_size_desktop" numeric DEFAULT ${defaults.fontSizeDesktop},
  "${prefix}_letter_spacing" "ls" DEFAULT 'tight',
  "${prefix}_text_transform" "tt" DEFAULT '${defaults.textTransform}',
  "${prefix}_color_theme" "ct" DEFAULT '${defaults.colorTheme}',
  "${prefix}_color_custom" varchar`

const memberAppColumns = `
  "heading" varchar DEFAULT 'Domanda di ammissione all''associazione',
  "heading_background_image_id" integer,
  "intro_text" varchar DEFAULT 'Compila la candidatura con i tuoi dati. Ti ricontatteremo dopo averla ricevuta.',
  "personal_data_title" varchar DEFAULT 'Dati personali',
  "application_title" varchar DEFAULT 'Candidatura',
  "declarations_title" varchar DEFAULT 'Dichiarazioni',
  "optional_consents_title" varchar DEFAULT 'Consensi facoltativi',
  "first_name_label" varchar DEFAULT 'Nome *',
  "last_name_label" varchar DEFAULT 'Cognome *',
  "birth_date_label" varchar DEFAULT 'Data di nascita *',
  "birth_place_label" varchar DEFAULT 'Luogo di nascita *',
  "fiscal_code_label" varchar DEFAULT 'Codice fiscale *',
  "residence_address_label" varchar DEFAULT 'Indirizzo di residenza *',
  "email_label" varchar DEFAULT 'Email *',
  "phone_label" varchar DEFAULT 'Telefono',
  "request_type_label" varchar DEFAULT 'Tipo di richiesta *',
  "motivation_label" varchar DEFAULT 'Perche vuoi entrare nell''associazione? *',
  "interest_areas_label" varchar DEFAULT 'Aree di interesse',
  "statute_declaration_label" varchar DEFAULT 'Dichiaro di aver letto e accettare lo statuto e il regolamento dell''associazione. *',
  "purpose_declaration_label" varchar DEFAULT 'Dichiaro di condividere le finalita dell''associazione. *',
  "truth_declaration_label" varchar DEFAULT 'Dichiaro che i dati inseriti sono veritieri. *',
  "privacy_declaration_label" varchar DEFAULT 'Ho letto l''informativa privacy. *',
  "media_consent_label" varchar DEFAULT 'Acconsento all''uso di foto/video in cui appaio durante eventi associativi.',
  "submit_label" varchar DEFAULT 'Invia candidatura',
  "submit_background_image_id" integer,
  "success_message" varchar DEFAULT 'Candidatura inviata. Ti ricontatteremo presto.',
  "error_message" varchar DEFAULT 'Non siamo riusciti a inviare la candidatura. Riprova tra poco.',
  "background_image_id" integer,
  "decorative_image_id" integer,
  "email_subject_prefix" varchar DEFAULT 'Nuova candidatura associazione',
  ${styleColumns('heading_style', {
    colorTheme: 'primary',
    fontFamily: 'cinzel',
    fontSizeDesktop: 22,
    fontSizeMobile: 18,
    fontWeight: 'black',
    textTransform: 'uppercase',
  })},
  ${styleColumns('field_style', {
    colorTheme: 'secondary',
    fontFamily: 'geistSans',
    fontSizeDesktop: 12,
    fontSizeMobile: 11,
    fontWeight: 'regular',
    textTransform: 'normal',
  })},
  ${styleColumns('submit_style', {
    colorTheme: 'green',
    fontFamily: 'cinzel',
    fontSizeDesktop: 13,
    fontSizeMobile: 12,
    fontWeight: 'black',
    textTransform: 'uppercase',
  })}`

const createMemberAppTable = (tableName: string, version = false) => `
  CREATE TABLE IF NOT EXISTS "${tableName}" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" ${version ? 'serial' : 'varchar'} PRIMARY KEY NOT NULL,
    ${memberAppColumns},
    ${layoutColumns},
    ${version ? '"_uuid" varchar,' : ''}
    "block_name" varchar
  );`

const createRequestTypesTable = (tableName: string, parentIdType: 'integer' | 'varchar') => `
  CREATE TABLE IF NOT EXISTS "${tableName}" (
    "_order" integer NOT NULL,
    "_parent_id" ${parentIdType} NOT NULL,
    "id" ${parentIdType === 'integer' ? 'serial' : 'varchar'} PRIMARY KEY NOT NULL,
    "label" varchar${parentIdType === 'integer' ? ',\n    "_uuid" varchar' : ''}
  );`

const addMediaConstraint = (tableName: string, columnName: string) => `
  DO $$
  BEGIN
    ALTER TABLE "${tableName}"
      ADD CONSTRAINT "${tableName}_${columnName}_media_id_fk"
      FOREIGN KEY ("${columnName}") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    sql.raw(`
    ${createMemberAppTable('member_app')}
    ${createRequestTypesTable('member_app_request_types', 'varchar')}
    ${createMemberAppTable('_member_app_v', true)}
    ${createRequestTypesTable('_member_app_v_request_types', 'integer')}

    CREATE INDEX IF NOT EXISTS "member_app_order_idx" ON "member_app" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "member_app_parent_id_idx" ON "member_app" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "member_app_path_idx" ON "member_app" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "member_app_heading_background_image_idx" ON "member_app" USING btree ("heading_background_image_id");
    CREATE INDEX IF NOT EXISTS "member_app_submit_background_image_idx" ON "member_app" USING btree ("submit_background_image_id");
    CREATE INDEX IF NOT EXISTS "member_app_background_image_idx" ON "member_app" USING btree ("background_image_id");
    CREATE INDEX IF NOT EXISTS "member_app_decorative_image_idx" ON "member_app" USING btree ("decorative_image_id");

    CREATE INDEX IF NOT EXISTS "member_app_request_types_order_idx" ON "member_app_request_types" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "member_app_request_types_parent_id_idx" ON "member_app_request_types" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_member_app_v_order_idx" ON "_member_app_v" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_member_app_v_parent_id_idx" ON "_member_app_v" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_member_app_v_path_idx" ON "_member_app_v" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "_member_app_v_heading_background_image_idx" ON "_member_app_v" USING btree ("heading_background_image_id");
    CREATE INDEX IF NOT EXISTS "_member_app_v_submit_background_image_idx" ON "_member_app_v" USING btree ("submit_background_image_id");
    CREATE INDEX IF NOT EXISTS "_member_app_v_background_image_idx" ON "_member_app_v" USING btree ("background_image_id");
    CREATE INDEX IF NOT EXISTS "_member_app_v_decorative_image_idx" ON "_member_app_v" USING btree ("decorative_image_id");

    CREATE INDEX IF NOT EXISTS "_member_app_v_request_types_order_idx" ON "_member_app_v_request_types" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_member_app_v_request_types_parent_id_idx" ON "_member_app_v_request_types" USING btree ("_parent_id");

    DO $$
    BEGIN
      ALTER TABLE "member_app"
        ADD CONSTRAINT "member_app_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "member_app_request_types"
        ADD CONSTRAINT "member_app_request_types_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "member_app"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "_member_app_v"
        ADD CONSTRAINT "_member_app_v_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_pages_v"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$
    BEGIN
      ALTER TABLE "_member_app_v_request_types"
        ADD CONSTRAINT "_member_app_v_request_types_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_member_app_v"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ${addMediaConstraint('member_app', 'heading_background_image_id')}
    ${addMediaConstraint('member_app', 'submit_background_image_id')}
    ${addMediaConstraint('member_app', 'background_image_id')}
    ${addMediaConstraint('member_app', 'decorative_image_id')}
    ${addMediaConstraint('_member_app_v', 'heading_background_image_id')}
    ${addMediaConstraint('_member_app_v', 'submit_background_image_id')}
    ${addMediaConstraint('_member_app_v', 'background_image_id')}
    ${addMediaConstraint('_member_app_v', 'decorative_image_id')}
  `),
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw(`
    DROP TABLE IF EXISTS "_member_app_v_request_types" CASCADE;
    DROP TABLE IF EXISTS "_member_app_v" CASCADE;
    DROP TABLE IF EXISTS "member_app_request_types" CASCADE;
    DROP TABLE IF EXISTS "member_app" CASCADE;
  `),
  )
}
