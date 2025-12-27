// API Constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
  },
  CATEGORIES: {
    BASE: '/menu-managers',
    SINGLE: (id: number) => `/menu-managers/${id}`,
  },
  MENU_ITEMS: {
    BASE: '/menu-items',
    SINGLE: (id: number) => `/menu-items/${id}`,
  },
}

// App Constants
export const APP_CONSTANTS = {
  APP_NAME: 'Client Digital Menu',
  VERSION: '1.0.0',
  ITEMS_PER_PAGE: 10,
  MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
}

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  PHONE: 'Please enter a valid phone number',
  PASSWORD_MIN: 'Password must be at least 6 characters',
  TIN_REQUIRED: 'TIN (Tax Identification Number) is required',
  BUSINESS_NAME_REQUIRED: 'Business name is required',
  NAME_MIN: 'Name must be at least 2 characters',
  PRICE_POSITIVE: 'Price must be a positive number',
  TAX_RANGE: 'Tax percentage must be between 0 and 100',
  DISCOUNT_RANGE: 'Discount must be between 0 and 100',
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user',
  FAVORITES: 'favorites',
  CART: 'cart',
}

// Route Names
export const ROUTE_NAMES = {
  HOME: 'home',
  LOGIN: 'login',
  REGISTER: 'register',
  DASHBOARD: 'dashboard',
  CATEGORIES: 'categories',
  CATEGORY_CREATE: 'category-create',
  CATEGORY_EDIT: 'category-edit',
  MENU_ITEMS: 'menu-items',
  MENU_ITEM_CREATE: 'menu-item-create',
  MENU_ITEM_EDIT: 'menu-item-edit',
}

// Tax Rates (if needed for calculations)
export const DEFAULT_TAX_RATE = 10 // 10%

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check the form for errors.',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  REGISTER: 'Registration successful!',
  LOGOUT: 'Logged out successfully.',
  CATEGORY_CREATED: 'Category created successfully.',
  CATEGORY_UPDATED: 'Category updated successfully.',
  CATEGORY_DELETED: 'Category deleted successfully.',
  MENU_ITEM_CREATED: 'Menu item created successfully.',
  MENU_ITEM_UPDATED: 'Menu item updated successfully.',
  MENU_ITEM_DELETED: 'Menu item deleted successfully.',
}
