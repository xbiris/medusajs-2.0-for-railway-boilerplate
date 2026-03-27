import { MedusaService } from "@medusajs/framework/utils"
import { Club } from "./models/club"
import { Booking } from "./models/booking"
import { Court } from "./models/court"
import { RecurringBooking } from "./models/recurring-booking"
import { RegularUser } from "./models/regular-user"

class ClubModuleService extends MedusaService({
  Club,
  Court,
  Booking,
  RecurringBooking,
  RegularUser,
}) {}

export default ClubModuleService