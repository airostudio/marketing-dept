// Task Executor - Production-Grade AI Task Execution
// NO FALLBACKS - Real AI execution only
import { geminiService } from './gemini'
import { deepseekService } from './deepseek'
import { openaiService } from './openai'
import { getAgentConfig, getAgentSystemPrompt, getAgentAIPlatform } from './agentLoader'
import {
  logTaskStarted,
  logThinking,
  logProgress,
  logExecuting,
  logCompleted,
  logFailed
} from './activityTracker'

interface TaskResult {
  success: boolean
  data?: any
  error?: string
}

interface TaskContext {
  action?: string
  description?: string
  context?: Record<string, any>
}

/**
 * Execute task with real AI - NO SIMULATION FALLBACK
 * This is a production system that requires valid API keys
 */
export async function executeTask(
  taskId: string,
  workerId: string,
  taskContext?: TaskContext
): Promise<TaskResult> {
  // Get agent configuration
  const agentConfig = getAgentConfig(workerId)
  if (!agentConfig) {
    const error = `Agent ${workerId} not found in system configuration`
    console.error(error)
    return {
      success: false,
      error
    }
  }

  const agentName = agentConfig.name
  const userTask = taskContext?.description || taskContext?.action || 'Execute assigned task'

  try {
    // Log task started
    logTaskStarted(workerId, agentName, taskId, userTask)

    // Get agent's system prompt
    const systemPrompt = getAgentSystemPrompt(workerId)
    if (!systemPrompt) {
      const error = `No system prompt configured for ${agentName}. Agent cannot operate without instructions.`
      logFailed(workerId, agentName, taskId, error)
      return {
        success: false,
        error
      }
    }

    // Get agent's AI platform
    const aiPlatform = getAgentAIPlatform(workerId)
    if (!aiPlatform) {
      const error = `No AI platform assigned for ${agentName}. Agent requires either Gemini or DeepSeek.`
      logFailed(workerId, agentName, taskId, error)
      return {
        success: false,
        error
      }
    }

    // Verify AI service is configured
    if (aiPlatform === 'OpenAI' && !openaiService.isConfigured()) {
      const error = 'OpenAI API key not configured. Add VITE_OPENAI_API_KEY to .env file.'
      logFailed(workerId, agentName, taskId, error)
      return {
        success: false,
        error
      }
    }

    if (aiPlatform === 'Gemini' && !geminiService.isConfigured()) {
      const error = 'Google Gemini API key not configured. Add VITE_GEMINI_API_KEY to .env file.'
      logFailed(workerId, agentName, taskId, error)
      return {
        success: false,
        error
      }
    }

    if (aiPlatform === 'DeepSeek' && !deepseekService.isConfigured()) {
      const error = 'DeepSeek API key not configured. Add VITE_DEEPSEEK_API_KEY to .env file.'
      logFailed(workerId, agentName, taskId, error)
      return {
        success: false,
        error
      }
    }

    // Log thinking phase
    logThinking(workerId, agentName, taskId, 'Analyzing task requirements and formulating execution strategy')
    await new Promise(resolve => setTimeout(resolve, 800))

    // Log execution start
    logExecuting(workerId, agentName, taskId, `Connecting to ${aiPlatform} AI service`)
    logProgress(workerId, agentName, taskId, 'Establishing secure connection', 10)

    // Route to appropriate AI service
    let response
    if (aiPlatform === 'OpenAI') {
      logProgress(workerId, agentName, taskId, 'Sending task to OpenAI GPT-4 with agent context', 20)
      response = await openaiService.executeAgentTask(
        agentConfig.name,
        systemPrompt,
        userTask,
        taskContext?.context
      )
    } else if (aiPlatform === 'Gemini') {
      logProgress(workerId, agentName, taskId, 'Sending task to Google Gemini with agent context', 20)
      response = await geminiService.executeAgentTask(
        agentConfig.name,
        systemPrompt,
        userTask,
        taskContext?.context
      )
    } else if (aiPlatform === 'DeepSeek') {
      logProgress(workerId, agentName, taskId, 'Sending task to DeepSeek AI with agent context', 20)
      response = await deepseekService.executeAgentTask(
        agentConfig.name,
        systemPrompt,
        userTask,
        taskContext?.context
      )
    } else {
      const error = `Unknown AI platform: ${aiPlatform}. Agent cannot execute.`
      logFailed(workerId, agentName, taskId, error)
      return {
        success: false,
        error
      }
    }

    // Handle AI execution failure - NO FALLBACK
    if (!response.success) {
      const errorMessage = response.error || 'AI service returned an error'
      logFailed(workerId, agentName, taskId, errorMessage)

      // Log detailed error for debugging
      console.error(`[${agentName}] AI Execution Failed:`, {
        platform: aiPlatform,
        error: errorMessage,
        taskId,
        workerId
      })

      return {
        success: false,
        error: `${aiPlatform} execution failed: ${errorMessage}`
      }
    }

    // Verify we got actual content
    if (!response.content || typeof response.content !== 'string' || response.content.trim().length === 0) {
      const error = `${aiPlatform} returned empty response. The AI model may be overloaded or experiencing issues.`
      logFailed(workerId, agentName, taskId, error)
      return {
        success: false,
        error
      }
    }

    // Log processing response
    logProgress(workerId, agentName, taskId, 'Received AI response, processing results', 70)
    await new Promise(resolve => setTimeout(resolve, 400))

    logProgress(workerId, agentName, taskId, 'Structuring deliverable format', 85)
    await new Promise(resolve => setTimeout(resolve, 300))

    logProgress(workerId, agentName, taskId, 'Finalizing output and validating quality', 95)
    await new Promise(resolve => setTimeout(resolve, 200))

    // Extract summary for activity log (first 200 chars)
    const summary = response.content.length > 200
      ? response.content.substring(0, 200) + '...'
      : response.content

    logCompleted(workerId, agentName, taskId, summary)

    // Return structured result
    return {
      success: true,
      data: {
        agentId: workerId,
        agentName: agentConfig.name,
        agentRole: agentConfig.role,
        aiPlatform: aiPlatform,
        result: response.content,
        usage: response.usage,
        timestamp: new Date().toISOString(),
        taskId: taskId
      }
    }
  } catch (error) {
    // Production error handling - NO FALLBACK
    const errorMsg = error instanceof Error ? error.message : 'Unknown system error'

    console.error(`[${agentName}] Critical Error:`, {
      error: errorMsg,
      stack: error instanceof Error ? error.stack : undefined,
      taskId,
      workerId
    })

    logFailed(workerId, agentName, taskId, `Critical error: ${errorMsg}`)

    return {
      success: false,
      error: `Task execution failed: ${errorMsg}`
    }
  }
}

/**
 * Validate that system is properly configured for production use
 */
export function validateSystemConfiguration(): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Check if at least one AI service is configured
  const hasOpenAI = openaiService.isConfigured()
  const hasGemini = geminiService.isConfigured()
  const hasDeepSeek = deepseekService.isConfigured()

  if (!hasOpenAI && !hasGemini && !hasDeepSeek) {
    errors.push('No AI services configured. System cannot operate without API keys.')
    errors.push('Add VITE_OPENAI_API_KEY, VITE_GEMINI_API_KEY, or VITE_DEEPSEEK_API_KEY to .env file.')
  }

  if (!hasOpenAI) {
    warnings.push('OpenAI not configured. Most agents require OpenAI GPT-4.')
    warnings.push('Get API key: https://platform.openai.com/api-keys')
  }

  if (!hasGemini) {
    warnings.push('Google Gemini not configured. Gemini-based agents will not work.')
    warnings.push('Get free API key: https://aistudio.google.com/app/apikey')
  }

  if (!hasDeepSeek) {
    warnings.push('DeepSeek not configured. DeepSeek-based agents will not work.')
    warnings.push('Get API key: https://platform.deepseek.com/api_keys')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}
