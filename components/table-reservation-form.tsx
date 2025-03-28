"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createTableReservation, type TableReservationFormData } from "@/actions/table-reservations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { CalendarIcon, Clock, Users } from "lucide-react"

export function TableReservationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<TableReservationFormData>({
    customer_name: "",
    contact_info: "",
    reservation_date: "",
    reservation_time: "",
    guests: 2,
    special_requests: "",
  })

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGuestsChange = (value: string) => {
    setFormData((prev) => ({ ...prev, guests: Number.parseInt(value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createTableReservation(formData)
      toast({
        title: "Reservation Submitted",
        description:
          "Your table reservation has been submitted successfully. We will contact you to confirm your reservation.",
        variant: "default",
      })

      // Reset form
      setFormData({
        customer_name: "",
        contact_info: "",
        reservation_date: "",
        reservation_time: "",
        guests: 2,
        special_requests: "",
      })

      // Redirect back to restaurant page
      router.push("/dining/muhle-restaurant")
    } catch (error) {
      console.error("Error submitting reservation:", error)
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your reservation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split("T")[0]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Reserve a Table</CardTitle>
        <CardDescription>Fill out the form below to request a table reservation at Mühle Restaurant.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Your Name</Label>
              <Input
                id="customer_name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_info">Email or Phone</Label>
              <Input
                id="contact_info"
                name="contact_info"
                value={formData.contact_info}
                onChange={handleChange}
                placeholder="email@example.com or +49123456789"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="reservation_date">Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="reservation_date"
                  name="reservation_date"
                  type="date"
                  value={formData.reservation_date}
                  onChange={handleChange}
                  min={today}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reservation_time">Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
                <Select
                  value={formData.reservation_time}
                  onValueChange={(value) => handleSelectChange("reservation_time", value)}
                >
                  <SelectTrigger className="pl-10">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Number of Guests</Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
              <Select value={formData.guests.toString()} onValueChange={handleGuestsChange}>
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select number of guests" />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="special_requests">Special Requests (Optional)</Label>
            <Textarea
              id="special_requests"
              name="special_requests"
              value={formData.special_requests || ""}
              onChange={handleChange}
              placeholder="Any dietary requirements or special occasions?"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/dining/muhle-restaurant")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Reservation"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

