import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_three_panel_showcase" DROP COLUMN "border_color";
  ALTER TABLE "pages_blocks_three_panel_showcase" DROP COLUMN "center_background_color";
  ALTER TABLE "pages_blocks_three_panel_showcase" DROP COLUMN "center_overlay_opacity";
  ALTER TABLE "_pages_v_blocks_three_panel_showcase" DROP COLUMN "border_color";
  ALTER TABLE "_pages_v_blocks_three_panel_showcase" DROP COLUMN "center_background_color";
  ALTER TABLE "_pages_v_blocks_three_panel_showcase" DROP COLUMN "center_overlay_opacity";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_three_panel_showcase" ADD COLUMN "border_color" varchar DEFAULT '#5c342e';
  ALTER TABLE "pages_blocks_three_panel_showcase" ADD COLUMN "center_background_color" varchar DEFAULT '#27172d';
  ALTER TABLE "pages_blocks_three_panel_showcase" ADD COLUMN "center_overlay_opacity" numeric DEFAULT 0.28;
  ALTER TABLE "_pages_v_blocks_three_panel_showcase" ADD COLUMN "border_color" varchar DEFAULT '#5c342e';
  ALTER TABLE "_pages_v_blocks_three_panel_showcase" ADD COLUMN "center_background_color" varchar DEFAULT '#27172d';
  ALTER TABLE "_pages_v_blocks_three_panel_showcase" ADD COLUMN "center_overlay_opacity" numeric DEFAULT 0.28;`)
}
