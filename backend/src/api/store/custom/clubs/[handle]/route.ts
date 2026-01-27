import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import ClubModuleService from "../../../../../modules/club/service"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const clubService = req.scope.resolve("club") as ClubModuleService

  // 1. Get the handle from the URL
  const { handle } = req.params

  // 2. Find the club with that handle
  const clubs = await clubService.listClubs({
    handle: handle,
  })

  if (!clubs.length) {
    res.status(404).json({ message: "Club not found" })
    return
  }

  // 3. Return the single club
  res.json({
    club: clubs[0],
  })
}