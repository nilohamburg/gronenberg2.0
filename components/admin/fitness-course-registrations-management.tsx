"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import {
  getFitnessCourseRegistrations,
  updateFitnessCourseRegistrationStatus,
  deleteFitnessCourseRegistration,
} from "@/actions/fitness-course-registrations"
import { getFitnessCourses } from "@/actions/fitness-courses"

type RegistrationWithCourse = any // We'll use any for simplicity, but in a real app you'd define a proper type

export function FitnessCourseRegistrationsManagement() {
  const [registrations, setRegistrations] = useState<RegistrationWithCourse[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationWithCourse | null>(null)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<"confirmed" | "cancelled" | "attended">("confirmed")
  const [filterCourseId, setFilterCourseId] = useState<string | "all">("all")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [registrationsData, coursesData] = await Promise.all([getFitnessCourseRegistrations(), getFitnessCourses()])

      setRegistrations(registrationsData)
      setCourses(coursesData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load registration data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangeStatus = (registration: RegistrationWithCourse) => {
    setSelectedRegistration(registration)
    setNewStatus(registration.status)
    setIsStatusDialogOpen(true)
  }

  const handleSaveStatus = async () => {
    if (!selectedRegistration) return

    try {
      await updateFitnessCourseRegistrationStatus(selectedRegistration.id, newStatus)

      toast({
        title: "Success",
        description: "Registration status updated successfully",
      })

      fetchData()
      setIsStatusDialogOpen(false)
    } catch (error) {
      console.error("Error updating registration status:", error)
      toast({
        title: "Error",
        description: "Failed to update registration status",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRegistration = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return

    try {
      await deleteFitnessCourseRegistration(id)

      toast({
        title: "Success",
        description: "Registration deleted successfully",
      })

      fetchData()
    } catch (error) {
      console.error("Error deleting registration:", error)
      toast({
        title: "Error",
        description: "Failed to delete registration",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Bestätigt</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Storniert</Badge>
      case "attended":
        return <Badge className="bg-blue-500">Teilgenommen</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filteredRegistrations =
    filterCourseId === "all" ? registrations : registrations.filter((reg) => reg.course_id === filterCourseId)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kursanmeldungen verwalten</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Filtern nach Kurs:</span>
          <Select value={filterCourseId} onValueChange={(value) => setFilterCourseId(value)}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Alle Kurse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Kurse</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title} ({course.day_of_week}, {course.start_time.substring(0, 5)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={fetchData} variant="outline" size="sm">
            Aktualisieren
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kursanmeldungen</CardTitle>
          <CardDescription>Verwalten Sie die Anmeldungen für Fitnesskurse</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kurs</TableHead>
                <TableHead>Kunde</TableHead>
                <TableHead>Kontakt</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Lädt...
                  </TableCell>
                </TableRow>
              ) : filteredRegistrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Keine Anmeldungen gefunden
                  </TableCell>
                </TableRow>
              ) : (
                filteredRegistrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell>
                      <div className="font-medium">{registration.fitness_courses?.title}</div>
                      <div className="text-sm text-gray-500">
                        {registration.fitness_courses?.day_of_week},{" "}
                        {registration.fitness_courses?.start_time.substring(0, 5)} -{" "}
                        {registration.fitness_courses?.end_time.substring(0, 5)}
                      </div>
                    </TableCell>
                    <TableCell>{registration.customer_name}</TableCell>
                    <TableCell>
                      <div>{registration.customer_email}</div>
                      {registration.customer_phone && (
                        <div className="text-sm text-gray-500">{registration.customer_phone}</div>
                      )}
                    </TableCell>
                    <TableCell>{new Date(registration.created_at).toLocaleDateString("de-DE")}</TableCell>
                    <TableCell>{getStatusBadge(registration.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleChangeStatus(registration)}>
                          Status ändern
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteRegistration(registration.id)}
                        >
                          Löschen
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Change Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Status ändern</DialogTitle>
            <DialogDescription>
              Ändern Sie den Status der Anmeldung für {selectedRegistration?.customer_name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={newStatus}
                onValueChange={(value: "confirmed" | "cancelled" | "attended") => setNewStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Bestätigt</SelectItem>
                  <SelectItem value="cancelled">Storniert</SelectItem>
                  <SelectItem value="attended">Teilgenommen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSaveStatus}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

