"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, X, Check, MessageCircle, IndianRupee, Clock } from "lucide-react"

interface Notification {
  id: string
  type: "new_bid" | "bid_accepted" | "bid_rejected" | "message" | "general"
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

interface NotificationListProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onDismiss: (id: string) => void
}

export function NotificationList({ notifications, onMarkAsRead, onDismiss }: NotificationListProps) {
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

  const getNotificationColor = (read: boolean) => {
    return read
      ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      : "bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-700 shadow-md"
  }

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          <Bell className="mx-auto h-12 w-12 mb-4 text-gray-400" />
          <p className="text-lg font-semibold">No new notifications</p>
          <p className="text-sm">You're all caught up!</p>
        </div>
      ) : (
        notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`${getNotificationColor(notification.read)} transition-colors duration-200`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getNotificationIcon(notification.type)}
                  <h4 className="font-semibold text-sm">{notification.title}</h4>
                  {!notification.read && (
                    <span
                      className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"
                      aria-label="Unread notification"
                    ></span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDismiss(notification.id)}
                  className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Dismiss notification</span>
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
                {!notification.read && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMarkAsRead(notification.id)}
                    className="h-6 text-xs px-2"
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
