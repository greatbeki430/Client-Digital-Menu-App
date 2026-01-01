<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Name -->
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
        Category Name *
      </label>
      <input id="name" v-model="formData.name" type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        :class="{ 'border-red-500': errors.name }" placeholder="e.g., Appetizers, Main Course" required />
      <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
    </div>

    <!-- Description -->
    <div>
      <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
        Description
      </label>
      <textarea id="description" v-model="formData.description" rows="3"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        placeholder="Optional description for this category"></textarea>
    </div>

    <!-- Image Upload -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Category Image
      </label>
      <div class="mt-1 flex items-center">
        <div v-if="!formData.image && !imagePreview"
          class="flex items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg">
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="mt-1 text-xs text-gray-500">Optional</p>
          </div>
        </div>

        <div v-else class="relative w-32 h-32">
          <img :src="imagePreview || (typeof formData.image === 'string' ? formData.image : '')" alt="Category preview"
            class="w-full h-full object-cover rounded-lg" />

          <button type="button" @click="removeImage"
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="ml-4">
          <input type="file" ref="fileInput" @change="handleImageUpload" accept="image/*" class="hidden" />

          <button type="button" @click="fileInput?.click()"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            Upload Image
          </button>

          <p class="mt-1 text-xs text-gray-500">
            JPG, PNG — up to 2MB
          </p>
        </div>
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

    <!-- Submit Button -->
    <div class="flex justify-end space-x-3 pt-4">
      <button type="button" @click="$emit('cancel')"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        :disabled="loading">
        Cancel
      </button>
      <button type="submit" :disabled="loading"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
        <span v-if="loading">Processing...</span>
        <span v-else>{{ submitText }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import type { CategoryFormData } from '@/types/category'


const fileInput = ref<HTMLInputElement | null>(null)

interface Props {
  initialData?: CategoryFormData
  loading?: boolean
  error?: string
}

interface Emits {
  (e: 'submit', data: CategoryFormData): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), { loading: false })
const emit = defineEmits<Emits>()

// Form state
const formData = reactive<CategoryFormData>({
  name: props.initialData?.name || '',
  description: props.initialData?.description || '',
  image: props.initialData?.image || undefined
})

const errors = reactive<{ name?: string }>({})

const imagePreview = ref<string>('')
const submitError = ref('')

watch(() => props.error, (newError) => {
  submitError.value = newError || ''
})

const submitText = computed(() => {
  return props.initialData ? 'Update Category' : 'Create Category'
})

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    if (file.size > 2 * 1024 * 1024) submitError.value = 'Image size must be < 2MB'
    else if (!file.type.match('image.*')) submitError.value = 'Please select an image file'
    else {
      formData.image = file
      const reader = new FileReader()
      reader.onload = (e) => (imagePreview.value = e.target?.result as string)
      reader.readAsDataURL(file)
      submitError.value = ''
    }
  }
}


const removeImage = () => {
  formData.image = undefined
  imagePreview.value = ''
}


const validateForm = (): boolean => {
  let isValid = true

  // Reset errors
  errors.name = ''

  // Validate name
  if (!formData.name.trim()) {
    errors.name = 'Category name is required'
    isValid = false
  } else if (formData.name.length < 2) {
    errors.name = 'Category name must be at least 2 characters'
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    submitError.value = ''
    emit('submit', formData)
  }
}


// Initialize image preview if editing
if (props.initialData?.image && typeof props.initialData.image === 'string') {
  imagePreview.value = props.initialData.image
}
</script>
