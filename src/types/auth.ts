export interface User {
  id: number
  name: string
  email: string
  phone: string
  business_name: string
  tin: string
  email_verified_at?: string
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
  password_confirmation: string
  business_name: string
  tin: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: User
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
  status?: number
}

export interface ValidationError {
  field: string
  message: string
}
