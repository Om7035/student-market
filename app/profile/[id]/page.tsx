import Link from "next/link"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { dataService } from "@/lib/data-service"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Mail, MapPin, GraduationCap, Star, Edit } from "lucide-react"
import { GigCard } from "@/components/gig-card"
import { ReviewCard } from "@/components/review-card"
import ProfileLoading from "../loading" // Import the loading component

interface ProfilePageProps {
  params: {
    id: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = params

  const [user, currentUser, userGigs, userReviews] = await Promise.all([
    dataService.getUserById(id),
    dataService.getCurrentUser(),
    dataService.getUserGigs(id),
    dataService.getReviewsForUser(id),
  ])

  if (!user) {
    notFound()
  }

  const isCurrentUserProfile = currentUser?.id === user.id

  // Determine reputation level based on score
  const getReputationLevel = (score: number) => {
    if (score >= 900) return "Expert"
    if (score >= 700) return "Advanced"
    if (score >= 500) return "Intermediate"
    return "Beginner"
  }

  return (
    <Suspense fallback={<ProfileLoading />}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Profile Info */}
          <div className="w-full md:w-1/3 space-y-6">
            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
                  <AvatarImage src={user.avatar_url || "/placeholder.svg?height=100&width=100&query=user avatar"} />
                  <AvatarFallback className="text-4xl">{user.full_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <h1 className="text-3xl font-bold text-center">{user.full_name}</h1>
                <p className="text-muted-foreground text-center flex items-center gap-1">
                  <Mail className="h-4 w-4" /> {user.email}
                </p>
                {user.city && (
                  <p className="text-muted-foreground text-center flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {user.city}
                  </p>
                )}
                {user.college && (
                  <p className="text-muted-foreground text-center flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" /> {user.college}
                    {user.major && user.year && (
                      <span>
                        {" "}
                        • {user.major} ({user.year} Year)
                      </span>
                    )}
                  </p>
                )}
                {isCurrentUserProfile && (
                  <Button asChild variant="outline" className="mt-4 w-full bg-transparent">
                    <Link href={`/profile/${user.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" /> Edit Profile
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{user.bio || "No bio provided yet."}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No skills listed yet.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reputation & Rank</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Reputation Level: {getReputationLevel(user.reputation_score)}</span>
                    <span className="text-sm text-muted-foreground">{user.reputation_score} / 1000</span>
                  </div>
                  <Progress value={(user.reputation_score / 1000) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Overall Rating:</span>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>
                        {userGigs.length > 0
                          ? (userGigs.reduce((sum, gig) => sum + gig.rating, 0) / userGigs.length).toFixed(1)
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {userGigs.reduce((sum, gig) => sum + gig.total_orders, 0)} orders across {userGigs.length}{" "}
                    gigs.
                  </p>
                </div>
                {/* Placeholder for City Rank - can be implemented with more complex logic */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">City Rank (Pune):</span>
                    <span className="text-sm text-muted-foreground">#Top 10%</span> {/* Example placeholder */}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your standing among students in Pune based on reputation and gig performance.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Gigs & Reviews */}
          <div className="w-full md:w-2/3 space-y-6">
            <Tabs defaultValue="gigs" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="gigs">Gigs Created ({userGigs.length})</TabsTrigger>
                <TabsTrigger value="reviews">Reviews Received ({userReviews.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="gigs" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Gigs by {user.full_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userGigs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        {isCurrentUserProfile ? (
                          <>
                            <p className="mb-4">You haven't created any gigs yet.</p>
                            <Button asChild>
                              <Link href="/create-gig">Create Your First Gig</Link>
                            </Button>
                          </>
                        ) : (
                          <p>This user hasn't created any gigs yet.</p>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                        {userGigs.map((gig) => (
                          <GigCard key={gig.id} gig={gig} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews for {user.full_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userReviews.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No reviews received yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userReviews.map((review) => (
                          <ReviewCard key={review.id} review={review} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Suspense>
  )
}
