import { model } from "@medusajs/framework/utils"
import { Club } from "./club"
import { Court } from "./court"
import { RecurringBooking } from "./recurring-booking"
import { RegularUser } from "./regular-user"

export const Booking = model.define("booking", {
  id: model.id().primaryKey(),
  date: model.text(), // Format: "2026-01-27"
  time: model.text(), // Format: "10:00"
  sport: model.text(), 

  regular_user: model.belongsTo(() => RegularUser, { mappedBy: "bookings" }),
  club: model.belongsTo(() => Club, { mappedBy: "bookings" }),
  court: model.belongsTo(() => Court, { mappedBy: "bookings" }).nullable(),
  recurring_booking: model.belongsTo(() => RecurringBooking, { mappedBy: "bookings" }).nullable(),
})