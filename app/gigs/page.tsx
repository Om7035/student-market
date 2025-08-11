"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"
import { dataService } from "@/lib/data-service"
import type { Gig, Category } from "@/lib/types"
import { GigCard } from "@/components/gig-card"

export default function GigsPage() {
  const [gigs, setGigs] = useState<Gig[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [sortBy, setSortBy] = useState("created_at")
  const [showFilters, setShowFilters] = useState(false)

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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Browse Services</h1>
        <p className="text-muted-foreground">
          Discover talented students offering amazing services across various categories.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
          <Button type="button" variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("")}
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon} {category.name}
            </Button>
          ))}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={5} className="mb-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Newest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Delivery Time</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="express" />
                    <label htmlFor="express" className="text-sm">
                      Express (24 hours)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="fast" />
                    <label htmlFor="fast" className="text-sm">
                      Fast (up to 3 days)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="standard" />
                    <label htmlFor="standard" className="text-sm">
                      Standard (up to 7 days)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground">{loading ? "Loading..." : `${gigs.length} services found`}</p>
      </div>

      {/* Gigs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-t-lg"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : gigs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No services found matching your criteria.</p>
          <Button
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("")
              setPriceRange([0, 500])
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gigs.map((gig) => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </div>
      )}
    </div>
  )
}
