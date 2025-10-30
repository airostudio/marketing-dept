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
    completed: 'bg-green-100 border-green-200',
    in_progress: 'bg-blue-100 border-blue-200',
    failed: 'bg-red-100 border-red-200',
    pending: 'bg-gray-100 border-gray-200',
  }

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5" />
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
              className={`p-4 rounded-lg border ${statusColors[activity.status as keyof typeof statusColors]}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{activity.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{activity.workerName}</span>{' '}
                    {activity.action}
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
