import ClubModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const CLUB_MODULE = "club"

export default Module(CLUB_MODULE, {
  service: ClubModuleService,
})