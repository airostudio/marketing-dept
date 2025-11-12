/**
 * API Client for secure backend proxy
 * All API calls go through our backend to keep API keys secure
 */

interface ApiResponse<T = any> {
  data?: T
  error?: string
}

/**
 * Get list of configured API services from backend
 */
export async function getConfiguredServices(): Promise<string[]> {
  try {
    const response = await fetch('/api/health')
    if (!response.ok) {
      console.error('Failed to fetch configured services')
      return []
    }
    const data = await response.json()
    return data.configured || []
  } catch (error) {
    console.error('Error fetching configured services:', error)
    return []
  }
}

/**
 * Make a proxied API request through our backend
 */
export async function proxyRequest<T = any>(
  service: string,
  body: any
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`/api/proxy?service=${service}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        error: data.error || `Request failed with status ${response.status}`,
      }
    }

    return { data }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Request failed',
    }
  }
}

/**
 * Service-specific API clients
 */

export const gemini = {
  generate: async (prompt: string, model = 'gemini-pro') => {
    return proxyRequest('googleGemini', { prompt, model })
  },
}

export const rytr = {
  generate: async (options: any) => {
    return proxyRequest('rytrAi', options)
  },
}

export const zoomInfo = {
  searchContact: async (query: any) => {
    return proxyRequest('zoomInfo', query)
  },
}

export const hunter = {
  findEmails: async (domain: string, type = 'domain-search') => {
    return proxyRequest('hunterIo', { domain, type })
  },
  discoverCompanies: async (query: string) => {
    return proxyRequest('hunterIo', { query, type: 'discover' })
  },
  enrichCompany: async (domain: string) => {
    return proxyRequest('hunterIo', { domain, type: 'company-enrichment' })
  },
}

export const mailchimp = {
  request: async (endpoint: string, method = 'GET', data?: any) => {
    return proxyRequest('mailchimp', { endpoint, method, data })
  },
}

export const smartly = {
  createCampaign: async (campaign: any) => {
    return proxyRequest('smartlyIo', campaign)
  },
}

export const dynamicYield = {
  serve: async (options: any) => {
    return proxyRequest('dynamicYield', options)
  },
}

export const analytics = {
  runReport: async (propertyId: string, metrics: any[], dimensions: any[], dateRanges: any[]) => {
    return proxyRequest('googleAnalytics', { propertyId, metrics, dimensions, dateRanges })
  },
}

export const hotjar = {
  getSiteData: async (siteId: string, endpoint: string) => {
    return proxyRequest('hotjar', { siteId, endpoint })
  },
}

export const surfer = {
  analyze: async (content: any) => {
    return proxyRequest('surferSeo', content)
  },
}

export const intercom = {
  request: async (endpoint: string, method = 'GET', data?: any) => {
    return proxyRequest('intercom', { endpoint, method, data })
  },
}
