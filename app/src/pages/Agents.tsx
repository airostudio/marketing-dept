import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Search, Filter } from 'lucide-react'
import { useState } from 'react'
import Layout from '../components/Layout'
import { useStore } from '../store/useStore'
import { getAgentConfig } from '../services/agentLoader'

export default function Agents() {
  const { workers, tasks } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')

  // Get unique departments
  const departments = [...new Set(workers.map(w => w.department))]

  // Filter workers
  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         worker.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = departmentFilter === 'all' || worker.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  // Get task counts for each worker
  const getWorkerStats = (workerId: string) => {
    const workerTasks = tasks.filter(t => t.workerId === workerId)
    return {
      total: workerTasks.length,
      completed: workerTasks.filter(t => t.status === 'completed').length,
      inProgress: workerTasks.filter(t => t.status === 'in_progress').length
    }
  }

  const getPlatformInfo = (platform: string) => {
    if (platform.includes('OpenAI') || platform.includes('GPT')) {
      return { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '🤖' }
    } else if (platform.includes('Gemini')) {
      return { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: '✨' }
    } else if (platform.includes('DeepSeek')) {
      return { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: '🔮' }
    }
    return { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: '🔧' }
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-primary-400" />
          <h1 className="text-3xl font-bold text-white">AI Agents</h1>
        </div>
        <p className="text-gray-400">Your team of specialized AI marketing professionals</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="pl-10 pr-8 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Agent Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Agents</p>
          <p className="text-3xl font-bold text-white">{workers.length}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Active</p>
          <p className="text-3xl font-bold text-green-400">{workers.filter(w => w.status === 'active').length}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Idle</p>
          <p className="text-3xl font-bold text-gray-400">{workers.filter(w => w.status === 'idle').length}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Departments</p>
          <p className="text-3xl font-bold text-primary-400">{departments.length}</p>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkers.map((worker, index) => {
          const config = getAgentConfig(worker.id)
          const stats = getWorkerStats(worker.id)
          const platformInfo = getPlatformInfo(worker.platform)

          return (
            <motion.div
              key={worker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/worker/${worker.id}`}>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-primary-500/50 transition-all cursor-pointer group">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-3xl shadow-lg group-hover:scale-105 transition-transform">
                      {worker.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-lg truncate">{worker.name}</h3>
                      <p className="text-primary-400 text-sm">{worker.role}</p>
                      <p className="text-gray-500 text-xs mt-1">{worker.department}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      worker.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      worker.status === 'idle' ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' :
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {worker.status === 'active' ? 'Online' : worker.status}
                    </div>
                  </div>

                  {/* Experience */}
                  {config?.experience && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-1">
                      {config.experience}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-gray-900/50 rounded-lg p-2 text-center">
                      <p className="text-white font-bold">{stats.total}</p>
                      <p className="text-gray-500 text-xs">Tasks</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-2 text-center">
                      <p className="text-green-400 font-bold">{stats.completed}</p>
                      <p className="text-gray-500 text-xs">Done</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-2 text-center">
                      <p className="text-blue-400 font-bold">{stats.inProgress}</p>
                      <p className="text-gray-500 text-xs">Active</p>
                    </div>
                  </div>

                  {/* Platform */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${platformInfo.color}`}>
                    <span>{platformInfo.icon}</span>
                    <span className="text-sm font-medium">{worker.platform}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {filteredWorkers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No agents found</p>
          <p className="text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      )}
    </Layout>
  )
}
