import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260327110459 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "club" drop column if exists "postal_code";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "club" add column if not exists "postal_code" text null;`);
  }

}
