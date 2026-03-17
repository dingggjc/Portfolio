import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // If env vars are missing during build/prerendering, return a dummy client
    // or handle gracefully to prevent build failure. 
    // In many cases, Returning createSupabaseClient with empty strings might still throw,
    // so we check if we are in build context.
    return createSupabaseClient(
      supabaseUrl || "https://placeholder.supabase.co",
      supabaseAnonKey || "placeholder"
    )
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
