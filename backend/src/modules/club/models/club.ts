import { model } from "@medusajs/framework/utils"

export const Club = model.define("club", {
  id: model.id().primaryKey(),
  name: model.text(),
  handle: model.text().unique(),
})