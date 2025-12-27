<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <!-- Breadcrumb - Fixed with /dashboard prefix -->
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
            <router-link to="/dashboard/menu-items" class="text-gray-400 hover:text-gray-600">
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
          <li class="text-gray-900 font-medium">Create Menu Item</li>
        </ol>
      </nav>

      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Add Menu Item</h1>
            <p class="text-gray-600 mt-2">Create a new item for your digital menu</p>
          </div>
        </div>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-6 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg mr-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Menu Item Details</h2>
              <p class="text-sm text-gray-500">Fill in all required information to add a new menu item</p>
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

            <!-- Image Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Item Photo
                <span class="text-gray-400 text-xs font-normal ml-1">(Optional)</span>
              </label>

              <div class="mt-1">
                <div v-if="!imagePreview"
                  class="border-2 border-gray-300 border-dashed rounded-lg p-8 text-center hover:border-gray-400 transition-colors duration-200">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div class="mt-4">
                    <button type="button" @click="triggerFileInput"
                      class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      Upload Photo
                    </button>
                    <p class="mt-1 text-xs text-gray-500">High-quality photos increase sales!</p>
                  </div>
                </div>

                <div v-else class="relative">
                  <div class="bg-gray-100 rounded-lg p-4">
                    <div class="flex items-center space-x-4">
                      <div class="flex-shrink-0">
                        <img :src="imagePreview" alt="Preview" class="h-24 w-24 object-cover rounded-lg">
                      </div>
                      <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900">Photo Preview</p>
                        <p class="text-xs text-gray-500">A good image makes your item more appealing</p>
                      </div>
                      <div class="flex space-x-2">
                        <button type="button" @click="triggerFileInput"
                          class="px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors duration-200">
                          Change
                        </button>
                        <button type="button" @click="removeImage"
                          class="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <input type="file" ref="fileInput" @change="handleImageUpload" accept="image/*" class="hidden" />
              </div>
            </div>

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
              <div class="flex justify-end space-x-3">
                <button type="button" @click="handleCancel"
                  class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  :disabled="menuItemStore.loading">
                  Cancel
                </button>
                <button type="submit" :disabled="menuItemStore.loading"
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span v-if="menuItemStore.loading">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>
                    Creating...
                  </span>
                  <span v-else>Create Menu Item</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import type { Category } from '@/types/category'
import { useRouter } from 'vue-router'
import { useMenuItemStore } from '@/stores/menuItem'
import { useCategoryStore } from '@/stores/category'
import { useAuthStore } from '@/stores/auth'

// Define interfaces
interface FormData {
  item_name: string
  category_id: string
  price: string
  tax_percentage: string
  discount: string
  photo: File | null
  business_id: string
}

interface Errors {
  item_name: string
  category_id: string
  price: string
  tax_percentage: string
  discount: string
  photo: string
  business_id: string
}

interface ApiError {
  response?: {
    data?: {
      message?: string
      errors?: Record<string, string | string[]>
    }
  }
}

const router = useRouter()
const fileInput = ref<HTMLInputElement | null>(null)
const menuItemStore = useMenuItemStore()
const categoryStore = useCategoryStore()
const authStore = useAuthStore()

// Form data with all fields
const form = reactive<FormData>({
  item_name: '',
  category_id: '',
  price: '',
  tax_percentage: '10', // Default tax
  discount: '',
  photo: null,
  business_id: authStore.user?.id?.toString() || ''
})

// Errors for all form fields
const errors = reactive<Errors>({
  item_name: '',
  category_id: '',
  price: '',
  tax_percentage: '',
  discount: '',
  photo: '',
  business_id: ''
})

const categories = ref<Category[]>([])
const imagePreview = ref<string>('')
const submitError = ref<string>('')
const loading = ref(false)

onMounted(async () => {
  // Ensure user is authenticated
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // Load categories for dropdown
  await loadCategories()
})

const loadCategories = async () => {
  try {
    loading.value = true
    await categoryStore.fetchCategories()
    categories.value = categoryStore.categories
  } catch (error: unknown) {
    console.error('Failed to load categories:', error)
    submitError.value = 'Failed to load categories. Please try again.'
  } finally {
    loading.value = false
  }
}

const triggerFileInput = (): void => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      errors.photo = 'Image size must be less than 2MB'
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      errors.photo = 'Please select a valid image file (JPG, PNG, GIF, WebP)'
      return
    }

    form.photo = file
    errors.photo = ''

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
  errors.photo = ''
  submitError.value = ''
}

// Helper function to safely extract error message
const extractErrorMessage = (value: string | string[] | undefined): string => {
  if (value === undefined) return ''
  if (Array.isArray(value)) return value[0] || ''
  return value
}

const validateField = (field: keyof Errors): void => {
  const value = form[field as keyof FormData]

  switch (field) {
    case 'item_name':
      if (!value || (typeof value === 'string' && value.trim().length === 0)) {
        errors.item_name = 'Item name is required'
      } else if (typeof value === 'string' && value.trim().length < 2) {
        errors.item_name = 'Item name must be at least 2 characters'
      } else if (typeof value === 'string' && value.trim().length > 100) {
        errors.item_name = 'Item name must be less than 100 characters'
      } else {
        errors.item_name = ''
      }
      break

    case 'category_id':
      if (!value) {
        errors.category_id = 'Please select a category'
      } else {
        errors.category_id = ''
      }
      break

    case 'price':
      if (!value) {
        errors.price = 'Price is required'
      } else if (parseFloat(value as string) <= 0) {
        errors.price = 'Price must be greater than 0'
      } else if (parseFloat(value as string) > 10000) {
        errors.price = 'Price must be less than $10,000'
      } else {
        errors.price = ''
      }
      break

    case 'tax_percentage':
      if (!value) {
        errors.tax_percentage = 'Tax percentage is required'
      } else if (parseFloat(value as string) < 0) {
        errors.tax_percentage = 'Tax percentage cannot be negative'
      } else if (parseFloat(value as string) > 100) {
        errors.tax_percentage = 'Tax percentage cannot exceed 100%'
      } else {
        errors.tax_percentage = ''
      }
      break

    case 'discount':
      if (value && (parseFloat(value as string) < 0 || parseFloat(value as string) > 100)) {
        errors.discount = 'Discount must be between 0 and 100%'
      } else {
        errors.discount = ''
      }
      break

    case 'photo':
      // Photo validation is handled in handleImageUpload
      break

    case 'business_id':
      if (!value) {
        errors.business_id = 'Business ID is required'
      } else {
        errors.business_id = ''
      }
      break
  }
}

const validateForm = (): boolean => {
  let isValid = true

  // Validate all required fields
  const requiredFields: (keyof Errors)[] = ['item_name', 'category_id', 'price', 'tax_percentage', 'business_id']
  requiredFields.forEach(field => {
    validateField(field)
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
    formData.append('category_id', form.category_id)
    formData.append('price', form.price)
    formData.append('tax_percentage', form.tax_percentage)

    if (form.discount) {
      formData.append('discount', form.discount)
    }

    if (form.photo) {
      formData.append('photo', form.photo)
    }

    // Add business_id from auth store
    if (authStore.user?.id) {
      formData.append('business_id', authStore.user.id.toString())
    }

    // Call the store action
    await menuItemStore.createMenuItem(formData)

    // Show success message
    alert('Menu item created successfully!')

    // Redirect to menu items list - Fixed with /dashboard prefix
    router.push('/dashboard/menu-items')

  } catch (error: unknown) {
    console.error('Failed to create menu item:', error)

    // Type-safe error handling
    if (isApiError(error)) {
      const responseData = error.response?.data

      if (responseData?.errors) {
        // Clear previous errors
        Object.keys(errors).forEach(key => {
          errors[key as keyof Errors] = ''
        })

        // Set new errors from API
        Object.entries(responseData.errors).forEach(([field, value]) => {
          if (field in errors) {
            errors[field as keyof Errors] = extractErrorMessage(value)
          }
        })
        submitError.value = responseData.message || 'Please fix the errors above'
      } else if (responseData?.message) {
        submitError.value = responseData.message
      } else {
        submitError.value = 'Failed to create menu item. Please try again.'
      }
    } else if (error instanceof Error) {
      submitError.value = error.message
    } else {
      submitError.value = 'An unexpected error occurred.'
    }
  }
}

// Type guard for API errors
function isApiError(error: unknown): error is ApiError {
  return error !== null &&
    typeof error === 'object' &&
    'response' in error
}

const handleCancel = (): void => {
  if (form.item_name || form.price) {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      // Fixed: Redirect to /dashboard/menu-items
      router.push('/dashboard/menu-items')
    }
  } else {
    // Fixed: Redirect to /dashboard/menu-items
    router.push('/dashboard/menu-items')
  }
}
</script>
