import { model } from "@medusajs/framework/utils"
import { Booking } from "./booking"
import { Court } from "./court"
import { RecurringBooking } from "./recurring-booking"

export const Club = model.define("club", {
  id: model.id().primaryKey(),
  
  // Basic Info
  name: model.text().searchable(), // .searchable() helps MeiliSearch find it
  handle: model.text().unique(),
  description: model.text().nullable(),

  // Contact & Location
  address: model.text().nullable(),
  city: model.text().nullable(),
  phone: model.text().nullable(),
  email: model.text().nullable(),
  
  // Images
  logo_url: model.text().nullable(),
  
  // Examples: { "wifi": true, "parking": true } { sports: ["Tennis", "Padel"] }
  metadata: model.json().nullable(),

  bookings: model.hasMany(() => Booking, { mappedBy: "club" }),
  courts: model.hasMany(() => Court, { mappedBy: "club" }),
  recurring_bookings: model.hasMany(() => RecurringBooking, { mappedBy: "club" }),
})