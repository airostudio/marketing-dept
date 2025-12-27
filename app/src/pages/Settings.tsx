import { useState } from 'react'
import { Save, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { useStore } from '../store/useStore'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'

export default function Settings() {
  const { apiCredentials, setApiCredential, verifyApi, resetSetup } = useStore()
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [verifying, setVerifying] = useState<Record<string, boolean>>({})

  const platforms = [
    {
      id: 'gemini',
      name: 'Google Gemini',
      description: 'Powers 7 creative agents: Scotty, Marcus Hayes, Emma Thompson, Emma Wilson, Maya Patel, Oscar Wright, Natalie Brooks',
      isPrimary: true,
      docs: 'https://ai.google.dev/gemini-api/docs/api-key'
    },
    {
      id: 'deepseek',
      name: 'DeepSeek AI',
      description: 'Powers 5 technical agents: Sarah Chen, David Kim, Alex Rodriguez, Ryan Mitchell, Sophia Anderson',
      isPrimary: true,
      docs: 'https://platform.deepseek.com/api-docs/'
    },
  ]

  const handleSave = async (platformId: string) => {
    const apiKey = apiCredentials[platformId as keyof typeof apiCredentials]

    if (!apiKey || !apiKey.trim()) {
      toast.error('Please enter an API key first')
      return
    }

    setVerifying({ ...verifying, [platformId]: true })

    try {
      const isValid = await verifyApi(platformId)

      if (isValid) {
        toast.success(`${platformId} API key verified and saved!`)
      } else {
        toast.error(`${platformId} API key validation failed. Please check your key.`)
      }
    } catch (error) {
      toast.error(`Failed to verify ${platformId} API key: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setVerifying({ ...verifying, [platformId]: false })
    }
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
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          currentKey ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {currentKey ? 'Connected' : 'Setup Required'}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{platform.description}</p>
                      {platform.docs && (
                        <a
                          href={platform.docs}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Get API Key →
                        </a>
                      )}
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
                      disabled={verifying[platform.id]}
                      className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {verifying[platform.id] ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Verify & Save
                        </>
                      )}
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
