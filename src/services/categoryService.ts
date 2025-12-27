// import type { AxiosError } from 'axios'
// import type { Category, CategoryFormData, CategoriesResponse } from '@/types/category'
// import type { ApiResponse } from '@/types/auth'
// import api from './api'
// import theMealDbService from './theMealDbService'

// class CategoryService {
//   // Flag to use mock data when real API fails
//   private useRealAPI = true

//   async getAll(page = 1): Promise<ApiResponse<CategoriesResponse>> {
//     // If real API is enabled, try it first
//     if (this.useRealAPI) {
//       try {
//         const response = await api.get<CategoriesResponse>(`/menu-managers?page=${page}`)
//         return {
//           success: true,
//           data: response,
//         }
//       } catch (error: unknown) {
//         console.warn('Real API failed, falling back to TheMealDB', error)
//         // Disable real API for subsequent calls in this session
//         this.useRealAPI = false
//         return theMealDbService.getAll(page)
//       }
//     }

//     // Use TheMealDB if real API is disabled
//     return theMealDbService.getAll(page)
//   }

//   async get(id: number): Promise<ApiResponse<Category>> {
//     if (this.useRealAPI) {
//       try {
//         const response = await api.get<Category>(`/menu-managers/${id}`)
//         return {
//           success: true,
//           data: response,
//         }
//       } catch (error: unknown) {
//         console.warn('Real API failed, falling back to TheMealDB', error)
//         this.useRealAPI = false
//         return theMealDbService.get(id)
//       }
//     }

//     return theMealDbService.get(id)
//   }

//   async create(_data: CategoryFormData | FormData): Promise<ApiResponse<Category>> {
//     if (this.useRealAPI) {
//       try {
//         // Handle FormData for file upload
//         if (_data instanceof FormData) {
//           const response = await api.post<Category>('/menu-managers', _data, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           })
//           return {
//             success: true,
//             data: response,
//           }
//         }

//         // Handle file upload if image is a File
//         if (_data.image && _data.image instanceof File) {
//           const formData = new FormData()
//           formData.append('name', _data.name)
//           if (_data.description) formData.append('description', _data.description)
//           formData.append('image', _data.image)

//           const response = await api.post<Category>('/menu-managers', formData, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           })
//           return {
//             success: true,
//             data: response,
//           }
//         }

//         // Regular JSON request
//         const response = await api.post<Category>('/menu-managers', _data)
//         return {
//           success: true,
//           data: response,
//         }
//       } catch (error: unknown) {
//         console.warn('Real API failed for create', error)
//         this.useRealAPI = false
//         return this.handleError(error)
//       }
//     }

//     // If real API is disabled, use TheMealDB's mock create
//     return theMealDbService.create(_data)
//   }

//   async update(_id: number, _data: CategoryFormData | FormData): Promise<ApiResponse<Category>> {
//     if (this.useRealAPI) {
//       try {
//         // Handle FormData for file upload
//         if (_data instanceof FormData) {
//           _data.append('_method', 'PUT')
//           const response = await api.post<Category>(`/menu-managers/${_id}`, _data, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           })
//           return {
//             success: true,
//             data: response,
//           }
//         }

//         // Handle file upload if image is a File
//         if (_data.image && _data.image instanceof File) {
//           const formData = new FormData()
//           formData.append('name', _data.name)
//           if (_data.description) formData.append('description', _data.description)
//           formData.append('image', _data.image)
//           formData.append('_method', 'PUT')

//           const response = await api.post<Category>(`/menu-managers/${_id}`, formData, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           })
//           return {
//             success: true,
//             data: response,
//           }
//         }

//         // Regular JSON request
//         const response = await api.put<Category>(`/menu-managers/${_id}`, _data)
//         return {
//           success: true,
//           data: response,
//         }
//       } catch (error: unknown) {
//         console.warn('Real API failed for update', error)
//         this.useRealAPI = false
//         return this.handleError(error)
//       }
//     }

//     return theMealDbService.update(_id, _data)
//   }

//   async delete(_id: number): Promise<ApiResponse<void>> {
//     if (this.useRealAPI) {
//       try {
//         await api.delete(`/menu-managers/${_id}`)
//         return {
//           success: true,
//         }
//       } catch (error: unknown) {
//         console.warn('Real API failed for delete', error)
//         this.useRealAPI = false
//         return this.handleError(error)
//       }
//     }

//     return theMealDbService.delete(_id)
//   }

//   // Method to manually switch back to real API (call this when backend is fixed)
//   public enableRealAPI(): void {
//     this.useRealAPI = true
//     console.log('Real API enabled. Will try real endpoints on next request.')
//   }

//   // Method to force use TheMealDB
//   public disableRealAPI(): void {
//     this.useRealAPI = false
//     console.log('Real API disabled. Using TheMealDB only.')
//   }

//   private handleError<T = unknown>(_error: unknown): ApiResponse<T> {
//     const axiosError = _error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>

//     if (axiosError.response?.data) {
//       return {
//         success: false,
//         message: axiosError.response.data.message || 'An error occurred',
//         errors: axiosError.response.data.errors,
//         status: axiosError.response.status,
//       }
//     }

//     const message = _error instanceof Error ? _error.message : 'Network error'

//     return {
//       success: false,
//       message,
//     }
//   }
// }

// export default new CategoryService()

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
    return { success: false, message: 'Mock mode - delete not implemented' }
  }
}

export default new CategoryService()
