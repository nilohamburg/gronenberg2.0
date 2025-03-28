"use server"

import { createServerComponentClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function getBookings() {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      houses(name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching bookings:", error)
    throw new Error("Failed to fetch bookings")
  }

  // Transform the data to match the expected format
  const bookings = data.map((booking) => ({
    id: booking.id,
    guestName: booking.guest_name,
    guestEmail: booking.guest_email,
    roomId: booking.house_id,
    roomName: booking.houses?.name || "Unknown Room",
    checkIn: new Date(booking.check_in),
    checkOut: new Date(booking.check_out),
    guests: booking.guests,
    totalPrice: booking.total_price,
    status: booking.status,
    paymentStatus: booking.payment_status,
    createdAt: new Date(booking.created_at),
  }))

  return bookings
}

export async function getBookingById(id: string) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      houses(name)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching booking with id ${id}:`, error)
    throw new Error("Failed to fetch booking")
  }

  return {
    id: data.id,
    guestName: data.guest_name,
    guestEmail: data.guest_email,
    roomId: data.house_id,
    roomName: data.houses?.name || "Unknown Room",
    checkIn: new Date(data.check_in),
    checkOut: new Date(data.check_out),
    guests: data.guests,
    totalPrice: data.total_price,
    status: data.status,
    paymentStatus: data.payment_status,
    createdAt: new Date(data.created_at),
  }
}

export async function updateBooking(booking: {
  id: string
  guestName: string
  guestEmail: string
  roomId: number
  checkIn: Date
  checkOut: Date
  guests: number
  totalPrice: number
  status: "confirmed" | "pending" | "cancelled" | "completed"
  paymentStatus: "paid" | "pending" | "refunded"
}) {
  const supabase = createServerComponentClient()

  const { error } = await supabase
    .from("bookings")
    .update({
      guest_name: booking.guestName,
      guest_email: booking.guestEmail,
      house_id: booking.roomId,
      check_in: booking.checkIn.toISOString().split("T")[0],
      check_out: booking.checkOut.toISOString().split("T")[0],
      guests: booking.guests,
      total_price: booking.totalPrice,
      status: booking.status,
      payment_status: booking.paymentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", booking.id)

  if (error) {
    console.error("Error updating booking:", error)
    throw new Error("Failed to update booking")
  }

  revalidatePath("/admin/bookings")

  return { success: true }
}

export async function deleteBooking(id: string) {
  const supabase = createServerComponentClient()

  const { error } = await supabase.from("bookings").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting booking with id ${id}:`, error)
    throw new Error("Failed to delete booking")
  }

  revalidatePath("/admin/bookings")

  return { success: true }
}

export async function addBooking(booking: {
  guestName: string
  guestEmail: string
  roomId: number
  roomName: string
  checkIn: Date
  checkOut: Date
  guests: number
  totalPrice: number
  status?: "confirmed" | "pending" | "cancelled" | "completed"
  paymentStatus?: "paid" | "pending" | "refunded"
}) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      guest_name: booking.guestName,
      guest_email: booking.guestEmail,
      house_id: booking.roomId,
      check_in: booking.checkIn.toISOString().split("T")[0],
      check_out: booking.checkOut.toISOString().split("T")[0],
      guests: booking.guests,
      total_price: booking.totalPrice,
      status: booking.status || "confirmed",
      payment_status: booking.paymentStatus || "paid",
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating booking:", error)
    throw new Error("Failed to create booking")
  }

  revalidatePath("/admin/bookings")

  return { success: true, id: data.id }
}

export async function getBookedDates(houseId: number) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase
    .from("bookings")
    .select("check_in, check_out")
    .eq("house_id", houseId)
    .in("status", ["confirmed", "pending"])

  if (error) {
    console.error(`Error fetching booked dates for house ${houseId}:`, error)
    throw new Error("Failed to fetch booked dates")
  }

  // Generate all dates between check_in and check_out for each booking
  const bookedDates: Date[] = []

  data.forEach((booking) => {
    const checkIn = new Date(booking.check_in)
    const checkOut = new Date(booking.check_out)

    // Add each date in the range
    const currentDate = new Date(checkIn)
    while (currentDate < checkOut) {
      bookedDates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
  })

  return bookedDates
}

export async function isDateRangeAvailable(houseId: number, checkIn: Date, checkOut: Date) {
  const bookedDates = await getBookedDates(houseId)

  // Check if any date in the range is booked
  const checkInTime = checkIn.getTime()
  const checkOutTime = checkOut.getTime()

  return !bookedDates.some((date) => {
    const time = date.getTime()
    return time >= checkInTime && time < checkOutTime
  })
}

