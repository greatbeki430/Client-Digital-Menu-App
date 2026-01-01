<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
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
            <router-link to="/dashboard/categories" class="text-gray-400 hover:text-gray-600">
              Categories
            </router-link>
          </li>
          <li>
            <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd" />
            </svg>
          </li>
          <li class="text-gray-900 font-medium">Create Category</li>
        </ol>
      </nav>

      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Create Category</h1>
            <p class="text-gray-600 mt-2">Create a new menu category</p>
          </div>
        </div>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-6 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg mr-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Category Details</h2>
              <p class="text-sm text-gray-500">Fill in all required information to add a new category</p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="p-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Category Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                Category Name *
              </label>
              <input id="name" v-model="form.name" type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                :class="{ 'border-red-300': errors.name }" placeholder="e.g., Appetizers, Main Course, Desserts"
                required @blur="validateField('name')" />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                Description
                <span class="text-gray-400 text-xs font-normal ml-1">(Optional)</span>
              </label>
              <textarea id="description" v-model="form.description" rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                :class="{ 'border-red-300': errors.description }" placeholder="Describe this category..."
                @blur="validateField('description')"></textarea>
              <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
            </div>

            <!-- Category Image Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Category Image
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
                    <button type="button" @click="fileInputRef?.click()"
                      class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      Upload Image
                    </button>
                    <p class="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                  </div>
                </div>

                <div v-else class="relative">
                  <div class="bg-gray-100 rounded-lg p-4">
                    <div class="flex items-center space-x-4">
                      <div class="flex-shrink-0">
                        <img :src="imagePreview" alt="Preview" class="h-24 w-24 object-cover rounded-lg">
                      </div>
                      <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900">Image Preview</p>
                        <p class="text-xs text-gray-500">A good image represents your category</p>
                      </div>
                      <div class="flex space-x-2">
                        <button type="button" @click="fileInputRef?.click()"
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

                <input type="file" ref="fileInputRef" @change="handleImageUpload" accept="image/*" class="hidden" />
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
                  :disabled="categoryStore.loading">
                  Cancel
                </button>
                <button type="submit" :disabled="categoryStore.loading"
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span v-if="categoryStore.loading">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>
                    Creating...
                  </span>
                  <span v-else>Create Category</span>
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
const fileInputRef = ref<HTMLInputElement | null>(null)
import { useRouter } from 'vue-router'
import { useCategoryStore } from '@/stores/category'
import { useAuthStore } from '@/stores/auth'

// Define interfaces
interface FormData {
  name: string
  description: string
  photo: File | null
  business_id: string
}

interface Errors {
  name: string
  description: string
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
const categoryStore = useCategoryStore()
const authStore = useAuthStore()

// Form data with all fields
const form = reactive<FormData>({
  name: '',
  description: '',
  photo: null,
  business_id: authStore.user?.id?.toString() || ''
})

// Errors for all form fields
const errors = reactive<Errors>({
  name: '',
  description: '',
  photo: '',
  business_id: ''
})

const imagePreview = ref<string>('')
const submitError = ref<string>('')

onMounted(() => {
  // Ensure user is authenticated
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
})

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
    case 'name':
      if (!value || (typeof value === 'string' && value.trim().length === 0)) {
        errors.name = 'Category name is required'
      } else if (typeof value === 'string' && value.trim().length < 2) {
        errors.name = 'Category name must be at least 2 characters'
      } else if (typeof value === 'string' && value.trim().length > 100) {
        errors.name = 'Category name must be less than 100 characters'
      } else {
        errors.name = ''
      }
      break

    case 'description':
      if (value && typeof value === 'string' && value.trim().length > 500) {
        errors.description = 'Description must be less than 500 characters'
      } else {
        errors.description = ''
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
  const requiredFields: (keyof Errors)[] = ['name', 'business_id']
  requiredFields.forEach(field => {
    validateField(field)
    if (errors[field]) {
      isValid = false
    }
  })

  return isValid
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
    formData.append('name', form.name.trim())

    if (form.description) {
      formData.append('description', form.description.trim())
    }

    if (form.photo) {
      formData.append('photo', form.photo)
    }

    if (authStore.user?.id) {
      formData.append('business_id', authStore.user.id.toString())
    }

    // Call the store action
    await categoryStore.createCategory(formData)

    // Show success message
    alert('Category created successfully!')

    // Redirect to categories list - Fixed with /dashboard prefix
    router.push('/dashboard/categories')

  } catch (error: unknown) {
    console.error('Failed to create category:', error)

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
        submitError.value = 'Failed to create category. Please try again.'
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
  if (form.name || form.description) {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.push('/dashboard/categories')
    }
  } else {
    router.push('/dashboard/categories')
  }
}
</script>
