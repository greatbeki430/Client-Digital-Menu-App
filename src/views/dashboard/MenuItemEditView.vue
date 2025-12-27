<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <!-- Breadcrumb -->
      <nav class="mb-6" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <router-link to="/dashboard" class="text-gray-400 hover:text-gray-600">
              Dashboard
            </router-link>
          </li>
          <li>
            <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd" />
            </svg>
          </li>
          <li>
            <router-link to="/menu-items" class="text-gray-400 hover:text-gray-600">
              Menu Items
            </router-link>
          </li>
          <li>
            <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd" />
            </svg>
          </li>
          <li class="text-gray-900 font-medium">Edit Menu Item</li>
        </ol>
      </nav>

      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Edit Menu Item</h1>
            <p class="text-gray-600 mt-2">Update your menu item information</p>
          </div>
          <div class="text-sm text-gray-500">
            Item ID: #{{ itemId }}
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading menu item details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="loadError" class="rounded-lg bg-red-50 border border-red-200 p-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Failed to load menu item</h3>
            <p class="mt-1 text-sm text-red-700">{{ loadError }}</p>
            <div class="mt-4">
              <button @click="router.push('/menu-items')"
                class="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-100 rounded transition-colors duration-200">
                ← Back to Menu Items
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Card -->
      <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-6 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="p-2 bg-yellow-100 rounded-lg mr-4">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Edit Menu Item Details</h2>
                <p class="text-sm text-gray-500">Update the information below and save changes</p>
              </div>
            </div>
            <div v-if="menuItemData" class="text-right">
              <div class="text-sm font-medium text-gray-900">{{ menuItemData.item_name }}</div>
              <div class="text-xs text-gray-500">
                Last updated: {{ formatDate(menuItemData.updated_at) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="p-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Item Name -->
              <div>
                <label for="item_name" class="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input id="item_name" v-model="form.item_name" type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  :class="{ 'border-red-300': errors.item_name }" placeholder="e.g., Classic Burger, Caesar Salad"
                  required @blur="validateField('item_name')" />
                <p v-if="errors.item_name" class="mt-1 text-sm text-red-600">{{ errors.item_name }}</p>
              </div>

              <!-- Category -->
              <div>
                <label for="category_id" class="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select id="category_id" v-model="form.category_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  :class="{ 'border-red-300': errors.category_id }" required @blur="validateField('category_id')">
                  <option value="">Select a category</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>

                </select>
                <p v-if="errors.category_id" class="mt-1 text-sm text-red-600">{{ errors.category_id }}</p>
              </div>
            </div>

            <!-- Pricing Information -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Price -->
              <div>
                <label for="price" class="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) *
                </label>
                <div class="relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input id="price" v-model="form.price" type="number" step="0.01" min="0"
                    class="pl-7 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    :class="{ 'border-red-300': errors.price }" placeholder="0.00" required
                    @blur="validateField('price')" />
                </div>
                <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price }}</p>
              </div>

              <!-- Tax Percentage -->
              <div>
                <label for="tax_percentage" class="block text-sm font-medium text-gray-700 mb-1">
                  Tax Percentage (%) *
                </label>
                <div class="relative rounded-md shadow-sm">
                  <input id="tax_percentage" v-model="form.tax_percentage" type="number" step="0.1" min="0" max="100"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    :class="{ 'border-red-300': errors.tax_percentage }" placeholder="10" required
                    @blur="validateField('tax_percentage')" />
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
                <p v-if="errors.tax_percentage" class="mt-1 text-sm text-red-600">{{ errors.tax_percentage }}</p>
              </div>

              <!-- Discount -->
              <div>
                <label for="discount" class="block text-sm font-medium text-gray-700 mb-1">
                  Discount (%)
                  <span class="text-gray-400 text-xs font-normal">(Optional)</span>
                </label>
                <div class="relative rounded-md shadow-sm">
                  <input id="discount" v-model="form.discount" type="number" step="0.1" min="0" max="100"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    :class="{ 'border-red-300': errors.discount }" placeholder="0" @blur="validateField('discount')" />
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
                <p v-if="errors.discount" class="mt-1 text-sm text-red-600">{{ errors.discount }}</p>
              </div>
            </div>

            <!-- Final Price Display -->
            <div v-if="form.price && form.tax_percentage" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-blue-800">Price Calculation</p>
                  <div class="mt-1 space-y-1 text-sm text-blue-700">
                    <div class="flex justify-between">
                      <span>Base Price:</span>
                      <span>${{ parseFloat(form.price).toFixed(2) }}</span>
                    </div>
                    <div v-if="form.discount" class="flex justify-between">
                      <span>Discount ({{ form.discount }}%):</span>
                      <span class="text-green-600">-${{ (parseFloat(form.price) * parseFloat(form.discount) /
                        100).toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>Tax ({{ form.tax_percentage }}%):</span>
                      <span class="text-red-600">+${{ calculateTax().toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between border-t border-blue-200 pt-1 mt-1">
                      <span class="font-semibold">Final Price:</span>
                      <span class="font-bold text-lg text-green-700">${{ calculateFinalPrice().toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Current Image -->
            <div v-if="menuItemData?.photo || imagePreview">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Current Photo
              </label>
              <div class="mt-1">
                <div class="bg-gray-100 rounded-lg p-4">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                      <img :src="imagePreview || menuItemData?.photo || undefined" alt="Current photo"
                        class="h-24 w-24 object-cover rounded-lg"> class="h-24 w-24 object-cover rounded-lg">
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900">Current Photo</p>
                      <p class="text-xs text-gray-500">Upload a new photo to replace this one</p>
                    </div>
                    <div class="flex space-x-2">
                      <!-- Change Photo button -->
                      <button type="button" @click="fileInput?.click()"
                        class="px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors duration-200">
                        Change Photo
                      </button>
                      <button type="button" @click="removeImage"
                        class="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Image Upload (if no current image) -->
            <div v-else>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Add Photo
                <span class="text-gray-400 text-xs font-normal ml-1">(Optional)</span>
              </label>

              <div class="mt-1">
                <div
                  class="border-2 border-gray-300 border-dashed rounded-lg p-8 text-center hover:border-gray-400 transition-colors duration-200">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div class="mt-4">
                    <!-- Upload Photo button -->
                    <button type="button" @click="fileInput?.click()"
                      class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      Upload Photo
                    </button>
                    <p class="mt-1 text-xs text-gray-500">High-quality photos increase sales!</p>
                  </div>
                </div>
              </div>
            </div>

            <input type="file" ref="fileInput" @change="handleImageUpload" accept="image/*" class="hidden" />

            <!-- Error Message -->
            <div v-if="submitError" class="rounded-md bg-red-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">{{ submitError }}</h3>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="pt-6 border-t border-gray-200">
              <div class="flex justify-between">
                <button type="button" @click="handleDelete"
                  class="px-4 py-2 border border-red-300 text-red-700 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  :disabled="menuItemStore.loading">
                  Delete Item
                </button>
                <div class="flex space-x-3">
                  <button type="button" @click="handleCancel"
                    class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    :disabled="menuItemStore.loading">
                    Cancel
                  </button>
                  <button type="submit" :disabled="menuItemStore.loading"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span v-if="menuItemStore.loading">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                      </svg>
                      Saving...
                    </span>
                    <span v-else>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import type { MenuItem } from '@/types/menuItem'
import type { AxiosError } from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { useMenuItemStore } from '@/stores/menuItem'
import { useCategoryStore } from '@/stores/category'
// import type { User } from '@/types/auth'
import { useAuthStore } from '@/stores/auth'
import type { Category } from '@/types/category'


interface FormData {
  item_name: string
  category_id: string
  price: string
  tax_percentage: string
  discount: string
  photo: File | string | null   // allow null
  business_id: string
}


interface Errors {
  item_name: string
  category_id: string
  price: string
  tax_percentage: string
  discount: string
}

const fileInput = ref<HTMLInputElement | null>(null)
const route = useRoute()
const router = useRouter()
const menuItemStore = useMenuItemStore()
const categoryStore = useCategoryStore()
const authStore = useAuthStore()

const itemId = computed(() => Number(route.params.id))

const form = reactive<FormData>({
  item_name: '',
  category_id: '',
  price: '',
  tax_percentage: '',
  discount: '',
  photo: null,
  business_id: authStore.user?.id?.toString() || ''
})

const errors = reactive<Errors>({
  item_name: '',
  category_id: '',
  price: '',
  tax_percentage: '',
  discount: ''
})

const menuItemData = ref<MenuItem | null>(null)
const categories = ref<Category[]>([])
const imagePreview = ref<string>('')
const loading = ref(true)
const loadError = ref<string>('')
const submitError = ref<string>('')

onMounted(async () => {
  // Ensure user is authenticated
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // Load data
  await Promise.all([loadMenuItem(), loadCategories()])
  loading.value = false
})

const loadMenuItem = async (): Promise<void> => {
  try {
    // TODO: Replace with actual API call
    // For now, use mock data
    const mockData: MenuItem = {
      id: itemId.value,
      item_name: 'Classic Burger',
      category_id: 1,
      price: 12.99,
      tax_percentage: 10,
      discount: 5,
      photo: null,
      business_id: authStore.user?.id || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: undefined,
    }

    menuItemData.value = mockData

    if (menuItemData.value) {
      // Populate form with existing data
      form.item_name = menuItemData.value.item_name
      form.category_id = menuItemData.value.category_id.toString() // string for v-model
      form.price = menuItemData.value.price.toString()
      form.tax_percentage = menuItemData.value.tax_percentage.toString()
      form.discount = menuItemData.value.discount?.toString() || ''
      form.photo = menuItemData.value.photo || null
      form.business_id = menuItemData.value.business_id.toString()

      // Set image preview if exists
      imagePreview.value = menuItemData.value.photo || ''
    }
  } catch (error: unknown) {
    console.error('Failed to load menu item:', error)
    loadError.value = 'Failed to load menu item. Please try again.'
  }
}


const loadCategories = async () => {
  try {
    await categoryStore.fetchCategories()
    categories.value = categoryStore.categories
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}
const isAxiosError = (error: unknown): error is AxiosError<unknown> => {
  return (error as AxiosError)?.isAxiosError !== undefined
}

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      submitError.value = 'Image size must be less than 2MB'
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      submitError.value = 'Please select a valid image file (JPG, PNG, GIF, WebP)'
      return
    }

    form.photo = file

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
    submitError.value = ''
  }
}

const removeImage = () => {
  form.photo = null
  imagePreview.value = ''
  submitError.value = ''

  // If we had an existing photo, we need to clear it from the data
  if (menuItemData.value?.photo) {
    menuItemData.value.photo = null
  }
}

const validateField = (field: keyof FormData): void => {
  const value = form[field]

  switch (field) {
    case 'item_name':
      // Ensure value is a string before calling trim()
      if (typeof value !== 'string' || value.trim().length === 0) {
        errors.item_name = 'Item name is required'
      } else if (value.trim().length < 2) {
        errors.item_name = 'Item name must be at least 2 characters'
      } else if (value.trim().length > 100) {
        errors.item_name = 'Item name must be less than 100 characters'
      } else {
        errors.item_name = ''
      }
      break

    case 'category_id':
      // category_id is always a string, just check if empty
      if (!value || value === '') {
        errors.category_id = 'Please select a category'
      } else {
        errors.category_id = ''
      }
      break

    case 'price':
      if (!value || typeof value !== 'string') {
        errors.price = 'Price is required'
      } else {
        const num = parseFloat(value)
        if (isNaN(num) || num <= 0) {
          errors.price = 'Price must be greater than 0'
        } else if (num > 10000) {
          errors.price = 'Price must be less than $10,000'
        } else {
          errors.price = ''
        }
      }
      break

    case 'tax_percentage':
      if (!value || typeof value !== 'string') {
        errors.tax_percentage = 'Tax percentage is required'
      } else {
        const num = parseFloat(value)
        if (isNaN(num) || num < 0) {
          errors.tax_percentage = 'Tax percentage cannot be negative'
        } else if (num > 100) {
          errors.tax_percentage = 'Tax percentage cannot exceed 100%'
        } else {
          errors.tax_percentage = ''
        }
      }
      break

    case 'discount':
      if (typeof value === 'string' && value !== '') {
        const num = parseFloat(value)
        if (isNaN(num) || num < 0 || num > 100) {
          errors.discount = 'Discount must be between 0 and 100%'
        } else {
          errors.discount = ''
        }
      } else {
        errors.discount = ''
      }
      break
  }
}


const validateForm = (): boolean => {
  let isValid = true

  // Validate all required fields
  const requiredFields: (keyof Errors)[] = ['item_name', 'category_id', 'price', 'tax_percentage']
  requiredFields.forEach(field => {
    validateField(field as keyof FormData) // cast here
    if (errors[field]) {
      isValid = false
    }
  })

  return isValid
}

const calculateTax = (): number => {
  const basePrice = parseFloat(form.price) || 0
  const discount = parseFloat(form.discount) || 0
  const taxRate = parseFloat(form.tax_percentage) || 0

  const priceAfterDiscount = basePrice - (basePrice * discount / 100)
  return priceAfterDiscount * taxRate / 100
}

const calculateFinalPrice = (): number => {
  const basePrice = parseFloat(form.price) || 0
  const discount = parseFloat(form.discount) || 0
  const taxRate = parseFloat(form.tax_percentage) || 0

  const priceAfterDiscount = basePrice - (basePrice * discount / 100)
  const taxAmount = priceAfterDiscount * taxRate / 100
  return priceAfterDiscount + taxAmount
}

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) {
    submitError.value = 'Please fix the errors in the form'
    return
  }

  submitError.value = ''

  try {
    // Prepare form data
    const formData = new FormData()
    formData.append('item_name', form.item_name.trim())
    formData.append('category_id', form.category_id.toString())
    formData.append('price', form.price.toString())
    formData.append('tax_percentage', form.tax_percentage.toString())
    formData.append('_method', 'PUT')

    if (form.discount || form.discount === '') {
      formData.append('discount', form.discount.toString())
    }

    if (form.photo instanceof File) {
      formData.append('photo', form.photo)
    } else if (form.photo === null) {
      formData.append('remove_photo', 'true')
    }

    if (authStore.user?.id) {
      formData.append('business_id', authStore.user.id.toString())
    }

    await menuItemStore.updateMenuItem(itemId.value, formData)

    alert('Menu item updated successfully!')
    router.push('/menu-items')

  } catch (error: unknown) {
    console.error('Failed to update menu item:', error)

    if (isAxiosError(error)) {
      // Define the expected shape of the API error response
      interface ApiErrorResponse {
        message?: string
        errors?: Record<string, string[] | string>
      }

      const data = error.response?.data as ApiErrorResponse | undefined

      if (data?.errors) {
        const apiErrors = data.errors
        Object.keys(apiErrors).forEach(field => {
          if (field in errors) {
            errors[field as keyof Errors] = Array.isArray(apiErrors[field])
              ? apiErrors[field][0] ?? ''
              : (apiErrors[field] as string) ?? ''

          }
        })
        submitError.value = 'Please fix the errors above'
      } else {
        submitError.value = data?.message || 'Failed to update menu item. Please try again.'
      }
    } else {
      submitError.value = 'An unexpected error occurred. Please try again.'
    }
  }

}


const handleDelete = async (): Promise<void> => {
  if (!confirm('Are you sure you want to delete this menu item? This action cannot be undone.')) {
    return
  }

  try {
    await menuItemStore.deleteMenuItem(itemId.value)
    alert('Menu item deleted successfully!')
    router.push('/menu-items')
  } catch (error: unknown) {
    console.error('Failed to delete menu item:', error)

    if (isAxiosError(error)) {
      interface ApiErrorResponse {
        message?: string
        errors?: Record<string, string[] | string>
      }

      const data = error.response?.data as ApiErrorResponse | undefined
      submitError.value = data?.message || 'Failed to delete menu item. Please try again.'
    } else {
      submitError.value = 'An unexpected error occurred. Please try again.'
    }

  }
}


const handleCancel = (): void => {
  router.push('/menu-items')
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
