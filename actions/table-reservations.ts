"use server"

import { createClient } from "@/lib/supabase"

export type TableReservation = {
  id: number
  customer_name: string
  contact_info: string
  reservation_date: string
  reservation_time: string
  guests: number
  special_requests: string | null
  status: "pending" | "confirmed" | "cancelled" | "completed"
  created_at: string
  updated_at: string
}

export type TableReservationFormData = {
  customer_name: string
  contact_info: string
  reservation_date: string
  reservation_time: string
  guests: number
  special_requests?: string
}

// Get all table reservations
export async function getTableReservations(): Promise<TableReservation[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("table_reservations")
    .select("*")
    .order("reservation_date", { ascending: true })
    .order("reservation_time", { ascending: true })

  if (error) {
    console.error("Error fetching table reservations:", error)
    throw new Error("Failed to fetch table reservations")
  }

  return data as TableReservation[]
}

// Get table reservations by status
export async function getTableReservationsByStatus(status: string): Promise<TableReservation[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("table_reservations")
    .select("*")
    .eq("status", status)
    .order("reservation_date", { ascending: true })
    .order("reservation_time", { ascending: true })

  if (error) {
    console.error("Error fetching table reservations by status:", error)
    throw new Error("Failed to fetch table reservations")
  }

  return data as TableReservation[]
}

// Get table reservations by date
export async function getTableReservationsByDate(date: string): Promise<TableReservation[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("table_reservations")
    .select("*")
    .eq("reservation_date", date)
    .order("reservation_time", { ascending: true })

  if (error) {
    console.error("Error fetching table reservations by date:", error)
    throw new Error("Failed to fetch table reservations")
  }

  return data as TableReservation[]
}

// Create a new table reservation
export async function createTableReservation(formData: TableReservationFormData): Promise<TableReservation> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("table_reservations")
    .insert([
      {
        customer_name: formData.customer_name,
        contact_info: formData.contact_info,
        reservation_date: formData.reservation_date,
        reservation_time: formData.reservation_time,
        guests: formData.guests,
        special_requests: formData.special_requests || null,
        status: "pending",
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating table reservation:", error)
    throw new Error("Failed to create table reservation")
  }

  return data as TableReservation
}

// Update a table reservation
export async function updateTableReservation(
  id: number,
  updates: Partial<TableReservation>,
): Promise<TableReservation> {
  const supabase = createClient()

  // Add updated_at timestamp
  const updatedData = {
    ...updates,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("table_reservations").update(updatedData).eq("id", id).select().single()

  if (error) {
    console.error("Error updating table reservation:", error)
    throw new Error("Failed to update table reservation")
  }

  return data as TableReservation
}

// Update table reservation status
export async function updateTableReservationStatus(
  id: number,
  status: "pending" | "confirmed" | "cancelled" | "completed",
): Promise<TableReservation> {
  return updateTableReservation(id, { status })
}

// Delete a table reservation
export async function deleteTableReservation(id: number): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("table_reservations").delete().eq("id", id)

  if (error) {
    console.error("Error deleting table reservation:", error)
    throw new Error("Failed to delete table reservation")
  }
}

