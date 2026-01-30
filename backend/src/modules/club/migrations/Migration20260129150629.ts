import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class MigrationCreateCourtTable extends Migration {

  async up(): Promise<void> {
    // 1. Create the Court table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "court" (
        "id" text not null,
        "name" text not null,
        "sport" text not null,
        "slot_duration_minutes" integer not null default 60,
        "opening_time" text not null default '08:00',
        "closing_time" text not null default '22:00',
        "club_id" text null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "court_pkey" primary key ("id")
      );
    `);

    // 2. Add foreign key from Court -> Club
    this.addSql(`
      ALTER TABLE "court" 
      ADD CONSTRAINT "court_club_id_foreign" 
      FOREIGN KEY ("club_id") REFERENCES "club" ("id") 
      ON UPDATE CASCADE ON DELETE SET NULL;
    `);

    // 3. Add court_id to Booking (Nullable to support old bookings)
    this.addSql(`
      ALTER TABLE "booking" 
      ADD COLUMN IF NOT EXISTS "court_id" text NULL;
    `);

    // 4. Add foreign key from Booking -> Court
    this.addSql(`
      ALTER TABLE "booking" 
      ADD CONSTRAINT "booking_court_id_foreign" 
      FOREIGN KEY ("court_id") REFERENCES "court" ("id") 
      ON UPDATE CASCADE ON DELETE SET NULL;
    `);
    
    // 5. Add Indices for performance
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_court_club_id" ON "court" ("club_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_court_id" ON "booking" ("court_id") WHERE deleted_at IS NULL;`);
  }

  async down(): Promise<void> {
    this.addSql(`ALTER TABLE "booking" DROP CONSTRAINT IF EXISTS "booking_court_id_foreign";`);
    this.addSql(`ALTER TABLE "booking" DROP COLUMN IF EXISTS "court_id";`);
    this.addSql(`DROP TABLE IF EXISTS "court" CASCADE;`);
  }
}