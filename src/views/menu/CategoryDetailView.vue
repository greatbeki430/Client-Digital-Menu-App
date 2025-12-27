<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-4xl mx-auto">
      <!-- Back button -->
      <button @click="$router.back()" class="flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Categories
      </button>

      <!-- Category Detail -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="category" class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Category Header -->
        <div class="relative h-64 md:h-80">
          <img :src="category.image || '/placeholder-image.jpg'" :alt="category.name"
            class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div class="absolute bottom-6 left-6 right-6">
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">{{ category.name }}</h1>
            <p class="text-gray-200">{{ category.description || 'No description available' }}</p>
          </div>
        </div>

        <!-- Category Info -->
        <div class="p-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{{ itemCount }}</div>
              <div class="text-gray-700">Items</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ avgPrice }}</div>
              <div class="text-gray-700">Avg Price</div>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <div class="text-2xl font-bold text-purple-600">4.8</div>
              <div class="text-gray-700">Rating</div>
            </div>
            <div class="text-center p-4 bg-yellow-50 rounded-lg">
              <div class="text-2xl font-bold text-yellow-600">{{ popularity }}%</div>
              <div class="text-gray-700">Popularity</div>
            </div>
          </div>

          <!-- Items List -->
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Popular Items</h2>
            <div class="space-y-4">
              <div v-for="item in mockItems" :key="item.id"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <h3 class="font-semibold text-gray-900">{{ item.name }}</h3>
                  <p class="text-gray-600 text-sm">{{ item.description }}</p>
                </div>
                <div class="text-right">
                  <div class="text-lg font-bold text-gray-900">${{ item.price }}</div>
                  <div class="text-sm text-gray-500">{{ item.calories }} cal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!loading" class="text-center py-12">
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Category Not Found</h3>
        <p class="text-gray-500">The category you're looking for doesn't exist.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCategoryStore } from '@/stores/category'
import type { Category } from '@/types/category' // Import the Category type

const route = useRoute()
const categoryStore = useCategoryStore()
const loading = ref(false)
// Properly type the category ref
const category = ref<Category | null>(null)

// Type the mock items
interface MockItem {
  id: number
  name: string
  description: string
  price: string
  calories: string
}

// Mock data for items
const mockItems: MockItem[] = [
  { id: 1, name: 'Classic Burger', description: 'Beef patty with cheese and veggies', price: '12.99', calories: '650' },
  { id: 2, name: 'Spicy Burger', description: 'Beef patty with jalapeños and special sauce', price: '14.99', calories: '720' },
  { id: 3, name: 'Veggie Burger', description: 'Plant-based patty with fresh vegetables', price: '11.99', calories: '480' },
  { id: 4, name: 'Double Cheese Burger', description: 'Double beef patty with extra cheese', price: '16.99', calories: '850' },
]

const itemCount = computed(() => Math.floor(Math.random() * 20) + 10)
const avgPrice = computed(() => `$${(Math.random() * 10 + 8).toFixed(2)}`)
const popularity = computed(() => Math.floor(Math.random() * 30) + 70)

onMounted(async () => {
  loading.value = true
  try {
    const categoryId = parseInt(route.params.id as string)
    const response = await categoryStore.fetchCategory(categoryId)
    if (response.success && response.data) {
      category.value = response.data
    }
  } catch (error) {
    console.error('Failed to load category:', error)
  } finally {
    loading.value = false
  }
})
</script>
