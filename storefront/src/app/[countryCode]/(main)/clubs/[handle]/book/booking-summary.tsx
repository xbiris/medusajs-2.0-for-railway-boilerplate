"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Props = {
  clubHandle: string // <--- NEW PROP
  sport: string
  date: string
  time?: string
  price: number
}

export default function BookingSummary({ clubHandle, sport, date, time, price }: Props) {
  const [isBooking, setIsBooking] = useState(false)
  const router = useRouter()
  
  const handleConfirm = async () => {
    if (!time) return
    setIsBooking(true)

    const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

    try {
      const res = await fetch(`${BACKEND_URL}/store/custom/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        body: JSON.stringify({
          club_handle: clubHandle,
          sport,
          date,
          time,
        }),
      })

      if (!res.ok) throw new Error("Booking failed")

      // Success
      alert("Booking Successful!")
      
      // Redirect back to the club page and refresh to update availability
      router.push(`/clubs/${clubHandle}`)
      router.refresh() 

    } catch (e) {
      alert("Error creating booking")
      console.error(e)
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <div className="rounded-xl border bg-gray-50 p-6 sticky top-24">
      <h3 className="font-bold text-lg mb-4">Booking Summary</h3>
      
      <div className="space-y-3 text-sm border-b border-gray-200 pb-4 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Sport</span>
          <span className="font-medium">{sport}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Date</span>
          <span className="font-medium">{date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Time</span>
          <span className="font-medium">
            {time || <span className="text-orange-600 italic">Select a time</span>}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Duration</span>
          <span className="font-medium">60 min</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-lg font-bold mb-6">
        <span>Total</span>
        <span>€{price.toFixed(2)}</span>
      </div>

      <button
        disabled={!time || isBooking}
        onClick={handleConfirm}
        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {isBooking ? "Booking..." : "Confirm Booking"}
      </button>
      
      {!time && (
          <p className="text-xs text-center text-gray-500 mt-2">
            Please select a time slot to continue
          </p>
      )}
    </div>
  )
}