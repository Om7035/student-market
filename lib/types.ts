export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  college: string
  major?: string
  year?: string
  city?: string
  bio?: string
  skills?: string[]
  is_verified: boolean
  reputation_score: number
  total_earnings: number
  wallet_balance?: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  color: string
  icon?: string
  created_at: string
  trending?: boolean
  gigCount?: number
}

export interface Gig {
  id: string
  user_id: string
  category_id: string
  title: string
  description?: string
  price: number
  delivery_days: number
  rating: number
  total_orders: number
  tags?: string[]
  requirements?: string
  is_active: boolean
  gig_type: "service" | "request"
  collaboration_type: "individual" | "team"
  skill_level: "beginner" | "intermediate" | "advanced"
  created_at: string
  updated_at: string
  user?: User
  category?: Category
}

export interface Bid {
  id: string
  gig_id: string
  bidder_id: string
  amount: number
  delivery_days: number
  proposal: string
  status: "pending" | "accepted" | "rejected" | "withdrawn"
  created_at: string
  updated_at: string
  gig?: Gig
  bidder?: User
}

export interface Order {
  id: string
  gig_id: string
  buyer_id: string
  seller_id: string
  amount: number
  status: "pending" | "in_progress" | "completed" | "cancelled" | "disputed"
  payment_status: "pending" | "paid" | "refunded"
  delivery_date?: string
  created_at: string
  updated_at: string
  gig?: Gig
  buyer?: User
  seller?: User
}

export interface Review {
  id: string
  order_id: string
  gig_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment?: string
  created_at: string
  updated_at: string
  order?: Order
  reviewer?: User
  reviewee?: User
  gig_title?: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: "text" | "image" | "file"
  file_url?: string
  is_read: boolean
  created_at: string
  sender?: User
}

export interface Conversation {
  id: string
  participants: string[]
  last_message?: string
  last_message_at: string
  created_at: string
  messages?: Message[]
}

export interface Notification {
  id: string
  user_id: string
  type: "bid_received" | "bid_accepted" | "bid_rejected" | "order_created" | "order_completed" | "message_received"
  title: string
  message: string
  data?: any
  read: boolean
  created_at: string
}

export interface UpdateUserData {
  full_name?: string
  bio?: string
  college?: string
  major?: string
  year?: string
  city?: string
  skills?: string[]
  avatar_url?: string
}
