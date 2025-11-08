import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Loader, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'

const platforms = [
  {
    id: 'googleGemini',
    name: 'Google Gemini',
    emoji: '✍️',
    description: 'AI content generation platform (Free tier)',
    worker: 'Jasper - Content Creation',
    docsUrl: 'https://ai.google.dev/tutorials/setup',
    placeholder: 'AIza...',
    tier: 'Free'
  },
  {
    id: 'rytrAi',
    name: 'Rytr AI',
    emoji: '📝',
    description: 'AI copywriting assistant (Unlimited tier)',
    worker: 'Casey - Content Creation',
    docsUrl: 'https://rytr.me/api',
    placeholder: 'rytr-api-key-...',
    tier: 'Unlimited'
  },
  {
    id: 'zoomInfo',
    name: 'ZoomInfo',
    emoji: '🔍',
    description: 'B2B lead intelligence platform',
    worker: 'Zoey - Lead Generation',
    docsUrl: 'https://api-docs.zoominfo.com',
    placeholder: 'zoominfo-api-key-...',
    tier: 'Premium'
  },
  {
    id: 'hunterIo',
    name: 'Hunter.io',
    emoji: '🎯',
    description: 'Email finder & verifier (Free tier)',
    worker: 'Hunter - Lead Generation',
    docsUrl: 'https://hunter.io/api-documentation',
    placeholder: 'hunter-api-key-...',
    tier: 'Free'
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    emoji: '⏰',
    description: 'Email marketing platform (Free tier)',
    worker: 'Sage - Email Marketing',
    docsUrl: 'https://mailchimp.com/developer/',
    placeholder: 'mailchimp-api-key-...',
    tier: 'Free'
  },
  {
    id: 'smartlyIo',
    name: 'Smartly.io',
    emoji: '🎯',
    description: 'Social media ad automation',
    worker: 'Smarta - Social Advertising',
    docsUrl: 'https://developers.smartly.io',
    placeholder: 'smartly-api-...'
  },
  {
    id: 'dynamicYield',
    name: 'Dynamic Yield',
    emoji: '🎨',
    description: 'Personalization platform',
    worker: 'Dynamo - Personalization',
    docsUrl: 'https://adm-api.dynamicyield.com/api/docs',
    placeholder: 'dy-api-key-...'
  },
  {
    id: 'googleAnalytics',
    name: 'Google Analytics',
    emoji: '📊',
    description: 'Web analytics platform (Free)',
    worker: 'Analyzer - Analytics',
    docsUrl: 'https://developers.google.com/analytics',
    placeholder: 'UA-XXXXXXXXX-X or G-XXXXXXXXXX',
    tier: 'Free'
  },
  {
    id: 'hotjar',
    name: 'Hotjar',
    emoji: '🔥',
    description: 'Heatmaps & session recordings (Free tier)',
    worker: 'Heatley - Analytics',
    docsUrl: 'https://help.hotjar.com/hc/en-us/articles/115011639927',
    placeholder: 'hotjar-site-id-...',
    tier: 'Free'
  },
  {
    id: 'surferSeo',
    name: 'Surfer SEO',
    emoji: '🏄',
    description: 'SEO content optimization',
    worker: 'Surfy - SEO Optimization',
    docsUrl: 'https://docs.surferseo.com/api',
    placeholder: 'surfer-api-key-...',
    tier: 'Premium'
  },
  {
    id: 'intercom',
    name: 'Intercom',
    emoji: '💬',
    description: 'Customer support platform',
    worker: 'Chatty - Customer Support',
    docsUrl: 'https://developers.intercom.com',
    placeholder: 'intercom-api-key-...'
  },
]

export default function SetupWizard() {
  const [step, setStep] = useState(0)
  const [verifying, setVerifying] = useState<string | null>(null)
  const {
    setApiCredential,
    verifyApi,
    completeSetup,
    apiCredentials,
    verifiedApis
  } = useStore()

  const currentPlatform = platforms[step]
  const isLastStep = step === platforms.length - 1

  const handleVerify = async () => {
    const apiKey = apiCredentials[currentPlatform.id as keyof typeof apiCredentials]

    if (!apiKey) {
      toast.error('Please enter an API key')
      return
    }

    setVerifying(currentPlatform.id)

    try {
      const isValid = await verifyApi(currentPlatform.id)

      if (isValid) {
        toast.success(`${currentPlatform.name} connected successfully!`)
      } else {
        toast.error('Invalid API key. Please check and try again.')
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.')
    } finally {
      setVerifying(null)
    }
  }

  const handleNext = () => {
    if (isLastStep) {
      if (verifiedApis.length > 0) {
        completeSetup()
        toast.success('Setup complete! Welcome to your AI Marketing Department 🎉')
      } else {
        toast.error('Please verify at least one platform to continue')
      }
    } else {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleSkip = () => {
    if (!isLastStep) {
      setStep(step + 1)
    }
  }

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block"
          >
            <div className="text-6xl mb-4">🤖</div>
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to Your AI Marketing Department
          </h1>
          <p className="text-white/80">
            Let's connect your marketing tools to get started
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/20 rounded-full h-2 mb-8">
          <motion.div
            className="bg-white rounded-full h-2"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / platforms.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Setup Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl p-8"
          >
            {/* Platform Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">{currentPlatform.emoji}</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentPlatform.name}
                </h2>
                <p className="text-gray-600">{currentPlatform.description}</p>
              </div>
              {verifiedApis.includes(currentPlatform.id) && (
                <CheckCircle className="text-green-500 w-8 h-8" />
              )}
            </div>

            {/* Worker Assignment */}
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold">Powers:</span>
                <span>{currentPlatform.worker}</span>
              </div>
            </div>

            {/* API Key Input */}
            <div className="mb-6">
              <label className="label">
                API Key / Credentials
              </label>
              <input
                type="password"
                className="input font-mono text-sm"
                placeholder={currentPlatform.placeholder}
                value={apiCredentials[currentPlatform.id as keyof typeof apiCredentials] || ''}
                onChange={(e) => setApiCredential(currentPlatform.id, e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              />
              <div className="mt-2 flex items-center justify-between">
                <a
                  href={currentPlatform.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700 underline"
                >
                  Where do I find this? →
                </a>
                {verifiedApis.includes(currentPlatform.id) && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Verified
                  </span>
                )}
              </div>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={!apiCredentials[currentPlatform.id as keyof typeof apiCredentials] || verifying === currentPlatform.id}
              className="w-full btn-primary mb-4 flex items-center justify-center gap-2"
            >
              {verifying === currentPlatform.id ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : verifiedApis.includes(currentPlatform.id) ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Verified
                </>
              ) : (
                <>
                  Verify Connection
                </>
              )}
            </button>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handleBack}
                disabled={step === 0}
                className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <div className="text-sm text-gray-500">
                Step {step + 1} of {platforms.length}
              </div>

              <div className="flex gap-2">
                {!isLastStep && (
                  <button
                    onClick={handleSkip}
                    className="btn-secondary"
                  >
                    Skip
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="btn-primary flex items-center gap-2"
                >
                  {isLastStep ? 'Complete Setup' : 'Next'}
                  {!isLastStep && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Info */}
            {!verifiedApis.includes(currentPlatform.id) && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> You can skip platforms and add them later in Settings.
                  However, workers need their platforms connected to perform tasks.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            Your API keys are stored securely in your browser
          </p>
          <p className="text-white/60 text-sm">
            Verified: {verifiedApis.length} / {platforms.length} platforms
          </p>
        </div>
      </motion.div>
    </div>
  )
}
