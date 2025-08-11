"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { dataService } from "@/lib/data-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { User } from "@/lib/types"

// Server Action for updating user profile
async function updateProfileAction(prevState: any, formData: FormData) {
  const id = formData.get("id") as string
  const full_name = formData.get("full_name") as string
  const bio = formData.get("bio") as string
  const college = formData.get("college") as string
  const major = formData.get("major") as string
  const year = Number.parseInt(formData.get("year") as string) || undefined
  const city = formData.get("city") as string
  const skillsString = formData.get("skills") as string
  const avatar_url = formData.get("avatar_url") as string

  const skills = skillsString
    ? skillsString
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : []

  const updates: Partial<User> = {
    full_name,
    bio,
    college,
    major,
    year,
    city,
    skills,
    avatar_url: avatar_url || undefined, // Allow clearing avatar or setting to undefined
  }

  const updatedUser = await dataService.updateUser(id, updates)

  if (updatedUser) {
    return { success: true, message: "Profile updated successfully!" }
  } else {
    return { success: false, message: "Failed to update profile." }
  }
}

export default function EditProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { id } = params

  const [initialState, updateProfile] = useActionState(updateProfileAction, {
    success: false,
    message: "",
  })

  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true)
      const [fetchedUser, currentUser] = await Promise.all([dataService.getUserById(id), dataService.getCurrentUser()])

      if (!fetchedUser || fetchedUser.id !== currentUser?.id) {
        toast({
          title: "Unauthorized",
          description: "You can only edit your own profile.",
          variant: "destructive",
        })
        router.push(`/profile/${id}`) // Redirect if not authorized
        return
      }
      setUser(fetchedUser)
      setLoadingUser(false)
    }
    fetchUser()
  }, [id, router, toast])

  useEffect(() => {
    if (initialState.message) {
      toast({
        title: initialState.success ? "Success" : "Error",
        description: initialState.message,
        variant: initialState.success ? "default" : "destructive",
      })
      if (initialState.success) {
        router.push(`/profile/${id}`) // Redirect to profile page on success
      }
    }
    setIsSubmitting(false) // Reset submitting state after action completes
  }, [initialState, router, toast, id])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)
    updateProfile(formData)
  }

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading profile...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <p className="text-muted-foreground">Profile not found or unauthorized access.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Your Profile</CardTitle>
          <CardDescription>Update your personal information, skills, and bio.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="id" value={user.id} />

            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={user.avatar_url || "/placeholder.svg?height=100&width=100&query=user avatar"} />
                <AvatarFallback className="text-4xl">{user.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="w-full">
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  name="avatar_url"
                  type="url"
                  defaultValue={user.avatar_url || ""}
                  placeholder="https://example.com/your-avatar.jpg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" name="full_name" defaultValue={user.full_name || ""} required />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" defaultValue={user.city || ""} placeholder="e.g., Pune" />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={user.bio || ""}
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="college">College</Label>
                <Input
                  id="college"
                  name="college"
                  defaultValue={user.college || ""}
                  placeholder="e.g., Pune University"
                />
              </div>
              <div>
                <Label htmlFor="major">Major</Label>
                <Input id="major" name="major" defaultValue={user.major || ""} placeholder="e.g., Computer Science" />
              </div>
            </div>

            <div>
              <Label htmlFor="year">Year (e.g., 1, 2, 3, 4)</Label>
              <Input
                id="year"
                name="year"
                type="number"
                defaultValue={user.year || ""}
                placeholder="e.g., 3"
                min={1}
                max={5}
              />
            </div>

            <div>
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                name="skills"
                defaultValue={user.skills?.join(", ") || ""}
                placeholder="e.g., React, Node.js, UI/UX Design"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/profile/${user.id}`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
