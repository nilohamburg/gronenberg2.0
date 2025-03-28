"use client"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingCalendar } from "@/components/booking-calendar"
import type { RoomProps } from "@/components/room-card"
import { Dog, Users, Eye, Wifi, Coffee, Tv, Check } from "lucide-react"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { parseISO, isValid } from "date-fns"
import { useBooking } from "@/contexts/booking-context"
import { SearchBar } from "@/components/search-bar"
import { ExpandedFilter } from "@/components/expanded-filter"

// Sample room data (same as in rooms/page.tsx)
const roomsData: RoomProps[] = Array.from({ length: 32 }, (_, i) => ({
  id: i + 1,
  name: `${["Deluxe", "Premium", "Luxury", "Standard"][i % 4]} ${["Cottage", "Villa", "House", "Suite"][i % 4]} ${i + 1}`,
  description: `A beautiful ${["cozy", "spacious", "elegant", "charming"][i % 4]} accommodation with ${(i % 3) + 2} bedrooms and modern amenities. Perfect for a relaxing getaway in the countryside.`,
  capacity: (i % 3) + 2, // 2, 3, or 4 people
  price: 150 + ((i * 10) % 200),
  image: `/placeholder.svg?height=400&width=600&text=House ${i + 1}`,
  dogsAllowed: i % 3 === 0, // Every 3rd room allows dogs
  seaView: i % 4 === 0, // Every 4th room has sea view
  amenities: [
    "WiFi",
    "Coffee Machine",
    "TV",
    ...(i % 2 === 0 ? ["Fireplace"] : []),
    ...(i % 5 === 0 ? ["Private Garden"] : []),
    ...(i % 7 === 0 ? ["Balcony"] : []),
  ],
}))

export default function RoomDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [shouldOpenBooking, setShouldOpenBooking] = useState(false)
  const [showExpandedFilter, setShowExpandedFilter] = useState(false)
  const hasProcessedAction = useRef(false)
  const isUpdatingContext = useRef(false)

  // Get booking context to potentially update with URL parameters
  const { checkIn, checkOut, guests, setCheckIn, setCheckOut, setGuests } = useBooking()

  // Process URL parameters and update booking context
  useEffect(() => {
    if (hasProcessedAction.current) return

    const action = searchParams.get("action")
    const checkInParam = searchParams.get("checkIn")
    const checkOutParam = searchParams.get("checkOut")
    const guestsParam = searchParams.get("guests")

    let shouldUpdateContext = false

    // Update booking context with URL parameters if available
    if (checkInParam && checkOutParam) {
      try {
        const checkInDate = parseISO(checkInParam)
        const checkOutDate = parseISO(checkOutParam)

        // Only update if dates are valid
        if (isValid(checkInDate) && isValid(checkOutDate) && checkOutDate > checkInDate) {
          isUpdatingContext.current = true
          setCheckIn(checkInDate)
          setCheckOut(checkOutDate)
          shouldUpdateContext = true
        }
      } catch (error) {
        console.error("Error parsing date parameters:", error)
      }
    }

    if (guestsParam) {
      const guestsValue = Number.parseInt(guestsParam, 10)
      if (!isNaN(guestsValue) && guestsValue > 0) {
        isUpdatingContext.current = true
        setGuests(guestsValue)
        shouldUpdateContext = true
      }
    }

    if (action === "book") {
      // Set flag to prevent re-processing
      hasProcessedAction.current = true

      // Scroll to the booking section
      setShouldOpenBooking(true)

      // Scroll to the booking section after a short delay to ensure it's rendered
      setTimeout(() => {
        const bookingElement = document.getElementById("booking-section")
        if (bookingElement) {
          bookingElement.scrollIntoView({ behavior: "smooth" })
        }
      }, 300)
    }

    // Mark as processed
    hasProcessedAction.current = true

    // Reset the updating context flag after a short delay
    if (shouldUpdateContext) {
      setTimeout(() => {
        isUpdatingContext.current = false
      }, 100)
    }
  }, [searchParams, setCheckIn, setCheckOut, setGuests])

  const roomId = Number(params.id)
  const room = roomsData.find((r) => r.id === roomId)

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Room not found</h1>
            <Button onClick={() => router.push("/rooms")}>Back to Rooms</Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const roomImages = [
    room.image,
    `/placeholder.svg?height=400&width=600&text=Interior ${room.id}`,
    `/placeholder.svg?height=400&width=600&text=Bathroom ${room.id}`,
    `/placeholder.svg?height=400&width=600&text=View ${room.id}`,
  ]

  // Handle expanded filter changes
  const handleCheckInChange = (date: Date | undefined) => {
    if (!date) return
    setCheckIn(date)
  }

  const handleCheckOutChange = (date: Date | undefined) => {
    if (!date) return
    setCheckOut(date)
  }

  const handleGuestsChange = (guests: number) => {
    setGuests(guests)
  }

  const handleSearch = () => {
    setShowExpandedFilter(false)
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-24">
        <Button variant="ghost" className="mb-4" onClick={() => router.push("/rooms")}>
          ← Back to All Rooms
        </Button>

        {/* Date Selection Bar (similar to /rooms page) */}
        <div className="mb-8">
          <SearchBar
            initialCheckIn={checkIn || undefined}
            initialCheckOut={checkOut || undefined}
            initialGuests={guests}
            onClick={() => setShowExpandedFilter(!showExpandedFilter)}
            className="border-2 border-gray-300 rounded-lg"
          />

          {showExpandedFilter && (
            <ExpandedFilter
              checkIn={checkIn || new Date()}
              checkOut={checkOut || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
              guests={guests}
              houses={1}
              withPets={false}
              onCheckInChange={handleCheckInChange}
              onCheckOutChange={handleCheckOutChange}
              onGuestsChange={handleGuestsChange}
              onHousesChange={() => {}}
              onWithPetsChange={() => {}}
              onSearch={handleSearch}
              className="mt-2"
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Details */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-playfair mb-4">{room.name}</h1>

            {/* Image Gallery */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
                    <Image src={roomImages[0] || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                  </div>
                </div>
                {roomImages.slice(1).map((image, index) => (
                  <div key={index} className="relative h-[150px] rounded-lg overflow-hidden">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${room.name} - Image ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                <Users className="h-4 w-4" />
                <span>{room.capacity} People</span>
              </div>

              {room.dogsAllowed && (
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                  <Dog className="h-4 w-4" />
                  <span>Pet Friendly</span>
                </div>
              )}

              {room.seaView && (
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                  <Eye className="h-4 w-4" />
                  <span>Sea View</span>
                </div>
              )}

              {room.amenities.slice(0, 3).map((amenity, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                  {amenity === "WiFi" && <Wifi className="h-4 w-4" />}
                  {amenity === "Coffee Machine" && <Coffee className="h-4 w-4" />}
                  {amenity === "TV" && <Tv className="h-4 w-4" />}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="p-4">
                <p className="text-gray-700 mb-4">{room.description}</p>
                <p className="text-gray-700">
                  This accommodation offers a perfect blend of comfort and luxury. Enjoy the peaceful surroundings and
                  take advantage of all the amenities provided for a memorable stay. The spacious layout ensures
                  everyone has their own space to relax and unwind.
                </p>
              </TabsContent>
              <TabsContent value="amenities" className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Room Features</h3>
                    <ul className="space-y-2">
                      {room.amenities.map((amenity, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          {amenity}
                        </li>
                      ))}
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Air Conditioning
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Heating
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Safe
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Bathroom</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Shower
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Bathtub
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Hairdryer
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Toiletries
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="policies" className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Check-in / Check-out</h3>
                    <p className="text-gray-700">Check-in: 3:00 PM - 10:00 PM</p>
                    <p className="text-gray-700">Check-out: by 11:00 AM</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Cancellation Policy</h3>
                    <p className="text-gray-700">
                      Free cancellation up to 7 days before check-in. Cancellations made within 7 days of check-in are
                      subject to a charge equal to 50% of the total stay.
                    </p>
                  </div>
                  {room.dogsAllowed && (
                    <div>
                      <h3 className="font-medium mb-1">Pet Policy</h3>
                      <p className="text-gray-700">
                        Pets are allowed in this accommodation. A pet fee of €25 per stay applies. Please inform the
                        property in advance if you plan to bring a pet.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div>
            <div className="sticky top-24" id="booking-section">
              <BookingCalendar roomId={room.id} basePrice={room.price} maxGuests={room.capacity} roomName={room.name} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

