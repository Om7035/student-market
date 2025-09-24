import { supabase } from "./supabase"
import { mockCategories, mockGigs, mockOrders, mockUsers, mockReviews } from "./mock-data"
import type { User, Gig, Category, Order, Review } from "./types"

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE && process.env.NEXT_PUBLIC_SUPABASE_ANON)
}

export const dataService = {
  // Categories
  async getCategories(): Promise<Category[]> {
    if (!isSupabaseConfigured()) {
      return mockCategories
    }

    try {
      const { data, error } = await supabase.from("categories").select("*").order("name")

      if (error) throw error
      return data || []
    } catch (error) {
      console.warn("Falling back to mock data:", error)
      return mockCategories
    }
  },

  // Gigs
  async getGigs(filters?: {
    search?: string
    categoryId?: string
    priceRange?: [number, number]
    sortBy?: string
  }): Promise<Gig[]> {
    if (!isSupabaseConfigured()) {
      let filteredGigs = [...mockGigs]

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase()
        filteredGigs = filteredGigs.filter(
          (gig) =>
            gig.title.toLowerCase().includes(searchLower) || gig.description?.toLowerCase().includes(searchLower),
        )
      }

      if (filters?.categoryId) {
        filteredGigs = filteredGigs.filter((gig) => gig.category_id === filters.categoryId)
      }

      if (filters?.priceRange) {
        filteredGigs = filteredGigs.filter(
          (gig) => gig.price >= filters.priceRange![0] && gig.price <= filters.priceRange![1],
        )
      }

      // Sort
      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case "price_low":
            filteredGigs.sort((a, b) => a.price - b.price)
            break
          case "price_high":
            filteredGigs.sort((a, b) => b.price - a.price)
            break
          case "rating":
            filteredGigs.sort((a, b) => b.rating - a.rating)
            break
          case "popular":
            filteredGigs.sort((a, b) => b.total_orders - a.total_orders)
            break
        }
      }

      return filteredGigs
    }

    try {
      let query = supabase
        .from("gigs")
        .select(`
          *,
          user:users(full_name, avatar_url, college, is_verified),
          category:categories(name, color)
        `)
        .eq("is_active", true)

      if (filters?.priceRange) {
        query = query.gte("price", filters.priceRange[0]).lte("price", filters.priceRange[1])
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters?.categoryId) {
        query = query.eq("category_id", filters.categoryId)
      }

      // Sort options
      switch (filters?.sortBy) {
        case "price_low":
          query = query.order("price", { ascending: true })
          break
        case "price_high":
          query = query.order("price", { ascending: false })
          break
        case "rating":
          query = query.order("rating", { ascending: false })
          break
        case "popular":
          query = query.order("total_orders", { ascending: false })
          break
        default:
          query = query.order("created_at", { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.warn("Falling back to mock data:", error)
      return mockGigs
    }
  },

  // User
  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured()) {
      return mockUsers[0] || null
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) return null

      const { data, error } = await supabase.from("users").select("*").eq("id", session.user.id).single()

      if (error) throw error
      return data
    } catch (error) {
      console.warn("Error fetching current user:", error)
      return null
    }
  },

  async getUserById(userId: string): Promise<User | null> {
    if (!isSupabaseConfigured()) {
      return mockUsers.find((user) => user.id === userId) || null
    }

    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

      if (error) throw error
      return data
    } catch (error) {
      console.warn(`Error fetching user with ID ${userId}:`, error)
      return null
    }
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured. Cannot update user.")
      // For mock data, simulate update
      const userIndex = mockUsers.findIndex((u) => u.id === userId)
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates, updated_at: new Date().toISOString() }
        return mockUsers[userIndex]
      }
      return null
    }

    try {
      const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

      if (error) throw error
      return data
    } catch (error) {
      console.error(`Error updating user with ID ${userId}:`, error)
      return null
    }
  },

  // User's gigs
  async getUserGigs(userId: string): Promise<Gig[]> {
    if (!isSupabaseConfigured()) {
      return mockGigs.filter((gig) => gig.user_id === userId)
    }

    try {
      const { data, error } = await supabase
        .from("gigs")
        .select(`
          *,
          category:categories(name, color),
          orders(id, status)
        `)
        .eq("user_id", userId)
        .eq("is_active", true)

      if (error) throw error
      return data || []
    } catch (error) {
      console.warn("Falling back to mock data:", error)
      return mockGigs.filter((gig) => gig.user_id === userId)
    }
  },

  // User's orders
  async getUserOrders(userId: string): Promise<Order[]> {
    if (!isSupabaseConfigured()) {
      return mockOrders.filter((order) => order.buyer_id === userId)
    }

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          gig:gigs(title, images),
          seller:users(full_name, avatar_url)
        `)
        .eq("buyer_id", userId)
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) throw error
      return data || []
    } catch (error) {
      console.warn("Falling back to mock data:", error)
      return mockOrders.filter((order) => order.buyer_id === userId)
    }
  },

  // Reviews for a user (as a seller)
  async getReviewsForUser(userId: string): Promise<Review[]> {
    if (!isSupabaseConfigured()) {
      const userGigs = mockGigs.filter((gig) => gig.user_id === userId)
      const reviewsForUserGigs = mockReviews.filter((review) => userGigs.some((gig) => gig.id === review.gig_id))
      return reviewsForUserGigs.map((review) => ({
        ...review,
        reviewer: mockUsers.find((u) => u.id === review.reviewer_id),
        gig_title: mockGigs.find((g) => g.id === review.gig_id)?.title,
      }))
    }

    try {
      const { data: gigsData, error: gigsError } = await supabase.from("gigs").select("id, title").eq("user_id", userId)

      if (gigsError) throw gigsError
      const gigIds = gigsData.map((gig) => gig.id)
      const gigTitlesMap = new Map(gigsData.map((gig) => [gig.id, gig.title]))

      if (gigIds.length === 0) return []

      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          reviewer:users(full_name, avatar_url)
        `)
        .in("gig_id", gigIds)
        .order("created_at", { ascending: false })

      if (error) throw error

      return (
        data.map((review) => ({
          ...review,
          gig_title: gigTitlesMap.get(review.gig_id),
        })) || []
      )
    } catch (error) {
      console.warn(`Falling back to mock data for reviews for user ${userId}:`, error)
      const userGigs = mockGigs.filter((gig) => gig.user_id === userId)
      const reviewsForUserGigs = mockReviews.filter((review) => userGigs.some((gig) => gig.id === review.gig_id))
      return reviewsForUserGigs.map((review) => ({
        ...review,
        reviewer: mockUsers.find((u) => u.id === review.reviewer_id),
        gig_title: mockGigs.find((g) => g.id === review.gig_id)?.title,
      }))
    }
  },

  // Auth methods
  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase not configured. Please set up your environment variables.")
    }

    return await supabase.auth.signInWithPassword({ email, password })
  },

  async signUp(email: string, password: string, userData: { full_name: string; college: string }) {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase not configured. Please set up your environment variables.")
    }

    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  },

  async resendConfirmationEmail(email: string) {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase not configured. Please set up your environment variables.")
    }

    return await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  },

  async signOut() {
    if (!isSupabaseConfigured()) {
      return { error: null }
    }

    return await supabase.auth.signOut()
  },

  async getSession() {
    if (!isSupabaseConfigured()) {
      return { data: { session: null }, error: null }
    }

    return await supabase.auth.getSession()
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!isSupabaseConfigured()) {
      return { data: { subscription: { unsubscribe: () => {} } } }
    }

    return supabase.auth.onAuthStateChange(callback)
  },
}
