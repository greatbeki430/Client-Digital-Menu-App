<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Use test credentials: abc@gmail.com / abctest
        </p>
      </div>

      <!-- Login Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
          <!-- Email -->
          <BaseInput v-model="form.email" type="email" label="Email Address" placeholder="abc@gmail.com" required
            :error="errors.email" @blur="validateField('email')" />

          <!-- Password -->
          <BaseInput v-model="form.password" type="password" label="Password" placeholder="abctest" required
            :error="errors.password" @blur="validateField('password')" />
        </div>

        <!-- Remember me and Forgot password -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" v-model="form.remember" type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>
          <div class="text-sm">
            <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
            </a>
          </div>
        </div>

        <!-- Inline error message (small errors) -->
        <div v-if="inlineError" class="rounded-md bg-yellow-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                {{ inlineError }}
              </p>
            </div>
          </div>
        </div>

        <!-- Success message after registration redirect -->
        <div v-if="showRegistrationSuccess" class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                Registration Successful! 🎉
              </h3>
              <div class="mt-2 text-sm text-green-700">
                <p>Your account has been created. Please login with your credentials.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <BaseButton type="submit" :loading="authStore.loading" fullWidth size="lg"
            class="bg-blue-600 hover:bg-blue-700">
            <span v-if="authStore.loading">Signing in...</span>
            <span v-else>Sign in</span>
          </BaseButton>
        </div>

        <!-- Register Link -->
        <div class="text-center">
          <router-link to="/register" class="text-sm text-blue-600 hover:text-blue-500 font-medium">
            Don't have an account? Register
          </router-link>
        </div>

        <!-- Demo credentials note -->
        <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p class="text-xs text-yellow-800 text-center">
            <strong>Demo Mode:</strong> This is a mock authentication system.
            In production, this would connect to a real backend API.
          </p>
        </div>
      </form>
    </div>

    <!-- Success Modal for Login -->
    <SuccessModal :open="showLoginSuccess" title="Login Successful! ✅"
      message="Welcome back! You have successfully logged in." confirmText="Continue to Dashboard"
      :autoCloseDelay="3000" @close="hideLoginSuccessModal" @confirm="handleLoginSuccessConfirm" />

    <!-- Error Modal for serious errors -->
    <ErrorModal :open="showErrorModal" title="Login Failed" :message="errorModalMessage" :details="errorModalDetails"
      :suggestions="errorModalSuggestions" confirmText="OK" :show-retry="true" @close="closeErrorModal"
      @retry="retryLogin" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SuccessModal from '@/components/ui/SuccessModal.vue'
import ErrorModal from '@/components/ui/ErrorModal.vue'

const authStore = useAuthStore()
const route = useRoute()

// State
const showRegistrationSuccess = ref(false)
const showLoginSuccess = ref(false)
const showErrorModal = ref(false)
const inlineError = ref('')
const errorModalMessage = ref('')
const errorModalDetails = ref('')
const errorModalSuggestions = ref<string[]>([])

// Form types
interface FormData {
  email: string
  password: string
  remember: boolean
}

interface Errors {
  email: string
  password: string
}

const form = reactive<FormData>({
  email: 'abc@gmail.com', // Pre-fill with test credentials
  password: 'abctest',
  remember: false
})

const errors = reactive<Errors>({
  email: '',
  password: ''
})

// Watch for auth store user changes (login success)
watch(() => authStore.user, (user) => {
  if (user) {
    // Show login success modal
    showLoginSuccess.value = true

    // Auto-hide after 3 seconds
    setTimeout(() => {
      hideLoginSuccessModal()
    }, 3000)
  }
})

// Watch for auth store errors
watch(() => authStore.error, (newError) => {
  if (newError) {
    handleAuthError(newError)
  }
})

// Lifecycle
onMounted(() => {
  if (route.query.registered === 'true') {
    showRegistrationSuccess.value = true
    setTimeout(() => {
      showRegistrationSuccess.value = false
    }, 5000)
  }
})

// Modal handlers
function hideLoginSuccessModal() {
  showLoginSuccess.value = false
}

function handleLoginSuccessConfirm() {
  hideLoginSuccessModal()
  // Already navigating to dashboard from auth store
}

// Error handling
function handleAuthError(error: string) {
  inlineError.value = ''

  if (error.includes('Invalid email or password') || error.includes('credentials')) {
    errorModalMessage.value = 'Authentication Failed'
    errorModalDetails.value = error
    errorModalSuggestions.value = [
      'Check if your email is correct',
      'Verify your password is entered correctly',
      'Try using the test credentials: abc@gmail.com / abctest',
      'If you just registered, use the credentials you created'
    ]
    showErrorModal.value = true
  } else if (error.includes('Network') || error.includes('connection')) {
    errorModalMessage.value = 'Connection Error'
    errorModalDetails.value = error
    errorModalSuggestions.value = [
      'Check your internet connection',
      'Try again in a few moments',
      'This is a demo app, so it uses mock authentication'
    ]
    showErrorModal.value = true
  } else {
    // For other errors, show inline message
    inlineError.value = error
  }
}

function closeErrorModal() {
  showErrorModal.value = false
  errorModalMessage.value = ''
  errorModalDetails.value = ''
  errorModalSuggestions.value = []
  authStore.clearError()
}

function retryLogin() {
  showErrorModal.value = false
  // Clear password for retry
  form.password = ''
  authStore.clearError()
}

// Validation (type-safe)
const validateField = (field: keyof FormData): void => {
  const value = form[field]

  // Type guard for string fields
  if (typeof value !== 'string') {
    // 'remember' is boolean, no validation needed
    return
  }

  switch (field) {
    case 'email':
      if (!value.trim()) {
        errors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.email = 'Please enter a valid email address'
      } else {
        errors.email = ''
      }
      break
    case 'password':
      if (!value) {
        errors.password = 'Password is required'
      } else if (value.length < 6) {
        errors.password = 'Password must be at least 6 characters'
      } else {
        errors.password = ''
      }
      break
  }
}

const validateForm = (): boolean => {
  // Only validate string fields
  ; (['email', 'password'] as (keyof FormData)[]).forEach(field => {
    validateField(field)
  })

  return !Object.values(errors).some(error => error !== '')
}

// Form submission
const handleSubmit = async (): Promise<void> => {
  // Clear previous errors
  inlineError.value = ''
  authStore.clearError()

  if (!validateForm()) {
    return
  }

  try {
    await authStore.login(form)
    // Auth store will handle navigation to /dashboard
    showRegistrationSuccess.value = false
  } catch (error) {
    console.error('Login failed:', error)
    // Clear password field on error for security
    form.password = ''
  }
}
</script>
