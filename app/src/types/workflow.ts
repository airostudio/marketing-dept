// Workflow types for multi-agent orchestration

export interface WorkflowStep {
  id: string;
  workerId: string;
  workerName: string;
  action: string;
  description: string;
  dependencies?: string[]; // IDs of steps that must complete first
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  progress: number;
  result?: any;
  error?: string;
  estimatedDuration?: number; // in seconds
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: 'content' | 'lead-generation' | 'campaign' | 'analytics' | 'custom';
  steps: WorkflowStep[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'paused';
  progress: number; // 0-100
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  results?: Record<string, any>; // Results from each step
  metadata?: Record<string, any>; // Additional context
}

export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'content' | 'lead-generation' | 'campaign' | 'analytics';
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: Omit<WorkflowStep, 'id' | 'status' | 'progress' | 'result' | 'error'>[];
  requiredWorkers: string[];
  successMetrics: string[];
}

export interface WorkflowExecution {
  workflowId: string;
  currentStepId?: string;
  completedSteps: string[];
  failedSteps: string[];
  stepResults: Record<string, any>;
}
