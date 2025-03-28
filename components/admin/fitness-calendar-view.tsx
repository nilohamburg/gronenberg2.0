"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { getFitnessCourses, type FitnessCourse } from "@/actions/fitness-courses"
import { getCourseRegistrationCount } from "@/actions/fitness-course-registrations"

// Days of the week in German
const DAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]

// Map day names to indices
const DAY_INDICES: Record<string, number> = {
  Montag: 0,
  Dienstag: 1,
  Mittwoch: 2,
  Donnerstag: 3,
  Freitag: 4,
  Samstag: 5,
  Sonntag: 6,
}

// Time slots for the calendar
const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
]

export function FitnessCalendarView() {
  const [courses, setCourses] = useState<FitnessCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [registrationCounts, setRegistrationCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const coursesData = await getFitnessCourses()
      setCourses(coursesData)

      // Fetch registration counts for each course
      const counts: Record<string, number> = {}
      for (const course of coursesData) {
        counts[course.id] = await getCourseRegistrationCount(course.id)
      }
      setRegistrationCounts(counts)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load course data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Get courses for a specific day and time slot
  const getCoursesForSlot = (day: string, timeSlot: string) => {
    return courses.filter((course) => {
      const courseDay = course.day_of_week
      const courseStartTime = course.start_time.substring(0, 5)
      const courseEndTime = course.end_time.substring(0, 5)

      // Check if the course is on this day
      if (courseDay !== day) return false

      // Check if the course overlaps with this time slot
      const slotTime = timeSlot
      return courseStartTime <= slotTime && courseEndTime > slotTime
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kurskalender</h2>
        <Button onClick={fetchData} variant="outline">
          Aktualisieren
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wochenübersicht</CardTitle>
          <CardDescription>Kalenderansicht aller Fitnesskurse</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Lädt...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 bg-gray-100 w-20"></th>
                    {DAYS.map((day) => (
                      <th key={day} className="border p-2 bg-gray-100">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map((timeSlot) => (
                    <tr key={timeSlot}>
                      <td className="border p-2 text-center font-medium bg-gray-50">{timeSlot}</td>
                      {DAYS.map((day) => {
                        const coursesInSlot = getCoursesForSlot(day, timeSlot)
                        return (
                          <td key={`${day}-${timeSlot}`} className="border p-1 h-16 align-top">
                            {coursesInSlot.map((course) => {
                              const count = registrationCounts[course.id] || 0
                              const isFull = count >= course.max_participants
                              const startTime = course.start_time.substring(0, 5)
                              const endTime = course.end_time.substring(0, 5)

                              // Only show the course in its start time slot
                              if (startTime !== timeSlot) return null

                              return (
                                <div
                                  key={course.id}
                                  className={`p-1 rounded text-xs mb-1 ${
                                    isFull ? "bg-red-100 border-red-300" : "bg-blue-100 border-blue-300"
                                  } border`}
                                >
                                  <div className="font-medium">{course.title}</div>
                                  <div>
                                    {startTime} - {endTime}
                                  </div>
                                  <div className={isFull ? "text-red-600" : "text-green-600"}>
                                    {count}/{course.max_participants} Teilnehmer
                                  </div>
                                </div>
                              )
                            })}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

