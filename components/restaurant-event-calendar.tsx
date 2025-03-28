"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, List, Grid, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EventReservationModal } from "@/components/event-reservation-modal"
import { getEvents } from "@/actions/events"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  isBefore,
} from "date-fns"
import { de } from "date-fns/locale"

// Define event type
interface RestaurantEvent {
  id: number
  title: string
  description: string
  date: string // ISO string
  time: string
  price?: string
  image?: string
  capacity?: number
  bookedCount?: number
  isFullyBooked?: boolean
}

export function RestaurantEventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"calendar" | "list">("calendar")
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [reservationModalOpen, setReservationModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<RestaurantEvent | null>(null)
  const [events, setEvents] = useState<RestaurantEvent[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch events from the database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        // Get events with booked count and only future events
        const eventsData = await getEvents(true, true)

        // Calculate if events are fully booked directly from the data
        // This avoids making separate API calls for each event
        const eventsWithBookingStatus = eventsData.map((event) => {
          const isFullyBooked = event.capacity ? (event.bookedCount || 0) >= event.capacity : false
          return { ...event, isFullyBooked }
        })

        setEvents(eventsWithBookingStatus)
      } catch (error) {
        console.error("Failed to fetch events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Navigation functions
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
    setSelectedDay(null) // Clear selection when changing month
  }

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
    setSelectedDay(null) // Clear selection when changing month
  }

  // Get days for current month
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get day names in German
  const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]

  // Get events for the current month (for calendar view)
  const eventsInMonth = events.filter((event) => {
    const eventDate = parseISO(event.date)
    return isSameMonth(eventDate, currentDate)
  })

  // Get all upcoming events (for list view)
  const upcomingEvents = [...events]
    .filter((event) => !isBefore(parseISO(event.date), new Date()))
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())

  // Check if a day has events
  const getEventsForDay = (day: Date) => {
    return eventsInMonth.filter((event) => isSameDay(parseISO(event.date), day))
  }

  // Get events for the selected day
  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : []

  // Handle day selection
  const handleDayClick = (day: Date) => {
    setSelectedDay(isSameDay(day, selectedDay) ? null : day)
  }

  // Handle reservation button click
  const handleReservationClick = (event: RestaurantEvent) => {
    setSelectedEvent(event)
    setReservationModalOpen(true)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Veranstaltungen</h2>
        <div className="flex items-center space-x-2">
          <Button variant={view === "calendar" ? "default" : "outline"} size="sm" onClick={() => setView("calendar")}>
            <Grid className="h-4 w-4 mr-2" />
            Kalender
          </Button>
          <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")}>
            <List className="h-4 w-4 mr-2" />
            Liste
          </Button>
        </div>
      </div>

      {view === "calendar" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <Button variant="outline" size="sm" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="text-xl font-medium">{format(currentDate, "MMMM yyyy", { locale: de })}</h3>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Day names */}
                  {weekDays.map((day) => (
                    <div key={day} className="text-center font-medium text-sm py-2">
                      {day}
                    </div>
                  ))}

                  {/* Empty cells for days before the start of month */}
                  {Array.from({ length: monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1 }).map((_, index) => (
                    <div key={`empty-start-${index}`} className="h-24 border border-gray-100 bg-gray-50/50"></div>
                  ))}

                  {/* Days of the month */}
                  {days.map((day) => {
                    const dayEvents = getEventsForDay(day)
                    const hasEvents = dayEvents.length > 0
                    const isSelected = selectedDay ? isSameDay(day, selectedDay) : false
                    const isPastDay = isBefore(day, new Date()) && !isSameDay(day, new Date())

                    return (
                      <div
                        key={day.toString()}
                        className={`h-24 border p-1 overflow-hidden ${
                          isPastDay ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer transition-colors"
                        } ${
                          isToday(day) ? "bg-blue-50" : ""
                        } ${isSelected ? "border-primary border-2" : "border-gray-200"} ${
                          hasEvents && !isPastDay ? "hover:bg-gray-50" : ""
                        }`}
                        onClick={() => !isPastDay && handleDayClick(day)}
                      >
                        <div className="text-right mb-1">
                          <span
                            className={`text-sm inline-block rounded-full w-6 h-6 text-center leading-6 ${
                              isToday(day) ? "bg-primary text-white" : ""
                            } ${isPastDay ? "text-gray-400" : ""}`}
                          >
                            {format(day, "d")}
                          </span>
                        </div>
                        <div className="space-y-1 overflow-y-auto max-h-[calc(100%-24px)]">
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded truncate ${
                                event.isFullyBooked ? "bg-red-100 text-red-800" : "bg-primary/10 text-primary"
                              }`}
                              title={`${event.title}${event.isFullyBooked ? " (Ausgebucht)" : ""}`}
                            >
                              {event.title}
                              {event.isFullyBooked && <span className="ml-1">•</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}

                  {/* Empty cells for days after the end of month */}
                  {Array.from({
                    length: (7 - ((days.length + (monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1)) % 7)) % 7,
                  }).map((_, index) => (
                    <div key={`empty-end-${index}`} className="h-24 border border-gray-100 bg-gray-50/50"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Day Events */}
          <div>
            {selectedDay ? (
              <div>
                <h3 className="text-xl font-medium mb-4">
                  {format(selectedDay, "EEEE, d. MMMM yyyy", { locale: de })}
                </h3>

                {selectedDayEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDayEvents.map((event) => (
                      <Card key={event.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-medium">{event.title}</h4>
                            {event.price && <span className="text-primary font-medium">{event.price}</span>}
                          </div>
                          <div className="text-sm text-gray-500 mb-2">
                            <CalendarIcon className="h-4 w-4 inline mr-1" />
                            {event.time}
                          </div>
                          <p className="text-gray-700 text-sm mb-3">{event.description}</p>

                          {event.isFullyBooked ? (
                            <div className="flex items-center text-red-600 font-medium">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Ausgebucht
                            </div>
                          ) : (
                            <Button size="sm" onClick={() => handleReservationClick(event)}>
                              Reservieren
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500">Keine Veranstaltungen an diesem Tag</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">Wählen Sie einen Tag, um Veranstaltungen anzuzeigen</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium mb-2">Loading events...</h3>
            </div>
          ) : upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {event.image && (
                    <div className="relative h-48 md:h-full">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div className={`p-6 ${event.image ? "md:col-span-2" : "md:col-span-3"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-medium">{event.title}</h3>
                      {event.price && <span className="text-primary font-medium">{event.price}</span>}
                    </div>
                    <div className="flex items-center text-gray-500 mb-4">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>
                        {format(parseISO(event.date), "EEEE, d. MMMM yyyy", { locale: de })} | {event.time}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{event.description}</p>

                    {event.isFullyBooked ? (
                      <div className="inline-flex items-center px-3 py-1 rounded-md bg-red-100 text-red-800">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Ausgebucht
                      </div>
                    ) : (
                      <Button onClick={() => handleReservationClick(event)}>Reservieren</Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium mb-2">Keine Veranstaltungen geplant</h3>
              <p className="text-gray-500">Schauen Sie später wieder vorbei für neue Events.</p>
            </div>
          )}
        </div>
      )}

      {/* Reservation Modal */}
      {selectedEvent && (
        <EventReservationModal
          isOpen={reservationModalOpen}
          onClose={() => setReservationModalOpen(false)}
          eventId={selectedEvent.id}
          eventTitle={selectedEvent.title}
          eventDate={selectedEvent.date}
          eventTime={selectedEvent.time}
        />
      )}
    </div>
  )
}

