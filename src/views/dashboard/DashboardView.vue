<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Welcome Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600 mt-2">
        Welcome back, {{ authStore.user?.name || 'User' }}!
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Categories Card -->
      <div class="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Categories</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.categories }}</p>
          </div>
        </div>
      </div>

      <!-- Menu Items Card -->
      <div class="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Menu Items</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.menuItems }}</p>
          </div>
        </div>
      </div>

      <!-- Favorites Card -->
      <div class="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-red-100 rounded-lg">
              <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Favorite Items</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.favorites }}</p>
          </div>
        </div>
      </div>

      <!-- Business Info Card -->
      <div class="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Your Business</p>
            <p class="text-lg font-semibold text-gray-900 truncate">
              {{ authStore.user?.business_name || 'Not set' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Add Category -->
        <router-link to="/dashboard/categories/create"
          class="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <div class="p-2 bg-blue-100 rounded-lg mr-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900">Add Category</h3>
            <p class="text-sm text-gray-500">Create new menu category</p>
          </div>
        </router-link>

        <!-- Add Menu Item -->
        <router-link to="/dashboard/menu-items/create"
          class="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <div class="p-2 bg-green-100 rounded-lg mr-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900">Add Menu Item</h3>
            <p class="text-sm text-gray-500">Add new item to menu</p>
          </div>
        </router-link>

        <!-- View Categories -->
        <router-link to="/dashboard/categories"
          class="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <div class="p-2 bg-purple-100 rounded-lg mr-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900">View Categories</h3>
            <p class="text-sm text-gray-500">Manage all categories</p>
          </div>
        </router-link>

        <!-- View Menu Items -->
        <router-link to="/dashboard/menu-items"
          class="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <div class="p-2 bg-orange-100 rounded-lg mr-4">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900">View Menu Items</h3>
            <p class="text-sm text-gray-500">Manage all menu items</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Recent Activity</h2>
      </div>
      <div class="p-6">
        <div v-if="recentActivity.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="mt-2 text-gray-500">No recent activity</p>
        </div>
        <div v-else class="space-y-4">
          <div v-for="activity in recentActivity" :key="activity.id"
            class="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
            <div class="flex items-center">
              <div class="p-2 bg-gray-100 rounded-lg mr-4">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="activity.type === 'category'" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ activity.description }}</p>
                <p class="text-sm text-gray-500">{{ formatTime(activity.timestamp) }}</p>
              </div>
            </div>
            <span class="px-2 py-1 text-xs font-medium rounded-full" :class="activityTypeClasses[activity.type]">
              {{ activity.type }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authUtils } from '@/utils/auth'


// Component-level variable for interval - FIXED: Use number instead of NodeJS.Timeout
let tokenCheckInterval: number | null = null

// Loading state
const isLoading = ref(true)
const authStore = useAuthStore()
const router = useRouter()

interface Activity {
  id: number
  type: 'category' | 'menu-item'
  description: string
  timestamp: string
}

interface Stats {
  categories: number
  menuItems: number
  favorites: number
}

const stats = ref<Stats>({
  categories: 0,
  menuItems: 0,
  favorites: 0
})

const recentActivity = ref<Activity[]>([])

const activityTypeClasses = {
  'category': 'bg-blue-100 text-blue-800',
  'menu-item': 'bg-green-100 text-green-800'
}

onMounted(async () => {
  console.log('=== DASHBOARD MOUNTED ===')

  try {
    // Step 1: Use authUtils to validate authentication
    const token = authUtils.getToken()
    console.log('🔑 Token from authUtils:', token ? 'Exists' : 'Missing')

    if (!token) {
      console.warn('❌ No access token found')
      await handleUnauthenticated()
      return
    }

    // Step 2: Use authUtils to validate JWT
    if (!authUtils.validateJWT(token)) {
      console.warn('❌ JWT token validation failed')
      await handleUnauthenticated()
      return
    }

    // Step 3: Use authUtils to validate and sync auth store
    if (!authUtils.validateAuth(authStore)) {
      console.warn('❌ Auth store validation failed')
      await handleUnauthenticated()
      return
    }

    console.log('✅ Authentication successful (via authUtils):', {
      user: authStore.user?.name,
      business: authStore.user?.business_name,
      isAuthenticated: authStore.isAuthenticated
    })

    // Step 4: Set up periodic token check (every 30 seconds)
    tokenCheckInterval = window.setInterval(() => {
      const currentToken = authUtils.getToken()
      if (!currentToken || !authUtils.validateJWT(currentToken)) {
        console.warn('⚠️ Token validation failed during periodic check')
        handleUnauthenticated()
      }
    }, 30000)

    // Step 5: Set a timeout to detect if navigation happens
    const navigationCheck = setTimeout(() => {
      console.log('✅ Dashboard still visible after 2 seconds - authentication successful')
    }, 2000)

    // Step 6: Load dashboard data
    await loadDashboardData()

    // Step 7: Clear loading state
    isLoading.value = false

    // Clean up navigation check
    clearTimeout(navigationCheck)

    console.log('🎉 Dashboard fully loaded and ready!')

  } catch (error) {
    console.error('❌ Critical error in dashboard initialization:', error)
    await handleUnauthenticated()
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (tokenCheckInterval) {
    window.clearInterval(tokenCheckInterval)
    tokenCheckInterval = null
  }
})

// Handle unauthenticated state
async function handleUnauthenticated() {
  console.log('🔐 User not authenticated, redirecting to login...')

  // Clear interval if it exists
  if (tokenCheckInterval) {
    window.clearInterval(tokenCheckInterval)
    tokenCheckInterval = null
  }

  localStorage.removeItem('access_token')
  localStorage.removeItem('user')

  authStore.user = null

  router.push('/login')
}

// Load dashboard data
async function loadDashboardData() {
  console.log('📊 Loading dashboard data...')

  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    stats.value = {
      categories: 5,
      menuItems: 12,
      favorites: 3
    }

    recentActivity.value = [
      {
        id: 1,
        type: 'category',
        description: 'Created "Desserts" category',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 2,
        type: 'menu-item',
        description: 'Added "Chocolate Cake" to menu',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 3,
        type: 'menu-item',
        description: 'Updated price for "Burger"',
        timestamp: new Date(Date.now() - 10800000).toISOString()
      }
    ]

    console.log('✅ Dashboard data loaded successfully')
  } catch (error) {
    console.error('❌ Failed to load dashboard data:', error)
    stats.value = {
      categories: 0,
      menuItems: 0,
      favorites: 0
    }
    recentActivity.value = []
  }
}

const formatTime = (timestamp: string): string => {
  const now = new Date()
  const activityTime = new Date(timestamp)
  const diffInHours = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }
}
</script>
