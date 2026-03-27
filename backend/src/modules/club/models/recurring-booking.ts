import { model } from "@medusajs/framework/utils"
import { Club } from "./club"
import { Court } from "./court"
import { Booking } from "./booking"
import { RegularUser } from "./regular-user"

export const RecurringBooking = model.define("recurring_booking", {
  id: model.id().primaryKey(),
  user_id: model.text(),
  
  stripe_subscription_id: model.text(), 
  status: model.enum(["active", "past_due", "canceled"]).default("active"),
  
  day_of_week: model.number(),
  start_time: model.text(), 
  start_date: model.dateTime(), 
  duration_minutes: model.number().default(60),
  
  regular_user: model.belongsTo(() => RegularUser, { mappedBy: "recurring_bookings" }),
  club: model.belongsTo(() => Club, { mappedBy: "recurring_bookings" }),
  court: model.belongsTo(() => Court, { mappedBy: "recurring_bookings" }).nullable(),
  bookings: model.hasMany(() => Booking, { mappedBy: "recurring_booking" }),
})