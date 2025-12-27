import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Award,
  Briefcase,
  Clock,
  TrendingUp,
  CheckCircle,
  Zap,
  Star,
  Target,
  MessageSquare,
  RefreshCw
} from 'lucide-react'
import { useStore } from '../store/useStore'
import Layout from '../components/Layout'
import AgentActivityFeed from '../components/AgentActivityFeed'
import { getAgentConfig, AgentConfig } from '../services/agentLoader'
import { geminiService } from '../services/gemini'

export default function WorkerDetail() {
  const { workerId } = useParams()
  const { workers, tasks } = useStore()
  const [agentConfig, setAgentConfig] = useState<AgentConfig | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false)

  const worker = workers.find((w) => w.id === workerId)
  const workerTasks = tasks.filter((t) => t.workerId === workerId)

  useEffect(() => {
    if (workerId) {
      const config = getAgentConfig(workerId)
      if (config) {
        setAgentConfig(config)
      }
    }
  }, [workerId])

  // Generate a placeholder avatar based on agent info
  const generateAvatarPrompt = (config: AgentConfig) => {
    const roleKeywords = config.role.toLowerCase()
    let style = 'professional business'

    if (roleKeywords.includes('creative') || roleKeywords.includes('content')) {
      style = 'creative artistic'
    } else if (roleKeywords.includes('data') || roleKeywords.includes('analytics')) {
      style = 'tech-focused analytical'
    } else if (roleKeywords.includes('sales') || roleKeywords.includes('marketing')) {
      style = 'confident executive'
    }

    return `3D cartoon avatar of a ${style} professional, friendly expression, modern style, vibrant colors, clean background, high quality render`
  }

  const handleGenerateAvatar = async () => {
    if (!agentConfig || !geminiService.isConfigured()) return

    setIsGeneratingAvatar(true)
    try {
      // In a real implementation, this would call an image generation API
      // For now, we'll use a placeholder approach
      const prompt = generateAvatarPrompt(agentConfig)
      console.log('Avatar generation prompt:', prompt)

      // Placeholder: Generate a unique gradient based on agent ID
      const gradients = [
        'from-blue-500 to-purple-600',
        'from-green-500 to-teal-600',
        'from-orange-500 to-red-600',
        'from-pink-500 to-rose-600',
        'from-indigo-500 to-blue-600',
        'from-yellow-500 to-orange-600',
        'from-cyan-500 to-blue-600',
        'from-violet-500 to-purple-600',
      ]
      const gradientIndex = agentConfig.name.charCodeAt(0) % gradients.length
      setAvatarUrl(`gradient:${gradients[gradientIndex]}`)
    } catch (error) {
      console.error('Failed to generate avatar:', error)
    } finally {
      setIsGeneratingAvatar(false)
    }
  }

  if (!worker) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-2">Agent not found</h2>
          <Link to="/" className="text-primary-400 hover:text-primary-300">
            Back to Dashboard
          </Link>
        </div>
      </Layout>
    )
  }

  const statusColors = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    idle: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  const completedTasks = workerTasks.filter(t => t.status === 'completed').length
  const inProgressTasks = workerTasks.filter(t => t.status === 'in_progress').length
  const successRate = workerTasks.length > 0
    ? Math.round((completedTasks / workerTasks.length) * 100)
    : 100

  // Get AI platform display info
  const getPlatformInfo = (platform: string) => {
    if (platform.includes('OpenAI') || platform.includes('GPT')) {
      return { name: 'OpenAI GPT-4', color: 'from-green-500 to-emerald-600', icon: '🤖' }
    } else if (platform.includes('Gemini')) {
      return { name: 'Google Gemini', color: 'from-blue-500 to-cyan-600', icon: '✨' }
    } else if (platform.includes('DeepSeek')) {
      return { name: 'DeepSeek', color: 'from-purple-500 to-indigo-600', icon: '🔮' }
    }
    return { name: platform, color: 'from-gray-500 to-gray-600', icon: '🔧' }
  }

  const platformInfo = getPlatformInfo(worker.platform)

  return (
    <Layout>
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Agent Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-8 mb-8"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full blur-3xl" />

        <div className="relative flex items-start gap-8">
          {/* Avatar Section */}
          <div className="flex-shrink-0">
            <div
              className={`w-32 h-32 rounded-2xl flex items-center justify-center text-6xl shadow-lg ${
                avatarUrl?.startsWith('gradient:')
                  ? `bg-gradient-to-br ${avatarUrl.replace('gradient:', '')}`
                  : 'bg-gradient-to-br from-primary-500 to-secondary-500'
              }`}
            >
              {worker.emoji}
            </div>
            <button
              onClick={handleGenerateAvatar}
              disabled={isGeneratingAvatar}
              className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 text-xs rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isGeneratingAvatar ? 'animate-spin' : ''}`} />
              Generate 3D Avatar
            </button>
          </div>

          {/* Info Section */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{worker.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[worker.status]}`}>
                {worker.status === 'active' ? 'Online' : worker.status}
              </span>
            </div>

            <p className="text-xl text-primary-400 mb-4">{worker.role}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{worker.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>{agentConfig?.experience || '10+ years experience'}</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${platformInfo.color}`}>
                <span>{platformInfo.icon}</span>
                <span className="text-white font-medium">{platformInfo.name}</span>
              </div>
            </div>

            {/* Specializations */}
            {agentConfig?.specializations && (
              <div className="flex flex-wrap gap-2">
                {agentConfig.specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400 text-sm">Total Tasks</span>
          </div>
          <div className="text-3xl font-bold text-white">{workerTasks.length}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-gray-400 text-sm">Completed</span>
          </div>
          <div className="text-3xl font-bold text-white">{completedTasks}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400 text-sm">In Progress</span>
          </div>
          <div className="text-3xl font-bold text-white">{inProgressTasks}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-gray-400 text-sm">Success Rate</span>
          </div>
          <div className="text-3xl font-bold text-white">{successRate}%</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          {agentConfig?.systemPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary-400" />
                About {worker.name.split(' ')[0]}
              </h2>
              <div className="text-gray-300 text-sm leading-relaxed max-h-60 overflow-y-auto pr-2">
                {agentConfig.systemPrompt.split('\n\n').slice(0, 2).map((para, i) => (
                  <p key={i} className="mb-3">{para}</p>
                ))}
              </div>
            </motion.div>
          )}

          {/* Capabilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Capabilities
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {(agentConfig?.capabilities || getCapabilitiesForWorker(worker.id)).map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center gap-2 p-3 bg-gradient-to-r from-primary-500/10 to-transparent rounded-lg border border-primary-500/20"
                >
                  <div className="w-2 h-2 bg-primary-500 rounded-full" />
                  <span className="text-sm text-gray-300">{capability}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Recent Tasks</h2>
            {workerTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No tasks assigned yet</p>
                <p className="text-sm mt-1">Tasks will appear here once assigned</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {workerTasks.slice(0, 10).map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white">{task.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                        task.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-400 mb-2 line-clamp-2">{task.description}</p>
                    )}
                    {task.status === 'in_progress' && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${task.progress}%` }}
                            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Real-Time Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
          >
            <AgentActivityFeed agentId={worker.id} agentName={worker.name} maxActivities={15} />
          </motion.div>

          {/* Platform Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
          >
            <h3 className="font-bold text-white mb-4">AI Platform</h3>
            <div className={`p-4 rounded-lg bg-gradient-to-r ${platformInfo.color} mb-4`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{platformInfo.icon}</span>
                <div>
                  <p className="text-white font-semibold">{platformInfo.name}</p>
                  <p className="text-white/80 text-sm">Powering this agent</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="text-green-400 font-medium">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Model</span>
                <span className="text-gray-300">{agentConfig?.aiPlatform.model || 'Latest'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Availability</span>
                <span className="text-gray-300">24/7</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
          >
            <h3 className="font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/manager">
                <button className="w-full btn-primary text-sm py-2.5">
                  Assign New Task
                </button>
              </Link>
              <Link to="/tasks">
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white text-sm py-2.5 rounded-lg transition-colors">
                  View All Tasks
                </button>
              </Link>
              <Link to="/settings">
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white text-sm py-2.5 rounded-lg transition-colors">
                  Configure Settings
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Reports To */}
          {agentConfig?.reportsTo && agentConfig.reportsTo !== 'ceo' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
            >
              <h3 className="font-bold text-white mb-4">Reports To</h3>
              <Link to={`/worker/${agentConfig.reportsTo}`}>
                <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-xl">
                    👔
                  </div>
                  <div>
                    <p className="text-white font-medium">Scott Morrison</p>
                    <p className="text-gray-400 text-sm">VP of Sales & Marketing</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  )
}

function getCapabilitiesForWorker(workerId: string): string[] {
  const capabilities: Record<string, string[]> = {
    scotty: ['Strategic Planning', 'Team Leadership', 'Revenue Operations', 'Campaign Orchestration'],
    madison: ['Deliverable Management', 'Quality Assurance', 'Project Tracking', 'Executive Summaries'],
    jasper: ['Blog Writing', 'White Papers', 'Case Studies', 'SEO Content'],
    marcus: ['Content Strategy', 'SEO Planning', 'Audience Research', 'Editorial Calendar'],
    casey: ['Ad Copy', 'Landing Pages', 'Email Copy', 'Headlines'],
    zoey: ['Lead Prospecting', 'ICP Development', 'Contact Discovery', 'Lead Scoring'],
    hunter: ['Email Finding', 'Email Verification', 'Contact Enrichment', 'Data Validation'],
    sage: ['Email Campaigns', 'Automation', 'A/B Testing', 'List Segmentation'],
    smarta: ['Paid Social', 'Ad Creative', 'Audience Targeting', 'ROAS Optimization'],
    dynamo: ['A/B Testing', 'Personalization', 'Funnel Optimization', 'CRO'],
    analyzer: ['Marketing Analytics', 'Attribution', 'Data Visualization', 'ROI Analysis'],
    heatley: ['Heatmaps', 'Session Recording', 'UX Research', 'User Surveys'],
    surfy: ['Technical SEO', 'On-Page SEO', 'Keyword Research', 'Link Building'],
    chatty: ['Customer Support', 'Knowledge Base', 'CSAT', 'Retention'],
  }
  return capabilities[workerId] || []
}
