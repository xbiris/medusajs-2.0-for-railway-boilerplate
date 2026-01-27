import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"

type Props = {
  params: Promise<{ handle: string }>
}

// 1. Fetch the specific club data
async function getClub(handle: string) {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  
  try {
    const res = await fetch(`${backendUrl}/store/custom/clubs/${handle}`, {
      next: { tags: ["clubs"] },
      cache: "no-store",
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
    })
    
    if (!res.ok) return null
    
    const data = await res.json()
    return data.club
  } catch (error) {
    return null
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const club = await getClub(params.handle)
  if (!club) return { title: "Not Found" }
  return {
    title: `${club.name} - Book Courts`,
    description: club.description,
  }
}

export default async function ClubPage(props: Props) {
  const params = await props.params
  const club = await getClub(params.handle)

  if (!club) {
    return notFound()
  }

  // Extract sports from metadata (default to empty array if missing)
  const sports = club.metadata?.sports || []

  return (
    <div className="content-container py-12">
      {/* Club Header Section */}
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
        
        {/* Logo / Image */}
        <div className="aspect-square w-full max-w-[300px] overflow-hidden rounded-lg bg-gray-100 border relative">
          {club.logo_url ? (
            <img
              src={club.logo_url}
              alt={club.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">🏆</div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900">{club.name}</h1>
          <p className="mt-2 text-lg text-gray-500">{club.city}</p>
          <div className="mt-6 space-y-2 text-gray-600">
            <p>{club.description}</p>
            <p className="text-sm">📍 {club.address}</p>
            <p className="text-sm">📞 {club.phone}</p>
          </div>
        </div>
      </div>

      <hr className="my-12 border-gray-200" />

      {/* Select Sport Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Select a Sport</h2>
        
        {sports.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {sports.map((sport: string) => (
              <Link
                key={sport}
                // We link to the booking page, passing the sport as a query parameter
                href={`/clubs/${club.handle}/book?sport=${sport}`}
                className="group flex items-center justify-between rounded-xl border border-gray-200 p-6 hover:border-blue-600 hover:ring-1 hover:ring-blue-600 transition-all bg-white"
              >
                <span className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                  {sport}
                </span>
                <span className="text-gray-400 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-500">
            No sports listed for this club yet.
          </div>
        )}
      </div>
    </div>
  )
}