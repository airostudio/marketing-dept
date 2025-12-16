// OpenAI ChatGPT Integration Service
// Provides real AI capabilities to all marketing and sales agents

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface ChatCompletionResponse {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class OpenAIService {
  private apiKey: string | null = null;
  private baseURL = 'https://api.openai.com/v1';
  private defaultModel = 'gpt-4o'; // Latest model as of 2025

  /**
   * Initialize the OpenAI service with API key
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
   * Send a chat completion request to OpenAI
   */
  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'OpenAI API key not configured. Please add your API key in Settings.',
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
          max_tokens: request.max_tokens ?? 2000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error?.message || `OpenAI API error: ${response.status}`,
        };
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        return {
          success: false,
          error: 'No response from OpenAI',
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
  ): Promise<ChatCompletionResponse> {
    const messages: ChatMessage[] = [
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
export const openAIService = new OpenAIService();
