import { isSameDay, eachDayOfInterval } from "date-fns"
import type { RoomProps } from "@/components/room-card"

// Mock booked dates for each room (in a real app, this would come from a database)
const mockBookedDates: Record<number, Date[]> = {}

// Generate some random booked dates for each room
export function initializeBookedDates(rooms: RoomProps[]) {
  const today = new Date()

  rooms.forEach((room) => {
    // Only initialize if not already done
    if (!mockBookedDates[room.id] || mockBookedDates[room.id].length === 0) {
      const bookedDates: Date[] = []

      // Generate 5-10 random bookings for each room
      const numBookings = Math.floor(Math.random() * 6) + 5

      for (let i = 0; i < numBookings; i++) {
        // Random start date within the next 90 days
        const randomDays = Math.floor(Math.random() * 90) + 1
        const startDate = new Date(today)
        startDate.setDate(today.getDate() + randomDays)

        // Random stay length between 2-5 days
        const stayLength = Math.floor(Math.random() * 4) + 2

        // Add each day of the stay to booked dates
        for (let j = 0; j < stayLength; j++) {
          const bookedDate = new Date(startDate)
          bookedDate.setDate(startDate.getDate() + j)
          bookedDates.push(bookedDate)
        }
      }

      mockBookedDates[room.id] = bookedDates
    }
  })

  return mockBookedDates
}

// Check if a room is available for a given date range
export function isRoomAvailable(roomId: number, checkIn: Date, checkOut: Date): boolean {
  if (!mockBookedDates[roomId]) {
    return true // If no booked dates are recorded, assume it's available
  }

  // Get all dates in the range
  const datesInRange = eachDayOfInterval({ start: checkIn, end: checkOut })

  // Check if any date in the range is booked
  return !datesInRange.some((date) => mockBookedDates[roomId].some((bookedDate) => isSameDay(date, bookedDate)))
}

// Get all available rooms for a given date range
export function getAvailableRooms(rooms: RoomProps[], checkIn: Date, checkOut: Date, guests?: number): RoomProps[] {
  // Initialize booked dates if not already done
  initializeBookedDates(rooms)

  return rooms.filter((room) => {
    // Filter by capacity if guests parameter is provided
    if (guests && room.capacity < guests) {
      return false
    }

    // Check availability for the date range
    return isRoomAvailable(room.id, checkIn, checkOut)
  })
}

// Add a booking for a room
export function addBooking(roomId: number, checkIn: Date, checkOut: Date): boolean {
  if (!mockBookedDates[roomId]) {
    mockBookedDates[roomId] = []
  }

  // Get all dates in the range
  const datesInRange = eachDayOfInterval({ start: checkIn, end: checkOut })

  // Add each date to the booked dates
  datesInRange.forEach((date) => {
    mockBookedDates[roomId].push(new Date(date))
  })

  return true
}

// Get booked dates for a room
export function getBookedDates(roomId: number): Date[] {
  return mockBookedDates[roomId] || []
}

