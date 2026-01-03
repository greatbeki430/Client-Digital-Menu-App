
import type { Category, CategoryFormData, CategoriesResponse } from '@/types/category'
import type { ApiResponse } from '@/types/auth'

interface MealDBCategory {
  idCategory: string
  strCategory: string
  strCategoryThumb: string
  strCategoryDescription: string
}

class CategoryService {
  private baseURL = 'https://www.themealdb.com/api/json/v1/1'

  async getAll(page = 1, per_page = 10): Promise<ApiResponse<CategoriesResponse>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      const response = await fetch(`${this.baseURL}/categories.php`)
      const data = await response.json()

      const allCategories: Category[] = data.categories.map(
        (cat: MealDBCategory, index: number) => ({
          id: index + 1,
          name: cat.strCategory,
          description: cat.strCategoryDescription.substring(0, 100) + '...',
          image: cat.strCategoryThumb,
          business_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      )

      const total = allCategories.length
      const last_page = Math.ceil(total / per_page)
      const current_page = Math.min(Math.max(page, 1), last_page || 1)
      const from = (current_page - 1) * per_page
      const to = from + per_page

      return {
        success: true,
        data: {
          data: allCategories.slice(from, to),
          links: { first: null, last: null, prev: null, next: null },
          meta: {
            current_page,
            from: from + 1,
            last_page,
            links: [],
            path: '',
            per_page,
            to: Math.min(to, total),
            total,
          },
        },
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      return {
        success: false,
        message: 'Failed to load categories',
      }
    }
  }

  async get(id: number): Promise<ApiResponse<Category>> {
    const all = await this.getAll(1, 100)
    if (!all.success || !all.data) {
      return { success: false, message: 'Failed to load categories' }
    }

    const category = all.data.data.find((c) => c.id === id)
    if (!category) {
      return { success: false, message: 'Category not found' }
    }

    return { success: true, data: category }
  }

  // Mock methods
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(_data: CategoryFormData | FormData): Promise<ApiResponse<Category>> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { success: false, message: 'Mock mode - create not implemented' }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(_id: number, _data: CategoryFormData | FormData): Promise<ApiResponse<Category>> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { success: false, message: 'Mock mode - update not implemented' }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(_id: number): Promise<ApiResponse<void>> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      success: false,
      message: 'Mock Mode: Delete functionality is not implemented',
      errors: {
        demo: [
          'This is a demo application. In a real application, this would delete the category from the database.',
        ],
      },
    }
  }
}

export default new CategoryService()
