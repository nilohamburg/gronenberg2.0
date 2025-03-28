"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { Pencil, Plus, Search, Trash, Users, ArrowLeft } from "lucide-react"
import { format, parseISO } from "date-fns"
import { de } from "date-fns/locale"
import {
  getEvents,
  getEventReservations,
  updateReservationStatus,
  deleteReservation,
  deleteEvent,
  createEvent,
  updateEvent,
  type RestaurantEvent,
} from "@/actions/events"

export function EventsManagement() {
  const router = useRouter()
  const { isAuthenticated } = useAdminAuth()
  const [activeTab, setActiveTab] = useState("events")
  const [events, setEvents] = useState<RestaurantEvent[]>([])
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredEvents, setFilteredEvents] = useState<RestaurantEvent[]>([])
  const [filteredReservations, setFilteredReservations] = useState<any[]>([])
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)

  // Event form state
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<RestaurantEvent | null>(null)
  const [eventForm, setEventForm] = useState({
    id: 0,
    title: "",
    description: "",
    date: "",
    time: "",
    price: "",
    image: "",
    capacity: 0,
  })

  // Reservation management state
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isDeleteReservationDialogOpen, setIsDeleteReservationDialogOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null)
  const [newStatus, setNewStatus] = useState<"pending" | "confirmed" | "cancelled">("pending")

  // Load events and reservations
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }

    const loadData = async () => {
      try {
        setLoading(true)
        const eventsData = await getEvents(true) // Include booked count
        const reservationsData = await getEventReservations(selectedEventId || undefined)

        setEvents(eventsData)
        setFilteredEvents(eventsData)
        setReservations(reservationsData)
        setFilteredReservations(reservationsData)
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isAuthenticated, router, selectedEventId])

  // Filter events and reservations based on search query
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()

      // Filter events
      const filteredEvts = events.filter(
        (event) => event.title.toLowerCase().includes(query) || event.description.toLowerCase().includes(query),
      )
      setFilteredEvents(filteredEvts)

      // Filter reservations
      const filteredRes = reservations.filter(
        (res) =>
          res.customerName.toLowerCase().includes(query) ||
          res.contactInfo.toLowerCase().includes(query) ||
          res.eventTitle.toLowerCase().includes(query),
      )
      setFilteredReservations(filteredRes)
    } else {
      setFilteredEvents(events)
      setFilteredReservations(reservations)
    }
  }, [searchQuery, events, reservations])

  // Event handlers
  const handleAddEvent = () => {
    setEventForm({
      id: 0,
      title: "",
      description: "",
      date: "",
      time: "",
      price: "",
      image: "",
      capacity: 0,
    })
    setSelectedEvent(null)
    setIsEventDialogOpen(true)
  }

  const handleEditEvent = (event: RestaurantEvent) => {
    setEventForm({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      price: event.price || "",
      image: event.image || "",
      capacity: event.capacity || 0,
    })
    setSelectedEvent(event)
    setIsEventDialogOpen(true)
  }

  const handleDeleteEvent = (event: RestaurantEvent) => {
    setSelectedEvent(event)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteEvent = async () => {
    if (!selectedEvent) return

    try {
      await deleteEvent(selectedEvent.id)
      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id))
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete event:", error)
    }
  }

  const handleSaveEvent = async () => {
    try {
      if (eventForm.id === 0) {
        // Create new event
        const { id } = await createEvent({
          title: eventForm.title,
          description: eventForm.description,
          date: eventForm.date,
          time: eventForm.time,
          price: eventForm.price,
          image: eventForm.image,
          capacity: eventForm.capacity,
        })

        const newEvent = { ...eventForm, id, bookedCount: 0 }
        setEvents((prev) => [...prev, newEvent])
      } else {
        // Update existing event
        await updateEvent(eventForm as RestaurantEvent)
        setEvents((prev) => prev.map((e) => (e.id === eventForm.id ? { ...eventForm, bookedCount: e.bookedCount } : e)))
      }

      setIsEventDialogOpen(false)
    } catch (error) {
      console.error("Failed to save event:", error)
    }
  }

  // Reservation handlers
  const handleChangeStatus = (reservation: any) => {
    setSelectedReservation(reservation)
    setNewStatus(reservation.status)
    setIsStatusDialogOpen(true)
  }

  const handleDeleteReservation = (reservation: any) => {
    setSelectedReservation(reservation)
    setIsDeleteReservationDialogOpen(true)
  }

  const confirmStatusChange = async () => {
    if (!selectedReservation) return

    try {
      await updateReservationStatus(selectedReservation.id, newStatus)

      // Update local state
      setReservations((prev) => prev.map((r) => (r.id === selectedReservation.id ? { ...r, status: newStatus } : r)))

      // If status changed to/from cancelled, we need to refresh events to update capacity counts
      if (selectedReservation.status === "cancelled" || newStatus === "cancelled") {
        const updatedEvents = await getEvents(true)
        setEvents(updatedEvents)
        setFilteredEvents(updatedEvents)
      }

      setIsStatusDialogOpen(false)
    } catch (error) {
      console.error("Failed to update reservation status:", error)
    }
  }

  const confirmDeleteReservation = async () => {
    if (!selectedReservation) return

    try {
      await deleteReservation(selectedReservation.id)
      setReservations((prev) => prev.filter((r) => r.id !== selectedReservation.id))

      // Refresh events to update capacity counts
      const updatedEvents = await getEvents(true)
      setEvents(updatedEvents)
      setFilteredEvents(updatedEvents)

      setIsDeleteReservationDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete reservation:", error)
    }
  }

  // Handle viewing reservations for a specific event
  const handleViewEventReservations = (eventId: number) => {
    setSelectedEventId(eventId)
    setActiveTab("reservations")
  }

  // Clear event filter and go back to all reservations
  const handleClearEventFilter = () => {
    setSelectedEventId(null)
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events Management</h1>
          <p className="text-muted-foreground">Manage restaurant events and reservations</p>
        </div>
        <Button onClick={handleAddEvent}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Event
        </Button>
      </div>

      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events or reservations..."
          className="pl-8 w-full sm:w-[300px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <TableRow
                        key={event.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleViewEventReservations(event.id)}
                      >
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{format(parseISO(event.date), "dd.MM.yyyy", { locale: de })}</TableCell>
                        <TableCell>{event.time}</TableCell>
                        <TableCell>{event.price || "-"}</TableCell>
                        <TableCell>
                          {event.capacity ? (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span
                                className={`${(event.bookedCount || 0) >= event.capacity ? "text-red-600 font-medium" : ""}`}
                              >
                                {event.bookedCount || 0}/{event.capacity}
                              </span>
                            </div>
                          ) : (
                            "Unlimited"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditEvent(event)
                              }}
                              className="h-8 w-8 p-0"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteEvent(event)
                              }}
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
                        No events found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Reservations Tab */}
        <TabsContent value="reservations" className="space-y-4">
          {selectedEventId && (
            <div className="mb-4">
              <Button variant="outline" size="sm" onClick={handleClearEventFilter} className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to All Reservations
              </Button>
              <h3 className="mt-2 text-lg font-medium">
                {events.find((e) => e.id === selectedEventId)?.title || "Event"} Reservations
              </h3>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.length > 0 ? (
                    filteredReservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{reservation.eventTitle}</div>
                            <div className="text-xs text-muted-foreground">
                              {reservation.eventDate
                                ? format(parseISO(reservation.eventDate), "dd.MM.yyyy", { locale: de })
                                : "No date"}{" "}
                              | {reservation.eventTime || "No time"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{reservation.customerName}</TableCell>
                        <TableCell>{reservation.contactInfo}</TableCell>
                        <TableCell>{reservation.attendees}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(reservation.status)} variant="outline">
                            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleChangeStatus(reservation)}
                              className="h-8 w-8 p-0"
                              title="Change Status"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Change Status</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteReservation(reservation)}
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
                        No reservations found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Event Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{eventForm.id === 0 ? "Add New Event" : "Edit Event"}</DialogTitle>
            <DialogDescription>
              {eventForm.id === 0 ? "Create a new event for the restaurant" : "Update the event details"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                placeholder="Enter event title"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                  placeholder="e.g. 19:00 - 22:00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (optional)</Label>
                <Input
                  id="price"
                  value={eventForm.price}
                  onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })}
                  placeholder="e.g. €45 pro Person"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (optional)</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={eventForm.capacity || ""}
                  onChange={(e) => setEventForm({ ...eventForm, capacity: Number.parseInt(e.target.value) || 0 })}
                  placeholder="Maximum number of attendees"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL (optional)</Label>
              <Input
                id="image"
                value={eventForm.image}
                onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                placeholder="Enter image URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                placeholder="Enter event description"
                rows={4}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEvent}>{eventForm.id === 0 ? "Create Event" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Event Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the event "{selectedEvent?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteEvent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Reservation Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Reservation Status</DialogTitle>
            <DialogDescription>
              Update the status for {selectedReservation?.customerName}'s reservation.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="status" className="mb-2 block">
              Status
            </Label>
            <Select value={newStatus} onValueChange={(value: any) => setNewStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmStatusChange}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Reservation Dialog */}
      <Dialog open={isDeleteReservationDialogOpen} onOpenChange={setIsDeleteReservationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedReservation?.customerName}'s reservation? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteReservationDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteReservation}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

