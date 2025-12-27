// OpenAI (ChatGPT) AI Integration Service
// Provides AI capabilities using OpenAI's GPT models

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIRequest {
  model?: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

interface OpenAIResponse {
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
  private defaultModel = 'gpt-4-turbo-preview'; // Latest GPT-4 Turbo

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
   * Get the API key (for internal use)
   */
  getApiKey(): string | null {
    return this.apiKey;
  }

  /**
   * Set the model to use
   */
  setModel(model: string): void {
    this.defaultModel = model;
  }

  /**
   * Send a chat completion request to OpenAI
   */
  async chat(request: OpenAIRequest): Promise<OpenAIResponse> {
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
          max_tokens: request.max_tokens ?? 4096,
          top_p: request.top_p ?? 0.95,
          frequency_penalty: request.frequency_penalty ?? 0,
          presence_penalty: request.presence_penalty ?? 0,
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
  ): Promise<OpenAIResponse> {
    const messages: OpenAIMessage[] = [
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
      messages.push({
        role: 'assistant',
        content: 'I understand the context. I will use this information to complete the task.',
      });
    }

    // Add the main task
    messages.push({
      role: 'user',
      content: userTask,
    });

    return this.chat({ messages });
  }

  /**
   * Generate agent questions before starting a task
   */
  async generateClarifyingQuestions(
    _agentName: string,
    _agentRole: string,
    taskDescription: string,
    systemPrompt: string
  ): Promise<{ success: boolean; questions?: string[]; error?: string }> {
    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: `${systemPrompt}

IMPORTANT: Before starting any task, you MUST ask 3-5 clarifying questions to ensure you fully understand the requirements and can deliver exceptional results. Your questions should demonstrate your deep expertise and help uncover hidden requirements or opportunities.`,
      },
      {
        role: 'user',
        content: `I need you to help with the following task:

"${taskDescription}"

Before you begin, please provide 3-5 clarifying questions that will help you deliver the best possible results. Format your response as a JSON array of question strings.

Example format:
["Question 1?", "Question 2?", "Question 3?"]`,
      },
    ];

    const response = await this.chat({ messages, temperature: 0.7 });

    if (!response.success || !response.content) {
      return { success: false, error: response.error };
    }

    try {
      // Extract JSON array from response
      const jsonMatch = response.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0]);
        return { success: true, questions };
      }
      return { success: false, error: 'Could not parse questions' };
    } catch {
      return { success: false, error: 'Failed to parse questions' };
    }
  }
}

// Export singleton instance
export const openaiService = new OpenAIService();

/**
 * Convenience function for simple OpenAI API calls
 */
export async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await openaiService.chat({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 4096
  });

  if (!response.success || !response.content) {
    throw new Error(response.error || 'OpenAI API call failed');
  }

  return response.content;
}
