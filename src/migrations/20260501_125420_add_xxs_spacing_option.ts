import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const enumNames = [
  'enum_pages_blocks_torn_cards_items_image_title_gap',
  'enum_pages_blocks_torn_cards_items_title_description_gap',
  'enum_pages_blocks_torn_cards_items_padding_top',
  'enum_pages_blocks_torn_cards_items_padding_right',
  'enum_pages_blocks_torn_cards_items_padding_bottom',
  'enum_pages_blocks_torn_cards_items_padding_left',
  'enum_pages_blocks_torn_cards_items_margin_top',
  'enum_pages_blocks_torn_cards_items_margin_right',
  'enum_pages_blocks_torn_cards_items_margin_bottom',
  'enum_pages_blocks_torn_cards_items_margin_left',
  'enum__pages_v_blocks_torn_cards_items_image_title_gap',
  'enum__pages_v_blocks_torn_cards_items_title_description_gap',
  'enum__pages_v_blocks_torn_cards_items_padding_top',
  'enum__pages_v_blocks_torn_cards_items_padding_right',
  'enum__pages_v_blocks_torn_cards_items_padding_bottom',
  'enum__pages_v_blocks_torn_cards_items_padding_left',
  'enum__pages_v_blocks_torn_cards_items_margin_top',
  'enum__pages_v_blocks_torn_cards_items_margin_right',
  'enum__pages_v_blocks_torn_cards_items_margin_bottom',
  'enum__pages_v_blocks_torn_cards_items_margin_left',
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`
    DO $$
    DECLARE
      enum_name text;
    BEGIN
      FOREACH enum_name IN ARRAY ARRAY[${enumNames.map((name) => `'${name}'`).join(', ')}]
      LOOP
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = enum_name) THEN
          EXECUTE format('ALTER TYPE %I ADD VALUE IF NOT EXISTS ''xxs''', enum_name);
        END IF;
      END LOOP;
    END $$;
  `))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`SELECT 1;`)
}
