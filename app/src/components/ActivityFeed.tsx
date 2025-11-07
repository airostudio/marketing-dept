import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { Activity } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function ActivityFeed() {
  const { tasks, workers } = useStore()

  const recentActivity = tasks
    .slice(0, 10)
    .map(task => {
      const worker = workers.find(w => w.id === task.workerId)
      return {
        id: task.id,
        emoji: worker?.emoji || '🤖',
        workerName: worker?.name || 'Unknown',
        action: getActionText(task.status, task.title),
        time: task.createdAt,
        status: task.status
      }
    })

  function getActionText(status: string, title: string) {
    switch (status) {
      case 'completed':
        return `completed "${title}"`
      case 'in_progress':
        return `started working on "${title}"`
      case 'failed':
        return `encountered an error with "${title}"`
      default:
        return `received task "${title}"`
    }
  }

  const statusColors = {
    completed: 'bg-green-500/10 border-green-500/20',
    in_progress: 'bg-primary-500/10 border-primary-500/20',
    failed: 'bg-red-500/10 border-red-500/20',
    pending: 'bg-gray-700/50 border-gray-600',
  }

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary-500" />
        Recent Activity
      </h3>

      {recentActivity.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No activity yet</p>
          <p className="text-sm">Create your first task to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-lg border ${statusColors[activity.status as keyof typeof statusColors]} hover:bg-opacity-20 transition-colors`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{activity.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">
                    <span className="font-semibold">{activity.workerName}</span>{' '}
                    <span className="text-gray-400">{activity.action}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
