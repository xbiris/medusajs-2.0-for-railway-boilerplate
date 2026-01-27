import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import ClubModuleService from "../../../../../../modules/club/service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    console.info("whweghweuighuewi")
  const clubService = req.scope.resolve("club") as ClubModuleService
  const { handle } = req.params
  const { date, sport } = req.query as { date: string; sport: string }

  console.log(`[AVAILABILITY CHECK] Date: ${date}, Sport: ${sport}`)

  if (!date || !sport) {
    res.json({ bookedTimes: [] })
    return
  }

  // 1. Find the club ID
  const clubs = await clubService.listClubs({ handle })
  if (!clubs.length) {
    res.status(404).json({ message: "Club not found" })
    return
  }

  // 2. Find bookings matching criteria
  const bookings = await clubService.listBookings({
    club_id: clubs[0].id,
    date: date,
    sport: sport,
  })

  console.log(`[AVAILABILITY RESULT] Found ${bookings.length} bookings`) 
  console.log(bookings)

  // 3. Return just the times (e.g., ["10:00", "14:00"])
  res.json({
    bookedTimes: bookings.map((b) => b.time),
  })
}