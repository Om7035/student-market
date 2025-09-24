"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  Star, 
  MapPin, 
  Calendar, 
  Mail, 
  GraduationCap, 
  Award, 
  TrendingUp, 
  Package,
  MessageCircle,
  Settings,
  ShieldCheck,
  DollarSign
} from "lucide-react"
import { dataService } from "@/lib/data-service"
import { useAuth } from "@/hooks/use-auth"
import { GigCard } from "@/components/gig-card"
import { ReviewCard } from "@/components/review-card"
import type { User, Gig, Review } from "@/lib/types"
import Link from "next/link"

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [userGigs, setUserGigs] = useState<Gig[]>([])
  const [userReviews, setUserReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const isOwnProfile = currentUser?.id === params.id

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await dataService.getUserById(params.id as string)
        if (userData) {
          setUser(userData)
          
          // Fetch user's gigs and reviews
          const [gigs, reviews] = await Promise.all([
            dataService.getUserGigs(userData.id),
            dataService.getReviewsForUser(userData.id)
          ])
          
          setUserGigs(gigs)
          setUserReviews(reviews)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchUserProfile()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>User Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">The requested user profile could not be found.</p>
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const averageRating = userReviews.length > 0 
    ? userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length 
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24 ring-4 ring-blue-100 dark:ring-blue-900">
                  <AvatarImage src={user.avatar_url || ""} alt={user.full_name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl font-bold">
                    {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold flex items-center gap-2">
                    {user.full_name || "Student"}
                    {user.is_verified && (
                      <ShieldCheck className="h-6 w-6 text-green-500" />
                    )}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <span>{user.college}</span>
                  </div>
                  {user.city && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{user.city}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{averageRating.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Rating
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{userGigs.length}</div>
                  <div className="text-sm text-muted-foreground">Active Gigs</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{userReviews.length}</div>
                  <div className="text-sm text-muted-foreground">Reviews</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{user.reputation_score}</div>
                  <div className="text-sm text-muted-foreground">Reputation</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isOwnProfile ? (
                  <Button asChild>
                    <Link href={`/profile/${user.id}/edit`}>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline">
                      <Star className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-muted-foreground">{user.bio}</p>
              </div>
            )}

            {/* Skills */}
            {user.skills && user.skills.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gigs">Gigs ({userGigs.length})</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({userReviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Gigs */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Gigs</CardTitle>
                </CardHeader>
                <CardContent>
                  {userGigs.slice(0, 3).map((gig) => (
                    <div key={gig.id} className="mb-4 last:mb-0">
                      <GigCard gig={gig} />
                    </div>
                  ))}
                  {userGigs.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No gigs yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {userReviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="mb-4 last:mb-0">
                      <ReviewCard review={review} />
                    </div>
                  ))}
                  {userReviews.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No reviews yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gigs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userGigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
            {userGigs.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Gigs Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    {isOwnProfile ? "You haven't created any gigs yet." : "This user hasn't created any gigs yet."}
                  </p>
                  {isOwnProfile && (
                    <Button asChild>
                      <Link href="/create-gig">Create Your First Gig</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="space-y-4">
              {userReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
            {userReviews.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                  <p className="text-muted-foreground">
                    {isOwnProfile ? "You haven't received any reviews yet." : "This user hasn't received any reviews yet."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}