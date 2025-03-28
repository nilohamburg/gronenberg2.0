"use server"

import { createServerComponentClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function getHouses() {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase
    .from("houses")
    .select(`
      *,
      house_amenities(
        amenity_id,
        amenities(name, icon)
      )
    `)
    .order("id")

  if (error) {
    console.error("Error fetching houses:", error)
    throw new Error("Failed to fetch houses")
  }

  // Transform the data to match the expected format
  const houses = data.map((house) => {
    const amenities = house.house_amenities.map((ha: any) => ha.amenities.name)

    return {
      id: house.id,
      name: house.name,
      description: house.description || "",
      capacity: house.capacity,
      price: house.price,
      image: house.image_url || `/placeholder.svg?height=400&width=600&text=House ${house.id}`,
      dogsAllowed: house.dogs_allowed,
      seaView: house.sea_view,
      amenities,
    }
  })

  return houses
}

export async function getHouseById(id: number) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase
    .from("houses")
    .select(`
      *,
      house_amenities(
        amenity_id,
        amenities(name, icon)
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching house with id ${id}:`, error)
    throw new Error("Failed to fetch house")
  }

  // Transform the data to match the expected format
  const amenities = data.house_amenities.map((ha: any) => ha.amenities.name)

  return {
    id: data.id,
    name: data.name,
    description: data.description || "",
    capacity: data.capacity,
    price: data.price,
    image: data.image_url || `/placeholder.svg?height=400&width=600&text=House ${data.id}`,
    dogsAllowed: data.dogs_allowed,
    seaView: data.sea_view,
    amenities,
  }
}

export async function updateHouse(house: {
  id: number
  name: string
  description: string
  capacity: number
  price: number
  image: string
  dogsAllowed: boolean
  seaView: boolean
  amenities: string[]
}) {
  const supabase = createServerComponentClient()

  // Update the house
  const { error: houseError } = await supabase
    .from("houses")
    .update({
      name: house.name,
      description: house.description,
      capacity: house.capacity,
      price: house.price,
      image_url: house.image,
      dogs_allowed: house.dogsAllowed,
      sea_view: house.seaView,
      updated_at: new Date().toISOString(),
    })
    .eq("id", house.id)

  if (houseError) {
    console.error("Error updating house:", houseError)
    throw new Error("Failed to update house")
  }

  // Get existing amenities
  const { data: existingAmenities, error: amenitiesError } = await supabase.from("amenities").select("id, name")

  if (amenitiesError) {
    console.error("Error fetching amenities:", amenitiesError)
    throw new Error("Failed to fetch amenities")
  }

  // Create a map of amenity names to IDs
  const amenityMap = new Map(existingAmenities.map((a: any) => [a.name, a.id]))

  // Add any new amenities
  for (const amenity of house.amenities) {
    if (!amenityMap.has(amenity)) {
      const { data, error } = await supabase.from("amenities").insert({ name: amenity }).select("id").single()

      if (error) {
        console.error(`Error creating amenity ${amenity}:`, error)
        continue
      }

      amenityMap.set(amenity, data.id)
    }
  }

  // Delete existing house_amenities
  await supabase.from("house_amenities").delete().eq("house_id", house.id)

  // Add new house_amenities
  const houseAmenities = house.amenities
    .filter((amenity) => amenityMap.has(amenity))
    .map((amenity) => ({
      house_id: house.id,
      amenity_id: amenityMap.get(amenity)!,
    }))

  if (houseAmenities.length > 0) {
    const { error: linkError } = await supabase.from("house_amenities").insert(houseAmenities)

    if (linkError) {
      console.error("Error linking amenities to house:", linkError)
      throw new Error("Failed to link amenities to house")
    }
  }

  revalidatePath("/admin/houses")
  revalidatePath(`/admin/houses/${house.id}`)
  revalidatePath("/rooms")
  revalidatePath(`/rooms/${house.id}`)

  return { success: true }
}

export async function deleteHouse(id: number) {
  const supabase = createServerComponentClient()

  const { error } = await supabase.from("houses").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting house with id ${id}:`, error)
    throw new Error("Failed to delete house")
  }

  revalidatePath("/admin/houses")
  revalidatePath("/rooms")

  return { success: true }
}

export async function addHouse(house: {
  name: string
  description: string
  capacity: number
  price: number
  image: string
  dogsAllowed: boolean
  seaView: boolean
  amenities: string[]
}) {
  const supabase = createServerComponentClient()

  // Insert the house
  const { data, error: houseError } = await supabase
    .from("houses")
    .insert({
      name: house.name,
      description: house.description,
      capacity: house.capacity,
      price: house.price,
      image_url: house.image,
      dogs_allowed: house.dogsAllowed,
      sea_view: house.seaView,
    })
    .select("id")
    .single()

  if (houseError) {
    console.error("Error creating house:", houseError)
    throw new Error("Failed to create house")
  }

  const houseId = data.id

  // Get existing amenities
  const { data: existingAmenities, error: amenitiesError } = await supabase.from("amenities").select("id, name")

  if (amenitiesError) {
    console.error("Error fetching amenities:", amenitiesError)
    throw new Error("Failed to fetch amenities")
  }

  // Create a map of amenity names to IDs
  const amenityMap = new Map(existingAmenities.map((a: any) => [a.name, a.id]))

  // Add any new amenities
  for (const amenity of house.amenities) {
    if (!amenityMap.has(amenity)) {
      const { data, error } = await supabase.from("amenities").insert({ name: amenity }).select("id").single()

      if (error) {
        console.error(`Error creating amenity ${amenity}:`, error)
        continue
      }

      amenityMap.set(amenity, data.id)
    }
  }

  // Add house_amenities
  const houseAmenities = house.amenities
    .filter((amenity) => amenityMap.has(amenity))
    .map((amenity) => ({
      house_id: houseId,
      amenity_id: amenityMap.get(amenity)!,
    }))

  if (houseAmenities.length > 0) {
    const { error: linkError } = await supabase.from("house_amenities").insert(houseAmenities)

    if (linkError) {
      console.error("Error linking amenities to house:", linkError)
      throw new Error("Failed to link amenities to house")
    }
  }

  revalidatePath("/admin/houses")
  revalidatePath("/rooms")

  return { success: true, id: houseId }
}

