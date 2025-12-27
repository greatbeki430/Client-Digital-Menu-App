export interface Category {
  id: number
  name: string
  description?: string
  image?: string
  business_id?: number
  created_at: string
  updated_at: string
}

export interface CategoryFormData {
  name: string
  description?: string
  image?: File | string
}

export interface PaginatedResponse<T> {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

export type CategoriesResponse = PaginatedResponse<Category>
