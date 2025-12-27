<template>
  <div class="home-container px-4 py-8 max-w-7xl mx-auto">

    <!-- Hero Section -->
    <section class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to Digital Menu</h1>
      <p class="text-lg text-gray-600">Browse our delicious categories and explore your favorite dishes!</p>
      <p class="text-sm text-gray-500 mt-2">{{ categoryStore.totalCategories }} categories available</p>
    </section>

    <!-- Featured Categories -->
    <section>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-900">All Categories</h2>
        <router-link :to="{ name: 'PublicCategories' }"
          class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
          View All
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>

      <!-- → -->
      <div v-if="categoryStore.loading && categoryStore.categories.length === 0" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading categories...</p>
      </div>

      <div v-else-if="categoryStore.error" class="rounded-md bg-red-50 p-4 mb-6 text-red-700">
        {{ categoryStore.error }}
      </div>

      <div v-else-if="categoryStore.categories.length === 0" class="text-center py-12 text-gray-500">
        No categories available.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div v-for="category in categoryStore.categories" :key="category.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
          <div class="h-40 w-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
            <img v-if="category.image" :src="category.image" :alt="category.name"
              class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div v-else
              class="h-40 w-full bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center text-gray-400">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
              #{{ category.id }}
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-lg text-gray-900 truncate">{{ category.name }}</h3>
            <p class="text-gray-600 text-sm mt-1 line-clamp-2">{{ category.description || 'Explore delicious options' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Load More Button for Pagination -->
      <div v-if="categoryStore.pagination.current_page < categoryStore.pagination.last_page" class="mt-8 text-center">
        <button @click="loadMoreCategories"
          class="px-6 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          :disabled="categoryStore.loading">
          <span v-if="categoryStore.loading">Loading...</span>
          <span v-else>Load More</span>
        </button>
      </div>

      <!-- Category Stats -->
      <div v-if="categoryStore.categories.length > 0" class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-blue-50 rounded-lg p-4">
          <p class="text-sm text-blue-700">Total Categories</p>
          <p class="text-2xl font-bold text-blue-900">{{ categoryStore.totalCategories }}</p>
        </div>
        <div class="bg-green-50 rounded-lg p-4">
          <p class="text-sm text-green-700">Current Page</p>
          <p class="text-2xl font-bold text-green-900">{{ categoryStore.pagination.current_page }}</p>
        </div>
        <div class="bg-purple-50 rounded-lg p-4">
          <p class="text-sm text-purple-700">Total Pages</p>
          <p class="text-2xl font-bold text-purple-900">{{ categoryStore.pagination.last_page }}</p>
        </div>
        <div class="bg-yellow-50 rounded-lg p-4">
          <p class="text-sm text-yellow-700">Per Page</p>
          <p class="text-2xl font-bold text-yellow-900">{{ categoryStore.pagination.per_page }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCategoryStore } from '@/stores/category'

// Use Pinia store
const categoryStore = useCategoryStore()

// Fetch categories when component mounts
onMounted(() => {
  categoryStore.fetchCategories()
})

// Load more categories
const loadMoreCategories = async () => {
  const nextPage = categoryStore.pagination.current_page + 1
  await categoryStore.fetchCategories(nextPage)
}
</script>
