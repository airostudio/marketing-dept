import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Secure backend proxy for API requests
 * Keeps API keys server-side and proxies requests to external services
 */

interface ApiConfig {
  name: string
  keyEnvVar: string
  baseUrl?: string
  handler: (apiKey: string, body: any) => Promise<any>
}

// Configuration for each API service
const API_CONFIGS: Record<string, ApiConfig> = {
  googleGemini: {
    name: 'Google Gemini',
    keyEnvVar: 'GOOGLE_GEMINI_API_KEY',
    handler: async (apiKey: string, body: any) => {
      const { prompt, model = 'gemini-pro' } = body

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`)
      }

      return await response.json()
    },
  },

  rytrAi: {
    name: 'Rytr AI',
    keyEnvVar: 'RYTR_API_KEY',
    handler: async (apiKey: string, body: any) => {
      const response = await fetch('https://api.rytr.me/v1/ryte', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`Rytr API error: ${response.statusText}`)
      }

      return await response.json()
    },
  },

  zoomInfo: {
    name: 'ZoomInfo',
    keyEnvVar: 'ZOOMINFO_API_KEY',
    handler: async (apiKey: string, body: any) => {
      const response = await fetch('https://api.zoominfo.com/search/contact', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`ZoomInfo API error: ${response.statusText}`)
      }

      return await response.json()
    },
  },

  hunterIo: {
    name: 'Hunter.io',
    keyEnvVar: 'HUNTER_IO_API_KEY',
    handler: async (apiKey: string, body: any) => {
      const { domain, type = 'domain-search' } = body
      const url = `https://api.hunter.io/v2/${type}?domain=${domain}&api_key=${apiKey}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Hunter.io API error: ${response.statusText}`)
      }

      return await response.json()
    },
  },

  mailchimp: {
    name: 'Mailchimp',
    keyEnvVar: 'MAILCHIMP_API_KEY',
    handler: async (apiKey: string, body: any) => {
      // Extract datacenter from API key (last part after the dash)
      const dc = apiKey.split('-').pop()
      const { endpoint, method = 'GET', data } = body

      const response = await fetch(`https://${dc}.api.mailchimp.com/3.0/${endpoint}`, {
        method,
        headers: {
          'Authorization': `apikey ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      })

      if (!response.ok) {
        throw new Error(`Mailchimp API error: ${response.statusText}`)
      }

      return await response.json()
    },
  },

  smartlyIo: {
    name: 'Smartly.io',
    keyEnvVar: 'SMARTLY_IO_API_KEY',
    handler: async (apiKey: string, body: any) => {
      const response = await fetch('https://api.smartly.io/v1/campaigns', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`Smartly.io API error: ${response.statusText}`)
      }

      return await response.json()
    },
  },

  dynamicYield: {
    name: 'Dynamic Yield',
    keyEnvVar: 'DYNAMIC_YIELD_API_KEY',
    handler: async (apiKey: string, body: any) => {
      const response = await fetch('https://api.dynamicyield.com/v2/serve', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`Dynamic Yield API error: ${response.statusText}`)
      }

      return await response.json()
    },
  },

  googleAnalytics: {
    name: 'Google Analytics',
    keyEnvVar: 'GOOGLE_ANALYTICS_API_KEY',
    handler: async (apiKey: string, body: any) => {
      const { propertyId, metrics, dimensions, dateRanges } = body

      const response = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            metrics,
            dimensions,
            dateRanges,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Google Analytics API error: ${response.statusText}`)
      }

      return await response.json()
    },
  },

  hotjar: {
    name: 'Hotjar',
    keyEnvVar: 'HOTJAR_API_KEY',
    handler: async (apiKey: string, body: any) => {
      const { siteId, endpoint } = body

      const response = await fetch(`https://api.hotjar.com/v1/sites/${siteId}/${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Hotjar API error: ${response.statusText}`)
      }

      return await response.json()
    },
  },

  surferSeo: {
    name: 'Surfer SEO',
    keyEnvVar: 'SURFER_SEO_API_KEY',
    handler: async (apiKey: string, body: any) => {
      const response = await fetch('https://api.surferseo.com/v1/content-editor', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`Surfer SEO API error: ${response.statusText}`)
      }

      return await response.json()
    },
  },

  intercom: {
    name: 'Intercom',
    keyEnvVar: 'INTERCOM_API_KEY',
    handler: async (apiKey: string, body: any) => {
      const { endpoint, method = 'GET', data } = body

      const response = await fetch(`https://api.intercom.io/${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      })

      if (!response.ok) {
        throw new Error(`Intercom API error: ${response.statusText}`)
      }

      return await response.json()
    },
  },
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Get service from query parameter
  const { service } = req.query

  if (!service || typeof service !== 'string') {
    return res.status(400).json({ error: 'Service parameter is required' })
  }

  // Check if service is supported
  const config = API_CONFIGS[service]
  if (!config) {
    return res.status(404).json({
      error: 'Service not found',
      available: Object.keys(API_CONFIGS),
    })
  }

  // Get API key from environment (server-side only)
  // In Vercel production: process.env comes from Vercel Dashboard Environment Variables ONLY
  // In local development: process.env comes from .env file (gitignored, never deployed)
  // .env files are NEVER deployed to Vercel - they are in .gitignore
  const apiKey = process.env[config.keyEnvVar]

  if (!apiKey || apiKey.length === 0) {
    return res.status(503).json({
      error: `${config.name} is not configured`,
      service,
    })
  }

  try {
    // Call the service-specific handler
    const result = await config.handler(apiKey, req.body)
    return res.status(200).json(result)
  } catch (error) {
    console.error(`Proxy error for ${service}:`, error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Proxy request failed',
      service,
    })
  }
}
