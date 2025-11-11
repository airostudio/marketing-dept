/**
 * Task Execution Service
 * Automatically executes tasks using AI workers
 * Routes all tasks through the Agent Manager for coordination
 * - Jasper: Long-form content (blogs, articles)
 * - Casey: Copywriting (ads, social media, short-form)
 * - Zoey: Lead prospecting (ZoomInfo B2B contact search)
 * - Manager: Coordinates multi-agent workflows
 */

import { Task, Worker } from '../store/useStore'
import {
  generateContent,
  generateCopywriting,
  requestContentFromJasper,
  requestCopywritingFromCasey,
  ContentRequest
} from './contentCreation'
import {
  searchLeads,
  requestLeadsFromZoey,
  parseLeadSearchFromTask
} from './leadGeneration'
import { agentManager } from './agentManager'

/**
 * Execute a task using the appropriate AI worker
 */
export async function executeTask(
  task: Task,
  worker: Worker,
  onProgress?: (progress: number, status: string) => void
): Promise<{ success: boolean; result?: any; error?: string }> {
  try {
    onProgress?.(10, 'Initializing task...')

    // Route based on worker's role
    if (worker.id === 'jasper' || worker.department === 'Content Creation') {
      return await executeContentCreationTask(task, worker, onProgress)
    }

    if (worker.id === 'zoey' || worker.department === 'Lead Generation') {
      return await executeLeadGenerationTask(task, worker, onProgress)
    }

    // Other workers can request content from Jasper or leads from Zoey
    return await executeTaskWithSpecialistSupport(task, worker, onProgress)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Task execution failed',
    }
  }
}

/**
 * Execute content creation task (Jasper/Casey)
 */
async function executeContentCreationTask(
  task: Task,
  worker: Worker,
  onProgress?: (progress: number, status: string) => void
): Promise<{ success: boolean; result?: any; error?: string }> {
  onProgress?.(20, 'Analyzing content request...')

  // Parse task description to determine content type
  const contentType = determineContentType(task.title, task.description)

  // Determine if this is a copywriting task (Casey) or general content (Jasper)
  const isCopywriting = isCopywritingTask(task.title, task.description)

  onProgress?.(40, `Generating ${isCopywriting ? 'copywriting' : 'content'} with AI...`)

  const request: ContentRequest = {
    type: contentType,
    topic: task.title,
    additionalInstructions: task.description,
    tone: 'professional',
    length: 'medium',
  }

  // Route to appropriate AI service
  const result = isCopywriting && worker.id === 'casey'
    ? await generateCopywriting(request)  // Casey uses Rytr AI
    : await generateContent(request)      // Jasper uses Google Gemini

  if ('error' in result) {
    return {
      success: false,
      error: result.error,
    }
  }

  onProgress?.(90, 'Finalizing content...')

  const aiService = isCopywriting && worker.id === 'casey'
    ? 'Rytr AI'
    : 'Google Gemini'

  return {
    success: true,
    result: {
      content: result.content,
      wordCount: result.wordCount,
      generatedAt: result.generatedAt,
      worker: worker.name,
      platform: worker.platform,
      contentGeneratedBy: `${worker.name} (${aiService})`,
    },
  }
}

/**
 * Execute lead generation task (Zoey)
 */
async function executeLeadGenerationTask(
  task: Task,
  worker: Worker,
  onProgress?: (progress: number, status: string) => void
): Promise<{ success: boolean; result?: any; error?: string }> {
  onProgress?.(20, 'Analyzing lead search criteria...')

  // Parse task description to extract search criteria
  const searchCriteria = parseLeadSearchFromTask(task.title, task.description)

  onProgress?.(40, 'Searching for leads with ZoomInfo...')

  const result = await searchLeads(searchCriteria)

  if ('error' in result) {
    return {
      success: false,
      error: result.error,
    }
  }

  onProgress?.(90, 'Compiling lead results...')

  return {
    success: true,
    result: {
      leads: result.leads,
      totalFound: result.totalFound,
      generatedAt: result.generatedAt,
      worker: worker.name,
      platform: worker.platform,
      leadsFoundBy: `${worker.name} (ZoomInfo)`,
    },
  }
}

/**
 * Execute task with specialist support (Jasper, Casey, or Zoey)
 * Other agents can request content, copywriting, or leads from specialists
 */
async function executeTaskWithSpecialistSupport(
  task: Task,
  worker: Worker,
  onProgress?: (progress: number, status: string) => void
): Promise<{ success: boolean; result?: any; error?: string }> {
  onProgress?.(20, `${worker.name} is analyzing the task...`)

  // Check if task requires lead generation
  if (requiresLeadGeneration(task)) {
    onProgress?.(40, 'Requesting lead prospecting from Zoey...')

    const searchCriteria = parseLeadSearchFromTask(task.title, task.description)
    const result = await requestLeadsFromZoey(worker.name, searchCriteria)

    if ('error' in result) {
      return {
        success: false,
        error: result.error,
      }
    }

    onProgress?.(80, `${worker.name} is processing the leads...`)

    return {
      success: true,
      result: {
        leads: result.leads,
        totalFound: result.totalFound,
        generatedAt: result.generatedAt,
        worker: worker.name,
        platform: worker.platform,
        leadsFoundBy: 'Zoey (ZoomInfo)',
      },
    }
  }

  // Check if task requires content creation
  if (requiresContentCreation(task)) {
    const contentType = determineContentType(task.title, task.description)
    const needsCopywriting = isCopywritingTask(task.title, task.description)

    if (needsCopywriting) {
      // Request copywriting from Casey
      onProgress?.(40, 'Requesting copywriting from Casey...')

      const result = await requestCopywritingFromCasey(
        worker.name,
        contentType,
        task.title,
        {
          additionalInstructions: task.description,
          tone: 'persuasive',
        }
      )

      if ('error' in result) {
        return {
          success: false,
          error: result.error,
        }
      }

      onProgress?.(80, `${worker.name} is processing the copy...`)

      return {
        success: true,
        result: {
          content: result.content,
          wordCount: result.wordCount,
          generatedAt: result.generatedAt,
          worker: worker.name,
          platform: worker.platform,
          contentGeneratedBy: 'Casey (Rytr AI)',
        },
      }
    } else {
      // Request general content from Jasper
      onProgress?.(40, 'Requesting content from Jasper...')

      const result = await requestContentFromJasper(
        worker.name,
        contentType,
        task.title,
        {
          additionalInstructions: task.description,
          tone: 'professional',
        }
      )

      if ('error' in result) {
        return {
          success: false,
          error: result.error,
        }
      }

      onProgress?.(80, `${worker.name} is processing the content...`)

      return {
        success: true,
        result: {
          content: result.content,
          wordCount: result.wordCount,
          generatedAt: result.generatedAt,
          worker: worker.name,
          platform: worker.platform,
          contentGeneratedBy: 'Jasper (Google Gemini)',
        },
      }
    }
  }

  // For non-content tasks, return a simulated result
  onProgress?.(80, `${worker.name} is completing the task...`)

  return {
    success: true,
    result: {
      message: `Task completed by ${worker.name} using ${worker.platform}`,
      worker: worker.name,
      platform: worker.platform,
      completedAt: new Date().toISOString(),
    },
  }
}

/**
 * Determine content type from task details
 */
function determineContentType(
  title: string,
  description: string
): ContentRequest['type'] {
  const combined = `${title} ${description}`.toLowerCase()

  if (combined.includes('blog') || combined.includes('article')) {
    return 'blog_post'
  }
  if (combined.includes('social') || combined.includes('tweet') || combined.includes('post')) {
    return 'social_media'
  }
  if (combined.includes('email') || combined.includes('newsletter')) {
    return 'email'
  }
  if (combined.includes('ad') || combined.includes('advertisement')) {
    return 'ad_copy'
  }
  if (combined.includes('seo') || combined.includes('search')) {
    return 'seo_content'
  }
  if (combined.includes('product') || combined.includes('description')) {
    return 'product_description'
  }

  return 'general'
}

/**
 * Check if a task is copywriting-specific (Casey/Rytr)
 * Copywriting: ads, social media, product descriptions, short-form
 */
function isCopywritingTask(title: string, description: string): boolean {
  const copywritingKeywords = [
    'ad copy',
    'advertisement',
    'ads',
    'social media',
    'facebook ad',
    'instagram',
    'twitter',
    'linkedin post',
    'product description',
    'landing page',
    'headline',
    'tagline',
    'slogan',
    'cta',
    'call to action',
    'copy',
  ]

  const combined = `${title} ${description}`.toLowerCase()

  return copywritingKeywords.some((keyword) => combined.includes(keyword))
}

/**
 * Check if a task requires content creation
 */
function requiresContentCreation(task: Task): boolean {
  const keywords = [
    'write',
    'create',
    'content',
    'copy',
    'blog',
    'article',
    'email',
    'social',
    'post',
    'ad',
    'description',
  ]

  const combined = `${task.title} ${task.description}`.toLowerCase()

  return keywords.some((keyword) => combined.includes(keyword))
}

/**
 * Check if a task requires lead generation
 */
function requiresLeadGeneration(task: Task): boolean {
  const keywords = [
    'lead',
    'leads',
    'prospect',
    'prospecting',
    'contact',
    'contacts',
    'find',
    'search',
    'b2b',
    'outreach',
    'sales',
    'target',
    'customer',
  ]

  const combined = `${task.title} ${task.description}`.toLowerCase()

  return keywords.some((keyword) => combined.includes(keyword))
}

/**
 * Auto-execute task when it's created
 * Routes through Agent Manager for multi-agent coordination
 */
export async function autoExecuteTask(
  task: Task,
  worker: Worker,
  allWorkers: Worker[],
  updateCallback: (updates: Partial<Task>) => void
): Promise<void> {
  // Update to in_progress
  updateCallback({
    status: 'in_progress',
    progress: 0,
  })

  // Create enhanced progress callback for Manager coordination
  const managerProgress = (agentId: string, progress: number, status: string) => {
    if (agentId === 'manager') {
      updateCallback({
        progress,
        error: undefined,
      })
      console.log(`🎯 Manager: ${status} (${progress}%)`)
    } else {
      const agent = allWorkers.find(w => w.id === agentId)
      const emoji = agent?.emoji || '🤖'
      updateCallback({
        progress,
        error: undefined,
      })
      console.log(`${emoji} ${agent?.name || agentId}: ${status} (${progress}%)`)
    }
  }

  // Route through Manager for coordination
  const result = await agentManager.coordinateTask(
    task,
    worker,
    allWorkers,
    managerProgress
  )

  if (result.success) {
    updateCallback({
      status: 'completed',
      progress: 100,
      completedAt: new Date().toISOString(),
      result: result.result,
      error: undefined,
    })
  } else {
    updateCallback({
      status: 'failed',
      error: result.error,
    })
  }
}
