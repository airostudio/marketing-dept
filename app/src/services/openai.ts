/**
 * OpenAI Integration Service
 * Provides content generation capabilities using OpenAI's GPT models
 */

export interface OpenAIConfig {
  apiKey: string
  model?: 'gpt-4o' | 'gpt-4-turbo' | 'gpt-3.5-turbo'
  temperature?: number
  maxTokens?: number
}

export interface ContentGenerationRequest {
  prompt: string
  context?: string
  tone?: 'professional' | 'casual' | 'friendly' | 'persuasive' | 'informative'
  format?: 'blog-post' | 'social-media' | 'email' | 'ad-copy' | 'product-description'
  length?: 'short' | 'medium' | 'long'
}

export interface ContentGenerationResponse {
  content: string
  model: string
  tokensUsed: number
  cost: number
}

class OpenAIService {
  private baseUrl = 'https://api.openai.com/v1'
  private defaultModel: OpenAIConfig['model'] = 'gpt-4o'

  /**
   * Generate content using OpenAI API
   */
  async generateContent(
    request: ContentGenerationRequest,
    config: OpenAIConfig
  ): Promise<ContentGenerationResponse> {
    const systemPrompt = this.buildSystemPrompt(request)
    const userPrompt = this.buildUserPrompt(request)

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model || this.defaultModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: config.temperature || 0.7,
          max_tokens: config.maxTokens || this.getMaxTokensForLength(request.length),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content || ''
      const tokensUsed = data.usage?.total_tokens || 0
      const cost = this.calculateCost(tokensUsed, config.model || this.defaultModel)

      return {
        content,
        model: data.model,
        tokensUsed,
        cost,
      }
    } catch (error) {
      console.error('OpenAI API Error:', error)
      throw error
    }
  }

  /**
   * Verify API key is valid
   */
  async verifyApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      })
      return response.ok
    } catch (error) {
      return false
    }
  }

  /**
   * Build system prompt based on request parameters
   */
  private buildSystemPrompt(request: ContentGenerationRequest): string {
    const toneMap = {
      professional: 'professional and authoritative',
      casual: 'casual and conversational',
      friendly: 'friendly and approachable',
      persuasive: 'persuasive and compelling',
      informative: 'informative and educational',
    }

    const formatMap = {
      'blog-post': 'blog post with an engaging title, introduction, body paragraphs, and conclusion',
      'social-media': 'social media post that is concise, engaging, and includes relevant hashtags',
      'email': 'email with a clear subject line, greeting, body, and call-to-action',
      'ad-copy': 'advertisement copy that is attention-grabbing and persuasive',
      'product-description': 'product description that highlights features, benefits, and value',
    }

    const tone = request.tone ? toneMap[request.tone] : 'engaging and appropriate for the audience'
    const format = request.format ? formatMap[request.format] : 'well-structured content'

    return `You are an expert marketing content writer. Create ${tone} content formatted as a ${format}.
Focus on clarity, engagement, and achieving marketing objectives. ${request.context ? `Context: ${request.context}` : ''}`
  }

  /**
   * Build user prompt
   */
  private buildUserPrompt(request: ContentGenerationRequest): string {
    return request.prompt
  }

  /**
   * Get max tokens based on requested length
   */
  private getMaxTokensForLength(length?: ContentGenerationRequest['length']): number {
    const lengthMap = {
      short: 500,
      medium: 1500,
      long: 3000,
    }
    return length ? lengthMap[length] : lengthMap.medium
  }

  /**
   * Calculate estimated cost based on tokens and model
   */
  private calculateCost(tokens: number, model: string): number {
    const pricingPer1M = {
      'gpt-4o': 5.0, // Average of input/output
      'gpt-4-turbo': 15.0,
      'gpt-3.5-turbo': 1.0,
    }

    const price = pricingPer1M[model as keyof typeof pricingPer1M] || 5.0
    return (tokens / 1_000_000) * price
  }
}

export const openAIService = new OpenAIService()
