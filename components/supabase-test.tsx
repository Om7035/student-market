"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export function SupabaseTest() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult("Testing connection...")

    try {
      // Test basic Supabase connection
      const { data, error } = await supabase.from('categories').select('count')
      
      if (error) {
        setResult(`Error: ${error.message}`)
        console.error('Supabase test error:', error)
      } else {
        setResult(`✅ Connection successful! Response: ${JSON.stringify(data)}`)
        console.log('Supabase test success:', data)
      }
    } catch (error) {
      setResult(`❌ Network error: ${error}`)
      console.error('Network error:', error)
    } finally {
      setLoading(false)
    }
  }

  const testAuth = async () => {
    setLoading(true)
    setResult("Testing auth...")

    try {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setResult(`Auth Error: ${error.message}`)
        console.error('Auth test error:', error)
      } else {
        setResult(`✅ Auth working! Session: ${data.session ? 'Active' : 'None'}`)
        console.log('Auth test success:', data)
      }
    } catch (error) {
      setResult(`❌ Auth network error: ${error}`)
      console.error('Auth network error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testConnection} disabled={loading} size="sm">
            Test Database
          </Button>
          <Button onClick={testAuth} disabled={loading} size="sm" variant="outline">
            Test Auth
          </Button>
        </div>
        {result && (
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}