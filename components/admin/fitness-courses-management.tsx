"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar, Clock, Edit, Trash2, Plus, Repeat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import {
  getFitnessCourses,
  createFitnessCourse,
  updateFitnessCourse,
  deleteFitnessCourse,
  type FitnessCourse,
} from "@/actions/fitness-courses"

export function FitnessCoursesManagement() {
  const [courses, setCourses] = useState<FitnessCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<FitnessCourse | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    day_of_week: "Montag",
    start_time: "08:00",
    end_time: "09:00",
    max_participants: 10,
    repetition_type: "weekly" as "weekly" | "monthly",
  })

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const data = await getFitnessCourses()
      setCourses(data)
    } catch (error) {
      console.error("Error fetching courses:", error)
      toast({
        title: "Fehler",
        description: "Beim Abrufen der Kurse ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "max_participants" ? Number.parseInt(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleOpenDialog = (course?: FitnessCourse) => {
    if (course) {
      setSelectedCourse(course)
      setFormData({
        title: course.title,
        description: course.description || "",
        instructor: course.instructor,
        day_of_week: course.day_of_week,
        start_time: course.start_time,
        end_time: course.end_time,
        max_participants: course.max_participants,
        repetition_type: course.repetition_type || "weekly",
      })
    } else {
      setSelectedCourse(null)
      setFormData({
        title: "",
        description: "",
        instructor: "",
        day_of_week: "Montag",
        start_time: "08:00",
        end_time: "09:00",
        max_participants: 10,
        repetition_type: "weekly",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (selectedCourse) {
        // Update existing course
        await updateFitnessCourse(selectedCourse.id, formData)
        toast({
          title: "Kurs aktualisiert",
          description: "Der Kurs wurde erfolgreich aktualisiert.",
        })
      } else {
        // Create new course
        await createFitnessCourse(formData)
        toast({
          title: "Kurs erstellt",
          description: "Der Kurs wurde erfolgreich erstellt.",
        })
      }
      setIsDialogOpen(false)
      fetchCourses()
    } catch (error) {
      console.error("Error saving course:", error)
      toast({
        title: "Fehler",
        description: "Beim Speichern des Kurses ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    }
  }

  const handleOpenDeleteDialog = (course: FitnessCourse) => {
    setSelectedCourse(course)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedCourse) return

    try {
      await deleteFitnessCourse(selectedCourse.id)
      setIsDeleteDialogOpen(false)
      toast({
        title: "Kurs gelöscht",
        description: "Der Kurs wurde erfolgreich gelöscht.",
      })
      fetchCourses()
    } catch (error) {
      console.error("Error deleting course:", error)
      toast({
        title: "Fehler",
        description: "Beim Löschen des Kurses ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    }
  }

  const getRepetitionLabel = (type: string) => {
    return type === "weekly" ? "Wöchentlich" : "Monatlich"
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Fitness Kurse</h2>
        <Button onClick={() => handleOpenDialog()} size="sm">
          <Plus className="h-4 w-4 mr-2" /> Neuer Kurs
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p>Lade Kurse...</p>
        </div>
      ) : courses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold">{course.title}</h3>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(course)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDeleteDialog(course)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">Trainer: {course.instructor}</p>
                {course.description && <p className="text-sm mt-2">{course.description}</p>}

                <div className="flex items-center mt-4">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm text-gray-700 mr-4">{course.day_of_week}</span>

                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {course.start_time.substring(0, 5)} - {course.end_time.substring(0, 5)} Uhr
                  </span>
                </div>

                <div className="flex items-center mt-2">
                  <Repeat className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm text-gray-700">{getRepetitionLabel(course.repetition_type)}</span>
                </div>

                <p className="text-sm mt-2">Max. Teilnehmer: {course.max_participants}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">Keine Kurse gefunden</h3>
          <p className="text-gray-500">
            Es wurden noch keine Fitness-Kurse angelegt. Klicken Sie auf "Neuer Kurs", um einen Kurs zu erstellen.
          </p>
        </div>
      )}

      {/* Course Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedCourse ? "Kurs bearbeiten" : "Neuen Kurs erstellen"}</DialogTitle>
            <DialogDescription>
              Füllen Sie die folgenden Felder aus, um einen Fitness-Kurs zu{" "}
              {selectedCourse ? "aktualisieren" : "erstellen"}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Kursname</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="instructor">Trainer</Label>
                <Input
                  id="instructor"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="day_of_week">Wochentag</Label>
                  <Select
                    value={formData.day_of_week}
                    onValueChange={(value) => handleSelectChange("day_of_week", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie einen Tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Montag">Montag</SelectItem>
                      <SelectItem value="Dienstag">Dienstag</SelectItem>
                      <SelectItem value="Mittwoch">Mittwoch</SelectItem>
                      <SelectItem value="Donnerstag">Donnerstag</SelectItem>
                      <SelectItem value="Freitag">Freitag</SelectItem>
                      <SelectItem value="Samstag">Samstag</SelectItem>
                      <SelectItem value="Sonntag">Sonntag</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="max_participants">Max. Teilnehmer</Label>
                  <Input
                    id="max_participants"
                    name="max_participants"
                    type="number"
                    min="1"
                    value={formData.max_participants}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start_time">Startzeit</Label>
                  <Input
                    id="start_time"
                    name="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="end_time">Endzeit</Label>
                  <Input
                    id="end_time"
                    name="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Wiederholung</Label>
                <RadioGroup
                  value={formData.repetition_type}
                  onValueChange={(value) => handleSelectChange("repetition_type", value as "weekly" | "monthly")}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly" className="cursor-pointer">
                      Wöchentlich
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="cursor-pointer">
                      Monatlich
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button type="submit">{selectedCourse ? "Aktualisieren" : "Erstellen"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kurs löschen</DialogTitle>
            <DialogDescription>
              Möchten Sie den Kurs "{selectedCourse?.title}" wirklich löschen? Diese Aktion kann nicht rückgängig
              gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

