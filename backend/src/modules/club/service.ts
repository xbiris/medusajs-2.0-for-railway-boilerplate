import { MedusaService } from "@medusajs/framework/utils"
import { Club } from "./models/club"
import { Booking } from "./models/booking"

class ClubModuleService extends MedusaService({
  Club,
  Booking,
}) {}

export default ClubModuleService