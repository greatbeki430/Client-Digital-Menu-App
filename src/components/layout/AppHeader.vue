<template>
  <header class="bg-white shadow border-b border-gray-200">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <span class="text-xl font-bold text-gray-900">{{ appName }}</span>
          </router-link>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center space-x-6">
          <router-link v-for="link in navigationLinks" :key="link.to" :to="link.to"
            class="text-gray-600 hover:text-primary-600 transition-colors duration-200 font-medium"
            active-class="text-primary-600 border-b-2 border-primary-600">
            {{ link.label }}
          </router-link>
        </nav>

        <!-- User Menu -->
        <div class="flex items-center space-x-4">
          <div v-if="authStore.user" class="flex items-center space-x-3">
            <div class="text-right hidden md:block">
              <p class="text-sm font-medium text-gray-900">{{ authStore.user.name }}</p>
              <p class="text-xs text-gray-500">{{ authStore.user.business_name }}</p>
            </div>
            <button @click="handleLogout"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200">
              Logout
            </button>
          </div>
          <div v-else class="flex items-center space-x-3">
            <router-link to="/login"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200">
              Login
            </router-link>
            <router-link to="/register"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors duration-200">
              Register
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const appName = import.meta.env.VITE_APP_NAME || 'Digital Menu'

const navigationLinks = computed(() => {
  // For authenticated users (admin), show dashboard routes
  if (authStore.isAuthenticated) {
    return [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/dashboard/categories', label: 'Categories' },
      { to: '/dashboard/menu-items', label: 'Menu Items' }
    ]
  }

  // For non-authenticated users (customers), show public routes
  return [
    { to: '/menu', label: 'Menu' },
    { to: '/categories', label: 'Categories' },
    { to: '/', label: 'Home' }
  ]
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
