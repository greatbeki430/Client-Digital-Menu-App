<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Item Name -->
    <div>
      <label for="item_name" class="block text-sm font-medium text-gray-700 mb-1">
        Item Name *
      </label>
      <input id="item_name" v-model="formData.item_name" type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        :class="{ 'border-red-500': errors.item_name }" placeholder="e.g., Classic Burger, Caesar Salad" required />
      <p v-if="errors.item_name" class="mt-1 text-sm text-red-600">{{ errors.item_name }}</p>
    </div>

    <!-- Category -->
    <div>
      <label for="category_id" class="block text-sm font-medium text-gray-700 mb-1">
        Category *
      </label>
      <select id="category_id" v-model="formData.category_id"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        :class="{ 'border-red-500': errors.category_id }" required>
        <option value="">Select a category</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
      <p v-if="errors.category_id" class="mt-1 text-sm text-red-600">{{ errors.category_id }}</p>
    </div>

    <!-- Price & Tax -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Price -->
      <div>
        <label for="price" class="block text-sm font-medium text-gray-700 mb-1">
          Price ($) *
        </label>
        <div class="relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="text-gray-500">$</span>
          </div>
          <input id="price" v-model="formData.price" type="number" step="0.01" min="0"
            class="pl-7 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            :class="{ 'border-red-500': errors.price }" placeholder="0.00" required />
        </div>
        <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price }}</p>
      </div>

      <!-- Tax Percentage -->
      <div>
        <label for="tax_percentage" class="block text-sm font-medium text-gray-700 mb-1">
          Tax Percentage (%) *
        </label>
        <div class="relative rounded-md shadow-sm">
          <input id="tax_percentage" v-model="formData.tax_percentage" type="number" step="0.1" min="0" max="100"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            :class="{ 'border-red-500': errors.tax_percentage }" placeholder="10" required />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span class="text-gray-500">%</span>
          </div>
        </div>
        <p v-if="errors.tax_percentage" class="mt-1 text-sm text-red-600">{{ errors.tax_percentage }}</p>
      </div>
    </div>

    <!-- Discount -->
    <div>
      <label for="discount" class="block text-sm font-medium text-gray-700 mb-1">
        Discount (%)
        <span class="text-gray-400 text-xs font-normal ml-1">(Optional)</span>
      </label>
      <div class="relative rounded-md shadow-sm">
        <input id="discount" v-model="formData.discount" type="number" step="0.1" min="0" max="100"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          :class="{ 'border-red-500': errors.discount }" placeholder="0" />
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span class="text-gray-500">%</span>
        </div>
      </div>
      <p v-if="errors.discount" class="mt-1 text-sm text-red-600">{{ errors.discount }}</p>
    </div>

    <!-- Image Upload -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Item Photo
        <span class="text-gray-400 text-xs font-normal ml-1">(Optional)</span>
      </label>
      <div class="mt-1">
        <!-- Similar image upload component as in CategoryForm -->
        <!-- Implementation matches your existing pattern -->
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
import { reactive, computed, watch } from 'vue'
// ref,
import type { MenuItemFormData } from '@/types/menuItem'
import type { Category } from '@/types/category'

interface Props {
  initialData?: MenuItemFormData
  categories: Category[]
  loading?: boolean
  error?: string
}

interface Emits {
  (e: 'submit', data: MenuItemFormData): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  categories: () => []
})

const emit = defineEmits<Emits>()

const formData = reactive<MenuItemFormData>({
  item_name: props.initialData?.item_name || '',
  category_id: props.initialData?.category_id || '',
  price: props.initialData?.price || '',
  tax_percentage: props.initialData?.tax_percentage || '10',
  discount: props.initialData?.discount || '',
  photo: props.initialData?.photo || undefined
})

const errors = reactive({
  item_name: '',
  category_id: '',
  price: '',
  tax_percentage: '',
  discount: ''
})

const submitText = computed(() => {
  return props.initialData ? 'Update Item' : 'Create Item'
})

const validateForm = (): boolean => {
  let isValid = true

  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  // Validate item_name
  if (!formData.item_name.trim()) {
    errors.item_name = 'Item name is required'
    isValid = false
  }

  // Validate category_id
  if (!formData.category_id) {
    errors.category_id = 'Category is required'
    isValid = false
  }

  // Validate price
  if (!formData.price) {
    errors.price = 'Price is required'
    isValid = false
  } else if (parseFloat(formData.price as string) <= 0) {
    errors.price = 'Price must be greater than 0'
    isValid = false
  }

  // Validate tax_percentage
  if (!formData.tax_percentage) {
    errors.tax_percentage = 'Tax percentage is required'
    isValid = false
  } else if (parseFloat(formData.tax_percentage as string) < 0 || parseFloat(formData.tax_percentage as string) > 100) {
    errors.tax_percentage = 'Tax percentage must be between 0 and 100'
    isValid = false
  }

  // Validate discount
  if (formData.discount) {
    const discount = parseFloat(formData.discount as string)
    if (discount < 0 || discount > 100) {
      errors.discount = 'Discount must be between 0 and 100'
      isValid = false
    }
  }

  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', formData)
  }
}

watch(() => props.error, (newError) => {
  if (newError) {
    // Handle error display
  }
})
</script>
