"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Search,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  Calendar,
  Target,
  Award,
  AlertCircle,
} from "lucide-react"
import type { User as UserType } from "@/lib/types"

interface Bid {
  id: string
  gig_id: string
  gig_title: string
  user_id: string
  amount: number
  original_price: number
  delivery_days: number
  proposal: string
  status: "pending" | "accepted" | "rejected" | "withdrawn"
  created_at: string
  updated_at: string
  user: UserType
  type: "sent" | "received"
}

const mockBids: Bid[] = [
  {
    id: "1",
    gig_id: "1",
    gig_title: "Python Programming Help for Data Analysis Project",
    user_id: "2",
    amount: 450,
    original_price: 500,
    delivery_days: 3,
    proposal:
      "I have 3+ years of experience in Python and data analysis. I can help you complete this project with high quality code and detailed explanations.",
    status: "pending",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: {
      id: "2",
      email: "arjun.patel@unipune.ac.in",
      full_name: "Arjun Patel",
      avatar_url: "/placeholder.svg?height=40&width=40",
      college: "Pune University",
      major: "Data Science",
      year: 4,
      reputation_score: 4.9,
      wallet_balance: 22000,
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    type: "sent",
  },
  {
    id: "2",
    gig_id: "2",
    gig_title: "UI/UX Design for Mobile App",
    user_id: "3",
    amount: 800,
    original_price: 900,
    delivery_days: 5,
    proposal:
      "I'm a design student at MIT Pune with experience in mobile app design. I can create modern, user-friendly interfaces.",
    status: "accepted",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    user: {
      id: "3",
      email: "sneha.kulkarni@mitpune.edu.in",
      full_name: "Sneha Kulkarni",
      avatar_url: "/placeholder.svg?height=40&width=40",
      college: "MIT Pune",
      major: "Design",
      year: 2,
      reputation_score: 4.8,
      wallet_balance: 18500,
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    type: "received",
  },
]

export default function BidsPage() {
  const [bids, setBids] = useState<Bid[]>(mockBids)
  const [filteredBids, setFilteredBids] = useState<Bid[]>(mockBids)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    filterBids()
  }, [searchQuery, statusFilter, typeFilter, bids])

  const filterBids = () => {
    let filtered = bids

    if (searchQuery) {
      filtered = filtered.filter(
        (bid) =>
          bid.gig_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bid.user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((bid) => bid.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((bid) => bid.type === typeFilter)
    }

    setFilteredBids(filtered)
  }

  const handleAcceptBid = async (bidId: string) => {
    setBids(bids.map((bid) => (bid.id === bidId ? { ...bid, status: "accepted" as const } : bid)))
  }

  const handleRejectBid = async (bidId: string) => {
    setBids(bids.map((bid) => (bid.id === bidId ? { ...bid, status: "rejected" as const } : bid)))
  }

  const handleWithdrawBid = async (bidId: string) => {
    setBids(bids.map((bid) => (bid.id === bidId ? { ...bid, status: "withdrawn" as const } : bid)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "withdrawn":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "withdrawn":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const sentBids = filteredBids.filter((bid) => bid.type === "sent")
  const receivedBids = filteredBids.filter((bid) => bid.type === "received")

  const stats = {
    totalBids: bids.length,
    pendingBids: bids.filter((bid) => bid.status === "pending").length,
    acceptedBids: bids.filter((bid) => bid.status === "accepted").length,
    successRate:
      bids.length > 0 ? Math.round((bids.filter((bid) => bid.status === "accepted").length / bids.length) * 100) : 0,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bid Management</h1>
        <p className="text-muted-foreground">Track and manage all your bids in one place</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bids</p>
                <p className="text-2xl font-bold">{stats.totalBids}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingBids}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold">{stats.acceptedBids}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{stats.successRate}%</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-lg border-0 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bids by title or user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sent">Sent Bids</SelectItem>
                <SelectItem value="received">Received Bids</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bids Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Bids ({filteredBids.length})</TabsTrigger>
          <TabsTrigger value="sent">Sent ({sentBids.length})</TabsTrigger>
          <TabsTrigger value="received">Received ({receivedBids.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredBids.length === 0 ? (
            <Card className="shadow-lg border-0">
              <CardContent className="p-12 text-center">
                <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No bids found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
              </CardContent>
            </Card>
          ) : (
            filteredBids.map((bid) => (
              <Card key={bid.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{bid.gig_title}</h3>
                        <Badge className={`${getStatusColor(bid.status)} border-0`}>
                          {getStatusIcon(bid.status)}
                          <span className="ml-1 capitalize">{bid.status}</span>
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            bid.type === "sent" ? "border-blue-500 text-blue-600" : "border-green-500 text-green-600"
                          }
                        >
                          {bid.type === "sent" ? "Sent" : "Received"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={bid.user.avatar_url || "/placeholder.svg"} alt={bid.user.full_name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {bid.user.full_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{bid.user.full_name}</p>
                          <p className="text-sm text-muted-foreground">{bid.user.college}</p>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 line-clamp-2">{bid.proposal}</p>
                    </div>

                    <div className="text-right ml-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl font-bold text-green-600">₹{bid.amount.toLocaleString("en-IN")}</div>
                        {bid.amount < bid.original_price && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <TrendingDown className="h-4 w-4 mr-1" />
                            <span className="line-through">₹{bid.original_price}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                        <Calendar className="h-4 w-4" />
                        <span>{bid.delivery_days} days delivery</span>
                      </div>

                      <div className="flex gap-2">
                        {bid.type === "received" && bid.status === "pending" && (
                          <>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  Accept
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Accept this bid?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    You're about to accept this bid for ₹{bid.amount.toLocaleString("en-IN")}. This
                                    action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleAcceptBid(bid.id)}>
                                    Accept Bid
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <Button size="sm" variant="outline" onClick={() => handleRejectBid(bid.id)}>
                              Reject
                            </Button>
                          </>
                        )}

                        {bid.type === "sent" && bid.status === "pending" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                Withdraw
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Withdraw this bid?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to withdraw your bid? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleWithdrawBid(bid.id)}>
                                  Withdraw Bid
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                    <span>Submitted {new Date(bid.created_at).toLocaleDateString()}</span>
                    {bid.status !== "pending" && <span>Updated {new Date(bid.updated_at).toLocaleDateString()}</span>}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sentBids.map((bid) => (
            <Card key={bid.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{bid.gig_title}</h3>
                      <Badge className={`${getStatusColor(bid.status)} border-0`}>
                        {getStatusIcon(bid.status)}
                        <span className="ml-1 capitalize">{bid.status}</span>
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3 line-clamp-2">{bid.proposal}</p>
                    <div className="text-sm text-muted-foreground">
                      Submitted {new Date(bid.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    <div className="text-2xl font-bold text-green-600 mb-2">₹{bid.amount.toLocaleString("en-IN")}</div>
                    <div className="text-sm text-muted-foreground mb-4">{bid.delivery_days} days</div>
                    {bid.status === "pending" && (
                      <Button size="sm" variant="outline" onClick={() => handleWithdrawBid(bid.id)}>
                        Withdraw
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          {receivedBids.map((bid) => (
            <Card key={bid.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-semibold text-lg">{bid.gig_title}</h3>
                      <Badge className={`${getStatusColor(bid.status)} border-0`}>
                        {getStatusIcon(bid.status)}
                        <span className="ml-1 capitalize">{bid.status}</span>
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={bid.user.avatar_url || "/placeholder.svg"} alt={bid.user.full_name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {bid.user.full_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{bid.user.full_name}</p>
                        <p className="text-sm text-muted-foreground">{bid.user.college}</p>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-3 line-clamp-2">{bid.proposal}</p>
                    <div className="text-sm text-muted-foreground">
                      Received {new Date(bid.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="text-right ml-6">
                    <div className="text-2xl font-bold text-green-600 mb-2">₹{bid.amount.toLocaleString("en-IN")}</div>
                    <div className="text-sm text-muted-foreground mb-4">{bid.delivery_days} days</div>

                    {bid.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAcceptBid(bid.id)}
                        >
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectBid(bid.id)}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
