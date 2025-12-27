<template>
  <div>
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
            placeholder="Search categories..." @input="handleSearch" />
        </div>

        <div class="flex items-center space-x-3">
          <select v-model="sortBy"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
            <option value="name">Sort by Name</option>
            <option value="created_at">Sort by Date</option>
          </select>

          <slot name="addButton"></slot>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && items.length === 0" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading categories...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="rounded-md bg-red-50 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="items.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No categories found</h3>
      <p class="mt-1 text-gray-500">Get started by creating your first category.</p>
      <div class="mt-6">
        <slot name="emptyStateButton"></slot>
      </div>
    </div>

    <!-- Categories Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="category in sortedItems" :key="category.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        <!-- Category Image -->
        <div class="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img v-if="category.image" :src="category.image" :alt="category.name"
            class="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
          <div v-else class="text-gray-400">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <!-- Category Content -->
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            {{ category.name }}
          </h3>
          <p class="text-gray-600 mb-4">
            {{ category.description || 'No description provided' }}
          </p>

          <!-- Meta Info -->
          <div class="flex items-center text-sm text-gray-500 mb-4">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formatDate(category.created_at) }}</span>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-2">
            <button @click="$emit('edit', category)"
              class="px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors duration-200">
              Edit
            </button>
            <button @click="$emit('delete', category.id)" :disabled="deletingId === category.id"
              class="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200 disabled:opacity-50">
              <span v-if="deletingId === category.id">Deleting...</span>
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
import type { Category } from '@/types/category'

interface Props {
  items: Category[]
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
}

interface Emits {
  (e: 'search', query: string): void
  (e: 'page-change', page: number): void
  (e: 'edit', category: Category): void
  (e: 'delete', id: number): void
}


interface Emits {
  (e: 'search', query: string): void
  (e: 'page-change', page: number): void
  (e: 'edit', category: unknown): void
  (e: 'delete', id: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchQuery = ref('')
const sortBy = ref('name')

const sortedItems = computed(() => {
  return [...props.items].sort((a, b) => {
    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name)
    } else {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })
})


const handleSearch = debounce(() => {
  emit('search', searchQuery.value)
}, 500)

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
