import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260327105206 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "booking" drop column if exists "court_name", drop column if exists "user_email", drop column if exists "user_phone";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "booking" add column if not exists "court_name" text null, add column if not exists "user_email" text null, add column if not exists "user_phone" text null;`);
  }

}
