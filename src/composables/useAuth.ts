import { computed } from 'vue'
// ref,
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginCredentials, RegisterData } from '@/types/auth'

export const useAuth = () => {
  const router = useRouter()
  const authStore = useAuthStore()

  const loading = computed(() => authStore.loading)
  const error = computed(() => authStore.error)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)

  const login = async (credentials: LoginCredentials) => {
    try {
      await authStore.login(credentials)
      router.push('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      await authStore.register(userData)
      router.push('/dashboard')
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authStore.logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  const checkAuth = () => {
    return authStore.isAuthenticated
  }

  const clearError = () => {
    authStore.clearError()
  }

  return {
    // State
    loading,
    error,
    isAuthenticated,
    user,

    // Actions
    login,
    register,
    logout,
    checkAuth,
    clearError,
  }
}
