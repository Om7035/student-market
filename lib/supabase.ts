import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON

if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE")
}

if (!supabaseAnonKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON")
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
