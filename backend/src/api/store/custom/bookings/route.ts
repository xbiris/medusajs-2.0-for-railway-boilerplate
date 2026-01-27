import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import ClubModuleService from "../../../../modules/club/service"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const clubService = req.scope.resolve("club") as ClubModuleService
  
  const { club_handle, date, time, sport, user_email } = req.body as any

  // Find the club
  const clubs = await clubService.listClubs({ handle: club_handle })
  
  if (!clubs.length) {
    res.status(404).json({ message: "Club not found" })
    return
  }

  const clubId = clubs[0].id

  // Is this slot already taken?
  const existingBookings = await clubService.listBookings({
    club_id: clubId,
    date: date,
    time: time,
    sport: sport,
  })

  if (existingBookings.length > 0) {
    res.status(409).json({ message: "This slot is already booked!" })
    return
  }

  // Create the booking 
  const booking = await clubService.createBookings({
    club_id: clubId,
    date,
    time,
    sport,
    user_email: user_email || "guest@demo.com",
  })

  res.json({ booking })
}