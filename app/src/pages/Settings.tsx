import { Shield, Check, X, Info } from 'lucide-react'
import { useStore } from '../store/useStore'
import Layout from '../components/Layout'

export default function Settings() {
  const { getConfiguredPlatforms } = useStore()
  const configuredPlatforms = getConfiguredPlatforms()

  const platforms = [
    { id: 'googleGemini', name: 'Google Gemini', worker: 'Jasper' },
    { id: 'rytrAi', name: 'Rytr AI', worker: 'Casey' },
    { id: 'zoomInfo', name: 'ZoomInfo', worker: 'Zoey' },
    { id: 'hunterIo', name: 'Hunter.io', worker: 'Hunter' },
    { id: 'mailchimp', name: 'Mailchimp', worker: 'Sage' },
    { id: 'smartlyIo', name: 'Smartly.io', worker: 'Smarta' },
    { id: 'dynamicYield', name: 'Dynamic Yield', worker: 'Dynamo' },
    { id: 'googleAnalytics', name: 'Google Analytics', worker: 'Analyzer' },
    { id: 'hotjar', name: 'Hotjar', worker: 'Heatley' },
    { id: 'surferSeo', name: 'Surfer SEO', worker: 'Surfy' },
    { id: 'intercom', name: 'Intercom', worker: 'Chatty' },
  ]

  return (
    <Layout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">View your API configuration and platform connections</p>
        </div>

        {/* Security Notice */}
        <div className="card bg-green-50 border-green-200 mb-6">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">Secure Configuration</h3>
              <p className="text-sm text-green-800">
                All API keys are configured via secure environment variables and are never stored in your browser.
                This ensures your credentials remain protected and cannot be accessed by client-side code.
              </p>
            </div>
          </div>
        </div>

        {/* API Status */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">API Configuration Status</h2>

          <div className="space-y-4">
            {platforms.map((platform) => {
              const isConfigured = configuredPlatforms.includes(platform.id)

              return (
                <div key={platform.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isConfigured ? 'bg-green-100' : 'bg-gray-200'
                    }`}>
                      {isConfigured ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                      <p className="text-sm text-gray-600">Powers: {platform.worker}</p>
                    </div>
                    <div className="text-right">
                      {isConfigured ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-gray-400">••••••••••••</span>
                          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            Configured
                          </div>
                        </div>
                      ) : (
                        <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          Not Configured
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Configuration Info */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">How to Update API Keys</h3>
              <p className="text-sm text-blue-800 mb-2">
                API keys are managed through environment variables. To add or update keys:
              </p>
              <ol className="text-sm text-blue-800 list-decimal list-inside space-y-1">
                <li>Access your Vercel project dashboard</li>
                <li>Navigate to Settings → Environment Variables</li>
                <li>Add or update the relevant VITE_* environment variables</li>
                <li>Redeploy your application for changes to take effect</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
