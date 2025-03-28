"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from "@/lib/supabase"

export default function SetupDatabase() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const createTables = async () => {
    setIsLoading(true)
    setResults([])
    setError(null)

    try {
      const supabase = createClientComponentClient()
      const result: string[] = []

      // Create users table
      result.push("Creating users table...")
      const { error: usersError } = await supabase.rpc("create_users_table")
      if (usersError) throw new Error(`Failed to create users table: ${usersError.message}`)
      result.push("✅ Users table created successfully")

      // Create houses table
      result.push("Creating houses table...")
      const { error: housesError } = await supabase.rpc("create_houses_table")
      if (housesError) throw new Error(`Failed to create houses table: ${housesError.message}`)
      result.push("✅ Houses table created successfully")

      // Create amenities tables
      result.push("Creating amenities tables...")
      const { error: amenitiesError } = await supabase.rpc("create_amenities_tables")
      if (amenitiesError) throw new Error(`Failed to create amenities tables: ${amenitiesError.message}`)
      result.push("✅ Amenities tables created successfully")

      // Create bookings table
      result.push("Creating bookings table...")
      const { error: bookingsError } = await supabase.rpc("create_bookings_table")
      if (bookingsError) throw new Error(`Failed to create bookings table: ${bookingsError.message}`)
      result.push("✅ Bookings table created successfully")

      // Create menu tables
      result.push("Creating menu tables...")
      const { error: menuError } = await supabase.rpc("create_menu_tables")
      if (menuError) throw new Error(`Failed to create menu tables: ${menuError.message}`)
      result.push("✅ Menu tables created successfully")

      // Create events tables
      result.push("Creating events tables...")
      const { error: eventsError } = await supabase.rpc("create_events_tables")
      if (eventsError) throw new Error(`Failed to create events tables: ${eventsError.message}`)
      result.push("✅ Events tables created successfully")

      // Create table reservations table
      result.push("Creating table reservations table...")
      const { error: tableResError } = await supabase.rpc("create_table_reservations_table")
      if (tableResError) throw new Error(`Failed to create table reservations table: ${tableResError.message}`)
      result.push("✅ Table reservations table created successfully")

      setResults(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Database Setup</CardTitle>
        <CardDescription>Set up the required database tables for the Gronenberger Mühle application</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>
            This utility will create all the necessary tables in your Supabase database. Make sure you have the correct
            environment variables set up before proceeding.
          </p>

          {error && (
            <div className="p-4 bg-red-50 text-red-800 rounded-md">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="font-semibold mb-2">Results:</p>
              <ul className="space-y-1">
                {results.map((result, index) => (
                  <li key={index} className="text-sm">
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={createTables} disabled={isLoading}>
          {isLoading ? "Setting up..." : "Set Up Database Tables"}
        </Button>
      </CardFooter>
    </Card>
  )
}

