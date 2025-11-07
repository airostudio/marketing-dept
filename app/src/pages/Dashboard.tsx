import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, CheckCircle, DollarSign, Clock, Plus,
  Activity, TrendingUp, AlertCircle
} from 'lucide-react'
import { useStore } from '../store/useStore'
import Layout from '../components/Layout'
import WorkerCard from '../components/WorkerCard'
import ActivityFeed from '../components/ActivityFeed'
import StatsCard from '../components/StatsCard'

export default function Dashboard() {
  const { workers, tasks } = useStore()
  const [activeWorkers, setActiveWorkers] = useState(0)
  const [completedTasks, setCompletedTasks] = useState(0)

  useEffect(() => {
    setActiveWorkers(workers.filter(w => w.status === 'active').length)
    setCompletedTasks(tasks.filter(t => t.status === 'completed').length)
  }, [workers, tasks])

  const todaysTasks = tasks.filter(t => {
    const today = new Date().toDateString()
    return new Date(t.createdAt).toDateString() === today
  })

  const stats = [
    {
      label: 'Active AI Workers',
      value: `${activeWorkers} / ${workers.length}`,
      icon: Users,
      gradient: 'from-purple-500 to-indigo-500',
      change: activeWorkers === workers.length ? 'All systems operational' : `${workers.length - activeWorkers} idle`,
      positive: activeWorkers === workers.length
    },
    {
      label: 'Tasks Completed Today',
      value: completedTasks.toString(),
      icon: CheckCircle,
      gradient: 'from-pink-500 to-rose-500',
      change: '+32% vs yesterday',
      positive: true
    },
    {
      label: 'Revenue Impact',
      value: '$45.2K',
      icon: DollarSign,
      gradient: 'from-blue-500 to-cyan-500',
      change: '+18% this week',
      positive: true
    },
    {
      label: 'Time Saved',
      value: '89 hrs',
      icon: Clock,
      gradient: 'from-amber-500 to-yellow-500',
      change: 'This week',
      positive: true
    },
  ]

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <Link to="/tasks">
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Task
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} index={index} />
        ))}
      </div>

      {/* Workers Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your AI Workers</h2>
          <Link to="/tasks" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors">
            View all tasks →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workers.map((worker, index) => (
            <WorkerCard key={worker.id} worker={worker} index={index} />
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-500" />
              Today's Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Tasks Created</span>
                <span className="font-bold text-white">{todaysTasks.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">In Progress</span>
                <span className="font-bold text-white">
                  {todaysTasks.filter(t => t.status === 'in_progress').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Completed</span>
                <span className="font-bold text-green-400">
                  {todaysTasks.filter(t => t.status === 'completed').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Failed</span>
                <span className="font-bold text-red-400">
                  {todaysTasks.filter(t => t.status === 'failed').length}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              Performance
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Success Rate</span>
                  <span className="font-semibold text-white">94%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 shadow-sm shadow-green-500" style={{ width: '94%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Efficiency</span>
                  <span className="font-semibold text-white">87%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 shadow-sm shadow-primary-500" style={{ width: '87%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Utilization</span>
                  <span className="font-semibold text-white">76%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-500 shadow-sm shadow-secondary-500" style={{ width: '76%' }} />
                </div>
              </div>
            </div>
          </div>

          {workers.some(w => w.status === 'error') && (
            <div className="card bg-red-500/10 border-red-500/30">
              <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Attention Required
              </h3>
              <p className="text-sm text-red-300">
                Some workers are experiencing issues. Check their status for details.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
