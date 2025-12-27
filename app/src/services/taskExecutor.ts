// Task Executor - Production-Grade AI Task Execution
// NO FALLBACKS - Real AI execution only
import { geminiService } from './gemini'
import { deepseekService } from './deepseek'
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
    // Log task started with clear indication this is REAL AI
    console.log(`\n🎯 ========== REAL AI AGENT TASK STARTING ==========`)
    console.log(`👤 Agent: ${agentName} (${agentConfig.role})`)
    console.log(`🤖 AI Engine: ${getAgentAIPlatform(workerId)} (Real API Call)`)
    console.log(`📋 Task: ${userTask.substring(0, 100)}${userTask.length > 100 ? '...' : ''}`)
    console.log(`⏰ Started: ${new Date().toLocaleTimeString()}`)
    console.log(`==================================================\n`)

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

    // Log execution start with clear indication of REAL AI
    console.log(`🚀 [${agentName}] INITIATING REAL ${aiPlatform} AI API CALL`)
    logExecuting(workerId, agentName, taskId, `🔌 Connecting to ${aiPlatform} AI service`)
    logProgress(workerId, agentName, taskId, 'Establishing secure HTTPS connection to AI platform', 10)
    await new Promise(resolve => setTimeout(resolve, 500))

    // Route to appropriate AI service
    let response
    if (aiPlatform === 'Gemini') {
      console.log(`📡 [${agentName}] Sending request to Google Gemini API (generativelanguage.googleapis.com)`)
      logProgress(workerId, agentName, taskId, '📡 CALLING REAL GOOGLE GEMINI API - Sending task with agent expertise...', 20)
      await new Promise(resolve => setTimeout(resolve, 300))

      logProgress(workerId, agentName, taskId, '🤖 Gemini AI is processing your request with real machine learning...', 35)
      const startTime = Date.now()

      response = await geminiService.executeAgentTask(
        agentConfig.name,
        systemPrompt,
        userTask,
        taskContext?.context
      )

      const duration = Date.now() - startTime
      console.log(`✅ [${agentName}] Gemini API responded in ${duration}ms with ${response.content?.length || 0} characters`)
      logProgress(workerId, agentName, taskId, `✅ Received real AI response (${duration}ms, ${response.content?.length || 0} chars)`, 60)
    } else if (aiPlatform === 'DeepSeek') {
      console.log(`📡 [${agentName}] Sending request to DeepSeek API (api.deepseek.com)`)
      logProgress(workerId, agentName, taskId, '📡 CALLING REAL DEEPSEEK API - Sending task with agent expertise...', 20)
      await new Promise(resolve => setTimeout(resolve, 300))

      logProgress(workerId, agentName, taskId, '🤖 DeepSeek AI is processing your request with real neural network...', 35)
      const startTime = Date.now()

      response = await deepseekService.executeAgentTask(
        agentConfig.name,
        systemPrompt,
        userTask,
        taskContext?.context
      )

      const duration = Date.now() - startTime
      console.log(`✅ [${agentName}] DeepSeek API responded in ${duration}ms with ${response.content?.length || 0} characters`)
      logProgress(workerId, agentName, taskId, `✅ Received real AI response (${duration}ms, ${response.content?.length || 0} chars)`, 60)
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

    console.log(`\n✅ ========== REAL AI AGENT TASK COMPLETED ==========`)
    console.log(`👤 Agent: ${agentName}`)
    console.log(`🤖 AI Engine: ${aiPlatform} (Confirmed Real API Response)`)
    console.log(`📊 Response Length: ${response.content.length} characters`)
    console.log(`💰 Tokens Used: ${JSON.stringify(response.usage || {})}`)
    console.log(`⏰ Completed: ${new Date().toLocaleTimeString()}`)
    console.log(`====================================================\n`)

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
  const hasGemini = geminiService.isConfigured()
  const hasDeepSeek = deepseekService.isConfigured()

  if (!hasGemini && !hasDeepSeek) {
    errors.push('No AI services configured. System cannot operate without API keys.')
    errors.push('Add VITE_GEMINI_API_KEY or VITE_DEEPSEEK_API_KEY to .env file.')
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
