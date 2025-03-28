import { createClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

export type TableReservation = Database["public"]["Tables"]["table_reservations"]["Row"]
export type TableReservationInsert = Database["public"]["Tables"]["table_reservations"]["Insert"]
export type TableReservationUpdate = Database["public"]["Tables"]["table_reservations"]["Update"]

/**
 * Fetches all table reservations
 * @returns Promise with an array of table reservations
 */
export async function getAllTableReservations(): Promise<{ data: TableReservation[]; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("table_reservations")
      .select("*")
      .order("reservation_date", { ascending: true })

    if (error) {
      console.error("Error fetching table reservations:", error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Error in getAllTableReservations:", error)
    return { data: [], error: "Failed to fetch table reservations" }
  }
}

/**
 * Fetches a table reservation by ID
 * @param id The table reservation ID
 * @returns Promise with the table reservation data
 */
export async function getTableReservationById(
  id: string,
): Promise<{ data: TableReservation | null; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("table_reservations").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching table reservation with ID ${id}:`, error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in getTableReservationById:", error)
    return { data: null, error: "Failed to fetch table reservation" }
  }
}

/**
 * Creates a new table reservation
 * @param reservation The table reservation data to insert
 * @returns Promise with the created table reservation
 */
export async function createTableReservation(
  reservation: TableReservationInsert,
): Promise<{ data: TableReservation | null; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("table_reservations").insert(reservation).select().single()

    if (error) {
      console.error("Error creating table reservation:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in createTableReservation:", error)
    return { data: null, error: "Failed to create table reservation" }
  }
}

/**
 * Updates an existing table reservation
 * @param id The table reservation ID
 * @param reservation The table reservation data to update
 * @returns Promise with the updated table reservation
 */
export async function updateTableReservation(
  id: string,
  reservation: TableReservationUpdate,
): Promise<{ data: TableReservation | null; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("table_reservations").update(reservation).eq("id", id).select().single()

    if (error) {
      console.error(`Error updating table reservation with ID ${id}:`, error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in updateTableReservation:", error)
    return { data: null, error: "Failed to update table reservation" }
  }
}

/**
 * Deletes a table reservation
 * @param id The table reservation ID
 * @returns Promise with success status
 */
export async function deleteTableReservation(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("table_reservations").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting table reservation with ID ${id}:`, error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error in deleteTableReservation:", error)
    return { success: false, error: "Failed to delete table reservation" }
  }
}

