import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import BookingSummary from "./booking-summary" // Make sure this import matches your file structure

type Props = {
  params: Promise<{ handle: string }>
  searchParams: Promise<{ sport?: string; date?: string; time?: string }>
}

async function getClub(handle: string) {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  try {
    const res = await fetch(`${backendUrl}/store/custom/clubs/${handle}`, {
      next: { tags: ["clubs"] },
      cache: "no-store",
      headers: { "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "" },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.club
  } catch (e) {
    return null
  }
}

async function getAvailability(handle: string, date: string, sport: string) {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  console.log(`Fetching availability: ${backendUrl}/store/custom/clubs/${handle}/availability?date=${date}&sport=${sport}`)
  try {
    const res = await fetch(
      `${backendUrl}/store/custom/clubs/${handle}/availability?date=${date}&sport=${sport}`,
      { 
        cache: "no-store",
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        }
      } 
    )
    if (!res.ok) return []
    const data = await res.json()
    console.log("Booked Slots Received:", data.bookedTimes)
    return data.bookedTimes || [] // Returns array like ["10:00", "11:00"]
  } catch (e) {
    return []
  }
}

// Helper for Next 7 Days (Timezone Safe)
function getNext7Days() {
  const dates = []
  const today = new Date()
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    
    // Use local time instead of ISO (UTC)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    const localDateString = `${year}-${month}-${day}`

    dates.push({
      fullDate: localDateString, 
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }), 
      dayNumber: d.getDate(), 
    })
  }
  return dates
}

// Define Time Slots (hardcoded just for now)
const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
]

export default async function BookingPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  
  const club = await getClub(params.handle)
  if (!club) return notFound()

  // Read URL parameters
  const selectedSport = searchParams.sport
  const getTodayLocal = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }
  const selectedDate = searchParams.date || getTodayLocal()
  const selectedTime = searchParams.time // This drives the selection state

  // Force redirect if no sport is selected
  if (!selectedSport) {
    redirect(`/clubs/${club.handle}`)
  }

  const bookedSlots = await getAvailability(params.handle, selectedDate, selectedSport)
  const upcomingDates = getNext7Days()

  return (
    <div className="content-container py-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-8 border-b pb-4">
          <Link 
            href={`/clubs/${club.handle}`} 
            className="text-sm text-gray-500 hover:text-black mb-2 inline-block"
          >
            ← Back to Club
          </Link>
          <h1 className="text-3xl font-bold">Book {selectedSport}</h1>
          <p className="text-gray-500">at {club.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* LEFT COL: Selectors */}
          <div className="md:col-span-2 flex flex-col gap-8">
            
            {/* 1. Date Selector */}
            <div>
              <h3 className="text-lg font-medium mb-3">1. Select Date</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {upcomingDates.map((date) => {
                  const isSelected = date.fullDate === selectedDate
                  return (
                    <Link
                      key={date.fullDate}
                      scroll={false}
                      // Keep sport, change date, reset time (optional, but good UX)
                      href={`?sport=${selectedSport}&date=${date.fullDate}`} 
                      className={`
                        flex min-w-[70px] flex-col items-center rounded-lg border p-3 transition-all
                        ${isSelected 
                          ? "border-black bg-black text-white" 
                          : "border-gray-200 bg-white hover:border-gray-400 text-gray-900"}
                      `}
                    >
                      <span className="text-xs opacity-80">{date.dayName}</span>
                      <span className="text-xl font-bold">{date.dayNumber}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* 2. Time Selector */}
            <div>
              <h3 className="text-lg font-medium mb-3">2. Select Time</h3>
              <div className="grid grid-cols-3 gap-3 small:grid-cols-4">
                {TIME_SLOTS.map((time) => {
                  const isSelected = time === selectedTime
                  const isTaken = bookedSlots.includes(time)
                  return (
                    <Link
                        key={time}
                        scroll={false}
                        // If taken, disable the link by removing href (or pointing to null)
                        href={isTaken ? "" : `?sport=${selectedSport}&date=${selectedDate}&time=${time}`}
                        aria-disabled={isTaken}
                        className={`
                        py-3 px-4 rounded-md text-center text-sm font-medium border transition-all
                        ${isTaken 
                            ? "bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed decoration-slice" // Greyed out style
                            : isSelected
                            ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                            : "border-gray-200 hover:border-gray-400 bg-white"
                        }
                        `}
                    >
                        {time} {isTaken && "(Booked)"}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COL: Summary Component */}
          <div className="md:col-span-1">
            <BookingSummary 
              clubHandle={club.handle}
              sport={selectedSport}
              date={selectedDate}
              time={selectedTime}
              price={20.00} 
            />
          </div>

        </div>
      </div>
    </div>
  )
}