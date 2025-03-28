"use server"

import { createClient } from "@/lib/supabase"

export type FitnessTrialBooking = {
  id: string
  name: string
  email: string
  phone: string
  preferred_date: string
  preferred_time: string
  message: string | null
  status: "pending" | "confirmed" | "completed" | "cancelled"
  created_at: string
}

export async function createFitnessTrialBooking(bookingData: {
  name: string
  email: string
  phone: string
  preferred_date: string
  preferred_time: string
  message: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("fitness_trial_bookings").insert([
      {
        ...bookingData,
        status: "pending",
      },
    ])

    if (error) {
      console.error("Error creating fitness trial booking:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in createFitnessTrialBooking:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function getFitnessTrialBookings(): Promise<FitnessTrialBooking[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("fitness_trial_bookings")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching fitness trial bookings:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getFitnessTrialBookings:", error)
    return []
  }
}

export async function updateFitnessTrialBookingStatus(
  id: string,
  status: "pending" | "confirmed" | "completed" | "cancelled",
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("fitness_trial_bookings").update({ status }).eq("id", id)

    if (error) {
      console.error("Error updating fitness trial booking status:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in updateFitnessTrialBookingStatus:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

