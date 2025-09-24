"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { getEnvironment } from "@/lib/environment"
import Link from "next/link"

export default function DebugPage() {
  const [authStatus, setAuthStatus] = useState<any>(null)
  const [envInfo, setEnvInfo] = useState<any>(null)
  const [supabaseTest, setSupabaseTest] = useState<any>(null)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Environment info
        const env = getEnvironment()
        setEnvInfo(env)

        // Auth status
        const { data: { session }, error } = await supabase.auth.getSession()
        setAuthStatus({ session: !!session, user: session?.user, error })

        // Test Supabase connection
        try {
          const { data, error } = await supabase
            .from('categories')
            .select('count')
            .limit(1)
          
          setSupabaseTest({ 
            connected: !error, 
            error: error?.message,
            hasData: !!data 
          })
        } catch (err: any) {
          setSupabaseTest({ 
            connected: false, 
            error: err?.message || 'Connection failed'
          })
        }
      } catch (err) {
        console.error('Debug check failed:', err)
      }
    }

    checkStatus()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Debug Information</h1>
          <p className="text-muted-foreground">System status and configuration details</p>
        </div>

        {/* Environment Info */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Information</CardTitle>
            <CardDescription>Current environment configuration</CardDescription>
          </CardHeader>
          <CardContent>
            {envInfo ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <span className="font-medium">Environment:</span>
                  <Badge variant={envInfo.isProduction ? "default" : "secondary"} className="ml-2">
                    {envInfo.isProduction ? "Production" : "Development"}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Platform:</span>
                  <Badge variant={envInfo.isVercel ? "default" : "outline"} className="ml-2">
                    {envInfo.isVercel ? "Vercel" : "Local"}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Site URL:</span>
                  <span className="ml-2 text-sm font-mono">{envInfo.siteUrl}</span>
                </div>
                {envInfo.hostname && (
                  <div>
                    <span className="font-medium">Hostname:</span>
                    <span className="ml-2 text-sm font-mono">{envInfo.hostname}</span>
                  </div>
                )}
              </div>
            ) : (
              <p>Loading environment info...</p>
            )}
          </CardContent>
        </Card>

        {/* Environment Variables */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Supabase configuration status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>NEXT_PUBLIC_SUPABASE_URL</span>
                <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_URL ? "default" : "destructive"}>
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Set" : "✗ Missing"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "default" : "destructive"}>
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ Set" : "✗ Missing"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>NEXT_PUBLIC_SITE_URL</span>
                <Badge variant={process.env.NEXT_PUBLIC_SITE_URL ? "default" : "secondary"}>
                  {process.env.NEXT_PUBLIC_SITE_URL ? "✓ Set" : "Using default"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authentication Status */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>Current user session information</CardDescription>
          </CardHeader>
          <CardContent>
            {authStatus ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Session Active</span>
                  <Badge variant={authStatus.session ? "default" : "destructive"}>
                    {authStatus.session ? "✓ Active" : "✗ None"}
                  </Badge>
                </div>
                {authStatus.user && (
                  <>
                    <div className="flex items-center justify-between">
                      <span>User Email</span>
                      <span className="text-sm font-mono">{authStatus.user.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>User ID</span>
                      <span className="text-sm font-mono">{authStatus.user.id.substring(0, 8)}...</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email Confirmed</span>
                      <Badge variant={authStatus.user.email_confirmed_at ? "default" : "destructive"}>
                        {authStatus.user.email_confirmed_at ? "✓ Confirmed" : "✗ Pending"}
                      </Badge>
                    </div>
                  </>
                )}
                {authStatus.error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                    <span className="text-red-800 dark:text-red-200 text-sm">
                      Error: {authStatus.error.message}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p>Loading auth status...</p>
            )}
          </CardContent>
        </Card>

        {/* Supabase Connection */}
        <Card>
          <CardHeader>
            <CardTitle>Supabase Connection</CardTitle>
            <CardDescription>Database connectivity test</CardDescription>
          </CardHeader>
          <CardContent>
            {supabaseTest ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Connection Status</span>
                  <Badge variant={supabaseTest.connected ? "default" : "destructive"}>
                    {supabaseTest.connected ? "✓ Connected" : "✗ Failed"}
                  </Badge>
                </div>
                {supabaseTest.error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                    <span className="text-red-800 dark:text-red-200 text-sm">
                      Error: {supabaseTest.error}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p>Testing connection...</p>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Quick navigation and testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="/">Home</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/signup">Sign Up</Link>
              </Button>
              <Button onClick={() => window.location.reload()}>
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}