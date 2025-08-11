"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Clock, ShieldCheck, Heart, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface GigCardProps {
  gig: {
    id: string
    title: string
    description?: string
    price: number
    delivery_days: number
    rating: number
    total_orders: number
    tags?: string[]
    user?: {
      full_name?: string
      avatar_url?: string
      college?: string
      is_verified?: boolean
    }
    category?: {
      name: string
      color: string
    }
  }
}

export function GigCard({ gig }: GigCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <Link href={`/gigs/${gig.id}`}>
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 relative rounded-lg">
        <CardContent className="p-6">
          {/* Header with Category and Like Button */}
          <div className="flex items-center justify-between mb-4">
            {gig.category && (
              <Badge
                className="text-white border-0 font-medium px-3 py-1"
                style={{ backgroundColor: gig.category.color }}
              >
                {gig.category.name}
              </Badge>
            )}
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsLiked(!isLiked)
              }}
              className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <Heart
                className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-400"}`}
              />
            </button>
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
            {gig.title}
          </h3>

          {/* Description */}
          {gig.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{gig.description}</p>
          )}

          {/* Tags */}
          {gig.tags && gig.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {gig.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                >
                  {tag}
                </Badge>
              ))}
              {gig.tags.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  +{gig.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* User Info */}
          <div className="flex items-center mb-4">
            <Avatar className="h-10 w-10 mr-3 ring-2 ring-blue-100 dark:ring-blue-900">
              <AvatarImage src={gig.user?.avatar_url || "/placeholder.svg"} alt={gig.user?.full_name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                {gig.user?.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold truncate text-sm">{gig.user?.full_name || "Anonymous"}</p>
                {gig.user?.is_verified && <ShieldCheck className="h-4 w-4 text-blue-500 flex-shrink-0" />}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{gig.user?.college}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{gig.rating}</span>
                <span className="text-xs">({gig.total_orders})</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>{gig.total_orders} orders</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                {gig.delivery_days} day{gig.delivery_days !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600">₹{gig.price.toLocaleString("en-IN")}</div>
            <Badge variant="outline" className="text-xs font-medium">
              Starting at
            </Badge>
          </div>
        </CardContent>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-800 rounded-lg transition-colors duration-300 pointer-events-none" />
      </Card>
    </Link>
  )
}
