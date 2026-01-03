/* eslint-disable @typescript-eslint/no-unused-vars */
import type { MenuItem, MenuItemsResponse, MenuItemFormData } from '@/types/menuItem'
import type { ApiResponse } from '@/types/auth'
import type { Category } from '@/types/category'
// import type { PaginationLink } from '@/types/menuItem'

// Interface definitions for external APIs
interface MealDBMeal {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strCategory: string
  strInstructions?: string
  strArea?: string
  strTags?: string
}

interface MealDBCategory {
  idCategory: string
  strCategory: string
  strCategoryThumb?: string
  strCategoryDescription?: string
}

interface SpoonacularRecipe {
  id: number
  title: string
  image: string
  readyInMinutes?: number
  servings?: number
  summary?: string
  diets?: string[]
  dishTypes?: string[]
  extendedIngredients?: Array<{
    name: string
    amount: number
    unit: string
  }>
}

interface SpoonacularRecipeInfo {
  id: number
  title: string
  image: string
  readyInMinutes: number
  servings: number
  summary: string
  instructions: string
  extendedIngredients: Array<{
    name: string
    amount: number
    unit: string
  }>
  diets: string[]
  dishTypes: string[]
  pricePerServing: number
}

// Constants for demo mode
const DEMO_CONSTANTS = {
  BUSINESS_ID: 1,
  DEFAULT_TAX: 10,
  DEFAULT_CATEGORY: {
    id: 1,
    name: 'Recipe',
    business_id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Category,
  MIN_PRICE: 5.99,
  MAX_PRICE: 24.99,
} as const

class TheMealDBMenuItemService {
  // API endpoints
  private readonly mealDBBaseURL = 'https://www.themealdb.com/api/json/v1/1'
  private readonly spoonacularBaseURL = 'https://api.spoonacular.com'

  // Configuration
  private readonly spoonacularKey: string
  private readonly isSpoonacularAvailable: boolean

  // Cache configuration
  private cache = {
    meals: null as MealDBMeal[] | null,
    categories: null as Record<string, Category> | null,
    spoonacularRecipes: null as SpoonacularRecipe[] | null,
    timestamp: 0,
  }

  private readonly CACHE_TTL = 10 * 60 * 1000 // 10 minutes
  private readonly REQUEST_TIMEOUT = 15000 // 15 seconds
  private readonly MAX_RETRIES = 2

  // Rate limiting
  private requestQueue: Array<() => Promise<unknown>> = []
  private isProcessingQueue = false
  private readonly MAX_CONCURRENT_REQUESTS = 3
  private activeRequests = 0

  constructor() {
    this.spoonacularKey = import.meta.env.VITE_SPOONACULAR_API_KEY?.trim() || ''
    this.isSpoonacularAvailable = !!this.spoonacularKey

    if (!this.isSpoonacularAvailable) {
      console.warn('⚠️ Spoonacular API key not configured. Using TheMealDB only.')
    }
  }

  /**
   * Queue management for rate limiting
   */
  private async addToQueue<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await request()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })

      this.processQueue()
    })
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return
    }

    this.isProcessingQueue = true

    while (this.requestQueue.length > 0 && this.activeRequests < this.MAX_CONCURRENT_REQUESTS) {
      const request = this.requestQueue.shift()
      if (request) {
        this.activeRequests++
        request().finally(() => {
          this.activeRequests--
          if (this.requestQueue.length > 0) {
            this.processQueue()
          } else {
            this.isProcessingQueue = false
          }
        })
      }
    }

    if (this.requestQueue.length === 0) {
      this.isProcessingQueue = false
    }
  }

  /**
   * Cache management
   */
  private isCacheValid(): boolean {
    return Date.now() - this.cache.timestamp < this.CACHE_TTL
  }

  private updateCacheTimestamp(): void {
    this.cache.timestamp = Date.now()
  }

  private clearCache(): void {
    this.cache = {
      meals: null,
      categories: null,
      spoonacularRecipes: null,
      timestamp: 0,
    }
  }

  /**
   * Utility methods
   */
  private generatePrice(): number {
    const price =
      Math.random() * (DEMO_CONSTANTS.MAX_PRICE - DEMO_CONSTANTS.MIN_PRICE) +
      DEMO_CONSTANTS.MIN_PRICE
    return parseFloat(price.toFixed(2))
  }

  private generateDiscount(): number | undefined {
    return Math.random() < 0.2 ? Math.floor(Math.random() * 30) + 5 : undefined
  }

  /**
   * Fetch methods with retry logic
   */
  private async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    retries = this.MAX_RETRIES,
  ): Promise<Response> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT)

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.status === 429) {
          // Rate limited - wait and retry
          const waitTime = Math.pow(2, attempt) * 1000
          await new Promise((resolve) => setTimeout(resolve, waitTime))
          continue
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return response
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        if (attempt < retries) {
          const waitTime = Math.pow(2, attempt) * 500
          await new Promise((resolve) => setTimeout(resolve, waitTime))
        }
      }
    }

    throw lastError || new Error('Request failed after retries')
  }

  /**
   * TheMealDB API methods
   */
  private async fetchAllMealsFromMealDB(): Promise<MealDBMeal[]> {
    if (this.cache.meals && this.isCacheValid()) {
      return this.cache.meals
    }

    const allMeals: MealDBMeal[] = []
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')

    // Process letters in small batches
    const batchSize = 3
    for (let i = 0; i < letters.length; i += batchSize) {
      const batch = letters.slice(i, i + batchSize)

      const promises = batch.map(async (char) => {
        return this.addToQueue(async () => {
          try {
            const response = await this.fetchWithRetry(`${this.mealDBBaseURL}/search.php?f=${char}`)
            const data = await response.json()
            return data.meals || []
          } catch (error) {
            console.warn(`Failed to fetch meals for letter ${char}:`, error)
            return []
          }
        })
      })

      const results = await Promise.all(promises)
      results.forEach((meals) => {
        if (meals && Array.isArray(meals)) {
          allMeals.push(...meals)
        }
      })

      // Small delay between batches to be polite to the API
      if (i + batchSize < letters.length) {
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
    }

    // Remove duplicates
    const uniqueMeals = allMeals.filter(
      (meal, index, self) => index === self.findIndex((m) => m.idMeal === meal.idMeal),
    )

    this.cache.meals = uniqueMeals
    this.updateCacheTimestamp()

    return uniqueMeals
  }

  private async fetchMealCategories(): Promise<Record<string, Category>> {
    if (this.cache.categories && this.isCacheValid()) {
      return this.cache.categories
    }

    return this.addToQueue(async () => {
      try {
        const response = await this.fetchWithRetry(`${this.mealDBBaseURL}/categories.php`)
        const data = await response.json()

        const categories: Record<string, Category> = {}
        if (data.categories && Array.isArray(data.categories)) {
          data.categories.forEach((cat: MealDBCategory, index: number) => {
            categories[cat.strCategory] = {
              id: parseInt(cat.idCategory) || index + 1,
              name: cat.strCategory,
              description: cat.strCategoryDescription,
              business_id: DEMO_CONSTANTS.BUSINESS_ID,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          })
        }

        // Add default category
        categories['Recipe'] = DEMO_CONSTANTS.DEFAULT_CATEGORY

        this.cache.categories = categories
        this.updateCacheTimestamp()

        return categories
      } catch (error) {
        console.error('Failed to fetch categories from TheMealDB:', error)
        return { Recipe: DEMO_CONSTANTS.DEFAULT_CATEGORY }
      }
    })
  }

  private async fetchMealById(id: number): Promise<MealDBMeal | null> {
    return this.addToQueue(async () => {
      try {
        const response = await this.fetchWithRetry(`${this.mealDBBaseURL}/lookup.php?i=${id}`)
        const data = await response.json()

        if (data.meals && data.meals.length > 0) {
          return data.meals[0]
        }

        return null
      } catch (error) {
        console.error(`Failed to fetch meal ${id} from TheMealDB:`, error)
        return null
      }
    })
  }

  /**
   * Spoonacular API methods
   */
  private async fetchRecipesFromSpoonacular(
    query: string = '',
    number: number = 30,
  ): Promise<SpoonacularRecipe[]> {
    if (!this.isSpoonacularAvailable) {
      return []
    }

    if (this.cache.spoonacularRecipes && this.isCacheValid() && !query) {
      return this.cache.spoonacularRecipes
    }

    return this.addToQueue(async () => {
      try {
        const url = new URL(`${this.spoonacularBaseURL}/recipes/complexSearch`)
        url.searchParams.append('apiKey', this.spoonacularKey)
        url.searchParams.append('addRecipeInformation', 'true')
        url.searchParams.append('fillIngredients', 'true')
        url.searchParams.append('number', Math.min(number, 50).toString()) // Limit to 50
        url.searchParams.append('instructionsRequired', 'true')

        if (query) {
          url.searchParams.append('query', query)
        }

        const response = await this.fetchWithRetry(url.toString())
        const data = await response.json()

        if (data.status === 'failure') {
          throw new Error(data.message || 'Spoonacular API error')
        }

        const recipes = data.results || []

        if (!query) {
          this.cache.spoonacularRecipes = recipes
          this.updateCacheTimestamp()
        }

        return recipes
      } catch (error) {
        console.error('Failed to fetch from Spoonacular:', error)

        // If it's an API key error, this disable Spoonacular for this session
        if (error instanceof Error && error.message.includes('Invalid API key')) {
          console.error('Invalid Spoonacular API key. Disabling Spoonacular integration.')
        }

        return []
      }
    })
  }

  private async fetchRecipeInfoFromSpoonacular(id: number): Promise<SpoonacularRecipeInfo | null> {
    if (!this.isSpoonacularAvailable) {
      return null
    }

    return this.addToQueue(async () => {
      try {
        const url = `${this.spoonacularBaseURL}/recipes/${id}/information?apiKey=${this.spoonacularKey}`
        const response = await this.fetchWithRetry(url)
        const data = await response.json()

        if (data.status === 'failure') {
          return null
        }

        return {
          id: data.id,
          title: data.title,
          image: data.image,
          readyInMinutes: data.readyInMinutes || 30,
          servings: data.servings || 4,
          summary: data.summary || '',
          instructions: data.instructions || '',
          extendedIngredients: data.extendedIngredients || [],
          diets: data.diets || [],
          dishTypes: data.dishTypes || [],
          pricePerServing: data.pricePerServing || 0,
        }
      } catch (error) {
        console.error(`Failed to fetch recipe ${id} from Spoonacular:`, error)
        return null
      }
    })
  }

  /**
   * Data transformation methods
   */
  private transformMealDBToMenuItem(
    meal: MealDBMeal,
    categoryMap: Record<string, Category>,
  ): MenuItem {
    const category = categoryMap[meal.strCategory] || DEMO_CONSTANTS.DEFAULT_CATEGORY

    return {
      id: parseInt(meal.idMeal),
      item_name: meal.strMeal,
      description: meal.strInstructions
        ? meal.strInstructions.substring(0, 200) + '...'
        : undefined,
      category_id: category.id,
      business_id: DEMO_CONSTANTS.BUSINESS_ID,
      price: this.generatePrice(),
      tax_percentage: DEMO_CONSTANTS.DEFAULT_TAX,
      discount: this.generateDiscount(),
      photo: meal.strMealThumb || null,
      tags: meal.strTags ? meal.strTags.split(',') : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category,
    }
  }

  private transformSpoonacularToMenuItem(
    recipe: SpoonacularRecipe | SpoonacularRecipeInfo,
    index: number,
  ): MenuItem {
    const isDetailed = 'readyInMinutes' in recipe
    const recipeInfo = recipe as SpoonacularRecipeInfo

    return {
      id: recipe.id || index + 10000,
      item_name: recipe.title,
      description: isDetailed
        ? recipeInfo.summary?.substring(0, 200) + '...'
        : `${recipe.title} - Delicious recipe from Spoonacular`,
      category_id: DEMO_CONSTANTS.DEFAULT_CATEGORY.id,
      business_id: DEMO_CONSTANTS.BUSINESS_ID,
      price:
        isDetailed && recipeInfo.pricePerServing
          ? parseFloat((recipeInfo.pricePerServing / 100).toFixed(2))
          : this.generatePrice(),
      tax_percentage: DEMO_CONSTANTS.DEFAULT_TAX,
      discount: this.generateDiscount(),
      photo: recipe.image || null,
      tags: isDetailed ? [...(recipeInfo.diets || []), ...(recipeInfo.dishTypes || [])] : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: DEMO_CONSTANTS.DEFAULT_CATEGORY,
    }
  }

  /**
   * Public API methods
   */
  async getAll(params?: {
    page?: number
    per_page?: number
    search?: string
    category_id?: number
  }): Promise<ApiResponse<MenuItemsResponse>> {
    const page = Math.max(1, params?.page || 1)
    const per_page = Math.min(Math.max(params?.per_page || 10, 1), 100)
    const search = params?.search?.trim() || ''
    const category_id = params?.category_id

    try {
      // Simulate network delay in development
      if (import.meta.env.DEV) {
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      let allItems: MenuItem[] = []
      let useSpoonacular = this.isSpoonacularAvailable

      // This try Spoonacular first if available and no specific category filter
      if (useSpoonacular && !category_id) {
        const recipes = await this.fetchRecipesFromSpoonacular(search, 50)

        if (recipes.length > 0) {
          allItems = recipes.map((recipe, index) =>
            this.transformSpoonacularToMenuItem(recipe, index),
          )
          console.log(`Loaded ${allItems.length} items from Spoonacular`)
        } else {
          useSpoonacular = false
        }
      }

      // Fallback to TheMealDB if Spoonacular failed or wasn't used
      if (!useSpoonacular || allItems.length === 0) {
        const meals = await this.fetchAllMealsFromMealDB()
        const categoryMap = await this.fetchMealCategories()

        allItems = meals.map((meal) => this.transformMealDBToMenuItem(meal, categoryMap))
        console.log(`Loaded ${allItems.length} items from TheMealDB`)
      }

      // Apply filters
      let filteredItems = allItems

      // Apply category filter if specified
      if (category_id) {
        filteredItems = filteredItems.filter((item) => item.category_id === category_id)
      }

      // Apply search filter
      if (search) {
        const query = search.toLowerCase()
        filteredItems = filteredItems.filter(
          (item) =>
            item.item_name.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query) ||
            item.tags?.some((tag: string) => tag.toLowerCase().includes(query)) ||
            item.category?.name.toLowerCase().includes(query),
        )
      }

      // Paginate results
      return this.paginateResponse(filteredItems, page, per_page, search, category_id)
    } catch (error: unknown) {
      console.error('Menu Service Error:', error)

      const errorResponse: ApiResponse<MenuItemsResponse> = {
        success: false,
        message:
          error instanceof Error
            ? `Failed to fetch menu items: ${error.message}`
            : 'An unexpected error occurred while fetching menu items',
      }

      return errorResponse
    }
  }

  async get(id: number): Promise<ApiResponse<MenuItem>> {
    try {
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Check if it's a Spoonacular ID (high numbers)
      if (id > 10000 && this.isSpoonacularAvailable) {
        const recipeInfo = await this.fetchRecipeInfoFromSpoonacular(id)

        if (recipeInfo) {
          const response: ApiResponse<MenuItem> = {
            success: true,
            data: this.transformSpoonacularToMenuItem(recipeInfo, 0),
          }
          return response
        }
      }

      // Try TheMealDB
      const meal = await this.fetchMealById(id)

      if (!meal) {
        const errorResponse: ApiResponse<MenuItem> = {
          success: false,
          message: `Menu item with ID ${id} not found`,
        }
        return errorResponse
      }

      const categoryMap = await this.fetchMealCategories()
      const menuItem = this.transformMealDBToMenuItem(meal, categoryMap)

      const response: ApiResponse<MenuItem> = {
        success: true,
        data: menuItem,
      }
      return response
    } catch (error: unknown) {
      const errorResponse: ApiResponse<MenuItem> = {
        success: false,
        message:
          error instanceof Error
            ? `Failed to fetch item: ${error.message}`
            : 'Failed to fetch menu item',
      }
      return errorResponse
    }
  }

  async create(_data: MenuItemFormData | FormData): Promise<ApiResponse<MenuItem>> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const errorResponse: ApiResponse<MenuItem> = {
      success: false,
      message: 'Demo mode: External APIs are read-only. Create operation not supported.',
    }

    return errorResponse
  }

  async update(_id: number, _data: MenuItemFormData | FormData): Promise<ApiResponse<MenuItem>> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const errorResponse: ApiResponse<MenuItem> = {
      success: false,
      message: 'Demo mode: External APIs are read-only. Update operation not supported.',
    }

    return errorResponse
  }

  async delete(_id: number): Promise<ApiResponse<void>> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const errorResponse: ApiResponse<void> = {
      success: false,
      message: 'Demo mode: External APIs are read-only. Delete operation not supported.',
    }

    return errorResponse
  }

  /**
   * Helper methods
   */
  private paginateResponse(
    items: MenuItem[],
    page: number,
    per_page: number,
    search: string = '',
    category_id?: number,
  ): ApiResponse<MenuItemsResponse> {
    const total = items.length
    const last_page = Math.ceil(total / per_page) || 1
    const current_page = Math.min(Math.max(page, 1), last_page)
    const from = (current_page - 1) * per_page
    const to = Math.min(from + per_page, total)
    const paginatedItems = items.slice(from, to)

    // Build query parameters
    const queryParams = new URLSearchParams()
    if (search) queryParams.set('search', search)
    if (category_id) queryParams.set('category_id', category_id.toString())
    const queryString = queryParams.toString() ? `&${queryParams}` : ''

    // Create pagination links array
    const generatePaginationLinks = (): Array<{
      url: string | null
      label: string
      active: boolean
    }> => {
      const links: Array<{
        url: string | null
        label: string
        active: boolean
      }> = []

      // Always show first page
      if (currentPage > 3) {
        links.push({
          url: `?page=1${queryString}`,
          label: '1',
          active: false,
        })

        if (currentPage > 4) {
          links.push({
            url: null,
            label: '...',
            active: false,
          })
        }
      }

      // Show pages around current page
      const start = Math.max(1, currentPage - 2)
      const end = Math.min(last_page, currentPage + 2)

      for (let i = start; i <= end; i++) {
        links.push({
          url: i === currentPage ? null : `?page=${i}${queryString}`,
          label: i.toString(),
          active: i === currentPage,
        })
      }

      // Always show last page
      if (currentPage < last_page - 2) {
        if (currentPage < last_page - 3) {
          links.push({
            url: null,
            label: '...',
            active: false,
          })
        }

        links.push({
          url: `?page=${last_page}${queryString}`,
          label: last_page.toString(),
          active: false,
        })
      }

      return links
    }

    const currentPage = current_page
    const links = generatePaginationLinks()

    const response: ApiResponse<MenuItemsResponse> = {
      success: true,
      data: {
        data: paginatedItems,
        links: {
          first: current_page > 1 ? `?page=1${queryString}` : null,
          last: current_page < last_page ? `?page=${last_page}${queryString}` : null,
          prev: current_page > 1 ? `?page=${current_page - 1}${queryString}` : null,
          next: current_page < last_page ? `?page=${current_page + 1}${queryString}` : null,
        },
        meta: {
          current_page,
          from: total > 0 ? from + 1 : 0,
          last_page,
          links,
          path: '/menu-items',
          per_page,
          to,
          total,
        },
      },
    }

    return response
  }

  /**
   * Utility methods for the UI
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const categoryMap = await this.fetchMealCategories()
      const categories = Object.values(categoryMap)

      const response: ApiResponse<Category[]> = {
        success: true,
        data: categories,
      }

      return response
    } catch (error) {
      const response: ApiResponse<Category[]> = {
        success: false,
        message: 'Failed to fetch categories',
        data: [DEMO_CONSTANTS.DEFAULT_CATEGORY],
      }

      return response
    }
  }

  async searchItems(query: string, limit: number = 10): Promise<ApiResponse<MenuItem[]>> {
    try {
      const response = await this.getAll({ search: query, per_page: limit })

      if (response.success && response.data) {
        const searchResponse: ApiResponse<MenuItem[]> = {
          success: true,
          data: response.data.data,
        }

        return searchResponse
      }

      const errorResponse: ApiResponse<MenuItem[]> = {
        success: false,
        message: response.message || 'Search failed',
        data: [],
      }

      return errorResponse
    } catch (error) {
      const errorResponse: ApiResponse<MenuItem[]> = {
        success: false,
        message: 'Search failed',
        data: [],
      }

      return errorResponse
    }
  }

  /**
   * Cache management public methods
   */
  clearAllCache(): void {
    this.clearCache()
  }

  getCacheStatus(): {
    hasMealsCache: boolean
    hasCategoriesCache: boolean
    hasSpoonacularCache: boolean
    cacheAge: number
  } {
    const now = Date.now()
    const age = now - this.cache.timestamp

    return {
      hasMealsCache: !!this.cache.meals,
      hasCategoriesCache: !!this.cache.categories,
      hasSpoonacularCache: !!this.cache.spoonacularRecipes,
      cacheAge: Math.floor(age / 1000), // in seconds
    }
  }

  isSpoonacularEnabled(): boolean {
    return this.isSpoonacularAvailable
  }
}

// Export singleton instance
const menuItemService = new TheMealDBMenuItemService()
export default menuItemService
