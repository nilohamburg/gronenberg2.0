"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"

interface BookingContextType {
  checkIn: Date | null
  checkOut: Date | null
  guests: number
  setCheckIn: (date: Date | null) => void
  setCheckOut: (date: Date | null) => void
  setGuests: (guests: number) => void
  resetDates: () => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [checkIn, setCheckInState] = useState<Date | null>(null)
  const [checkOut, setCheckOutState] = useState<Date | null>(null)
  const [guests, setGuestsState] = useState<number>(2)

  // Use refs to track initialization and updates
  const initialized = useRef(false)
  const isUpdating = useRef(false)
  const pendingUpdates = useRef<{
    checkIn?: Date | null
    checkOut?: Date | null
    guests?: number
  }>({})

  // Load booking data from localStorage on initial render
  useEffect(() => {
    if (initialized.current) return

    try {
      const savedBooking = localStorage.getItem("bookingData")
      if (savedBooking) {
        const data = JSON.parse(savedBooking)
        if (data.checkIn) setCheckInState(new Date(data.checkIn))
        if (data.checkOut) setCheckOutState(new Date(data.checkOut))
        if (data.guests) setGuestsState(data.guests)
      }
    } catch (error) {
      console.error("Error loading booking data:", error)
    }

    initialized.current = true
  }, [])

  // Save booking data to localStorage when it changes
  useEffect(() => {
    if (!initialized.current || isUpdating.current) return

    try {
      localStorage.setItem(
        "bookingData",
        JSON.stringify({
          checkIn: checkIn?.toISOString() || null,
          checkOut: checkOut?.toISOString() || null,
          guests,
        }),
      )
    } catch (error) {
      console.error("Error saving booking data:", error)
    }
  }, [checkIn, checkOut, guests])

  // Process pending updates
  useEffect(() => {
    if (isUpdating.current || !Object.keys(pendingUpdates.current).length) return

    isUpdating.current = true

    const updates = pendingUpdates.current
    pendingUpdates.current = {}

    if ("checkIn" in updates) setCheckInState(updates.checkIn || null)
    if ("checkOut" in updates) setCheckOutState(updates.checkOut || null)
    if ("guests" in updates) setGuestsState(updates.guests || 2)

    setTimeout(() => {
      isUpdating.current = false
    }, 0)
  }, [checkIn, checkOut, guests])

  // Wrapper functions to set state
  const setCheckIn = (date: Date | null) => {
    if (isUpdating.current) {
      pendingUpdates.current.checkIn = date
      return
    }

    setCheckInState(date)
  }

  const setCheckOut = (date: Date | null) => {
    if (isUpdating.current) {
      pendingUpdates.current.checkOut = date
      return
    }

    setCheckOutState(date)
  }

  const setGuests = (value: number) => {
    if (isUpdating.current) {
      pendingUpdates.current.guests = value
      return
    }

    setGuestsState(value)
  }

  // Reset dates function
  const resetDates = () => {
    isUpdating.current = true

    setCheckInState(null)
    setCheckOutState(null)

    // Also clear from localStorage to prevent reloading on page refresh
    try {
      localStorage.setItem(
        "bookingData",
        JSON.stringify({
          checkIn: null,
          checkOut: null,
          guests,
        }),
      )
    } catch (error) {
      console.error("Error clearing booking data:", error)
    }

    setTimeout(() => {
      isUpdating.current = false
    }, 0)
  }

  const contextValue = {
    checkIn,
    checkOut,
    guests,
    setCheckIn,
    setCheckOut,
    setGuests,
    resetDates,
  }

  return <BookingContext.Provider value={contextValue}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}

