/**
 * Lead Generation Service
 * Routes lead prospecting tasks to Hunter (Hunter.io)
 * - Hunter: Company search, lead enrichment, email finding
 */

import { hunter } from '../utils/apiClient'

export interface LeadSearchRequest {
  companyName?: string
  industry?: string
  location?: string
  domain?: string
  keywords?: string[]
  limit?: number
}

export interface LeadResult {
  leads: Lead[]
  totalFound: number
  generatedAt: string
}

export interface Lead {
  firstName?: string
  lastName?: string
  title?: string
  company?: string
  email?: string
  phone?: string
  location?: string
  linkedInUrl?: string
  domain?: string
}

/**
 * Search for leads using Hunter (Hunter.io)
 */
export async function searchLeads(
  request: LeadSearchRequest
): Promise<LeadResult | { error: string }> {
  try {
    // If domain is provided, use Domain Search
    if (request.domain) {
      const result = await hunter.findEmails(request.domain, 'domain-search')

      if (result.error) {
        return { error: result.error }
      }

      const leads = extractLeadsFromDomainSearch(result.data)

      return {
        leads,
        totalFound: leads.length,
        generatedAt: new Date().toISOString(),
      }
    }

    // Otherwise, use company discovery
    // Build search query from request
    const query = buildSearchQuery(request)

    // Use Hunter.io Discover API for company search (free)
    const result = await hunter.discoverCompanies(query)

    if (result.error) {
      return { error: result.error }
    }

    const leads = extractLeadsFromDiscovery(result.data)

    return {
      leads,
      totalFound: leads.length,
      generatedAt: new Date().toISOString(),
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Lead search failed',
    }
  }
}

/**
 * Build search query from request parameters
 */
function buildSearchQuery(request: LeadSearchRequest): string {
  const parts: string[] = []

  if (request.companyName) parts.push(request.companyName)
  if (request.industry) parts.push(request.industry)
  if (request.location) parts.push(request.location)
  if (request.keywords) parts.push(...request.keywords)

  return parts.join(' ')
}

/**
 * Extract lead information from Hunter.io Domain Search response
 */
function extractLeadsFromDomainSearch(response: any): Lead[] {
  try {
    if (response?.data?.emails && Array.isArray(response.data.emails)) {
      return response.data.emails.map((email: any) => ({
        firstName: email.first_name,
        lastName: email.last_name,
        title: email.position,
        company: response.data.domain || email.company,
        email: email.value,
        phone: email.phone_number,
        location: '',
        linkedInUrl: email.linkedin,
        domain: response.data.domain,
      }))
    }

    return []
  } catch (error) {
    console.error('Error extracting leads from Hunter Domain Search:', error)
    return []
  }
}

/**
 * Extract lead information from Hunter.io Discover response
 */
function extractLeadsFromDiscovery(response: any): Lead[] {
  try {
    // Hunter.io Discover API returns companies, not individual contacts
    // We'll create leads based on company information
    if (response?.data?.companies && Array.isArray(response.data.companies)) {
      return response.data.companies.map((company: any) => ({
        firstName: '',
        lastName: '',
        title: '',
        company: company.name || company.domain,
        email: '',
        phone: company.phone,
        location: formatCompanyLocation(company),
        linkedInUrl: company.linkedin,
        domain: company.domain,
      }))
    }

    return []
  } catch (error) {
    console.error('Error extracting leads from Hunter Discover:', error)
    return []
  }
}

/**
 * Format company location from various fields
 */
function formatCompanyLocation(company: any): string {
  const parts = []

  if (company.city) parts.push(company.city)
  if (company.state) parts.push(company.state)
  if (company.country) parts.push(company.country)

  return parts.join(', ')
}

/**
 * Request lead prospecting from Hunter
 * This allows other agents to request Hunter's help for lead generation
 */
export async function requestLeadsFromHunter(
  requestingAgent: string,
  searchCriteria: LeadSearchRequest
): Promise<LeadResult | { error: string }> {
  console.log(`Lead search requested by ${requestingAgent}`)

  const result = await searchLeads(searchCriteria)

  if ('error' in result) {
    return result
  }

  return {
    ...result,
    // Could add metadata about who requested
  }
}

/**
 * Parse task description to extract lead search criteria
 */
export function parseLeadSearchFromTask(
  title: string,
  description: string
): LeadSearchRequest {
  const combined = `${title} ${description}`.toLowerCase()

  const request: LeadSearchRequest = {}

  // Extract company name
  const companyMatch = combined.match(/(?:at|from|in)\s+([A-Z][a-zA-Z\s&]+?)(?:\s|$|,)/i)
  if (companyMatch) {
    request.companyName = companyMatch[1].trim()
  }

  // Extract job title
  const titleKeywords = ['ceo', 'cto', 'cfo', 'vp', 'director', 'manager', 'engineer', 'developer', 'designer', 'marketing', 'sales', 'founder', 'head']
  for (const keyword of titleKeywords) {
    if (combined.includes(keyword)) {
      // Title is less relevant for Hunter.io company search
      break
    }
  }

  // Extract location
  const locationMatch = combined.match(/(?:in|from|located in)\s+([A-Z][a-zA-Z\s]+?)(?:\s|$|,)/i)
  if (locationMatch) {
    request.location = locationMatch[1].trim()
  }

  // Extract industry
  const industries = ['tech', 'healthcare', 'finance', 'retail', 'saas', 'b2b', 'b2c', 'enterprise']
  for (const industry of industries) {
    if (combined.includes(industry)) {
      request.industry = industry
      break
    }
  }

  // Default limit
  request.limit = 25

  return request
}
