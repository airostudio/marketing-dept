import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  CheckCircle,
  Download,
  FileText,
  X,
  Sparkles,
  ChevronRight,
  Clock,
  User,
  FolderOpen
} from 'lucide-react'
import { useStore } from '../store/useStore'

interface CompletedDeliverable {
  id: string
  taskId: string
  taskTitle: string
  agentId: string
  agentName: string
  agentEmoji: string
  completedAt: string
  result: any
  downloadable: boolean
  projectName?: string
}

export default function MadisonNotifications() {
  const { tasks, workers } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [deliverables, setDeliverables] = useState<CompletedDeliverable[]>([])
  const [hasNewNotifications, setHasNewNotifications] = useState(false)
  const [seenTaskIds, setSeenTaskIds] = useState<Set<string>>(new Set())

  // Watch for completed tasks
  useEffect(() => {
    const completedTasks = tasks.filter(t => t.status === 'completed' && t.result)

    const newDeliverables: CompletedDeliverable[] = completedTasks.map(task => {
      const worker = workers.find(w => w.id === task.workerId)
      return {
        id: `deliverable-${task.id}`,
        taskId: task.id,
        taskTitle: task.title,
        agentId: task.workerId,
        agentName: worker?.name || 'Unknown Agent',
        agentEmoji: worker?.emoji || '🤖',
        completedAt: task.completedAt || new Date().toISOString(),
        result: task.result,
        downloadable: true,
        projectName: task.description?.split(' ').slice(0, 3).join(' ') || 'Project'
      }
    })

    setDeliverables(newDeliverables)

    // Check for new notifications
    const newTaskIds = new Set(completedTasks.map(t => t.id))
    const hasNew = completedTasks.some(t => !seenTaskIds.has(t.id))
    setHasNewNotifications(hasNew && newTaskIds.size > 0)
  }, [tasks, workers, seenTaskIds])

  const handleOpen = () => {
    setIsOpen(true)
    // Mark all current tasks as seen
    setSeenTaskIds(new Set(deliverables.map(d => d.taskId)))
    setHasNewNotifications(false)
  }

  const handleDownload = (deliverable: CompletedDeliverable) => {
    // Create downloadable content
    const content = typeof deliverable.result === 'string'
      ? deliverable.result
      : JSON.stringify(deliverable.result, null, 2)

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${deliverable.taskTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <>
      {/* Notification Bell */}
      <button
        onClick={handleOpen}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
      >
        <Bell className="w-6 h-6" />
        {hasNewNotifications && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900"
          />
        )}
        {deliverables.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
            {deliverables.length}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-gray-900 border-l border-gray-700 shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-2xl">
                      📋
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Madison Clarke</h2>
                      <p className="text-gray-400 text-sm">Executive Assistant</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-300">
                      <p className="font-medium text-white mb-1">Completed Deliverables</p>
                      <p>I've compiled all completed work from the team. Review, download, or take action on any deliverable below.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deliverables List */}
              <div className="flex-1 overflow-y-auto p-4">
                {deliverables.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="font-medium">No completed deliverables yet</p>
                    <p className="text-sm mt-1">Completed tasks will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deliverables.map((deliverable, index) => (
                      <motion.div
                        key={deliverable.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-primary-500/30 transition-colors"
                      >
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center text-xl">
                            {deliverable.agentEmoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate">{deliverable.taskTitle}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <User className="w-3 h-3" />
                              <span>{deliverable.agentName}</span>
                              <span className="text-gray-600">•</span>
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(deliverable.completedAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          </div>
                        </div>

                        {/* Preview */}
                        {deliverable.result && (
                          <div className="mb-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                            <p className="text-sm text-gray-400 line-clamp-3">
                              {typeof deliverable.result === 'string'
                                ? deliverable.result.substring(0, 200)
                                : JSON.stringify(deliverable.result).substring(0, 200)}
                              {(typeof deliverable.result === 'string' ? deliverable.result.length : JSON.stringify(deliverable.result).length) > 200 && '...'}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownload(deliverable)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg transition-colors text-sm font-medium"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                          <button
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
                          >
                            <FileText className="w-4 h-4" />
                            View Full
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {deliverables.length > 0 && (
                <div className="p-4 border-t border-gray-700">
                  <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-5 h-5" />
                    Download All ({deliverables.length} files)
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
