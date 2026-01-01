<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Edit Category</h1>
            <p class="text-gray-600 mt-2">Update category information</p>
          </div>
          <router-link to="/categories"
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200">
            ← Back to Categories
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading category...</p>
      </div>

      <!-- Form -->
      <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Edit Category Details</h2>
        </div>

        <div class="p-6">
          <CategoryForm :initial-data="categoryData" :loading="categoryStore.loading"
            :error="categoryStore.error ?? undefined" @submit="handleSubmit" @cancel="handleCancel" />

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoryStore } from '@/stores/category'
import type { CategoryFormData } from '@/types/category'
import CategoryForm from '@/components/features/categories/CategoryForm.vue'

const route = useRoute()
const router = useRouter()
const categoryStore = useCategoryStore()

const loading = ref(true)
// const categoryData = ref<unknown>(null)
const categoryData = ref<CategoryFormData | undefined>(undefined)
const categoryId = Number(route.params.id)

onMounted(async () => {
  try {
    // Fetch category data
    // For now, we'll use mock data
    categoryData.value = {
      name: 'Category Name',
      description: 'Category description',
      image: undefined
    }


    // await categoryStore.fetchCategory(categoryId)
    // categoryData.value = categoryStore.currentCategory

    loading.value = false
  } catch (error) {
    console.error('Failed to load category:', error)
    router.push('/categories')
  }
})

const handleSubmit = async (formData: CategoryFormData) => {
  try {
    await categoryStore.updateCategory(categoryId, formData)
    router.push('/categories')
  } catch (error) {
    console.error('Failed to update category:', error)
  }
}


const handleCancel = () => {
  router.push('/categories')
}
</script>
