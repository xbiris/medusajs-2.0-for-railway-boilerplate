import { model } from "@medusajs/framework/utils"
import { Club } from "./club"

export const Booking = model.define("booking", {
  id: model.id().primaryKey(),
  date: model.text(), // Format: "2026-01-27"
  time: model.text(), // Format: "10:00"
  sport: model.text(), // Format: "Tennis"
  user_email: model.text().nullable(), // We'll store who booked it
  club: model.belongsTo(() => Club, { mappedBy: "bookings" }),
})