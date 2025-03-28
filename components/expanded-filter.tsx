"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExpandedFilterProps {
  checkIn: Date
  checkOut: Date
  guests: number
  houses: number
  withPets: boolean
  onCheckInChange: (date: Date | undefined) => void
  onCheckOutChange: (date: Date | undefined) => void
  onGuestsChange: (guests: number) => void
  onHousesChange: (houses: number) => void
  onWithPetsChange: (withPets: boolean) => void
  onSearch: () => void
  className?: string
}

export function ExpandedFilter({
  checkIn,
  checkOut,
  guests,
  houses,
  withPets,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  onHousesChange,
  onWithPetsChange,
  onSearch,
  className,
}: ExpandedFilterProps) {
  const [checkInOpen, setCheckInOpen] = useState(false)
  const [checkOutOpen, setCheckOutOpen] = useState(false)

  // Local state to prevent direct binding to props
  const [localGuests, setLocalGuests] = useState(guests)
  const [localHouses, setLocalHouses] = useState(houses)
  const [localWithPets, setLocalWithPets] = useState(withPets)

  // Refs to track changes
  const isInitialMount = useRef(true)
  const isUpdating = useRef(false)

  // Update local state when props change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (isUpdating.current) {
      isUpdating.current = false
      return
    }

    setLocalGuests(guests)
    setLocalHouses(houses)
    setLocalWithPets(withPets)
  }, [guests, houses, withPets])

  // Format dates manually to match German format
  const formatGermanDate = (date: Date) => {
    const dayNames = ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."]
    const dayOfWeek = dayNames[date.getDay()]
    const day = date.getDate()
    const month = date.toLocaleString("default", { month: "short" })
    const year = date.getFullYear()
    return `${dayOfWeek}, ${day}.${month} ${year}`
  }

  // Handle local state changes
  const handleGuestsChange = (change: number) => {
    const newValue = Math.max(1, localGuests + change)
    setLocalGuests(newValue)
    isUpdating.current = true
    onGuestsChange(newValue)
  }

  const handleHousesChange = (change: number) => {
    const newValue = Math.max(1, localHouses + change)
    setLocalHouses(newValue)
    isUpdating.current = true
    onHousesChange(newValue)
  }

  const handleWithPetsChange = (value: boolean) => {
    setLocalWithPets(value)
    isUpdating.current = true
    onWithPetsChange(value)
  }

  const handleSearch = () => {
    onSearch()
  }

  return (
    <div className={cn("bg-[#14385a] text-white p-4 rounded-lg", className)}>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Check-in Date */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Check-in-Datum</label>
          <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-white text-black hover:bg-gray-100"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatGermanDate(checkIn)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={(date) => {
                  onCheckInChange(date)
                  setCheckInOpen(false)
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out Date */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Check-out-Datum</label>
          <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-white text-black hover:bg-gray-100"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatGermanDate(checkOut)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={(date) => {
                  onCheckOutChange(date)
                  setCheckOutOpen(false)
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Reisende</label>
          <div className="bg-white text-black p-2 rounded-md flex justify-center items-center">
            <button
              className="w-8 h-8 flex items-center justify-center text-xl"
              onClick={() => handleGuestsChange(-1)}
              type="button"
            >
              -
            </button>
            <span className="mx-4 font-medium">{localGuests}</span>
            <button
              className="w-8 h-8 flex items-center justify-center text-xl"
              onClick={() => handleGuestsChange(1)}
              type="button"
            >
              +
            </button>
          </div>
        </div>

        {/* Houses */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Häuser</label>
          <div className="bg-white text-black p-2 rounded-md flex justify-center items-center">
            <button
              className="w-8 h-8 flex items-center justify-center text-xl"
              onClick={() => handleHousesChange(-1)}
              type="button"
            >
              -
            </button>
            <span className="mx-4 font-medium">{localHouses}</span>
            <button
              className="w-8 h-8 flex items-center justify-center text-xl"
              onClick={() => handleHousesChange(1)}
              type="button"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Pets */}
      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-1">Reisen Sie mit Haustier?</label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={localWithPets ? "default" : "outline"}
            className={cn(
              "w-full",
              localWithPets ? "bg-gray-300 text-black hover:bg-gray-400" : "bg-white text-black hover:bg-gray-100",
            )}
            onClick={() => handleWithPetsChange(true)}
            type="button"
          >
            Ja
          </Button>
          <Button
            variant={!localWithPets ? "default" : "outline"}
            className={cn(
              "w-full",
              !localWithPets ? "bg-gray-300 text-black hover:bg-gray-400" : "bg-white text-black hover:bg-gray-100",
            )}
            onClick={() => handleWithPetsChange(false)}
            type="button"
          >
            Nein
          </Button>
        </div>
      </div>

      {/* Search Button */}
      <Button className="w-full bg-white text-black hover:bg-gray-100" onClick={handleSearch} type="button">
        Suche
      </Button>
    </div>
  )
}

