import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260126120627 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "club" drop constraint if exists "club_handle_unique";`);
    this.addSql(`create table if not exists "club" ("id" text not null, "name" text not null, "handle" text not null, "description" text null, "address" text null, "city" text null, "postal_code" text null, "phone" text null, "email" text null, "logo_url" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "club_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_club_handle_unique" ON "club" ("handle") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_club_deleted_at" ON "club" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "club" cascade;`);
  }

}
