import { useState } from 'react'
import { Search, Mail, CheckCircle, Loader2 } from 'lucide-react'
import HunterService from '../services/hunterService'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'
import CampaignModal from './CampaignModal'

export default function HunterTools() {
  const [activeTab, setActiveTab] = useState<'domain' | 'finder' | 'verifier'>('domain')
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false)
  const { apiCredentials } = useStore()

  return (
    <div className="space-y-6">
      {/* Campaign Button */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Email Campaigns</h3>
            <p className="text-sm text-gray-600">
              Create and manage cold email campaigns with Hunter
            </p>
          </div>
          <button
            onClick={() => setIsCampaignModalOpen(true)}
            className="btn-primary whitespace-nowrap"
          >
            Start a Campaign
          </button>
        </div>
      </div>

      {/* Tools Tabs */}
      <div className="card">
        <h3 className="font-bold text-gray-900 mb-4">Hunter Tools</h3>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('domain')}
            className={`px-4 py-2 font-semibold transition-colors relative ${
              activeTab === 'domain'
                ? 'text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Search className="inline-block w-4 h-4 mr-2" />
            Domain Search
            {activeTab === 'domain' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('finder')}
            className={`px-4 py-2 font-semibold transition-colors relative ${
              activeTab === 'finder'
                ? 'text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Mail className="inline-block w-4 h-4 mr-2" />
            Email Finder
            {activeTab === 'finder' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('verifier')}
            className={`px-4 py-2 font-semibold transition-colors relative ${
              activeTab === 'verifier'
                ? 'text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CheckCircle className="inline-block w-4 h-4 mr-2" />
            Email Verifier
            {activeTab === 'verifier' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'domain' && <DomainSearchTool apiKey={apiCredentials.hunterIo} />}
        {activeTab === 'finder' && <EmailFinderTool apiKey={apiCredentials.hunterIo} />}
        {activeTab === 'verifier' && <EmailVerifierTool apiKey={apiCredentials.hunterIo} />}
      </div>

      {/* Campaign Modal */}
      <CampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
      />
    </div>
  )
}

// Domain Search Tool Component
function DomainSearchTool({ apiKey }: { apiKey?: string }) {
  const [domain, setDomain] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!apiKey) {
      toast.error('Hunter.io API key not configured. Please add it in Settings.')
      return
    }

    if (!domain.trim()) {
      toast.error('Please enter a domain')
      return
    }

    setIsLoading(true)
    setResults(null)

    try {
      const result = await HunterService.findLeads({ domain: domain.trim(), limit: 10 }, apiKey)

      if (result.success) {
        setResults(result.data)
        toast.success(`Found ${result.data.emailsFound} email addresses!`)
      } else {
        toast.error(result.error || 'Failed to search domain')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Search failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Find all email addresses associated with a company domain
      </p>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
        <button type="submit" disabled={isLoading} className="btn-primary px-6">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
        </button>
      </form>

      {results && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div>
              <p className="font-semibold text-green-900">{results.organization}</p>
              <p className="text-sm text-green-700">
                Found {results.emailsFound} emails • Pattern: {results.pattern}
              </p>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.emails.map((email: any, index: number) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{email.email}</p>
                    <p className="text-sm text-gray-600">
                      {email.firstName} {email.lastName}
                      {email.position && ` • ${email.position}`}
                    </p>
                    {email.department && (
                      <p className="text-xs text-gray-500 mt-1">{email.department}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        email.confidence >= 90
                          ? 'bg-green-100 text-green-800'
                          : email.confidence >= 70
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {email.confidence}% confidence
                    </span>
                    {email.verified && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Email Finder Tool Component
function EmailFinderTool({ apiKey }: { apiKey?: string }) {
  const [domain, setDomain] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleFind = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!apiKey) {
      toast.error('Hunter.io API key not configured. Please add it in Settings.')
      return
    }

    if (!domain.trim() || (!firstName.trim() && !lastName.trim())) {
      toast.error('Please enter domain and at least one name')
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const searchResult = await HunterService.findEmail(
        {
          domain: domain.trim(),
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
        },
        apiKey
      )

      if (searchResult.success) {
        setResult(searchResult.data)
        toast.success('Email found!')
      } else {
        toast.error(searchResult.error || 'Failed to find email')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Search failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Find the most likely email address for a specific person
      </p>

      <form onSubmit={handleFind} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="company.com"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
          <button type="submit" disabled={isLoading} className="btn-primary px-6">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Find'}
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-lg font-semibold text-green-900">{result.email}</p>
              <p className="text-sm text-green-700">
                {result.firstName} {result.lastName}
                {result.position && ` • ${result.position}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                {result.confidence}% confidence
              </span>
              {result.verified && <CheckCircle className="w-5 h-5 text-green-600" />}
            </div>
          </div>
          {result.sources > 0 && (
            <p className="text-xs text-green-600">
              Found in {result.sources} source{result.sources !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// Email Verifier Tool Component
function EmailVerifierTool({ apiKey }: { apiKey?: string }) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!apiKey) {
      toast.error('Hunter.io API key not configured. Please add it in Settings.')
      return
    }

    if (!email.trim()) {
      toast.error('Please enter an email address')
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const verifyResult = await HunterService.verifyEmail(email.trim(), apiKey)

      if (verifyResult.success) {
        setResult(verifyResult.data)
        toast.success('Email verified!')
      } else {
        toast.error(verifyResult.error || 'Failed to verify email')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'invalid':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'accept_all':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'webmail':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'disposable':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Verify the deliverability of an email address
      </p>

      <form onSubmit={handleVerify} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
        <button type="submit" disabled={isLoading} className="btn-primary px-6">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
        </button>
      </form>

      {result && (
        <div className={`mt-4 p-4 rounded-lg border ${getStatusColor(result.status)}`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-lg font-semibold">{result.email}</p>
              <p className="text-sm capitalize mt-1">Status: {result.status.replace('_', ' ')}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{result.score}%</p>
              <p className="text-xs">Confidence</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-current/20">
            <div className="text-xs">
              <p className="font-semibold">Accept All:</p>
              <p>{result.acceptAll ? 'Yes' : 'No'}</p>
            </div>
            <div className="text-xs">
              <p className="font-semibold">Disposable:</p>
              <p>{result.disposable ? 'Yes' : 'No'}</p>
            </div>
            <div className="text-xs">
              <p className="font-semibold">Webmail:</p>
              <p>{result.webmail ? 'Yes' : 'No'}</p>
            </div>
            <div className="text-xs">
              <p className="font-semibold">SMTP Check:</p>
              <p>{result.smtpCheck ? 'Passed' : 'Failed'}</p>
            </div>
          </div>

          {result.valid && (
            <div className="mt-3 pt-3 border-t border-current/20">
              <p className="text-xs font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                This email is deliverable and safe to use
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
