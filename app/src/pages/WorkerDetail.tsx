import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Rocket } from 'lucide-react'
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Worker not found</h2>
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            ← Back to Dashboard
          </Link>
        </div>
      </Layout>
    )
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    idle: 'bg-gray-100 text-gray-800',
    error: 'bg-red-100 text-red-800',
  }

  return (
    <Layout>
      <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Worker Header */}
      <div className="gradient-primary rounded-2xl p-8 text-white mb-8">
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tasks</h2>
            {workerTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No tasks assigned yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {workerTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        task.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    )}
                    {task.status === 'in_progress' && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full">
                          <div
                            className="h-full gradient-primary rounded-full transition-all"
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Capabilities</h2>
            <div className="grid grid-cols-2 gap-3">
              {getCapabilitiesForWorker(worker.id).map((capability, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-gradient-to-r from-primary-50 to-secondary-50/30 rounded-lg"
                >
                  <div className="w-2 h-2 bg-primary-500 rounded-full" />
                  <span className="text-sm text-gray-700">{capability}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[worker.status]}`}>
                  {worker.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Availability</span>
                <span className="font-semibold text-gray-900">24/7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Tasks</span>
                <span className="font-semibold text-gray-900">
                  {workerTasks.filter(t => t.status === 'in_progress').length}
                </span>
              </div>
            </div>
          </div>

          {/* Platform Info */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">Platform</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Connected to</p>
                <p className="font-semibold text-gray-900">{worker.platform}</p>
              </div>
              <a
                href={getPlatformUrl(worker.platform)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                View Platform Docs
              </a>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {worker.id === 'hunter' && (
                <Link to="/hunter/workspace">
                  <button className="w-full btn-primary text-sm py-2 flex items-center justify-center gap-2">
                    <Rocket className="w-4 h-4" />
                    Launch Hunter
                  </button>
                </Link>
              )}
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
    casey: ['Marketing copy', 'Sales emails', 'Product descriptions', 'Social media posts', 'Blog outlines', 'Website copy'],
    zoey: ['B2B lead discovery', 'Contact enrichment', 'Company intelligence', 'Decision maker identification', 'Lead scoring', 'Intent data'],
    hunter: ['Email finding', 'Email verification', 'Domain search', 'Lead hunting', 'Bulk discovery', 'Contact validation'],
    sage: ['Send-time optimization', 'Engagement prediction', 'Email frequency optimization', 'Behavioral analysis', 'A/B testing', 'Campaign performance'],
    smarta: ['Ad automation', 'Budget optimization', 'Creative testing', 'Audience targeting', 'Multi-platform campaigns', 'ROAS optimization'],
    dynamo: ['Website personalization', 'A/B testing', 'Product recommendations', 'Behavioral targeting', 'Mobile optimization', 'Email personalization'],
    analyzer: ['Traffic analysis', 'Conversion tracking', 'User behavior', 'Attribution modeling', 'Anomaly detection', 'Custom reporting'],
    heatley: ['Heatmaps', 'Session recordings', 'Feedback polls', 'User behavior analysis', 'Conversion funnels', 'Form analytics'],
    surfy: ['Content optimization', 'Keyword research', 'SERP analysis', 'On-page SEO', 'Competitor analysis', 'Rank tracking'],
    chatty: ['Live chat', 'Automated responses', 'Ticket management', 'Knowledge base', '24/7 availability', 'Multi-language support'],
  }
  return capabilities[workerId] || []
}

function getPlatformUrl(platform: string): string {
  const urls: Record<string, string> = {
    'Jasper AI': 'https://docs.jasper.ai',
    'Copy.ai': 'https://www.copy.ai',
    'ZoomInfo': 'https://api-docs.zoominfo.com',
    'Hunter.io': 'https://hunter.io/api-documentation',
    'Mailchimp': 'https://mailchimp.com/developer',
    'Smartly.io': 'https://developers.smartly.io',
    'Dynamic Yield': 'https://adm-api.dynamicyield.com/api/docs',
    'Google Analytics': 'https://developers.google.com/analytics',
    'Hotjar': 'https://www.hotjar.com/api',
    'Surfer SEO': 'https://docs.surferseo.com',
    'Intercom': 'https://developers.intercom.com',
  }
  return urls[platform] || '#'
}
