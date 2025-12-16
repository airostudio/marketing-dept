import { useState } from 'react'
import { Save, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { useStore } from '../store/useStore'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'

export default function Settings() {
  const { apiCredentials, setApiCredential, resetSetup } = useStore()
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const platforms = [
    { id: 'gemini', name: 'Google Gemini', worker: 'Creative Agents', description: 'Powers Scotty, Jasper, Casey, Sage, Dynamo, Surfy, Chatty' },
    { id: 'deepseek', name: 'DeepSeek AI', worker: 'Technical Agents', description: 'Powers Zoey, Hunter, Smarta, Analyzer, Heatley' },
    { id: 'jasperAi', name: 'Jasper AI', worker: 'Jasper (legacy)' },
    { id: 'zoomInfo', name: 'ZoomInfo', worker: 'Zoey' },
    { id: 'seventhSense', name: 'Seventh Sense', worker: 'Sage' },
    { id: 'smartlyIo', name: 'Smartly.io', worker: 'Smarta' },
    { id: 'dynamicYield', name: 'Dynamic Yield', worker: 'Dynamo' },
    { id: 'googleAnalytics', name: 'Google Analytics', worker: 'Analyzer' },
    { id: 'surferSeo', name: 'Surfer SEO', worker: 'Surfy' },
    { id: 'intercom', name: 'Intercom', worker: 'Chatty' },
  ]

  const handleSave = (platformId: string) => {
    toast.success(`${platformId} credentials saved`)
  }

  const toggleShowKey = (platformId: string) => {
    setShowKeys({ ...showKeys, [platformId]: !showKeys[platformId] })
  }

  const handleReset = () => {
    resetSetup()
    toast.success('Setup reset successfully. Redirecting to setup wizard...')
  }

  return (
    <Layout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your API credentials and platform connections</p>
        </div>

        {/* API Credentials */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">API Credentials</h2>

          <div className="space-y-6">
            {platforms.map((platform) => {
              const currentKey = apiCredentials[platform.id as keyof typeof apiCredentials]
              const isVisible = showKeys[platform.id]

              return (
                <div key={platform.id} className="pb-6 border-b border-gray-200 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                      <p className="text-sm text-gray-600">Powers: {platform.worker}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      currentKey ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {currentKey ? 'Connected' : 'Not Connected'}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type={isVisible ? 'text' : 'password'}
                        className="input pr-12 font-mono text-sm"
                        placeholder="Enter API key..."
                        value={currentKey || ''}
                        onChange={(e) => setApiCredential(platform.id, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowKey(platform.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <button
                      onClick={() => handleSave(platform.id)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Security Notice */}
        <div className="card bg-blue-50 border-blue-200 mb-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Security Notice</h3>
              <p className="text-sm text-blue-800">
                Your API keys are stored locally in your browser using encrypted localStorage.
                They are never sent to any server except the respective API platforms.
                For production use, consider implementing a secure backend proxy.
              </p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card border-red-200 bg-red-50">
          <h2 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h2>
          <p className="text-sm text-red-800 mb-4">
            Resetting will clear all your API credentials and take you back to the setup wizard.
            All tasks and worker data will be preserved.
          </p>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Reset Setup
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
