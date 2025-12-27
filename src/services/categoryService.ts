// src/services/categoryService.ts
import type {
  Category,
  CategoryFormData,
  CategoriesResponse,
  PaginatedResponse,
} from '@/types/category'
import type { ApiResponse } from '@/types/auth'

class CategoryService {
  private categories: Category[] = []

  constructor() {
    // Initialize with some mock categories
    const now = new Date().toISOString()
    this.categories = [
      {
        id: 1,
        name: 'Beverages',
        description: 'Drinks and refreshments',
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        name: 'Appetizers',
        description: 'Start your meal',
        created_at: now,
        updated_at: now,
      },
      { id: 3, name: 'Main Course', description: 'Hearty meals', created_at: now, updated_at: now },
      { id: 4, name: 'Desserts', description: 'Sweet treats', created_at: now, updated_at: now },
      { id: 5, name: 'Salads', description: 'Fresh and healthy', created_at: now, updated_at: now },
      { id: 6, name: 'Soups', description: 'Warm soups', created_at: now, updated_at: now },
      { id: 7, name: 'Sides', description: 'Extra sides', created_at: now, updated_at: now },
      { id: 8, name: 'Breakfast', description: 'Start your day', created_at: now, updated_at: now },
      { id: 9, name: 'Lunch', description: 'Midday meals', created_at: now, updated_at: now },
      { id: 10, name: 'Dinner', description: 'Evening meals', created_at: now, updated_at: now },
      {
        id: 11,
        name: 'Vegan',
        description: 'Plant-based dishes',
        created_at: now,
        updated_at: now,
      },
      {
        id: 12,
        name: 'Kids Menu',
        description: 'Meals for kids',
        created_at: now,
        updated_at: now,
      },
      { id: 13, name: 'Snacks', description: 'Quick bites', created_at: now, updated_at: now },
      { id: 14, name: 'Seafood', description: 'Fish and more', created_at: now, updated_at: now },
      {
        id: 15,
        name: 'Grill',
        description: 'Grilled specialties',
        created_at: now,
        updated_at: now,
      },
      {
        id: 16,
        name: 'Pasta',
        description: 'Italian pasta dishes',
        created_at: now,
        updated_at: now,
      },
      {
        id: 17,
        name: 'Pizza',
        description: 'Cheesy and delicious',
        created_at: now,
        updated_at: now,
      },
      { id: 18, name: 'Burgers', description: 'Juicy burgers', created_at: now, updated_at: now },
      {
        id: 19,
        name: 'Drinks',
        description: 'Cold and hot beverages',
        created_at: now,
        updated_at: now,
      },
      { id: 20, name: 'Specials', description: 'Chef specials', created_at: now, updated_at: now },
    ]
  }

  private paginate(items: Category[], page: number, per_page = 10): PaginatedResponse<Category> {
    const total = items.length
    const last_page = Math.ceil(total / per_page)
    const current_page = Math.min(Math.max(page, 1), last_page || 1)
    const from = (current_page - 1) * per_page
    const to = from + per_page
    return {
      data: items.slice(from, to),
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
    }
  }

  async getAll(page = 1): Promise<ApiResponse<CategoriesResponse>> {
    try {
      const paginated = this.paginate(this.categories, page)
      return { success: true, data: paginated }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load categories'
      return { success: false, message }
    }
  }

  async get(id: number): Promise<ApiResponse<Category>> {
    try {
      const category = this.categories.find((c) => c.id === id)
      if (!category) throw new Error('Category not found')
      return { success: true, data: category }
    } catch (error: unknown) {
      return { success: false, message: (error as Error).message }
    }
  }

  async create(data: CategoryFormData): Promise<ApiResponse<Category>> {
    try {
      const now = new Date().toISOString()
      const newCategory: Category = {
        id: this.categories.length ? Math.max(...this.categories.map((c) => c.id)) + 1 : 1,
        name: data.name,
        description: data.description,
        image: typeof data.image === 'string' ? data.image : undefined,
        created_at: now,
        updated_at: now,
      }
      this.categories.push(newCategory)
      return { success: true, data: newCategory }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      return { success: false, message: 'Failed to create category' }
    }
  }

  async update(id: number, data: CategoryFormData): Promise<ApiResponse<Category>> {
    try {
      const index = this.categories.findIndex((c) => c.id === id)
      if (index === -1) throw new Error('Category not found')
      const existing = this.categories[index]!
      const updatedCategory: Category = {
        id: existing.id,
        name: data.name,
        description: data.description,
        image: typeof data.image === 'string' ? data.image : existing.image,
        created_at: existing.created_at,
        updated_at: new Date().toISOString(),
      }
      this.categories[index] = updatedCategory
      return { success: true, data: updatedCategory }
    } catch (error: unknown) {
      return { success: false, message: (error as Error).message }
    }
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    try {
      this.categories = this.categories.filter((c) => c.id !== id)
      return { success: true }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete category'
      return { success: false, message }
    }
  }
}

export default new CategoryService()
