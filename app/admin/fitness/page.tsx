import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClientOnly } from "@/components/client-only"
import { FitnessTrialBookingsManagement } from "@/components/admin/fitness-trial-bookings"
import { FitnessCoursesManagement } from "@/components/admin/fitness-courses-management"
import { FitnessMembershipsManagement } from "@/components/admin/fitness-memberships-management"
import { FitnessCourseRegistrationsManagement } from "@/components/admin/fitness-course-registrations-management"
import { FitnessCalendarView } from "@/components/admin/fitness-calendar-view"
import { FitnessReporting } from "@/components/admin/fitness-reporting"

export default function FitnessAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fitness Management</h1>
        <p className="text-muted-foreground mt-2">
          Verwalten Sie Probetrainings, Kurse, Anmeldungen und Mitgliedschaften
        </p>
      </div>

      <Tabs defaultValue="trials" className="space-y-4">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="trials">Probetrainings</TabsTrigger>
          <TabsTrigger value="courses">Kurse</TabsTrigger>
          <TabsTrigger value="registrations">Anmeldungen</TabsTrigger>
          <TabsTrigger value="memberships">Mitgliedschaften</TabsTrigger>
          <TabsTrigger value="calendar">Kalender</TabsTrigger>
          <TabsTrigger value="reporting">Berichte</TabsTrigger>
        </TabsList>

        <TabsContent value="trials" className="space-y-4">
          <ClientOnly>
            <FitnessTrialBookingsManagement />
          </ClientOnly>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <ClientOnly>
            <FitnessCoursesManagement />
          </ClientOnly>
        </TabsContent>

        <TabsContent value="registrations" className="space-y-4">
          <ClientOnly>
            <FitnessCourseRegistrationsManagement />
          </ClientOnly>
        </TabsContent>

        <TabsContent value="memberships" className="space-y-4">
          <ClientOnly>
            <FitnessMembershipsManagement />
          </ClientOnly>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <ClientOnly>
            <FitnessCalendarView />
          </ClientOnly>
        </TabsContent>

        <TabsContent value="reporting" className="space-y-4">
          <ClientOnly>
            <FitnessReporting />
          </ClientOnly>
        </TabsContent>
      </Tabs>
    </div>
  )
}

