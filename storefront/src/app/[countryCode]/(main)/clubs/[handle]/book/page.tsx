import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import BookingSummary from "./booking-summary"

// --- TYPES ---
type Court = {
  id: string
  name: string
  sport: string
  slot_duration_minutes: number
  opening_time: string
  closing_time: string
}

type Props = {
  params: Promise<{ handle: string }>
  searchParams: Promise<{ sport?: string; date?: string; time?: string; court_id?: string }>
}


async function getClubWithCourts(handle: string) {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  try {
    // Ideally, your backend endpoint should support expanding relations: ?fields=*courts
    const res = await fetch(`${backendUrl}/store/custom/clubs/${handle}?fields=*courts`, {
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

async function getAvailability(handle: string, date: string, courtId: string) {
  if (!courtId) return []
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  
  const url = `${backendUrl}/store/custom/clubs/${handle}/availability?date=${date}&court_id=${courtId}`
  
  try {
    const res = await fetch(url, { 
      cache: "no-store",
      headers: { "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "" }
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.bookedTimes || [] 
  } catch (e) {
    return []
  }
}


function getNext7Days() {
  const dates = []
  const today = new Date()
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")

    dates.push({
      fullDate: `${year}-${month}-${day}`, 
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }), 
      dayNumber: d.getDate(), 
    })
  }
  return dates
}

// Helper to generate slots based on court config
function generateTimeSlots(start: string, end: string, incrementMinutes: number | string) {
  const slots: string[] = []
  
  const [startH, startM] = (start || "00:00").split(":").map(Number)
  const [endH, endM] = (end || "00:00").split(":").map(Number)
  const inc = Number(incrementMinutes)

  if (!inc || inc <= 0) return []
  if (isNaN(startH) || isNaN(endH)) return []

  let current = new Date(2000, 0, 1, startH, startM, 0, 0)
  const cutoff = new Date(2000, 0, 1, endH, endM, 0, 0)

  if (cutoff < current) {
    cutoff.setDate(cutoff.getDate() + 1)
  }

  while (current < cutoff) {
    const timeString = current.toLocaleTimeString("en-GB", { 
      hour: "2-digit", 
      minute: "2-digit" 
    })
    slots.push(timeString)
    
    current.setMinutes(current.getMinutes() + inc)
  }
  
  return slots
}


export default async function BookingPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  
  const club = await getClubWithCourts(params.handle)
  if (!club) return notFound()

  const selectedSport = searchParams.sport
  const getTodayLocal = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }
  const selectedDate = searchParams.date || getTodayLocal()
  const selectedCourtId = searchParams.court_id
  const selectedTime = searchParams.time 

  if (!selectedSport) {
    redirect(`/clubs/${club.handle}`)
  }

  // Filter Courts for this Sport
  const availableCourts = (club.courts || []).filter((c: Court) => c.sport === selectedSport)
  
  // Identify Selected Court Config
  const selectedCourt = availableCourts.find((c: Court) => c.id === selectedCourtId)

  const courtPrice = selectedCourt?.price || 0
  // Fetch Availability (Only if a court is selected)
  const bookedSlots = selectedCourt 
    ? await getAvailability(params.handle, selectedDate, selectedCourt.id) 
    : []

  // Generate Dynamic Time Slots
  let timeSlots: string[] = []
  if (selectedCourt) {
    timeSlots = generateTimeSlots(
      selectedCourt.opening_time, 
      selectedCourt.closing_time, 
      selectedCourt.slot_duration_minutes
    )
  }

  const upcomingDates = getNext7Days()

  return (
    <div className="content-container py-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
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
          
          <div className="md:col-span-2 flex flex-col gap-8">
            
            {/* Date Selector */}
            <div>
              <h3 className="text-lg font-medium mb-3">1. Select Date</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {upcomingDates.map((date) => {
                  const isSelected = date.fullDate === selectedDate
                  return (
                    <Link
                      key={date.fullDate}
                      scroll={false}
                      // Reset time when date changes, keep court if selected
                      href={`?sport=${selectedSport}&date=${date.fullDate}${selectedCourtId ? `&court_id=${selectedCourtId}` : ''}`} 
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

            {/* 2. Court Selector */}
            <div>
              <h3 className="text-lg font-medium mb-3">2. Select Court</h3>
              {availableCourts.length === 0 ? (
                 <p className="text-sm text-gray-500">No courts found for {selectedSport}.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {availableCourts.map((court: Court) => {
                    const isSelected = court.id === selectedCourtId
                    return (
                      <Link
                        key={court.id}
                        scroll={false}
                        // Reset time when court changes
                        href={`?sport=${selectedSport}&date=${selectedDate}&court_id=${court.id}`}
                        className={`
                          p-4 rounded-md border text-left transition-all
                          ${isSelected
                            ? "border-black bg-gray-50 ring-1 ring-black"
                            : "border-gray-200 hover:border-gray-400 bg-white"}
                        `}
                      >
                        <div className="font-semibold">{court.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {court.slot_duration_minutes} min slots
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Time Selector */}
            <div>
              <h3 className="text-lg font-medium mb-3">
                3. Select Time 
                {selectedCourt && <span className="text-sm font-normal text-gray-500 ml-2">({selectedCourt.slot_duration_minutes} min increments)</span>}
              </h3>
              
              {!selectedCourtId ? (
                <div className="p-4 bg-gray-50 border border-dashed rounded-md text-gray-500 text-sm">
                  Please select a court first to see available times.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 small:grid-cols-4">
                  {timeSlots.map((time) => {
                    const isSelected = time === selectedTime
                    const isTaken = bookedSlots.includes(time)
                    
                    return (
                      <Link
                          key={time}
                          scroll={false}
                          href={isTaken ? "" : `?sport=${selectedSport}&date=${selectedDate}&court_id=${selectedCourtId}&time=${time}`}
                          aria-disabled={isTaken}
                          className={`
                          py-3 px-4 rounded-md text-center text-sm font-medium border transition-all
                          ${isTaken 
                              ? "bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed" 
                              : isSelected
                              ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                              : "border-gray-200 hover:border-gray-400 bg-white"
                          }
                          `}
                      >
                          {time}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="md:col-span-1">
            <BookingSummary 
              clubHandle={club.handle}
              sport={selectedSport}
              courtId={selectedCourt?.id}    
              courtName={selectedCourt?.name} 
              date={selectedDate}
              time={selectedTime}
              price={courtPrice}
            />
          </div>

        </div>
      </div>
    </div>
  )
}