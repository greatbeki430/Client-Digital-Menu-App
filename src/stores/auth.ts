import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterData, ApiResponse, AuthResponse } from '@/types/auth'
// import authService from '@/services/authService'
import router from '@/router'

/*
// ORIGINAL CODE - KEPT FOR WHEN API IS FIXED
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(authService.getUserData())
  const loading = ref(false)
  const error = ref<string | null>(null)
  const registrationCredentials = ref<{ email: string; password: string } | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userName = computed(() => user.value?.name || '')
  const businessName = computed(() => user.value?.business_name || '')

  // Initialize from localStorage
  const initFromStorage = (): void => {
    const token = localStorage.getItem('access_token')
    if (token) {
      fetchCurrentUser()
    }
  }

  // Actions
  async function register(data: RegisterData): Promise<ApiResponse> {
    try {
      loading.value = true
      error.value = null

      const response = await authService.register(data)

      if (!response.success) {
        throw new Error(response.message)
      }

      if (response.data) {
        user.value = response.data.user

        // Store credentials for display (Exam requirement)
        registrationCredentials.value = {
          email: data.email,
          password: data.password,
        }

        // Clear after 30 seconds
        setTimeout(() => {
          registrationCredentials.value = null
        }, 30000)
      }

      router.push('/dashboard')
      return response
    } catch (err: unknown) {
      // Narrow the unknown type
      if (err instanceof Error) {
        error.value = err.message
        throw err
      } else {
        // fallback for non-Error throwables
        error.value = String(err)
        throw new Error(String(err))
      }
    } finally {
      loading.value = false
    }
  }

  async function login(credentials: LoginCredentials): Promise<ApiResponse> {
    try {
      loading.value = true
      error.value = null

      const response = await authService.login(credentials)

      if (!response.success) {
        throw new Error(response.message)
      }

      if (response.data) {
        user.value = response.data.user
      }

      router.push('/dashboard')
      return response
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
        throw err
      } else {
        error.value = String(err)
        throw new Error(String(err))
      }
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    try {
      loading.value = true
      await authService.logout()
      user.value = null
      router.push('/login')
    } finally {
      loading.value = false
    }
  }

  async function fetchCurrentUser(): Promise<void> {
    try {
      const response = await authService.getUser()
      if (response.success && response.data) {
        user.value = response.data
      } else {
        localStorage.removeItem('access_token')
        user.value = null
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      localStorage.removeItem('access_token')
      user.value = null
    }
  }

  function clearError(): void {
    error.value = null
  }

  return {
    // State
    user,
    loading,
    error,
    registrationCredentials,

    // Getters
    isAuthenticated,
    userName,
    businessName,

    // Actions
    initFromStorage,
    register,
    login,
    logout,
    fetchCurrentUser,
    clearError,
  }
})
*/

// ========== NEW MOCK AUTH STORE ==========
// Use this while the real API is broken (Route [login] not defined)
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const registrationCredentials = ref<{ email: string; password: string } | null>(null)

  // Initialize from localStorage on store creation
  const initFromLocalStorage = () => {
    const storedUser = localStorage.getItem('mock_user')
    const storedToken = localStorage.getItem('mock_access_token')

    if (storedUser && storedToken) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (e) {
        console.error('Failed to parse stored user:', e)
        clearStorage()
      }
    }
  }

  // Clear all mock storage
  const clearStorage = () => {
    localStorage.removeItem('mock_access_token')
    localStorage.removeItem('mock_user')
    localStorage.removeItem('access_token') // Clear any real tokens too
    user.value = null
  }

  // Initialize immediately
  initFromLocalStorage()

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userName = computed(() => user.value?.name || '')
  const businessName = computed(() => user.value?.business_name || '')

  // Initialize from localStorage (mock version)
  const initFromStorage = (): void => {
    initFromLocalStorage()
  }

  // Actions
  async function register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      loading.value = true
      error.value = null
      console.log('Registering with data:', data)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // === VALIDATION ===
      // Required fields validation
      const requiredFields = [
        'name',
        'email',
        'phone',
        'business_name',
        'tin',
        'password',
        'password_confirmation',
      ] as const
      const missingFields = requiredFields.filter((field) => !data[field]?.toString().trim())

      if (missingFields.length > 0) {
        error.value = `Missing required fields: ${missingFields.join(', ')}`
        throw new Error(error.value)
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        error.value = 'Please enter a valid email address'
        throw new Error(error.value)
      }

      // Password validation
      if (data.password.length < 6) {
        error.value = 'Password must be at least 6 characters'
        throw new Error(error.value)
      }

      if (data.password !== data.password_confirmation) {
        error.value = 'Password confirmation does not match'
        throw new Error(error.value)
      }

      // Phone validation (basic)
      if (data.phone.length < 10) {
        error.value = 'Please enter a valid phone number'
        throw new Error(error.value)
      }

      // TIN validation (basic)
      if (!data.tin.trim()) {
        error.value = 'TIN is required'
        throw new Error(error.value)
      }

      // Check if email already exists (mock check)
      const existingUsers = localStorage.getItem('mock_users')
      if (existingUsers) {
        const users: User[] = JSON.parse(existingUsers)
        if (users.some((u) => u.email === data.email)) {
          error.value = 'Email already registered. Please use a different email or login.'
          throw new Error(error.value)
        }
      }

      // === CREATE MOCK USER ===
      const mockUser: User = {
        id: Math.floor(Math.random() * 1000) + 1,
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        business_name: data.business_name.trim(),
        tin: data.tin.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_verified_at: new Date().toISOString(), // Mock verified
      }

      // === CREATE MOCK TOKEN AND RESPONSE ===
      const mockToken = `mock_jwt_token_${Date.now()}_${mockUser.id}`
      const mockAuthResponse: AuthResponse = {
        access_token: mockToken,
        token_type: 'bearer',
        expires_in: 3600, // 1 hour
        user: mockUser,
      }

      // === STORE DATA ===
      // Store mock token and user
      localStorage.setItem('mock_access_token', mockToken)
      localStorage.setItem('mock_user', JSON.stringify(mockUser))

      // Also store in mock users list
      const existing = localStorage.getItem('mock_users')
      const users = existing ? JSON.parse(existing) : []
      users.push(mockUser)
      localStorage.setItem('mock_users', JSON.stringify(users))

      // Update state
      user.value = mockUser

      // Store credentials for display (as per requirements)
      registrationCredentials.value = {
        email: data.email,
        password: data.password,
      }

      // Clear credentials after 30 seconds
      setTimeout(() => {
        registrationCredentials.value = null
      }, 30000)

      // === SUCCESS RESPONSE ===
      const successResponse: ApiResponse<AuthResponse> = {
        success: true,
        data: mockAuthResponse,
        message: 'Registration successful! Welcome to your digital menu dashboard.',
      }

      console.log('Registration successful:', successResponse)

      // Show success message
      alert(
        '✅ Registration successful!\n\nYou are now logged in with your mock account.\n\nYou can use these credentials to login later:\nEmail: ' +
          data.email +
          '\nPassword: ' +
          data.password,
      )

      // Navigate to dashboard
      setTimeout(() => {
        router.push('/login')
      }, 500)

      return successResponse
    } catch (err: unknown) {
      console.error('Registration error:', err)

      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'An unexpected error occurred during registration'
      }

      const errorResponse: ApiResponse = {
        success: false,
        message: error.value,
      }

      throw errorResponse
    } finally {
      loading.value = false
    }
  }

  async function login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      loading.value = true
      error.value = null
      console.log('Login attempt with:', credentials.email)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // === TEST CREDENTIALS ===
      if (credentials.email === 'abc@gmail.com' && credentials.password === 'abctest') {
        // Create test user
        const testUser: User = {
          id: 1,
          name: 'Test Business Owner',
          email: 'abc@gmail.com',
          phone: '+1234567890',
          business_name: 'Test Restaurant & Cafe',
          tin: 'TEST123456',
          email_verified_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const mockToken = 'mock_jwt_token_test_account'
        const mockAuthResponse: AuthResponse = {
          access_token: mockToken,
          token_type: 'bearer',
          expires_in: 3600,
          user: testUser,
        }

        // Store data
        user.value = testUser
        localStorage.setItem('mock_access_token', mockToken)
        localStorage.setItem('mock_user', JSON.stringify(testUser))

        const successResponse: ApiResponse<AuthResponse> = {
          success: true,
          data: mockAuthResponse,
          message: 'Login successful with test account',
        }

        console.log('Login successful with test account')

        // Navigate to dashboard
        setTimeout(() => {
          router.push('/dashboard')
        }, 500)

        return successResponse
      }

      // === CHECK REGISTERED USERS ===
      const storedUser = localStorage.getItem('mock_user')
      const mockUsers = localStorage.getItem('mock_users')

      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser)
        if (parsedUser.email === credentials.email) {
          // In real app, we'd check hashed password
          // For mock, we'll accept any password for registered users
          const mockToken = `mock_jwt_token_${Date.now()}`
          const mockAuthResponse: AuthResponse = {
            access_token: mockToken,
            token_type: 'bearer',
            expires_in: 3600,
            user: parsedUser,
          }

          // Update token
          localStorage.setItem('mock_access_token', mockToken)
          user.value = parsedUser

          const successResponse: ApiResponse<AuthResponse> = {
            success: true,
            data: mockAuthResponse,
            message: 'Login successful',
          }

          console.log('Login successful with registered account')

          setTimeout(() => {
            router.push('/dashboard')
          }, 500)

          return successResponse
        }
      }

      // === CHECK MOCK USERS LIST ===
      if (mockUsers) {
        const users: User[] = JSON.parse(mockUsers)
        const foundUser = users.find((u) => u.email === credentials.email)
        if (foundUser) {
          const mockToken = `mock_jwt_token_${Date.now()}`
          const mockAuthResponse: AuthResponse = {
            access_token: mockToken,
            token_type: 'bearer',
            expires_in: 3600,
            user: foundUser,
          }

          localStorage.setItem('mock_access_token', mockToken)
          localStorage.setItem('mock_user', JSON.stringify(foundUser))
          user.value = foundUser

          const successResponse: ApiResponse<AuthResponse> = {
            success: true,
            data: mockAuthResponse,
            message: 'Login successful',
          }

          console.log('Login successful from mock users list')

          setTimeout(() => {
            router.push('/dashboard')
          }, 500)

          return successResponse
        }
      }

      // === INVALID CREDENTIALS ===
      error.value =
        'Invalid email or password.\n\nFor testing, you can use:\nEmail: abc@gmail.com\nPassword: abctest\n\nOr register a new account.'

      const errorResponse: ApiResponse = {
        success: false,
        message: error.value,
      }

      throw errorResponse
    } catch (err: unknown) {
      console.error('Login error:', err)

      if (err instanceof Error) {
        error.value = err.message
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        error.value = String(err.message)
      } else {
        error.value = 'An unexpected error occurred during login'
      }

      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    try {
      loading.value = true

      // Clear all storage
      clearStorage()
      registrationCredentials.value = null

      console.log('Logout successful')

      // Navigate to login
      setTimeout(() => {
        router.push('/login')
      }, 300)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchCurrentUser(): Promise<void> {
    try {
      const storedUser = localStorage.getItem('mock_user')
      if (storedUser) {
        user.value = JSON.parse(storedUser)
      } else {
        clearStorage()
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      clearStorage()
    }
  }

  function clearError(): void {
    error.value = null
  }

  // Initialize on store creation
  initFromStorage()

  return {
    // State
    user,
    loading,
    error,
    registrationCredentials,

    // Getters
    isAuthenticated,
    userName,
    businessName,

    // Actions
    initFromStorage,
    register,
    login,
    logout,
    fetchCurrentUser,
    clearError,
  }
})
