"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, IndianRupee, Star, Target, Award, Eye, Zap } from "lucide-react"

// Mock data for analytics
const earningsData = [
  { month: "Jan", earnings: 2400, orders: 12, avgRating: 4.2 },
  { month: "Feb", earnings: 3200, orders: 18, avgRating: 4.4 },
  { month: "Mar", earnings: 4100, orders: 24, avgRating: 4.6 },
  { month: "Apr", earnings: 3800, orders: 21, avgRating: 4.5 },
  { month: "May", earnings: 5200, orders: 32, avgRating: 4.7 },
  { month: "Jun", earnings: 6100, orders: 38, avgRating: 4.8 },
]

const categoryData = [
  { name: "Academic Help", value: 35, color: "#3B82F6" },
  { name: "Tech Services", value: 28, color: "#8B5CF6" },
  { name: "Design", value: 20, color: "#EC4899" },
  { name: "Writing", value: 12, color: "#10B981" },
  { name: "Others", value: 5, color: "#F59E0B" },
]

const bidTrendsData = [
  { week: "Week 1", bidsReceived: 15, bidsWon: 8, successRate: 53 },
  { week: "Week 2", bidsReceived: 22, bidsWon: 14, successRate: 64 },
  { week: "Week 3", bidsReceived: 18, bidsWon: 12, successRate: 67 },
  { week: "Week 4", bidsReceived: 25, bidsWon: 18, successRate: 72 },
]

const gigPerformanceData = [
  { name: "Python Tutoring", views: 245, orders: 18, conversion: 7.3, rating: 4.9 },
  { name: "Resume Design", views: 189, orders: 12, conversion: 6.3, rating: 4.7 },
  { name: "UI/UX Design", views: 156, orders: 8, conversion: 5.1, rating: 4.8 },
  { name: "Content Writing", views: 134, orders: 6, conversion: 4.5, rating: 4.6 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedMetric, setSelectedMetric] = useState("earnings")

  const totalEarnings = earningsData.reduce((sum, item) => sum + item.earnings, 0)
  const totalOrders = earningsData.reduce((sum, item) => sum + item.orders, 0)
  const avgRating = earningsData.reduce((sum, item) => sum + item.avgRating, 0) / earningsData.length
  const totalBids = bidTrendsData.reduce((sum, item) => sum + item.bidsReceived, 0)
  const totalBidsWon = bidTrendsData.reduce((sum, item) => sum + item.bidsWon, 0)
  const overallSuccessRate = totalBids > 0 ? Math.round((totalBidsWon / totalBids) * 100) : 0

  const stats = [
    {
      title: "Total Earnings",
      value: `₹${totalEarnings.toLocaleString("en-IN")}`,
      change: "+23%",
      trend: "up",
      icon: IndianRupee,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      change: "+18%",
      trend: "up",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Average Rating",
      value: avgRating.toFixed(1),
      change: "+0.3",
      trend: "up",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
    },
    {
      title: "Bid Success Rate",
      value: `${overallSuccessRate}%`,
      change: "+12%",
      trend: "up",
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">Track your performance and growth on Student Market</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="3months">Last 3 months</SelectItem>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-xl border-0 hover:shadow-2xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${
                      stat.trend === "up"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gigs">Gig Performance</TabsTrigger>
            <TabsTrigger value="bids">Bidding Analytics</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings Chart */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Earnings Trend
                  </CardTitle>
                  <CardDescription>Your monthly earnings over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [
                          name === "earnings" ? `₹${value}` : value,
                          name === "earnings" ? "Earnings" : "Orders",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="earnings"
                        stroke="#3B82F6"
                        fill="url(#earningsGradient)"
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    Service Categories
                  </CardTitle>
                  <CardDescription>Distribution of your services by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Orders and Rating Chart */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Orders & Rating Correlation
                </CardTitle>
                <CardDescription>How your rating affects order volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="orders" fill="#3B82F6" name="Orders" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgRating"
                      stroke="#F59E0B"
                      strokeWidth={3}
                      name="Average Rating"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gigs" className="space-y-6">
            {/* Gig Performance Table */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  Gig Performance Metrics
                </CardTitle>
                <CardDescription>Detailed performance analysis of your active gigs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-semibold">Gig Name</th>
                        <th className="text-left p-4 font-semibold">Views</th>
                        <th className="text-left p-4 font-semibold">Orders</th>
                        <th className="text-left p-4 font-semibold">Conversion</th>
                        <th className="text-left p-4 font-semibold">Rating</th>
                        <th className="text-left p-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gigPerformanceData.map((gig, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="p-4">
                            <div className="font-medium">{gig.name}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-muted-foreground" />
                              {gig.views}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-muted-foreground" />
                              {gig.orders}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant="secondary"
                              className={
                                gig.conversion >= 6
                                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                  : gig.conversion >= 4
                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                              }
                            >
                              {gig.conversion}%
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {gig.rating}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge
                              className={
                                gig.conversion >= 6
                                  ? "bg-green-600 hover:bg-green-600"
                                  : gig.conversion >= 4
                                    ? "bg-yellow-600 hover:bg-yellow-600"
                                    : "bg-red-600 hover:bg-red-600"
                              }
                            >
                              {gig.conversion >= 6 ? "Excellent" : gig.conversion >= 4 ? "Good" : "Needs Improvement"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bids" className="space-y-6">
            {/* Bidding Success Rate */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Bidding Success Trends
                </CardTitle>
                <CardDescription>Track your bidding performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={bidTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="bidsReceived" fill="#8B5CF6" name="Bids Received" />
                    <Bar dataKey="bidsWon" fill="#10B981" name="Bids Won" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Success Rate Line Chart */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Success Rate Improvement
                </CardTitle>
                <CardDescription>Your bidding success rate is improving over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bidTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, "Success Rate"]} />
                    <Line
                      type="monotone"
                      dataKey="successRate"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {/* AI Insights Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    Performance Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-green-600 mb-2">🎯 Opportunity Detected</h4>
                    <p className="text-sm text-muted-foreground">
                      Your Python tutoring gig has 40% higher conversion than average. Consider creating similar
                      programming courses.
                    </p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-blue-600 mb-2">📈 Growth Trend</h4>
                    <p className="text-sm text-muted-foreground">
                      Your earnings have grown 23% this month. You're on track to reach ₹10,000 by month-end.
                    </p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-purple-600 mb-2">⭐ Rating Impact</h4>
                    <p className="text-sm text-muted-foreground">
                      Maintaining your 4.8+ rating could increase your order volume by 15% based on platform data.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-orange-600 mb-2">🚀 Boost Visibility</h4>
                    <p className="text-sm text-muted-foreground">
                      Add more keywords to your gig titles. "Data Structures" and "Algorithms" are trending in your
                      category.
                    </p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-red-600 mb-2">⚡ Quick Win</h4>
                    <p className="text-sm text-muted-foreground">
                      Respond to messages 20% faster. Quick responses increase order conversion by 30%.
                    </p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-indigo-600 mb-2">💡 New Opportunity</h4>
                    <p className="text-sm text-muted-foreground">
                      Consider offering "Interview Preparation" services. High demand in your skill area.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Market Trends */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Market Trends in Pune
                </CardTitle>
                <CardDescription>What's trending in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">↗ 45%</div>
                    <div className="text-sm font-medium mb-1">Programming Help</div>
                    <div className="text-xs text-muted-foreground">Demand increase this month</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">↗ 32%</div>
                    <div className="text-sm font-medium mb-1">Resume Services</div>
                    <div className="text-xs text-muted-foreground">Peak placement season</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">↗ 28%</div>
                    <div className="text-sm font-medium mb-1">Design Projects</div>
                    <div className="text-xs text-muted-foreground">Startup season boost</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
