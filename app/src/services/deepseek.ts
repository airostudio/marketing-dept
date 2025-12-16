// DeepSeek AI Integration Service
// Provides AI capabilities using DeepSeek models (OpenAI-compatible API)

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekRequest {
  model?: string;
  messages: DeepSeekMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface DeepSeekResponse {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class DeepSeekService {
  private apiKey: string | null = null;
  private baseURL = 'https://api.deepseek.com/v1';
  private defaultModel = 'deepseek-chat'; // DeepSeek's latest chat model

  /**
   * Initialize the DeepSeek service with API key
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
   * Send a chat completion request to DeepSeek
   */
  async chat(request: DeepSeekRequest): Promise<DeepSeekResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'DeepSeek API key not configured. Please add your API key in Settings.',
      };
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: request.model || this.defaultModel,
          messages: request.messages,
          temperature: request.temperature ?? 0.7,
          max_tokens: request.max_tokens ?? 2048,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error?.message || `DeepSeek API error: ${response.status}`,
        };
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        return {
          success: false,
          error: 'No response from DeepSeek',
        };
      }

      return {
        success: true,
        content,
        usage: data.usage,
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
  ): Promise<DeepSeekResponse> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
    ];

    // Add context if provided
    if (context && Object.keys(context).length > 0) {
      messages.push({
        role: 'user',
        content: `Context from previous steps:\n${JSON.stringify(context, null, 2)}`,
      });
    }

    // Add the main task
    messages.push({
      role: 'user',
      content: userTask,
    });

    return this.chat({ messages });
  }
}

// Export singleton instance
export const deepseekService = new DeepSeekService();
