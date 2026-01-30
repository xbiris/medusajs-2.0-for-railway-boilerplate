import { model } from "@medusajs/framework/utils"
import { Club } from "./club"
import { Court } from "./court"

export const Booking = model.define("booking", {
  id: model.id().primaryKey(),
  date: model.text(), // Format: "2026-01-27"
  time: model.text(), // Format: "10:00"
  sport: model.text(), // Format: "Tennis" 
  court_name: model.text().nullable(),
  user_email: model.text().nullable(), // We'll store who booked it
  user_phone: model.text().nullable(),
  club: model.belongsTo(() => Club, { mappedBy: "bookings" }),
  court: model.belongsTo(() => Court, { mappedBy: "bookings" }).nullable(),
})