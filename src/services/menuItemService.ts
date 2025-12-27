import type { AxiosError } from 'axios'
import type { MenuItem, MenuItemFormData, MenuItemsResponse } from '@/types/menuItem'
import type { ApiResponse } from '@/types/auth'
import api from './api'

class MenuItemService {
  async getAll(params?: {
    page?: number
    search?: string
  }): Promise<ApiResponse<MenuItemsResponse>> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.search) queryParams.append('search', params.search)

      const response = await api.get<MenuItemsResponse>(`/menu-items?${queryParams.toString()}`)
      return {
        success: true,
        data: response,
      }
    } catch (error: unknown) {
      return this.handleError(error)
    }
  }

  async get(id: number): Promise<ApiResponse<MenuItem>> {
    try {
      const response = await api.get<MenuItem>(`/menu-items/${id}`)
      return {
        success: true,
        data: response,
      }
    } catch (error: unknown) {
      return this.handleError(error)
    }
  }

  async create(data: MenuItemFormData | FormData): Promise<ApiResponse<MenuItem>> {
    try {
      // Handle file upload if data is FormData
      if (data instanceof FormData) {
        const response = await api.post<MenuItem>('/menu-items', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        return {
          success: true,
          data: response,
        }
      }

      // Handle file upload if photo is present
      if (data.photo && data.photo instanceof File) {
        const formData = new FormData()
        formData.append('item_name', data.item_name)
        formData.append('category_id', data.category_id.toString())
        formData.append('price', data.price.toString())
        formData.append('tax_percentage', data.tax_percentage.toString())
        if (data.discount) formData.append('discount', data.discount.toString())
        formData.append('photo', data.photo)

        const response = await api.post<MenuItem>('/menu-items', formData, {
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
      const response = await api.post<MenuItem>('/menu-items', data)
      return {
        success: true,
        data: response,
      }
    } catch (error: unknown) {
      return this.handleError(error)
    }
  }

  async update(id: number, data: MenuItemFormData | FormData): Promise<ApiResponse<MenuItem>> {
    try {
      // Handle file upload for updates if data is FormData
      if (data instanceof FormData) {
        data.append('_method', 'PUT')
        const response = await api.post<MenuItem>(`/menu-items/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        return {
          success: true,
          data: response,
        }
      }

      // Handle file upload for updates if photo is a File
      if (data.photo && data.photo instanceof File) {
        const formData = new FormData()
        formData.append('item_name', data.item_name)
        formData.append('category_id', data.category_id.toString())
        formData.append('price', data.price.toString())
        formData.append('tax_percentage', data.tax_percentage.toString())
        if (data.discount) formData.append('discount', data.discount.toString())
        formData.append('photo', data.photo)
        formData.append('_method', 'PUT')

        const response = await api.post<MenuItem>(`/menu-items/${id}`, formData, {
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
      const response = await api.put<MenuItem>(`/menu-items/${id}`, data)
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
      await api.delete(`/menu-items/${id}`)
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

export default new MenuItemService()
