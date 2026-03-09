import type { Service, ServiceCreate, TokenResponse, User, Alert, CheckResult } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

class ApiClient {
  private accessToken: string | null = null

  setAccessToken(token: string | null) {
    this.accessToken = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.accessToken) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${this.accessToken}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "An error occurred" }))
      throw new Error(error.detail || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Auth endpoints
  async register(email: string, password: string): Promise<User> {
    return this.request<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async login(email: string, password: string): Promise<TokenResponse> {
    return this.request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    return this.request<{ access_token: string }>(`/auth/refresh?refresh_token=${refreshToken}`, {
      method: "POST",
    })
  }

  // Service endpoints
  async getServices(): Promise<Service[]> {
    return this.request<Service[]>("/services/")
  }

  async createService(data: ServiceCreate): Promise<Service> {
    return this.request<Service>("/services/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async deleteService(serviceId: string): Promise<{ status: string }> {
    return this.request<{ status: string }>(`/services/${serviceId}`, {
      method: "DELETE",
    })
  }

  // Admin endpoints
  async getUsers(): Promise<User[]> {
    return this.request<User[]>("/admin/users")
  }

  async getAllServices(): Promise<Service[]> {
    return this.request<Service[]>("/admin/services")
  }
}

export const api = new ApiClient()

// SWR fetcher
export const fetcher = async (url: string) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  })
  if (!response.ok) {
    throw new Error("Failed to fetch")
  }
  return response.json()
}
