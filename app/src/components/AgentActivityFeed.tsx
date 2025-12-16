/**
 * Agent Activity Feed Component
 *
 * Displays real-time activities for an agent showing what they're working on.
 * Updates live as the agent progresses through tasks.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Brain,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { activityTracker, AgentActivity } from '../services/activityTracker';

interface AgentActivityFeedProps {
  agentId: string;
  agentName?: string;
  maxActivities?: number;
  compact?: boolean;
}

export default function AgentActivityFeed({
  agentId,
  agentName,
  maxActivities = 10,
  compact = false
}: AgentActivityFeedProps) {
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    // Load initial activities
    const initialActivities = activityTracker.getAgentActivities(agentId, maxActivities);
    setActivities(initialActivities);
    setIsWorking(activityTracker.isAgentWorking(agentId));

    // Subscribe to updates
    const unsubscribe = activityTracker.subscribe((activity) => {
      if (activity.agentId === agentId) {
        setActivities(prev => {
          const newActivities = [activity, ...prev].slice(0, maxActivities);
          return newActivities;
        });
        setIsWorking(activityTracker.isAgentWorking(agentId));
      }
    });

    // Polling fallback (in case subscriptions don't work)
    const interval = setInterval(() => {
      const latestActivities = activityTracker.getAgentActivities(agentId, maxActivities);
      setActivities(latestActivities);
      setIsWorking(activityTracker.isAgentWorking(agentId));
    }, 2000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [agentId, maxActivities]);

  const getActivityIcon = (type: AgentActivity['activityType']) => {
    switch (type) {
      case 'started':
        return <Clock className="w-4 h-4" />;
      case 'thinking':
        return <Brain className="w-4 h-4" />;
      case 'executing':
        return <Zap className="w-4 h-4" />;
      case 'progress':
        return <TrendingUp className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: AgentActivity['activityType']) => {
    switch (type) {
      case 'started':
        return 'text-blue-500 bg-blue-500/10';
      case 'thinking':
        return 'text-purple-500 bg-purple-500/10';
      case 'executing':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'progress':
        return 'text-green-500 bg-green-500/10';
      case 'completed':
        return 'text-emerald-500 bg-emerald-500/10';
      case 'failed':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now.getTime() - activityTime.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);

    if (diffSec < 10) return 'just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    return activityTime.toLocaleDateString();
  };

  if (activities.length === 0) {
    return (
      <div className={`${compact ? 'p-3' : 'p-6'} text-center text-gray-500`}>
        <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No recent activity</p>
        {agentName && (
          <p className="text-xs mt-1">{agentName} is ready for tasks</p>
        )}
      </div>
    );
  }

  return (
    <div className={`${compact ? 'p-3' : 'p-4'}`}>
      {/* Status Header */}
      {!compact && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Activity Feed
          </h3>
          {isWorking && (
            <span className="flex items-center gap-2 text-sm text-green-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Working
            </span>
          )}
        </div>
      )}

      {/* Activity List */}
      <div className={`space-y-2 ${compact ? 'max-h-60' : 'max-h-96'} overflow-y-auto`}>
        <AnimatePresence initial={false}>
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={`${compact ? 'p-2' : 'p-3'} rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-shadow`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`${getActivityColor(activity.activityType)} p-2 rounded-lg`}>
                  {getActivityIcon(activity.activityType)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-gray-900`}>
                        {activity.message}
                      </p>
                      {activity.details && (
                        <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600 mt-0.5 line-clamp-2`}>
                          {activity.details}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {activity.progress !== undefined && activity.progress < 100 && (
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${activity.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
