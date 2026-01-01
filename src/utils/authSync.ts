/**
 * Authentication synchronization utilities
 * Ensures auth data is consistent across all storage locations
 */

import { storageManager } from './storageManager'

/**
 * Sync authentication data between localStorage and storageManager
 */
export const syncAuthentication = (): boolean => {
  console.log('🔄 Starting authentication sync...')

  // Get token from all possible locations
  const tokenSources = [
    { source: 'localStorage access_token', value: localStorage.getItem('access_token') },
    { source: 'localStorage token', value: localStorage.getItem('token') },
    {
      source: 'storageManager access_token',
      value: storageManager.getItem<string>('access_token'),
    },
  ]

  let token: string | null = null
  for (const source of tokenSources) {
    if (source.value) {
      token = source.value as string
      console.log(`✅ Found token in: ${source.source}`)
      break
    }
  }

  if (!token) {
    console.log('❌ No token found in any location')
    return false
  }

  // Get user from all possible locations
  const userSources = [
    { source: 'localStorage user', value: localStorage.getItem('user') },
    { source: 'storageManager user', value: storageManager.getItem('user') },
    { source: 'storageManager current_user', value: storageManager.getItem('current_user') },
  ]

  let user: unknown = null
  for (const source of userSources) {
    if (source.value) {
      try {
        user = JSON.parse(source.value as string)
        console.log(`✅ Found user in: ${source.source}`)
        break
      } catch (e) {
        console.warn(`Failed to parse user from ${source.source}:`, e)
      }
    }
  }

  if (!user) {
    console.log('❌ No valid user found')
    return false
  }

  // Ensure data is in both locations
  localStorage.setItem('access_token', token)
  localStorage.setItem('user', JSON.stringify(user))
  storageManager.setItem('access_token', token)
  storageManager.setItem('user', user)

  console.log('✅ Authentication synced successfully')
  return true
}

/**
 * Initialize authentication sync on app startup
 */
export const initAuthSync = (): void => {
  console.log('🚀 Initializing authentication sync...')

  // Only run in development mode
  if (import.meta.env.DEV) {
    console.log('🔧 Running in development mode')

    // Ensure we have basic auth data
    if (!localStorage.getItem('access_token')) {
      console.log('🔄 Setting up development auth data...')

      const devUser = {
        id: 1,
        name: 'Development User',
        email: 'dev@example.com',
        phone: '+1234567890',
        business_name: 'Dev Restaurant',
        tin: 'DEV123456',
        email_verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const devToken =
        'dev-mock-token.' +
        btoa(
          JSON.stringify({
            sub: 1,
            name: 'Development User',
            email: 'dev@example.com',
            exp: Math.floor(Date.now() / 1000) + 86400,
          }),
        ) +
        '.dev-signature'

      localStorage.setItem('access_token', devToken)
      localStorage.setItem('user', JSON.stringify(devUser))
      storageManager.setItem('access_token', devToken)
      storageManager.setItem('user', devUser)

      console.log('✅ Development auth data setup complete')
    }

    // Sync existing data
    syncAuthentication()
  } else {
    console.log('🔒 Production mode - minimal sync')
    // In production, just ensure consistency
    syncAuthentication()
  }
}
