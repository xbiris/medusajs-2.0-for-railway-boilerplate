import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import ClubModuleService from "../../../../modules/club/service"

type CourtReq = {
  name: string
  sport: string
  price: number 
  slot_duration_minutes: number
  opening_time: string
  closing_time: string
}

type CreateClubReq = {
  name: string
  handle: string
  description?: string
  address?: string
  city?: string
  phone?: string
  email?: string
  logo_url?: string
  metadata?: Record<string, any>
  courts?: CourtReq[]
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const clubService = req.scope.resolve("club") as ClubModuleService
  
  const [clubs, count] = await clubService.listAndCountClubs({}, {
    relations: ["courts"] 
  })
  
  res.json({
    clubs,
    count,
  })
}

export const POST = async (
  req: MedusaRequest<CreateClubReq>,
  res: MedusaResponse
) => {
  const clubService = req.scope.resolve("club") as ClubModuleService
  const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK)

  const club = await clubService.createClubs({
    name: req.body.name,
    handle: req.body.handle,
    description: req.body.description,
    address: req.body.address,
    city: req.body.city,
    phone: req.body.phone,
    email: req.body.email,
    logo_url: req.body.logo_url,
    metadata: req.body.metadata
  })

  // If courts were sent, create them and link to the club
  if (req.body.courts && req.body.courts.length > 0) {
    const courtsToCreate = req.body.courts.map((court) => ({
      ...court,
      club_id: club.id, 
    }))

    await clubService.createCourts(courtsToCreate)
  }

  // Return the club
  const clubWithCourts = await clubService.retrieveClub(club.id, {
    relations: ["courts"]
  })

  res.json({ club: clubWithCourts })
}