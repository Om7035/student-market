/**
 * Environment utilities for the Student Marketplace application
 */

export const getEnvironment = () => {
  if (typeof window === 'undefined') {
    // Server-side environment detection
    return {
      isServer: true,
      isClient: false,
      isDevelopment: process.env.NODE_ENV === 'development',
      isProduction: process.env.NODE_ENV === 'production',
      isVercel: !!process.env.VERCEL,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
    }
  }

  // Client-side environment detection
  const hostname = window.location.hostname
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
  const isVercel = hostname.includes('vercel.app')
  const isCustomDomain = !isLocalhost && !isVercel && hostname !== ''

  return {
    isServer: false,
    isClient: true,
    isDevelopment: process.env.NODE_ENV === 'development' || isLocalhost,
    isProduction: process.env.NODE_ENV === 'production' || !isLocalhost,
    isVercel,
    isCustomDomain,
    isLocalhost,
    hostname,
    origin: window.location.origin,
    siteUrl: window.location.origin
  }
}

export const getRedirectUrl = (path: string = '') => {
  const env = getEnvironment()
  
  if (env.isServer) {
    const baseUrl = env.siteUrl
    return `${baseUrl}${path}`
  }
  
  return `${env.origin}${path}`
}

export const isAuthenticated = async () => {
  if (typeof window === 'undefined') return false
  
  try {
    const { supabase } = await import('@/lib/supabase')
    const { data: { session } } = await supabase.auth.getSession()
    return !!session?.user
  } catch (error) {
    console.error('Error checking authentication:', error)
    return false
  }
}

export const getAuthUser = async () => {
  if (typeof window === 'undefined') return null
  
  try {
    const { supabase } = await import('@/lib/supabase')
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user || null
  } catch (error) {
    console.error('Error getting auth user:', error)
    return null
  }
}