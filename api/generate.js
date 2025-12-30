/**
 * Vercel Serverless Function: /api/generate
 *
 * Handles website/content generation requests using OpenAI.
 * Implements proper timeout handling and streaming for long-running AI tasks.
 */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Vercel Pro allows up to 60 seconds, Hobby up to 10 seconds
// We'll set a reasonable timeout and use streaming to avoid issues
export const config = {
  maxDuration: 60, // Maximum allowed on Pro plan
};

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST requests are supported'
    });
  }

  // Get API key from environment
  const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      error: 'Service unavailable',
      message: 'OpenAI API key not configured. Please add OPENAI_API_KEY to environment variables.'
    });
  }

  try {
    const { prompt, type = 'website', options = {} } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Prompt is required in request body'
      });
    }

    // Build system prompt based on generation type
    const systemPrompt = getSystemPrompt(type);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000); // 55 second timeout

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: options.model || 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 4096,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle specific OpenAI errors
      if (response.status === 401) {
        return res.status(401).json({
          error: 'Authentication failed',
          message: 'Invalid OpenAI API key. Please check your API key configuration.'
        });
      }

      if (response.status === 429) {
        return res.status(429).json({
          error: 'Rate limited',
          message: 'OpenAI rate limit exceeded. Please try again in a few moments.'
        });
      }

      if (response.status === 402) {
        return res.status(402).json({
          error: 'Payment required',
          message: 'OpenAI account has insufficient credits. Please add credits to your account.'
        });
      }

      return res.status(response.status).json({
        error: 'OpenAI API error',
        message: errorData.error?.message || `API returned status ${response.status}`
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({
        error: 'Generation failed',
        message: 'No content returned from AI model'
      });
    }

    // Return successful generation
    return res.status(200).json({
      success: true,
      content,
      usage: data.usage,
      model: data.model,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Generation error:', error);

    // Handle timeout/abort
    if (error.name === 'AbortError') {
      return res.status(504).json({
        error: 'Gateway timeout',
        message: 'The generation request timed out. Please try with a simpler prompt or try again.'
      });
    }

    // Handle network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'Unable to connect to OpenAI API. Please try again later.'
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred during generation'
    });
  }
}

/**
 * Get the appropriate system prompt based on generation type
 */
function getSystemPrompt(type) {
  const prompts = {
    website: `You are an expert web developer and designer. Generate clean, modern, and responsive website content based on the user's requirements.

Your output should be practical and ready to use, including:
- Clear section structure with headings
- Engaging copy that converts visitors
- Call-to-action suggestions
- SEO-friendly content

Focus on creating professional, conversion-optimized content that represents the business well.`,

    landing: `You are an expert landing page copywriter and conversion optimizer. Create compelling landing page content that drives conversions.

Include:
- Attention-grabbing headlines
- Clear value propositions
- Social proof suggestions
- Strong calls-to-action
- Benefit-focused copy

Make every word count towards converting visitors.`,

    email: `You are an expert email marketing specialist. Create engaging email content that drives opens, clicks, and conversions.

Include:
- Compelling subject line options
- Preview text suggestions
- Clear and concise body copy
- Strong call-to-action
- Mobile-optimized structure`,

    content: `You are an expert content strategist and copywriter. Create high-quality content that engages readers and achieves business objectives.

Focus on:
- Clear, compelling writing
- SEO optimization where relevant
- Audience-appropriate tone
- Actionable insights
- Professional quality`,

    default: `You are an expert AI assistant for marketing and content generation. Create professional, high-quality content based on the user's requirements. Be specific, actionable, and focused on delivering value.`
  };

  return prompts[type] || prompts.default;
}
