"use client"

import * as React from "react"
import { format, addDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DatePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const today = new Date()
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: today,
    to: addDays(today, 7),
  })
  const [isOpen, setIsOpen] = React.useState(false)

  // Handle date selection with more flexibility
  const handleSelect = (selectedDate: DateRange | undefined) => {
    if (!selectedDate) {
      setDate(undefined)
      return
    }

    // If only start date is selected, automatically set end date to start + 7 days
    if (selectedDate.from && !selectedDate.to) {
      setDate({
        from: selectedDate.from,
        to: addDays(selectedDate.from, 7),
      })
      return
    }

    // If both dates are selected, use them as is
    setDate(selectedDate)

    // Only close the popover when both dates are explicitly selected
    if (selectedDate.from && selectedDate.to && selectedDate.to !== selectedDate.from) {
      setIsOpen(false)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal bg-white/90 backdrop-blur-sm",
              !date && "text-muted-foreground",
              "text-gray-500",
            )}
            onClick={() => setIsOpen(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Select your stay dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <h3 className="text-sm font-medium">Select check-in and check-out dates</h3>
            <p className="text-xs text-muted-foreground mt-1">Click once for check-in, twice for check-out</p>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={window.innerWidth < 768 ? 1 : 2}
            disabled={{ before: today }}
            footer={
              <div className="p-3 border-t flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDate({
                      from: today,
                      to: addDays(today, 7),
                    })
                  }}
                >
                  Reset to today
                </Button>
                <Button size="sm" onClick={() => setIsOpen(false)}>
                  Apply
                </Button>
              </div>
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

