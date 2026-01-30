"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

// Define the shape of a Court before it's saved
type CourtDraft = {
  name: string
  sport: string
  slot_duration_minutes: number
  opening_time: string
  closing_time: string
}

export default function CreateClubForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()

  // 1. Club State
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    description: "The best club in town",
    address: "123 Sport Street",
    phone: "+1 234 567 890",
    email: "contact@club.com",
    handle: `club-${Math.floor(Math.random() * 10000)}` 
  })

  // 2. Courts State (The list of courts we will send)
  const [courts, setCourts] = useState<CourtDraft[]>([])

  // 3. Current New Court Input State
  const [newCourt, setNewCourt] = useState<CourtDraft>({
    name: "Court 1",
    sport: "Tennis",
    slot_duration_minutes: 60,
    opening_time: "08:00",
    closing_time: "22:00"
  })

  // Helper: Add Court to list
  const addCourt = () => {
    setCourts([...courts, newCourt])
    // Reset name for convenience, keep other settings
    setNewCourt({ ...newCourt, name: `Court ${courts.length + 2}` })
  }

  // Helper: Remove Court from list
  const removeCourt = (index: number) => {
    setCourts(courts.filter((_, i) => i !== index))
  }

  const handleCreate = async () => {
    if (!file) return alert("Please select a logo first!")
    if (courts.length === 0) return alert("Please add at least one court!")
    
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
        headers: { "x-publishable-api-key": API_KEY },
        body: uploadData, 
      })

      if (!uploadRes.ok) throw new Error("Image upload failed")
      const uploadResult = await uploadRes.json()
      const logoUrl = uploadResult.url

      // --- PHASE 2: Create Club with Courts ---
      console.log("2. Creating club and courts...")
      
      const payload = {
        ...formData,
        logo_url: logoUrl,
        metadata: { sports: Array.from(new Set(courts.map(c => c.sport))) },
        courts: courts // <--- SENDING THE COURTS ARRAY
      }

      const clubRes = await fetch(`${BACKEND_URL}/store/custom/clubs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": API_KEY,
        },
        body: JSON.stringify(payload),
      })

      if (!clubRes.ok) {
        const error = await clubRes.json()
        throw new Error(error.message || "Failed to create club")
      }

      alert("Success! Club and courts created.")
      router.refresh() 

    } catch (e: any) {
      console.error(e)
      alert("Error: " + e.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl border p-8 rounded-xl bg-white shadow-sm">
      
      {/* SECTION 1: CLUB DETAILS */}
      <div>
        <h3 className="font-bold text-xl mb-4 border-b pb-2">1. Club Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Club Name</label>
                <input 
                type="text"
                className="w-full border p-2 rounded text-sm"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Royal Tennis Club"
                />
            </div>
            <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">City</label>
                <input 
                type="text"
                className="w-full border p-2 rounded text-sm"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
            </div>
            <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Logo</label>
                <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                />
            </div>
        </div>
      </div>

      {/* SECTION 2: ADD COURTS */}
      <div>
        <h3 className="font-bold text-xl mb-4 border-b pb-2">2. Add Courts</h3>
        
        {/* New Court Form */}
        <div className="bg-gray-50 p-4 rounded-lg border mb-4">
            <h4 className="font-medium text-sm mb-3">Configure New Court</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
                <input 
                    placeholder="Name (e.g. Center Court)" 
                    className="border p-2 rounded text-sm"
                    value={newCourt.name}
                    onChange={(e) => setNewCourt({...newCourt, name: e.target.value})}
                />
                <select 
                    className="border p-2 rounded text-sm"
                    value={newCourt.sport}
                    onChange={(e) => setNewCourt({...newCourt, sport: e.target.value})}
                >
                    <option value="Tennis">Tennis</option>
                    <option value="Padel">Padel</option>
                    <option value="Pickleball">Pickleball</option>
                    <option value="Badminton">Badminton</option>
                </select>
                <div>
                    <span className="text-xs text-gray-500 block">Open</span>
                    <input type="time" className="border p-2 rounded text-sm w-full"
                        value={newCourt.opening_time}
                        onChange={(e) => setNewCourt({...newCourt, opening_time: e.target.value})}
                    />
                </div>
                <div>
                    <span className="text-xs text-gray-500 block">Close</span>
                    <input type="time" className="border p-2 rounded text-sm w-full"
                        value={newCourt.closing_time}
                        onChange={(e) => setNewCourt({...newCourt, closing_time: e.target.value})}
                    />
                </div>
                <div>
                    <span className="text-xs text-gray-500 block">Slot Duration (min)</span>
                    <input type="number" className="border p-2 rounded text-sm w-full"
                        value={newCourt.slot_duration_minutes}
                        onChange={(e) => setNewCourt({...newCourt, slot_duration_minutes: Number(e.target.value)})}
                    />
                </div>
            </div>
            <button onClick={addCourt} className="w-full bg-gray-900 text-white text-sm py-2 rounded hover:bg-black">
                + Add Court to List
            </button>
        </div>

        {/* List of Courts to be created */}
        <div className="space-y-2">
            {courts.map((court, i) => (
                <div key={i} className="flex items-center justify-between border p-3 rounded bg-white">
                    <div>
                        <div className="font-bold text-sm">{court.name} <span className="text-gray-400 font-normal">| {court.sport}</span></div>
                        <div className="text-xs text-gray-500">
                            {court.opening_time} - {court.closing_time} ({court.slot_duration_minutes} min slots)
                        </div>
                    </div>
                    <button onClick={() => removeCourt(i)} className="text-red-500 text-xs hover:underline">Remove</button>
                </div>
            ))}
            {courts.length === 0 && <p className="text-sm text-gray-400 italic text-center py-2">No courts added yet.</p>}
        </div>
      </div>

      {/* SUBMIT */}
      <button 
        onClick={handleCreate}
        disabled={isLoading || !formData.name || courts.length === 0}
        className="bg-blue-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mt-2"
      >
        {isLoading ? "Creating..." : "Create Club & Courts"}
      </button>
    </div>
  )
}