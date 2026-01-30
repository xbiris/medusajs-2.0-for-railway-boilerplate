import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import ClubModuleService from "../../../../../../modules/club/service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const clubService = req.scope.resolve("club") as ClubModuleService
  const { date, court_id } = req.query as { date: string; court_id: string }

  console.log(`[AVAILABILITY CHECK] Date: ${date}, Court ID: ${court_id}`)

  if (!date || !court_id) {
    res.json({ bookedTimes: [] })
    return
  }

  // 1. DEBUG: Fetch ALL bookings for this date first to see what's in the DB
  // This helps us see if the data is actually there but the filter is missing it.
  const allBookingsOnDate = await clubService.listBookings({ date: date })
  console.log("🔍 ALL BOOKINGS ON THIS DATE (Raw):", JSON.stringify(allBookingsOnDate, null, 2))

  // 2. FILTER: Use the Relation Filter Syntax
  // Instead of 'court_id', we usually need to filter by the relation object
  const bookings = await clubService.listBookings({
    date: date,
    court: { id: court_id }, // <--- TRY THIS SYNTAX
  })

  console.log(`[AVAILABILITY RESULT] Found ${bookings.length} bookings for this specific court`) 

  res.json({
    bookedTimes: bookings.map((b) => b.time),
  })
}