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
            Sign in
          </BaseButton>
        </div>

        <!-- Register Link -->
        <div class="text-center">
          <router-link to="/register" class="text-sm text-primary-600 hover:text-primary-500">
            Don't have an account? Register
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const authStore = useAuthStore()

interface FormData {
  email: string
  password: string
}

interface Errors {
  email: string
  password: string
}

const form = reactive<FormData>({
  email: 'abc@gmail.com', // Pre-fill with test credentials
  password: 'abctest'
})

const errors = reactive<Errors>({
  email: '',
  password: ''
})

const validateField = (field: keyof FormData): void => {
  const value = form[field]

  switch (field) {
    case 'email':
      if (!value.trim()) {
        errors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.email = 'Invalid email format'
      } else {
        errors.email = ''
      }
      break
    case 'password':
      errors.password = !value ? 'Password is required' : ''
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
    await authStore.login(form)
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>
