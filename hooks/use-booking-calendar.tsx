"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { addDays, eachDayOfInterval, isSameDay, isWithinInterval, differenceInDays } from "date-fns"
import { getBookedDates, isDateRangeAvailable, addBooking } from "@/actions/bookings"

// Types for our booking system
export interface BookingDate {
  date: Date
  isAvailable: boolean
  price: number | null
  isBooked: boolean
}

export interface BookingState {
  checkIn: Date | null
  checkOut: Date | null
  guests: number
  totalNights: number
  totalPrice: number
}

export interface UseBookingCalendarProps {
  roomId: number
  basePrice: number
  minNights?: number
  maxNights?: number
}

export function useBookingCalendar({ roomId, basePrice, minNights = 1, maxNights = 30 }: UseBookingCalendarProps) {
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarDates, setCalendarDates] = useState<BookingDate[]>([])

  // Booking state
  const [booking, setBooking] = useState<BookingState>({
    checkIn: null,
    checkOut: null,
    guests: 2,
    totalNights: 0,
    totalPrice: 0,
  })

  // Get booked dates for this room
  const [bookedDates, setBookedDates] = useState<Date[]>([])

  // Ref to prevent update loops
  const isProcessingBooking = useRef(false)
  const isUpdatingBooking = useRef(false)

  // Load booked dates
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const dates = await getBookedDates(roomId)
        setBookedDates(dates)
      } catch (error) {
        console.error("Failed to fetch booked dates:", error)
      }
    }

    fetchBookedDates()
  }, [roomId])

  // Generate calendar dates for the current month and the next month
  useEffect(() => {
    const today = new Date()
    const startDate = today
    const endDate = addDays(today, 90) // Show 90 days

    const dates = eachDayOfInterval({ start: startDate, end: endDate }).map((date) => {
      // Check if the date is booked
      const isBooked = bookedDates.some((bookedDate) => isSameDay(date, bookedDate))

      // Calculate price (could be dynamic based on weekends, seasons, etc.)
      let price = basePrice

      // Weekend prices are higher
      if (date.getDay() === 0 || date.getDay() === 6) {
        price = Math.round(basePrice * 1.2)
      }

      return {
        date,
        isAvailable: !isBooked,
        price,
        isBooked,
      }
    })

    setCalendarDates(dates)
  }, [bookedDates, basePrice, currentMonth])

  // Handle date selection
  const handleDateSelect = useCallback(
    (date: Date) => {
      if (isUpdatingBooking.current) return
      isUpdatingBooking.current = true

      // Don't allow selecting booked dates
      if (calendarDates.find((d) => isSameDay(d.date, date))?.isBooked) {
        isUpdatingBooking.current = false
        return
      }

      setBooking((prevBooking) => {
        // If no check-in date is selected, set it
        if (!prevBooking.checkIn) {
          return {
            ...prevBooking,
            checkIn: date,
            checkOut: null,
            totalNights: 0,
            totalPrice: 0,
          }
        }

        // If check-in is already selected
        // If selected date is before check-in, make it the new check-in
        if (date < prevBooking.checkIn) {
          return {
            ...prevBooking,
            checkIn: date,
            checkOut: null,
            totalNights: 0,
            totalPrice: 0,
          }
        }

        // Check if there are any booked dates between check-in and selected date
        const datesInRange = eachDayOfInterval({ start: prevBooking.checkIn, end: date })
        const hasBookedDateInRange = datesInRange.some(
          (d) => calendarDates.find((cd) => isSameDay(cd.date, d))?.isBooked,
        )

        if (hasBookedDateInRange) {
          // If there's a booked date in the range, only set check-in
          return {
            ...prevBooking,
            checkIn: date,
            checkOut: null,
            totalNights: 0,
            totalPrice: 0,
          }
        }

        // Calculate nights
        const nights = differenceInDays(date, prevBooking.checkIn)

        // Enforce min/max nights
        if (nights < minNights) {
          alert(`Minimum stay is ${minNights} nights`)
          isUpdatingBooking.current = false
          return prevBooking
        }

        if (nights > maxNights) {
          alert(`Maximum stay is ${maxNights} nights`)
          isUpdatingBooking.current = false
          return prevBooking
        }

        // Calculate total price
        let totalPrice = 0
        const datesInStay = eachDayOfInterval({ start: prevBooking.checkIn, end: date })

        datesInStay.forEach((d) => {
          const dateInfo = calendarDates.find((cd) => isSameDay(cd.date, d))
          if (dateInfo && dateInfo.price) {
            totalPrice += dateInfo.price
          }
        })

        // Set check-out date
        return {
          ...prevBooking,
          checkOut: date,
          totalNights: nights,
          totalPrice,
        }
      })

      // Reset the flag after a short delay
      setTimeout(() => {
        isUpdatingBooking.current = false
      }, 0)
    },
    [calendarDates, minNights, maxNights],
  )

  // Reset selection
  const resetSelection = useCallback(() => {
    if (isProcessingBooking.current) return

    setBooking({
      checkIn: null,
      checkOut: null,
      guests: 2,
      totalNights: 0,
      totalPrice: 0,
    })
  }, [])

  // Update guests
  const updateGuests = useCallback((guests: number) => {
    setBooking((prev) => ({
      ...prev,
      guests,
    }))
  }, [])

  // Navigate to next month
  const nextMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      const next = new Date(prev)
      next.setMonth(next.getMonth() + 1)
      return next
    })
  }, [])

  // Navigate to previous month
  const prevMonth = useCallback(() => {
    const today = new Date()
    setCurrentMonth((prev) => {
      const next = new Date(prev)
      next.setMonth(next.getMonth() - 1)

      // Don't allow going before current month
      if (next.getMonth() < today.getMonth() && next.getFullYear() <= today.getFullYear()) {
        return prev
      }

      return next
    })
  }, [])

  // Check if a date is the check-in date
  const isCheckInDate = useCallback(
    (date: Date) => {
      return booking.checkIn ? isSameDay(date, booking.checkIn) : false
    },
    [booking.checkIn],
  )

  // Check if a date is the check-out date
  const isCheckOutDate = useCallback(
    (date: Date) => {
      return booking.checkOut ? isSameDay(date, booking.checkOut) : false
    },
    [booking.checkOut],
  )

  // Check if a date is in the selected range
  const isInRange = useCallback(
    (date: Date) => {
      if (!booking.checkIn || !booking.checkOut) return false
      return isWithinInterval(date, { start: booking.checkIn, end: booking.checkOut })
    },
    [booking.checkIn, booking.checkOut],
  )

  // Submit booking
  const submitBooking = useCallback(async () => {
    // In a real app, this would send the booking to an API
    if (!booking.checkIn || !booking.checkOut) {
      alert("Please select check-in and check-out dates")
      return false
    }

    // Set flag to prevent state update loops
    isProcessingBooking.current = true

    try {
      // Check if the date range is still available
      const isAvailable = await isDateRangeAvailable(roomId, booking.checkIn, booking.checkOut)

      if (!isAvailable) {
        alert("Sorry, these dates are no longer available. Please select different dates.")
        return false
      }

      // Create the booking
      await addBooking({
        guestName: "Guest", // In a real app, this would come from the user's profile
        guestEmail: "guest@example.com", // In a real app, this would come from the user's profile
        roomId,
        roomName: "Room", // In a real app, this would come from the room data
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        totalPrice: booking.totalPrice,
        status: "confirmed",
        paymentStatus: "paid",
      })

      // Refresh booked dates
      const dates = await getBookedDates(roomId)
      setBookedDates(dates)

      return true
    } catch (error) {
      console.error("Error submitting booking:", error)
      return false
    } finally {
      // Reset the flag after a short delay to ensure all state updates have completed
      setTimeout(() => {
        isProcessingBooking.current = false
      }, 100)
    }
  }, [booking, roomId])

  return {
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
  }
}

