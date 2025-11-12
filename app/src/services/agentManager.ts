/**
 * Agent Manager Service
 * Central coordinator for all AI agents in the marketing department
 *
 * Responsibilities:
 * - Coordinates communication between agents
 * - Delegates tasks to appropriate agents
 * - Orchestrates multi-agent workflows
 * - Manages dependencies between agent tasks
 * - Logs all agent interactions
 */

import { Task, Worker } from '../store/useStore'
import { generateContent, generateCopywriting } from './contentCreation'
import { searchLeads } from './leadGeneration'

export interface AgentMessage {
  id: string
  from: string // Agent ID
  to: string // Agent ID or 'manager'
  type: 'request' | 'response' | 'notification' | 'delegation'
  content: any
  timestamp: string
  taskId?: string
}

export interface WorkflowStep {
  agentId: string
  action: string
  dependencies?: string[] // IDs of prerequisite steps
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  result?: any
}

export interface Workflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  currentStep: number
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  createdAt: string
}

class AgentManagerService {
  private messages: AgentMessage[] = []
  private workflows: Workflow[] = []
  private agentCapabilities: Map<string, string[]> = new Map()

  constructor() {
    this.initializeCapabilities()
  }

  /**
   * Initialize agent capabilities for intelligent task routing
   */
  private initializeCapabilities() {
    this.agentCapabilities.set('jasper', [
      'content-creation',
      'blog-writing',
      'article-writing',
      'long-form-content',
      'seo-content',
    ])

    this.agentCapabilities.set('casey', [
      'copywriting',
      'ad-copy',
      'social-media-copy',
      'product-descriptions',
      'landing-pages',
      'email-copy',
    ])

    this.agentCapabilities.set('hunter', [
      'lead-prospecting',
      'b2b-leads',
      'contact-search',
      'company-research',
      'email-finding',
      'email-verification',
      'domain-search',
      'company-enrichment',
    ])

    this.agentCapabilities.set('sage', [
      'email-campaigns',
      'email-marketing',
      'newsletter-management',
      'email-automation',
    ])

    this.agentCapabilities.set('smarta', [
      'social-advertising',
      'facebook-ads',
      'instagram-ads',
      'campaign-management',
    ])

    this.agentCapabilities.set('dynamo', [
      'personalization',
      'experience-optimization',
      'ab-testing',
      'user-segmentation',
    ])

    this.agentCapabilities.set('analyzer', [
      'data-analysis',
      'analytics',
      'reporting',
      'metrics-tracking',
    ])

    this.agentCapabilities.set('heatley', [
      'user-experience',
      'heatmaps',
      'session-recording',
      'user-feedback',
    ])

    this.agentCapabilities.set('surfy', [
      'seo',
      'keyword-research',
      'content-optimization',
      'seo-audit',
    ])

    this.agentCapabilities.set('chatty', [
      'customer-support',
      'live-chat',
      'customer-messaging',
      'support-tickets',
    ])
  }

  /**
   * Find the best agent for a given task
   */
  findBestAgent(task: Task, allWorkers: Worker[]): Worker | null {
    // First check if task explicitly assigns an agent
    const assignedWorker = allWorkers.find(w => w.id === task.workerId)
    if (assignedWorker) return assignedWorker

    // Analyze task to determine required capabilities
    const taskText = `${task.title} ${task.description}`.toLowerCase()
    let bestMatch: { worker: Worker; score: number } | null = null

    for (const worker of allWorkers) {
      const capabilities = this.agentCapabilities.get(worker.id) || []
      let score = 0

      for (const capability of capabilities) {
        if (taskText.includes(capability.replace(/-/g, ' '))) {
          score++
        }
      }

      if (score > 0 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { worker, score }
      }
    }

    return bestMatch?.worker || null
  }

  /**
   * Coordinate task execution between multiple agents
   */
  async coordinateTask(
    task: Task,
    primaryWorker: Worker,
    allWorkers: Worker[],
    onProgress?: (agentId: string, progress: number, status: string) => void
  ): Promise<{ success: boolean; result?: any; error?: string }> {
    const taskId = task.id

    // Log manager taking control
    this.logMessage({
      id: Date.now().toString(),
      from: 'manager',
      to: primaryWorker.id,
      type: 'delegation',
      content: {
        task: task.title,
        reason: `Delegating to ${primaryWorker.name}`,
      },
      timestamp: new Date().toISOString(),
      taskId,
    })

    onProgress?.(primaryWorker.id, 10, 'Manager analyzing task requirements...')

    // Determine if task requires multiple agents
    const workflow = this.analyzeTaskForWorkflow(task, allWorkers)

    if (workflow.steps.length > 1) {
      // Multi-agent workflow required
      onProgress?.('manager', 20, 'Orchestrating multi-agent workflow...')
      return await this.executeWorkflow(workflow, allWorkers, onProgress)
    } else {
      // Single agent can handle this
      onProgress?.(primaryWorker.id, 30, `${primaryWorker.name} processing task...`)
      return await this.executeSingleAgentTask(task, primaryWorker, onProgress)
    }
  }

  /**
   * Analyze task to determine if it requires a multi-agent workflow
   */
  private analyzeTaskForWorkflow(task: Task, allWorkers: Worker[]): Workflow {
    const taskText = `${task.title} ${task.description}`.toLowerCase()
    const steps: WorkflowStep[] = []

    // Check for lead generation + content creation pattern
    if (taskText.includes('lead') && (taskText.includes('content') || taskText.includes('email'))) {
      steps.push({
        agentId: 'hunter',
        action: 'find-leads-and-emails',
        status: 'pending',
      })
      steps.push({
        agentId: 'casey',
        action: 'create-outreach-copy',
        dependencies: ['0'], // Depends on Hunter's leads & emails
        status: 'pending',
      })
    }
    // Check for content + SEO pattern
    else if (taskText.includes('blog') && taskText.includes('seo')) {
      steps.push({
        agentId: 'surfy',
        action: 'keyword-research',
        status: 'pending',
      })
      steps.push({
        agentId: 'jasper',
        action: 'create-content',
        dependencies: ['0'], // Depends on Surfy's keywords
        status: 'pending',
      })
    }
    // Check for ad campaign pattern
    else if (taskText.includes('campaign') && taskText.includes('ad')) {
      steps.push({
        agentId: 'casey',
        action: 'create-ad-copy',
        status: 'pending',
      })
      steps.push({
        agentId: 'smarta',
        action: 'setup-campaign',
        dependencies: ['0'], // Depends on Casey's ad copy
        status: 'pending',
      })
      steps.push({
        agentId: 'analyzer',
        action: 'track-performance',
        dependencies: ['1'], // Depends on Smarta's campaign
        status: 'pending',
      })
    }
    // Default: single agent
    else {
      const bestAgent = this.findBestAgent(task, allWorkers)
      if (bestAgent) {
        steps.push({
          agentId: bestAgent.id,
          action: 'execute-task',
          status: 'pending',
        })
      }
    }

    return {
      id: task.id,
      name: task.title,
      description: task.description,
      steps,
      currentStep: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
  }

  /**
   * Execute a multi-agent workflow
   */
  private async executeWorkflow(
    workflow: Workflow,
    allWorkers: Worker[],
    onProgress?: (agentId: string, progress: number, status: string) => void
  ): Promise<{ success: boolean; result?: any; error?: string }> {
    workflow.status = 'in_progress'
    const results: any[] = []

    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i]
      const worker = allWorkers.find(w => w.id === step.agentId)

      if (!worker) {
        return {
          success: false,
          error: `Agent ${step.agentId} not found`,
        }
      }

      // Check dependencies
      if (step.dependencies) {
        const allDepsCompleted = step.dependencies.every(
          depIndex => workflow.steps[parseInt(depIndex)].status === 'completed'
        )
        if (!allDepsCompleted) {
          return {
            success: false,
            error: `Dependencies not met for ${step.action}`,
          }
        }
      }

      // Execute step
      step.status = 'in_progress'
      workflow.currentStep = i

      onProgress?.(
        worker.id,
        30 + (i / workflow.steps.length) * 60,
        `${worker.name} executing: ${step.action}...`
      )

      // Request appropriate service from agent
      let stepResult: any
      try {
        stepResult = await this.requestAgentService(step.agentId, step.action, results)

        step.status = 'completed'
        step.result = stepResult
        results.push(stepResult)

        // Log success
        this.logMessage({
          id: Date.now().toString(),
          from: worker.id,
          to: 'manager',
          type: 'response',
          content: {
            step: step.action,
            success: true,
          },
          timestamp: new Date().toISOString(),
          taskId: workflow.id,
        })
      } catch (error) {
        step.status = 'failed'
        workflow.status = 'failed'

        return {
          success: false,
          error: error instanceof Error ? error.message : 'Step failed',
        }
      }
    }

    workflow.status = 'completed'

    return {
      success: true,
      result: {
        workflow: workflow.name,
        steps: workflow.steps.length,
        results,
        completedAt: new Date().toISOString(),
      },
    }
  }

  /**
   * Execute a single agent task
   */
  private async executeSingleAgentTask(
    task: Task,
    worker: Worker,
    onProgress?: (agentId: string, progress: number, status: string) => void
  ): Promise<{ success: boolean; result?: any; error?: string }> {
    // Delegate to appropriate service based on agent
    try {
      let result: any

      if (worker.id === 'jasper') {
        onProgress?.(worker.id, 50, 'Creating content with Jasper...')
        const contentResult = await generateContent({
          type: 'blog_post',
          topic: task.title,
          keywords: [task.description],
        })
        if ('error' in contentResult) {
          return { success: false, error: contentResult.error }
        }
        result = contentResult
      } else if (worker.id === 'casey') {
        onProgress?.(worker.id, 50, 'Generating copy with Casey...')
        const copyResult = await generateCopywriting({
          type: 'ad_copy',
          topic: task.title,
          keywords: [task.description],
        })
        if ('error' in copyResult) {
          return { success: false, error: copyResult.error }
        }
        result = copyResult
      } else if (worker.id === 'hunter') {
        onProgress?.(worker.id, 50, 'Finding leads and emails with Hunter...')
        const leadsResult = await searchLeads({
          keywords: [task.title, task.description],
          limit: 25,
        })
        if ('error' in leadsResult) {
          return { success: false, error: leadsResult.error }
        }
        result = leadsResult
      } else {
        // For other agents, return a placeholder
        result = {
          agent: worker.name,
          task: task.title,
          status: 'completed',
          message: `${worker.name} completed the task: ${task.title}`,
        }
      }

      return { success: true, result }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Task execution failed',
      }
    }
  }

  /**
   * Request a service from a specific agent
   */
  private async requestAgentService(
    agentId: string,
    action: string,
    _previousResults: any[]
  ): Promise<any> {
    // Simulate agent service request based on agent capabilities
    switch (agentId) {
      case 'jasper':
        return await generateContent({
          type: 'blog_post',
          topic: action,
          keywords: [],
        })

      case 'casey':
        return await generateCopywriting({
          type: 'ad_copy',
          topic: action,
          keywords: [],
        })

      case 'hunter':
        return await searchLeads({
          keywords: [action],
          limit: 25,
        })

      default:
        return {
          agent: agentId,
          action,
          completed: true,
          timestamp: new Date().toISOString(),
        }
    }
  }

  /**
   * Log inter-agent message
   */
  private logMessage(message: AgentMessage) {
    this.messages.push(message)
    console.log(`[Manager] ${message.from} → ${message.to}: ${message.type}`)
  }

  /**
   * Get message history for a task
   */
  getTaskMessages(taskId: string): AgentMessage[] {
    return this.messages.filter(m => m.taskId === taskId)
  }

  /**
   * Get all workflows
   */
  getWorkflows(): Workflow[] {
    return this.workflows
  }

  /**
   * Get agent capabilities
   */
  getAgentCapabilities(agentId: string): string[] {
    return this.agentCapabilities.get(agentId) || []
  }
}

// Export singleton instance
export const agentManager = new AgentManagerService()
