import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterData, ApiResponse } from '@/types/auth'
import authService from '@/services/authService'
import router from '@/router'

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
