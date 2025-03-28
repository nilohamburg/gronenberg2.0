"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getBookings, updateBooking, deleteBooking, addBooking } from "@/actions/bookings"

export interface AdminBookingProps {
  id: string
  guestName: string
  guestEmail: string
  roomId: number
  roomName: string
  checkIn: Date
  checkOut: Date
  guests: number
  totalPrice: number
  status: "confirmed" | "pending" | "cancelled" | "completed"
  paymentStatus: "paid" | "pending" | "refunded"
  createdAt: Date
}

interface BookingAdminContextType {
  bookings: AdminBookingProps[]
  loading: boolean
  updateBooking: (booking: AdminBookingProps) => Promise<void>
  deleteBooking: (id: string) => Promise<void>
  addBooking: (booking: Omit<AdminBookingProps, "id" | "createdAt">) => Promise<void>
}

const BookingAdminContext = createContext<BookingAdminContextType | undefined>(undefined)

export function BookingAdminProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<AdminBookingProps[]>([])
  const [loading, setLoading] = useState(true)

  // Load bookings from Supabase
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await getBookings()
        setBookings(data)
      } catch (error) {
        console.error("Failed to load bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  // Update a booking
  const updateBookingHandler = async (updatedBooking: AdminBookingProps) => {
    try {
      await updateBooking(updatedBooking)

      // Update local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking)),
      )
    } catch (error) {
      console.error("Failed to update booking:", error)
      throw error
    }
  }

  // Delete a booking
  const deleteBookingHandler = async (id: string) => {
    try {
      await deleteBooking(id)

      // Update local state
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id))
    } catch (error) {
      console.error("Failed to delete booking:", error)
      throw error
    }
  }

  // Add a new booking
  const addBookingHandler = async (newBooking: Omit<AdminBookingProps, "id" | "createdAt">) => {
    try {
      const { id } = await addBooking(newBooking)

      // Update local state
      const bookingWithId = {
        ...newBooking,
        id,
        createdAt: new Date(),
      } as AdminBookingProps

      setBookings((prevBookings) => [bookingWithId, ...prevBookings])
    } catch (error) {
      console.error("Failed to add booking:", error)
      throw error
    }
  }

  return (
    <BookingAdminContext.Provider
      value={{
        bookings,
        loading,
        updateBooking: updateBookingHandler,
        deleteBooking: deleteBookingHandler,
        addBooking: addBookingHandler,
      }}
    >
      {children}
    </BookingAdminContext.Provider>
  )
}

export function useBookingAdmin() {
  const context = useContext(BookingAdminContext)
  if (context === undefined) {
    throw new Error("useBookingAdmin must be used within a BookingAdminProvider")
  }
  return context
}

