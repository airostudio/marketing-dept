/**
 * Marketing Department API
 *
 * Unified interface for submitting tasks to Scotty and the marketing team.
 * This is the main entry point for all task submissions and workflow management.
 *
 * Usage:
 *   const api = MarketingAPI.getInstance();
 *   const execution = await api.submitTask("Create a content strategy for Q1 2025");
 *   console.log(execution.finalDeliverable);
 */

import {
  executeCompleteWorkflow,
  WorkflowExecution,
  getExecutionSummary,
  exportWorkflowResults
} from './masterOrchestrator';
import { Worker } from '../types/workflow';
import { loadAgentConfigs } from './agentLoader';

export interface TaskSubmission {
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface TaskProgress {
  taskId: string;
  status: string;
  progress: number;
  currentPhase: string;
  agentUpdates: {
    agentName: string;
    status: string;
    progress: number;
  }[];
}

export class MarketingAPI {
  private static instance: MarketingAPI;
  private availableAgents: Worker[] = [];
  private activeExecutions: Map<string, WorkflowExecution> = new Map();
  private progressCallbacks: Map<string, (progress: TaskProgress) => void> = new Map();

  private constructor() {
    this.initializeAgents();
  }

  static getInstance(): MarketingAPI {
    if (!MarketingAPI.instance) {
      MarketingAPI.instance = new MarketingAPI();
    }
    return MarketingAPI.instance;
  }

  /**
   * Initialize available agents
   */
  private async initializeAgents(): Promise<void> {
    try {
      // Load all agent configurations
      const agents = await loadAgentConfigs();
      this.availableAgents = agents;
      console.log(`✅ Loaded ${agents.length} marketing agents`);
    } catch (error) {
      console.error('Failed to load agents:', error);
      // Use fallback agents
      this.availableAgents = this.getFallbackAgents();
    }
  }

  /**
   * Submit a task to Scotty and the marketing team
   */
  async submitTask(
    taskOrSubmission: string | TaskSubmission,
    onProgress?: (progress: TaskProgress) => void
  ): Promise<WorkflowExecution> {

    // Parse submission
    const submission: TaskSubmission = typeof taskOrSubmission === 'string' ?
      { description: taskOrSubmission } :
      taskOrSubmission;

    console.log('\n🎯 New task submitted to Scotty:', submission.description);

    // Ensure agents are loaded
    if (this.availableAgents.length === 0) {
      await this.initializeAgents();
    }

    // Setup progress tracking
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    if (onProgress) {
      this.progressCallbacks.set(taskId, onProgress);
    }

    // Execute workflow with progress updates
    const execution = await executeCompleteWorkflow(
      submission.description,
      this.availableAgents,
      (exec) => {
        // Store active execution
        this.activeExecutions.set(exec.taskId, exec);

        // Call progress callback
        const callback = this.progressCallbacks.get(taskId);
        if (callback) {
          callback(this.convertToProgress(exec));
        }
      }
    );

    // Store final execution
    this.activeExecutions.set(execution.taskId, execution);

    // Cleanup progress callback
    this.progressCallbacks.delete(taskId);

    console.log('\n✅ Task completed:', execution.taskId);

    return execution;
  }

  /**
   * Submit multiple tasks in parallel
   */
  async submitBatch(
    tasks: (string | TaskSubmission)[],
    onBatchProgress?: (taskId: string, progress: TaskProgress) => void
  ): Promise<WorkflowExecution[]> {

    console.log(`\n🎯 Batch submission: ${tasks.length} tasks`);

    const promises = tasks.map(task =>
      this.submitTask(task, onBatchProgress ? (progress) => {
        onBatchProgress(progress.taskId, progress);
      } : undefined)
    );

    const results = await Promise.allSettled(promises);

    const executions: WorkflowExecution[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        executions.push(result.value);
      } else {
        console.error(`Task ${index + 1} failed:`, result.reason);
      }
    });

    return executions;
  }

  /**
   * Get task status
   */
  getTaskStatus(taskId: string): TaskProgress | null {
    const execution = this.activeExecutions.get(taskId);
    if (!execution) return null;
    return this.convertToProgress(execution);
  }

  /**
   * Get all active tasks
   */
  getActiveTasks(): TaskProgress[] {
    return Array.from(this.activeExecutions.values())
      .filter(exec => exec.status !== 'completed' && exec.status !== 'failed')
      .map(exec => this.convertToProgress(exec));
  }

  /**
   * Get task execution details
   */
  getExecution(taskId: string): WorkflowExecution | null {
    return this.activeExecutions.get(taskId) || null;
  }

  /**
   * Get execution summary as text
   */
  getExecutionSummary(taskId: string): string | null {
    const execution = this.activeExecutions.get(taskId);
    if (!execution) return null;
    return getExecutionSummary(execution);
  }

  /**
   * Export workflow results
   */
  exportResults(
    taskId: string,
    format: 'summary' | 'detailed' | 'deliverable' = 'deliverable'
  ): { filename: string; content: string } | null {
    const execution = this.activeExecutions.get(taskId);
    if (!execution) return null;
    return exportWorkflowResults(execution, format);
  }

  /**
   * Get available agents
   */
  getAvailableAgents(): Worker[] {
    return [...this.availableAgents];
  }

  /**
   * Get agents by department
   */
  getAgentsByDepartment(department: string): Worker[] {
    return this.availableAgents.filter(agent =>
      agent.department?.toLowerCase() === department.toLowerCase()
    );
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): Worker | null {
    return this.availableAgents.find(agent => agent.id === agentId) || null;
  }

  /**
   * Clear completed tasks from memory
   */
  clearCompletedTasks(): number {
    let cleared = 0;
    this.activeExecutions.forEach((execution, taskId) => {
      if (execution.status === 'completed' || execution.status === 'failed') {
        this.activeExecutions.delete(taskId);
        cleared++;
      }
    });
    return cleared;
  }

  /**
   * Convert execution to progress format
   */
  private convertToProgress(execution: WorkflowExecution): TaskProgress {
    const agentUpdates = Array.from(execution.stepResults.values()).map(result => ({
      agentName: result.workerName,
      status: result.status,
      progress: result.progress
    }));

    return {
      taskId: execution.taskId,
      status: execution.status,
      progress: execution.progress,
      currentPhase: execution.currentPhase,
      agentUpdates
    };
  }

  /**
   * Fallback agents if loading fails
   */
  private getFallbackAgents(): Worker[] {
    return [
      {
        id: 'scotty-the-vp',
        name: 'Scotty',
        role: 'VP of Sales & Marketing',
        emoji: '🎯',
        status: 'active',
        department: 'executive',
        capabilities: ['strategy', 'orchestration', 'leadership'],
        aiPlatform: { name: 'Gemini', model: 'gemini-2.0-flash-exp' }
      },
      {
        id: 'marcus-hayes',
        name: 'Marcus Hayes',
        role: 'Senior Content Strategist',
        emoji: '✍️',
        status: 'active',
        department: 'content-creation',
        capabilities: ['content', 'blogging', 'strategy'],
        aiPlatform: { name: 'Gemini', model: 'gemini-2.0-flash-exp' }
      },
      {
        id: 'sarah-chen',
        name: 'Sarah Chen',
        role: 'Lead Generation Specialist',
        emoji: '🎯',
        status: 'active',
        department: 'lead-generation',
        capabilities: ['leads', 'prospecting', 'outreach'],
        aiPlatform: { name: 'DeepSeek', model: 'deepseek-chat' }
      },
      {
        id: 'emma-wilson',
        name: 'Emma Wilson',
        role: 'Email Marketing Manager',
        emoji: '📧',
        status: 'active',
        department: 'email-marketing',
        capabilities: ['email', 'campaigns', 'automation'],
        aiPlatform: { name: 'DeepSeek', model: 'deepseek-chat' }
      },
      {
        id: 'alex-rodriguez',
        name: 'Alex Rodriguez',
        role: 'Social Media Advertising Manager',
        emoji: '📱',
        status: 'active',
        department: 'social-media',
        capabilities: ['social', 'ads', 'targeting'],
        aiPlatform: { name: 'DeepSeek', model: 'deepseek-chat' }
      },
      {
        id: 'ryan-mitchell',
        name: 'Ryan Mitchell',
        role: 'SEO Specialist',
        emoji: '🔍',
        status: 'active',
        department: 'seo',
        capabilities: ['seo', 'keywords', 'optimization'],
        aiPlatform: { name: 'DeepSeek', model: 'deepseek-chat' }
      },
      {
        id: 'david-kim',
        name: 'David Kim',
        role: 'Analytics Director',
        emoji: '📊',
        status: 'active',
        department: 'analytics',
        capabilities: ['analytics', 'reporting', 'insights'],
        aiPlatform: { name: 'DeepSeek', model: 'deepseek-chat' }
      },
      {
        id: 'oliver-grant',
        name: 'Oliver Grant',
        role: 'CRO Specialist',
        emoji: '🎨',
        status: 'active',
        department: 'conversion-optimization',
        capabilities: ['conversion', 'optimization', 'testing'],
        aiPlatform: { name: 'Gemini', model: 'gemini-2.0-flash-exp' }
      },
      {
        id: 'oscar-wright',
        name: 'Oscar Wright',
        role: 'Operations Coordinator',
        emoji: '⚙️',
        status: 'active',
        department: 'orchestration',
        capabilities: ['operations', 'coordination', 'management'],
        aiPlatform: { name: 'Gemini', model: 'gemini-2.0-flash-exp' }
      }
    ];
  }
}

// Export singleton instance for easy importing
export const marketingAPI = MarketingAPI.getInstance();

// Export convenience functions
export async function submitTask(
  task: string | TaskSubmission,
  onProgress?: (progress: TaskProgress) => void
): Promise<WorkflowExecution> {
  return marketingAPI.submitTask(task, onProgress);
}

export function getTaskStatus(taskId: string): TaskProgress | null {
  return marketingAPI.getTaskStatus(taskId);
}

export function getExecution(taskId: string): WorkflowExecution | null {
  return marketingAPI.getExecution(taskId);
}

export function exportResults(
  taskId: string,
  format: 'summary' | 'detailed' | 'deliverable' = 'deliverable'
): { filename: string; content: string } | null {
  return marketingAPI.exportResults(taskId, format);
}
