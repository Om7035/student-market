import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

interface CategoryCardProps {
  category: {
    id: string
    name: string
    description?: string
    icon?: string
    color?: string
    gigCount?: number
    trending?: boolean
  }
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/gigs?category=${category.id}`}>
      <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 shadow-lg overflow-hidden bg-white dark:bg-gray-800 relative h-full">
        {/* Background Gradient */}
        <div
          className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${category.color}20, ${category.color}10)`,
          }}
        />

        <CardHeader className="text-center pb-4 relative">
          {/* Icon Container */}
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg"
            style={{
              backgroundColor: `${category.color}15`,
              border: `2px solid ${category.color}30`,
            }}
          >
            {category.icon}
          </div>

          {/* Trending Badge */}
          {category.trending && (
            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 text-xs px-2 py-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Hot
            </Badge>
          )}

          <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors duration-300 mb-2">
            {category.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center pt-0 relative">
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{category.description}</p>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4">
            {category.gigCount && (
              <Badge
                variant="secondary"
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: `${category.color}10`,
                  color: category.color,
                }}
              >
                {category.gigCount}+ services
              </Badge>
            )}
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mb-2">
            <div
              className="h-1 rounded-full transition-all duration-700 group-hover:w-full"
              style={{
                backgroundColor: category.color,
                width: category.trending ? "75%" : "45%",
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{category.trending ? "High demand" : "Growing fast"}</p>
        </CardContent>

        {/* Hover Effect Border */}
        <div
          className="absolute inset-0 border-2 border-transparent group-hover:border-opacity-30 rounded-lg transition-all duration-300 pointer-events-none"
          style={{ borderColor: category.color }}
        />
      </Card>
    </Link>
  )
}
