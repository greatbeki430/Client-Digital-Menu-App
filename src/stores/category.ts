import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Category, CategoriesResponse } from '@/types/category'
import type { ApiResponse } from '@/types/auth'
import categoryService from '@/services/categoryService'

export const useCategoryStore = defineStore('category', () => {
  // State
  const categories = ref<Category[]>([])
  const currentCategory = ref<Category | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  })

  // Getters
  const totalCategories = computed(() => categories.value.length)

  // Helper function to prepare data
  function prepareCategoryData(data: FormData | { name: string; description?: string; image?: File | string }): FormData | { name: string; description?: string; image?: string } {
    if (data instanceof FormData) {
      return data
    }

    return {
      name: data.name,
      description: data.description,
      image: typeof data.image === 'string' ? data.image : undefined
    }
  }

  // Actions
  async function fetchCategories(page = 1): Promise<ApiResponse<CategoriesResponse>> {
    try {
      loading.value = true
      error.value = null

      const response = await categoryService.getAll(page)

      if (!response.success) {
        throw new Error(response.message)
      }

      if (response.data) {
        categories.value = response.data.data
        pagination.value = {
          current_page: response.data.meta.current_page,
          last_page: response.data.meta.last_page,
          per_page: response.data.meta.per_page,
          total: response.data.meta.total,
        }
      }

      return response
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
        throw err
      } else {
        const message = String(err)
        error.value = message
        throw new Error(message)
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchCategory(id: number): Promise<ApiResponse<Category>> {
    try {
      loading.value = true
      error.value = null

      const response = await categoryService.get(id)

      if (!response.success) {
        throw new Error(response.message)
      }

      if (response.data) {
        currentCategory.value = response.data
      }

      return response
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
        throw err
      } else {
        const message = String(err)
        error.value = message
        throw new Error(message)
      }
    } finally {
      loading.value = false
    }
  }

  async function createCategory(
    data: FormData | { name: string; description?: string; image?: File | string }
  ): Promise<ApiResponse<Category>> {
    try {
      loading.value = true
      error.value = null

      // Prepare data
      const preparedData = prepareCategoryData(data)

      // Handle FormData creation for file upload
      let requestData: FormData | { name: string; description?: string; image?: string }

      if (preparedData instanceof FormData) {
        requestData = preparedData
      } else if (data instanceof FormData) {
        requestData = data
      } else if (data.image instanceof File) {
        const formData = new FormData()
        formData.append('name', data.name)
        if (data.description) formData.append('description', data.description)
        formData.append('image', data.image)
        requestData = formData
      } else {
        requestData = preparedData
      }

      const response = await categoryService.create(requestData)

      if (!response.success) {
        throw new Error(response.message)
      }

      if (response.data) {
        categories.value.push(response.data)
      }

      return response
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
        throw err
      } else {
        const message = String(err)
        error.value = message
        throw new Error(message)
      }
    } finally {
      loading.value = false
    }
  }

  async function updateCategory(
    id: number,
    data: FormData | { name: string; description?: string; image?: File | string }
  ): Promise<ApiResponse<Category>> {
    try {
      loading.value = true
      error.value = null

      // Prepare data
      const preparedData = prepareCategoryData(data)

      // Handle FormData creation for file upload
      let requestData: FormData | { name: string; description?: string; image?: string }

      if (preparedData instanceof FormData) {
        requestData = preparedData
      } else if (data instanceof FormData) {
        requestData = data
      } else if (data.image instanceof File) {
        const formData = new FormData()
        formData.append('name', data.name)
        if (data.description) formData.append('description', data.description)
        formData.append('image', data.image)
        requestData = formData
      } else {
        requestData = preparedData
      }

      const response = await categoryService.update(id, requestData)

      if (!response.success) {
        throw new Error(response.message)
      }

      if (response.data) {
        const index = categories.value.findIndex((c) => c.id === id)
        if (index !== -1) {
          categories.value[index] = response.data
        }
      }

      return response
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
        throw err
      } else {
        const message = String(err)
        error.value = message
        throw new Error(message)
      }
    } finally {
      loading.value = false
    }
  }

  async function deleteCategory(id: number): Promise<ApiResponse<void>> {
    try {
      loading.value = true
      error.value = null

      const response = await categoryService.delete(id)

      if (!response.success) {
        throw new Error(response.message)
      }

      categories.value = categories.value.filter((category) => category.id !== id)
      return response
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
        throw err
      } else {
        const message = String(err)
        error.value = message
        throw new Error(message)
      }
    } finally {
      loading.value = false
    }
  }

  function clearError(): void {
    error.value = null
  }

  return {
    // State
    categories,
    currentCategory,
    loading,
    error,
    pagination,

    // Getters
    totalCategories,

    // Actions
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError,
  }
})