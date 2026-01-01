// Mock authentication service with persistent storage
import { storageManager } from '@/utils/storageManager'
interface MockUser {
  id: number
  name: string
  email: string
  phone: string
  business_name: string
  tin: string
  password: string
  createdAt: string
}

class MockAuthService {
  private storageKey = 'digital_menu_mock_users'
  private currentUserKey = 'digital_menu_current_user'

  // Initialize with test user
  constructor() {
    this.initializeDefaultUsers()
  }

  private initializeDefaultUsers(): void {
    const existingUsers = this.getUsers()

    // Adding test user if not exists
    const testUserExists = existingUsers.some((user) => user.email === 'abc@gmail.com')
    if (!testUserExists) {
      const testUser: MockUser = {
        id: 1,
        name: 'Test Restaurant',
        email: 'abc@gmail.com',
        phone: '+1234567890',
        business_name: 'Test Restaurant',
        tin: 'TEST123456',
        password: 'abctest',
        createdAt: new Date().toISOString(),
      }
      existingUsers.push(testUser)
      this.saveUsers(existingUsers)
    }
  }

  private getUsers(): MockUser[] {
    return storageManager.getItem<MockUser[]>('mock_users') || []
  }

  private saveUsers(users: MockUser[]): void {
    storageManager.setItem('mock_users', users)
  }

  // Registering new user
  register(userData: Omit<MockUser, 'id' | 'createdAt'>): {
    success: boolean
    user?: MockUser
    error?: string
  } {
    try {
      const users = this.getUsers()

      // Check if email already exists
      if (users.some((user) => user.email === userData.email)) {
        return {
          success: false,
          error: 'Email already registered. Please use a different email or login.',
        }
      }

      // Validate required fields
      const requiredFields = ['name', 'email', 'phone', 'business_name', 'tin', 'password']
      const missingFields = requiredFields.filter(
        (field) => !userData[field as keyof typeof userData],
      )

      if (missingFields.length > 0) {
        return {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`,
        }
      }

      // Create new user
      const newUser: MockUser = {
        id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
        ...userData,
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)
      this.saveUsers(users)

      return {
        success: true,
        user: newUser,
      }
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        error: 'Registration failed. Please try again.',
      }
    }
  }

  // Login user
  login(email: string, password: string): { success: boolean; user?: MockUser; error?: string } {
    try {
      const users = this.getUsers()
      const user = users.find((u) => u.email === email && u.password === password)

      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password. Please try again.',
        }
      }

      // Save current user
      this.setCurrentUser(user)

      return {
        success: true,
        user,
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: 'Login failed. Please try again.',
      }
    }
  }

  // Get current user
  getCurrentUser(): MockUser | null {
    return storageManager.getItem<MockUser>('current_user')
  }

  // Set current user
  setCurrentUser(user: MockUser): void {
    storageManager.setItem('current_user', user)
    storageManager.setItem('access_token', 'mock-token-' + user.id)
  }

  // Logout
  logout(): void {
    storageManager.removeItem('current_user')
    storageManager.removeItem('access_token')
  }

  // Get all users (for debugging)
  getAllUsers(): MockUser[] {
    return this.getUsers()
  }

  // Reset database (for testing)
  resetDatabase(): void {
    localStorage.removeItem(this.storageKey)
    localStorage.removeItem(this.currentUserKey)
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    this.initializeDefaultUsers()
  }
}

export const mockAuthService = new MockAuthService()
