<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Menu Items</h1>
          <p class="text-gray-600 mt-2">Manage your restaurant menu items</p>
        </div>
        <!--/dashboard prefix -->
        <router-link to="/dashboard/menu-items/create" class="inline-block">
          <BaseButton variant="primary" class="whitespace-nowrap">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Menu Item
          </BaseButton>
        </router-link>
      </div>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input v-model="searchQuery" type="text"
          class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Search items by name or category..." @input="handleSearch" />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="menuItemStore.loading && menuItemStore.menuItems.length === 0" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading menu items...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="menuItemStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ menuItemStore.error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="menuItemStore.menuItems.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No menu items yet</h3>
      <p class="mt-1 text-gray-500">Get started by creating your first menu item.</p>
      <div class="mt-6">
        <!-- /dashboard prefix -->
        <router-link to="/dashboard/menu-items/create"
          class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Menu Item
        </router-link>
      </div>
    </div>

    <!-- Menu Items by Category -->
    <div v-else class="space-y-8">
      <div v-for="group in menuItemStore.groupedMenuItems" :key="group.category.id"
        class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Category Header -->
        <div class="bg-gray-50 px-6 py-4 border-b">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ group.category.name }}
          </h3>
          <p v-if="group.category.description" class="text-gray-600 text-sm mt-1">
            {{ group.category.description }}
          </p>
        </div>

        <!-- Items List -->
        <div class="divide-y">
          <div v-for="item in group.items" :key="item.id"
            class="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-start space-x-4">
                  <!-- Item Image -->
                  <div class="flex-shrink-0">
                    <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <img v-if="item.photo" :src="item.photo" :alt="item.item_name"
                        class="w-full h-full object-cover" />
                      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <!-- Item Details -->
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="text-lg font-medium text-gray-900">
                          {{ item.item_name }}
                        </h4>
                        <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span>Price: ${{ item.price.toFixed(2) }}</span>
                          <span>Tax: {{ item.tax_percentage }}%</span>
                          <span v-if="item.discount">Discount: {{ item.discount }}%</span>
                        </div>
                      </div>

                      <!-- Actions -->
                      <div class="flex items-center space-x-2">
                        <!-- Favorite Button -->
                        <button @click="menuItemStore.toggleFavorite(item.id)"
                          class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                          :class="{ 'text-red-500': menuItemStore.isFavorite(item.id) }">
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path v-if="menuItemStore.isFavorite(item.id)"
                              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            <path v-else
                              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                              fill="none" stroke="currentColor" stroke-width="2" />
                          </svg>
                        </button>

                        <!-- Edit Button - /dashboard prefix -->
                        <router-link :to="`/dashboard/menu-items/${item.id}/edit`">
                          <BaseButton variant="secondary" size="sm">
                            Edit
                          </BaseButton>
                        </router-link>

                        <!-- Delete Button -->
                        <BaseButton @click="deleteMenuItem(item.id)" variant="danger" size="sm"
                          :loading="deletingId === item.id">
                          Delete
                        </BaseButton>
                      </div>
                    </div>

                    <!-- Final Price Calculation -->
                    <div class="mt-2">
                      <span class="text-sm text-gray-500">
                        Final Price:
                        <span class="font-semibold text-green-600">
                          ${{
                            calculateFinalPrice(item.price, item.tax_percentage, item.discount).toFixed(2)
                          }}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="menuItemStore.pagination.last_page > 1" class="mt-8">
      <BasePagination :current-page="menuItemStore.pagination.current_page"
        :total-pages="menuItemStore.pagination.last_page"
        :from="menuItemStore.pagination.per_page * (menuItemStore.pagination.current_page - 1) + 1"
        :to="Math.min(menuItemStore.pagination.total, menuItemStore.pagination.per_page * menuItemStore.pagination.current_page)"
        :total="menuItemStore.pagination.total" @page-change="handlePageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMenuItemStore } from '@/stores/menuItem'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/ui/BaseButton.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import { debounce } from '@/utils/helpers'
import { syncAuthentication } from '@/utils/authSync'

const router = useRouter()
const route = useRoute()
const menuItemStore = useMenuItemStore()
const authStore = useAuthStore()
const searchQuery = ref('')
const deletingId = ref<number | null>(null)

onMounted(async () => {
  console.log('=== DEBUG: MenuItemsView mounted ===')

  // Sync authentication data first
  console.log('🔄 Syncing authentication data...')
  const authSynced = syncAuthentication()
  console.log('✅ Auth sync result:', authSynced)

  // Debug authentication
  console.log('🔍 Authentication Debug:')
  console.log('Auth Store isAuthenticated:', authStore.isAuthenticated)
  console.log('Auth Store user:', authStore.user)

  // Check ALL possible token locations
  console.log('🔑 Token locations:')
  console.log('1. localStorage access_token:', localStorage.getItem('access_token'))
  console.log('2. localStorage token:', localStorage.getItem('token'))

  console.log('👤 User locations:')
  console.log('1. localStorage user:', localStorage.getItem('user'))

  // DEVELOPMENT MODE: Bypass strict auth checks
  if (import.meta.env.DEV) {
    console.log('🚧 DEV MODE: Using simplified auth check')

    // Ensure we have mock auth data
    if (!localStorage.getItem('access_token')) {
      console.log('🔄 Setting up mock auth data...')
      localStorage.setItem('access_token', 'dev-mock-token')
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Dev Restaurant',
        email: 'dev@example.com',
        business_name: 'Dev Restaurant',
        phone: '+1234567890',
        tin: 'DEV123456',
        email_verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))

      // Update auth store
      authStore.user = JSON.parse(localStorage.getItem('user') || '{}')
    }

    // Load menu items (bypass auth)
    try {
      console.log('🔄 Loading menu items (dev mode)...')
      await menuItemStore.fetchMenuItems()
      console.log('✅ Menu items loaded successfully (dev mode)')
    } catch (error) {
      console.error('❌ Error loading menu items:', error)
      menuItemStore.error = 'Failed to load menu items. Please try again.'
    }
    return
  }

  // PRODUCTION MODE: Use proper auth check
  if (!authStore.isAuthenticated) {
    console.warn('⚠️ User not authenticated, checking localStorage...')

    // Try to restore from localStorage
    const token = localStorage.getItem('access_token')
    const userStr = localStorage.getItem('user')

    if (token && userStr) {
      try {
        authStore.user = JSON.parse(userStr)
        console.log('✅ Restored user from localStorage:', authStore.user?.name)
      } catch (e) {
        console.error('Failed to parse user:', e)
      }
    }

    // Check again after restoration
    if (!authStore.isAuthenticated) {
      console.warn('❌ User still not authenticated, redirecting to login')
      router.push('/login')
      return
    }
  }

  // Load menu items
  try {
    console.log('🔄 Fetching menu items...')
    await menuItemStore.fetchMenuItems()
    console.log('✅ Menu items loaded successfully')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('❌ Error fetching menu items:', error)
    if (route.path.startsWith('/dashboard') && (error.message?.includes('Unauthenticated') || error.response?.status === 401)) {  // Using route.path
      console.warn('🔐 Token invalid/expired, logging out...')
      await authStore.logout()
      router.push('/login')
    } else {
      menuItemStore.error = 'Failed to load menu items. Please try again.'
    }
  }
})

const handlePageChange = (page: number): void => {
  menuItemStore.fetchMenuItems(page, searchQuery.value)
}

const handleSearch = debounce(() => {
  menuItemStore.fetchMenuItems(1, searchQuery.value)
}, 500)

const deleteMenuItem = async (id: number): Promise<void> => {
  if (!confirm('Are you sure you want to delete this menu item?')) {
    return
  }

  try {
    deletingId.value = id
    await menuItemStore.deleteMenuItem(id)
  } catch (error) {
    console.error('Failed to delete menu item:', error)
    alert('Failed to delete menu item. Please try again.')
  } finally {
    deletingId.value = null
  }
}

const calculateFinalPrice = (price: number, tax: number, discount?: number): number => {
  let finalPrice = price

  // Apply discount if exists
  if (discount) {
    finalPrice = price - (price * discount / 100)
  }

  // Apply tax
  finalPrice = finalPrice + (finalPrice * tax / 100)

  return finalPrice
}
</script>
