"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { useHouses } from "@/hooks/use-houses"
import { useBookingAdmin } from "@/contexts/booking-admin-context"
import { useUsers } from "@/contexts/users-context"
import { Bed, UtensilsCrossed, Users, Calendar, ArrowUp, ArrowDown } from "lucide-react"
import { format, isToday, isThisWeek, differenceInDays } from "date-fns"

export function AdminDashboard() {
  const router = useRouter()
  const { isAuthenticated } = useAdminAuth()
  const { houses } = useHouses()
  const { bookings } = useBookingAdmin()
  const { users } = useUsers()

  // Dashboard stats
  const [stats, setStats] = useState({
    totalHouses: 0,
    availableHouses: 0,
    activeBookings: 0,
    bookingsChange: 0,
    restaurantReservations: 0,
    registeredUsers: 0,
    usersChange: 0,
    recentBookings: [],
    occupancyRate: 0,
    occupiedHouses: 0,
    petFriendlyHouses: 0,
    seaViewHouses: 0,
  })

  // Calculate dashboard stats
  useEffect(() => {
    if (houses.length && bookings.length && users.length) {
      // Calculate house stats
      const totalHouses = houses.length
      const petFriendlyHouses = houses.filter((house) => house.dogsAllowed).length
      const seaViewHouses = houses.filter((house) => house.seaView).length

      // Calculate booking stats
      const today = new Date()
      const activeBookings = bookings.filter(
        (booking) =>
          booking.status === "confirmed" &&
          differenceInDays(booking.checkOut, today) >= 0 &&
          differenceInDays(today, booking.checkIn) >= 0,
      ).length

      // Calculate bookings change (new bookings today vs. yesterday)
      const todayBookings = bookings.filter((booking) => isToday(booking.createdAt)).length
      const yesterdayBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.createdAt)
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        return (
          bookingDate.getDate() === yesterday.getDate() &&
          bookingDate.getMonth() === yesterday.getMonth() &&
          bookingDate.getFullYear() === yesterday.getFullYear()
        )
      }).length
      const bookingsChange = todayBookings - yesterdayBookings

      // Calculate restaurant reservations (mock data)
      const restaurantReservations = Math.floor(Math.random() * 10) + 15

      // Calculate user stats
      const registeredUsers = users.length
      const newUsersThisWeek = users.filter((user) => isThisWeek(user.createdAt)).length
      const newUsersLastWeek = users.filter((user) => {
        const userDate = new Date(user.createdAt)
        const lastWeekStart = new Date()
        lastWeekStart.setDate(lastWeekStart.getDate() - 14)
        const lastWeekEnd = new Date()
        lastWeekEnd.setDate(lastWeekEnd.getDate() - 7)
        return userDate >= lastWeekStart && userDate <= lastWeekEnd
      }).length
      const usersChange = newUsersThisWeek - newUsersLastWeek

      // Calculate recent bookings
      const recentBookings = bookings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5)

      // Calculate occupancy
      const occupiedHouses = activeBookings
      const availableHouses = totalHouses - occupiedHouses
      const occupancyRate = Math.round((occupiedHouses / totalHouses) * 100)

      setStats({
        totalHouses,
        availableHouses,
        activeBookings,
        bookingsChange,
        restaurantReservations,
        registeredUsers,
        usersChange,
        recentBookings,
        occupancyRate,
        occupiedHouses,
        petFriendlyHouses,
        seaViewHouses,
      })
    }
  }, [houses, bookings, users])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Gronenberger Mühle admin dashboard.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Houses</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHouses}</div>
            <p className="text-xs text-muted-foreground">{stats.availableHouses} currently available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBookings}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {stats.bookingsChange > 0 ? (
                <>
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{stats.bookingsChange}</span>
                </>
              ) : stats.bookingsChange < 0 ? (
                <>
                  <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats.bookingsChange}</span>
                </>
              ) : (
                <span>No change</span>
              )}
              <span className="ml-1">from yesterday</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Restaurant Reservations</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.restaurantReservations}</div>
            <p className="text-xs text-muted-foreground">For today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.registeredUsers}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {stats.usersChange > 0 ? (
                <>
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{stats.usersChange}</span>
                </>
              ) : stats.usersChange < 0 ? (
                <>
                  <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats.usersChange}</span>
                </>
              ) : (
                <span>No change</span>
              )}
              <span className="ml-1">this week</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest 5 bookings made on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentBookings.length > 0 ? (
                stats.recentBookings.map((booking: any, i) => (
                  <div key={booking.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{booking.guestName}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.roomName} • {differenceInDays(booking.checkOut, booking.checkIn)} nights •{" "}
                        {isToday(booking.createdAt) ? "Today" : format(booking.createdAt, "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="text-sm font-medium">€{booking.totalPrice}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">No recent bookings</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>House Availability</CardTitle>
            <CardDescription>Current occupancy status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${stats.occupancyRate}%` }}></div>
                </div>
                <span className="text-sm font-medium">{stats.occupancyRate}%</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Occupied</p>
                  <p className="text-lg font-medium">{stats.occupiedHouses} Houses</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-lg font-medium">{stats.availableHouses} Houses</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pet-Friendly</p>
                  <p className="text-lg font-medium">{stats.petFriendlyHouses} Houses</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sea View</p>
                  <p className="text-lg font-medium">{stats.seaViewHouses} Houses</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

