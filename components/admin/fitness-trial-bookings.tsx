"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Calendar, Clock, Check, X, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import {
  getFitnessTrialBookings,
  updateFitnessTrialBooking,
  deleteFitnessTrialBooking,
  type FitnessTrialBooking,
} from "@/actions/fitness-trials"

export function FitnessTrialBookingsManagement() {
  const [bookings, setBookings] = useState<FitnessTrialBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<FitnessTrialBooking | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const data = await getFitnessTrialBookings()
      setBookings(data)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast({
        title: "Fehler",
        description: "Beim Abrufen der Probetrainings ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleStatusChange = async (id: string, status: "pending" | "confirmed" | "cancelled") => {
    try {
      await updateFitnessTrialBooking(id, { status })
      setBookings(bookings.map((booking) => (booking.id === id ? { ...booking, status } : booking)))
      toast({
        title: "Status aktualisiert",
        description: `Der Status wurde erfolgreich auf "${status}" geändert.`,
      })
    } catch (error) {
      console.error("Error updating booking status:", error)
      toast({
        title: "Fehler",
        description: "Beim Aktualisieren des Status ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!selectedBooking) return

    try {
      await deleteFitnessTrialBooking(selectedBooking.id)
      setBookings(bookings.filter((booking) => booking.id !== selectedBooking.id))
      setIsDeleteDialogOpen(false)
      setSelectedBooking(null)
      toast({
        title: "Probetraining gelöscht",
        description: "Das Probetraining wurde erfolgreich gelöscht.",
      })
    } catch (error) {
      console.error("Error deleting booking:", error)
      toast({
        title: "Fehler",
        description: "Beim Löschen des Probetrainings ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Ausstehend
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Bestätigt
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Storniert
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredBookings = activeTab === "all" ? bookings : bookings.filter((booking) => booking.status === activeTab)

  return (
    <div>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="all">Alle</TabsTrigger>
            <TabsTrigger value="pending">Ausstehend</TabsTrigger>
            <TabsTrigger value="confirmed">Bestätigt</TabsTrigger>
            <TabsTrigger value="cancelled">Storniert</TabsTrigger>
          </TabsList>

          <Button onClick={fetchBookings} variant="outline" size="sm">
            Aktualisieren
          </Button>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          {loading ? (
            <div className="text-center py-12">
              <p>Lade Probetrainings...</p>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="grid gap-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold">{booking.name}</h3>
                        <p className="text-sm text-gray-500">
                          {booking.email} | {booking.phone}
                        </p>

                        <div className="flex items-center mt-2">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-700 mr-4">
                            {format(new Date(booking.date), "PPP", { locale: de })}
                          </span>

                          <Clock className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-700">{booking.time.substring(0, 5)} Uhr</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 md:flex-col md:items-end">
                        {getStatusBadge(booking.status)}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(booking.id, "confirmed")}
                              disabled={booking.status === "confirmed"}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Bestätigen
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(booking.id, "cancelled")}
                              disabled={booking.status === "cancelled"}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Stornieren
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedBooking(booking)
                                setIsDeleteDialogOpen(true)
                              }}
                              className="text-red-600"
                            >
                              Löschen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">Keine Probetrainings gefunden</h3>
              <p className="text-gray-500">Es wurden keine Probetrainings mit dem ausgewählten Status gefunden.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Probetraining löschen</DialogTitle>
            <DialogDescription>
              Möchten Sie das Probetraining von {selectedBooking?.name} wirklich löschen? Diese Aktion kann nicht
              rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

