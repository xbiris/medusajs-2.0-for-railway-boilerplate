import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import ClubModuleService from "../../../../modules/club/service"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const clubService = req.scope.resolve("club") as ClubModuleService
  
  // 1. EXTRACT 'court_id' HERE
  const { 
    club_handle, 
    date, 
    time, 
    sport, 
    user_email,
    user_phone,
    court_name,
    court_id     // <--- CRITICAL: Get this from the request!
  } = req.body as any

  const clubs = await clubService.listClubs({ handle: club_handle })
  
  if (!clubs.length) {
    res.status(404).json({ message: "Club not found" })
    return
  }
  const clubId = clubs[0].id

  // 2. SECURITY CHECK (Updated to use ID which is safer)
  // Check if this specific court is already booked at this time
  if (court_id) {
      const existingBookings = await clubService.listBookings({
        date: date,
        time: time,
        court_id: court_id, // <--- Filter by ID, not just name
      })

      if (existingBookings.length > 0) {
        res.status(409).json({ message: `Court ${court_name} is already booked!` })
        return
      }
  }

  // 3. CREATE BOOKING WITH ID
  const booking = await clubService.createBookings({
    club_id: clubId,
    date,
    time,
    sport,
    court_name,  
    court_id,    // <--- SAVE IT TO THE DATABASE
    user_email,
    user_phone,  
  })

  res.json({ booking })
}