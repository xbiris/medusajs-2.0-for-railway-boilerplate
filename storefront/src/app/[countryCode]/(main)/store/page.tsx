import { Metadata } from "next"
import ClubCard from "@modules/club/components/club-card"

export const metadata: Metadata = {
  title: "Browse Clubs",
  description: "Explore sports clubs and book courts near you.",
}

// 1. Update the Props Type to match Next.js requirements
type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ sortBy?: string; page?: string }>
}

async function getClubs() {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  
  try {
    const res = await fetch(`${backendUrl}/store/custom/clubs`, {
      next: { tags: ["clubs"] },
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
    })
    
    if (!res.ok) {
      // This is what causes your other error (404)
      throw new Error(`Error ${res.status}: Failed to fetch clubs`)
    }
    
    return res.json()
  } catch (error) {
    console.error("Failed to load clubs:", error)
    return { clubs: [] }
  }
}

// 2. Await the params before using them
export default async function StorePage(props: Props) {
  const params = await props.params
  const { clubs } = await getClubs()

  return (
    <div className="content-container py-12 small:py-24">
      <div className="mb-10 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Sports Clubs
        </h1>
        <p className="text-gray-500">
          {/* Now accessing params.countryCode is safe */}
          Find the best courts in {params.countryCode.toUpperCase()} and book your next match.
        </p>
      </div>

      {clubs.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {clubs.map((club: any) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
          <p className="text-lg font-medium">No clubs found</p>
          <p className="text-gray-500">Check back later or add a club in the backend.</p>
        </div>
      )}
    </div>
  )
}