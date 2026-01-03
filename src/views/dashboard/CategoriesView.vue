<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Error Modal -->
    <ErrorModal :open="showErrorModal" title="Cannot Delete Category" :message="errorMessage" :details="errorDetails"
      :suggestions="errorSuggestions" confirmText="OK" @close="showErrorModal = false" />

    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Menu Categories</h1>
        <p class="text-gray-600 mt-2">Manage your restaurant menu categories</p>
      </div>
      <router-link to="/dashboard/categories/create" class="inline-block">
        <BaseButton variant="primary" class="whitespace-nowrap inline-flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </BaseButton>
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="categoryStore.loading && categoryStore.categories.length === 0" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading categories...</p>
    </div>

    <!-- Error -->
    <div v-else-if="categoryStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ categoryStore.error }}
    </div>

    <!-- Empty -->
    <div v-else-if="categoryStore.categories.length === 0" class="text-center py-12">
      <h3 class="mt-4 text-lg font-medium text-gray-900">No categories yet</h3>
      <router-link to="/dashboard/categories/create" class="inline-block mt-4">
        <BaseButton variant="primary" class="whitespace-nowrap inline-flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Category
        </BaseButton>
      </router-link>
    </div>

    <!-- Categories Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="category in categoryStore.categories" :key="category.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div class="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img v-if="category.image" :src="category.image" :alt="category.name" class="h-full w-full object-cover" />
          <div v-else class="text-gray-400">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ category.name }}</h3>
          <p class="text-gray-600 mb-4">{{ category.description || 'No description provided' }}</p>
          <div class="flex justify-end space-x-2">
            <router-link :to="`/dashboard/categories/${category.id}/edit`">
              <BaseButton variant="secondary" size="sm" class="inline-flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </BaseButton>
            </router-link>
            <BaseButton @click="deleteCategory(category.id)" variant="danger" size="sm" class="inline-flex items-center"
              :loading="deletingId === category.id">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/category'
import BaseButton from '@/components/ui/BaseButton.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'

const categoryStore = useCategoryStore()
const deletingId = ref<number | null>(null)

// Error modal state
const showErrorModal = ref(false)
const errorMessage = ref('')
const errorDetails = ref('')
const errorSuggestions = ref<string[]>([])

onMounted(() => {
  categoryStore.fetchCategories()
})

const deleteCategory = async (id: number) => {
  if (!confirm('Are you sure you want to delete this category?\n\nNote: This is a demo. In a real app, this would permanently delete the category.')) return

  try {
    deletingId.value = id
    const result = await categoryStore.deleteCategory(id)

    if (!result.success) {
      // Show error modal instead of alert
      errorMessage.value = result.message || 'Failed to delete category'

      // Format errors from the response if available
      if (result.errors && Object.keys(result.errors).length > 0) {
        errorDetails.value = Object.values(result.errors).flat().join('. ')
      } else {
        errorDetails.value = 'This is a demo application. Delete functionality is not implemented in mock mode.'
      }

      errorSuggestions.value = [
        'This is a demonstration application',
        'In a real application, this would delete the category from your database',
        'Try other features like viewing or editing categories'
      ]
      showErrorModal.value = true
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = 'An unexpected error occurred'
    errorDetails.value = error instanceof Error ? error.message : 'Unknown error'
    errorSuggestions.value = [
      'Check your internet connection',
      'Try refreshing the page',
      'Contact support if the problem persists'
    ]
    showErrorModal.value = true
  } finally {
    deletingId.value = null
  }
}
</script>
