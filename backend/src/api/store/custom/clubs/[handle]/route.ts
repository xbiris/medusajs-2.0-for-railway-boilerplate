import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import ClubModuleService from "../../../../../modules/club/service"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const clubService = req.scope.resolve("club") as ClubModuleService
  const handle = req.params.handle // Reads the [handle] from the folder name

  // We use listClubs because we are searching by handle, not ID
  const clubs = await clubService.listClubs({
    handle: handle
  }, {
    // CRITICAL: This tells the DB to fetch the linked courts!
    relations: ["courts"] 
  })

  if (!clubs || clubs.length === 0) {
    res.status(404).json({ message: "Club not found" })
    return
  }

  // Return the first match (handles should be unique anyway)
  res.json({ club: clubs[0] })
}