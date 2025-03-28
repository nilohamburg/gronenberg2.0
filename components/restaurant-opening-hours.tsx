"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface OpeningHoursProps {
  className?: string
}

interface DaySchedule {
  day: string
  hours: string
  germanDay: string
}

export function RestaurantOpeningHours({ className }: OpeningHoursProps) {
  const [currentDay, setCurrentDay] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // Define opening hours for each day
  const schedule: DaySchedule[] = [
    { day: "Monday", germanDay: "Montag", hours: "11:00 - 22:00 Uhr" },
    { day: "Tuesday", germanDay: "Dienstag", hours: "11:00 - 22:00 Uhr" },
    { day: "Wednesday", germanDay: "Mittwoch", hours: "08:00 - 22:00 Uhr" },
    { day: "Thursday", germanDay: "Donnerstag", hours: "11:00 - 22:00 Uhr" },
    { day: "Friday", germanDay: "Freitag", hours: "11:00 - 23:00 Uhr" },
    { day: "Saturday", germanDay: "Samstag", hours: "10:00 - 23:00 Uhr" },
    { day: "Sunday", germanDay: "Sonntag", hours: "10:00 - 22:00 Uhr" },
  ]

  // Parse opening hours to check if restaurant is currently open
  const checkIfOpen = (dayIndex: number, currentTime: Date): boolean => {
    const hours = schedule[dayIndex].hours
    const [openingTime, closingTime] = hours.split(" - ")[0].split(":").map(Number)

    const [closingHour, closingMinute] = hours.split(" - ")[1].split(" ")[0].split(":").map(Number)

    const currentHour = currentTime.getHours()
    const currentMinute = currentTime.getMinutes()

    // Convert to minutes for easier comparison
    const currentTimeInMinutes = currentHour * 60 + currentMinute
    const openingTimeInMinutes = openingTime * 60
    const closingTimeInMinutes = closingHour * 60 + closingMinute

    return currentTimeInMinutes >= openingTimeInMinutes && currentTimeInMinutes < closingTimeInMinutes
  }

  useEffect(() => {
    // Get current day and time
    const now = new Date()
    setCurrentDay(now.getDay() === 0 ? 6 : now.getDay() - 1) // Adjust for 0-indexed array (0 = Sunday in JS)
    setCurrentTime(now)

    // Check if restaurant is open
    setIsOpen(checkIfOpen(now.getDay() === 0 ? 6 : now.getDay() - 1, now))

    // Update time every minute
    const interval = setInterval(() => {
      const updatedTime = new Date()
      setCurrentTime(updatedTime)
      setIsOpen(checkIfOpen(updatedTime.getDay() === 0 ? 6 : updatedTime.getDay() - 1, updatedTime))
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`bg-white rounded-lg shadow-md p-5 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          <h3 className="text-lg font-semibold">Wir haben geöffnet</h3>
        </div>
        {isOpen && (
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Jetzt geöffnet</div>
        )}
      </div>

      <div className="space-y-2">
        {schedule.map((day, index) => (
          <div
            key={index}
            className={`flex justify-between items-center py-2 px-3 rounded ${
              index === currentDay ? "bg-gray-100" : ""
            }`}
          >
            <span className="font-medium">{day.germanDay}</span>
            <span>{day.hours}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

