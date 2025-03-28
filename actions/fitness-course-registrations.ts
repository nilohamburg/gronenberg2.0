"use server"

import { createClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export type CourseRegistration = {
  id: string
  course_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  status: "pending" | "confirmed" | "cancelled" | "attended"
  created_at: string
}

export type FitnessCourseRegistration = {
  id: string
  course_id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  status: "confirmed" | "cancelled" | "attended"
  created_at: string
  updated_at: string
}

export async function getFitnessCourseRegistrations() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("fitness_course_registrations")
    .select("*, fitness_courses(*)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching fitness course registrations:", error)
    throw new Error("Failed to fetch fitness course registrations")
  }

  return data
}

export async function getFitnessCourseRegistrationsByCourse(courseId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("fitness_course_registrations")
    .select("*")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching fitness course registrations by course:", error)
    throw new Error("Failed to fetch fitness course registrations by course")
  }

  return data as FitnessCourseRegistration[]
}

export async function createFitnessCourseRegistration(
  registration: Omit<FitnessCourseRegistration, "id" | "created_at" | "updated_at">,
) {
  const supabase = createClient()

  // First, check if the course has reached its capacity
  const { data: course, error: courseError } = await supabase
    .from("fitness_courses")
    .select("max_participants")
    .eq("id", registration.course_id)
    .single()

  if (courseError) {
    console.error("Error fetching course:", courseError)
    throw new Error("Failed to fetch course")
  }

  // Count current registrations
  const { count, error: countError } = await supabase
    .from("fitness_course_registrations")
    .select("*", { count: "exact", head: true })
    .eq("course_id", registration.course_id)
    .eq("status", "confirmed")

  if (countError) {
    console.error("Error counting registrations:", countError)
    throw new Error("Failed to count registrations")
  }

  if (count !== null && count >= course.max_participants) {
    throw new Error("Course is already at maximum capacity")
  }

  // Create the registration
  const { data, error } = await supabase.from("fitness_course_registrations").insert([registration]).select()

  if (error) {
    console.error("Error creating fitness course registration:", error)
    throw new Error("Failed to create fitness course registration")
  }

  revalidatePath("/admin/fitness")
  revalidatePath("/fitness")

  return data[0] as FitnessCourseRegistration
}

export async function updateFitnessCourseRegistrationStatus(
  id: string,
  status: "confirmed" | "cancelled" | "attended",
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("fitness_course_registrations")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating fitness course registration status:", error)
    throw new Error("Failed to update fitness course registration status")
  }

  revalidatePath("/admin/fitness")
  revalidatePath("/fitness")

  return data[0] as FitnessCourseRegistration
}

export async function deleteFitnessCourseRegistration(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("fitness_course_registrations").delete().eq("id", id)

  if (error) {
    console.error("Error deleting fitness course registration:", error)
    throw new Error("Failed to delete fitness course registration")
  }

  revalidatePath("/admin/fitness")
  revalidatePath("/fitness")

  return { success: true }
}

export async function getCourseRegistrationCount(courseId: string) {
  const supabase = createClient()

  const { count, error } = await supabase
    .from("fitness_course_registrations")
    .select("*", { count: "exact", head: true })
    .eq("course_id", courseId)
    .eq("status", "confirmed")

  if (error) {
    console.error("Error counting registrations:", error)
    throw new Error("Failed to count registrations")
  }

  return count || 0
}

export async function registerForCourse(data: {
  course_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    // First check if the course exists and has available spots
    const { data: course, error: courseError } = await supabase
      .from("fitness_courses")
      .select("id, max_participants")
      .eq("id", data.course_id)
      .single()

    if (courseError || !course) {
      console.error("Error fetching course:", courseError)
      return { success: false, error: "Kurs nicht gefunden" }
    }

    // Count existing registrations for this course
    const { count, error: countError } = await supabase
      .from("fitness_course_registrations")
      .select("id", { count: "exact" })
      .eq("course_id", data.course_id)
      .not("status", "eq", "cancelled")

    if (countError) {
      console.error("Error counting registrations:", countError)
      return { success: false, error: "Fehler bei der Überprüfung der Verfügbarkeit" }
    }

    // Check if the course is full
    if (count !== null && count >= course.max_participants) {
      return { success: false, error: "Dieser Kurs ist bereits ausgebucht" }
    }

    // Insert the registration
    const { error: insertError } = await supabase.from("fitness_course_registrations").insert([
      {
        course_id: data.course_id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        status: "pending",
      },
    ])

    if (insertError) {
      console.error("Error inserting registration:", insertError)
      return { success: false, error: "Fehler bei der Anmeldung" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in registerForCourse:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unbekannter Fehler",
    }
  }
}

export async function getCourseRegistrations(): Promise<CourseRegistration[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("fitness_course_registrations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching course registrations:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getCourseRegistrations:", error)
    return []
  }
}

export async function updateRegistrationStatus(
  id: string,
  status: "pending" | "confirmed" | "cancelled" | "attended",
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("fitness_course_registrations").update({ status }).eq("id", id)

    if (error) {
      console.error("Error updating registration status:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in updateRegistrationStatus:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

