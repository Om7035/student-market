"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, ShoppingBag, Star, TrendingUp, Plus, Eye, MessageCircle } from "lucide-react"
import Link from "next/link"
import { dataService } from "@/lib/data-service"
import type { User, Gig, Order } from "@/lib/types"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [gigs, setGigs] = useState<Gig[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch user profile
      const userData = await dataService.getCurrentUser()
      if (userData) {
        setUser(userData)

        // Fetch user's gigs and orders
        const [userGigs, userOrders] = await Promise.all([
          dataService.getUserGigs(userData.id),
          dataService.getUserOrders(userData.id),
        ])

        setGigs(userGigs)
        setOrders(userOrders)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    totalEarnings: gigs.reduce((sum, gig) => sum + gig.total_orders * gig.price, 0),
    activeGigs: gigs.length,
    totalOrders: gigs.reduce((sum, gig) => sum + gig.total_orders, 0),
    avgRating: gigs.length > 0 ? gigs.reduce((sum, gig) => sum + gig.rating, 0) / gigs.length : 0,
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.full_name || "Student"}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your account today.</p>
        </div>
        <Button asChild>
          <Link href="/create-gig">
            <Plus className="h-4 w-4 mr-2" />
            Create New Gig
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Gigs</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeGigs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeGigs > 0 ? "All performing well" : "Create your first gig"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Excellent performance</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="gigs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gigs">My Gigs</TabsTrigger>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="gigs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Active Gigs</CardTitle>
              <CardDescription>Manage and track the performance of your services</CardDescription>
            </CardHeader>
            <CardContent>
              {gigs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't created any gigs yet.</p>
                  <Button asChild>
                    <Link href="/create-gig">Create Your First Gig</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {gigs.map((gig) => (
                    <div key={gig.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          {gig.images?.[0] ? (
                            <img
                              src={gig.images[0] || "/placeholder.svg"}
                              alt={gig.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Eye className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{gig.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            ${gig.price} • {gig.delivery_days} days delivery
                          </p>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-sm">{gig.rating}</span>
                            <span className="text-sm text-muted-foreground ml-2">({gig.total_orders} orders)</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{gig.category?.name}</Badge>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/gigs/${gig.id}/edit`}>Edit</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Track your recent purchases and their status</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                  <Button asChild>
                    <Link href="/gigs">Browse Services</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={order.seller?.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback>{order.seller?.full_name?.charAt(0) || "S"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{order.gig?.title}</h3>
                          <p className="text-sm text-muted-foreground">by {order.seller?.full_name}</p>
                          <p className="text-sm font-medium">${order.amount}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "active"
                                ? "secondary"
                                : order.status === "delivered"
                                  ? "outline"
                                  : "destructive"
                          }
                        >
                          {order.status}
                        </Badge>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/orders/${order.id}`}>
                            <MessageCircle className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
