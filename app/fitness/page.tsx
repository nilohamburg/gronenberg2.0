import { ClientOnly } from "@/components/client-only"
import { FitnessPageClient } from "@/components/fitness/fitness-page-client"

export default function FitnessPage() {
  return (
    <ClientOnly>
      <FitnessPageClient />
    </ClientOnly>
  )
}

