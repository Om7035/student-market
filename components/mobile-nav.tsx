"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Search, MessageCircle, User, Plus, Target, BarChart3, Star, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface MobileNavProps {
  user: any
  unreadCount: number
}

export function MobileNav({ user, unreadCount }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/gigs", label: "Browse Gigs", icon: Search },
    { href: "/create-gig", label: "Create Gig", icon: Plus },
    { href: "/messages", label: "Messages", icon: MessageCircle },
    { href: "/dashboard/bids", label: "My Bids", icon: Target },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/reviews", label: "Reviews", icon: Star },
    { href: "/dashboard", label: "Dashboard", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden">
        <div className="grid grid-cols-5 gap-1 p-2">
          <Link
            href="/"
            className="flex flex-col items-center justify-center p-2 text-xs text-muted-foreground hover:text-blue-600 transition-colors"
          >
            <Home className="h-5 w-5 mb-1" />
            <span>Home</span>
          </Link>
          <Link
            href="/gigs"
            className="flex flex-col items-center justify-center p-2 text-xs text-muted-foreground hover:text-blue-600 transition-colors"
          >
            <Search className="h-5 w-5 mb-1" />
            <span>Browse</span>
          </Link>
          <Link
            href="/create-gig"
            className="flex flex-col items-center justify-center p-2 text-xs text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"
          >
            <Plus className="h-5 w-5 mb-1" />
            <span>Create</span>
          </Link>
          <Link
            href="/messages"
            className="flex flex-col items-center justify-center p-2 text-xs text-muted-foreground hover:text-blue-600 transition-colors relative"
          >
            <MessageCircle className="h-5 w-5 mb-1" />
            <span>Messages</span>
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-500">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center p-2 text-xs text-muted-foreground hover:text-blue-600 transition-colors">
                <Menu className="h-5 w-5 mb-1" />
                <span>More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-3">
                    {user && (
                      <>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {user.full_name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <h3 className="font-semibold">{user.full_name || "User"}</h3>
                          <p className="text-sm text-muted-foreground">{user.college}</p>
                        </div>
                      </>
                    )}
                  </div>
                  <ThemeToggle />
                </div>
                <nav className="flex-1 p-4">
                  <div className="space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Spacing */}
      <div className="h-20 md:hidden" />
    </>
  )
}
