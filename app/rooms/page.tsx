"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { PageHeader } from "@/components/page-header"
import { RoomCard, type RoomProps } from "@/components/room-card"
import { Footer } from "@/components/footer"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, CalendarIcon, ChevronDown, ChevronUp } from "lucide-react"
import { format, parseISO, addDays } from "date-fns"
import { getAvailableRooms } from "@/utils/availability"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { useLanguage } from "@/contexts/language-context"
import { useBooking } from "@/contexts/booking-context"
import { cn } from "@/lib/utils"

// Sample room data
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

export default function RoomsPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [rooms, setRooms] = useState<RoomProps[]>(roomsData)
  const [filters, setFilters] = useState({
    capacity: [2, 4], // Min and max capacity
    dogsAllowed: false,
    seaView: false,
    priceRange: [150, 350], // Min and max price
  })
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false)
  const today = new Date()

  // Use the shared booking context
  const { checkIn, checkOut, guests, setCheckIn, setCheckOut, setGuests } = useBooking()

  // Prevent initial render issues
  const initialRender = useRef(true)

  // Parse URL parameters on initial load
  const parseUrlParams = useCallback(() => {
    const checkInParam = searchParams.get("checkIn")
    const checkOutParam = searchParams.get("checkOut")
    const guestsParam = searchParams.get("guests")

    if (checkInParam && checkOutParam) {
      try {
        const checkInDate = parseISO(checkInParam)
        const checkOutDate = parseISO(checkOutParam)
        const guestsValue = guestsParam ? Number.parseInt(guestsParam) : 2

        setCheckIn(checkInDate)
        setCheckOut(checkOutDate)
        setGuests(guestsValue)

        // If guests parameter is provided, update capacity filter
        setFilters((prev) => ({
          ...prev,
          capacity: [guestsValue, Math.max(guestsValue, prev.capacity[1])],
        }))
      } catch (error) {
        console.error("Error parsing date parameters:", error)
      }
    }
  }, [searchParams, setCheckIn, setCheckOut, setGuests])

  // Parse URL parameters only once on initial load
  useEffect(() => {
    parseUrlParams()
  }, [parseUrlParams])

  // Apply filters
  const applyFilters = useCallback(() => {
    let filteredRooms = [...roomsData]

    // Apply date filter if both check-in and check-out dates are provided
    if (checkIn && checkOut) {
      filteredRooms = getAvailableRooms(filteredRooms, checkIn, checkOut, guests)
    }

    // Apply capacity filter
    filteredRooms = filteredRooms.filter((room) => {
      // Filter by capacity
      if (room.capacity < filters.capacity[0] || room.capacity > filters.capacity[1]) {
        return false
      }

      // Filter by dogs allowed
      if (filters.dogsAllowed && !room.dogsAllowed) {
        return false
      }

      // Filter by sea view
      if (filters.seaView && !room.seaView) {
        return false
      }

      // Filter by price range
      if (room.price < filters.priceRange[0] || room.price > filters.priceRange[1]) {
        return false
      }

      return true
    })

    setRooms(filteredRooms)
  }, [filters, checkIn, checkOut, guests, roomsData])

  // Call applyFilters when filters or dateFilter change
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      return
    }
    applyFilters()
  }, [applyFilters])

  const handleCapacityChange = useCallback((value: number[]) => {
    setFilters((prev) => ({ ...prev, capacity: value }))
  }, [])

  const handlePriceChange = useCallback((value: number[]) => {
    setFilters((prev) => ({ ...prev, priceRange: value }))
  }, [])

  const handleCheckboxChange = useCallback((name: "dogsAllowed" | "seaView") => {
    setFilters((prev) => ({ ...prev, [name]: !prev[name] }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      capacity: [2, 4],
      dogsAllowed: false,
      seaView: false,
      priceRange: [150, 350],
    })
  }, [])

  const clearDateFilter = useCallback(() => {
    setCheckIn(null)
    setCheckOut(null)
    setGuests(2)
  }, [setCheckIn, setCheckOut, setGuests])

  // Handle check-in date change
  const handleCheckInChange = useCallback(
    (date: Date | undefined) => {
      if (!date) return

      // If check-out date is before the new check-in date, adjust it
      if (checkOut && date > checkOut) {
        setCheckIn(date)
        setCheckOut(addDays(date, 1)) // Set check-out to the day after check-in
      } else {
        setCheckIn(date)
        if (!checkOut) {
          setCheckOut(addDays(date, 7)) // Default to 7-day stay if no checkout date
        }
      }
      setIsCheckInOpen(false)
    },
    [checkOut, setCheckIn, setCheckOut],
  )

  // Handle check-out date change
  const handleCheckOutChange = useCallback(
    (date: Date | undefined) => {
      if (!date) return

      // If check-in date is after the new check-out date, adjust it
      if (checkIn && date < checkIn) {
        setCheckIn(addDays(date, -1)) // Set check-in to the day before check-out
        setCheckOut(date)
      } else {
        setCheckOut(date)
        if (!checkIn) {
          setCheckIn(today) // Default to today if no check-in date
        }
      }
      setIsCheckOutOpen(false)
    },
    [checkIn, today, setCheckIn, setCheckOut],
  )

  // Handle guests change
  const handleGuestsChange = useCallback(
    (value: string) => {
      setGuests(Number.parseInt(value, 10))
    },
    [setGuests],
  )

  const FilterContent = useCallback(
    () => (
      <>
        <div className="space-y-6">
          {/* Date Filter (if active) */}
          {checkIn && checkOut && (
            <div className="mb-4 p-3 bg-primary/10 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Date Filter</h3>
                <Button variant="ghost" size="sm" onClick={clearDateFilter} className="h-7 px-2 text-xs">
                  Clear
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <span>
                  {checkIn && format(checkIn, "MMM d, yyyy")} - {checkOut && format(checkOut, "MMM d, yyyy")}
                </span>
              </div>
              <div className="text-sm mt-1">
                For {guests} {guests === 1 ? "guest" : "guests"}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium mb-2">Capacity</h3>
            <div className="space-y-4">
              {/* Replace the Slider with a simple range display and buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    if (filters.capacity[0] > 2) {
                      handleCapacityChange([filters.capacity[0] - 1, filters.capacity[1]])
                    }
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700"
                  type="button"
                >
                  -
                </button>
                <div className="text-center">
                  <span className="font-medium">{filters.capacity[0]}</span> -{" "}
                  <span className="font-medium">{filters.capacity[1]}</span> People
                </div>
                <button
                  onClick={() => {
                    if (filters.capacity[1] < 4) {
                      handleCapacityChange([filters.capacity[0], filters.capacity[1] + 1])
                    }
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700"
                  type="button"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Price Range</h3>
            <div className="space-y-4">
              {/* Replace the Slider with a simple range display and buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    if (filters.priceRange[0] > 150) {
                      handlePriceChange([filters.priceRange[0] - 10, filters.priceRange[1]])
                    }
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700"
                  type="button"
                >
                  -
                </button>
                <div className="text-center">
                  €<span className="font-medium">{filters.priceRange[0]}</span> - €
                  <span className="font-medium">{filters.priceRange[1]}</span>
                </div>
                <button
                  onClick={() => {
                    if (filters.priceRange[1] < 350) {
                      handlePriceChange([filters.priceRange[0], filters.priceRange[1] + 10])
                    }
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700"
                  type="button"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium mb-2">Features</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mobile-dogs-allowed"
                checked={filters.dogsAllowed}
                onCheckedChange={() => handleCheckboxChange("dogsAllowed")}
              />
              <Label htmlFor="mobile-dogs-allowed">Pet Friendly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mobile-sea-view"
                checked={filters.seaView}
                onCheckedChange={() => handleCheckboxChange("seaView")}
              />
              <Label htmlFor="mobile-sea-view">Sea View</Label>
            </div>
          </div>
        </div>
      </>
    ),
    [
      checkIn,
      checkOut,
      guests,
      filters,
      clearDateFilter,
      handleCapacityChange,
      handlePriceChange,
      handleCheckboxChange,
    ],
  )

  return (
    <main className="min-h-screen">
      <Navbar />
      <PageHeader
        title="Ferienhäuser"
        description="Entdecke 32 einzigartige Ferienhäuser an der Ostsee, jedes mit einzigartigem Charm und im Herzen der Natur."
        image="https://dyn.v-office.com/image/xl/5380722.jpg"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div
            className={cn(
              "bg-white rounded-lg shadow-md transition-all duration-300 overflow-hidden border border-lightgray",
              isSearchExpanded ? "p-6" : "p-4",
            )}
          >
            <div className="flex flex-col space-y-4">
              {/* Compact Search Bar (always visible) */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              >
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <div>
                    {checkIn && checkOut ? (
                      <span className="text-sm md:text-base">
                        {format(checkIn, "dd.MM.yyyy")} - {format(checkOut, "dd.MM.yyyy")}
                        <span className="ml-2 text-gray-500">·</span>
                        <span className="ml-2">
                          {guests} {guests === 1 ? t("person") : t("persons")}
                        </span>
                      </span>
                    ) : (
                      <span className="text-sm md:text-base text-gray-500">{t("selectDates")}</span>
                    )}
                  </div>
                </div>
                <div>
                  {isSearchExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Expanded Search Options */}
              {isSearchExpanded && (
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Check-in Date */}
                    <div>
                      <Label className="mb-1.5 block">{t("checkIn")}</Label>
                      <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !checkIn && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkIn ? format(checkIn, "dd.MM.yyyy") : <span>{t("selectCheckIn")}</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkIn || undefined}
                            onSelect={handleCheckInChange}
                            disabled={{ before: today }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Check-out Date */}
                    <div>
                      <Label className="mb-1.5 block">{t("checkOut")}</Label>
                      <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !checkOut && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkOut ? format(checkOut, "dd.MM.yyyy") : <span>{t("selectCheckOut")}</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkOut || undefined}
                            onSelect={handleCheckOutChange}
                            disabled={{
                              before: checkIn || today,
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Guests */}
                    <div>
                      <Label className="mb-1.5 block">{t("guests")}</Label>
                      <Select value={guests.toString()} onValueChange={handleGuestsChange}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("guests")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 {t("person")}</SelectItem>
                          <SelectItem value="2">2 {t("persons")}</SelectItem>
                          <SelectItem value="3">3 {t("persons")}</SelectItem>
                          <SelectItem value="4">4 {t("persons")}</SelectItem>
                          <SelectItem value="5">5+ {t("persons")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={() => {
                        applyFilters()
                        setIsSearchExpanded(false)
                      }}
                    >
                      {t("checkAvailability")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24 bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-playfair">Filters</h2>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
              <FilterContent />
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="md:hidden mb-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>

            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Filter accommodations based on your preferences</SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <FilterContent />
                </div>
                <SheetFooter className="flex flex-col gap-2">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setIsMobileFilterOpen(false)
                    }}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      resetFilters()
                      setIsMobileFilterOpen(false)
                    }}
                  >
                    Reset Filters
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {/* Rooms Grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-playfair">
                {rooms.length} {rooms.length === 1 ? "Accommodation" : "Accommodations"} Available
              </h2>
            </div>

            {rooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No accommodations match your filters</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filter criteria</p>
                <Button onClick={resetFilters}>Reset Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

