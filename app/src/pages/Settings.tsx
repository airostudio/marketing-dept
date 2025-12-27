import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Eye, EyeOff, AlertTriangle, Shield, Zap, CheckCircle } from 'lucide-react'
import { useStore } from '../store/useStore'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'

export default function Settings() {
  const { apiCredentials, setApiCredential, resetSetup, verifyApi, verifiedApis } = useStore()
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [verifying, setVerifying] = useState<string | null>(null)

  // Primary AI Platforms
  const aiPlatforms = [
    {
      id: 'openai',
      name: 'OpenAI (ChatGPT)',
      icon: '🤖',
      color: 'from-green-500 to-emerald-600',
      agents: 'Scott, Madison, James, Marcus, Casey, Sarah, Diana, Charlotte',
      description: 'GPT-4 Turbo - Primary AI engine for strategic and creative agents'
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      icon: '✨',
      color: 'from-blue-500 to-cyan-600',
      agents: 'Samuel, Steven',
      description: 'Gemini 2.0 - Powers social media and SEO agents'
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      icon: '🔮',
      color: 'from-purple-500 to-indigo-600',
      agents: 'Zoe, Hunter, Alex, Hannah',
      description: 'DeepSeek Chat - Powers lead gen and analytics agents'
    },
  ]

  // Optional integration platforms
  const integrationPlatforms = [
    { id: 'zoomInfo', name: 'ZoomInfo', agent: 'Lead enrichment data' },
    { id: 'hunterIo', name: 'Hunter.io', agent: 'Email verification' },
    { id: 'mailchimp', name: 'Mailchimp', agent: 'Email campaigns' },
    { id: 'googleAnalytics', name: 'Google Analytics', agent: 'Analytics data' },
    { id: 'hotjar', name: 'Hotjar', agent: 'Heatmap data' },
    { id: 'surferSeo', name: 'Surfer SEO', agent: 'SEO optimization' },
    { id: 'intercom', name: 'Intercom', agent: 'Customer support' },
  ]

  const handleSave = (platformId: string) => {
    toast.success(`${platformId} credentials saved`)
  }

  const toggleShowKey = (platformId: string) => {
    setShowKeys({ ...showKeys, [platformId]: !showKeys[platformId] })
  }

  const handleVerify = async (platformId: string) => {
    setVerifying(platformId)
    try {
      const result = await verifyApi(platformId)
      if (result) {
        toast.success(`${platformId} connection verified!`)
      } else {
        toast.error(`Failed to verify ${platformId} connection`)
      }
    } catch (error) {
      toast.error(`Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setVerifying(null)
    }
  }

  const handleReset = () => {
    resetSetup()
    toast.success('Setup reset successfully. Redirecting to setup wizard...')
  }

  return (
    <Layout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Manage your AI platform connections and integrations</p>
        </div>

        {/* Primary AI Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-primary-400" />
            <h2 className="text-xl font-bold text-white">AI Platforms</h2>
          </div>

          <div className="space-y-6">
            {aiPlatforms.map((platform) => {
              const currentKey = apiCredentials[platform.id as keyof typeof apiCredentials]
              const isVisible = showKeys[platform.id]
              const isVerified = verifiedApis.includes(platform.id)
              const isVerifying = verifying === platform.id

              return (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-gray-900/50 rounded-xl border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-2xl`}>
                        {platform.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{platform.name}</h3>
                        <p className="text-sm text-gray-400">{platform.description}</p>
                        <p className="text-xs text-primary-400 mt-1">Agents: {platform.agents}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      isVerified
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : currentKey
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}>
                      {isVerified ? 'Verified' : currentKey ? 'Pending Verification' : 'Not Connected'}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type={isVisible ? 'text' : 'password'}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder={`Enter ${platform.name} API key...`}
                        value={currentKey || ''}
                        onChange={(e) => setApiCredential(platform.id, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowKey(platform.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <button
                      onClick={() => handleSave(platform.id)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    {currentKey && (
                      <button
                        onClick={() => handleVerify(platform.id)}
                        disabled={isVerifying}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                          isVerified
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-primary-500 hover:bg-primary-600 text-white'
                        }`}
                      >
                        {isVerifying ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : isVerified ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Zap className="w-4 h-4" />
                        )}
                        {isVerified ? 'Verified' : 'Verify'}
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Optional Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-2">Optional Integrations</h2>
          <p className="text-gray-400 text-sm mb-6">Connect additional data sources to enhance agent capabilities</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrationPlatforms.map((platform) => {
              const currentKey = apiCredentials[platform.id as keyof typeof apiCredentials]
              const isVisible = showKeys[platform.id]

              return (
                <div key={platform.id} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{platform.name}</h3>
                      <p className="text-xs text-gray-400">{platform.agent}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${currentKey ? 'bg-green-400' : 'bg-gray-600'}`} />
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type={isVisible ? 'text' : 'password'}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="API key..."
                        value={currentKey || ''}
                        onChange={(e) => setApiCredential(platform.id, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowKey(platform.id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                      >
                        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      onClick={() => handleSave(platform.id)}
                      className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-6"
        >
          <div className="flex gap-3">
            <Shield className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-blue-400 mb-2">Security Notice</h3>
              <p className="text-sm text-blue-200/80">
                Your API keys are stored locally in your browser using encrypted localStorage.
                They are never sent to any server except the respective API platforms.
                For production use, we recommend implementing a secure backend proxy.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-red-500/10 border border-red-500/20 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>
          </div>
          <p className="text-sm text-red-200/80 mb-4">
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
                className="bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  )
}
