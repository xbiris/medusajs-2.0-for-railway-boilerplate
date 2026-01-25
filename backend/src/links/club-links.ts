import { defineLink } from "@medusajs/framework/utils"
import ClubModule from "../modules/club"
import UserModule from "@medusajs/medusa/user"
import ProductModule from "@medusajs/medusa/product"

export default defineLink(
  // Link Club to User (One Club has many Users)
  {
    linkable: ClubModule.linkable.club,
    isList: false, // A user belongs to ONE club
  },
  UserModule.linkable.user
)

// You can also define the Product link in the same file or a separate one
export const ClubProductLink = defineLink(
  {
    linkable: ClubModule.linkable.club,
    isList: false, // A product belongs to ONE club
  },
  ProductModule.linkable.product
)