"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, Info } from "lucide-react"

export function DemoNotice() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if Supabase is configured
    const isSupabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    if (!isSupabaseConfigured) {
      setIsVisible(true)
    }
  }, [])

  if (!isVisible) return null

  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-blue-800 dark:text-blue-200">
          <strong>Demo Mode:</strong> This app is running with sample data. To enable full functionality, configure your
          Supabase environment variables.
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-blue-600 hover:text-blue-800 p-1 h-auto"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}
