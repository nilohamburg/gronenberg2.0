"use client"

import type React from "react"
import { useState, useEffect } from "react"

import { AdminAuthProvider } from "@/hooks/use-admin-auth"
import { HousesProvider } from "@/hooks/use-houses"
import { BookingProvider } from "@/contexts/booking-context"
import { BookingAdminProvider } from "@/contexts/booking-admin-context"
import { UsersProvider } from "@/contexts/users-context"

export function Providers({ children }: { children: React.ReactNode }) {
  // Use client-side only rendering to prevent context conflicts
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    // Return a placeholder or loading state
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AdminAuthProvider>
      <HousesProvider>
        <BookingProvider>
          <BookingAdminProvider>
            <UsersProvider>{children}</UsersProvider>
          </BookingAdminProvider>
        </BookingProvider>
      </HousesProvider>
    </AdminAuthProvider>
  )
}

