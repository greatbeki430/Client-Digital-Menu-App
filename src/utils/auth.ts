/**
 * Authentication utility functions
 * Helper functions for managing authentication state
 */

export const authUtils = {
  /**
   * Store authentication data in localStorage
   * @param token - JWT access token
   * @param user - User object
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setAuthData(token: string, user: any): void {
    localStorage.setItem('access_token', token)
    localStorage.setItem('user', JSON.stringify(user))
  },

  /**
   * Clear all authentication data from localStorage
   */
  clearAuthData(): void {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    localStorage.removeItem('mock_access_token')
    localStorage.removeItem('mock_user')
    localStorage.removeItem('token')
    localStorage.removeItem('mock_users')
  },

  /**
   * Get the access token from localStorage
   * @returns JWT token or null
   */
  getToken(): string | null {
    return localStorage.getItem('access_token')
  },

  /**
   * Get user data from localStorage
   * @returns User object or null
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getUser(): any | null {
    const user = localStorage.getItem('user')
    if (!user) return null

    try {
      return JSON.parse(user)
    } catch (error) {
      console.error('Failed to parse user data:', error)
      return null
    }
  },

  /**
   * Check if user is authenticated
   * @returns boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) return false

    // Quick JWT validation
    return this.validateJWT(token)
  },

  /**
   * Validate and sync authentication store
   * @param authStore - Pinia auth store instance
   * @returns boolean indicating if auth is valid
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validateAuth(authStore: any): boolean {
    const token = this.getToken()
    if (!token) return false

    // Validate JWT token
    if (!this.validateJWT(token)) {
      return false
    }

    // Check if auth store has user
    if (!authStore.user) {
      // Try to restore from localStorage
      const storedUser = this.getUser()
      if (storedUser) {
        authStore.user = storedUser
        return true
      }
      return false
    }

    return true
  },

  /**
   * Validate JWT token format and expiration
   * @param token - JWT token string
   * @returns boolean indicating if token is valid
   */
  validateJWT(token: string): boolean {
    if (!token) return false

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

      // Check expiration
      const now = Math.floor(Date.now() / 1000)
      if (payload.exp && payload.exp < now) {
        console.log('Token expired:', new Date(payload.exp * 1000))
        return false
      }

      return true
    } catch (error) {
      console.error('Invalid JWT format:', error)
      return false
    }
  },

  /**
   * Decode JWT token to get payload data
   * @param token - JWT token string
   * @returns Decoded payload or null
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decodeJWT(token: string): any | null {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateMockJWT(userId: number, userData: any): string {
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
  checkAuthAndRedirect(authStore: any, router: any): boolean {
    if (!this.isAuthenticated()) {
      console.warn('Authentication check failed, redirecting to login')
      this.clearAuthData()
      authStore.user = null
      router.push('/login')
      return false
    }

    if (!authStore.user) {
      const user = this.getUser()
      if (user) {
        authStore.user = user
        return true
      } else {
        console.warn('No user data found, redirecting to login')
        this.clearAuthData()
        router.push('/login')
        return false
      }
    }

    return true
  },
}
