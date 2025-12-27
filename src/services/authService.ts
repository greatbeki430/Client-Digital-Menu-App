import type { AxiosError } from 'axios'
import type { LoginCredentials, RegisterData, AuthResponse, ApiResponse, User } from '@/types/auth'
import api from './api'

class AuthService {
  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<AuthResponse>('/register', userData)

      if (response.access_token) {
        this.setAuthData(response)
      }

      return {
        success: true,
        data: response,
      }
    } catch (error: unknown) {
      return this.handleError(error)
    }
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<AuthResponse>('/login', credentials)

      if (response.access_token) {
        this.setAuthData(response)
      }

      return {
        success: true,
        data: response,
      }
    } catch (error: unknown) {
      return this.handleError(error)
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/logout')
    } finally {
      this.clearAuthData()
    }
  }

  async getUser(): Promise<ApiResponse<User>> {
    try {
      const response = await api.get<User>('/user')
      return {
        success: true,
        data: response,
      }
    } catch (error: unknown) {
      return this.handleError(error)
    }
  }

  private setAuthData(response: AuthResponse): void {
    localStorage.setItem('access_token', response.access_token)
    localStorage.setItem('user', JSON.stringify(response.user))
  }

  private clearAuthData(): void {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }

  getToken(): string | null {
    return localStorage.getItem('access_token')
  }

  getUserData(): User | null {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  private handleError<T = unknown>(error: unknown): ApiResponse<T> {
    // Cast error safely as AxiosError
    const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>

    if (axiosError.response?.data) {
      return {
        success: false,
        message: axiosError.response.data.message || 'An error occurred',
        errors: axiosError.response.data.errors,
        status: axiosError.response.status,
      }
    }

    // Fallback for non-Axios errors
    const message = error instanceof Error ? error.message : 'Network error'

    return {
      success: false,
      message,
    }
  }
}

export default new AuthService()
