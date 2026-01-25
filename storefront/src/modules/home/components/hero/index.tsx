import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import CreateClubButton from "../../../club/components/create-club-button"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-ui-fg-base font-normal"
          >
            Sports Booking Platform
          </Heading>
          <Heading
            level="h2"
            className="text-3xl leading-10 text-ui-fg-subtle font-normal"
          >
            Book your court in seconds
          </Heading>
        </span>

        <div className="mt-4">
            <CreateClubButton />
        </div>

        <a
          href="https://funkyton.com/medusajs-2-0-is-finally-here/"
          target="_blank"
          className="mt-6 text-sm text-gray-500 hover:text-black"
        >
          View Tutorial Source
        </a>
      </div>
    </div>
  )
}

export default Hero