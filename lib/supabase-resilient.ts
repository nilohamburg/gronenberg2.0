import { createClient } from "@supabase/supabase-js"

// Maximum number of retry attempts
const MAX_RETRIES = 3

// Base delay in milliseconds (will be multiplied by 2^retryCount)
const BASE_DELAY = 300

/**
 * Creates a Supabase client with retry logic for handling rate limits
 */
export function createResilientClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  const client = createClient(supabaseUrl, supabaseKey)

  // Add retry logic to fetch method
  const originalFetch = client.fetch.bind(client)

  client.fetch = async (url: string, options: any) => {
    let retryCount = 0

    while (true) {
      try {
        const response = await originalFetch(url, options)

        // If we get a 429 Too Many Requests, retry with exponential backoff
        if (response.status === 429 && retryCount < MAX_RETRIES) {
          retryCount++
          const delay = BASE_DELAY * Math.pow(2, retryCount)
          console.log(`Rate limited. Retrying in ${delay}ms (attempt ${retryCount}/${MAX_RETRIES})`)
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }

        return response
      } catch (error) {
        if (retryCount < MAX_RETRIES) {
          retryCount++
          const delay = BASE_DELAY * Math.pow(2, retryCount)
          console.log(`Request failed. Retrying in ${delay}ms (attempt ${retryCount}/${MAX_RETRIES})`)
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }
        throw error
      }
    }
  }

  return client
}

