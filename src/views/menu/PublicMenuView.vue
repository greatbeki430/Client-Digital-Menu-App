<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
    <!-- Header -->
    <div class="max-w-6xl mx-auto">
      <div class="mb-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Our Delicious Menu
        </h1>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore our carefully crafted selection of dishes, made with the finest ingredients
          and served with passion.
        </p>
      </div>

      <!-- Search and Filter -->
      <div class="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div class="relative w-full md:w-96">
          <input v-model="searchQuery" type="text" placeholder="Search for dishes..."
            class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
          <div class="absolute left-4 top-3.5 text-gray-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div class="flex gap-2">
          <button v-for="filter in filters" :key="filter" @click="toggleFilter(filter)" :class="[
            'px-4 py-2 rounded-lg transition',
            activeFilters.includes(filter)
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]">
            {{ filter }}
          </button>
        </div>
      </div>

      <!-- Categories Section -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Browse by Category</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="category in filteredCategories" :key="category.id"
            class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="h-48 overflow-hidden">
              <img :src="category.image" :alt="category.name"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ category.name }}</h3>
              <p class="text-gray-600 mb-4 line-clamp-2">{{ category.description }}</p>
              <router-link :to="{ name: 'PublicCategories', query: { category: category.name } }"
                class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                View dishes
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Featured Items -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Today's Specials</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="item in featuredItems" :key="item.id"
            class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-lg font-bold text-gray-900">{{ item.name }}</h3>
                <p class="text-gray-600 text-sm">{{ item.category }}</p>
              </div>
              <span class="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                ${{ item.price }}
              </span>
            </div>
            <p class="text-gray-700 mb-4">{{ item.description }}</p>
            <div class="flex items-center justify-between">
              <span class="text-yellow-500 flex items-center">
                ★★★★★
                <span class="text-gray-600 text-sm ml-2">({{ item.rating }})</span>
              </span>
              <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Add to Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading menu...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/category'

const categoryStore = useCategoryStore()
const loading = ref(false)
const searchQuery = ref('')
const filters = ['Popular', 'Vegetarian', 'Spicy', 'Healthy']
const activeFilters = ref<string[]>([])

// Mock featured items (replace with real API later)
const featuredItems = ref([
  {
    id: 1,
    name: 'Grilled Salmon',
    category: 'Seafood',
    description: 'Fresh Atlantic salmon grilled to perfection with herbs.',
    price: '24.99',
    rating: '4.8'
  },
  {
    id: 2,
    name: 'Truffle Pasta',
    category: 'Pasta',
    description: 'Handmade pasta with black truffle and parmesan.',
    price: '22.50',
    rating: '4.9'
  },
  {
    id: 3,
    name: 'Chocolate Lava Cake',
    category: 'Dessert',
    description: 'Warm chocolate cake with molten center and vanilla ice cream.',
    price: '12.99',
    rating: '4.7'
  }
])

// Fetch categories
onMounted(async () => {
  loading.value = true
  try {
    await categoryStore.fetchCategories(1)
  } catch (error) {
    console.error('Failed to load categories:', error)
  } finally {
    loading.value = false
  }
})

// Filter categories based on search and active filters
const filteredCategories = computed(() => {
  let filtered = categoryStore.categories

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter(category =>
      category.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Active filters (mock implementation)
  if (activeFilters.value.includes('Vegetarian')) {
    filtered = filtered.filter(category =>
      ['Vegetarian', 'Vegan', 'Salads'].includes(category.name)
    )
  }

  return filtered
})

function toggleFilter(filter: string) {
  const index = activeFilters.value.indexOf(filter)
  if (index > -1) {
    activeFilters.value.splice(index, 1)
  } else {
    activeFilters.value.push(filter)
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
