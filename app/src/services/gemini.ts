// Google Gemini AI Integration Service
// Provides AI capabilities using Google's Gemini models

interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface GeminiRequest {
  contents: GeminiMessage[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    topK?: number;
  };
  systemInstruction?: {
    parts: { text: string }[];
  };
}

interface GeminiResponse {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

class GeminiService {
  private apiKey: string | null = null;
  private baseURL = 'https://generativelanguage.googleapis.com/v1beta';
  private defaultModel = 'gemini-2.0-flash-exp'; // Latest Gemini model

  /**
   * Initialize the Gemini service with API key
   */
  initialize(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Generate content using Gemini
   */
  async generate(request: GeminiRequest): Promise<GeminiResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'Google Gemini API key not configured. Please add your API key in Settings.',
      };
    }

    try {
      const url = `${this.baseURL}/models/${this.defaultModel}:generateContent?key=${this.apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error?.message || `Gemini API error: ${response.status}`,
        };
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!content) {
        return {
          success: false,
          error: 'No response from Gemini',
        };
      }

      return {
        success: true,
        content,
        usage: data.usageMetadata,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Execute an agent task with specific expertise
   */
  async executeAgentTask(
    _agentName: string,
    systemPrompt: string,
    userTask: string,
    context?: Record<string, any>
  ): Promise<GeminiResponse> {
    const contents: GeminiMessage[] = [];

    // Add context if provided
    if (context && Object.keys(context).length > 0) {
      contents.push({
        role: 'user',
        parts: [{ text: `Context from previous steps:\n${JSON.stringify(context, null, 2)}` }],
      });
      contents.push({
        role: 'model',
        parts: [{ text: 'I understand the context. I will use this information to complete the task.' }],
      });
    }

    // Add the main task
    contents.push({
      role: 'user',
      parts: [{ text: userTask }],
    });

    return this.generate({
      contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.95,
        topK: 40,
      },
    });
  }
}

// Export singleton instance
export const geminiService = new GeminiService();

/**
 * Convenience function for simple Gemini API calls
 */
export async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await geminiService.generate({
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }]
      }
    ],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048
    }
  });

  if (!response.success || !response.content) {
    throw new Error(response.error || 'Gemini API call failed');
  }

  return response.content;
}
