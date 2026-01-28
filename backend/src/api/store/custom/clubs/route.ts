import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import ClubModuleService from "../../../../modules/club/service"

// 1. UPDATE THIS: Add logo_url and metadata to the expected input
type CreateClubReq = {
  name: string
  handle: string
  description?: string
  address?: string
  city?: string
  phone?: string
  email?: string
  logo_url?: string  // <--- Added
  metadata?: Record<string, any> // <--- Added
  user_id?: string
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const clubService = req.scope.resolve("club") as ClubModuleService
  const [clubs, count] = await clubService.listAndCountClubs({})
  
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

  // 2. UPDATE THIS: Pass the new fields to the service
  const club = await clubService.createClubs({
    name: req.body.name,
    handle: req.body.handle,
    description: req.body.description,
    address: req.body.address,
    city: req.body.city,
    phone: req.body.phone,
    email: req.body.email,
    
    // NOW WE SAVE THEM:
    logo_url: req.body.logo_url, 
    // Use metadata from frontend, or fallback to default
    metadata: req.body.metadata || { sports: ["Tennis", "Padel"] }
  })

  if (req.body.user_id) {
    await remoteLink.create([
      {
        user: { user_id: req.body.user_id },
        club: { club_id: club.id },
      },
    ])
  }

  res.json({ club })
}