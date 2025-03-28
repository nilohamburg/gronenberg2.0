"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { toast } from "@/components/ui/use-toast"
import { getFitnessCourses, type FitnessCourse } from "@/actions/fitness-courses"
import { getFitnessCourseRegistrations } from "@/actions/fitness-course-registrations"

// Colors for the charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

const DAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]

export function FitnessReporting() {
  const [courses, setCourses] = useState<FitnessCourse[]>([])
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [courseAttendanceData, setCourseAttendanceData] = useState<any[]>([])
  const [dayDistributionData, setDayDistributionData] = useState<any[]>([])
  const [statusDistributionData, setStatusDistributionData] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [coursesData, registrationsData] = await Promise.all([getFitnessCourses(), getFitnessCourseRegistrations()])

      setCourses(coursesData)
      setRegistrations(registrationsData)

      // Process data for charts
      processChartData(coursesData, registrationsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load reporting data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const processChartData = (courses: FitnessCourse[], registrations: any[]) => {
    // Course attendance data
    const courseMap = new Map<string, { title: string; count: number }>()

    courses.forEach((course) => {
      courseMap.set(course.id, { title: course.title, count: 0 })
    })

    registrations.forEach((reg) => {
      if (reg.status !== "cancelled" && courseMap.has(reg.course_id)) {
        const course = courseMap.get(reg.course_id)!
        course.count++
        courseMap.set(reg.course_id, course)
      }
    })

    const attendanceData = Array.from(courseMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Top 10 courses

    setCourseAttendanceData(attendanceData)

    // Day distribution data
    const dayCount = new Map<string, number>()

    DAYS.forEach((day) => {
      dayCount.set(day, 0)
    })

    courses.forEach((course) => {
      const day = course.day_of_week
      dayCount.set(day, (dayCount.get(day) || 0) + 1)
    })

    const dayData = Array.from(dayCount.entries()).map(([name, value]) => ({ name, value }))
    setDayDistributionData(dayData)

    // Status distribution data
    const statusCount = new Map<string, number>()

    registrations.forEach((reg) => {
      const status = reg.status
      statusCount.set(status, (statusCount.get(status) || 0) + 1)
    })

    const statusLabels: Record<string, string> = {
      confirmed: "Bestätigt",
      cancelled: "Storniert",
      attended: "Teilgenommen",
    }

    const statusData = Array.from(statusCount.entries()).map(([status, value]) => ({
      name: statusLabels[status] || status,
      value,
    }))

    setStatusDistributionData(statusData)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Fitness Berichte</h2>
        <Button onClick={fetchData} variant="outline">
          Aktualisieren
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Lädt...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Kursbeliebtheit</CardTitle>
              <CardDescription>Anzahl der Anmeldungen pro Kurs</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={courseAttendanceData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="title" tick={{ fontSize: 12 }} width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Anmeldungen" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verteilung nach Wochentagen</CardTitle>
              <CardDescription>Anzahl der Kurse pro Wochentag</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dayDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dayDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Anmeldungsstatus</CardTitle>
              <CardDescription>Verteilung der Anmeldungen nach Status</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Zusammenfassung</CardTitle>
              <CardDescription>Übersicht der Fitness-Aktivitäten</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{courses.length}</div>
                    <div className="text-sm text-blue-800">Aktive Kurse</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {registrations.filter((r) => r.status !== "cancelled").length}
                    </div>
                    <div className="text-sm text-green-800">Aktive Anmeldungen</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">
                      {registrations.filter((r) => r.status === "attended").length}
                    </div>
                    <div className="text-sm text-purple-800">Teilnahmen</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-red-600">
                      {registrations.filter((r) => r.status === "cancelled").length}
                    </div>
                    <div className="text-sm text-red-800">Stornierungen</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

