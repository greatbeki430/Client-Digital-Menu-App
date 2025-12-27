<template>
  <div class="menu-items-list">
    <!-- Search and Filter -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input v-model="searchQuery" type="text"
            class="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search menu items..." @input="handleSearch" />
        </div>

        <div class="flex items-center space-x-3">
          <select v-model="selectedCategory"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>

          <slot name="addButton"></slot>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && items.length === 0" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading menu items...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="rounded-md bg-red-50 p-4 mb-6">
      <div class="flex">
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredItems.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No menu items found</h3>
      <p class="mt-1 text-gray-500">Get started by creating your first menu item.</p>
      <div class="mt-6">
        <slot name="emptyStateButton"></slot>
      </div>
    </div>

    <!-- Menu Items Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in filteredItems" :key="item.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        <!-- Item Image -->
        <div class="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img v-if="item.photo" :src="item.photo" :alt="item.item_name"
            class="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
          <div v-else class="text-gray-400">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <!-- Item Content -->
        <div class="p-6">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-xl font-semibold text-gray-900">
              {{ item.item_name }}
            </h3>
            <button @click="$emit('toggle-favorite', item.id)" class="p-1 rounded-full hover:bg-gray-100"
              :class="{ 'text-red-500': isFavorite(item.id) }">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path v-if="isFavorite(item.id)"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                <path v-else
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="none" stroke="currentColor" stroke-width="2" />
              </svg>
            </button>
          </div>

          <!-- Category Badge -->
          <div class="mb-3">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {{ item.category?.name || 'Uncategorized' }}
            </span>
          </div>

          <!-- Pricing -->
          <div class="space-y-2 mb-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Price:</span>
              <span class="font-medium">${{ item.price.toFixed(2) }}</span>
            </div>
            <div v-if="item.discount" class="flex justify-between">
              <span class="text-gray-600">Discount:</span>
              <span class="font-medium text-green-600">{{ item.discount }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Tax:</span>
              <span class="font-medium">{{ item.tax_percentage }}%</span>
            </div>
            <div class="flex justify-between border-t border-gray-200 pt-2">
              <span class="font-semibold">Final Price:</span>
              <span class="font-bold text-lg text-green-700">
                ${{
                  calculateFinalPrice(item.price, item.tax_percentage, item.discount).toFixed(2)
                }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-2">
            <button @click="$emit('edit', item)"
              class="px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors duration-200">
              Edit
            </button>
            <button @click="$emit('delete', item.id)" :disabled="deletingId === item.id"
              class="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200 disabled:opacity-50">
              <span v-if="deletingId === item.id">Deleting...</span>
              <span v-else>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="mt-8">
      <BasePagination :current-page="pagination.current_page" :total-pages="pagination.last_page"
        :from="pagination.from || 1" :to="pagination.to || pagination.per_page" :total="pagination.total"
        @page-change="$emit('page-change', $event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import { debounce } from '@/utils/helpers'
import type { MenuItem } from '@/types/menuItem'
import type { Category } from '@/types/category'

interface Props {
  items: MenuItem[]
  categories: Category[]
  loading: boolean
  error: string
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from?: number
    to?: number
  }
  deletingId?: number | null
  favorites: number[]
}

interface Emits {
  (e: 'search', query: string): void
  (e: 'page-change', page: number): void
  (e: 'edit', item: MenuItem): void
  (e: 'delete', id: number): void
  (e: 'toggle-favorite', id: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchQuery = ref('')
const selectedCategory = ref<number | string>('')

const filteredItems = computed(() => {
  let filtered = props.items

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.item_name.toLowerCase().includes(query) ||
      item.category?.name.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(item => item.category_id === Number(selectedCategory.value))
  }

  return filtered
})

const handleSearch = debounce(() => {
  emit('search', searchQuery.value)
}, 500)

const isFavorite = (id: number): boolean => {
  return props.favorites.includes(id)
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
