export interface User {
  id: string
  email: string
  role: "user" | "admin"
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  url: string
  check_interval: number
  timeout: number
  is_active: boolean
  user_id?: string
  created_at?: string
  updated_at?: string
}

export interface ServiceCreate {
  name: string
  url: string
  check_interval?: number
  timeout?: number
  is_active?: boolean
}

export interface CheckResult {
  id: string
  service_id: string
  status_code: number | null
  response_time_ms: number | null
  is_up: boolean
  checked_at: string
}

export interface Alert {
  id: string
  service_id: string
  type: "DOWN" | "RECOVERED"
  message: string
  triggered_at: string
  resolved_at: string | null
  sent: boolean
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}
