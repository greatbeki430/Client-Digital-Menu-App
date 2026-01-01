/**
 * Authentication utility functions
 * Helper functions for managing authentication state
 */

import { storageManager } from './storageManager'
import type { User } from '@/types/auth'

export const authUtils = {
  /**
   * Store authentication data in localStorage and sync across all storage
   * @param token - JWT access token
   * @param user - User object
   */
  setAuthData(token: string, user: User): void {
    // Store in standard localStorage
    localStorage.setItem('access_token', token)
    localStorage.setItem('user', JSON.stringify(user))

    // Also store in storageManager for consistency
    storageManager.setItem('access_token', token)
    storageManager.setItem('user', user)

    console.log('✅ Auth data stored and synced')
  },

  /**
   * Clear all authentication data from all storage locations
   */
  clearAuthData(): void {
    // Clear standard localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    localStorage.removeItem('token')

    // Clear storageManager
    storageManager.removeItem('access_token')
    storageManager.removeItem('user')
    storageManager.removeItem('current_user')
    storageManager.removeItem('mock_users')

    console.log('🧹 Auth data cleared from all locations')
  },

  /**
   * Get the access token from localStorage (with fallback)
   * @returns JWT token or null
   */
  getToken(): string | null {
    // Try multiple locations
    return (
      localStorage.getItem('access_token') ||
      localStorage.getItem('token') ||
      storageManager.getItem<string>('access_token')
    )
  },

  /**
   * Get user data from localStorage (with fallback)
   * @returns User object or null
   */
  getUser(): User | null {
    // Try multiple locations
    const userStr =
      localStorage.getItem('user') ||
      storageManager.getItem<string>('user') ||
      storageManager.getItem<string>('current_user')

    if (!userStr) return null

    try {
      return JSON.parse(userStr) as User
    } catch (error) {
      console.error('Failed to parse user data:', error)
      return null
    }
  },

  /**
   * Check if user is authenticated (with comprehensive check)
   * @returns boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) {
      console.log('❌ No token found in any location')
      return false
    }

    // Quick JWT validation
    const isValid = this.validateJWT(token)
    console.log('🔐 Token validation result:', isValid)
    return isValid
  },

  /**
   * Validate and sync authentication store
   * @param authStore - Pinia auth store instance
   * @returns boolean indicating if auth is valid
   */
  validateAuth(authStore: { user: User | null }): boolean {
    console.log('🔄 Validating auth store...')

    const token = this.getToken()
    if (!token) {
      console.log('❌ No token found for auth validation')
      return false
    }

    // Validate JWT token
    if (!this.validateJWT(token)) {
      console.log('❌ JWT validation failed')
      return false
    }

    // Check if auth store has user
    if (!authStore.user) {
      console.log('🔄 Auth store has no user, restoring from storage...')
      // Try to restore from storage
      const storedUser = this.getUser()
      if (storedUser) {
        authStore.user = storedUser
        console.log('✅ User restored to auth store:', storedUser.name)
        return true
      }
      console.log('❌ No user found in storage')
      return false
    }

    console.log('✅ Auth store validation successful')
    return true
  },

  /**
   * Validate JWT token format and expiration
   * @param token - JWT token string
   * @returns boolean indicating if token is valid
   */
  validateJWT(token: string): boolean {
    if (!token) {
      console.warn('No token provided for validation')
      return false
    }

    try {
      const parts = token.split('.')
      if (parts.length !== 3) {
        console.warn('Invalid JWT: Not 3 parts')
        return false
      }

      // Ensure all parts exist
      if (!parts[0] || !parts[1] || !parts[2]) {
        console.warn('Invalid JWT: Empty parts')
        return false
      }

      // Decode payload
      const payload = JSON.parse(atob(parts[1]))
      console.log('📋 JWT Payload:', payload)

      // Check expiration (only if exp exists)
      if (payload.exp) {
        const now = Math.floor(Date.now() / 1000)
        if (payload.exp < now) {
          console.log('Token expired at:', new Date(payload.exp * 1000))
          return false
        }
        console.log('✅ Token not expired, expires at:', new Date(payload.exp * 1000))
      }

      return true
    } catch (error) {
      console.error('Invalid JWT format:', error)

      // For development, accept mock tokens
      if (import.meta.env.DEV && token.includes('mock')) {
        console.log('✅ Accepting mock token for development')
        return true
      }

      return false
    }
  },

  /**
   * Decode JWT token to get payload data
   * @param token - JWT token string
   * @returns Decoded payload or null
   */
  decodeJWT(token: string): unknown | null {
    if (!token) return null

    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null

      if (!parts[1]) return null

      return JSON.parse(atob(parts[1]))
    } catch (error) {
      console.error('Failed to decode JWT:', error)
      return null
    }
  },

  /**
   * Generate a mock JWT token for development
   * @param userId - User ID
   * @param userData - User data object
   * @returns Mock JWT token string
   */
  generateMockJWT(userId: number, userData: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = btoa(
      JSON.stringify({
        sub: userId,
        name: userData.name,
        email: userData.email,
        business_name: userData.business_name,
        phone: userData.phone,
        tin: userData.tin,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
      }),
    )
    const signature = 'mock_jwt_signature_for_development'

    return `${header}.${payload}.${signature}`
  },

  /**
   * Check authentication and redirect if not authenticated
   * @param authStore - Pinia auth store
   * @param router - Vue router instance
   * @returns boolean indicating if authentication check passed
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checkAuthAndRedirect(authStore: { user: User | null }, router: any): boolean {
    console.log('🔐 Checking auth and redirect...')

    if (!this.isAuthenticated()) {
      console.warn('❌ Authentication check failed')
      this.clearAuthData()
      authStore.user = null
      router.push('/login')
      return false
    }

    if (!authStore.user) {
      console.log('🔄 Loading user from storage...')
      const user = this.getUser()
      if (user) {
        authStore.user = user
        console.log('✅ User loaded into auth store')
        return true
      } else {
        console.warn('❌ No user data found')
        this.clearAuthData()
        router.push('/login')
        return false
      }
    }

    console.log('✅ Auth check passed')
    return true
  },

  /**
   * Sync authentication data across all storage locations
   */
  syncAuthData(): boolean {
    console.log('🔄 Syncing auth data across all storage...')

    const token = this.getToken()
    const user = this.getUser()

    if (token && user) {
      // Ensure data is in both locations
      localStorage.setItem('access_token', token)
      localStorage.setItem('user', JSON.stringify(user))
      storageManager.setItem('access_token', token)
      storageManager.setItem('user', user)

      console.log('✅ Auth data synced successfully')
      return true
    }

    console.log('❌ No auth data to sync')
    return false
  },

  /**
   * Development helper: Setup mock authentication for testing
   */
  setupMockAuth(): void {
    if (!import.meta.env.DEV) {
      console.warn('Mock auth only available in development')
      return
    }

    console.log('🎭 Setting up mock authentication...')

    const mockUser: User = {
      id: 1,
      name: 'Test Restaurant',
      email: 'test@example.com',
      phone: '+1234567890',
      business_name: 'Test Restaurant',
      tin: 'TEST123456',
      email_verified_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const mockToken = this.generateMockJWT(1, mockUser)

    this.setAuthData(mockToken, mockUser)

    console.log('✅ Mock authentication setup complete')
  },
}
