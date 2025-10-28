import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, AlertCircle } from 'lucide-react'
import { Worker } from '../store/useStore'

interface WorkerCardProps {
  worker: Worker
  index: number
}

export default function WorkerCard({ worker, index }: WorkerCardProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    idle: 'bg-gray-100 text-gray-800',
    error: 'bg-red-100 text-red-800',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/worker/${worker.id}`}>
        <div className="card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{worker.emoji}</div>
              <div>
                <h3 className="font-bold text-gray-900">{worker.name}</h3>
                <p className="text-sm text-gray-600">{worker.department}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[worker.status]}`}>
              {worker.status}
            </span>
          </div>

          {/* Current Task */}
          {worker.currentTask ? (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-900 font-medium">
                {worker.currentTask}
              </p>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">
                No active task
              </p>
            </div>
          )}

          {/* Platform */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Platform:</span>
            <span className="font-semibold text-gray-900">{worker.platform}</span>
          </div>

          {/* View Details Link */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-primary-600 group-hover:text-primary-700">
            <span className="font-semibold">View Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Error Indicator */}
          {worker.status === 'error' && (
            <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Attention required</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
