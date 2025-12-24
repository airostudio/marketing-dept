// Workflow orchestration engine for multi-agent coordination

import { Workflow, WorkflowStep, WorkflowExecution } from '../types/workflow';
import { executeTask } from './taskExecutor';
import { useStore } from '../store/useStore';

class WorkflowEngine {
  private activeExecutions: Map<string, WorkflowExecution> = new Map();
  private listeners: Map<string, ((workflow: Workflow) => void)[]> = new Map();

  // Store reference for adding/updating tasks
  private getStore() {
    return useStore.getState();
  }

  /**
   * Subscribe to workflow updates
   */
  subscribe(workflowId: string, callback: (workflow: Workflow) => void): () => void {
    if (!this.listeners.has(workflowId)) {
      this.listeners.set(workflowId, []);
    }
    this.listeners.get(workflowId)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(workflowId);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Notify all listeners of workflow update
   */
  private notify(workflowId: string, workflow: Workflow): void {
    const callbacks = this.listeners.get(workflowId) || [];
    callbacks.forEach(callback => callback(workflow));
  }

  /**
   * Execute a workflow by running steps in dependency order
   */
  async executeWorkflow(
    workflow: Workflow,
    onProgress?: (workflow: Workflow) => void
  ): Promise<Workflow> {
    // Initialize execution state
    const execution: WorkflowExecution = {
      workflowId: workflow.id,
      completedSteps: [],
      failedSteps: [],
      stepResults: {},
    };
    this.activeExecutions.set(workflow.id, execution);

    // Update workflow status
    workflow.status = 'in_progress';
    workflow.startedAt = new Date();
    this.notify(workflow.id, workflow);
    onProgress?.(workflow);

    try {
      // Get execution order based on dependencies
      const executionOrder = this.getExecutionOrder(workflow.steps);

      for (const stepId of executionOrder) {
        const step = workflow.steps.find(s => s.id === stepId);
        if (!step) continue;

        // Check if dependencies are met
        const dependenciesMet = this.checkDependencies(step, execution);
        if (!dependenciesMet) {
          step.status = 'skipped';
          step.error = 'Dependencies not met';
          continue;
        }

        // Execute step
        step.status = 'in_progress';
        execution.currentStepId = step.id;
        this.updateWorkflowProgress(workflow);
        this.notify(workflow.id, workflow);
        onProgress?.(workflow);

        try {
          // Simulate task execution with progress updates
          const result = await this.executeStep(step, execution.stepResults, (progress) => {
            step.progress = progress;
            this.updateWorkflowProgress(workflow);
            this.notify(workflow.id, workflow);
            onProgress?.(workflow);
          });

          step.status = 'completed';
          step.progress = 100;
          step.result = result.data;
          execution.completedSteps.push(step.id);
          execution.stepResults[step.id] = result.data;
        } catch (error) {
          step.status = 'failed';
          step.error = error instanceof Error ? error.message : 'Unknown error';
          execution.failedSteps.push(step.id);

          // Decide whether to continue or stop
          // For now, we'll continue with other independent steps
          console.error(`Step ${step.id} failed:`, error);
        }

        this.updateWorkflowProgress(workflow);
        this.notify(workflow.id, workflow);
        onProgress?.(workflow);
      }

      // Finalize workflow
      workflow.completedAt = new Date();
      workflow.status = execution.failedSteps.length > 0 ? 'failed' : 'completed';
      workflow.progress = 100;
      workflow.results = execution.stepResults;

    } catch (error) {
      workflow.status = 'failed';
      console.error('Workflow execution failed:', error);
    } finally {
      this.activeExecutions.delete(workflow.id);
      this.notify(workflow.id, workflow);
      onProgress?.(workflow);
    }

    return workflow;
  }

  /**
   * Execute a single workflow step
   */
  private async executeStep(
    step: WorkflowStep,
    previousResults: Record<string, any>,
    onProgress: (progress: number) => void
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    // Create a task for this step
    const taskId = `task-${step.id}-${Date.now()}`;
    const store = this.getStore();

    // Add task to store for real-time monitoring
    store.addTask({
      title: step.description,
      description: step.description,
      department: step.workerName,
      workerId: step.workerId,
      status: 'in_progress',
      priority: 'medium',
      progress: 0,
    });

    // Get the actual task ID from the store (it generates one)
    const actualTask = store.tasks[0]; // Most recent task
    const actualTaskId = actualTask.id;

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      if (step.progress < 90) {
        const newProgress = Math.min(step.progress + 10, 90);
        onProgress(newProgress);
        store.updateTask(actualTaskId, { progress: newProgress });
      }
    }, 200);

    try {
      // Execute the task using the existing task executor
      const result = await executeTask(taskId, step.workerId, {
        action: step.action,
        description: step.description,
        context: previousResults, // Pass results from previous steps
      });

      clearInterval(progressInterval);
      onProgress(100);

      // Update task as completed
      store.updateTask(actualTaskId, {
        status: 'completed',
        progress: 100,
        completedAt: new Date().toISOString(),
        result: result.data,
      });

      // Update worker status back to idle
      store.updateWorkerStatus(step.workerId, 'idle');

      return result;
    } catch (error) {
      clearInterval(progressInterval);

      // Update task as failed
      store.updateTask(actualTaskId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // Update worker status back to idle
      store.updateWorkerStatus(step.workerId, 'idle');

      throw error;
    }
  }

  /**
   * Check if step dependencies are satisfied
   */
  private checkDependencies(
    step: WorkflowStep,
    execution: WorkflowExecution
  ): boolean {
    if (!step.dependencies || step.dependencies.length === 0) {
      return true;
    }

    return step.dependencies.every(depId =>
      execution.completedSteps.includes(depId)
    );
  }

  /**
   * Get execution order based on dependencies (topological sort)
   */
  private getExecutionOrder(steps: WorkflowStep[]): string[] {
    const order: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (stepId: string) => {
      if (visited.has(stepId)) return;
      if (visiting.has(stepId)) {
        throw new Error('Circular dependency detected');
      }

      visiting.add(stepId);

      const step = steps.find(s => s.id === stepId);
      if (step?.dependencies) {
        step.dependencies.forEach(visit);
      }

      visiting.delete(stepId);
      visited.add(stepId);
      order.push(stepId);
    };

    steps.forEach(step => visit(step.id));

    return order;
  }

  /**
   * Update overall workflow progress based on step completion
   */
  private updateWorkflowProgress(workflow: Workflow): void {
    if (workflow.steps.length === 0) {
      workflow.progress = 0;
      return;
    }

    const totalProgress = workflow.steps.reduce((sum, step) => sum + step.progress, 0);
    workflow.progress = Math.round(totalProgress / workflow.steps.length);
  }

  /**
   * Pause workflow execution
   */
  pauseWorkflow(workflowId: string): void {
    const execution = this.activeExecutions.get(workflowId);
    if (execution) {
      // Implementation for pausing would go here
      console.log('Pausing workflow:', workflowId);
    }
  }

  /**
   * Cancel workflow execution
   */
  cancelWorkflow(workflowId: string): void {
    const execution = this.activeExecutions.get(workflowId);
    if (execution) {
      this.activeExecutions.delete(workflowId);
      console.log('Cancelled workflow:', workflowId);
    }
  }
}

export const workflowEngine = new WorkflowEngine();
