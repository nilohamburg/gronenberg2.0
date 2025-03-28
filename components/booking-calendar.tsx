"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { format, isToday, isSameMonth, isAfter, isSameDay } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { BookingDate } from "@/hooks/use-booking-calendar"
import { useBookingCalendar } from "@/hooks/use-booking-calendar"
import { BookingConfirmation } from "@/components/booking-confirmation"
import { useLanguage } from "@/contexts/language-context"
import { useBooking } from "@/contexts/booking-context"
import { SearchBar } from "@/components/search-bar"
import { ExpandedFilter } from "@/components/expanded-filter"

interface BookingCalendarProps {
  roomId: number
  basePrice: number
  maxGuests: number
  roomName?: string
}

export function BookingCalendar({ roomId, basePrice, maxGuests, roomName = "Room" }: BookingCalendarProps) {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showExpandedFilter, setShowExpandedFilter] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingDetails, setBookingDetails] = useState({
    bookingId: "",
    checkIn: "",
    checkOut: "",
    guests: 0,
    totalPrice: 0,
  })

  // Use the shared booking context
  const {
    checkIn: globalCheckIn,
    checkOut: globalCheckOut,
    guests: globalGuests,
    setCheckIn: setGlobalCheckIn,
    setCheckOut: setGlobalCheckOut,
    setGuests: setGlobalGuests,
    resetDates: resetGlobalDates,
  } = useBooking()

  // Refs to track state updates
  const isLocalUpdate = useRef(false)
  const isInitialMount = useRef(true)
  const hasInitializedFromContext = useRef(false)

  const {
    calendarDates,
    currentMonth,
    booking,
    handleDateSelect,
    resetSelection,
    updateGuests,
    nextMonth,
    prevMonth,
    isCheckInDate,
    isCheckOutDate,
    isInRange,
    submitBooking,
  } = useBookingCalendar({ roomId, basePrice })

  // Initialize from global context on mount
  useEffect(() => {
    if (hasInitializedFromContext.current) return

    // If we have dates in the global context, use them
    if (globalCheckIn && globalCheckOut) {
      // Reset current selection
      resetSelection()

      // Set check-in and check-out dates with a delay
      const timer1 = setTimeout(() => {
        handleDateSelect(globalCheckIn)

        const timer2 = setTimeout(() => {
          handleDateSelect(globalCheckOut)

          // Update guests if needed
          if (globalGuests > 0 && globalGuests <= maxGuests) {
            updateGuests(globalGuests)
          }

          // Mark as initialized
          hasInitializedFromContext.current = true

          // After a delay, mark initial mount as complete
          const timer3 = setTimeout(() => {
            isInitialMount.current = false
          }, 100)

          return () => clearTimeout(timer3)
        }, 50)

        return () => clearTimeout(timer2)
      }, 50)

      return () => clearTimeout(timer1)
    } else {
      // No dates in context, just mark as initialized
      hasInitializedFromContext.current = true
      isInitialMount.current = false
    }
  }, [])

  // Sync from global context to local state - only when global state changes
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      return
    }

    // Skip if this update was triggered by a local change
    if (isLocalUpdate.current) {
      isLocalUpdate.current = false
      return
    }

    // Skip if we're submitting a booking
    if (isSubmitting) {
      return
    }

    // Only update if we have valid dates from global context
    if (globalCheckIn && globalCheckOut) {
      // Check if dates are actually different
      const shouldUpdate =
        !booking.checkIn ||
        !booking.checkOut ||
        !isSameDay(booking.checkIn, globalCheckIn) ||
        !isSameDay(booking.checkOut, globalCheckOut) ||
        booking.guests !== globalGuests

      if (shouldUpdate) {
        // Reset current selection
        resetSelection()

        // Set check-in and check-out dates with a delay
        const timer1 = setTimeout(() => {
          handleDateSelect(globalCheckIn)

          const timer2 = setTimeout(() => {
            handleDateSelect(globalCheckOut)

            // Update guests if needed
            if (globalGuests > 0 && globalGuests <= maxGuests) {
              updateGuests(globalGuests)
            }
          }, 50)

          return () => clearTimeout(timer2)
        }, 50)

        return () => clearTimeout(timer1)
      }
    }
  }, [globalCheckIn, globalCheckOut, globalGuests])

  // Sync from local state to global context
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      return
    }

    // Skip during booking submission
    if (isSubmitting) {
      return
    }

    // Only update global context if we have valid local dates and they're different from global
    if (booking.checkIn && booking.checkOut) {
      const shouldUpdate =
        !globalCheckIn ||
        !globalCheckOut ||
        !isSameDay(booking.checkIn, globalCheckIn) ||
        !isSameDay(booking.checkOut, globalCheckOut) ||
        booking.guests !== globalGuests

      if (shouldUpdate) {
        // Set flag to prevent the other useEffect from running
        isLocalUpdate.current = true

        // Update global context
        setGlobalCheckIn(booking.checkIn)
        setGlobalCheckOut(booking.checkOut)
        setGlobalGuests(booking.guests)
      }
    }
  }, [booking.checkIn, booking.checkOut, booking.guests])

  // Group dates by month for display
  const datesByMonth = useMemo(() => {
    const result: Record<string, BookingDate[]> = {}
    calendarDates.forEach((date) => {
      const monthKey = format(date.date, "MMMM yyyy")
      if (!result[monthKey]) {
        result[monthKey] = []
      }
      result[monthKey].push(date)
    })
    return result
  }, [calendarDates])

  // Handle booking submission
  const handleSubmit = async () => {
    if (!booking.checkIn || !booking.checkOut) {
      setShowCalendar(true)
      return
    }

    setIsSubmitting(true)
    try {
      const success = await submitBooking()
      if (success) {
        // Generate a random booking ID
        const bookingId = `BK${Math.floor(100000 + Math.random() * 900000)}`

        // Store booking details for confirmation
        setBookingDetails({
          bookingId,
          checkIn: format(booking.checkIn, "MMM d, yyyy"),
          checkOut: format(booking.checkOut, "MMM d, yyyy"),
          guests: booking.guests,
          totalPrice: booking.totalPrice,
        })

        // Reset global dates to prevent state update loops
        resetGlobalDates()

        // Show confirmation
        setBookingComplete(true)
      }
    } catch (error) {
      console.error("Booking failed:", error)
      alert("Booking failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset booking state
  const handleCloseConfirmation = () => {
    setBookingComplete(false)
    resetSelection()
  }

  // Handle expanded filter changes
  const handleCheckInChange = (date: Date | undefined) => {
    if (!date) return
    handleDateSelect(date)
  }

  const handleCheckOutChange = (date: Date | undefined) => {
    if (!date) return
    if (booking.checkIn) {
      handleDateSelect(date)
    }
  }

  const handleGuestsChange = (guests: number) => {
    updateGuests(guests)
  }

  const handleSearch = () => {
    setShowExpandedFilter(false)
  }

  // If booking is complete, show confirmation
  if (bookingComplete) {
    return (
      <BookingConfirmation
        bookingId={bookingDetails.bookingId}
        roomName={roomName}
        checkIn={bookingDetails.checkIn}
        checkOut={bookingDetails.checkOut}
        guests={bookingDetails.guests}
        totalPrice={bookingDetails.totalPrice}
        onClose={handleCloseConfirmation}
      />
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Book Your Stay</CardTitle>
        <CardDescription>Select dates and guests to check availability</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date Selection - Using SearchBar from /rooms page */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="text-sm font-medium">Dates</div>
            {(booking.checkIn || booking.checkOut) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  resetSelection()
                  resetGlobalDates()
                }}
                className="h-auto p-0 text-xs text-muted-foreground"
              >
                Clear dates
              </Button>
            )}
          </div>

          {/* SearchBar component from /rooms page */}
          <SearchBar
            initialCheckIn={booking.checkIn || undefined}
            initialCheckOut={booking.checkOut || undefined}
            initialGuests={booking.guests}
            onClick={() => setShowExpandedFilter(!showExpandedFilter)}
            className="border-2 border-gray-300 rounded-lg"
          />
        </div>

        {/* Expanded Filter (similar to /rooms page) */}
        {showExpandedFilter && (
          <ExpandedFilter
            checkIn={booking.checkIn || new Date()}
            checkOut={booking.checkOut || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
            guests={booking.guests}
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

        {/* Calendar (conditionally shown) */}
        {showCalendar && (
          <div className="border rounded-md p-3 mt-2">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prevMonth}
                disabled={isSameMonth(currentMonth, new Date())}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-medium">{format(currentMonth, "MMMM yyyy")}</div>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Calendar Grid */}
            {Object.keys(datesByMonth).map((monthKey) => (
              <div key={monthKey} className="mb-6">
                <div className="text-sm font-medium mb-2">{monthKey}</div>
                <div className="grid grid-cols-7 gap-1 text-xs mb-1">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div key={day} className="text-center font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {/* Add empty cells for the first day of the month */}
                  {Array.from({ length: new Date(monthKey).getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-9"></div>
                  ))}

                  {/* Calendar days */}
                  {datesByMonth[monthKey].map((date, i) => {
                    const isSelected = isCheckInDate(date.date) || isCheckOutDate(date.date)
                    const isInSelectedRange = isInRange(date.date)

                    return (
                      <button
                        key={i}
                        className={cn(
                          "h-9 rounded-md text-xs relative",
                          isToday(date.date) && "border border-primary",
                          isSelected && "bg-primary text-primary-foreground",
                          isInSelectedRange && !isSelected && "bg-primary/20",
                          !date.isAvailable && "line-through opacity-50",
                          date.isAvailable &&
                            isAfter(date.date, new Date()) &&
                            !isSelected &&
                            !isInSelectedRange &&
                            "hover:bg-muted",
                        )}
                        disabled={!date.isAvailable || date.date < new Date()}
                        onClick={() => handleDateSelect(date.date)}
                      >
                        <time dateTime={format(date.date, "yyyy-MM-dd")}>{format(date.date, "d")}</time>
                        {date.price && <div className="text-[10px] mt-1">€{date.price}</div>}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            <div className="text-xs text-muted-foreground mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary/20"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted line-through"></div>
                <span>Booked</span>
              </div>
            </div>
          </div>
        )}

        {/* Price Summary */}
        {booking.checkIn && booking.checkOut && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex justify-between">
              <div>
                €{basePrice} x {booking.totalNights} nights
              </div>
              <div>€{booking.totalPrice}</div>
            </div>
            <div className="flex justify-between font-medium">
              <div>Total</div>
              <div>€{booking.totalPrice}</div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : booking.checkIn && booking.checkOut ? "Book Now" : "Check Availability"}
        </Button>
      </CardFooter>
    </Card>
  )
}

