"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateClubForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()

  // Basic form state
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    description: "The best club in town",
    address: "123 Sport Street",
    phone: "+1 234 567 890",
    email: "contact@club.com",
    handle: `club-${Math.floor(Math.random() * 10000)}` // Random handle for testing
  })

  const handleCreate = async () => {
    if (!file) return alert("Please select a logo first!")
    setIsLoading(true)

    const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

    try {
      // --- PHASE 1: Upload Image ---
      console.log("1. Uploading image...")
      const uploadData = new FormData()
      uploadData.append("files", file)

      const uploadRes = await fetch(`${BACKEND_URL}/store/custom/upload`, {
        method: "POST",
        headers: {
            "x-publishable-api-key": API_KEY,
            // Note: Never set Content-Type for FormData, the browser does it automatically
        },
        body: uploadData, 
      })

      if (!uploadRes.ok) {
        const err = await uploadRes.json()
        throw new Error(err.message || "Image upload failed")
      }

      const uploadResult = await uploadRes.json()
      const logoUrl = uploadResult.url
      console.log("Image uploaded to:", logoUrl)

      // --- PHASE 2: Create Club ---
      console.log("2. Creating club with URL...")
      const clubRes = await fetch(`${BACKEND_URL}/store/custom/clubs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": API_KEY,
        },
        body: JSON.stringify({
          ...formData,
          logo_url: logoUrl, // <--- Attaching the real URL here!
          metadata: {
            sports: ["Tennis", "Padel"] // Hardcoded for demo
          }
        }),
      })

      if (!clubRes.ok) throw new Error("Failed to create club entry")

      alert("Success! Club created with logo.")
      router.refresh() // Refresh page to see new club

    } catch (e: any) {
      console.error(e)
      alert("Error: " + e.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-md border p-6 rounded-lg bg-white shadow-sm">
      <h3 className="font-bold text-lg">Create New Club</h3>
      
      {/* Name Input */}
      <div>
        <label className="block text-sm font-medium mb-1">Club Name</label>
        <input 
          type="text"
          className="w-full border p-2 rounded text-sm"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="e.g. Royal Tennis Club"
        />
      </div>

      {/* City Input */}
      <div>
        <label className="block text-sm font-medium mb-1">City</label>
        <input 
          type="text"
          className="w-full border p-2 rounded text-sm"
          value={formData.city}
          onChange={(e) => setFormData({...formData, city: e.target.value})}
          placeholder="e.g. London"
        />
      </div>

      {/* File Input */}
      <div>
        <label className="block text-sm font-medium mb-1">Club Logo</label>
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <button 
        onClick={handleCreate}
        disabled={isLoading || !formData.name}
        className="bg-black text-white px-4 py-2 rounded mt-2 hover:opacity-80 disabled:opacity-50 transition-opacity"
      >
        {isLoading ? "Uploading..." : "Create Club"}
      </button>
    </div>
  )
}