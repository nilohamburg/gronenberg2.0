"use client"
import { Search } from "lucide-react"
import { addDays } from "date-fns"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  initialCheckIn?: Date
  initialCheckOut?: Date
  initialGuests?: number
  onClick?: () => void
  className?: string
}

export function SearchBar({ initialCheckIn, initialCheckOut, initialGuests = 4, onClick, className }: SearchBarProps) {
  // Default to current date + 5 days if no dates provided
  const checkIn = initialCheckIn || new Date()
  const checkOut = initialCheckOut || addDays(checkIn, 5)
  const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

  // Format dates manually to match German format
  const formatDate = (date: Date) => {
    const day = date.getDate()
    const month = date.toLocaleString("default", { month: "short" })
    return `${day}. ${month}`
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg text-left hover:border-primary transition-colors",
        className,
      )}
    >
      <Search className="h-5 w-5 text-gray-500" />
      <span className="text-gray-800">
        {formatDate(checkIn)} - {formatDate(checkOut)}({nights} {nights === 1 ? "Nacht" : "Nächte"}) / {initialGuests}{" "}
        {initialGuests === 1 ? "Erwachsener" : "Erwachsene"}
      </span>
    </button>
  )
}

