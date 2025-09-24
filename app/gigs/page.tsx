"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, SlidersHorizontal, Filter, Star, TrendingUp, Clock } from "lucide-react"
import { dataService } from "@/lib/data-service"
import { useAuth } from "@/hooks/use-auth"
import type { Gig, Category } from "@/lib/types"
import { GigCard } from "@/components/gig-card"

export default function GigsPage() {
  const { user } = useAuth()
  const [gigs, setGigs] = useState<Gig[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [sortBy, setSortBy] = useState("created_at")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const searchParams = useSearchParams()

  useEffect(() => {
    fetchCategories()

    // Set initial search query from URL params
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    if (search) setSearchQuery(search)
    if (category) setSelectedCategory(category)
  }, [searchParams])

  useEffect(() => {
    fetchGigs()
  }, [searchQuery, selectedCategory, priceRange, sortBy])

  const fetchCategories = async () => {
    const data = await dataService.getCategories()
    setCategories(data)
  }

  const fetchGigs = async () => {
    setLoading(true)

    const data = await dataService.getGigs({
      search: searchQuery,
      categoryId: selectedCategory,
      priceRange,
      sortBy,
    })

    setGigs(data)
    setLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchGigs()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Discover Amazing Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with talented students from top Pune universities. Find expert help or showcase your skills.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              <TrendingUp className="w-4 h-4 mr-1" />
              {gigs.length}+ Active Services
            </Badge>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              <Star className="w-4 h-4 mr-1" />
              4.9★ Average Rating
            </Badge>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="mb-8 space-y-6">
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="search"
                  placeholder="Search for services, skills, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg border-2 focus:border-blue-500 transition-colors"
                />
              </div>
              <Button type="submit" size="lg" className="px-8 bg-gradient-to-r from-blue-600 to-purple-600">
                Search
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="lg"
                onClick={() => setShowFilters(!showFilters)}
                className="px-6"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </Button>
            </div>
          </form>

          {/* Enhanced Category Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant={selectedCategory === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("")}
              className="rounded-full px-6 transition-all duration-200"
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full px-6 transition-all duration-200"
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>

          {/* Enhanced Advanced Filters */}
          {showFilters && (
            <Card className="p-8 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Advanced Filters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className="text-sm font-medium mb-3 block">Price Range (₹)</label>
                  <Slider 
                    value={priceRange} 
                    onValueChange={(value) => setPriceRange(value as [number, number])} 
                    max={1000} 
                    step={25} 
                    className="mb-3" 
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">✨ Newest First</SelectItem>
                      <SelectItem value="popular">🔥 Most Popular</SelectItem>
                      <SelectItem value="rating">⭐ Highest Rated</SelectItem>
                      <SelectItem value="price_low">💰 Price: Low to High</SelectItem>
                      <SelectItem value="price_high">💎 Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Delivery Time</label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox id="express" />
                      <label htmlFor="express" className="text-sm flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-orange-500" />
                        Express (24 hours)
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox id="fast" />
                      <label htmlFor="fast" className="text-sm flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-blue-500" />
                        Fast (up to 3 days)
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox id="standard" />
                      <label htmlFor="standard" className="text-sm flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-green-500" />
                        Standard (up to 7 days)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Enhanced Results Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-lg text-muted-foreground">
              {loading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Searching amazing services...
                </span>
              ) : (
                <span>
                  <span className="font-semibold text-blue-600">{gigs.length}</span> services found
                  {searchQuery && <span className="ml-2">for "{searchQuery}"</span>}
                </span>
              )}
            </p>
          </div>
          {user && (
            <Button asChild className="bg-gradient-to-r from-green-600 to-blue-600">
              <a href="/create-gig">
                + Create Service
              </a>
            </Button>
          )}
        </div>

        {/* Enhanced Gigs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(12)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : gigs.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold mb-2">No services found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search criteria or browse all categories.</p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("")
                    setPriceRange([0, 1000])
                  }}
                >
                  Clear All Filters
                </Button>
                <Button variant="outline" asChild>
                  <a href="/create-gig">
                    Create Your Service
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {gigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
