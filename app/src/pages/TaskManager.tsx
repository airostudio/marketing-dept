import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Loader, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useStore } from '../store/useStore'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import { executeTask } from '../services/taskExecutor'

export default function TaskManager() {
  const { workers, tasks, addTask, updateTask, deleteTask } = useStore()
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    department: '',
    workerId: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  })

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.workerId) {
      toast.error('Please fill in all required fields')
      return
    }

    const task = {
      ...newTask,
      status: 'pending' as const,
      progress: 0,
    }

    addTask(task)
    toast.success('Task created successfully!')

    // Execute task
    executeTaskAsync(tasks.length.toString(), newTask.workerId)

    setShowNewTask(false)
    setNewTask({
      title: '',
      description: '',
      department: '',
      workerId: '',
      priority: 'medium',
    })
  }

  const executeTaskAsync = async (taskId: string, workerId: string) => {
    try {
      updateTask(taskId, { status: 'in_progress', progress: 0 })

      const result = await executeTask(taskId, workerId)

      if (result.success) {
        updateTask(taskId, {
          status: 'completed',
          progress: 100,
          completedAt: new Date().toISOString(),
          result: result.data,
        })
        toast.success('Task completed successfully!')
      } else {
        updateTask(taskId, {
          status: 'failed',
          error: result.error,
        })
        toast.error('Task failed: ' + result.error)
      }
    } catch (error) {
      updateTask(taskId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      toast.error('Task execution failed')
    }
  }

  const statusIcons = {
    pending: Clock,
    in_progress: Loader,
    completed: CheckCircle,
    failed: XCircle,
  }

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  }

  const priorityColors = {
    low: 'text-gray-600',
    medium: 'text-yellow-600',
    high: 'text-red-600',
  }

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          <p className="text-gray-600 mt-1">Create and manage tasks for your AI workers</p>
        </div>
        <button
          onClick={() => setShowNewTask(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      {/* New Task Modal */}
      <AnimatePresence>
        {showNewTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewTask(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
                <button
                  onClick={() => setShowNewTask(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">Task Title *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g., Write blog post about AI marketing"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    className="input min-h-[100px]"
                    placeholder="Detailed task description..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Assign to Worker *</label>
                    <select
                      className="input"
                      value={newTask.workerId}
                      onChange={(e) => {
                        const worker = workers.find(w => w.id === e.target.value)
                        setNewTask({
                          ...newTask,
                          workerId: e.target.value,
                          department: worker?.department || '',
                        })
                      }}
                    >
                      <option value="">Select worker...</option>
                      {workers.map((worker) => (
                        <option key={worker.id} value={worker.id}>
                          {worker.emoji} {worker.name} - {worker.role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Priority</label>
                    <select
                      className="input"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCreateTask}
                    className="btn-primary flex-1"
                  >
                    Create Task
                  </button>
                  <button
                    onClick={() => setShowNewTask(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No tasks yet</h3>
            <p className="text-gray-600 mb-4">Create your first task to get started</p>
            <button
              onClick={() => setShowNewTask(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Task
            </button>
          </div>
        ) : (
          tasks.map((task, index) => {
            const worker = workers.find((w) => w.id === task.workerId)
            const StatusIcon = statusIcons[task.status]

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusColors[task.status]}`}>
                        <StatusIcon className={`w-3 h-3 ${task.status === 'in_progress' ? 'animate-spin' : ''}`} />
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className={`text-xs font-semibold ${priorityColors[task.priority]}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <span>{worker?.emoji}</span>
                        <span>{worker?.name}</span>
                      </div>
                      <span>•</span>
                      <span>{worker?.department}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress Bar */}
                {task.status === 'in_progress' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">{task.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full gradient-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${task.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {task.error && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-800">
                      <strong>Error:</strong> {task.error}
                    </p>
                  </div>
                )}

                {/* Result */}
                {task.result && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>Result:</strong> {JSON.stringify(task.result, null, 2)}
                    </p>
                  </div>
                )}
              </motion.div>
            )
          })
        )}
      </div>
    </Layout>
  )
}
