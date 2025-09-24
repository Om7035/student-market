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
import { Search, Bell, MessageCircle, User, Settings, LogOut, Plus, MapPin, Target } from "lucide-react"
import { dataService } from "@/lib/data-service"
import { supabase } from "@/lib/supabase"
import type { User as UserType } from "@/lib/types"
import { ThemeToggle } from "@/components/theme-toggle"

// Mock notifications for unread count
const mockNotifications = [
  { id: "1", read: false },
  { id: "2", read: false },
  { id: "3", read: true },
]

export function Navigation() {
  const [user, setUser] = useState<UserType | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [unreadCount, setUnreadCount] = useState(mockNotifications.filter((n) => !n.read).length)
  const router = useRouter()

  useEffect(() => {
    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)

    // Get initial session
    dataService.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile()
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = dataService.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        fetchUserProfile()
      } else {
        setUser(null)
      }
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async () => {
    const userData = await dataService.getCurrentUser()
    if (userData) {
      setUser(userData)
    }
  }

  const handleSignOut = async () => {
    await dataService.signOut()
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

              {user ? (
                <>
                  {/* Create Gig Button */}
                  <Button
                    asChild
                    size="sm"
                    className="hidden sm:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl px-4"
                  >
                    <Link href="/create-gig">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Gig
                    </Link>
                  </Button>

                  {/* Bids Dashboard */}
                  <Button variant="ghost" size="sm" className="relative rounded-xl" asChild>
                    <Link href="/dashboard/bids">
                      <Target className="h-5 w-5" />
                    </Link>
                  </Button>

                  {/* Messages */}
                  <Button variant="ghost" size="sm" className="relative rounded-xl" asChild>
                    <Link href="/messages">
                      <MessageCircle className="h-5 w-5" />
                    </Link>
                  </Button>

                  {/* Notifications */}
                  <Button variant="ghost" size="sm" className="relative rounded-xl" asChild>
                    <Link href="/notifications">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-500">
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
                        className="relative h-10 w-10 rounded-full ring-2 ring-blue-100 dark:ring-blue-900 hover:ring-blue-200 dark:hover:ring-blue-800 transition-all"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_url || ""} alt={user.full_name || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64" align="end" forceMount>
                      <div className="flex items-center justify-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg m-2">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar_url || ""} alt={user.full_name || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-semibold">{user.full_name || "User"}</p>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                          <Badge variant="secondary" className="text-xs w-fit">
                            ₹{user.wallet_balance?.toLocaleString("en-IN") || "0"} balance
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="cursor-pointer">
                          <User className="mr-3 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/bids" className="cursor-pointer">
                          <Target className="mr-3 h-4 w-4" />
                          My Bids
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="mr-3 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer">
                          <Settings className="mr-3 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="cursor-pointer text-red-600 dark:text-red-400"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" asChild className="rounded-xl">
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
                  >
                    <Link href="/signup">Join Now</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* BidNotification component removed */}
    </>
  )
}
