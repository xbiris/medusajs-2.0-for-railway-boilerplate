import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import ClubModuleService from "../../../../modules/club/service"

// 1. Update the expected input type
type CreateClubReq = {
  name: string
  handle: string
  description?: string
  address?: string
  city?: string
  phone?: string
  email?: string
  user_id?: string
}

export const POST = async (
  req: MedusaRequest<CreateClubReq>,
  res: MedusaResponse
) => {
  const clubService = req.scope.resolve("club") as ClubModuleService
  const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK)

  // 2. Pass the new fields to the createClubs function
  const club = await clubService.createClubs({
    name: req.body.name,
    handle: req.body.handle,
    description: req.body.description,
    address: req.body.address,
    city: req.body.city,
    phone: req.body.phone,
    email: req.body.email,
    // Add metadata for sports if you want
    metadata: {
      sports: ["Tennis", "Padel"] 
    }
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