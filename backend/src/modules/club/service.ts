import { MedusaService } from "@medusajs/framework/utils"
import { Club } from "./models/club"
import { Booking } from "./models/booking"
import { Court } from "./models/court"

class ClubModuleService extends MedusaService({
  Club,
  Booking,
  Court,
}) {}

export default ClubModuleService