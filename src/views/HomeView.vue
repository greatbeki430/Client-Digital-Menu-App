<script setup lang="ts">
import { onMounted } from 'vue'
import { useCategoryStore } from '@/stores/category'

// Use Pinia store
const categoryStore = useCategoryStore()

// Fetch categories when component mounts
onMounted(() => {
  categoryStore.fetchCategories()
})
</script>

<template>
  <div class="home-container px-4 py-8 max-w-7xl mx-auto">

    <!-- Hero Section -->
    <section class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to Digital Menu</h1>
      <p class="text-lg text-gray-600">Browse our delicious categories and explore your favorite dishes!</p>
    </section>

    <!-- Featured Categories -->
    <section>
      <h2 class="text-2xl font-semibold text-gray-900 mb-6">Featured Categories</h2>

      <div v-if="categoryStore.loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading categories...</p>
      </div>

      <div v-else-if="categoryStore.error" class="rounded-md bg-red-50 p-4 mb-6 text-red-700">
        {{ categoryStore.error }}
      </div>

      <div v-else-if="categoryStore.categories.length === 0" class="text-center py-12 text-gray-500">
        No categories available.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="category in categoryStore.categories" :key="category.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <img v-if="category.image" :src="category.image" :alt="category.name" class="h-32 w-full object-cover">
          <div v-else class="h-32 w-full bg-gray-200 flex items-center justify-center text-gray-400">
            No Image
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-lg text-gray-900">{{ category.name }}</h3>
            <p class="text-gray-600 text-sm mt-1">{{ category.description || 'No description' }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
