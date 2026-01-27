import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260127205924 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "booking" ("id" text not null, "date" text not null, "time" text not null, "sport" text not null, "user_email" text null, "club_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "booking_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_club_id" ON "booking" ("club_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_deleted_at" ON "booking" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "booking" add constraint "booking_club_id_foreign" foreign key ("club_id") references "club" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "booking" cascade;`);
  }

}
