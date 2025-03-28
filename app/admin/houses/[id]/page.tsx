"use client"

import { useParams, useRouter } from "next/navigation"
import { EditHouseForm } from "@/components/admin/edit-house-form"
import { useEffect } from "react"
import { useAdminAuth } from "@/hooks/use-admin-auth"

export default function EditHousePage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAdminAuth()
  const houseId = Number(params.id)

  // Ensure user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return <EditHouseForm houseId={houseId} />
}

