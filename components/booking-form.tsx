"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, addDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useBooking } from "@/contexts/booking-context"
import { cn } from "@/lib/utils"

export function BookingForm() {
  const { t } = useLanguage()
  const router = useRouter()
  const today = new Date()

  // Use the shared booking context
  const { checkIn, checkOut, guests, setCheckIn, setCheckOut, setGuests } = useBooking()

  // Ref to track if this component is updating the context
  const isUpdatingContext = useRef(false)
  const isNavigating = useRef(false)

  const [isCheckInOpen, setIsCheckInOpen] = useState(false)
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false)

  // Local state to prevent direct binding to context
  const [localCheckIn, setLocalCheckIn] = useState<Date | null>(null)
  const [localCheckOut, setLocalCheckOut] = useState<Date | null>(null)
  const [localGuests, setLocalGuests] = useState(2)

  // Initialize local state from context
  useEffect(() => {
    if (isUpdatingContext.current) {
      isUpdatingContext.current = false
      return
    }

    setLocalCheckIn(checkIn)
    setLocalCheckOut(checkOut)
    setLocalGuests(guests)
  }, [checkIn, checkOut, guests])

  // Handle check availability button click
  const handleCheckAvailability = useCallback(() => {
    if (isNavigating.current) return
    isNavigating.current = true

    if (!localCheckIn || !localCheckOut) {
      alert(t("selectDatesAlert") || "Please select check-in and check-out dates")
      isNavigating.current = false
      return
    }

    // Format dates for URL parameters
    const checkInParam = format(localCheckIn, "yyyy-MM-dd")
    const checkOutParam = format(localCheckOut, "yyyy-MM-dd")

    // Update context before navigation
    isUpdatingContext.current = true
    setCheckIn(localCheckIn)
    setCheckOut(localCheckOut)
    setGuests(localGuests)

    // Redirect to rooms page with date and guest parameters
    setTimeout(() => {
      router.push(`/rooms?checkIn=${checkInParam}&checkOut=${checkOutParam}&guests=${localGuests}`)
    }, 0)
  }, [localCheckIn, localCheckOut, localGuests, router, t, setCheckIn, setCheckOut, setGuests])

  // Handle check-in date change
  const handleCheckInChange = useCallback(
    (date: Date | undefined) => {
      if (!date) return

      // If check-out date is before the new check-in date, adjust it
      if (localCheckOut && date > localCheckOut) {
        setLocalCheckIn(date)
        setLocalCheckOut(addDays(date, 1)) // Set check-out to the day after check-in
      } else {
        setLocalCheckIn(date)
        if (!localCheckOut) {
          setLocalCheckOut(addDays(date, 7)) // Default to 7-day stay if no checkout date
        }
      }
      setIsCheckInOpen(false)
    },
    [localCheckOut],
  )

  // Handle check-out date change
  const handleCheckOutChange = useCallback(
    (date: Date | undefined) => {
      if (!date) return

      // If check-in date is after the new check-out date, adjust it
      if (localCheckIn && date < localCheckIn) {
        setLocalCheckIn(addDays(date, -1)) // Set check-in to the day before check-out
        setLocalCheckOut(date)
      } else {
        setLocalCheckOut(date)
        if (!localCheckIn) {
          setLocalCheckIn(today) // Default to today if no check-in date
        }
      }
      setIsCheckOutOpen(false)
    },
    [localCheckIn, today],
  )

  // Handle guests change
  const handleGuestsChange = useCallback((value: string) => {
    const newGuests = Number.parseInt(value, 10)
    setLocalGuests(newGuests)
  }, [])

  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg max-w-4xl w-full mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Check-in Date Picker */}
        <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-white/90 backdrop-blur-sm",
                !localCheckIn && "text-muted-foreground",
                "text-gray-500",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {localCheckIn ? format(localCheckIn, "MMM dd, yyyy") : <span>{t("checkIn") || "Check-in"}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3 border-b">
              <h3 className="text-sm font-medium">{t("selectCheckIn") || "Select check-in date"}</h3>
            </div>
            <Calendar
              initialFocus
              mode="single"
              selected={localCheckIn || undefined}
              onSelect={handleCheckInChange}
              disabled={{ before: today }}
              defaultMonth={localCheckIn || today}
            />
          </PopoverContent>
        </Popover>

        {/* Check-out Date Picker */}
        <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-white/90 backdrop-blur-sm",
                !localCheckOut && "text-muted-foreground",
                "text-gray-500",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {localCheckOut ? format(localCheckOut, "MMM dd, yyyy") : <span>{t("checkOut") || "Check-out"}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3 border-b">
              <h3 className="text-sm font-medium">{t("selectCheckOut") || "Select check-out date"}</h3>
            </div>
            <Calendar
              initialFocus
              mode="single"
              selected={localCheckOut || undefined}
              onSelect={handleCheckOutChange}
              disabled={{ before: localCheckIn || today }}
              defaultMonth={localCheckOut || localCheckIn || today}
            />
          </PopoverContent>
        </Popover>

        {/* Guests Selection */}
        <Select value={localGuests.toString()} onValueChange={handleGuestsChange}>
          <SelectTrigger className="bg-white/90 backdrop-blur-sm text-gray-500">
            <SelectValue placeholder={t("guests")}>
              {localGuests} {Number.parseInt(localGuests.toString()) === 1 ? t("person") : t("persons")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 {t("person")}</SelectItem>
            <SelectItem value="2">2 {t("persons")}</SelectItem>
            <SelectItem value="3">3 {t("persons")}</SelectItem>
            <SelectItem value="4">4 {t("persons")}</SelectItem>
            <SelectItem value="5">5+ {t("persons")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Check Availability Button */}
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
          onClick={handleCheckAvailability}
          disabled={isNavigating.current}
        >
          {t("checkAvailability")}
        </Button>
      </div>
    </div>
  )
}

