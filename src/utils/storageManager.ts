// Storage manager to ensure data persistence
export class StorageManager {
  private static instance: StorageManager
  private readonly PREFIX = 'digital_menu_'

  private constructor() {
    this.initialize()
  }

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager()
    }
    return StorageManager.instance
  }

  private initialize(): void {
    // Check if storage is available
    if (!this.isStorageAvailable()) {
      console.warn('LocalStorage is not available. Using fallback in-memory storage.')
      return
    }

    // Migrate old keys to new prefixed keys
    this.migrateOldKeys()

    // Backup current data
    this.createBackup()
  }

  private isStorageAvailable(): boolean {
    try {
      const testKey = '__test__'
      localStorage.setItem(testKey, testKey)
      localStorage.removeItem(testKey)
      return true
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return false
    }
  }

  private migrateOldKeys(): void {
    const oldKeys = ['access_token', 'user']

    oldKeys.forEach((oldKey) => {
      const value = localStorage.getItem(oldKey)
      if (value) {
        const newKey = this.PREFIX + oldKey
        localStorage.setItem(newKey, value)
        localStorage.removeItem(oldKey)
      }
    })
  }

  setItem(key: string, value: unknown): void {
    try {
      const prefixedKey = this.PREFIX + key
      const stringValue = JSON.stringify(value)
      localStorage.setItem(prefixedKey, stringValue)
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
      // Fallback to sessionStorage or in-memory
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const prefixedKey = this.PREFIX + key
      const value = localStorage.getItem(prefixedKey)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('Failed to read from localStorage:', error)
      return null
    }
  }

  removeItem(key: string): void {
    const prefixedKey = this.PREFIX + key
    localStorage.removeItem(prefixedKey)
  }

  clear(): void {
    // Only clear our prefixed keys
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(this.PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  }

  private createBackup(): void {
    const backup: Record<string, unknown> = {}
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(this.PREFIX)) {
        backup[key] = localStorage.getItem(key)
      }
    })

    // Store backup in a separate key
    localStorage.setItem(this.PREFIX + 'backup', JSON.stringify(backup))
  }

  restoreBackup(): boolean {
    try {
      const backup = localStorage.getItem(this.PREFIX + 'backup')
      if (!backup) return false

      const backupData = JSON.parse(backup)
      Object.entries(backupData).forEach(([key, value]) => {
        localStorage.setItem(key, value as string)
      })
      return true
    } catch (error) {
      console.error('Failed to restore backup:', error)
      return false
    }
  }

  // Debug method
  debug(): void {
    console.log('=== Storage Debug ===')
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(this.PREFIX)) {
        console.log(`${key}:`, localStorage.getItem(key))
      }
    })
    console.log('=====================')
  }
}

export const storageManager = StorageManager.getInstance()
