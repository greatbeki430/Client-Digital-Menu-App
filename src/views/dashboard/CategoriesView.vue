<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Menu Categories</h1>
        <p class="text-gray-600 mt-2">Manage your restaurant menu categories</p>
      </div>
      <router-link to="/dashboard/categories/create" class="inline-block">
        <BaseButton variant="primary" class="whitespace-nowrap">
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
      <router-link to="/dashboard/categories/create" class="btn-primary mt-4 inline-flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Category
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
              <BaseButton variant="secondary" size="sm">Edit</BaseButton>
            </router-link>
            <BaseButton @click="deleteCategory(category.id)" variant="danger" size="sm"
              :loading="deletingId === category.id">
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

const categoryStore = useCategoryStore()
const deletingId = ref<number | null>(null)

onMounted(() => {
  categoryStore.fetchCategories()
})

const deleteCategory = async (id: number) => {
  if (!confirm('Are you sure you want to delete this category?')) return

  try {
    deletingId.value = id
    await categoryStore.deleteCategory(id)
  } catch (error) {
    console.error(error)
    alert('Failed to delete category')
  } finally {
    deletingId.value = null
  }
}
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}
</style>
