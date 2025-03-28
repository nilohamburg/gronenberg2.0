import { createClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

export type FitnessCourse = Database["public"]["Tables"]["fitness_courses"]["Row"]
export type FitnessCourseInsert = Database["public"]["Tables"]["fitness_courses"]["Insert"]
export type FitnessCourseUpdate = Database["public"]["Tables"]["fitness_courses"]["Update"]

export type FitnessTrialBooking = Database["public"]["Tables"]["fitness_trial_bookings"]["Row"]
export type FitnessTrialBookingInsert = Database["public"]["Tables"]["fitness_trial_bookings"]["Insert"]
export type FitnessTrialBookingUpdate = Database["public"]["Tables"]["fitness_trial_bookings"]["Update"]

export type FitnessMembership = Database["public"]["Tables"]["fitness_memberships"]["Row"]
export type FitnessMembershipInsert = Database["public"]["Tables"]["fitness_memberships"]["Insert"]
export type FitnessMembershipUpdate = Database["public"]["Tables"]["fitness_memberships"]["Update"]

export type FitnessMembershipBenefit = Database["public"]["Tables"]["fitness_membership_benefits"]["Row"]
export type FitnessMembershipBenefitInsert = Database["public"]["Tables"]["fitness_membership_benefits"]["Insert"]
export type FitnessMembershipBenefitUpdate = Database["public"]["Tables"]["fitness_membership_benefits"]["Update"]

/**
 * Fetches all fitness courses
 * @returns Promise with an array of fitness courses
 */
export async function getAllFitnessCourses(): Promise<{ data: FitnessCourse[]; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("fitness_courses").select("*").order("day_of_week", { ascending: true })

    if (error) {
      console.error("Error fetching fitness courses:", error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Error in getAllFitnessCourses:", error)
    return { data: [], error: "Failed to fetch fitness courses" }
  }
}

/**
 * Creates a new fitness course
 * @param course The fitness course data to insert
 * @returns Promise with the created fitness course
 */
export async function createFitnessCourse(
  course: FitnessCourseInsert,
): Promise<{ data: FitnessCourse | null; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("fitness_courses").insert(course).select().single()

    if (error) {
      console.error("Error creating fitness course:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in createFitnessCourse:", error)
    return { data: null, error: "Failed to create fitness course" }
  }
}

/**
 * Updates an existing fitness course
 * @param id The fitness course ID
 * @param course The fitness course data to update
 * @returns Promise with the updated fitness course
 */
export async function updateFitnessCourse(
  id: string,
  course: FitnessCourseUpdate,
): Promise<{ data: FitnessCourse | null; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("fitness_courses").update(course).eq("id", id).select().single()

    if (error) {
      console.error(`Error updating fitness course with ID ${id}:`, error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in updateFitnessCourse:", error)
    return { data: null, error: "Failed to update fitness course" }
  }
}

/**
 * Deletes a fitness course
 * @param id The fitness course ID
 * @returns Promise with success status
 */
export async function deleteFitnessCourse(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("fitness_courses").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting fitness course with ID ${id}:`, error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error in deleteFitnessCourse:", error)
    return { success: false, error: "Failed to delete fitness course" }
  }
}

/**
 * Fetches all fitness trial bookings
 * @returns Promise with an array of fitness trial bookings
 */
export async function getAllFitnessTrialBookings(): Promise<{ data: FitnessTrialBooking[]; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("fitness_trial_bookings")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching fitness trial bookings:", error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Error in getAllFitnessTrialBookings:", error)
    return { data: [], error: "Failed to fetch fitness trial bookings" }
  }
}

/**
 * Creates a new fitness trial booking
 * @param booking The fitness trial booking data to insert
 * @returns Promise with the created fitness trial booking
 */
export async function createFitnessTrialBooking(
  booking: FitnessTrialBookingInsert,
): Promise<{ data: FitnessTrialBooking | null; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("fitness_trial_bookings").insert(booking).select().single()

    if (error) {
      console.error("Error creating fitness trial booking:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in createFitnessTrialBooking:", error)
    return { data: null, error: "Failed to create fitness trial booking" }
  }
}

/**
 * Updates an existing fitness trial booking
 * @param id The fitness trial booking ID
 * @param booking The fitness trial booking data to update
 * @returns Promise with the updated fitness trial booking
 */
export async function updateFitnessTrialBooking(
  id: string,
  booking: FitnessTrialBookingUpdate,
): Promise<{ data: FitnessTrialBooking | null; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("fitness_trial_bookings").update(booking).eq("id", id).select().single()

    if (error) {
      console.error(`Error updating fitness trial booking with ID ${id}:`, error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in updateFitnessTrialBooking:", error)
    return { data: null, error: "Failed to update fitness trial booking" }
  }
}

/**
 * Deletes a fitness trial booking
 * @param id The fitness trial booking ID
 * @returns Promise with success status
 */
export async function deleteFitnessTrialBooking(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("fitness_trial_bookings").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting fitness trial booking with ID ${id}:`, error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error in deleteFitnessTrialBooking:", error)
    return { success: false, error: "Failed to delete fitness trial booking" }
  }
}

/**
 * Fetches all fitness memberships
 * @returns Promise with an array of fitness memberships
 */
export async function getAllFitnessMemberships(): Promise<{ data: FitnessMembership[]; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("fitness_memberships")
      .select("*")
      .order("type", { ascending: true })
      .order("duration", { ascending: true })

    if (error) {
      console.error("Error fetching fitness memberships:", error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Error in getAllFitnessMemberships:", error)
    return { data: [], error: "Failed to fetch fitness memberships" }
  }
}

/**
 * Fetches all fitness membership benefits
 * @param membershipType Optional membership type to filter by
 * @returns Promise with an array of fitness membership benefits
 */
export async function getFitnessMembershipBenefits(
  membershipType?: string,
): Promise<{ data: FitnessMembershipBenefit[]; error: string | null }> {
  try {
    const supabase = createClient()

    let query = supabase.from("fitness_membership_benefits").select("*")

    if (membershipType) {
      query = query.eq("membership_type", membershipType)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching fitness membership benefits:", error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Error in getFitnessMembershipBenefits:", error)
    return { data: [], error: "Failed to fetch fitness membership benefits" }
  }
}

