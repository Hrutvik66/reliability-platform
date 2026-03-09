"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { api } from "./api"
import type { TokenResponse } from "./types"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  accessToken: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing tokens on mount
    const storedAccessToken = localStorage.getItem("accessToken")
    const storedRefreshToken = localStorage.getItem("refreshToken")
    
    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken)
      setRefreshToken(storedRefreshToken)
      api.setAccessToken(storedAccessToken)
    }
    setIsLoading(false)
  }, [])

  const saveTokens = useCallback((tokens: TokenResponse) => {
    setAccessToken(tokens.access_token)
    setRefreshToken(tokens.refresh_token)
    localStorage.setItem("accessToken", tokens.access_token)
    localStorage.setItem("refreshToken", tokens.refresh_token)
    api.setAccessToken(tokens.access_token)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await api.login(email, password)
    saveTokens(tokens)
  }, [saveTokens])

  const register = useCallback(async (email: string, password: string) => {
    await api.register(email, password)
    // Auto-login after registration
    const tokens = await api.login(email, password)
    saveTokens(tokens)
  }, [saveTokens])

  const logout = useCallback(() => {
    setAccessToken(null)
    setRefreshToken(null)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    api.setAccessToken(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        isLoading,
        login,
        register,
        logout,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
