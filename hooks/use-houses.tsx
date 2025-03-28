"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"
import type { RoomProps } from "@/components/room-card"
import { getHouses, updateHouse, deleteHouse, addHouse } from "@/actions/houses"

// Sample room data (same as in rooms/page.tsx)
// const initialHousesData: RoomProps[] = Array.from({ length: 32 }, (_, i) => ({
//   id: i + 1,
//   name: `${["Deluxe", "Premium", "Luxury", "Standard"][i % 4]} ${["Cottage", "Villa", "House", "Suite"][i % 4]} ${i + 1}`,
//   description: `A beautiful ${["cozy", "spacious", "elegant", "charming"][i % 4]} accommodation with ${(i % 3) + 2} bedrooms and modern amenities. Perfect for a relaxing getaway in the countryside.`,
//   capacity: (i % 3) + 2, // 2, 3, or 4 people
//   price: 150 + ((i * 10) % 200),
//   image: `/placeholder.svg?height=400&width=600&text=House ${i + 1}`,
//   dogsAllowed: i % 3 === 0, // Every 3rd room allows dogs
//   seaView: i % 4 === 0, // Every 4th room has sea view
//   amenities: [
//     "WiFi",
//     "Coffee Machine",
//     "TV",
//     ...(i % 2 === 0 ? ["Fireplace"] : []),
//     ...(i % 5 === 0 ? ["Private Garden"] : []),
//     ...(i % 7 === 0 ? ["Balcony"] : []),
//   ],
// }))

interface HousesContextType {
  houses: RoomProps[]
  loading: boolean
  updateHouse: (house: RoomProps) => Promise<void>
  deleteHouse: (id: number) => Promise<void>
  addHouse: (house: Omit<RoomProps, "id">) => Promise<void>
}

const HousesContext = createContext<HousesContextType | undefined>(undefined)

export function HousesProvider({ children }: { children: React.ReactNode }) {
  const [houses, setHouses] = useState<RoomProps[]>([])
  const [loading, setLoading] = useState(true)

  // Load houses from Supabase
  useEffect(() => {
    const loadHouses = async () => {
      try {
        const data = await getHouses()
        setHouses(data)
      } catch (error) {
        console.error("Failed to load houses:", error)
      } finally {
        setLoading(false)
      }
    }

    loadHouses()
  }, [])

  // Update a house
  const updateHouseHandler = async (updatedHouse: RoomProps) => {
    try {
      await updateHouse(updatedHouse)

      // Update local state
      setHouses((prevHouses) => prevHouses.map((house) => (house.id === updatedHouse.id ? updatedHouse : house)))
    } catch (error) {
      console.error("Failed to update house:", error)
      throw error
    }
  }

  // Delete a house
  const deleteHouseHandler = async (id: number) => {
    try {
      await deleteHouse(id)

      // Update local state
      setHouses((prevHouses) => prevHouses.filter((house) => house.id !== id))
    } catch (error) {
      console.error("Failed to delete house:", error)
      throw error
    }
  }

  // Add a new house
  const addHouseHandler = async (newHouse: Omit<RoomProps, "id">) => {
    try {
      const { id } = await addHouse(newHouse)

      // Update local state
      const houseWithId = { ...newHouse, id } as RoomProps
      setHouses((prevHouses) => [...prevHouses, houseWithId])
    } catch (error) {
      console.error("Failed to add house:", error)
      throw error
    }
  }

  return (
    <HousesContext.Provider
      value={{
        houses,
        loading,
        updateHouse: updateHouseHandler,
        deleteHouse: deleteHouseHandler,
        addHouse: addHouseHandler,
      }}
    >
      {children}
    </HousesContext.Provider>
  )
}

export function useHouses() {
  const context = useContext(HousesContext)
  if (context === undefined) {
    throw new Error("useHouses must be used within a HousesProvider")
  }
  return context
}

