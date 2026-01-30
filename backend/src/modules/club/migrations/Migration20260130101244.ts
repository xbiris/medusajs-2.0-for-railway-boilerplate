import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class MigrationAddUserDetailsToBooking extends Migration {

  async up(): Promise<void> { 
    this.addSql(`ALTER TABLE "booking" ADD COLUMN IF NOT EXISTS "user_phone" text NULL;`);
     
    this.addSql(`ALTER TABLE "booking" ADD COLUMN IF NOT EXISTS "user_email" text NULL;`);
  }

  async down(): Promise<void> {
    this.addSql(`ALTER TABLE "booking" DROP COLUMN IF EXISTS "user_phone";`);
    this.addSql(`ALTER TABLE "booking" DROP COLUMN IF EXISTS "user_email";`);
  }
}