import { defineMiddlewares } from "@medusajs/medusa"
import multer from "multer"

// Configure multer to store files in memory temporarily
const upload = multer({ storage: multer.memoryStorage() })

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/custom/upload",
      method: "POST",
      // This middleware parses the "files" field from the form data
      middlewares: [upload.array("files")],
    },
  ],
})