"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, name?: string) => void
  signup: (email: string, name: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  signup: () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      setIsAuthenticated(true)
    }
  }, [])

  const login = (email: string, name?: string) => {
    const userData: User = {
      id: "user-" + Date.now(),
      email,
      name: name || email.split("@")[0],
    }
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const signup = (email: string, name: string) => {
    const userData: User = {
      id: "user-" + Date.now(),
      email,
      name,
    }
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>{children}</AuthContext.Provider>
  )
}

