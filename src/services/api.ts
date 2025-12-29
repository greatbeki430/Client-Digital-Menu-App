import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'https://laravelapi.mebrejderma.com/api',
      timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        // Use localStorage directly (available in browser)
        if (typeof window !== 'undefined') {
          console.log(`📤 API Request to: ${config.url}`)
          console.log('HTTP Method:', config.method?.toUpperCase())

          // Try different token storage keys
          const token =
            localStorage.getItem('access_token') ||
            localStorage.getItem('mock_access_token') ||
            localStorage.getItem('token') ||
            sessionStorage.getItem('access_token')

          console.log('🔑 Token found:', token ? 'Yes' : 'No')
          console.log(
            '🔑 Token value (first 20 chars):',
            token ? token.substring(0, 20) + '...' : 'None',
          )
          console.log('🔑 Full token check:')
          console.log(
            '  - access_token:',
            localStorage.getItem('access_token') ? 'Exists' : 'Missing',
          )
          console.log(
            '  - mock_access_token:',
            localStorage.getItem('mock_access_token') ? 'Exists' : 'Missing',
          )
          console.log('  - token:', localStorage.getItem('token') ? 'Exists' : 'Missing')

          if (token) {
            config.headers.Authorization = `Bearer ${token}`
            console.log(
              '✅ Authorization header added:',
              config.headers.Authorization?.substring(0, 30) + '...',
            )
          } else {
            console.warn('⚠️ No authentication token found for request')
            console.log('📋 All localStorage:', { ...localStorage })
          }
        }

        return config
      },
      (error) => {
        console.error('❌ Request interceptor error:', error)
        return Promise.reject(error)
      },
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response from: ${response.config.url}`, response.status)
        return response
      },
      (error) => {
        console.error(`❌ API Error from: ${error.config?.url}`, {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        })

        if (error.response?.status === 401 && typeof window !== 'undefined') {
          console.warn('🔐 401 Unauthorized - Clearing auth data')
          // Clear all auth data
          localStorage.removeItem('access_token')
          localStorage.removeItem('mock_access_token')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('mock_user')
          sessionStorage.clear()

          // Redirect to login
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      },
    )
  }

  public async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, config)
    return response.data
  }

  public async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config)
    return response.data
  }

  public async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config)
    return response.data
  }

  public async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, config)
    return response.data
  }
}

export default new ApiService()
