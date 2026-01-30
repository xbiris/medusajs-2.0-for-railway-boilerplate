import Link from "next/link"

type ClubCardProps = {
  club: {
    handle: string
    name: string
    city: string
    logo_url?: string
    metadata?: {
      sports?: any // We loosen this type to safely handle bad data
    }
  }
}

export default function ClubCard({ club }: ClubCardProps) {
  // SAFETY CHECK: Ensure 'sports' is a valid array. 
  // If it's undefined, null, or a string, we default to an empty array []
  const sportsList = Array.isArray(club.metadata?.sports) 
    ? club.metadata.sports 
    : []

  return (
    <Link 
      href={`/clubs/${club.handle}`} 
      className="group block rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
    >
      {/* Image Section */}
      <div className="aspect-[4/3] w-full overflow-hidden rounded-t-lg bg-gray-100 relative">
        {club.logo_url ? (
          <img
            src={club.logo_url}
            alt={club.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <span className="text-4xl">🏆</span>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-sans text-lg font-medium text-gray-900 group-hover:text-blue-600">
              {club.name}
            </h3>
            <p className="text-sm text-gray-500">{club.city || "Location n/a"}</p>
          </div>
        </div>

        {/* Sports Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {sportsList.map((sport: string) => (
            <span 
              key={sport} 
              className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
            >
              {sport}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}