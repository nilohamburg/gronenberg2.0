"use server"

import { createClient } from "@/lib/supabase"

export interface FitnessTrialBooking {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  message: string
  status: "pending" | "confirmed" | "cancelled"
  created_at: string
}

export async function createFitnessTrialBooking(data: Omit<FitnessTrialBooking, "id" | "created_at" | "status">) {
  const supabase = createClient()

  const { data: booking, error } = await supabase
    .from("fitness_trial_bookings")
    .insert({
      ...data,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating fitness trial booking:", error)
    throw new Error("Failed to create fitness trial booking")
  }

  return booking
}

export async function getFitnessTrialBookings(): Promise<FitnessTrialBooking[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("fitness_trial_bookings")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching fitness trial bookings:", error)
    throw new Error("Failed to fetch fitness trial bookings")
  }

  return data || []
}

export async function updateFitnessTrialBooking(
  id: string,
  data: Partial<Omit<FitnessTrialBooking, "id" | "created_at">>,
) {
  const supabase = createClient()

  const { error } = await supabase.from("fitness_trial_bookings").update(data).eq("id", id)

  if (error) {
    console.error("Error updating fitness trial booking:", error)
    throw new Error("Failed to update fitness trial booking")
  }

  return { success: true }
}

export async function deleteFitnessTrialBooking(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("fitness_trial_bookings").delete().eq("id", id)

  if (error) {
    console.error("Error deleting fitness trial booking:", error)
    throw new Error("Failed to delete fitness trial booking")
  }

  return { success: true }
}

