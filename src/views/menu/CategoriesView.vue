<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-10 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          All Menu Categories
        </h1>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Browse through all our food categories. Each category contains a variety of delicious dishes
          prepared by our expert chefs.
        </p>
      </div>

      <!-- Stats -->
      <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-xl shadow-md">
          <div class="text-3xl font-bold text-blue-600 mb-2">{{ totalCategories }}</div>
          <div class="text-gray-700">Total Categories</div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-md">
          <div class="text-3xl font-bold text-green-600 mb-2">50+</div>
          <div class="text-gray-700">Dishes Available</div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-md">
          <div class="text-3xl font-bold text-purple-600 mb-2">24/7</div>
          <div class="text-gray-700">Available for Order</div>
        </div>
      </div>

      <!-- Categories Grid -->
      <div class="mb-8">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Loading categories...</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="category in paginatedCategories" :key="category.id"
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <!-- Category Image -->
            <div class="h-56 overflow-hidden relative">
              <img :src="category.image" :alt="category.name" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-4 left-4">
                <span class="bg-white/90 text-gray-900 text-sm font-semibold px-3 py-1 rounded-full">
                  {{ category.itemCount || '10+' }} items
                </span>
              </div>
            </div>

            <!-- Category Info -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-xl font-bold text-gray-900">{{ category.name }}</h3>
                <button @click="toggleFavorite(category.id)" class="text-gray-400 hover:text-red-500 transition-colors">
                  <svg class="w-6 h-6" :class="{ 'text-red-500 fill-current': isFavorite(category.id) }" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <p class="text-gray-600 mb-4 line-clamp-3">{{ category.description }}</p>

              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">
                  Updated {{ formatDate(category.updated_at) }}
                </span>
                <button @click="viewCategory(category)"
                  class="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                  Explore
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && categoryStore.pagination.last_page > 1" class="flex justify-center mt-8">
        <div class="flex items-center space-x-2">
          <button @click="prevPage" :disabled="categoryStore.pagination.current_page === 1"
            class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
            Previous
          </button>

          <div class="flex items-center space-x-1">
            <button v-for="page in pageRange" :key="page" @click="goToPage(page)" :class="[
              'px-3 py-1 rounded-lg',
              page === categoryStore.pagination.current_page
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 hover:bg-gray-50'
            ]">
              {{ page }}
            </button>
          </div>

          <button @click="nextPage"
            :disabled="categoryStore.pagination.current_page === categoryStore.pagination.last_page"
            class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && categoryStore.categories.length === 0" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">No Categories Found</h3>
        <p class="text-gray-500">No menu categories are available at the moment.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoryStore } from '@/stores/category'

const categoryStore = useCategoryStore()
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const favoriteCategories = ref<number[]>(JSON.parse(localStorage.getItem('favorite_categories') || '[]'))

// Computed properties
const totalCategories = computed(() => categoryStore.pagination.total || categoryStore.categories.length)

const paginatedCategories = computed(() => {
  return categoryStore.categories.map(category => ({
    ...category,
    itemCount: getRandomItemCount()
  }))
})

const pageRange = computed(() => {
  const current = categoryStore.pagination.current_page
  const last = categoryStore.pagination.last_page
  const delta = 2
  const range = []
  const rangeWithDots = []

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    }
  }

  let prev = 0
  for (const i of range) {
    if (prev) {
      if (i - prev === 2) {
        rangeWithDots.push(prev + 1)
      } else if (i - prev !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    prev = i
  }

  return rangeWithDots.filter(p => p !== '...')
})

// Lifecycle
onMounted(async () => {
  await loadCategories()
})

watch(() => route.query.page, async (newPage) => {
  if (newPage) {
    await loadCategories(parseInt(newPage as string))
  }
})

// Methods
async function loadCategories(page = 1) {
  loading.value = true
  try {
    await categoryStore.fetchCategories(page)
  } catch (error) {
    console.error('Failed to load categories:', error)
  } finally {
    loading.value = false
  }
}

function getRandomItemCount() {
  return Math.floor(Math.random() * 20) + 5 // 5-25 items
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function isFavorite(categoryId: number) {
  return favoriteCategories.value.includes(categoryId)
}

function toggleFavorite(categoryId: number) {
  const index = favoriteCategories.value.indexOf(categoryId)
  if (index > -1) {
    favoriteCategories.value.splice(index, 1)
  } else {
    favoriteCategories.value.push(categoryId)
  }
  localStorage.setItem('favorite_categories', JSON.stringify(favoriteCategories.value))
}

function viewCategory(category: unknown) {
  // Navigate to category details or show modal
  console.log('View category:', category)
}

function prevPage() {
  if (categoryStore.pagination.current_page > 1) {
    router.push({ query: { page: categoryStore.pagination.current_page - 1 } })
  }
}

function nextPage() {
  if (categoryStore.pagination.current_page < categoryStore.pagination.last_page) {
    router.push({ query: { page: categoryStore.pagination.current_page + 1 } })
  }
}

function goToPage(page: number | string) {
  if (typeof page === 'number') {
    router.push({ query: { page } })
  }
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
