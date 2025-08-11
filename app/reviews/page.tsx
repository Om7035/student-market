"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Star, ThumbsUp, MessageCircle, Award, Search } from "lucide-react"
import { mockUsers, mockGigs } from "@/lib/mock-data"
import type { User, Gig } from "@/lib/types"

interface Review {
  id: string
  gig_id: string
  reviewer_id: string
  rating: number
  title: string
  comment: string
  helpful_count: number
  created_at: string
  reviewer: User
  gig: Gig
  response?: {
    content: string
    created_at: string
  }
}

const mockReviews: Review[] = [
  {
    id: "1",
    gig_id: "1",
    reviewer_id: "2",
    rating: 5,
    title: "Excellent Python tutoring!",
    comment:
      "Priya is an amazing tutor! She explained complex data structures in a way that was easy to understand. My exam went great thanks to her help. Highly recommend!",
    helpful_count: 12,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    reviewer: mockUsers[1],
    gig: mockGigs[0],
    response: {
      content: "Thank you so much! I'm glad I could help you succeed in your exam. Best of luck with your studies!",
      created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "2",
    gig_id: "2",
    reviewer_id: "3",
    rating: 4,
    title: "Great UI design work",
    comment:
      "Arjun delivered a clean and modern UI design for my app. The turnaround time was quick and he was very responsive to feedback. Minor revisions needed but overall satisfied.",
    helpful_count: 8,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    reviewer: mockUsers[2],
    gig: mockGigs[1],
  },
  {
    id: "3",
    gig_id: "3",
    reviewer_id: "1",
    rating: 5,
    title: "Outstanding design skills!",
    comment:
      "Sneha created an absolutely beautiful design for our startup. Her attention to detail and creativity exceeded our expectations. Will definitely work with her again!",
    helpful_count: 15,
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    reviewer: mockUsers[0],
    gig: mockGigs[2],
  },
]

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(mockReviews)
  const [searchQuery, setSearchQuery] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
  })
  const [showWriteReview, setShowWriteReview] = useState(false)

  useEffect(() => {
    filterAndSortReviews()
  }, [searchQuery, ratingFilter, sortBy, reviews])

  const filterAndSortReviews = () => {
    let filtered = reviews

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (review) =>
          review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.reviewer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.gig.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Rating filter
    if (ratingFilter !== "all") {
      const rating = Number.parseInt(ratingFilter)
      filtered = filtered.filter((review) => review.rating === rating)
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case "highest":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "lowest":
        filtered.sort((a, b) => a.rating - b.rating)
        break
      case "helpful":
        filtered.sort((a, b) => b.helpful_count - a.helpful_count)
        break
    }

    setFilteredReviews(filtered)
  }

  const handleSubmitReview = () => {
    const review: Review = {
      id: Date.now().toString(),
      gig_id: "1",
      reviewer_id: "1",
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      helpful_count: 0,
      created_at: new Date().toISOString(),
      reviewer: mockUsers[0],
      gig: mockGigs[0],
    }

    setReviews([review, ...reviews])
    setNewReview({ rating: 5, title: "", comment: "" })
    setShowWriteReview(false)
  }

  const handleHelpful = (reviewId: string) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId ? { ...review, helpful_count: review.helpful_count + 1 } : review,
      ),
    )
  }

  const renderStars = (rating: number, size = "h-4 w-4") => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    )
  }

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
    percentage:
      reviews.length > 0 ? (reviews.filter((review) => review.rating === rating).length / reviews.length) * 100 : 0,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Student Reviews
          </h1>
          <p className="text-xl text-muted-foreground">Real feedback from Pune's student community</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">{renderStars(Math.round(averageRating))}</div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{reviews.length}</div>
              <MessageCircle className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-muted-foreground">Total Reviews</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.round((reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100)}%
              </div>
              <ThumbsUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-muted-foreground">Positive Reviews</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {reviews.reduce((sum, review) => sum + review.helpful_count, 0)}
              </div>
              <Award className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm text-muted-foreground">Helpful Votes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rating Distribution */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg">Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Write Review */}
            <Dialog open={showWriteReview} onOpenChange={setShowWriteReview}>
              <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Star className="h-4 w-4 mr-2" />
                  Write a Review
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                  <DialogDescription>Share your experience with the community</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Rating</Label>
                    <div className="flex items-center gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="transition-colors"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= newReview.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 hover:text-yellow-400"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="title">Review Title</Label>
                    <Input
                      id="title"
                      placeholder="Summarize your experience"
                      value={newReview.title}
                      onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="comment">Your Review</Label>
                    <Textarea
                      id="comment"
                      placeholder="Tell others about your experience..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="min-h-24"
                    />
                  </div>
                  <Button
                    onClick={handleSubmitReview}
                    disabled={!newReview.title.trim() || !newReview.comment.trim()}
                    className="w-full"
                  >
                    Submit Review
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filters */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search reviews..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="highest">Highest Rating</SelectItem>
                      <SelectItem value="lowest">Lowest Rating</SelectItem>
                      <SelectItem value="helpful">Most Helpful</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-6">
              {filteredReviews.length === 0 ? (
                <Card className="shadow-lg border-0">
                  <CardContent className="p-12 text-center">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No reviews found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </CardContent>
                </Card>
              ) : (
                filteredReviews.map((review) => (
                  <Card key={review.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={review.reviewer.avatar_url || "/placeholder.svg"}
                            alt={review.reviewer.full_name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {review.reviewer.full_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{review.reviewer.full_name}</h4>
                              <p className="text-sm text-muted-foreground">{review.reviewer.college}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-1">
                                {renderStars(review.rating)}
                                <span className="text-sm font-medium">{review.rating}/5</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="mb-3 text-xs">
                            {review.gig.title}
                          </Badge>
                          <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
                          <p className="text-muted-foreground mb-4 leading-relaxed">{review.comment}</p>

                          {/* Seller Response */}
                          {review.response && (
                            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-blue-600 hover:bg-blue-600 text-white text-xs">
                                  Seller Response
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(review.response.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm">{review.response.content}</p>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleHelpful(review.id)}
                                className="bg-transparent"
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Helpful ({review.helpful_count})
                              </Button>
                              <Button variant="outline" size="sm" className="bg-transparent">
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Reply
                              </Button>
                            </div>
                            <Badge
                              variant="secondary"
                              className={
                                review.rating >= 4
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : review.rating >= 3
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }
                            >
                              {review.rating >= 4 ? "Positive" : review.rating >= 3 ? "Neutral" : "Negative"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
