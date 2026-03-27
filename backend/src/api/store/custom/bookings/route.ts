import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import ClubModuleService from "../../../../modules/club/service"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const clubService = req.scope.resolve("club") as ClubModuleService
  
  // Extract data sent from frontend
  const { 
    club_handle, 
    date, 
    time, 
    sport, 
    court_name,
    court_id,
    regular_user_id,
  } = req.body as any

  const clubs = await clubService.listClubs({ handle: club_handle })
  
  if (!clubs.length) {
    res.status(404).json({ message: "Club not found" })
    return
  }
  const clubId = clubs[0].id

  // Check if this specific court is already booked at this time
  if (court_id) {
      const existingBookings = await clubService.listBookings({
        date: date,
        time: time,
        court_id: court_id,
      })

      if (existingBookings.length > 0) {
        res.status(409).json({ message: `Court ${court_name} is already booked!` })
        return
      }
  }

  let regularUser
  if (regular_user_id) {
    const users = await clubService.listRegularUsers({ id: regular_user_id })
    regularUser = users[0]
  }
  
  if (!regularUser) {
    regularUser = await clubService.createRegularUsers({})
  }

  // Create booking with id
  const booking = await clubService.createBookings({
    date,
    time,
    sport,
    regular_user_id: regularUser.id,
    court_id, 
    club_id: clubId,
  })

  res.json({ booking })
}