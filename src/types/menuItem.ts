import type { Category, PaginatedResponse } from './category'

export interface MenuItem {
  id: number
  item_name: string
  category_id: number
  business_id: number
  price: number
  tax_percentage: number
  discount?: number
  photo?: string | null // <-- allow null
  created_at: string
  updated_at: string
  category?: Category
}

export interface MenuItemFormData {
  item_name: string
  category_id: number | string
  price: number | string
  tax_percentage: number | string
  discount?: number | string
  photo?: File | string
}

// export interface MenuItemsResponse extends PaginatedResponse<MenuItem> {}
export type MenuItemsResponse = PaginatedResponse<MenuItem>


export interface GroupedMenuItems {
  [categoryId: number]: {
    category: Category
    items: MenuItem[]
  }
}
