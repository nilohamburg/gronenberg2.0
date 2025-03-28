import { createClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

export type Event = Database["public"]["Tables"]["events"]["Row"]
export type EventInsert = Database["public"]["Tables"]["events"]["Insert"]
export type EventUpdate = Database["public"]["Tables"]["events"]["Update"]

export type EventReservation = Database["public"]["Tables"]["event_reservations"]["Row"]
export type EventReservationInsert = Database["public"]["Tables"]["event_reservations"]["Insert"]
export type EventReservationUpdate = Database["public"]["Tables"]["event_reservations"]["Update"]

/**
 * Fetches all events
 * @param futureOnly Whether to only fetch future events
 * @returns Promise with an array of events
 */
export async function getAllEvents(futureOnly = false): Promise<{ data: Event[]; error: string | null }> {
  try {
    const supabase = createClient()

    let query = supabase.from("events").select("*").order("date", { ascending: true })

    if (futureOnly) {
      const today = new Date().toISOString().split("T")[0]
      query = query.gte("date", today)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching events:", error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Error in getAllEvents:", error)
    return { data: [], error: "Failed to fetch events" }
  }
}

/**
 * Fetches an event by ID
 * @param id The event ID
 * @returns Promise with the event data
 */
export async function getEventById(id: string): Promise<{ data: Event | null; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching event with ID ${id}:`, error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in getEventById:", error)
    return { data: null, error: "Failed to fetch event" }
  }
}

/**
 * Creates a new event
 * @param event The event data to insert
 * @returns Promise with the created event
 */
export async function createEvent(event: EventInsert): Promise<{ data: Event | null; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("events").insert(event).select().single()

    if (error) {
      console.error("Error creating event:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in createEvent:", error)
    return { data: null, error: "Failed to create event" }
  }
}

/**
 * Updates an existing event
 * @param id The event ID
 * @param event The event data to update
 * @returns Promise with the updated event
 */
export async function updateEvent(
  id: string,
  event: EventUpdate,
): Promise<{ data: Event | null; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("events").update(event).eq("id", id).select().single()

    if (error) {
      console.error(`Error updating event with ID ${id}:`, error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in updateEvent:", error)
    return { data: null, error: "Failed to update event" }
  }
}

/**
 * Deletes an event
 * @param id The event ID
 * @returns Promise with success status
 */
export async function deleteEvent(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("events").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting event with ID ${id}:`, error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error in deleteEvent:", error)
    return { success: false, error: "Failed to delete event" }
  }
}

/**
 * Fetches all event reservations
 * @param eventId Optional event ID to filter by
 * @returns Promise with an array of event reservations
 */
export async function getAllEventReservations(
  eventId?: string,
): Promise<{ data: EventReservation[]; error: string | null }> {
  try {
    const supabase = createClient()

    let query = supabase.from("event_reservations").select("*").order("created_at", { ascending: false })

    if (eventId) {
      query = query.eq("event_id", eventId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching event reservations:", error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Error in getAllEventReservations:", error)
    return { data: [], error: "Failed to fetch event reservations" }
  }
}

/**
 * Creates a new event reservation
 * @param reservation The event reservation data to insert
 * @returns Promise with the created event reservation
 */
export async function createEventReservation(
  reservation: EventReservationInsert,
): Promise<{ data: EventReservation | null; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("event_reservations").insert(reservation).select().single()

    if (error) {
      console.error("Error creating event reservation:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in createEventReservation:", error)
    return { data: null, error: "Failed to create event reservation" }
  }
}

/**
 * Updates an existing event reservation
 * @param id The event reservation ID
 * @param reservation The event reservation data to update
 * @returns Promise with the updated event reservation
 */
export async function updateEventReservation(
  id: string,
  reservation: EventReservationUpdate,
): Promise<{ data: EventReservation | null; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("event_reservations").update(reservation).eq("id", id).select().single()

    if (error) {
      console.error(`Error updating event reservation with ID ${id}:`, error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in updateEventReservation:", error)
    return { data: null, error: "Failed to update event reservation" }
  }
}

/**
 * Deletes an event reservation
 * @param id The event reservation ID
 * @returns Promise with success status
 */
export async function deleteEventReservation(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("event_reservations").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting event reservation with ID ${id}:`, error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error in deleteEventReservation:", error)
    return { success: false, error: "Failed to delete event reservation" }
  }
}

