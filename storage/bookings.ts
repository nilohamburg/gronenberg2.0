import { createClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

export type Booking = Database["public"]["Tables"]["bookings"]["Row"]
export type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"]
export type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"]

/**
 * Fetches all bookings
 * @returns Promise with an array of bookings
 */
export async function getAllBookings(): Promise<{ data: Booking[]; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("bookings").select("*").order("check_in", { ascending: true })

    if (error) {
      console.error("Error fetching bookings:", error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Error in getAllBookings:", error)
    return { data: [], error: "Failed to fetch bookings" }
  }
}

/**
 * Fetches a booking by ID
 * @param id The booking ID
 * @returns Promise with the booking data
 */
export async function getBookingById(id: string): Promise<{ data: Booking | null; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("bookings").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching booking with ID ${id}:`, error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in getBookingById:", error)
    return { data: null, error: "Failed to fetch booking" }
  }
}

/**
 * Creates a new booking
 * @param booking The booking data to insert
 * @returns Promise with the created booking
 */
export async function createBooking(booking: BookingInsert): Promise<{ data: Booking | null; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("bookings").insert(booking).select().single()

    if (error) {
      console.error("Error creating booking:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in createBooking:", error)
    return { data: null, error: "Failed to create booking" }
  }
}

/**
 * Updates an existing booking
 * @param id The booking ID
 * @param booking The booking data to update
 * @returns Promise with the updated booking
 */
export async function updateBooking(
  id: string,
  booking: BookingUpdate,
): Promise<{ data: Booking | null; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("bookings").update(booking).eq("id", id).select().single()

    if (error) {
      console.error(`Error updating booking with ID ${id}:`, error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in updateBooking:", error)
    return { data: null, error: "Failed to update booking" }
  }
}

/**
 * Deletes a booking
 * @param id The booking ID
 * @returns Promise with success status
 */
export async function deleteBooking(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("bookings").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting booking with ID ${id}:`, error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error in deleteBooking:", error)
    return { success: false, error: "Failed to delete booking" }
  }
}

