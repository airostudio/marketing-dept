// Activity Feed - Shows chronological feed of all agent tasks
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, AlertCircle, Clock, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatDistanceToNow } from 'date-fns';

export default function ActivityFeed() {
  const { tasks, workers } = useStore();

  // Sort tasks by creation time (newest first)
  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  // Limit to most recent 50 tasks
  const recentTasks = sortedTasks.slice(0, 50);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'in_progress':
        return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'border-gray-700 bg-gray-800/30';
      case 'in_progress':
        return 'border-blue-500/30 bg-blue-500/10';
      case 'completed':
        return 'border-green-500/30 bg-green-500/10';
      case 'failed':
        return 'border-red-500/30 bg-red-500/10';
      default:
        return 'border-gray-700 bg-gray-800/30';
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'just now';
    }
  };

  if (recentTasks.length === 0) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
        <Zap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-400 mb-2">No Activity Yet</h3>
        <p className="text-sm text-gray-500">
          Launch a campaign or run a task to see agent activity here
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-700 bg-gray-800/80">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-white">Activity Feed</h3>
          <span className="ml-auto text-xs text-gray-400">
            {recentTasks.length} {recentTasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {recentTasks.map((task, index) => {
            const worker = workers.find(w => w.id === task.workerId);

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.02 }}
                className={`p-4 border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${
                  task.status === 'in_progress' ? 'bg-blue-500/5' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Worker Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg border border-gray-600">
                    {worker?.emoji || '🤖'}
                  </div>

                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white text-sm">
                        {worker?.name || 'Agent'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-xs border ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                      {task.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(task.status)}
                        <span>{task.status === 'in_progress' ? `${task.progress}%` : task.status}</span>
                      </div>
                      <span>•</span>
                      <span>{getTimeAgo(task.createdAt)}</span>
                      {worker?.platform && (
                        <>
                          <span>•</span>
                          <span className="text-indigo-400">{worker.platform}</span>
                        </>
                      )}
                    </div>

                    {/* Progress Bar for In-Progress Tasks */}
                    {task.status === 'in_progress' && (
                      <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${task.progress}%` }}
                          className="h-full bg-blue-500"
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}

                    {/* Error Message */}
                    {task.status === 'failed' && task.error && (
                      <div className="mt-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded px-2 py-1">
                        {task.error}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
