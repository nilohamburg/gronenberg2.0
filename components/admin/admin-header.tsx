"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { LogOut, User } from "lucide-react"

export function AdminHeader() {
  const router = useRouter()
  const { isAuthenticated, logout } = useAdminAuth()

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        <Link href="/admin" className="font-playfair text-xl font-bold">
          Gronenberger Mühle Admin
        </Link>

        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Admin</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

