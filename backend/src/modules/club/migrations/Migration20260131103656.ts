import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260131103656 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "court" add column if not exists "price" integer not null default 0;`);

    this.addSql(`alter table if exists "booking" add column if not exists "user_phone" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "court" drop column if exists "price";`);

    this.addSql(`alter table if exists "booking" drop column if exists "user_phone";`);
  }

}
