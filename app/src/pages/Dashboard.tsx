import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users, CheckCircle, Plus,
  Activity, TrendingUp, AlertCircle, Zap,
  Target, BarChart3
} from 'lucide-react'
import { useStore } from '../store/useStore'
import Layout from '../components/Layout'
import WorkerCard from '../components/WorkerCard'
import ActivityFeed from '../components/ActivityFeed'
import StatsCard from '../components/StatsCard'

export default function Dashboard() {
  const { workers, tasks, workflows } = useStore()
  const [activeWorkers, setActiveWorkers] = useState(0)
  const [completedTasks, setCompletedTasks] = useState(0)

  useEffect(() => {
    setActiveWorkers(workers.filter(w => w.status === 'active').length)
    setCompletedTasks(tasks.filter(t => t.status === 'completed').length)
  }, [workers, tasks])

  // Calculate real metrics
  const todaysTasks = tasks.filter(t => {
    const today = new Date().toDateString()
    return new Date(t.createdAt).toDateString() === today
  })

  const completedToday = todaysTasks.filter(t => t.status === 'completed').length
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length
  const failedTasks = tasks.filter(t => t.status === 'failed').length

  // Calculate success rate from real data
  const totalFinishedTasks = completedTasks + failedTasks
  const successRate = totalFinishedTasks > 0
    ? Math.round((completedTasks / totalFinishedTasks) * 100)
    : 100

  // Calculate workflow completion rate
  const completedWorkflows = workflows.filter(w => w.status === 'completed').length
  const workflowSuccessRate = workflows.length > 0
    ? Math.round((completedWorkflows / workflows.length) * 100)
    : 100

  const stats = [
    {
      label: 'Active Agents',
      value: `${activeWorkers} / ${workers.length}`,
      icon: Users,
      gradient: 'from-purple-500 to-indigo-500',
      change: activeWorkers === workers.length ? 'All agents online' : `${workers.length - activeWorkers} idle`,
      positive: activeWorkers === workers.length
    },
    {
      label: 'Tasks Completed',
      value: completedTasks.toString(),
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-500',
      change: completedToday > 0 ? `${completedToday} completed today` : 'Ready for tasks',
      positive: completedToday > 0
    },
    {
      label: 'In Progress',
      value: inProgressTasks.toString(),
      icon: Zap,
      gradient: 'from-blue-500 to-cyan-500',
      change: inProgressTasks > 0 ? 'Agents working' : 'No active tasks',
      positive: inProgressTasks > 0
    },
    {
      label: 'Success Rate',
      value: `${successRate}%`,
      icon: TrendingUp,
      gradient: 'from-amber-500 to-yellow-500',
      change: `${completedTasks} successful`,
      positive: successRate >= 90
    },
  ]

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Real-time overview of your AI marketing team</p>
        </div>
        <Link to="/manager">
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Campaign
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} index={index} />
        ))}
      </div>

      {/* AI Platform Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-xl"
      >
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary-400" />
          AI Platforms Connected
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <span className="text-2xl">🤖</span>
            <div>
              <p className="text-white font-medium">OpenAI GPT-4</p>
              <p className="text-green-400 text-sm">Primary AI Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <span className="text-2xl">✨</span>
            <div>
              <p className="text-white font-medium">Google Gemini</p>
              <p className="text-blue-400 text-sm">Creative Tasks</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <span className="text-2xl">🔮</span>
            <div>
              <p className="text-white font-medium">DeepSeek</p>
              <p className="text-purple-400 text-sm">Analytics & Data</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Workers Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your AI Team</h2>
          <Link to="/tasks" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
            View all tasks →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workers.map((worker, index) => (
            <WorkerCard key={worker.id} worker={worker} index={index} />
          ))}
        </div>
      </div>

      {/* Activity & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-400" />
              Today's Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Tasks Created</span>
                <span className="font-bold text-white">{todaysTasks.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">In Progress</span>
                <span className="font-bold text-blue-400">
                  {todaysTasks.filter(t => t.status === 'in_progress').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Completed</span>
                <span className="font-bold text-green-400">
                  {completedToday}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Failed</span>
                <span className="font-bold text-red-400">
                  {todaysTasks.filter(t => t.status === 'failed').length}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-400" />
              Performance
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Task Success Rate</span>
                  <span className="font-semibold text-white">{successRate}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${successRate}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className={`h-full ${successRate >= 90 ? 'bg-green-500' : successRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Workflow Completion</span>
                  <span className="font-semibold text-white">{workflowSuccessRate}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${workflowSuccessRate}%` }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="h-full bg-blue-500"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Agent Utilization</span>
                  <span className="font-semibold text-white">
                    {Math.round((activeWorkers / workers.length) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(activeWorkers / workers.length) * 100}%` }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="h-full bg-purple-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Workflow Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-400" />
              Campaigns
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Campaigns</span>
                <span className="font-bold text-white">{workflows.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Completed</span>
                <span className="font-bold text-green-400">{completedWorkflows}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">In Progress</span>
                <span className="font-bold text-blue-400">
                  {workflows.filter(w => w.status === 'in_progress').length}
                </span>
              </div>
            </div>
          </motion.div>

          {workers.some(w => w.status === 'error') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Attention Required
              </h3>
              <p className="text-sm text-red-300">
                Some agents are experiencing issues. Check their status for details.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  )
}
