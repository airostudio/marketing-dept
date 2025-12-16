import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Loader2, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';
import TaskDetailModal from './TaskDetailModal';

export default function LiveTaskMonitor() {
  const { tasks, workers } = useStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Get active and recent tasks
  const activeTasks = tasks.filter(t => t.status === 'in_progress');
  const recentCompletedTasks = tasks
    .filter(t => t.status === 'completed' || t.status === 'failed')
    .sort((a, b) => {
      const dateA = new Date(a.completedAt || a.createdAt);
      const dateB = new Date(b.completedAt || b.createdAt);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 3);

  const allDisplayTasks = [...activeTasks, ...recentCompletedTasks];

  // Auto-hide if no tasks
  useEffect(() => {
    if (allDisplayTasks.length === 0) {
      setIsMinimized(true);
    } else {
      setIsMinimized(false);
    }
  }, [allDisplayTasks.length]);

  if (allDisplayTasks.length === 0) {
    return null;
  }

  const getWorkerInfo = (workerId: string) => {
    const worker = workers.find(w => w.id === workerId);
    return worker || { name: 'Unknown', emoji: '❓', platform: 'Unknown' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-400" />;
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
      case 'in_progress':
        return 'border-blue-500/50 bg-blue-500/10';
      case 'completed':
        return 'border-green-500/50 bg-green-500/10';
      case 'failed':
        return 'border-red-500/50 bg-red-500/10';
      default:
        return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="font-medium">{activeTasks.length} Active Task{activeTasks.length !== 1 ? 's' : ''}</span>
        </button>
      ) : (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-96 max-h-[600px] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
              <h3 className="font-semibold text-white">Live Agent Activity</h3>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Task List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {allDisplayTasks.map((task) => {
                const worker = getWorkerInfo(task.workerId);
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`border rounded-lg p-3 cursor-pointer hover:bg-gray-700/30 transition-colors ${getStatusColor(task.status)}`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Worker Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl flex-shrink-0">
                        {worker.emoji}
                      </div>

                      {/* Task Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(task.status)}
                          <span className="text-sm font-medium text-white truncate">
                            {worker.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {worker.platform}
                          </span>
                        </div>

                        <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                          {task.title}
                        </p>

                        {/* Progress Bar */}
                        {task.status === 'in_progress' && (
                          <div className="space-y-1">
                            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${task.progress}%` }}
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">
                                {task.progress}% complete
                              </span>
                              <span className="text-xs text-blue-400 animate-pulse">
                                Working...
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Completed Status */}
                        {task.status === 'completed' && (
                          <div className="text-xs text-green-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Completed
                            {task.completedAt && (
                              <span className="text-gray-400">
                                • {new Date(task.completedAt).toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Failed Status */}
                        {task.status === 'failed' && (
                          <div className="text-xs text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {task.error || 'Failed'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Result Preview */}
                    {task.status === 'completed' && task.result && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-3 pt-3 border-t border-gray-700/50"
                      >
                        <div className="text-xs text-gray-400">
                          {typeof task.result === 'object' && task.result.result ? (
                            <div className="bg-gray-900/50 rounded p-2 max-h-20 overflow-y-auto">
                              <p className="line-clamp-3">{task.result.result.substring(0, 150)}...</p>
                            </div>
                          ) : (
                            <span>Task completed successfully</span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-700 bg-gray-900/50">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>
                {activeTasks.length} active • {tasks.filter(t => t.status === 'completed').length} completed today
              </span>
              <span className="text-purple-400">Live</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Task Detail Modal */}
      <TaskDetailModal
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
      />
    </motion.div>
  );
}
