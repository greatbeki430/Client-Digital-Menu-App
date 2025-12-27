export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
}

export interface PaginationParams {
  page?: number
  per_page?: number
  search?: string
}

export interface SelectOption {
  value: string | number
  label: string
}
