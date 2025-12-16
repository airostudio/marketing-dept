// Task Detail Modal - Shows comprehensive task information
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Loader2, Clock, Zap, User, Calendar, Target } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatDistanceToNow } from 'date-fns';

interface TaskDetailModalProps {
  taskId: string | null;
  onClose: () => void;
}

export default function TaskDetailModal({ taskId, onClose }: TaskDetailModalProps) {
  const { tasks, workers } = useStore();

  if (!taskId) return null;

  const task = tasks.find(t => t.id === taskId);
  if (!task) return null;

  const worker = workers.find(w => w.id === task.workerId);

  const getStatusIcon = () => {
    switch (task.status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-gray-400" />;
      case 'in_progress':
        return <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'failed':
        return <AlertCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'pending':
        return 'border-gray-700 bg-gray-800/30 text-gray-400';
      case 'in_progress':
        return 'border-blue-500/30 bg-blue-500/10 text-blue-400';
      case 'completed':
        return 'border-green-500/30 bg-green-500/10 text-green-400';
      case 'failed':
        return 'border-red-500/30 bg-red-500/10 text-red-400';
      default:
        return 'border-gray-700 bg-gray-800/30 text-gray-400';
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'just now';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-700 bg-gray-800/80">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center text-2xl border border-gray-600">
                  {worker?.emoji || '🤖'}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">{task.description}</h2>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border inline-flex items-center gap-1.5 ${getStatusColor()}`}>
                      {getStatusIcon()}
                      {task.status.replace('_', ' ')}
                    </span>
                    {task.status === 'in_progress' && (
                      <span className="text-sm text-gray-400">{task.progress}% complete</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Progress Bar */}
            {task.status === 'in_progress' && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="font-semibold text-white">{task.progress}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Task Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <User className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">Agent</span>
                </div>
                <div className="text-white font-semibold">{worker?.name || 'Unknown'}</div>
                <div className="text-sm text-gray-400">{worker?.role}</div>
              </div>

              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">AI Platform</span>
                </div>
                <div className="text-white font-semibold">{worker?.platform || 'N/A'}</div>
              </div>

              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">Created</span>
                </div>
                <div className="text-white font-semibold">{getTimeAgo(task.createdAt)}</div>
              </div>

              {task.completedAt && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Completed</span>
                  </div>
                  <div className="text-white font-semibold">{getTimeAgo(task.completedAt)}</div>
                </div>
              )}
            </div>

            {/* Result */}
            {task.result && (
              <div className="bg-gray-900/50 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-400 mb-3">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium uppercase">Result</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                    {typeof task.result === 'string'
                      ? task.result
                      : JSON.stringify(task.result, null, 2)}
                  </pre>
                </div>

                {/* AI Usage Stats */}
                {task.result?.usage && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-400 mb-1">Prompt Tokens</div>
                      <div className="text-lg font-semibold text-white">
                        {task.result.usage.prompt_tokens || task.result.usage.promptTokenCount || 0}
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-400 mb-1">Completion Tokens</div>
                      <div className="text-lg font-semibold text-white">
                        {task.result.usage.completion_tokens || task.result.usage.candidatesTokenCount || 0}
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-400 mb-1">Total Tokens</div>
                      <div className="text-lg font-semibold text-white">
                        {task.result.usage.total_tokens || task.result.usage.totalTokenCount || 0}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error */}
            {task.error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-400 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium uppercase">Error</span>
                </div>
                <p className="text-sm text-red-300">{task.error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700 bg-gray-800/80">
            <button
              onClick={onClose}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
