"use client"

import { useState } from "react"

export default function CreateClubButton() {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleCreate = async () => {
    setIsLoading(true)
    
    // Random handle to avoid duplicates during testing
    const randomHandle = `club-${Math.floor(Math.random() * 9000)}`
    const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

    try {
      const res = await fetch(`${BACKEND_URL}/store/custom/clubs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        // SEND THE NEW DATA FIELDS HERE:
        body: JSON.stringify({
          name: "Royal Tennis Club",
          handle: randomHandle,
          description: "The best clay courts in the city.",
          address: "123 Wimbledon Way",
          city: "London",
          phone: "+44 20 7946 0000",
          email: "contact@royaltennis.com",
          // user_id: "..." 
        }),
      })

      const data = await res.json()
      
      if (res.ok) {
        alert(`Success! Created: ${data.club.name} in ${data.club.city}`)
      } else {
        alert("Error creating club")
        console.error(data)
      }
    } catch (e) {
      console.error(e)
      alert("Failed to connect to server")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button 
      onClick={handleCreate}
      disabled={isLoading}
      className="bg-black text-white px-4 py-2 rounded-md hover:opacity-80 disabled:opacity-50"
    >
      {isLoading ? "Creating..." : "Create Full Club Entry"}
    </button>
  )
}