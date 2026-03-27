import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260327132334 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "court" add column if not exists "can_have_recurring_bookings" boolean not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "court" drop column if exists "can_have_recurring_bookings";`);
  }

}
