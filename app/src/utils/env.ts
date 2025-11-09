/**
 * Environment utilities - uses secure backend proxy
 * API keys are NEVER exposed to the client
 * All API requests must go through /api/proxy
 */

// Cache for configured services
let configuredServicesCache: string[] = []

/**
 * Get list of configured platforms from backend
 * This is safe because it only returns which services are configured,
 * not the actual API keys
 */
export async function getConfiguredServices(): Promise<string[]> {
  if (configuredServicesCache.length > 0) {
    return configuredServicesCache
  }

  try {
    const response = await fetch('/api/health')
    if (!response.ok) {
      console.error('Failed to fetch configured services')
      return []
    }
    const data = await response.json()
    configuredServicesCache = data.configured || []
    return configuredServicesCache
  } catch (error) {
    console.error('Error fetching configured services:', error)
    return []
  }
}

/**
 * Get initial API credentials from backend
 * Returns a map of platform -> true for configured platforms
 */
export function getInitialCredentialsFromEnv(): Record<string, string> {
  // This is now handled asynchronously via getConfiguredServices()
  // Return empty object as the store will be updated after async call
  return {}
}

/**
 * Check if a platform is configured (has API key on backend)
 * This checks the cache, call getConfiguredServices() first to populate
 */
export function isEnvKey(platform: string): boolean {
  if (configuredServicesCache.length === 0) {
    return false
  }
  return configuredServicesCache.includes(platform)
}

/**
 * Get API key - DEPRECATED
 * API keys are never accessible on the client
 * Use the API client utilities in utils/apiClient.ts instead
 */
export function getApiKey(_platform: string, _userCredentials: Record<string, string | undefined>): string | undefined {
  console.warn('getApiKey is deprecated. API keys are not accessible on the client. Use API client utilities instead.')
  return undefined
}
