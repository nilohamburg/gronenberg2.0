"use server"

import { createClient } from "@/lib/supabase"

export type FitnessCourse = {
  id: string
  title: string
  description: string | null
  instructor: string
  day_of_week: string
  start_time: string
  end_time: string
  max_participants: number
  repetition_type: "weekly" | "monthly" | null
  created_at: string
}

export async function getFitnessCourses(): Promise<FitnessCourse[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("fitness_courses").select("*").order("start_time")

    if (error) {
      console.error("Error fetching fitness courses:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getFitnessCourses:", error)
    return []
  }
}

export async function getFitnessCoursesByDay(day: string): Promise<FitnessCourse[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("fitness_courses")
      .select("*")
      .eq("day_of_week", day)
      .order("start_time")

    if (error) {
      console.error("Error fetching fitness courses by day:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getFitnessCoursesByDay:", error)
    return []
  }
}

export async function createFitnessCourse(courseData: {
  title: string
  description: string
  instructor: string
  day_of_week: string
  start_time: string
  end_time: string
  max_participants: number
  repetition_type: "weekly" | "monthly"
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("fitness_courses").insert([courseData])

    if (error) {
      console.error("Error creating fitness course:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in createFitnessCourse:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function updateFitnessCourse(
  id: string,
  courseData: {
    title: string
    description: string
    instructor: string
    day_of_week: string
    start_time: string
    end_time: string
    max_participants: number
    repetition_type: "weekly" | "monthly"
  },
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("fitness_courses").update(courseData).eq("id", id)

    if (error) {
      console.error("Error updating fitness course:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in updateFitnessCourse:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function deleteFitnessCourse(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("fitness_courses").delete().eq("id", id)

    if (error) {
      console.error("Error deleting fitness course:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteFitnessCourse:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

