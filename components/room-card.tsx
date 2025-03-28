import Image from "next/image"
import Link from "next/link"
import { Dog, Users, Eye, Wifi, Coffee, Tv } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useBooking } from "@/contexts/booking-context"
import { format } from "date-fns"

export interface RoomProps {
  id: number
  name: string
  description: string
  capacity: number
  price: number
  image: string
  dogsAllowed: boolean
  seaView: boolean
  amenities: string[]
}

export function RoomCard({ room }: { room: RoomProps }) {
  // Get booking context to access selected dates
  const { checkIn, checkOut, guests } = useBooking()

  // Create URL parameters for booking
  const getBookingParams = () => {
    const params = new URLSearchParams()

    // Add action=book parameter
    params.append("action", "book")

    // Add date parameters if available
    if (checkIn) {
      params.append("checkIn", format(checkIn, "yyyy-MM-dd"))
    }

    if (checkOut) {
      params.append("checkOut", format(checkOut, "yyyy-MM-dd"))
    }

    // Add guests parameter
    params.append("guests", guests.toString())

    return params.toString()
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative aspect-[4/3] w-full">
        <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
      </div>
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg sm:text-xl font-playfair">{room.name}</h3>
          <p className="text-base sm:text-lg font-semibold">
            €{room.price}
            <span className="text-xs sm:text-sm text-gray-500">/night</span>
          </p>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">{room.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <Users className="h-3 w-3" />
            {room.capacity} People
          </Badge>

          {room.dogsAllowed && (
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <Dog className="h-3 w-3" />
              Pet Friendly
            </Badge>
          )}

          {room.seaView && (
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <Eye className="h-3 w-3" />
              Sea View
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-3 text-gray-500 text-xs sm:text-sm mb-4">
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <div key={index} className="flex items-center gap-1">
              {amenity === "WiFi" && <Wifi className="h-3 w-3" />}
              {amenity === "Coffee Machine" && <Coffee className="h-3 w-3" />}
              {amenity === "TV" && <Tv className="h-3 w-3" />}
              {amenity}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-auto pt-4">
          <Link href={`/rooms/${room.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
          <Link href={`/rooms/${room.id}?${getBookingParams()}`} prefetch={false}>
            <Button size="sm">Book Now</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

