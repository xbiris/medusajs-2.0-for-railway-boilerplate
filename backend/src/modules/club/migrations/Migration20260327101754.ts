import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260327101754 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "regular_user" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "regular_user_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_regular_user_deleted_at" ON "regular_user" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "recurring_booking" ("id" text not null, "user_id" text not null, "stripe_subscription_id" text not null, "status" text check ("status" in ('active', 'past_due', 'canceled')) not null default 'active', "day_of_week" integer not null, "start_time" text not null, "start_date" timestamptz not null, "duration_minutes" integer not null default 60, "regular_user_id" text not null, "club_id" text not null, "court_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "recurring_booking_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_recurring_booking_regular_user_id" ON "recurring_booking" ("regular_user_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_recurring_booking_club_id" ON "recurring_booking" ("club_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_recurring_booking_court_id" ON "recurring_booking" ("court_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_recurring_booking_deleted_at" ON "recurring_booking" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "recurring_booking" add constraint "recurring_booking_regular_user_id_foreign" foreign key ("regular_user_id") references "regular_user" ("id") on update cascade;`);
    this.addSql(`alter table if exists "recurring_booking" add constraint "recurring_booking_club_id_foreign" foreign key ("club_id") references "club" ("id") on update cascade;`);
    this.addSql(`alter table if exists "recurring_booking" add constraint "recurring_booking_court_id_foreign" foreign key ("court_id") references "court" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table if exists "booking" add column if not exists "regular_user_id" text not null, add column if not exists "recurring_booking_id" text null;`);
    this.addSql(`alter table if exists "booking" add constraint "booking_regular_user_id_foreign" foreign key ("regular_user_id") references "regular_user" ("id") on update cascade;`);
    this.addSql(`alter table if exists "booking" add constraint "booking_recurring_booking_id_foreign" foreign key ("recurring_booking_id") references "recurring_booking" ("id") on update cascade on delete set null;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_regular_user_id" ON "booking" ("regular_user_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_recurring_booking_id" ON "booking" ("recurring_booking_id") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "recurring_booking" drop constraint if exists "recurring_booking_regular_user_id_foreign";`);

    this.addSql(`alter table if exists "booking" drop constraint if exists "booking_regular_user_id_foreign";`);

    this.addSql(`alter table if exists "booking" drop constraint if exists "booking_recurring_booking_id_foreign";`);

    this.addSql(`drop table if exists "regular_user" cascade;`);

    this.addSql(`drop table if exists "recurring_booking" cascade;`);

    this.addSql(`drop index if exists "IDX_booking_regular_user_id";`);
    this.addSql(`drop index if exists "IDX_booking_recurring_booking_id";`);
    this.addSql(`alter table if exists "booking" drop column if exists "regular_user_id", drop column if exists "recurring_booking_id";`);
  }

}
