import { model } from "@medusajs/framework/utils"
import { Club } from "./club"
import { Booking } from "./booking"

export const Court = model.define("court", {
  id: model.id().primaryKey(),
  name: model.text(), 
  sport: model.text(), 
  price: model.number().default(0),
  slot_duration_minutes: model.number().default(60),
  opening_time: model.text().default("08:00"),
  closing_time: model.text().default("22:00"),
  club: model.belongsTo(() => Club, { mappedBy: "courts" }),
  bookings: model.hasMany(() => Booking, { mappedBy: "court" }),
})