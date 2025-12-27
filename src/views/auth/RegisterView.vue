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

        <!-- Error Message -->
        <div v-if="authStore.error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ authStore.error }}
              </h3>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <BaseButton type="submit" :loading="authStore.loading" fullWidth size="lg">
            Register Business
          </BaseButton>
        </div>

        <!-- Login Link -->
        <div class="text-center">
          <router-link to="/login" class="text-sm text-primary-600 hover:text-primary-500">
            Already have an account? Sign in
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
// ref
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

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
        errors.email = 'Invalid email format'
      } else {
        errors.email = ''
      }
      break
    case 'phone':
      if (!value.trim()) {
        errors.phone = 'Phone number is required'
      } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\D/g, ''))) {
        errors.phone = 'Invalid phone number'
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

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) {
    return
  }

  try {
    await authStore.register(form)
    // Redirect to login after successful registration
    router.push('/login')
  } catch (error) {
    console.error('Registration failed:', error)
  }
}
</script>
