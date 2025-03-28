"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { getFitnessCourses, type FitnessCourse } from "@/actions/fitness-courses"
import { registerForCourse } from "@/actions/fitness-course-registrations"

export function CourseRegistrationForm() {
  const searchParams = useSearchParams()
  const preselectedCourseId = searchParams.get("courseId")

  const [courses, setCourses] = useState<FitnessCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    courseId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [selectedCourse, setSelectedCourse] = useState<FitnessCourse | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      try {
        const coursesData = await getFitnessCourses()
        setCourses(coursesData)

        // If there's a preselected course ID from URL params
        if (preselectedCourseId) {
          setFormData((prev) => ({ ...prev, courseId: preselectedCourseId }))
          const course = coursesData.find((c) => c.id === preselectedCourseId)
          if (course) {
            setSelectedCourse(course)
          }
        }
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
  }, [preselectedCourseId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCourseChange = (courseId: string) => {
    setFormData((prev) => ({ ...prev, courseId }))
    const course = courses.find((c) => c.id === courseId)
    setSelectedCourse(course || null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.courseId) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie einen Kurs aus",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const result = await registerForCourse({
        course_id: formData.courseId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      })

      if (result.success) {
        toast({
          title: "Anmeldung erfolgreich",
          description: "Sie haben sich erfolgreich für den Kurs angemeldet",
        })

        // Reset form
        setFormData({
          courseId: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        })
        setSelectedCourse(null)
      } else {
        toast({
          title: "Fehler",
          description: result.error || "Bei der Anmeldung ist ein Fehler aufgetreten",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error registering for course:", error)
      toast({
        title: "Fehler",
        description: "Bei der Anmeldung ist ein Fehler aufgetreten",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full" id="course-registration">
      <h2 className="text-3xl font-bold mb-6">Kursanmeldung</h2>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Für einen Kurs anmelden</CardTitle>
          <CardDescription>
            Füllen Sie das Formular aus, um sich für einen unserer Fitness-Kurse anzumelden.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="courseId">Kurs auswählen</Label>
              <Select value={formData.courseId} onValueChange={handleCourseChange} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie einen Kurs" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title} ({course.day_of_week}, {course.start_time.substring(0, 5)} -{" "}
                      {course.end_time.substring(0, 5)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCourse && (
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium">{selectedCourse.title}</p>
                <p className="text-sm text-gray-600">{selectedCourse.description}</p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Trainer:</span> {selectedCourse.instructor}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Zeit:</span> {selectedCourse.day_of_week},{" "}
                  {selectedCourse.start_time.substring(0, 5)} - {selectedCourse.end_time.substring(0, 5)} Uhr
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Vorname</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nachname</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={submitting || loading}>
              {submitting ? "Wird angemeldet..." : "Jetzt anmelden"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

