"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Send,
  Search,
  MoreVertical,
  Paperclip,
  ImageIcon,
  Phone,
  Video,
  CheckCircle2,
  MessageCircle,
  Smile,
} from "lucide-react"
import { mockUsers } from "@/lib/mock-data"
import type { User } from "@/lib/types"

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  timestamp: string
  read: boolean
  type: "text" | "image" | "file" | "gig_offer" | "payment"
  metadata?: any
}

interface Conversation {
  id: string
  participant: User
  last_message: Message
  unread_count: number
  is_online: boolean
  gig_title?: string
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    participant: mockUsers[1],
    last_message: {
      id: "1",
      sender_id: "2",
      receiver_id: "1",
      content: "Hi! I'm interested in your Python tutoring service. Can we discuss the details?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      read: false,
      type: "text",
    },
    unread_count: 2,
    is_online: true,
    gig_title: "Python Programming Help",
  },
  {
    id: "2",
    participant: mockUsers[2],
    last_message: {
      id: "2",
      sender_id: "1",
      receiver_id: "3",
      content: "Thanks for accepting my bid! When can we start the UI design project?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true,
      type: "text",
    },
    unread_count: 0,
    is_online: false,
    gig_title: "Mobile App UI Design",
  },
]

const mockMessages: Message[] = [
  {
    id: "1",
    sender_id: "2",
    receiver_id: "1",
    content: "Hi! I saw your Python tutoring gig and I'm really interested.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: true,
    type: "text",
  },
  {
    id: "2",
    sender_id: "1",
    receiver_id: "2",
    content: "Great! I'd be happy to help. What specific topics do you need help with?",
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    read: true,
    type: "text",
  },
  {
    id: "3",
    sender_id: "2",
    receiver_id: "1",
    content: "I'm struggling with data structures and algorithms. I have an exam next week.",
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    read: true,
    type: "text",
  },
  {
    id: "4",
    sender_id: "1",
    receiver_id: "2",
    content:
      "Perfect! I specialize in DSA. I can help you with practice problems and concepts. My rate is ₹500 for a 2-hour session.",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: true,
    type: "text",
  },
  {
    id: "5",
    sender_id: "2",
    receiver_id: "1",
    content: "That sounds great! Can we schedule a session for tomorrow evening?",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
    type: "text",
  },
]

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0])
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      sender_id: "1", // Current user
      receiver_id: selectedConversation.participant.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
      type: "text",
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Update conversation last message
    setConversations(
      conversations.map((conv) => (conv.id === selectedConversation.id ? { ...conv, last_message: message } : conv)),
    )

    // Simulate typing indicator and response
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender_id: selectedConversation.participant.id,
        receiver_id: "1",
        content: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date().toISOString(),
        read: false,
        type: "text",
      }
      setMessages((prev) => [...prev, response])
    }, 2000)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participant.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.gig_title?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-4 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full shadow-xl border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Messages
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-1 p-4">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedConversation?.id === conversation.id
                            ? "bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={conversation.participant.avatar_url || "/placeholder.svg"}
                                alt={conversation.participant.full_name}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                {conversation.participant.full_name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {conversation.is_online && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-sm truncate">{conversation.participant.full_name}</h4>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(conversation.last_message.timestamp)}
                              </span>
                            </div>
                            {conversation.gig_title && (
                              <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                                Re: {conversation.gig_title}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-muted-foreground truncate">
                                {conversation.last_message.content}
                              </p>
                              {conversation.unread_count > 0 && (
                                <Badge className="bg-red-500 hover:bg-red-500 text-white text-xs px-2 py-1">
                                  {conversation.unread_count}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            {selectedConversation ? (
              <Card className="h-full shadow-xl border-0 flex flex-col">
                {/* Chat Header */}
                <CardHeader className="pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={selectedConversation.participant.avatar_url || "/placeholder.svg"}
                            alt={selectedConversation.participant.full_name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {selectedConversation.participant.full_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {selectedConversation.is_online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedConversation.participant.full_name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{selectedConversation.participant.college}</span>
                          {selectedConversation.is_online ? (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              Online
                            </Badge>
                          ) : (
                            <span className="text-xs">Last seen 2h ago</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Block User</DropdownMenuItem>
                          <DropdownMenuItem>Report</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  {selectedConversation.gig_title && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Discussion about: {selectedConversation.gig_title}
                      </p>
                    </div>
                  )}
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-[calc(100vh-300px)] p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender_id === "1" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                              message.sender_id === "1"
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span className="text-xs opacity-70">
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {message.sender_id === "1" && <CheckCircle2 className="h-3 w-3 opacity-70" />}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-2xl">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="pr-12"
                      />
                      <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-full shadow-xl border-0 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
