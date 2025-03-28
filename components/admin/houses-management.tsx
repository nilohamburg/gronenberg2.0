"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { useHouses } from "@/hooks/use-houses"
import type { RoomProps } from "@/components/room-card"
import { Search, Plus, Pencil, Trash, Eye, Dog } from "lucide-react"

export function HousesManagement() {
  const router = useRouter()
  const { isAuthenticated } = useAdminAuth()
  const { houses, loading, deleteHouse } = useHouses()
  const [filteredHouses, setFilteredHouses] = useState<RoomProps[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    seaView: false,
    petFriendly: false,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (houses) {
      let result = [...houses]

      // Apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        result = result.filter(
          (house) => house.name.toLowerCase().includes(query) || house.description.toLowerCase().includes(query),
        )
      }

      // Apply filters
      if (filters.seaView) {
        result = result.filter((house) => house.seaView)
      }

      if (filters.petFriendly) {
        result = result.filter((house) => house.dogsAllowed)
      }

      setFilteredHouses(result)
    }
  }, [houses, searchQuery, filters])

  // Ensure the houses list refreshes when returning from edit page
  useEffect(() => {
    // Refresh houses data when component mounts or when returning from edit page
    const refreshHouses = () => {
      try {
        const savedHouses = localStorage.getItem("houses")
        if (savedHouses) {
          const parsedHouses = JSON.parse(savedHouses)
          // Force a refresh of the houses data
          setFilteredHouses(parsedHouses)
        }
      } catch (error) {
        console.error("Failed to refresh houses:", error)
      }
    }

    if (!loading) {
      refreshHouses()
    }
  }, [loading, houses])

  if (!isAuthenticated) {
    return null
  }

  const toggleFilter = (filter: "seaView" | "petFriendly") => {
    setFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }))
  }

  const handleEdit = (houseId: number) => {
    router.push(`/admin/houses/${houseId}`)
  }

  const handleView = (houseId: number) => {
    window.open(`/rooms/${houseId}`, "_blank")
  }

  const handleDelete = async (houseId: number) => {
    if (window.confirm("Are you sure you want to delete this house?")) {
      try {
        await deleteHouse(houseId)
        alert("House deleted successfully")
      } catch (error) {
        console.error("Failed to delete house:", error)
        alert("Failed to delete house")
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Houses Management</h1>
          <p className="text-muted-foreground">Manage all properties and their details</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New House
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search houses..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant={filters.seaView ? "default" : "outline"}
            size="sm"
            onClick={() => toggleFilter("seaView")}
            className="flex-1 sm:flex-none"
          >
            <Eye className="h-4 w-4 mr-2" />
            Sea View
          </Button>
          <Button
            variant={filters.petFriendly ? "default" : "outline"}
            size="sm"
            onClick={() => toggleFilter("petFriendly")}
            className="flex-1 sm:flex-none"
          >
            <Dog className="h-4 w-4 mr-2" />
            Pet Friendly
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({ seaView: false, petFriendly: false })}
            className="flex-1 sm:flex-none"
          >
            Clear
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Features</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHouses.length > 0 ? (
                filteredHouses.map((house) => (
                  <TableRow key={house.id}>
                    <TableCell className="font-medium">{house.id}</TableCell>
                    <TableCell>{house.name}</TableCell>
                    <TableCell>{house.capacity} People</TableCell>
                    <TableCell>€{house.price}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {house.seaView && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            Sea View
                          </Badge>
                        )}
                        {house.dogsAllowed && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Dog className="h-3 w-3" />
                            Pet Friendly
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(house.id)}
                          className="h-8 w-8 p-0"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(house.id)}
                          className="h-8 w-8 p-0"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(house.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No houses found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

