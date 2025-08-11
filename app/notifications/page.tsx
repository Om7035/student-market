"use client"

import { useState } from "react"
import { NotificationList } from "@/components/notification-list"
import { Separator } from "@/components/ui/separator"

// Mock data for notifications
const mockNotifications = [
  {
    id: "1",
    type: "new_bid" as const,
    title: "New Bid Received",
    message: "Someone placed a bid on your Python tutoring request",
    amount: 450,
    user: {
      name: "Arjun Patel",
      avatar: "/placeholder.svg?height=40&width=40&text=AP",
      college: "Pune University",
    },
    timestamp: "2 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "bid_accepted" as const,
    title: "Bid Accepted!",
    message: "Your bid for UI/UX design project has been accepted",
    amount: 800,
    user: {
      name: "Priya Sharma",
      avatar: "/placeholder.svg?height=40&width=40&text=PS",
      college: "COEP Pune",
    },
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "message" as const,
    title: "New Message",
    message: "You have a new message from Rohan regarding the Web Dev gig.",
    user: {
      name: "Rohan Singh",
      avatar: "/placeholder.svg?height=40&width=40&text=RS",
      college: "VIT Pune",
    },
    timestamp: "3 hours ago",
    read: false,
  },
  {
    id: "4",
    type: "general" as const,
    title: "Platform Update",
    message: "New features have been rolled out! Check out the latest updates.",
    timestamp: "Yesterday",
    read: true,
  },
  {
    id: "5",
    type: "bid_rejected" as const,
    title: "Bid Rejected",
    message: "Your bid for the Content Writing gig was not accepted.",
    amount: 300,
    user: {
      name: "Sneha Reddy",
      avatar: "/placeholder.svg?height=40&width=40&text=SR",
      college: "Symbiosis",
    },
    timestamp: "2 days ago",
    read: true,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleDismiss = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <Separator className="mb-6" />
      <NotificationList notifications={notifications} onMarkAsRead={handleMarkAsRead} onDismiss={handleDismiss} />
    </div>
  )
}
