"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format, parseISO } from "date-fns"
import { de } from "date-fns/locale"
import {
  getTableReservations,
  updateTableReservationStatus,
  deleteTableReservation,
  createTableReservation,
  type TableReservation,
  type TableReservationFormData,
} from "@/actions/table-reservations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Calendar, Clock, Filter, MoreHorizontal, Plus, RefreshCcw, Search, Trash, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { JSX } from "react"

export function TableReservationsManagement() {
  const [reservations, setReservations] = useState<TableReservation[]>([])
  const [filteredReservations, setFilteredReservations] = useState<TableReservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [reservationToDelete, setReservationToDelete] = useState<TableReservation | null>(null)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [reservationToUpdate, setReservationToUpdate] = useState<TableReservation | null>(null)
  const [newStatus, setNewStatus] = useState<"pending" | "confirmed" | "cancelled" | "completed">("confirmed")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newReservation, setNewReservation] = useState<TableReservationFormData & { status: string }>({
    customer_name: "",
    contact_info: "",
    reservation_date: new Date().toISOString().split("T")[0],
    reservation_time: "",
    guests: 2,
    special_requests: "",
    status: "pending",
  })

  // Fetch reservations
  const fetchReservations = async () => {
    setIsLoading(true)
    try {
      const data = await getTableReservations()
      setReservations(data)
      setFilteredReservations(data)
    } catch (error) {
      console.error("Error fetching reservations:", error)
      toast({
        title: "Error",
        description: "Failed to load table reservations",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  // Filter reservations based on search, date, and status
  useEffect(() => {
    let filtered = [...reservations]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (reservation) =>
          reservation.customer_name.toLowerCase().includes(query) ||
          reservation.contact_info.toLowerCase().includes(query),
      )
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((reservation) => reservation.reservation_date === selectedDate)
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((reservation) => reservation.status === selectedStatus)
    }

    setFilteredReservations(filtered)
  }, [reservations, searchQuery, selectedDate, selectedStatus])

  // Handle status change
  const handleStatusChange = async () => {
    if (!reservationToUpdate || !newStatus) return

    try {
      await updateTableReservationStatus(reservationToUpdate.id, newStatus)

      // Update local state
      const updatedReservations = reservations.map((reservation) =>
        reservation.id === reservationToUpdate.id ? { ...reservation, status: newStatus } : reservation,
      )

      setReservations(updatedReservations)
      toast({
        title: "Status Updated",
        description: `Reservation status changed to ${newStatus}`,
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update reservation status",
        variant: "destructive",
      })
    } finally {
      setIsStatusDialogOpen(false)
      setReservationToUpdate(null)
    }
  }

  // Handle reservation deletion
  const handleDeleteReservation = async () => {
    if (!reservationToDelete) return

    try {
      await deleteTableReservation(reservationToDelete.id)

      // Update local state
      const updatedReservations = reservations.filter((reservation) => reservation.id !== reservationToDelete.id)

      setReservations(updatedReservations)
      toast({
        title: "Reservation Deleted",
        description: "The reservation has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting reservation:", error)
      toast({
        title: "Deletion Failed",
        description: "Failed to delete the reservation",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setReservationToDelete(null)
    }
  }

  // Handle adding a new reservation
  const handleAddReservation = async () => {
    setIsSubmitting(true)

    try {
      // Extract status from the form data
      const { status, ...formData } = newReservation

      // Create the reservation
      const createdReservation = await createTableReservation(formData)

      // If status is not pending, update it
      if (status !== "pending") {
        await updateTableReservationStatus(createdReservation.id, status as "confirmed" | "cancelled" | "completed")
      }

      // Refresh the reservations list
      await fetchReservations()

      toast({
        title: "Reservation Added",
        description: "The reservation has been added successfully",
      })

      // Reset form and close dialog
      setNewReservation({
        customer_name: "",
        contact_info: "",
        reservation_date: new Date().toISOString().split("T")[0],
        reservation_time: "",
        guests: 2,
        special_requests: "",
        status: "pending",
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding reservation:", error)
      toast({
        title: "Addition Failed",
        description: "Failed to add the reservation",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate time slots from 11:00 to 22:00 with 30-minute intervals
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 11; hour <= 22; hour++) {
      for (const minute of ["00", "30"]) {
        // Skip 15:00-17:00 (restaurant closed)
        if (hour >= 15 && hour < 17) continue
        slots.push(`${hour.toString().padStart(2, "0")}:${minute}`)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPP", { locale: de })
    } catch (error) {
      return dateString
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      case "completed":
        return <Badge className="bg-blue-500">Completed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewReservation((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setNewReservation((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Table Reservations</CardTitle>
            <CardDescription>Manage restaurant table reservations</CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Reservation
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name or contact..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-10 w-40"
                  />
                </div>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Status</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={fetchReservations} title="Refresh">
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tabs for different views */}
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Reservations</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <ReservationsTable
                  reservations={filteredReservations}
                  isLoading={isLoading}
                  formatDate={formatDate}
                  getStatusBadge={getStatusBadge}
                  onStatusChange={(reservation) => {
                    setReservationToUpdate(reservation)
                    setNewStatus(reservation.status === "pending" ? "confirmed" : "pending")
                    setIsStatusDialogOpen(true)
                  }}
                  onDelete={(reservation) => {
                    setReservationToDelete(reservation)
                    setIsDeleteDialogOpen(true)
                  }}
                />
              </TabsContent>

              <TabsContent value="today" className="mt-4">
                <ReservationsTable
                  reservations={filteredReservations.filter(
                    (r) => r.reservation_date === new Date().toISOString().split("T")[0],
                  )}
                  isLoading={isLoading}
                  formatDate={formatDate}
                  getStatusBadge={getStatusBadge}
                  onStatusChange={(reservation) => {
                    setReservationToUpdate(reservation)
                    setNewStatus(reservation.status === "pending" ? "confirmed" : "pending")
                    setIsStatusDialogOpen(true)
                  }}
                  onDelete={(reservation) => {
                    setReservationToDelete(reservation)
                    setIsDeleteDialogOpen(true)
                  }}
                />
              </TabsContent>

              <TabsContent value="upcoming" className="mt-4">
                <ReservationsTable
                  reservations={filteredReservations.filter(
                    (r) => r.reservation_date >= new Date().toISOString().split("T")[0],
                  )}
                  isLoading={isLoading}
                  formatDate={formatDate}
                  getStatusBadge={getStatusBadge}
                  onStatusChange={(reservation) => {
                    setReservationToUpdate(reservation)
                    setNewStatus(reservation.status === "pending" ? "confirmed" : "pending")
                    setIsStatusDialogOpen(true)
                  }}
                  onDelete={(reservation) => {
                    setReservationToDelete(reservation)
                    setIsDeleteDialogOpen(true)
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Add Reservation Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Reservation</DialogTitle>
            <DialogDescription>Create a new table reservation for a customer.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">Customer Name</Label>
                <Input
                  id="customer_name"
                  name="customer_name"
                  value={newReservation.customer_name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_info">Contact Info</Label>
                <Input
                  id="contact_info"
                  name="contact_info"
                  value={newReservation.contact_info}
                  onChange={handleInputChange}
                  placeholder="Email or Phone"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reservation_date">Date</Label>
                <Input
                  id="reservation_date"
                  name="reservation_date"
                  type="date"
                  value={newReservation.reservation_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reservation_time">Time</Label>
                <Select
                  value={newReservation.reservation_time}
                  onValueChange={(value) => handleSelectChange("reservation_time", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Select
                  value={newReservation.guests.toString()}
                  onValueChange={(value) => handleSelectChange("guests", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </SelectItem>
                    ))}
                    <SelectItem value="13">13+ Guests (Large Group)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newReservation.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="special_requests">Special Requests (Optional)</Label>
              <Textarea
                id="special_requests"
                name="special_requests"
                value={newReservation.special_requests || ""}
                onChange={handleInputChange}
                placeholder="Any dietary requirements or special occasions?"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddReservation} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Reservation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Reservation Status</DialogTitle>
            <DialogDescription>
              Change the status for {reservationToUpdate?.customer_name}'s reservation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <Select value={newStatus} onValueChange={(value: any) => setNewStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusChange}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Reservation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {reservationToDelete?.customer_name}'s reservation? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteReservation}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Reservations Table Component
function ReservationsTable({
  reservations,
  isLoading,
  formatDate,
  getStatusBadge,
  onStatusChange,
  onDelete,
}: {
  reservations: TableReservation[]
  isLoading: boolean
  formatDate: (date: string) => string
  getStatusBadge: (status: string) => JSX.Element
  onStatusChange: (reservation: TableReservation) => void
  onDelete: (reservation: TableReservation) => void
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (reservations.length === 0) {
    return <div className="text-center py-8 text-gray-500">No reservations found matching your criteria.</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Guests</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell className="font-medium">{reservation.customer_name}</TableCell>
              <TableCell>{reservation.contact_info}</TableCell>
              <TableCell>{formatDate(reservation.reservation_date)}</TableCell>
              <TableCell>{reservation.reservation_time}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {reservation.guests}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(reservation.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onStatusChange(reservation)}>
                      <Clock className="mr-2 h-4 w-4" />
                      Change Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(reservation)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

