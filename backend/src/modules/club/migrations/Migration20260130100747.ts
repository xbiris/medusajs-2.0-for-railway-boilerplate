import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class MigrationAddCourtNameToBooking extends Migration {

  async up(): Promise<void> {
    this.addSql(`ALTER TABLE "booking" ADD COLUMN IF NOT EXISTS "court_name" text NULL;`);
  }

  async down(): Promise<void> {
    this.addSql(`ALTER TABLE "booking" DROP COLUMN IF EXISTS "court_name";`);
  }
}