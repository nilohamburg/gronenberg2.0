import { getCachedData, setCachedData, clearCache } from "@/lib/cache"
import type { RestaurantEvent } from "@/types" // Import RestaurantEvent type
import { getAllEvents } from "@/lib/events" // Import getAllEvents function

// Get all events with caching
export async function getEvents(includeBookedCount = false, futureOnly = false) {
  // Create a cache key based on the function parameters
  const cacheKey = `events:${includeBookedCount}:${futureOnly}`

  // Try to get data from cache first
  const cachedData = getCachedData<RestaurantEvent[]>(cacheKey)
  if (cachedData) {
    return cachedData
  }

  // If not in cache, fetch from Supabase
  try {
    const data = await getAllEvents(includeBookedCount, futureOnly)

    // Cache the result for 5 minutes (default)
    setCachedData(cacheKey, data)

    return data as RestaurantEvent[]
  } catch (error) {
    console.error("Error in getEvents:", error)
    return []
  }
}

// Clear event cache when events are modified
export async function clearEventCache() {
  clearCache("events:")
}

