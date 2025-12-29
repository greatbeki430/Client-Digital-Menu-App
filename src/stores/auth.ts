// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterData, ApiResponse, AuthResponse } from '@/types/auth'
import router from '@/router'
import { authUtils } from '@/utils/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const registrationCredentials = ref<{ email: string; password: string } | null>(null)
  const showSuccessModal = ref(false)
  const successMessage = ref('')

  // ==================== INITIALIZATION ====================
  // Initialize from localStorage on store creation
  const initFromLocalStorage = () => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('access_token')

    if (storedUser && storedToken) {
      try {
        // Use authUtils to validate token
        if (authUtils.validateJWT(storedToken)) {
          user.value = JSON.parse(storedUser)
          console.log('✅ User initialized from localStorage')
        } else {
          console.log('❌ Token invalid/expired, clearing storage')
          clearStorage()
        }
      } catch (e) {
        console.error('Failed to parse stored user:', e)
        clearStorage()
      }
    }
  }

  // Clear all storage
  const clearStorage = () => {
    authUtils.clearAuthData()
    user.value = null
  }

  // Initialize immediately
  initFromLocalStorage()

  // ==================== GETTERS ====================
  const isAuthenticated = computed(() => authUtils.isAuthenticated())
  const userName = computed(() => user.value?.name || '')
  const businessName = computed(() => user.value?.business_name || '')

  // Initialize from localStorage
  const initFromStorage = (): void => {
    initFromLocalStorage()
  }

  // ==================== ACTIONS ====================
  async function register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      loading.value = true
      error.value = null
      console.log('Registering with data:', data)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // === VALIDATION ===
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
        email_verified_at: new Date().toISOString(),
      }

      // === CREATE JWT TOKEN using authUtils ===
      const mockToken = authUtils.generateMockJWT(mockUser.id, mockUser)
      const mockAuthResponse: AuthResponse = {
        access_token: mockToken,
        token_type: 'bearer',
        expires_in: 86400, // 24 hours
        user: mockUser,
      }

      // === STORE DATA using authUtils ===
      authUtils.setAuthData(mockToken, mockUser)

      // Also store in mock users list
      const existing = localStorage.getItem('mock_users')
      const users = existing ? JSON.parse(existing) : []
      users.push(mockUser)
      localStorage.setItem('mock_users', JSON.stringify(users))

      // Update state
      user.value = mockUser

      // Store credentials for display
      registrationCredentials.value = {
        email: data.email,
        password: data.password,
      }

      // Clear credentials after 30 seconds
      setTimeout(() => {
        registrationCredentials.value = null
      }, 30000)

      // === SUCCESS RESPONSE & MODAL ===
      const successResponse: ApiResponse<AuthResponse> = {
        success: true,
        data: mockAuthResponse,
        message: 'Registration successful! Welcome to your digital menu dashboard.',
      }

      console.log('Registration successful:', successResponse)

      // Set success message for modal
      successMessage.value = `Welcome ${data.name}! Your business "${data.business_name}" has been registered successfully. You can now login with your credentials.`

      // Show success modal
      showSuccessModal.value = true

      // Auto-hide modal after 5 seconds
      setTimeout(() => {
        hideSuccessModal()
      }, 5000)

      // Navigate to login (not dashboard directly)
      setTimeout(() => {
        router.push('/login')
      }, 1000)

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

        // Use authUtils to generate token
        const mockToken = authUtils.generateMockJWT(testUser.id, testUser)
        const mockAuthResponse: AuthResponse = {
          access_token: mockToken,
          token_type: 'bearer',
          expires_in: 86400,
          user: testUser,
        }

        // Store data using authUtils
        user.value = testUser
        authUtils.setAuthData(mockToken, testUser)

        const successResponse: ApiResponse<AuthResponse> = {
          success: true,
          data: mockAuthResponse,
          message: 'Login successful with test account',
        }

        console.log('Login successful with test account')

        // Show success message
        successMessage.value = 'Welcome back! Login successful with test account.'
        showSuccessModal.value = true
        setTimeout(() => hideSuccessModal(), 3000)

        // Navigate to dashboard
        setTimeout(() => {
          router.push('/dashboard')
        }, 500)

        return successResponse
      }

      // === CHECK REGISTERED USERS ===
      const mockUsers = localStorage.getItem('mock_users')

      if (mockUsers) {
        const users: User[] = JSON.parse(mockUsers)
        const foundUser = users.find((u) => u.email === credentials.email)
        if (foundUser) {
          // Use authUtils to generate token
          const mockToken = authUtils.generateMockJWT(foundUser.id, foundUser)
          const mockAuthResponse: AuthResponse = {
            access_token: mockToken,
            token_type: 'bearer',
            expires_in: 86400,
            user: foundUser,
          }

          // Store data using authUtils
          authUtils.setAuthData(mockToken, foundUser)
          user.value = foundUser

          const successResponse: ApiResponse<AuthResponse> = {
            success: true,
            data: mockAuthResponse,
            message: 'Login successful',
          }

          console.log('Login successful from mock users list')

          // Show success message
          successMessage.value = `Welcome back ${foundUser.name}! Login successful.`
          showSuccessModal.value = true
          setTimeout(() => hideSuccessModal(), 3000)

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

      // Clear all storage using authUtils
      authUtils.clearAuthData()
      user.value = null
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
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('access_token')

      // Use authUtils to validate token
      if (storedUser && storedToken && authUtils.validateJWT(storedToken)) {
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

  // Hide success modal
  function hideSuccessModal(): void {
    showSuccessModal.value = false
    successMessage.value = ''
  }

  // Validate current token using authUtils
  function validateCurrentToken(): boolean {
    return authUtils.isAuthenticated()
  }

  // Initialize on store creation
  initFromStorage()

  return {
    // State
    user,
    loading,
    error,
    registrationCredentials,
    showSuccessModal,
    successMessage,

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
    hideSuccessModal,
    validateCurrentToken,
  }
})
