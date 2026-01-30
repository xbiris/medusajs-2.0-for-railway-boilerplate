import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import ClubModuleService from "../../../../modules/club/service"

// 1. Define the Court input shape
type CourtReq = {
  name: string
  sport: string
  slot_duration_minutes: number
  opening_time: string
  closing_time: string
}

// 2. Update Request Type to include 'courts'
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
  user_id?: string
  courts?: CourtReq[] // <--- Added this array
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const clubService = req.scope.resolve("club") as ClubModuleService
  
  // We add relations: ["courts"] so the frontend can receive the courts list too
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

  // A. Create the Club first
  const club = await clubService.createClubs({
    name: req.body.name,
    handle: req.body.handle,
    description: req.body.description,
    address: req.body.address,
    city: req.body.city,
    phone: req.body.phone,
    email: req.body.email,
    logo_url: req.body.logo_url,
    metadata: req.body.metadata || { sports: ["Tennis", "Padel"] }
  })

  // B. If courts were sent, create them and link to the club
  if (req.body.courts && req.body.courts.length > 0) {
    const courtsToCreate = req.body.courts.map((court) => ({
      ...court,
      club_id: club.id, // Link to the new club's ID
    }))

    // The service automatically generates 'createCourts' because the Court model exists in the module
    await clubService.createCourts(courtsToCreate)
  }

  // C. Handle User Link (if applicable)
  if (req.body.user_id) {
    await remoteLink.create([
      {
        user: { user_id: req.body.user_id },
        club: { club_id: club.id },
      },
    ])
  }

  // D. Return the club (optionally re-fetch it to include the courts in the response)
  const clubWithCourts = await clubService.retrieveClub(club.id, {
    relations: ["courts"]
  })

  res.json({ club: clubWithCourts })
}