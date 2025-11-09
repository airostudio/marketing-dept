/**
 * Content Creation Service
 * Routes all content creation tasks to Jasper (Google Gemini)
 */

import { gemini } from '../utils/apiClient'

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
