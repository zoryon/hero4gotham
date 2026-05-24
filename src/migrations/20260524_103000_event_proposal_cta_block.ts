import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const eventProposalCtaColumns = `
  "title" varchar DEFAULT 'PROPONI UN EVENTO',
  "body" varchar DEFAULT 'Hai un''idea fuori dagli schemi?
Proponi il tuo evento e diventa parte del caos creativo.',
  "cta_link_type" varchar DEFAULT 'custom',
  "cta_link_new_tab" boolean,
  "cta_link_url" varchar DEFAULT '#',
  "cta_link_label" varchar DEFAULT 'INVIA LA TUA PROPOSTA',
  "cta_fallback_label" varchar DEFAULT 'INVIA LA TUA PROPOSTA',
  "icon_image_id" integer,
  "button_background_image_id" integer,
  "button_background_color" varchar DEFAULT 'rgb(99 29 94 / 0.58)',
  "max_width" numeric DEFAULT 560,
  "min_height_desktop" numeric DEFAULT 150,
  "min_height_mobile" numeric DEFAULT 230,
  "content_gap" numeric DEFAULT 12,
  "padding_x" numeric DEFAULT 20,
  "padding_y" numeric DEFAULT 16,
  "icon_size_desktop" numeric DEFAULT 56,
  "icon_size_mobile" numeric DEFAULT 48,
  "button_height" numeric DEFAULT 42,
  "title_ff" varchar DEFAULT 'rye',
  "title_fw" varchar DEFAULT 'regular',
  "title_fst" varchar DEFAULT 'normal',
  "title_vs" varchar DEFAULT 'normal',
  "title_font_size_mobile" numeric DEFAULT 22,
  "title_font_size_desktop" numeric DEFAULT 24,
  "title_line_height" numeric DEFAULT 1,
  "title_ls" varchar DEFAULT 'normal',
  "title_tt" varchar DEFAULT 'uppercase',
  "title_color" varchar DEFAULT '#a6bd17',
  "body_ff" varchar DEFAULT 'geistSans',
  "body_fw" varchar DEFAULT 'semibold',
  "body_fst" varchar DEFAULT 'normal',
  "body_vs" varchar DEFAULT 'normal',
  "body_font_size_mobile" numeric DEFAULT 14,
  "body_font_size_desktop" numeric DEFAULT 15,
  "body_line_height" numeric DEFAULT 1.24,
  "body_ls" varchar DEFAULT 'tight',
  "body_tt" varchar DEFAULT 'normal',
  "body_color" varchar DEFAULT '#f1ecdf',
  "button_ff" varchar DEFAULT 'rye',
  "button_fw" varchar DEFAULT 'regular',
  "button_fst" varchar DEFAULT 'normal',
  "button_vs" varchar DEFAULT 'normal',
  "button_font_size_mobile" numeric DEFAULT 17,
  "button_font_size_desktop" numeric DEFAULT 19,
  "button_line_height" numeric DEFAULT 1,
  "button_ls" varchar DEFAULT 'tight',
  "button_tt" varchar DEFAULT 'uppercase',
  "button_color" varchar DEFAULT '#f1d5f5',
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

const createEventProposalCtaTable = (tableName: string, parentTable: string, version = false) => `
  CREATE TABLE IF NOT EXISTS "${tableName}" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" ${version ? 'serial PRIMARY KEY' : 'varchar PRIMARY KEY'},
    ${eventProposalCtaColumns},
    ${version ? '"_uuid" varchar,' : ''}
    "block_name" varchar
  );

  CREATE INDEX IF NOT EXISTS "${tableName}_order_idx" ON "${tableName}" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "${tableName}_parent_id_idx" ON "${tableName}" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "${tableName}_path_idx" ON "${tableName}" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "${tableName}_icon_image_idx" ON "${tableName}" USING btree ("icon_image_id");
  CREATE INDEX IF NOT EXISTS "${tableName}_button_background_image_idx" ON "${tableName}" USING btree ("button_background_image_id");

  DO $$
  BEGIN
    ALTER TABLE "${tableName}"
      ADD CONSTRAINT "${tableName}_icon_image_id_media_id_fk"
      FOREIGN KEY ("icon_image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;

  DO $$
  BEGIN
    ALTER TABLE "${tableName}"
      ADD CONSTRAINT "${tableName}_button_background_image_id_media_id_fk"
      FOREIGN KEY ("button_background_image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
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

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(createEventProposalCtaTable('pages_blocks_event_prop_cta', 'pages')))
  await db.execute(
    sql.raw(createEventProposalCtaTable('_pages_v_blocks_event_prop_cta', '_pages_v', true)),
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw('DROP TABLE IF EXISTS "_pages_v_blocks_event_prop_cta" CASCADE;'))
  await db.execute(sql.raw('DROP TABLE IF EXISTS "pages_blocks_event_prop_cta" CASCADE;'))
}
