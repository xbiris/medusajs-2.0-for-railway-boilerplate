import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import ClubModuleService from "../modules/club/service"

export default async function createClub({ container }: ExecArgs) {
  // 1. Get the Tools we need
  const clubService = container.resolve("club") as ClubModuleService
  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  // 2. Create the Club
  logger.info("Creating Tennis Club...")
  const club = await clubService.createClubs({
    name: "Royal Tennis Club",
    handle: "royal-tennis",
  })
  logger.info(`Club Created: ${club.id}`)

  // 3. Link "Admin User" to "Club"
  // REPLACE 'user_01...' WITH YOUR REAL ADMIN USER ID FROM THE DATABASE
  // If you don't have a user yet, you can create one in the dashboard first.
  const myUserId = "user_01JH..." 

  if (myUserId !== "user_01JH...") {
    await remoteLink.create([
      {
        "user": {
            user_id: myUserId,
        },
        "club": {
            club_id: club.id,
        },
      },
    ])
    logger.info(`Success! User ${myUserId} is now the owner of ${club.name}`)
  } else {
    logger.warn("SKIPPED LINKING: You need to put your real User ID in the script!")
  }
}