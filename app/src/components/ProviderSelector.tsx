import { useState } from 'react'
import { useStore, AIProvider } from '../store/useStore'
import { Brain, Zap, Sparkles, DollarSign, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface Provider {
  id: AIProvider
  name: string
  icon: React.ReactNode
  description: string
  pricing: string
  speed: number
  quality: number
  available: boolean
}

export default function ProviderSelector() {
  const { providerPreferences, setProviderPreference, apiCredentials } = useStore()
  const [showSelector, setShowSelector] = useState(false)

  const providers: Provider[] = [
    {
      id: 'openai',
      name: 'OpenAI (ChatGPT)',
      icon: <Brain className="w-6 h-6" />,
      description: 'GPT-4o - Best quality, moderate cost',
      pricing: '$2.50-$10 per 1M tokens',
      speed: 85,
      quality: 98,
      available: !!apiCredentials.openAi
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      icon: <Zap className="w-6 h-6" />,
      description: 'Ultra cost-effective, great quality',
      pricing: '$0.14-$0.28 per 1M tokens',
      speed: 90,
      quality: 94,
      available: !!apiCredentials.deepSeek
    },
    {
      id: 'jasper',
      name: 'Jasper AI',
      icon: <Sparkles className="w-6 h-6" />,
      description: 'Premium content generation',
      pricing: '$40-$80 per month',
      speed: 80,
      quality: 92,
      available: !!apiCredentials.jasperAi
    },
    {
      id: 'copyai',
      name: 'Copy.ai',
      icon: <Sparkles className="w-6 h-6" />,
      description: 'Marketing copy specialist',
      pricing: 'Freemium',
      speed: 75,
      quality: 88,
      available: !!apiCredentials.copyAi
    }
  ]

  const currentProvider = providers.find(p => p.id === providerPreferences.contentGeneration)

  const handleProviderChange = (providerId: AIProvider) => {
    const provider = providers.find(p => p.id === providerId)

    if (!provider?.available) {
      toast.error(`Please configure ${provider?.name} API key in Setup first`)
      return
    }

    setProviderPreference('contentGeneration', providerId)
    toast.success(`Switched to ${provider.name}`)
    setShowSelector(false)
  }

  return (
    <div className="relative">
      {/* Current Provider Button */}
      <button
        onClick={() => setShowSelector(!showSelector)}
        className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-primary-500 transition-colors w-full"
      >
        <div className="p-2 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg text-primary-600">
          {currentProvider?.icon}
        </div>
        <div className="flex-1 text-left">
          <div className="text-sm font-semibold text-gray-900">
            AI Provider: {currentProvider?.name}
          </div>
          <div className="text-xs text-gray-500">{currentProvider?.pricing}</div>
        </div>
        <div className="text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Provider Selector Dropdown */}
      {showSelector && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowSelector(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary-600" />
                Select AI Provider
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Choose which AI powers your content generation
              </p>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleProviderChange(provider.id)}
                  disabled={!provider.available}
                  className={`w-full p-4 text-left transition-colors border-b border-gray-100 last:border-b-0 ${
                    provider.available
                      ? 'hover:bg-gray-50 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed bg-gray-50'
                  } ${
                    providerPreferences.contentGeneration === provider.id
                      ? 'bg-primary-50 border-l-4 border-l-primary-500'
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      providerPreferences.contentGeneration === provider.id
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {provider.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{provider.name}</span>
                        {providerPreferences.contentGeneration === provider.id && (
                          <Check className="w-4 h-4 text-primary-600" />
                        )}
                        {!provider.available && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                            Not configured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{provider.description}</p>

                      {/* Metrics */}
                      <div className="flex gap-4 mt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <DollarSign className="w-3 h-3" />
                          {provider.pricing}
                        </div>
                      </div>

                      {/* Quality & Speed Bars */}
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div>
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Quality</span>
                            <span>{provider.quality}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                              style={{ width: `${provider.quality}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Speed</span>
                            <span>{provider.speed}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                              style={{ width: `${provider.speed}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                💡 Configure more providers in the Setup Wizard
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
