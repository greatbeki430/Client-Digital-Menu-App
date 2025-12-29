<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register Your Business
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Create your account to manage your digital menu
        </p>
      </div>

      <!-- Registration Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
          <!-- Name -->
          <BaseInput v-model="form.name" label="Full Name" placeholder="John Doe" required :error="errors.name"
            @blur="validateField('name')" />

          <!-- Email -->
          <BaseInput v-model="form.email" type="email" label="Email Address" placeholder="john@example.com" required
            :error="errors.email" @blur="validateField('email')" />

          <!-- Phone -->
          <BaseInput v-model="form.phone" type="tel" label="Phone Number" placeholder="+1234567890" required
            :error="errors.phone" @blur="validateField('phone')" />

          <!-- Business Name -->
          <BaseInput v-model="form.business_name" label="Business Name" placeholder="Your Restaurant Name" required
            :error="errors.business_name" @blur="validateField('business_name')" />

          <!-- TIN -->
          <BaseInput v-model="form.tin" label="Tax Identification Number (TIN)" placeholder="Enter TIN" required
            :error="errors.tin" @blur="validateField('tin')" />

          <!-- Password -->
          <BaseInput v-model="form.password" type="password" label="Password" placeholder="Create a strong password"
            required :error="errors.password" @blur="validateField('password')" />

          <!-- Confirm Password -->
          <BaseInput v-model="form.password_confirmation" type="password" label="Confirm Password"
            placeholder="Confirm your password" required :error="errors.password_confirmation"
            @blur="validateField('password_confirmation')" />
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

        <!-- Submit Button -->
        <div>
          <BaseButton type="submit" :loading="authStore.loading" fullWidth size="lg"
            class="bg-blue-600 hover:bg-blue-700">
            <span v-if="authStore.loading">Registering...</span>
            <span v-else>Register Business</span>
          </BaseButton>
        </div>

        <!-- Login Link -->
        <div class="text-center">
          <router-link to="/login" class="text-sm text-blue-600 hover:text-blue-500 font-medium">
            Already have an account? Sign in
          </router-link>
        </div>

        <!-- Demo credentials note -->
        <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p class="text-xs text-yellow-800 text-center">
            <strong>Demo Mode:</strong> This is a mock registration system.
            Your data is stored locally in the browser.
          </p>
        </div>
      </form>
    </div>

    <!-- Success Modal -->
    <SuccessModal :open="showSuccessModal" title="Registration Successful! 🎉" :message="successMessage"
      :credentials="registrationCredentials" confirmText="Go to Login" :autoCloseDelay="5000" @close="closeSuccessModal"
      @confirm="goToLogin" />

    <!-- Error Modal for serious errors -->
    <ErrorModal :open="showErrorModal" title="Registration Failed" :message="errorModalMessage"
      :details="errorModalDetails" :suggestions="errorModalSuggestions" confirmText="OK" :show-retry="true"
      @close="closeErrorModal" @retry="retryRegistration" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SuccessModal from '@/components/ui/SuccessModal.vue'
import ErrorModal from '@/components/ui/ErrorModal.vue'

const router = useRouter()
const authStore = useAuthStore()

// State
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const successMessage = ref('')
const inlineError = ref('')
const errorModalMessage = ref('')
const errorModalDetails = ref('')
const errorModalSuggestions = ref<string[]>([])
const registrationCredentials = ref<{ email: string; password: string } | undefined>(undefined)

// Watch for auth store errors
watch(() => authStore.error, (newError) => {
  if (newError) {
    handleAuthError(newError)
  }
})

// Watch for auth store success modal state
watch(() => authStore.showSuccessModal, (show) => {
  if (show) {
    // Get data from auth store
    successMessage.value = authStore.successMessage

    registrationCredentials.value = authStore.registrationCredentials || undefined

    showSuccessModal.value = true
  }
})

// Form data types
interface FormData {
  name: string
  email: string
  phone: string
  business_name: string
  tin: string
  password: string
  password_confirmation: string
}

interface Errors {
  name: string
  email: string
  phone: string
  business_name: string
  tin: string
  password: string
  password_confirmation: string
}

const form = reactive<FormData>({
  name: '',
  email: '',
  phone: '',
  business_name: '',
  tin: '',
  password: '',
  password_confirmation: ''
})

const errors = reactive<Errors>({
  name: '',
  email: '',
  phone: '',
  business_name: '',
  tin: '',
  password: '',
  password_confirmation: ''
})

// Error handling
function handleAuthError(error: string) {
  inlineError.value = ''

  if (error.includes('Email already registered')) {
    errorModalMessage.value = 'Email Already Exists'
    errorModalDetails.value = error
    errorModalSuggestions.value = [
      'Try logging in if you already have an account',
      'Use a different email address',
      'If you forgot your password, use the "Forgot Password" feature'
    ]
    showErrorModal.value = true
  } else if (error.includes('Missing required fields')) {
    errorModalMessage.value = 'Missing Information'
    errorModalDetails.value = error
    errorModalSuggestions.value = [
      'Fill in all required fields marked with *',
      'Check that all fields are correctly filled',
      'Ensure password meets minimum requirements'
    ]
    showErrorModal.value = true
  } else if (error.includes('Network') || error.includes('connection')) {
    errorModalMessage.value = 'Connection Error'
    errorModalDetails.value = error
    errorModalSuggestions.value = [
      'Check your internet connection',
      'Try again in a few moments',
      'This is a demo app, so it uses mock data'
    ]
    showErrorModal.value = true
  } else {
    // For validation errors, show inline
    inlineError.value = error
  }
}

function closeSuccessModal() {
  showSuccessModal.value = false
  // Also hide modal in auth store
  authStore.hideSuccessModal()
}

function closeErrorModal() {
  showErrorModal.value = false
  errorModalMessage.value = ''
  errorModalDetails.value = ''
  errorModalSuggestions.value = []
  authStore.clearError()
}

function retryRegistration() {
  showErrorModal.value = false
  // Clear only password fields for retry
  form.password = ''
  form.password_confirmation = ''
  authStore.clearError()
}

// Validation
const validateField = (field: keyof FormData): void => {
  const value = form[field]

  switch (field) {
    case 'name':
      errors.name = !value.trim() ? 'Name is required' : value.length < 2 ? 'Name must be at least 2 characters' : ''
      break
    case 'email':
      if (!value.trim()) {
        errors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.email = 'Please enter a valid email address'
      } else {
        errors.email = ''
      }
      break
    case 'phone':
      if (!value.trim()) {
        errors.phone = 'Phone number is required'
      } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\D/g, ''))) {
        errors.phone = 'Please enter a valid phone number'
      } else {
        errors.phone = ''
      }
      break
    case 'business_name':
      errors.business_name = !value.trim() ? 'Business name is required' : ''
      break
    case 'tin':
      errors.tin = !value.trim() ? 'TIN is required' : ''
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
    case 'password_confirmation':
      if (!value) {
        errors.password_confirmation = 'Please confirm your password'
      } else if (value !== form.password) {
        errors.password_confirmation = 'Passwords do not match'
      } else {
        errors.password_confirmation = ''
      }
      break
  }
}

const validateForm = (): boolean => {
  Object.keys(form).forEach(field => {
    validateField(field as keyof FormData)
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
    const result = await authStore.register(form)

    if (result?.success) {
      // Note: The modal is now handled by the auth store state
      // The watch() function above will pick up the success state

      // Clear form
      Object.keys(form).forEach(key => {
        form[key as keyof FormData] = ''
      })

      // Clear errors
      Object.keys(errors).forEach(key => {
        errors[key as keyof Errors] = ''
      })
    }
  } catch (error) {
    console.error('Registration failed:', error)
  }
}

const goToLogin = () => {
  closeSuccessModal()
  registrationCredentials.value = undefined
  router.push({
    path: '/login',
    query: { registered: 'true' }
  })
}
</script>
