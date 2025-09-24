import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debug logging
if (typeof window !== 'undefined') {
  console.log('Supabase Config:', {
    url: supabaseUrl ? '✓ Present' : '✗ Missing',
    anonKey: supabaseAnonKey ? '✓ Present' : '✗ Missing',
    urlValue: supabaseUrl?.substring(0, 30) + '...',
  })
}

if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL")
}

if (!supabaseAnonKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client
export const createServerClient = () => {
  const serverKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serverKey) {
    throw new Error("Missing env.SUPABASE_SERVICE_ROLE_KEY")
  }

  return createClient(supabaseUrl, serverKey)
}
