"use client"

import { useEffect, useState } from "react"
import { FitnessHero } from "@/components/fitness/fitness-hero"
import { FitnessHighlights } from "@/components/fitness/fitness-highlights"
import { CourseSchedule } from "@/components/fitness/course-schedule"
import { MembershipPlans } from "@/components/fitness/membership-plans"
import { ErrorBoundary } from "@/components/error-boundary"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FitnessOpeningHours } from "@/components/fitness/fitness-opening-hours"

export function FitnessPageClient() {
  const [courseId, setCourseId] = useState<string | null>(null)

  useEffect(() => {
    // Read courseId from URL if present
    const params = new URLSearchParams(window.location.search)
    const id = params.get("courseId")
    if (id) {
      setCourseId(id)
    }
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <ErrorBoundary fallback={<div className="p-8 text-center">Es gab ein Problem beim Laden dieser Seite.</div>}>
          <FitnessHero />
        </ErrorBoundary>
        <ErrorBoundary
          fallback={<div className="p-8 text-center">Es gab ein Problem beim Laden der Öffnungszeiten.</div>}
        >
          <FitnessOpeningHours />
        </ErrorBoundary>
        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto">
            <ErrorBoundary
              fallback={<div className="p-8 text-center">Es gab ein Problem beim Laden der Highlights.</div>}
            >
              <FitnessHighlights />
            </ErrorBoundary>
          </div>
        </section>
        <section className="py-12 px-4 bg-gray-50" id="kursplan">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">Kursplan</h2>
            <ErrorBoundary
              fallback={<div className="p-8 text-center">Es gab ein Problem beim Laden des Kursplans.</div>}
            >
              <CourseSchedule />
            </ErrorBoundary>
          </div>
        </section>
        <section className="py-12 px-4 bg-gray-50" id="mitgliedschaften">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">Mitgliedschaften</h2>
            <ErrorBoundary
              fallback={<div className="p-8 text-center">Es gab ein Problem beim Laden der Mitgliedschaften.</div>}
            >
              <MembershipPlans />
            </ErrorBoundary>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

