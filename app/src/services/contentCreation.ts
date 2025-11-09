/**
 * Content Creation Service
 * Routes content creation tasks to Jasper (Google Gemini) or Casey (Rytr AI)
 * - Jasper: General content, blogs, long-form
 * - Casey: Copywriting, ads, social media, short-form
 */

import { gemini, rytr } from '../utils/apiClient'

export interface ContentRequest {
  type: 'blog_post' | 'social_media' | 'email' | 'ad_copy' | 'seo_content' | 'product_description' | 'general'
  topic: string
  keywords?: string[]
  tone?: 'professional' | 'casual' | 'friendly' | 'persuasive' | 'informative'
  length?: 'short' | 'medium' | 'long'
  additionalInstructions?: string
}

export interface ContentResult {
  content: string
  wordCount: number
  generatedAt: string
}

/**
 * Generate content using Jasper (Google Gemini)
 */
export async function generateContent(request: ContentRequest): Promise<ContentResult | { error: string }> {
  const prompt = buildPrompt(request)

  try {
    const result = await gemini.generate(prompt, 'gemini-pro')

    if (result.error) {
      return { error: result.error }
    }

    // Extract text from Gemini response
    const content = extractTextFromGeminiResponse(result.data)
    const wordCount = content.split(/\s+/).length

    return {
      content,
      wordCount,
      generatedAt: new Date().toISOString(),
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Content generation failed',
    }
  }
}

/**
 * Build a detailed prompt based on content request
 */
function buildPrompt(request: ContentRequest): string {
  const toneDescriptions = {
    professional: 'professional and authoritative',
    casual: 'casual and conversational',
    friendly: 'friendly and approachable',
    persuasive: 'persuasive and compelling',
    informative: 'informative and educational',
  }

  const lengthDescriptions = {
    short: '150-300 words',
    medium: '500-800 words',
    long: '1200-2000 words',
  }

  let prompt = `You are Jasper, an expert content creator powered by Google Gemini.\n\n`

  // Content type specific instructions
  switch (request.type) {
    case 'blog_post':
      prompt += `Write a well-structured blog post about "${request.topic}".\n`
      prompt += `Include an engaging introduction, informative body sections with headers, and a strong conclusion.\n`
      break
    case 'social_media':
      prompt += `Create engaging social media content about "${request.topic}".\n`
      prompt += `Make it attention-grabbing, shareable, and optimized for social engagement.\n`
      break
    case 'email':
      prompt += `Write a professional email about "${request.topic}".\n`
      prompt += `Include a compelling subject line, clear body, and strong call-to-action.\n`
      break
    case 'ad_copy':
      prompt += `Create persuasive advertising copy for "${request.topic}".\n`
      prompt += `Focus on benefits, create urgency, and include a clear call-to-action.\n`
      break
    case 'seo_content':
      prompt += `Write SEO-optimized content about "${request.topic}".\n`
      prompt += `Include relevant keywords naturally, use proper headers, and ensure readability.\n`
      break
    case 'product_description':
      prompt += `Write an engaging product description for "${request.topic}".\n`
      prompt += `Highlight key features, benefits, and unique selling points.\n`
      break
    default:
      prompt += `Create high-quality content about "${request.topic}".\n`
  }

  // Add tone
  if (request.tone) {
    prompt += `Tone: ${toneDescriptions[request.tone]}\n`
  }

  // Add length
  if (request.length) {
    prompt += `Target length: ${lengthDescriptions[request.length]}\n`
  }

  // Add keywords
  if (request.keywords && request.keywords.length > 0) {
    prompt += `Keywords to include: ${request.keywords.join(', ')}\n`
  }

  // Add additional instructions
  if (request.additionalInstructions) {
    prompt += `\nAdditional instructions: ${request.additionalInstructions}\n`
  }

  prompt += `\nGenerate the content now:`

  return prompt
}

/**
 * Extract text content from Gemini API response
 */
function extractTextFromGeminiResponse(response: any): string {
  // Gemini response structure: { candidates: [{ content: { parts: [{ text: "..." }] } }] }
  try {
    if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.candidates[0].content.parts[0].text
    }

    // Fallback: try to stringify if structure is different
    if (typeof response === 'string') {
      return response
    }

    return JSON.stringify(response, null, 2)
  } catch (error) {
    console.error('Error extracting text from Gemini response:', error)
    return 'Error: Could not extract content from response'
  }
}

/**
 * Request content creation from another agent's perspective
 * This allows other agents to request Jasper's help
 */
export async function requestContentFromJasper(
  requestingAgent: string,
  contentType: ContentRequest['type'],
  topic: string,
  additionalContext?: Partial<ContentRequest>
): Promise<ContentResult | { error: string }> {
  const request: ContentRequest = {
    type: contentType,
    topic,
    ...additionalContext,
    additionalInstructions: `${additionalContext?.additionalInstructions || ''}\n\nNote: This content was requested by ${requestingAgent}.`,
  }

  return generateContent(request)
}

/**
 * ==========================================
 * CASEY - RYTR AI COPYWRITING
 * ==========================================
 */

// Rytr Use-Case IDs from https://api.rytr.me/v1/use-cases
const RYTR_USE_CASES = {
  blog_post: '61090c3db4b68c3f06cd8c4e', // Blog Idea & Outline
  social_media: '61090c4bb4b68c3f06cd8ccd', // Social Media Ads
  email: '61090c48b4b68c3f06cd8ca6', // Email
  ad_copy: '61090c46b4b68c3f06cd8c7f', // Facebook, Google & LinkedIn Ad copy
  product_description: '61090c45b4b68c3f06cd8c73', // Product Description
  seo_content: '61090c4db4b68c3f06cd8ce7', // SEO Meta Description
  general: '61090c44b4b68c3f06cd8c66', // Paragraph
}

// Rytr Tone IDs
const RYTR_TONES = {
  professional: '619cccda8b25e900a72067f5',
  casual: '619cccda8b25e900a72067f9',
  friendly: '619cccda8b25e900a72067f7',
  persuasive: '619cccda8b25e900a72067f4',
  informative: '619cccda8b25e900a72067fb',
}

/**
 * Generate copywriting content using Casey (Rytr AI)
 * Optimized for short-form, high-converting copy
 */
export async function generateCopywriting(request: ContentRequest): Promise<ContentResult | { error: string }> {
  try {
    // Map content type to Rytr use-case
    const useCaseId = RYTR_USE_CASES[request.type] || RYTR_USE_CASES.general
    const toneId = request.tone ? RYTR_TONES[request.tone] : RYTR_TONES.professional

    // Build input context for Rytr
    const inputContexts: any = {}

    // Different use-cases require different input fields
    switch (request.type) {
      case 'blog_post':
        inputContexts.SECTION_TOPIC_LABEL = request.topic
        inputContexts.SECTION_KEYWORDS_LABEL = request.keywords?.join(', ') || ''
        break
      case 'product_description':
        inputContexts.PRODUCT_NAME_LABEL = request.topic
        inputContexts.PRODUCT_DESCRIPTION_LABEL = request.additionalInstructions || request.topic
        break
      case 'email':
        inputContexts.EMAIL_CONTEXT_LABEL = request.topic
        inputContexts.KEY_POINTS_LABEL = request.additionalInstructions || ''
        break
      case 'ad_copy':
        inputContexts.PRODUCT_NAME_LABEL = request.topic
        inputContexts.PRODUCT_DESCRIPTION_LABEL = request.additionalInstructions || request.topic
        break
      case 'seo_content':
        inputContexts.PRIMARY_KEYWORD_LABEL = request.keywords?.[0] || request.topic
        inputContexts.SECONDARY_KEYWORDS_LABEL = request.keywords?.slice(1).join(', ') || ''
        break
      default:
        inputContexts.PARAGRAPH_TOPIC_LABEL = request.topic
        inputContexts.PARAGRAPH_KEYWORDS_LABEL = request.keywords?.join(', ') || ''
    }

    // Creativity mapping
    const creativityLevels: Record<string, string> = {
      short: 'low',
      medium: 'medium',
      long: 'high',
    }

    const rytrRequest = {
      languageId: '6009a88c1de88e7e8ccf4050', // English
      toneId,
      useCaseId,
      inputContexts,
      variations: 1, // Generate 1 variation
      userId: 'marketing-dept-user',
      format: 'text',
      creativityLevel: request.length ? creativityLevels[request.length] : 'medium',
    }

    const result = await rytr.generate(rytrRequest)

    if (result.error) {
      return { error: result.error }
    }

    // Extract content from Rytr response
    const content = extractTextFromRytrResponse(result.data)
    const wordCount = content.split(/\s+/).length

    return {
      content,
      wordCount,
      generatedAt: new Date().toISOString(),
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Copywriting generation failed',
    }
  }
}

/**
 * Extract text content from Rytr API response
 */
function extractTextFromRytrResponse(response: any): string {
  try {
    // Rytr returns: { data: [{ text: "..." }] } or { data: { text: "..." } }
    if (response?.data) {
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0].text || response.data[0]
      }
      if (response.data.text) {
        return response.data.text
      }
      if (typeof response.data === 'string') {
        return response.data
      }
    }

    // Fallback
    if (typeof response === 'string') {
      return response
    }

    return JSON.stringify(response, null, 2)
  } catch (error) {
    console.error('Error extracting text from Rytr response:', error)
    return 'Error: Could not extract copywriting from response'
  }
}

/**
 * Request copywriting from Casey
 * This allows other agents to request Casey's help for copywriting tasks
 */
export async function requestCopywritingFromCasey(
  requestingAgent: string,
  contentType: ContentRequest['type'],
  topic: string,
  additionalContext?: Partial<ContentRequest>
): Promise<ContentResult | { error: string }> {
  const request: ContentRequest = {
    type: contentType,
    topic,
    ...additionalContext,
    additionalInstructions: `${additionalContext?.additionalInstructions || ''}\n\nRequested by ${requestingAgent}`,
  }

  return generateCopywriting(request)
}
