"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createEventReservation, isEventFullyBooked } from "@/actions/events"
import { CalendarIcon, Users } from "lucide-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"

interface EventReservationModalProps {
  isOpen: boolean
  onClose: () => void
  eventId: number
  eventTitle: string
  eventDate: string
  eventTime: string
}

export function EventReservationModal({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  eventDate,
  eventTime,
}: EventReservationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    contactInfo: "",
    attendees: "1",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isCheckingCapacity, setIsCheckingCapacity] = useState(true)
  const [isFullyBooked, setIsFullyBooked] = useState(false)

  // Check if the event is fully booked when the modal opens
  useState(() => {
    const checkCapacity = async () => {
      try {
        setIsCheckingCapacity(true)
        const fullyBooked = await isEventFullyBooked(eventId)
        setIsFullyBooked(fullyBooked)
      } catch (error) {
        console.error("Error checking event capacity:", error)
      } finally {
        setIsCheckingCapacity(false)
      }
    }

    if (isOpen) {
      checkCapacity()
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Update the handleSubmit function to properly create event reservations
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error("Bitte geben Sie Ihren Namen ein")
      }
      if (!formData.contactInfo.trim()) {
        throw new Error("Bitte geben Sie Ihre E-Mail oder Telefonnummer ein")
      }
      if (Number.parseInt(formData.attendees) < 1) {
        throw new Error("Bitte geben Sie eine gültige Anzahl an Teilnehmern ein")
      }

      // Check if the event is fully booked again before submitting
      const fullyBooked = await isEventFullyBooked(eventId)
      if (fullyBooked) {
        throw new Error("Diese Veranstaltung ist leider ausgebucht")
      }

      // Submit reservation
      await createEventReservation({
        eventId,
        customerName: formData.name,
        contactInfo: formData.contactInfo,
        attendees: Number.parseInt(formData.attendees),
        notes: formData.notes,
      })

      // Show success message
      setSuccess(true)

      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setFormData({
          name: "",
          contactInfo: "",
          attendees: "1",
          notes: "",
        })
        setSuccess(false)
        onClose()
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reservierung für {eventTitle}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {format(new Date(eventDate), "EEEE, d. MMMM yyyy", { locale: de })} | {eventTime}
          </span>
        </div>

        {isCheckingCapacity ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Verfügbarkeit wird geprüft...</p>
          </div>
        ) : isFullyBooked ? (
          <div className="bg-red-50 text-red-800 p-4 rounded-md">
            <p className="font-medium">Diese Veranstaltung ist leider ausgebucht.</p>
            <p className="text-sm mt-1">Bitte versuchen Sie es bei einer anderen Veranstaltung.</p>
          </div>
        ) : success ? (
          <div className="bg-green-50 text-green-800 p-4 rounded-md">
            <p className="font-medium">Vielen Dank für Ihre Reservierung!</p>
            <p className="text-sm mt-1">Wir werden uns in Kürze mit Ihnen in Verbindung setzen.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">{error}</div>}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ihr vollständiger Name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactInfo">E-Mail oder Telefonnummer *</Label>
                <Input
                  id="contactInfo"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  placeholder="Ihre E-Mail oder Telefonnummer"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="attendees">Anzahl der Personen *</Label>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <select
                    id="attendees"
                    name="attendees"
                    value={formData.attendees}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Person" : "Personen"}
                      </option>
                    ))}
                    <option value="11">Mehr als 10 Personen</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Anmerkungen (optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Besondere Wünsche oder Anmerkungen"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Abbrechen
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Wird gesendet..." : "Reservieren"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

