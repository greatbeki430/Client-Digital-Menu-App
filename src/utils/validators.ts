import * as yup from 'yup'

// Registration validation schema
export const registrationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),

  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format')
    .max(100, 'Email must not exceed 100 characters'),

  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number'),

  business_name: yup
    .string()
    .required('Business name is required')
    .min(2, 'Business name must be at least 2 characters')
    .max(200, 'Business name must not exceed 200 characters'),

  tin: yup
    .string()
    .required('TIN is required')
    .min(5, 'TIN must be at least 5 characters')
    .max(50, 'TIN must not exceed 50 characters'),

  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must not exceed 50 characters'),

  password_confirmation: yup
    .string()
    .required('Password confirmation is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
})

// Login validation schema
export const loginSchema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email format'),

  password: yup.string().required('Password is required'),
})

// Category validation schema
export const categorySchema = yup.object({
  name: yup
    .string()
    .required('Category name is required')
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name must not exceed 100 characters'),

  description: yup.string().max(500, 'Description must not exceed 500 characters'),

  image: yup
    .mixed()
    .test('fileSize', 'File size is too large', (value) => {
      if (!value || !(value instanceof File)) return true
      return value.size <= 5 * 1024 * 1024 // 5MB
    })
    .test('fileType', 'Unsupported file format', (value) => {
      if (!value || !(value instanceof File)) return true
      return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(value.type)
    }),
})

// Menu item validation schema
export const menuItemSchema = yup.object({
  item_name: yup
    .string()
    .required('Item name is required')
    .min(2, 'Item name must be at least 2 characters')
    .max(100, 'Item name must not exceed 100 characters'),

  category_id: yup.number().required('Category is required').positive('Please select a category'),

  price: yup
    .number()
    .required('Price is required')
    .positive('Price must be positive')
    .max(10000, 'Price must not exceed $10,000'),

  tax_percentage: yup
    .number()
    .required('Tax percentage is required')
    .min(0, 'Tax percentage cannot be negative')
    .max(100, 'Tax percentage cannot exceed 100%'),

  discount: yup
    .number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%'),

  photo: yup
    .mixed()
    .test('fileSize', 'File size is too large', (value) => {
      if (!value || !(value instanceof File)) return true
      return value.size <= 5 * 1024 * 1024 // 5MB
    })
    .test('fileType', 'Unsupported file format', (value) => {
      if (!value || !(value instanceof File)) return true
      return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(value.type)
    }),
})
