"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface BookingConfirmationProps {
  bookingId: string
  roomName: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  onClose: () => void
}

export function BookingConfirmation({
  bookingId,
  roomName,
  checkIn,
  checkOut,
  guests,
  totalPrice,
  onClose,
}: BookingConfirmationProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle>Booking Confirmed!</CardTitle>
        <CardDescription>Your reservation has been successfully processed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-b pb-4">
          <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
          <p className="font-medium">{bookingId}</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">Room</p>
            <p className="font-medium">{roomName}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">Check-in</p>
            <p className="font-medium">{checkIn}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">Check-out</p>
            <p className="font-medium">{checkOut}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">Guests</p>
            <p className="font-medium">{guests}</p>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <p className="font-medium">Total</p>
            <p className="font-medium">€{totalPrice}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button className="w-full" onClick={onClose}>
          Close
        </Button>
        <Link href="/rooms" className="w-full">
          <Button variant="outline" className="w-full">
            Browse More Rooms
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

