import { model } from "@medusajs/framework/utils"
import { Booking } from "./booking"
import { RecurringBooking } from "./recurring-booking"

export const RegularUser = model.define("regular_user", {
  id: model.id().primaryKey(),
  
  bookings: model.hasMany(() => Booking, { mappedBy: "regular_user" }),
  recurring_bookings: model.hasMany(() => RecurringBooking, { mappedBy: "regular_user" }),
})