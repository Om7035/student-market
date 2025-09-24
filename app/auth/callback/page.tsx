"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Starting auth callback process...')
        
        // Get URL fragments and search params
        const urlParams = new URLSearchParams(window.location.search)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        
        // Check for error in URL
        const error = urlParams.get('error') || hashParams.get('error')
        const errorDescription = urlParams.get('error_description') || hashParams.get('error_description')
        
        if (error) {
          console.error('Auth error from URL:', error, errorDescription)
          setStatus("error")
          setMessage(errorDescription || "Authentication failed. Please try again.")
          return
        }
        
        // Handle the session exchange
        const { data, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setStatus("error")
          setMessage(`Authentication failed: ${sessionError.message}`)
          return
        }

        if (data.session?.user) {
          console.log('User authenticated successfully:', data.session.user.email)
          setUserEmail(data.session.user.email || null)
          
          // Check if user exists in our database
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single()
          
          if (userError && userError.code !== 'PGRST116') {
            console.error('User lookup error:', userError)
          }
          
          // If user doesn't exist in our users table, create them
          if (!userData) {
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: data.session.user.id,
                email: data.session.user.email,
                full_name: data.session.user.user_metadata?.full_name || '',
                college: data.session.user.user_metadata?.college || '',
                is_verified: true,
                reputation_score: 100,
                total_earnings: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              
            if (insertError) {
              console.error('Error creating user record:', insertError)
            }
          }
          
          setStatus("success")
          setMessage("Email confirmed successfully! Welcome to Student Marketplace.")
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            window.location.href = "/dashboard"
          }, 2000)
          
        } else {
          console.log('No session found, retrying...')
          // Retry after a short delay
          setTimeout(async () => {
            const { data: retryData, error: retryError } = await supabase.auth.getSession()
            
            if (retryData.session?.user) {
              setUserEmail(retryData.session.user.email || null)
              setStatus("success")
              setMessage("Email confirmed successfully! Welcome to Student Marketplace.")
              setTimeout(() => {
                window.location.href = "/dashboard"
              }, 1500)
            } else {
              console.error('Retry failed:', retryError)
              setStatus("error")
              setMessage("Email confirmation failed. The link may have expired or already been used.")
            }
          }, 2000)
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err)
        setStatus("error")
        setMessage("An unexpected error occurred. Please try again.")
      }
    }

    handleAuthCallback()
  }, [router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            <CardTitle>Confirming Your Email</CardTitle>
            <CardDescription>Please wait while we verify your email address...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center ${
            status === "success" 
              ? "bg-green-100 dark:bg-green-900" 
              : "bg-red-100 dark:bg-red-900"
          }`}>
            {status === "success" ? (
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            )}
          </div>
          <CardTitle className={status === "success" ? "text-green-600" : "text-red-600"}>
            {status === "success" ? "Email Confirmed!" : "Confirmation Failed"}
          </CardTitle>
          <CardDescription>
            {userEmail && (
              <span className="text-sm text-muted-foreground block mb-2">
                Account: {userEmail}
              </span>
            )}
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === "success" ? (
            <div className="space-y-3">
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Your account has been verified successfully!
                </AlertDescription>
              </Alert>
              <p className="text-sm text-muted-foreground">
                You will be redirected to your dashboard shortly...
              </p>
              <Button asChild className="w-full">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  There was an issue confirming your email. Please try signing up again.
                </AlertDescription>
              </Alert>
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link href="/signup">Try Again</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/signin">Back to Sign In</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
