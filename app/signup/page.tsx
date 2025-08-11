"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, User, GraduationCap, RefreshCw, CheckCircle } from "lucide-react"
import { dataService } from "@/lib/data-service"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    college: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [emailSent, setEmailSent] = useState("")
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Check if email is from an educational institution
      if (!formData.email.includes(".edu")) {
        setError("Please use your college email address (.edu domain)")
        setLoading(false)
        return
      }

      const { data, error } = await dataService.signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        college: formData.college,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setEmailSent(formData.email)
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setResendLoading(true)
    setResendSuccess(false)
    
    try {
      const { error } = await dataService.resendConfirmationEmail(emailSent)
      
      if (error) {
        setError("Failed to resend email. Please try again.")
      } else {
        setResendSuccess(true)
        setTimeout(() => setResendSuccess(false), 3000)
      }
    } catch (err: any) {
      setError("Failed to resend email. Please try again.")
    } finally {
      setResendLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">Check Your Email</CardTitle>
            <CardDescription>We've sent you a verification link at {emailSent}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the link in your email to verify your account and complete the signup process.
            </p>
            
            {/* Email Troubleshooting Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-left">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Not receiving the email?</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Check your spam/junk folder</li>
                <li>• Verify your email address is correct</li>
                <li>• Wait a few minutes for delivery</li>
                <li>• Try resending the confirmation email</li>
                <li>• Some .edu domains have strict filtering</li>
                <li>• Try using a different email provider temporarily</li>
              </ul>
            </div>

            {/* Alternative Solutions */}
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg text-left">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Still having issues?</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
                If you continue to have problems receiving emails, you can:
              </p>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                <li>• Contact your university IT department</li>
                <li>• Try using a personal Gmail account temporarily</li>
                <li>• Check if your email provider blocks Supabase emails</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleResendEmail} 
                disabled={resendLoading}
                variant="outline"
                className="w-full"
              >
                {resendLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                {resendSuccess ? "Email Sent!" : "Resend Confirmation Email"}
              </Button>
              
              <Button asChild variant="outline">
                <Link href="/signin">Back to Sign In</Link>
              </Button>
            </div>

            {resendSuccess && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Confirmation email resent successfully!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Join StudyMarket</CardTitle>
          <CardDescription>Create your account and start connecting with talented students</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">College Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">Use your .edu email for verification</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="college">University/College</Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="college"
                  type="text"
                  placeholder="e.g., Stanford University"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/signin" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
