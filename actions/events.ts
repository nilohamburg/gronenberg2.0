"use server"

import { createServerComponentClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Define types
export interface RestaurantEvent {
  id: number
  title: string
  description: string
  date: string // ISO string
  time: string
  price?: string
  image?: string
  capacity?: number
  bookedCount?: number // Added to track booked count
}

export interface EventReservation {
  id: number
  eventId: number
  customerName: string
  contactInfo: string
  attendees: number
  status: "pending" | "confirmed" | "cancelled"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Create a new event reservation
export async function createEventReservation({
  eventId,
  customerName,
  contactInfo,
  attendees,
  notes = "",
}: {
  eventId: number
  customerName: string
  contactInfo: string
  attendees: number
  notes?: string
}) {
  const supabase = createServerComponentClient()

  // First check if the event has enough capacity
  const event = await getEventById(eventId)

  if (event.capacity) {
    // Get current confirmed and pending reservations
    const { data: reservations, error: resError } = await supabase
      .from("event_reservations")
      .select("attendees, status")
      .eq("event_id", eventId)
      .in("status", ["confirmed", "pending"])

    if (resError) {
      console.error("Error checking event capacity:", resError)
      throw new Error("Failed to check event capacity")
    }

    // Calculate total booked seats
    const bookedSeats = reservations.reduce((total, res) => total + res.attendees, 0)

    // Check if adding these attendees would exceed capacity
    if (bookedSeats + attendees > event.capacity) {
      throw new Error("Nicht genügend Plätze verfügbar")
    }
  }

  // If we have capacity or no capacity limit, create the reservation
  const { data, error } = await supabase
    .from("event_reservations")
    .insert({
      event_id: eventId,
      customer_name: customerName,
      contact_info: contactInfo,
      attendees: attendees,
      notes: notes,
      status: "pending",
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating event reservation:", error)
    throw new Error("Failed to create reservation")
  }

  revalidatePath("/admin/events")
  revalidatePath("/dining/muhle-restaurant")

  return { success: true, id: data.id }
}

// Get all events
export async function getEvents(includeBookedCount = false, futureOnly = false) {
  try {
    const supabase = createServerComponentClient()

    let query = supabase.from("events").select("*")

    // Only include future events if specified
    if (futureOnly) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      query = query.gte("date", today.toISOString().split("T")[0])
    }

    query = query.order("date", { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error("Error fetching events:", error)
      throw new Error("Failed to fetch events")
    }

    // If we need to include booked counts
    if (includeBookedCount && data && data.length > 0) {
      const eventIds = data.map((event) => event.id)

      // Get all reservations for these events
      const { data: reservations, error: resError } = await supabase
        .from("event_reservations")
        .select("event_id, attendees, status")
        .in("event_id", eventIds)
        .in("status", ["confirmed", "pending"])

      if (resError) {
        console.error("Error fetching reservations for events:", resError)
        // Continue without booked counts rather than failing completely
      } else if (reservations) {
        // Calculate booked counts for each event
        const bookedCounts = {}
        reservations.forEach((res) => {
          if (!bookedCounts[res.event_id]) {
            bookedCounts[res.event_id] = 0
          }
          bookedCounts[res.event_id] += res.attendees
        })

        // Add booked counts to events
        data.forEach((event) => {
          event.bookedCount = bookedCounts[event.id] || 0
        })
      }
    }

    return data as RestaurantEvent[]
  } catch (error) {
    console.error("Error in getEvents:", error)
    // Return empty array instead of throwing to prevent cascading errors
    return []
  }
}

// Get event by ID
export async function getEventById(id: number, includeBookedCount = false) {
  try {
    const supabase = createServerComponentClient()

    const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching event with id ${id}:`, error)
      throw new Error("Failed to fetch event")
    }

    // If we need to include booked count
    if (includeBookedCount) {
      // Get all confirmed and pending reservations for this event
      const { data: reservations, error: resError } = await supabase
        .from("event_reservations")
        .select("attendees, status")
        .eq("event_id", id)
        .in("status", ["confirmed", "pending"])

      if (resError) {
        console.error(`Error fetching reservations for event ${id}:`, resError)
        // Continue without booked count rather than failing completely
      } else if (reservations) {
        // Calculate total booked seats
        data.bookedCount = reservations.reduce((total, res) => total + res.attendees, 0)
      }
    }

    return data as RestaurantEvent
  } catch (error) {
    console.error(`Error in getEventById for id ${id}:`, error)
    // Return a minimal event object to prevent cascading errors
    return {
      id,
      title: "Event not available",
      description: "",
      date: new Date().toISOString(),
      time: "",
    } as RestaurantEvent
  }
}

// Check if an event is fully booked
export async function isEventFullyBooked(eventId: number) {
  try {
    const event = await getEventById(eventId, true)

    // If no capacity limit, it's never fully booked
    if (!event.capacity) return false

    // Check if booked count meets or exceeds capacity
    return (event.bookedCount || 0) >= event.capacity
  } catch (error) {
    console.error(`Error checking if event ${eventId} is fully booked:`, error)
    // Default to not fully booked to allow reservations
    return false
  }
}

// Create a new event
export async function createEvent(event: Omit<RestaurantEvent, "id">) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("events").insert(event).select("id").single()

  if (error) {
    console.error("Error creating event:", error)
    throw new Error("Failed to create event")
  }

  revalidatePath("/admin/events")
  revalidatePath("/dining/muhle-restaurant")

  return { success: true, id: data.id }
}

// Update an event
export async function updateEvent(event: RestaurantEvent) {
  const supabase = createServerComponentClient()

  const { error } = await supabase
    .from("events")
    .update({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      price: event.price,
      image: event.image,
      capacity: event.capacity,
    })
    .eq("id", event.id)

  if (error) {
    console.error("Error updating event:", error)
    throw new Error("Failed to update event")
  }

  revalidatePath("/admin/events")
  revalidatePath("/dining/muhle-restaurant")

  return { success: true }
}

// Delete an event
export async function deleteEvent(id: number) {
  const supabase = createServerComponentClient()

  const { error } = await supabase.from("events").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting event with id ${id}:`, error)
    throw new Error("Failed to delete event")
  }

  revalidatePath("/admin/events")
  revalidatePath("/dining/muhle-restaurant")

  return { success: true }
}

// Get all reservations for an event
export async function getEventReservations(eventId?: number) {
  const supabase = createServerComponentClient()

  // First, get the reservations
  let query = supabase.from("event_reservations").select("*").order("created_at", { ascending: false })

  if (eventId) {
    query = query.eq("event_id", eventId)
  }

  const { data: reservations, error } = await query

  if (error) {
    console.error("Error fetching event reservations:", error)
    throw new Error("Failed to fetch reservations")
  }

  // If we have no reservations, return empty array
  if (!reservations || reservations.length === 0) {
    return []
  }

  // Get all unique event IDs from the reservations
  const eventIds = [...new Set(reservations.map((res) => res.event_id))]

  // Fetch all related events in a single query
  const { data: events, error: eventsError } = await supabase.from("events").select("*").in("id", eventIds)

  if (eventsError) {
    console.error("Error fetching events for reservations:", eventsError)
    throw new Error("Failed to fetch events for reservations")
  }

  // Create a map of event id to event data for quick lookup
  const eventsMap = (events || []).reduce((map, event) => {
    map[event.id] = event
    return map
  }, {})

  // Join the data manually
  return reservations.map((reservation) => {
    const event = eventsMap[reservation.event_id] || {}
    return {
      id: reservation.id,
      eventId: reservation.event_id,
      eventTitle: event.title || "Unknown Event",
      eventDate: event.date || "",
      eventTime: event.time || "",
      customerName: reservation.customer_name,
      contactInfo: reservation.contact_info,
      attendees: reservation.attendees,
      status: reservation.status,
      notes: reservation.notes,
      createdAt: new Date(reservation.created_at),
      updatedAt: new Date(reservation.updated_at),
    }
  })
}

// Update reservation status
export async function updateReservationStatus(id: number, status: "pending" | "confirmed" | "cancelled") {
  const supabase = createServerComponentClient()

  // First get the current reservation to know the event and attendees
  const { data: reservation, error: fetchError } = await supabase
    .from("event_reservations")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchError) {
    console.error(`Error fetching reservation with id ${id}:`, fetchError)
    throw new Error("Failed to fetch reservation")
  }

  // Update the reservation status
  const { error } = await supabase
    .from("event_reservations")
    .update({
      status: status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error(`Error updating reservation status for id ${id}:`, error)
    throw new Error("Failed to update reservation status")
  }

  revalidatePath("/admin/events")

  return { success: true }
}

// Delete a reservation
export async function deleteReservation(id: number) {
  const supabase = createServerComponentClient()

  const { error } = await supabase.from("event_reservations").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting reservation with id ${id}:`, error)
    throw new Error("Failed to delete reservation")
  }

  revalidatePath("/admin/events")

  return { success: true }
}

