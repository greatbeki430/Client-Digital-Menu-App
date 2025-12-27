import type { AxiosError } from 'axios'
import type { Category, CategoryFormData, CategoriesResponse } from '@/types/category'
import type { ApiResponse } from '@/types/auth'
import api from './api'

class CategoryService {
  async getAll(page = 1): Promise<ApiResponse<CategoriesResponse>> {
    try {
      const response = await api.get<CategoriesResponse>(`/menu-managers?page=${page}`)
      return {
        success: true,
        data: response,
      }
    } catch (error: unknown) {
      return this.handleError(error)
    }
  }

  async get(id: number): Promise<ApiResponse<Category>> {
    try {
      const response = await api.get<Category>(`/menu-managers/${id}`)
      return {
        success: true,
        data: response,
      }
    } catch (error: unknown) {
      return this.handleError(error)
    }
  }

  async create(data: CategoryFormData | FormData): Promise<ApiResponse<Category>> {
    try {
      // Handle file upload if image is present
      if (data instanceof FormData) {
        const response = await api.post<Category>('/menu-managers', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        return {
          success: true,
          data: response,
        }
      }

      // Handle file upload if image is a File object
      if (data.image && data.image instanceof File) {
        const formData = new FormData()
        formData.append('name', data.name)
        if (data.description) formData.append('description', data.description)
        formData.append('image', data.image)

        const response = await api.post<Category>('/menu-managers', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        return {
          success: true,
          data: response,
        }
      }

      // Regular JSON request
      const response = await api.post<Category>('/menu-managers', data)
      return {
        success: true,
        data: response,
      }
    } catch (error: unknown) {
      return this.handleError(error)
    }
  }

  async update(id: number, data: CategoryFormData | FormData): Promise<ApiResponse<Category>> {
    try {
      // Handle file upload for updates
      if (data instanceof FormData) {
        data.append('_method', 'PUT')
        const response = await api.post<Category>(`/menu-managers/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        return {
          success: true,
          data: response,
        }
      }

      // Handle file upload if image is a File object
      if (data.image && data.image instanceof File) {
        const formData = new FormData()
        formData.append('name', data.name)
        if (data.description) formData.append('description', data.description)
        formData.append('image', data.image)
        formData.append('_method', 'PUT')

        const response = await api.post<Category>(`/menu-managers/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        return {
          success: true,
          data: response,
        }
      }

      // Regular JSON request
      const response = await api.put<Category>(`/menu-managers/${id}`, data)
      return {
        success: true,
        data: response,
      }
    } catch (error: unknown) {
      return this.handleError(error)
    }
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    try {
      await api.delete(`/menu-managers/${id}`)
      return {
        success: true,
      }
    } catch (error: unknown) {
      return this.handleError(error)
    }
  }

  private handleError<T = unknown>(error: unknown): ApiResponse<T> {
    const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>

    if (axiosError.response?.data) {
      return {
        success: false,
        message: axiosError.response.data.message || 'An error occurred',
        errors: axiosError.response.data.errors,
        status: axiosError.response.status,
      }
    }

    const message = error instanceof Error ? error.message : 'Network error'

    return {
      success: false,
      message,
    }
  }
}

export default new CategoryService()
