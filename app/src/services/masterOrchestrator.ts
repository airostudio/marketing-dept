/**
 * Master Workflow Orchestrator
 *
 * The complete end-to-end workflow system:
 * User Task → Scotty Analysis → Agent Execution → EA Collation → Final Deliverable
 *
 * This orchestrator manages the entire lifecycle of marketing projects,
 * ensuring seamless coordination between all agents and delivering
 * professional, executive-ready results.
 */

import { analyzeTaskWithScotty, createOrchestrationPlan, OrchestrationPlan } from './scottyOrchestrator';
import { collateWithEA, AgentOutput, EADeliverable, formatDeliverableAsMarkdown } from './eaAgent';
import { executeTask } from './taskExecutor';
import { Worker, WorkflowStep } from '../types/workflow';

export interface WorkflowExecution {
  taskId: string;
  taskDescription: string;
  status: 'analyzing' | 'planning' | 'executing' | 'collating' | 'completed' | 'failed';
  currentPhase: string;
  progress: number;
  orchestrationPlan?: OrchestrationPlan;
  stepResults: Map<string, StepResult>;
  finalDeliverable?: EADeliverable;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export interface StepResult {
  stepId: string;
  workerId: string;
  workerName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  output?: string;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

/**
 * Execute a complete workflow from task to deliverable
 */
export async function executeCompleteWorkflow(
  taskDescription: string,
  availableAgents: Worker[],
  onProgress?: (execution: WorkflowExecution) => void
): Promise<WorkflowExecution> {

  const taskId = `task-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  const execution: WorkflowExecution = {
    taskId,
    taskDescription,
    status: 'analyzing',
    currentPhase: 'Scotty is analyzing your task...',
    progress: 0,
    stepResults: new Map(),
    startedAt: new Date().toISOString()
  };

  try {
    // PHASE 1: Scotty analyzes the task
    notifyProgress(execution, onProgress);

    console.log('🎯 Scotty analyzing task:', taskDescription);

    const analysis = await analyzeTaskWithScotty(taskDescription, availableAgents);

    console.log('📊 Analysis complete:', {
      complexity: analysis.complexity,
      agents: analysis.requiredAgents.length,
      strategy: analysis.executionStrategy
    });

    // PHASE 2: Create orchestration plan
    execution.status = 'planning';
    execution.currentPhase = 'Creating execution plan...';
    execution.progress = 10;
    notifyProgress(execution, onProgress);

    const plan = createOrchestrationPlan(taskId, taskDescription, analysis, availableAgents);
    execution.orchestrationPlan = plan;

    console.log('📋 Orchestration plan created:', {
      steps: plan.workflowSteps.length,
      cost: `$${plan.estimatedCost}`,
      needsEA: plan.requiresEACollation
    });

    // Initialize step results
    plan.workflowSteps.forEach(step => {
      const agent = availableAgents.find(a => a.id === step.workerId);
      execution.stepResults.set(step.id, {
        stepId: step.id,
        workerId: step.workerId,
        workerName: agent?.name || step.workerId,
        status: 'pending',
        progress: 0
      });
    });

    // PHASE 3: Execute workflow steps
    execution.status = 'executing';
    execution.currentPhase = 'Agents are working on your task...';
    execution.progress = 20;
    notifyProgress(execution, onProgress);

    await executeWorkflowSteps(plan.workflowSteps, execution, availableAgents, onProgress);

    // PHASE 4: EA collates results (if needed)
    if (plan.requiresEACollation) {
      execution.status = 'collating';
      execution.currentPhase = 'EA is preparing your final deliverable...';
      execution.progress = 90;
      notifyProgress(execution, onProgress);

      console.log('📝 EA collating results from', execution.stepResults.size, 'agents');

      const agentOutputs: AgentOutput[] = Array.from(execution.stepResults.values())
        .filter(result => result.status === 'completed' && result.output)
        .map(result => ({
          agentId: result.workerId,
          agentName: result.workerName,
          agentRole: availableAgents.find(a => a.id === result.workerId)?.role || 'Marketing Specialist',
          output: result.output!,
          completedAt: result.completedAt || new Date().toISOString()
        }));

      const deliverable = await collateWithEA(
        taskDescription,
        agentOutputs,
        analysis.complexity
      );

      execution.finalDeliverable = deliverable;

      console.log('✨ EA deliverable completed');
    } else {
      // Single agent - use their output directly
      const singleResult = Array.from(execution.stepResults.values())[0];
      if (singleResult && singleResult.output) {
        execution.finalDeliverable = {
          executiveSummary: `Task completed by ${singleResult.workerName}`,
          keyFindings: [`${singleResult.workerName} delivered professional results`],
          agentContributions: [{
            agentName: singleResult.workerName,
            contribution: singleResult.output.substring(0, 300),
            highlights: ['Task completed successfully', 'Professional quality output']
          }],
          recommendations: ['Review the output', 'Implement the suggestions'],
          nextSteps: ['Take action on deliverables'],
          fullReport: singleResult.output,
          metadata: {
            taskDescription,
            completedAt: new Date().toISOString(),
            totalAgents: 1,
            complexity: analysis.complexity
          }
        };
      }
    }

    // PHASE 5: Complete
    execution.status = 'completed';
    execution.currentPhase = 'Workflow completed successfully!';
    execution.progress = 100;
    execution.completedAt = new Date().toISOString();
    notifyProgress(execution, onProgress);

    console.log('✅ Workflow completed successfully');

    return execution;

  } catch (error) {
    console.error('❌ Workflow execution failed:', error);

    execution.status = 'failed';
    execution.error = error instanceof Error ? error.message : 'Unknown error';
    execution.completedAt = new Date().toISOString();
    notifyProgress(execution, onProgress);

    return execution;
  }
}

/**
 * Execute workflow steps with dependency management
 */
async function executeWorkflowSteps(
  steps: WorkflowStep[],
  execution: WorkflowExecution,
  availableAgents: Worker[],
  onProgress?: (execution: WorkflowExecution) => void
): Promise<void> {

  // Build dependency graph
  const dependencyMap = new Map<string, string[]>();
  steps.forEach(step => {
    dependencyMap.set(step.id, step.dependencies || []);
  });

  // Track completed steps
  const completed = new Set<string>();

  // Execute in topological order
  while (completed.size < steps.length) {
    // Find steps ready to execute (dependencies met)
    const readySteps = steps.filter(step =>
      !completed.has(step.id) &&
      (step.dependencies || []).every(depId => completed.has(depId))
    );

    if (readySteps.length === 0) {
      // Check if we're stuck (circular dependency or all failed)
      const pending = steps.filter(step => !completed.has(step.id));
      if (pending.length > 0) {
        throw new Error(`Workflow stuck - cannot execute steps: ${pending.map(s => s.id).join(', ')}`);
      }
      break;
    }

    // Execute ready steps in parallel
    const stepPromises = readySteps.map(step =>
      executeWorkflowStep(step, execution, availableAgents, onProgress)
    );

    const results = await Promise.allSettled(stepPromises);

    // Mark completed
    readySteps.forEach((step, index) => {
      if (results[index].status === 'fulfilled') {
        completed.add(step.id);
      } else {
        // Mark as failed but continue with other steps
        const stepResult = execution.stepResults.get(step.id);
        if (stepResult) {
          stepResult.status = 'failed';
          stepResult.error = results[index].status === 'rejected' ?
            (results[index] as PromiseRejectedResult).reason?.message : 'Unknown error';
          stepResult.completedAt = new Date().toISOString();
        }
        completed.add(step.id); // Mark as done (failed) so we don't block others
      }
    });

    // Update overall progress
    const progressPercent = 20 + (completed.size / steps.length) * 70; // 20-90% range
    execution.progress = Math.round(progressPercent);
    notifyProgress(execution, onProgress);
  }
}

/**
 * Execute a single workflow step
 */
async function executeWorkflowStep(
  step: WorkflowStep,
  execution: WorkflowExecution,
  availableAgents: Worker[],
  onProgress?: (execution: WorkflowExecution) => void
): Promise<void> {

  const stepResult = execution.stepResults.get(step.id);
  if (!stepResult) return;

  const agent = availableAgents.find(a => a.id === step.workerId);
  if (!agent) {
    throw new Error(`Agent ${step.workerId} not found`);
  }

  // Mark as in progress
  stepResult.status = 'in_progress';
  stepResult.startedAt = new Date().toISOString();
  stepResult.progress = 0;
  notifyProgress(execution, onProgress);

  console.log(`🚀 Starting: ${agent.name} - ${step.action}`);

  // Gather context from dependencies
  const dependencyContext: Record<string, any> = {};
  if (step.dependencies && step.dependencies.length > 0) {
    step.dependencies.forEach(depId => {
      const depResult = execution.stepResults.get(depId);
      if (depResult && depResult.output) {
        dependencyContext[depResult.workerName] = depResult.output;
      }
    });
  }

  // Execute the task
  try {
    const taskContext = {
      action: step.action,
      description: execution.taskDescription,
      context: {
        ...dependencyContext,
        taskId: execution.taskId,
        stepId: step.id,
        agentRole: agent.role
      }
    };

    const result = await executeTask(execution.taskId, step.workerId, taskContext);

    if (result.success && result.data) {
      // Extract meaningful output
      const output = typeof result.data.result === 'string' ?
        result.data.result :
        JSON.stringify(result.data, null, 2);

      stepResult.status = 'completed';
      stepResult.progress = 100;
      stepResult.output = output;
      stepResult.completedAt = new Date().toISOString();

      console.log(`✅ Completed: ${agent.name}`);
    } else {
      throw new Error(result.error || 'Task execution failed');
    }

  } catch (error) {
    console.error(`❌ Failed: ${agent.name} -`, error);

    stepResult.status = 'failed';
    stepResult.error = error instanceof Error ? error.message : 'Unknown error';
    stepResult.completedAt = new Date().toISOString();

    throw error;
  } finally {
    notifyProgress(execution, onProgress);
  }
}

/**
 * Notify progress callback
 */
function notifyProgress(
  execution: WorkflowExecution,
  onProgress?: (execution: WorkflowExecution) => void
): void {
  if (onProgress) {
    onProgress({ ...execution });
  }
}

/**
 * Get a summary of workflow execution
 */
export function getExecutionSummary(execution: WorkflowExecution): string {
  const duration = execution.completedAt ?
    (new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000 :
    0;

  const completedSteps = Array.from(execution.stepResults.values())
    .filter(r => r.status === 'completed').length;

  const totalSteps = execution.stepResults.size;

  let summary = `## Workflow Execution Summary\n\n`;
  summary += `**Task:** ${execution.taskDescription}\n`;
  summary += `**Status:** ${execution.status.toUpperCase()}\n`;
  summary += `**Duration:** ${duration.toFixed(1)}s\n`;
  summary += `**Steps Completed:** ${completedSteps}/${totalSteps}\n\n`;

  if (execution.orchestrationPlan) {
    const plan = execution.orchestrationPlan;
    summary += `### Scotty's Analysis\n`;
    summary += `- **Complexity:** ${plan.analysis.complexity}\n`;
    summary += `- **Duration Estimate:** ${plan.analysis.estimatedDuration}\n`;
    summary += `- **Agents Assigned:** ${plan.analysis.requiredAgents.length}\n`;
    summary += `- **Estimated Cost:** $${plan.estimatedCost}\n`;
    summary += `- **Strategy:** ${plan.analysis.executionStrategy}\n\n`;
  }

  summary += `### Agent Contributions\n`;
  execution.stepResults.forEach(result => {
    const icon = result.status === 'completed' ? '✅' :
                result.status === 'failed' ? '❌' :
                result.status === 'in_progress' ? '🔄' : '⏳';
    summary += `${icon} **${result.workerName}** - ${result.status}\n`;
  });

  if (execution.finalDeliverable) {
    summary += `\n---\n\n`;
    summary += formatDeliverableAsMarkdown(execution.finalDeliverable);
  }

  return summary;
}

/**
 * Export workflow results to file
 */
export function exportWorkflowResults(
  execution: WorkflowExecution,
  format: 'summary' | 'detailed' | 'deliverable'
): { filename: string; content: string } {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);

  switch (format) {
    case 'summary':
      return {
        filename: `workflow-summary-${timestamp}.md`,
        content: getExecutionSummary(execution)
      };

    case 'detailed':
      const detailed = getExecutionSummary(execution) + '\n\n## Detailed Step Results\n\n';
      let detailedContent = detailed;
      execution.stepResults.forEach(result => {
        detailedContent += `### ${result.workerName}\n`;
        detailedContent += `**Status:** ${result.status}\n`;
        if (result.output) {
          detailedContent += `**Output:**\n\`\`\`\n${result.output}\n\`\`\`\n\n`;
        }
        if (result.error) {
          detailedContent += `**Error:** ${result.error}\n\n`;
        }
      });
      return {
        filename: `workflow-detailed-${timestamp}.md`,
        content: detailedContent
      };

    case 'deliverable':
      if (execution.finalDeliverable) {
        return {
          filename: `deliverable-${timestamp}.md`,
          content: formatDeliverableAsMarkdown(execution.finalDeliverable)
        };
      }
      return {
        filename: `workflow-${timestamp}.txt`,
        content: 'No deliverable available'
      };

    default:
      return {
        filename: `workflow-${timestamp}.json`,
        content: JSON.stringify(execution, null, 2)
      };
  }
}
