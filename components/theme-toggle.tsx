"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-10 h-10 rounded-xl">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <Sun 
        className={`h-4 w-4 transition-all duration-300 ${
          theme === "light" 
            ? "rotate-0 scale-100 text-yellow-500" 
            : "rotate-90 scale-0 text-gray-400"
        }`} 
      />
      <Moon 
        className={`absolute h-4 w-4 transition-all duration-300 ${
          theme === "dark" 
            ? "rotate-0 scale-100 text-blue-400" 
            : "-rotate-90 scale-0 text-gray-400"
        }`} 
      />
      <span className="sr-only">Toggle theme</span>
      
      {/* Hover effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Button>
  )
}
