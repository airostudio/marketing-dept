/**
 * Task Execution Service
 * Automatically executes tasks using AI workers
 */

import { Task, Worker } from '../store/useStore'
import { generateContent, requestContentFromJasper, ContentRequest } from './contentCreation'

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

    // Other workers can request content from Jasper
    return await executeTaskWithJasperSupport(task, worker, onProgress)
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

  onProgress?.(40, 'Generating content with AI...')

  const request: ContentRequest = {
    type: contentType,
    topic: task.title,
    additionalInstructions: task.description,
    tone: 'professional',
    length: 'medium',
  }

  const result = await generateContent(request)

  if ('error' in result) {
    return {
      success: false,
      error: result.error,
    }
  }

  onProgress?.(90, 'Finalizing content...')

  return {
    success: true,
    result: {
      content: result.content,
      wordCount: result.wordCount,
      generatedAt: result.generatedAt,
      worker: worker.name,
      platform: worker.platform,
    },
  }
}

/**
 * Execute task with Jasper's content creation support
 */
async function executeTaskWithJasperSupport(
  task: Task,
  worker: Worker,
  onProgress?: (progress: number, status: string) => void
): Promise<{ success: boolean; result?: any; error?: string }> {
  onProgress?.(20, `${worker.name} is analyzing the task...`)

  // Check if task requires content creation
  if (requiresContentCreation(task)) {
    onProgress?.(40, 'Requesting content from Jasper...')

    const contentType = determineContentType(task.title, task.description)
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
 * Auto-execute task when it's created
 */
export async function autoExecuteTask(
  task: Task,
  worker: Worker,
  updateCallback: (updates: Partial<Task>) => void
): Promise<void> {
  // Update to in_progress
  updateCallback({
    status: 'in_progress',
    progress: 0,
  })

  const result = await executeTask(
    task,
    worker,
    (progress, status) => {
      updateCallback({
        progress,
        error: undefined,
      })
      console.log(`Task progress: ${progress}% - ${status}`)
    }
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
