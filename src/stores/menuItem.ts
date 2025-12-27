import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  MenuItem,
  MenuItemsResponse,
  GroupedMenuItems,
  MenuItemFormData,
} from '@/types/menuItem'
import type { ApiResponse } from '@/types/auth'
import menuItemService from '@/services/menuItemService'

export const useMenuItemStore = defineStore('menuItem', () => {
  // State
  const menuItems = ref<MenuItem[]>([])
  const currentMenuItem = ref<MenuItem | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  })
  const searchQuery = ref('')
  const favorites = ref<number[]>(JSON.parse(localStorage.getItem('favorites') || '[]'))

  // Getters
  const groupedMenuItems = computed(() => {
    const grouped: GroupedMenuItems = {}
    menuItems.value.forEach((item) => {
      if (!item.category) return
      const categoryId = item.category.id
      if (!grouped[categoryId]) {
        grouped[categoryId] = {
          category: item.category,
          items: [],
        }
      }
      grouped[categoryId].items.push(item)
    })
    return grouped
  })

  const filteredMenuItems = computed(() => {
    if (!searchQuery.value) return menuItems.value
    const query = searchQuery.value.toLowerCase()
    return menuItems.value.filter(
      (item) =>
        item.item_name.toLowerCase().includes(query) ||
        item.category?.name.toLowerCase().includes(query),
    )
  })

  const isFavorite = computed(() => (id: number) => {
    return favorites.value.includes(id)
  })

  // Helper function to extract message from unknown errors
  function extractErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message
    return String(error)
  }

  // Convert form data to proper type
  function prepareMenuItemData(data: FormData | MenuItemFormData): FormData | MenuItemFormData {
    if (data instanceof FormData) {
      return data
    }

    // Convert string numbers to actual numbers
    return {
      item_name: data.item_name,
      category_id:
        typeof data.category_id === 'string' ? parseInt(data.category_id) : data.category_id,
      price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
      tax_percentage:
        typeof data.tax_percentage === 'string'
          ? parseFloat(data.tax_percentage)
          : data.tax_percentage,
      discount:
        data.discount !== undefined && data.discount !== ''
          ? typeof data.discount === 'string'
            ? parseFloat(data.discount)
            : data.discount
          : undefined,
      photo: data.photo,
    }
  }

  // Actions
  async function fetchMenuItems(page = 1, search = ''): Promise<ApiResponse<MenuItemsResponse>> {
    try {
      loading.value = true
      error.value = null
      searchQuery.value = search
      const response = await menuItemService.getAll({ page, search })
      if (!response.success) throw new Error(response.message)
      if (response.data) {
        menuItems.value = response.data.data
        pagination.value = {
          current_page: response.data.meta.current_page,
          last_page: response.data.meta.last_page,
          per_page: response.data.meta.per_page,
          total: response.data.meta.total,
        }
      }
      return response
    } catch (err: unknown) {
      const msg = extractErrorMessage(err)
      error.value = msg
      throw new Error(msg)
    } finally {
      loading.value = false
    }
  }

  async function fetchMenuItem(id: number): Promise<ApiResponse<MenuItem>> {
    try {
      loading.value = true
      error.value = null
      const response = await menuItemService.get(id)
      if (!response.success) throw new Error(response.message)
      if (response.data) currentMenuItem.value = response.data
      return response
    } catch (err: unknown) {
      const msg = extractErrorMessage(err)
      error.value = msg
      throw new Error(msg)
    } finally {
      loading.value = false
    }
  }

  async function createMenuItem(data: FormData | MenuItemFormData): Promise<ApiResponse<MenuItem>> {
    try {
      loading.value = true
      error.value = null

      // Prepare data (convert string numbers to actual numbers)
      const preparedData = prepareMenuItemData(data)

      const response = await menuItemService.create(preparedData)
      if (!response.success) throw new Error(response.message)
      if (response.data) menuItems.value.push(response.data)
      return response
    } catch (err: unknown) {
      const msg = extractErrorMessage(err)
      error.value = msg
      throw new Error(msg)
    } finally {
      loading.value = false
    }
  }

  async function updateMenuItem(
    id: number,
    data: FormData | MenuItemFormData,
  ): Promise<ApiResponse<MenuItem>> {
    try {
      loading.value = true
      error.value = null

      // Prepare data (convert string numbers to actual numbers)
      const preparedData = prepareMenuItemData(data)

      const response = await menuItemService.update(id, preparedData)
      if (!response.success) throw new Error(response.message)
      if (response.data) {
        const index = menuItems.value.findIndex((item) => item.id === id)
        if (index !== -1) menuItems.value[index] = response.data
      }
      return response
    } catch (err: unknown) {
      const msg = extractErrorMessage(err)
      error.value = msg
      throw new Error(msg)
    } finally {
      loading.value = false
    }
  }

  async function deleteMenuItem(id: number): Promise<ApiResponse<void>> {
    try {
      loading.value = true
      error.value = null
      const response = await menuItemService.delete(id)
      if (!response.success) throw new Error(response.message)
      menuItems.value = menuItems.value.filter((item) => item.id !== id)
      removeFromFavorites(id)
      return response
    } catch (err: unknown) {
      const msg = extractErrorMessage(err)
      error.value = msg
      throw new Error(msg)
    } finally {
      loading.value = false
    }
  }

  function toggleFavorite(id: number): void {
    const index = favorites.value.indexOf(id)
    if (index > -1) favorites.value.splice(index, 1)
    else favorites.value.push(id)
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  function removeFromFavorites(id: number): void {
    const index = favorites.value.indexOf(id)
    if (index > -1) {
      favorites.value.splice(index, 1)
      localStorage.setItem('favorites', JSON.stringify(favorites.value))
    }
  }

  function setSearchQuery(query: string): void {
    searchQuery.value = query
  }

  function clearError(): void {
    error.value = null
  }

  return {
    // State
    menuItems,
    currentMenuItem,
    loading,
    error,
    pagination,
    searchQuery,
    favorites,

    // Getters
    groupedMenuItems,
    filteredMenuItems,
    isFavorite,

    // Actions
    fetchMenuItems,
    fetchMenuItem,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleFavorite,
    removeFromFavorites,
    setSearchQuery,
    clearError,
  }
})
