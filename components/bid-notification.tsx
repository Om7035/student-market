"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, X, Check, MessageCircle, IndianRupee, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface BidNotification {
  id: string
  type: "new_bid" | "bid_accepted" | "bid_rejected" | "message"
  title: string
  message: string
  amount?: number
  user?: {
    name: string
    avatar: string
    college: string
  }
  timestamp: string
  read: boolean
}

interface BidNotificationProps {
  notifications: BidNotification[]
  onMarkAsRead: (id: string) => void
  onDismiss: (id: string) => void
}

export function BidNotification({ notifications, onMarkAsRead, onDismiss }: BidNotificationProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<BidNotification[]>([])

  useEffect(() => {
    setVisibleNotifications(notifications.filter((n) => !n.read).slice(0, 3))
  }, [notifications])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_bid":
        return <IndianRupee className="h-5 w-5 text-green-600" />
      case "bid_accepted":
        return <Check className="h-5 w-5 text-green-600" />
      case "bid_rejected":
        return <X className="h-5 w-5 text-red-600" />
      case "message":
        return <MessageCircle className="h-5 w-5 text-blue-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "new_bid":
        return "border-green-200 bg-green-50 dark:bg-green-950"
      case "bid_accepted":
        return "border-green-200 bg-green-50 dark:bg-green-950"
      case "bid_rejected":
        return "border-red-200 bg-red-50 dark:bg-red-950"
      case "message":
        return "border-blue-200 bg-blue-50 dark:bg-blue-950"
      default:
        return "border-gray-200 bg-gray-50 dark:bg-gray-950"
    }
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {visibleNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card className={`shadow-lg border-2 ${getNotificationColor(notification.type)}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getNotificationIcon(notification.type)}
                    <h4 className="font-semibold text-sm">{notification.title}</h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDismiss(notification.id)}
                    className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>

                {notification.user && (
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={notification.user.avatar || "/placeholder.svg"} alt={notification.user.name} />
                      <AvatarFallback className="text-xs">{notification.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-xs">
                      <span className="font-medium">{notification.user.name}</span>
                      <span className="text-muted-foreground ml-1">from {notification.user.college}</span>
                    </div>
                  </div>
                )}

                {notification.amount && (
                  <div className="flex items-center gap-1 mb-3">
                    <IndianRupee className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-green-600">₹{notification.amount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{notification.timestamp}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMarkAsRead(notification.id)}
                    className="h-6 text-xs px-2"
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
