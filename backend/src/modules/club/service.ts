import { MedusaService } from "@medusajs/framework/utils"
import { Club } from "./models/club"

class ClubModuleService extends MedusaService({
  Club,
}) {}

export default ClubModuleService