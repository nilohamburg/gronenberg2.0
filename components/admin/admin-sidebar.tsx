"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Bed, UtensilsCrossed, Waves, Users, Settings, Calendar, MessageSquare, Dumbbell } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  // Update the navItems array to include the fitness section
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { href: "/admin/houses", label: "Houses", icon: <Bed className="h-5 w-5" /> },
    { href: "/admin/restaurants", label: "Restaurants", icon: <UtensilsCrossed className="h-5 w-5" /> },
    { href: "/admin/table-reservations", label: "Table Reservations", icon: <UtensilsCrossed className="h-5 w-5" /> },
    { href: "/admin/spa", label: "Spa", icon: <Waves className="h-5 w-5" /> },
    { href: "/admin/fitness", label: "Fitness", icon: <Dumbbell className="h-5 w-5" /> },
    { href: "/admin/events", label: "Events", icon: <Calendar className="h-5 w-5" /> },
    { href: "/admin/bookings", label: "Bookings", icon: <Calendar className="h-5 w-5" /> },
    { href: "/admin/users", label: "Users", icon: <Users className="h-5 w-5" /> },
    { href: "/admin/messages", label: "Messages", icon: <MessageSquare className="h-5 w-5" /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <aside className="hidden md:block w-64 min-h-screen bg-white border-r border-gray-200 pt-16">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href))
                ? "bg-primary text-white"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

