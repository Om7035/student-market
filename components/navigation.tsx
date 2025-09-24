"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Bell, MessageCircle, User, Settings, LogOut, Plus, MapPin, Target, DollarSign, Star, Package } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { ThemeToggle } from "@/components/theme-toggle"

// Mock notifications for unread count
const mockNotifications = [
  { id: "1", read: false },
  { id: "2", read: false },
  { id: "3", read: true },
]

export function Navigation() {
  const { user, loading, signOut, isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [unreadCount, setUnreadCount] = useState(2) // Mock unread notifications
  const router = useRouter()

  useEffect(() => {
    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/gigs?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg border-b"
            : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">SM</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Student Market
                </span>
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>Pune</span>
                </div>
              </div>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search for services in Pune..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-11 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                />
              </div>
            </form>

            {/* Navigation Items */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <ThemeToggle />

              {loading ? (
                /* Loading State */
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-9 w-20 rounded-xl" />
                </div>
              ) : isAuthenticated && user ? (
                /* Authenticated User */
                <>
                  {/* Create Gig Button */}
                  <Button
                    asChild
                    size="sm"
                    className="hidden sm:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl px-4 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href="/create-gig">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Gig
                    </Link>
                  </Button>

                  {/* Dashboard */}
                  <Button variant="ghost" size="sm" className="relative rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950" asChild>
                    <Link href="/dashboard">
                      <Package className="h-5 w-5" />
                    </Link>
                  </Button>

                  {/* Bids Dashboard */}
                  <Button variant="ghost" size="sm" className="relative rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950" asChild>
                    <Link href="/dashboard/bids">
                      <Target className="h-5 w-5" />
                    </Link>
                  </Button>

                  {/* Messages */}
                  <Button variant="ghost" size="sm" className="relative rounded-xl hover:bg-green-50 dark:hover:bg-green-950" asChild>
                    <Link href="/messages">
                      <MessageCircle className="h-5 w-5" />
                    </Link>
                  </Button>

                  {/* Notifications */}
                  <Button variant="ghost" size="sm" className="relative rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-950" asChild>
                    <Link href="/notifications">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-500 animate-pulse">
                          {unreadCount}
                        </Badge>
                      )}
                    </Link>
                  </Button>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full ring-2 ring-blue-100 dark:ring-blue-900 hover:ring-blue-200 dark:hover:ring-blue-800 transition-all duration-300 hover:scale-105"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_url || ""} alt={user.full_name || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                            {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {user.is_verified && (
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                            <Star className="h-2 w-2 text-white fill-current" />
                          </div>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80" align="end" forceMount>
                      {/* User Info Header */}
                      <div className="flex items-center justify-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg m-2">
                        <Avatar className="h-16 w-16 ring-2 ring-white dark:ring-gray-800">
                          <AvatarImage src={user.avatar_url || ""} alt={user.full_name || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-bold">
                            {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1 leading-none flex-1">
                          <p className="font-semibold text-lg">{user.full_name || "Student"}</p>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                          <p className="text-xs text-muted-foreground">{user.college}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              <DollarSign className="h-3 w-3 mr-1" />
                              ₹{user.wallet_balance?.toLocaleString("en-IN") || "0"}
                            </Badge>
                            <Badge variant={user.is_verified ? "default" : "outline"} className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              {user.reputation_score || 0}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenuSeparator />
                      
                      {/* Menu Items */}
                      <DropdownMenuItem asChild>
                        <Link href={`/profile/${user.id}`} className="cursor-pointer">
                          <User className="mr-3 h-4 w-4" />
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/profile/${user.id}/edit`} className="cursor-pointer">
                          <Settings className="mr-3 h-4 w-4" />
                          Edit Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="cursor-pointer">
                          <Package className="mr-3 h-4 w-4" />
                          My Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/gigs?user=${user.id}" className="cursor-pointer">
                          <Target className="mr-3 h-4 w-4" />
                          My Gigs
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/reviews" className="cursor-pointer">
                          <Star className="mr-3 h-4 w-4" />
                          Reviews
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                /* Not Authenticated */
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" asChild className="rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950">
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Link href="/signup">Join Now</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
