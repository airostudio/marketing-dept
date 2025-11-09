/**
 * Lead Generation Service
 * Routes lead prospecting tasks to Zoey (ZoomInfo)
 * - Zoey: Contact search, lead enrichment, B2B prospecting
 */

import { zoomInfo } from '../utils/apiClient'

export interface LeadSearchRequest {
  companyName?: string
  jobTitle?: string
  location?: string
  industry?: string
  companySize?: string
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
}

/**
 * Search for leads using Zoey (ZoomInfo)
 */
export async function searchLeads(
  request: LeadSearchRequest
): Promise<LeadResult | { error: string }> {
  try {
    // Build ZoomInfo query
    const query = buildZoomInfoQuery(request)

    const result = await zoomInfo.searchContact(query)

    if (result.error) {
      return { error: result.error }
    }

    // Extract leads from ZoomInfo response
    const leads = extractLeadsFromResponse(result.data)

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
 * Build ZoomInfo API query from request
 */
function buildZoomInfoQuery(request: LeadSearchRequest): any {
  const query: any = {
    outputFields: [
      'id',
      'firstName',
      'lastName',
      'jobTitle',
      'companyName',
      'email',
      'phone',
      'city',
      'state',
      'country',
      'linkedInUrl',
    ],
    page: 1,
    rpp: request.limit || 25, // Results per page
  }

  // Add filters based on request
  const matchCriteria: any[] = []

  if (request.companyName) {
    matchCriteria.push({
      field: 'company',
      values: [request.companyName],
    })
  }

  if (request.jobTitle) {
    matchCriteria.push({
      field: 'jobTitle',
      values: [request.jobTitle],
    })
  }

  if (request.location) {
    matchCriteria.push({
      field: 'location',
      values: [request.location],
    })
  }

  if (request.industry) {
    matchCriteria.push({
      field: 'companyIndustry',
      values: [request.industry],
    })
  }

  if (request.companySize) {
    matchCriteria.push({
      field: 'companyEmployeeCount',
      values: [request.companySize],
    })
  }

  if (matchCriteria.length > 0) {
    query.matchCriteria = matchCriteria
  }

  return query
}

/**
 * Extract lead information from ZoomInfo response
 */
function extractLeadsFromResponse(response: any): Lead[] {
  try {
    // ZoomInfo response structure: { data: [{ ...contact fields }] }
    if (response?.data && Array.isArray(response.data)) {
      return response.data.map((contact: any) => ({
        firstName: contact.firstName || contact.first_name,
        lastName: contact.lastName || contact.last_name,
        title: contact.jobTitle || contact.job_title || contact.title,
        company: contact.companyName || contact.company_name || contact.company,
        email: contact.email || contact.emailAddress,
        phone: contact.phone || contact.directPhoneNumber,
        location: formatLocation(contact),
        linkedInUrl: contact.linkedInUrl || contact.linkedin_url,
      }))
    }

    // Fallback if data is in different structure
    if (Array.isArray(response)) {
      return response.map((contact: any) => ({
        firstName: contact.firstName || contact.first_name,
        lastName: contact.lastName || contact.last_name,
        title: contact.jobTitle || contact.job_title || contact.title,
        company: contact.companyName || contact.company_name || contact.company,
        email: contact.email || contact.emailAddress,
        phone: contact.phone || contact.directPhoneNumber,
        location: formatLocation(contact),
        linkedInUrl: contact.linkedInUrl || contact.linkedin_url,
      }))
    }

    return []
  } catch (error) {
    console.error('Error extracting leads from ZoomInfo response:', error)
    return []
  }
}

/**
 * Format location from various contact fields
 */
function formatLocation(contact: any): string {
  const parts = []

  if (contact.city) parts.push(contact.city)
  if (contact.state) parts.push(contact.state)
  if (contact.country) parts.push(contact.country)

  return parts.join(', ')
}

/**
 * Request lead prospecting from Zoey
 * This allows other agents to request Zoey's help for lead generation
 */
export async function requestLeadsFromZoey(
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
  const titleKeywords = ['ceo', 'cto', 'cfo', 'vp', 'director', 'manager', 'engineer', 'developer', 'designer', 'marketing', 'sales']
  for (const keyword of titleKeywords) {
    if (combined.includes(keyword)) {
      request.jobTitle = keyword
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
