"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Star,
  Clock,
  ShieldCheck,
  Heart,
  Share2,
  MessageCircle,
  Users,
  Award,
  TrendingUp,
  Send,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  Shield,
} from "lucide-react"
import Image from "next/image"
import { dataService } from "@/lib/data-service"
import type { Gig, User } from "@/lib/types"
import { mockGigs, mockUsers } from "@/lib/mock-data"

interface Bid {
  id: string
  user_id: string
  amount: number
  delivery_days: number
  proposal: string
  created_at: string
  user: User
  status: "pending" | "accepted" | "rejected"
}

const mockBids: Bid[] = [
  {
    id: "1",
    user_id: "2",
    amount: 250,
    delivery_days: 2,
    proposal:
      "I can deliver this project with high quality. I have 3+ years of experience in Python and have completed similar projects for 50+ students.",
    created_at: new Date().toISOString(),
    user: mockUsers[1],
    status: "pending",
  },
  {
    id: "2",
    user_id: "3",
    amount: 300,
    delivery_days: 1,
    proposal:
      "I'm a fast worker and can complete this within 24 hours. I specialize in Python automation and data analysis.",
    created_at: new Date().toISOString(),
    user: mockUsers[2],
    status: "pending",
  },
]

export default function GigDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [gig, setGig] = useState<Gig | null>(null)
  const [bids, setBids] = useState<Bid[]>(mockBids)
  const [loading, setLoading] = useState(true)
  const [bidAmount, setBidAmount] = useState("")
  const [bidDelivery, setBidDelivery] = useState("3")
  const [bidProposal, setBidProposal] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const [showBidDialog, setShowBidDialog] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    fetchGigDetails()
    fetchCurrentUser()
  }, [params.id])

  const fetchGigDetails = async () => {
    try {
      // In real implementation, this would fetch from API
      const gigData = mockGigs.find((g) => g.id === params.id) || mockGigs[0]
      setGig(gigData)
    } catch (error) {
      console.error("Error fetching gig:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCurrentUser = async () => {
    const userData = await dataService.getCurrentUser()
    setCurrentUser(userData)
  }

  const handleSubmitBid = async () => {
    if (!bidAmount || !bidProposal.trim()) return

    const newBid: Bid = {
      id: Date.now().toString(),
      user_id: currentUser?.id || "temp",
      amount: Number.parseInt(bidAmount),
      delivery_days: Number.parseInt(bidDelivery),
      proposal: bidProposal,
      created_at: new Date().toISOString(),
      user: currentUser || mockUsers[0],
      status: "pending",
    }

    setBids([newBid, ...bids])
    setBidAmount("")
    setBidDelivery("3")
    setBidProposal("")
    setShowBidDialog(false)

    // Show success message
    // In real implementation, this would call API
  }

  const handleOrderNow = () => {
    if (!currentUser) {
      router.push("/signin")
      return
    }
    // Navigate to order page
    router.push(`/order/${gig?.id}`)
  }

  const handleContactSeller = () => {
    if (!currentUser) {
      router.push("/signin")
      return
    }
    // Navigate to messages
    router.push(`/messages?user=${gig?.user_id}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!gig) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Gig not found</h1>
        <Button onClick={() => router.push("/gigs")}>Browse All Gigs</Button>
      </div>
    )
  }

  const isRequestGig = gig.title.toLowerCase().includes("need help") || gig.title.toLowerCase().includes("looking for")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="text-white border-0" style={{ backgroundColor: gig.category?.color }}>
                        {gig.category?.icon} {gig.category?.name}
                      </Badge>
                      {isRequestGig && (
                        <Badge variant="outline" className="border-purple-500 text-purple-600">
                          <Users className="h-3 w-3 mr-1" />
                          Request
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold mb-4 leading-tight">{gig.title}</h1>

                    {/* Seller Info */}
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-12 w-12 ring-2 ring-blue-100 dark:ring-blue-900">
                        <AvatarImage src={gig.user?.avatar_url || "/placeholder.svg"} alt={gig.user?.full_name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {gig.user?.full_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{gig.user?.full_name}</h3>
                          {gig.user?.is_verified && <ShieldCheck className="h-4 w-4 text-blue-500" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{gig.user?.college}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{gig.rating}</span>
                            <span className="text-muted-foreground">({gig.total_orders} reviews)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsLiked(!isLiked)} className="rounded-full">
                      <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Gig Images */}
                {gig.images && gig.images.length > 0 && (
                  <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {gig.images.slice(0, 4).map((image, index) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Gig image ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {gig.tags && gig.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {gig.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabs Content */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="bids">{isRequestGig ? `Bids (${bids.length})` : "Reviews"}</TabsTrigger>
                <TabsTrigger value="seller">About Seller</TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <Card className="shadow-lg border-0">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">
                      {isRequestGig ? "Project Requirements" : "What You'll Get"}
                    </h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{gig.description}</p>
                    </div>

                    {/* Service Features */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium">High Quality Work</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium">On-Time Delivery</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                        <MessageCircle className="h-5 w-5 text-purple-600" />
                        <span className="text-sm font-medium">24/7 Communication</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                        <Award className="h-5 w-5 text-orange-600" />
                        <span className="text-sm font-medium">Satisfaction Guaranteed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bids">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {isRequestGig ? (
                        <>
                          <Target className="h-5 w-5" />
                          Student Bids ({bids.length})
                        </>
                      ) : (
                        <>
                          <Star className="h-5 w-5" />
                          Reviews ({gig.total_orders})
                        </>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {isRequestGig
                        ? "Students interested in helping with this request"
                        : "What buyers are saying about this service"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isRequestGig ? (
                      <>
                        {bids.map((bid) => (
                          <Card key={bid.id} className="border border-gray-200 dark:border-gray-700">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage
                                      src={bid.user.avatar_url || "/placeholder.svg"}
                                      alt={bid.user.full_name}
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                      {bid.user.full_name?.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-semibold">{bid.user.full_name}</h4>
                                      {bid.user.is_verified && <ShieldCheck className="h-4 w-4 text-blue-500" />}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{bid.user.college}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-green-600">₹{bid.amount}</div>
                                  <div className="text-sm text-muted-foreground">{bid.delivery_days} days</div>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{bid.proposal}</p>
                              <div className="flex items-center justify-between">
                                <Badge
                                  variant={
                                    bid.status === "accepted"
                                      ? "default"
                                      : bid.status === "rejected"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                >
                                  {bid.status}
                                </Badge>
                                {bid.status === "pending" && currentUser?.id === gig.user_id && (
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline">
                                      Message
                                    </Button>
                                    <Button size="sm">Accept Bid</Button>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        {bids.length === 0 && (
                          <div className="text-center py-8">
                            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">No bids yet. Be the first to help!</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Reviews will appear here after purchases</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seller">
                <Card className="shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6 mb-6">
                      <Avatar className="h-20 w-20 ring-4 ring-blue-100 dark:ring-blue-900">
                        <AvatarImage src={gig.user?.avatar_url || "/placeholder.svg"} alt={gig.user?.full_name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl">
                          {gig.user?.full_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-2xl font-bold">{gig.user?.full_name}</h3>
                          {gig.user?.is_verified && <ShieldCheck className="h-5 w-5 text-blue-500" />}
                        </div>
                        <p className="text-muted-foreground mb-2">{gig.user?.college}</p>
                        <p className="text-sm text-muted-foreground mb-4">{gig.user?.bio}</p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{gig.user?.reputation_score}</div>
                            <div className="text-xs text-muted-foreground">Rating</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{gig.total_orders}</div>
                            <div className="text-xs text-muted-foreground">Orders</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">98%</div>
                            <div className="text-xs text-muted-foreground">On Time</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    {gig.user?.skills && (
                      <div>
                        <h4 className="font-semibold mb-3">Skills & Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                          {gig.user.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="rounded-full">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm sticky top-4">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">₹{gig.price.toLocaleString("en-IN")}</div>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {gig.delivery_days} day delivery
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />2 revisions
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {isRequestGig ? (
                    <>
                      <Dialog open={showBidDialog} onOpenChange={setShowBidDialog}>
                        <DialogTrigger asChild>
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                            <Send className="h-4 w-4 mr-2" />
                            Submit Bid
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Submit Your Bid</DialogTitle>
                            <DialogDescription>Propose your price and timeline for this project</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="bidAmount">Your Price (₹)</Label>
                                <Input
                                  id="bidAmount"
                                  type="number"
                                  placeholder="500"
                                  value={bidAmount}
                                  onChange={(e) => setBidAmount(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="bidDelivery">Delivery (days)</Label>
                                <Input
                                  id="bidDelivery"
                                  type="number"
                                  placeholder="3"
                                  value={bidDelivery}
                                  onChange={(e) => setBidDelivery(e.target.value)}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="bidProposal">Your Proposal</Label>
                              <Textarea
                                id="bidProposal"
                                placeholder="Explain why you're the best fit for this project..."
                                value={bidProposal}
                                onChange={(e) => setBidProposal(e.target.value)}
                                className="min-h-24"
                              />
                            </div>
                            <Button onClick={handleSubmitBid} className="w-full">
                              Submit Bid
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" className="w-full bg-transparent" onClick={handleContactSeller}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Ask Question
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        onClick={handleOrderNow}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Order Now
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent" onClick={handleContactSeller}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Seller
                      </Button>
                    </>
                  )}
                </div>

                <Separator className="my-4" />

                {/* Features */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>24/7 support</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response Time</span>
                    <span className="font-medium">Within 1 hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recent Delivery</span>
                    <span className="font-medium">2 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Completion</span>
                    <span className="font-medium">98%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Notice */}
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Stay Safe:</strong> Always communicate through Student Market's messaging system. Never share
                personal contact information or make payments outside the platform.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}
