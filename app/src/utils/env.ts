// Environment variable utilities for API key management

/**
 * Get API key from environment variables or user-provided credentials
 * Priority: Environment variables > User credentials
 */
export function getApiKey(platform: string, userCredentials: Record<string, string | undefined>): string | undefined {
  const envKeyMap: Record<string, string> = {
    googleGemini: import.meta.env.VITE_GOOGLE_GEMINI_API_KEY,
    rytrAi: import.meta.env.VITE_RYTR_API_KEY,
    zoomInfo: import.meta.env.VITE_ZOOMINFO_API_KEY,
    hunterIo: import.meta.env.VITE_HUNTERIO_API_KEY,
    mailchimp: import.meta.env.VITE_MAILCHIMP_API_KEY,
    smartlyIo: import.meta.env.VITE_SMARTLY_API_KEY,
    dynamicYield: import.meta.env.VITE_DYNAMIC_YIELD_API_KEY,
    googleAnalytics: import.meta.env.VITE_GA_MEASUREMENT_ID,
    hotjar: import.meta.env.VITE_HOTJAR_SITE_ID,
    surferSeo: import.meta.env.VITE_SURFER_SEO_API_KEY,
    intercom: import.meta.env.VITE_INTERCOM_APP_ID,
  }

  // First, check environment variables
  const envKey = envKeyMap[platform]
  if (envKey && envKey !== 'your_google_gemini_api_key_here' && envKey !== 'your_rytr_api_key_here') {
    return envKey
  }

  // Fall back to user credentials
  return userCredentials[platform]
}

/**
 * Check if an API key is available (either from env or user credentials)
 */
export function hasApiKey(platform: string, userCredentials: Record<string, string | undefined>): boolean {
  return !!getApiKey(platform, userCredentials)
}

/**
 * Check if API key is from environment variables
 */
export function isEnvKey(platform: string): boolean {
  const envKeyMap: Record<string, string> = {
    googleGemini: import.meta.env.VITE_GOOGLE_GEMINI_API_KEY,
    rytrAi: import.meta.env.VITE_RYTR_API_KEY,
    zoomInfo: import.meta.env.VITE_ZOOMINFO_API_KEY,
    hunterIo: import.meta.env.VITE_HUNTERIO_API_KEY,
    mailchimp: import.meta.env.VITE_MAILCHIMP_API_KEY,
    smartlyIo: import.meta.env.VITE_SMARTLY_API_KEY,
    dynamicYield: import.meta.env.VITE_DYNAMIC_YIELD_API_KEY,
    googleAnalytics: import.meta.env.VITE_GA_MEASUREMENT_ID,
    hotjar: import.meta.env.VITE_HOTJAR_SITE_ID,
    surferSeo: import.meta.env.VITE_SURFER_SEO_API_KEY,
    intercom: import.meta.env.VITE_INTERCOM_APP_ID,
  }

  const envKey = envKeyMap[platform]
  return !!envKey && envKey !== 'your_google_gemini_api_key_here' && envKey !== 'your_rytr_api_key_here'
}

/**
 * Get all configured platforms (from env vars or user credentials)
 */
export function getConfiguredPlatforms(userCredentials: Record<string, string | undefined>): string[] {
  const platforms = [
    'googleGemini',
    'rytrAi',
    'zoomInfo',
    'hunterIo',
    'mailchimp',
    'smartlyIo',
    'dynamicYield',
    'googleAnalytics',
    'hotjar',
    'surferSeo',
    'intercom',
  ]

  return platforms.filter(platform => hasApiKey(platform, userCredentials))
}

/**
 * Check if running in production (Vercel deployment)
 */
export function isProduction(): boolean {
  return import.meta.env.PROD && import.meta.env.MODE === 'production'
}

/**
 * Get initial API credentials from environment variables
 */
export function getInitialCredentialsFromEnv() {
  const credentials: Record<string, string> = {}

  if (import.meta.env.VITE_GOOGLE_GEMINI_API_KEY &&
      import.meta.env.VITE_GOOGLE_GEMINI_API_KEY !== 'your_google_gemini_api_key_here') {
    credentials.googleGemini = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY
  }

  if (import.meta.env.VITE_RYTR_API_KEY &&
      import.meta.env.VITE_RYTR_API_KEY !== 'your_rytr_api_key_here') {
    credentials.rytrAi = import.meta.env.VITE_RYTR_API_KEY
  }

  if (import.meta.env.VITE_ZOOMINFO_API_KEY) {
    credentials.zoomInfo = import.meta.env.VITE_ZOOMINFO_API_KEY
  }

  if (import.meta.env.VITE_HUNTERIO_API_KEY) {
    credentials.hunterIo = import.meta.env.VITE_HUNTERIO_API_KEY
  }

  if (import.meta.env.VITE_MAILCHIMP_API_KEY) {
    credentials.mailchimp = import.meta.env.VITE_MAILCHIMP_API_KEY
  }

  if (import.meta.env.VITE_SMARTLY_API_KEY) {
    credentials.smartlyIo = import.meta.env.VITE_SMARTLY_API_KEY
  }

  if (import.meta.env.VITE_DYNAMIC_YIELD_API_KEY) {
    credentials.dynamicYield = import.meta.env.VITE_DYNAMIC_YIELD_API_KEY
  }

  if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
    credentials.googleAnalytics = import.meta.env.VITE_GA_MEASUREMENT_ID
  }

  if (import.meta.env.VITE_HOTJAR_SITE_ID) {
    credentials.hotjar = import.meta.env.VITE_HOTJAR_SITE_ID
  }

  if (import.meta.env.VITE_SURFER_SEO_API_KEY) {
    credentials.surferSeo = import.meta.env.VITE_SURFER_SEO_API_KEY
  }

  if (import.meta.env.VITE_INTERCOM_APP_ID) {
    credentials.intercom = import.meta.env.VITE_INTERCOM_APP_ID
  }

  return credentials
}
