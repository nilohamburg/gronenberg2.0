import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// This is to avoid multiple instances of Supabase client on the client side
let clientSingleton: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function createClient() {
  if (typeof window === "undefined") {
    // Server-side: Always create a new client
    return createSupabaseClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
  }

  // Client-side: Use singleton pattern
  if (!clientSingleton) {
    clientSingleton = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }

  return clientSingleton
}

// For server components
export function createServerComponentClient() {
  return createSupabaseClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
}

// For client components
export function createClientComponentClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

