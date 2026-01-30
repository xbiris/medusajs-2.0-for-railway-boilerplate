import { model } from "@medusajs/framework/utils"
import { Booking } from "./booking"
import { Court } from "./court"

export const Club = model.define("club", {
  id: model.id().primaryKey(),
  
  // Basic Info
  name: model.text().searchable(), // .searchable() helps MeiliSearch find it
  handle: model.text().unique(),
  description: model.text().nullable(),

  // Contact & Location
  address: model.text().nullable(),
  city: model.text().nullable(),
  postal_code: model.text().nullable(),
  phone: model.text().nullable(),
  email: model.text().nullable(),
  
  // Images (We store the URL string here)
  logo_url: model.text().nullable(),
  
  // Throw ANYTHING JSON in here later without changing the database schema.
  // Examples: { "wifi": true, "parking": true, "opening_hours": "8-22" }
  // { sports: ["Tennis", "Padel"] }
  metadata: model.json().nullable(),
  bookings: model.hasMany(() => Booking, { mappedBy: "club" }),
  courts: model.hasMany(() => Court, { mappedBy: "club" }),
})