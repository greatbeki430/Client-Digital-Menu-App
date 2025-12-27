import type { Category, CategoriesResponse } from '@/types/category'
import type { ApiResponse } from '@/types/auth'

interface MealDBCategory {
  idCategory: string
  strCategory: string
  strCategoryThumb: string
  strCategoryDescription: string
}

class TheMealDBService {
  private baseURL = 'https://www.themealdb.com/api/json/v1/1'

  async getAll(page = 1, per_page = 10): Promise<ApiResponse<CategoriesResponse>> {
    try {
      // Simulate some delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Fetch categories from TheMealDB
      const response = await fetch(`${this.baseURL}/categories.php`)
      const data = await response.json()

      if (!data.categories) {
        throw new Error('No categories found')
      }

      // Transform TheMealDB format to your app's format
      const allCategories: Category[] = data.categories.map(
        (cat: MealDBCategory, index: number) => ({
          id: index + 1,
          name: cat.strCategory,
          description: this.truncateDescription(cat.strCategoryDescription, 100),
          image: cat.strCategoryThumb,
          business_id: 1, // Default business ID
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      )

      // Apply pagination
      const total = allCategories.length
      const last_page = Math.ceil(total / per_page)
      const current_page = Math.min(Math.max(page, 1), last_page || 1)
      const from = (current_page - 1) * per_page
      const to = from + per_page

      const paginatedCategories = allCategories.slice(from, to)

      return {
        success: true,
        data: {
          data: paginatedCategories,
          links: {
            first: page > 1 ? `?page=1` : null,
            last: page < last_page ? `?page=${last_page}` : null,
            prev: page > 1 ? `?page=${page - 1}` : null,
            next: page < last_page ? `?page=${page + 1}` : null,
          },
          meta: {
            current_page,
            from: from + 1,
            last_page,
            links: this.generatePaginationLinks(current_page, last_page),
            path: '/categories',
            per_page,
            to: Math.min(to, total),
            total,
          },
        },
      }
    } catch (error: unknown) {
      console.error('TheMealDB Service Error:', error)
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to fetch categories from TheMealDB',
      }
    }
  }

  async get(id: number): Promise<ApiResponse<Category>> {
    try {
      // Fetch all categories and find the one by ID
      const response = await this.getAll(1, 100) // Get all categories

      if (!response.success || !response.data) {
        throw new Error('Failed to fetch categories')
      }

      const category = response.data.data.find((cat) => cat.id === id)

      if (!category) {
        throw new Error(`Category with ID ${id} not found`)
      }

      return {
        success: true,
        data: category,
      }
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch category',
      }
    }
  }

  // Mock create method (TheMealDB is read-only)
  async create(): Promise<ApiResponse<Category>> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: false,
      message: 'TheMealDB is a read-only API. Create operation not supported.',
    }
  }

  // Mock update method
  async update(): Promise<ApiResponse<Category>> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: false,
      message: 'TheMealDB is a read-only API. Update operation not supported.',
    }
  }

  // Mock delete method
  async delete(): Promise<ApiResponse<void>> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: false,
      message: 'TheMealDB is a read-only API. Delete operation not supported.',
    }
  }

  // Helper methods
  private truncateDescription(description: string, maxLength: number): string {
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength) + '...'
  }

  private generatePaginationLinks(currentPage: number, lastPage: number) {
    const links = []

    for (let i = 1; i <= lastPage; i++) {
      links.push({
        url: i === currentPage ? null : `?page=${i}`,
        label: i.toString(),
        active: i === currentPage,
      })
    }

    return links
  }
}

export default new TheMealDBService()
