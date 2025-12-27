/**
 * Real-Time Activity Tracking System
 *
 * Tracks and broadcasts agent activities in real-time as they work on tasks.
 * Provides live updates on what each agent is doing at any moment.
 */

export interface AgentActivity {
  id: string;
  agentId: string;
  agentName: string;
  taskId: string;
  activityType: 'started' | 'progress' | 'thinking' | 'executing' | 'completed' | 'failed';
  message: string;
  details?: string;
  timestamp: string;
  progress?: number;
  metadata?: Record<string, any>;
}

type ActivityListener = (activity: AgentActivity) => void;

class ActivityTracker {
  private activities: Map<string, AgentActivity[]> = new Map(); // agentId -> activities
  private listeners: Set<ActivityListener> = new Set();
  private maxActivitiesPerAgent = 50; // Keep last 50 activities

  /**
   * Log a new activity
   */
  logActivity(activity: Omit<AgentActivity, 'id' | 'timestamp'>): void {
    const fullActivity: AgentActivity = {
      ...activity,
      id: `activity-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString()
    };

    // Store activity
    const agentActivities = this.activities.get(activity.agentId) || [];
    agentActivities.unshift(fullActivity); // Add to beginning

    // Keep only recent activities
    if (agentActivities.length > this.maxActivitiesPerAgent) {
      agentActivities.splice(this.maxActivitiesPerAgent);
    }

    this.activities.set(activity.agentId, agentActivities);

    // Notify listeners
    this.notifyListeners(fullActivity);

    // Log to console for debugging
    console.log(`[${activity.agentName}] ${activity.message}`, activity.details || '');
  }

  /**
   * Log task started
   */
  logTaskStarted(agentId: string, agentName: string, taskId: string, taskDescription: string): void {
    this.logActivity({
      agentId,
      agentName,
      taskId,
      activityType: 'started',
      message: 'Started working on task',
      details: taskDescription,
      progress: 0
    });
  }

  /**
   * Log thinking/analysis phase
   */
  logThinking(agentId: string, agentName: string, taskId: string, thought: string): void {
    this.logActivity({
      agentId,
      agentName,
      taskId,
      activityType: 'thinking',
      message: 'Analyzing',
      details: thought
    });
  }

  /**
   * Log execution progress
   */
  logProgress(agentId: string, agentName: string, taskId: string, message: string, progress: number): void {
    this.logActivity({
      agentId,
      agentName,
      taskId,
      activityType: 'progress',
      message,
      progress
    });
  }

  /**
   * Log executing specific action
   */
  logExecuting(agentId: string, agentName: string, taskId: string, action: string): void {
    this.logActivity({
      agentId,
      agentName,
      taskId,
      activityType: 'executing',
      message: 'Executing',
      details: action
    });
  }

  /**
   * Log task completion
   */
  logCompleted(agentId: string, agentName: string, taskId: string, summary: string): void {
    this.logActivity({
      agentId,
      agentName,
      taskId,
      activityType: 'completed',
      message: 'Completed task',
      details: summary,
      progress: 100
    });
  }

  /**
   * Log task failure
   */
  logFailed(agentId: string, agentName: string, taskId: string, error: string): void {
    this.logActivity({
      agentId,
      agentName,
      taskId,
      activityType: 'failed',
      message: 'Task failed',
      details: error
    });
  }

  /**
   * Get activities for an agent
   */
  getAgentActivities(agentId: string, limit?: number): AgentActivity[] {
    const activities = this.activities.get(agentId) || [];
    return limit ? activities.slice(0, limit) : activities;
  }

  /**
   * Get all recent activities across all agents
   */
  getAllActivities(limit: number = 50): AgentActivity[] {
    const allActivities: AgentActivity[] = [];

    for (const activities of this.activities.values()) {
      allActivities.push(...activities);
    }

    // Sort by timestamp descending
    allActivities.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return allActivities.slice(0, limit);
  }

  /**
   * Get current activity for an agent
   */
  getCurrentActivity(agentId: string): AgentActivity | null {
    const activities = this.activities.get(agentId);
    if (!activities || activities.length === 0) return null;

    // Find most recent non-completed activity
    const current = activities.find(a =>
      a.activityType !== 'completed' && a.activityType !== 'failed'
    );

    return current || activities[0];
  }

  /**
   * Check if agent is currently working
   */
  isAgentWorking(agentId: string): boolean {
    const current = this.getCurrentActivity(agentId);
    if (!current) return false;

    // Check if activity is recent (within last 5 minutes)
    const activityTime = new Date(current.timestamp).getTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    return (now - activityTime) < fiveMinutes &&
           current.activityType !== 'completed' &&
           current.activityType !== 'failed';
  }

  /**
   * Subscribe to activity updates
   */
  subscribe(listener: ActivityListener): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of new activity
   */
  private notifyListeners(activity: AgentActivity): void {
    this.listeners.forEach(listener => {
      try {
        listener(activity);
      } catch (error) {
        console.error('Error in activity listener:', error);
      }
    });
  }

  /**
   * Clear activities for an agent
   */
  clearAgentActivities(agentId: string): void {
    this.activities.delete(agentId);
  }

  /**
   * Clear all activities
   */
  clearAll(): void {
    this.activities.clear();
  }

  /**
   * Get activity statistics
   */
  getStats(): {
    totalActivities: number;
    activeAgents: number;
    completedTasks: number;
    failedTasks: number;
  } {
    const allActivities = this.getAllActivities();

    return {
      totalActivities: allActivities.length,
      activeAgents: Array.from(this.activities.keys())
        .filter(agentId => this.isAgentWorking(agentId))
        .length,
      completedTasks: allActivities.filter(a => a.activityType === 'completed').length,
      failedTasks: allActivities.filter(a => a.activityType === 'failed').length
    };
  }
}

// Export singleton instance
export const activityTracker = new ActivityTracker();

// Export convenience functions
export function logTaskStarted(agentId: string, agentName: string, taskId: string, description: string): void {
  activityTracker.logTaskStarted(agentId, agentName, taskId, description);
}

export function logThinking(agentId: string, agentName: string, taskId: string, thought: string): void {
  activityTracker.logThinking(agentId, agentName, taskId, thought);
}

export function logProgress(agentId: string, agentName: string, taskId: string, message: string, progress: number): void {
  activityTracker.logProgress(agentId, agentName, taskId, message, progress);
}

export function logExecuting(agentId: string, agentName: string, taskId: string, action: string): void {
  activityTracker.logExecuting(agentId, agentName, taskId, action);
}

export function logCompleted(agentId: string, agentName: string, taskId: string, summary: string): void {
  activityTracker.logCompleted(agentId, agentName, taskId, summary);
}

export function logFailed(agentId: string, agentName: string, taskId: string, error: string): void {
  activityTracker.logFailed(agentId, agentName, taskId, error);
}
