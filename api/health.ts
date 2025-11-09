import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Health check endpoint that returns which API services are configured
 * This endpoint is safe to call from the client as it doesn't expose any keys
 *
 * Environment variable sources:
 * - Vercel production: process.env populated from Vercel Dashboard ONLY
 * - Local development: process.env populated from .env file (gitignored)
 * - .env files are NEVER deployed to Vercel
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Check which API keys are configured (server-side only)
  const configuredServices: string[] = []

  const apiKeys = {
    googleGemini: process.env.GOOGLE_GEMINI_API_KEY,
    rytrAi: process.env.RYTR_API_KEY,
    zoomInfo: process.env.ZOOMINFO_API_KEY,
    hunterIo: process.env.HUNTER_IO_API_KEY,
    mailchimp: process.env.MAILCHIMP_API_KEY,
    smartlyIo: process.env.SMARTLY_IO_API_KEY,
    dynamicYield: process.env.DYNAMIC_YIELD_API_KEY,
    googleAnalytics: process.env.GOOGLE_ANALYTICS_API_KEY,
    hotjar: process.env.HOTJAR_API_KEY,
    surferSeo: process.env.SURFER_SEO_API_KEY,
    intercom: process.env.INTERCOM_API_KEY,
  }

  // Check which keys are configured (not empty and not placeholder)
  Object.entries(apiKeys).forEach(([service, key]) => {
    if (key && key.length > 0 && !key.includes('your_') && !key.includes('_here')) {
      configuredServices.push(service)
    }
  })

  return res.status(200).json({
    configured: configuredServices,
    timestamp: new Date().toISOString(),
  })
}
