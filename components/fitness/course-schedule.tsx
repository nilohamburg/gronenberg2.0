"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { getFitnessCourses, type FitnessCourse } from "@/actions/fitness-courses"

// Days of the week in German with abbreviations
const DAYS = [
  { full: "Montag", abbr: "Mo" },
  { full: "Dienstag", abbr: "Di" },
  { full: "Mittwoch", abbr: "Mi" },
  { full: "Donnerstag", abbr: "Do" },
  { full: "Freitag", abbr: "Fr" },
  { full: "Samstag", abbr: "Sa" },
  { full: "Sonntag", abbr: "So" },
]

export function CourseSchedule() {
  const [courses, setCourses] = useState<FitnessCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [coursesByDay, setCoursesByDay] = useState<Record<string, FitnessCourse[]>>({})
  const router = useRouter()

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      try {
        // Fetch real courses from the database
        const coursesData = await getFitnessCourses()
        setCourses(coursesData)

        // Group courses by day
        const grouped = coursesData.reduce(
          (acc, course) => {
            const day = course.day_of_week
            if (!acc[day]) {
              acc[day] = []
            }
            acc[day].push(course)
            return acc
          },
          {} as Record<string, FitnessCourse[]>,
        )

        setCoursesByDay(grouped)
      } catch (error) {
        console.error("Error fetching courses:", error)
        toast({
          title: "Fehler",
          description: "Kurse konnten nicht geladen werden",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const handleRegister = (courseId: string) => {
    router.push(`/fitness?courseId=${courseId}#course-registration`)
  }

  return (
    <div className="w-full" id="course-schedule">
      <h2 className="text-3xl font-bold mb-6">Kursplan</h2>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-600 mb-2">Keine Kurse verfügbar</h3>
          <p className="text-gray-500">
            Derzeit sind keine Fitness-Kurse geplant. Bitte schauen Sie später wieder vorbei.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Calendar header with days of the week */}
          <div className="grid grid-cols-7 bg-gray-100 rounded-t-lg">
            {DAYS.map((day) => (
              <div key={day.abbr} className="p-4 text-center font-medium">
                {day.abbr}
              </div>
            ))}
          </div>

          {/* Calendar body */}
          <div className="grid grid-cols-7 border rounded-b-lg min-h-[500px]">
            {DAYS.map((day) => {
              const dayCourses = coursesByDay[day.full] || []

              return (
                <div key={day.abbr} className="border-r last:border-r-0 p-2">
                  {dayCourses.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">Keine Kurse</div>
                  ) : (
                    <div className="space-y-4">
                      {dayCourses.map((course) => (
                        <Card key={course.id} className="p-3 hover:shadow-md transition-shadow">
                          <div className="mb-2">
                            <h3 className="font-semibold">{course.title}</h3>
                            <div className="flex items-center text-gray-600 text-sm">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>
                                {course.start_time.substring(0, 5)} - {course.end_time.substring(0, 5)} Uhr
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{course.description}</p>

                          <div className="flex flex-col space-y-2">
                            <div className="text-xs text-gray-500">
                              <span className="font-medium">Trainer:</span> {course.instructor}
                              {course.repetition_type && (
                                <span className="ml-2">
                                  <span className="inline-block transform rotate-90">↻</span>
                                  {course.repetition_type === "weekly" ? "Wöchentlich" : "Monatlich"}
                                </span>
                              )}
                            </div>

                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => handleRegister(course.id)}
                            >
                              Anmelden
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

