import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useStore } from '../store/useStore'
import Layout from '../components/Layout'

export default function WorkerDetail() {
  const { workerId } = useParams()
  const { workers, tasks } = useStore()

  const worker = workers.find((w) => w.id === workerId)
  const workerTasks = tasks.filter((t) => t.workerId === workerId)

  if (!worker) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-2">Worker not found</h2>
          <Link to="/" className="text-primary-500 hover:text-primary-400">
            ← Back to Dashboard
          </Link>
        </div>
      </Layout>
    )
  }

  const statusColors = {
    active: 'bg-green-500/10 text-green-400 border border-green-500/20',
    idle: 'bg-gray-700/50 text-gray-300 border border-gray-600',
    error: 'bg-red-500/10 text-red-400 border border-red-500/20',
  }

  return (
    <Layout>
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Worker Header */}
      <div className="gradient-primary rounded-2xl p-8 text-white mb-8 shadow-xl shadow-primary-500/20">
        <div className="flex items-start gap-6">
          <div className="text-7xl">{worker.emoji}</div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{worker.name}</h1>
            <p className="text-xl mb-4 text-white/90">{worker.role}</p>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Department:</span>
                <span>{worker.department}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Platform:</span>
                <span>{worker.platform}</span>
              </div>
              <span>•</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[worker.status]}`}>
                {worker.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tasks */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">Tasks</h2>
            {workerTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No tasks assigned yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {workerTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white">{task.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        task.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        task.status === 'in_progress' ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' :
                        task.status === 'failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-gray-700/50 text-gray-300 border border-gray-600'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-400 mb-2">{task.description}</p>
                    )}
                    {task.status === 'in_progress' && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full">
                          <div
                            className="h-full gradient-primary rounded-full transition-all shadow-lg shadow-primary-500/30"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Capabilities */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">Capabilities</h2>
            <div className="grid grid-cols-2 gap-3">
              {getCapabilitiesForWorker(worker.id).map((capability, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-primary-500/10 rounded-lg border border-primary-500/20 hover:bg-primary-500/20 transition-colors"
                >
                  <div className="w-2 h-2 bg-primary-500 rounded-full shadow-sm shadow-primary-500" />
                  <span className="text-sm text-gray-300">{capability}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="card">
            <h3 className="font-bold text-white mb-4">Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[worker.status]}`}>
                  {worker.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Availability</span>
                <span className="font-semibold text-white">24/7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Active Tasks</span>
                <span className="font-semibold text-white">
                  {workerTasks.filter(t => t.status === 'in_progress').length}
                </span>
              </div>
            </div>
          </div>

          {/* Platform Info */}
          <div className="card">
            <h3 className="font-bold text-white mb-4">Platform</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400 mb-1">Connected to</p>
                <p className="font-semibold text-white">{worker.platform}</p>
              </div>
              <a
                href={getPlatformUrl(worker.platform)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-400 text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Platform Docs
              </a>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/tasks">
                <button className="w-full btn-primary text-sm py-2">
                  Assign New Task
                </button>
              </Link>
              <Link to="/settings">
                <button className="w-full btn-secondary text-sm py-2">
                  Configure Settings
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function getCapabilitiesForWorker(workerId: string): string[] {
  const capabilities: Record<string, string[]> = {
    jasper: ['Blog posts', 'Marketing copy', 'Social media content', 'Product descriptions', 'Email campaigns', 'Ad copy'],
    zoey: ['B2B lead discovery', 'Contact enrichment', 'Company intelligence', 'Decision maker identification', 'Lead scoring', 'Intent data'],
    sage: ['Send-time optimization', 'Engagement prediction', 'Email frequency optimization', 'Behavioral analysis', 'A/B testing', 'Campaign performance'],
    smarta: ['Ad automation', 'Budget optimization', 'Creative testing', 'Audience targeting', 'Multi-platform campaigns', 'ROAS optimization'],
    dynamo: ['Website personalization', 'A/B testing', 'Product recommendations', 'Behavioral targeting', 'Mobile optimization', 'Email personalization'],
    analyzer: ['Traffic analysis', 'Conversion tracking', 'User behavior', 'Attribution modeling', 'Anomaly detection', 'Custom reporting'],
    surfy: ['Content optimization', 'Keyword research', 'SERP analysis', 'On-page SEO', 'Competitor analysis', 'Rank tracking'],
    chatty: ['Live chat', 'Automated responses', 'Ticket management', 'Knowledge base', '24/7 availability', 'Multi-language support'],
  }
  return capabilities[workerId] || []
}

function getPlatformUrl(platform: string): string {
  const urls: Record<string, string> = {
    'Jasper AI': 'https://docs.jasper.ai',
    'ZoomInfo': 'https://api-docs.zoominfo.com',
    'Seventh Sense': 'https://theseventhsense.com',
    'Smartly.io': 'https://developers.smartly.io',
    'Dynamic Yield': 'https://adm-api.dynamicyield.com/api/docs',
    'Google Analytics': 'https://developers.google.com/analytics',
    'Surfer SEO': 'https://docs.surferseo.com',
    'Intercom': 'https://developers.intercom.com',
  }
  return urls[platform] || '#'
}
