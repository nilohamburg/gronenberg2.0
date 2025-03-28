"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface AdminAuthContextType {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is authenticated on initial load
  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuth")
    setIsAuthenticated(authStatus === "true")
  }, [])

  const login = () => {
    localStorage.setItem("adminAuth", "true")
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("adminAuth")
    setIsAuthenticated(false)
  }

  return <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}

