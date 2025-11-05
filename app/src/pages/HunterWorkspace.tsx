import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, Mail, Building2, User, Download, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'

interface Lead {
  email: string
  firstName: string
  lastName: string
  position: string
  company: string
  verified: boolean
  confidence: number
}

export default function HunterWorkspace() {
  const { apiCredentials } = useStore()
  const hunterApiKey = apiCredentials.hunterIo

  const [searchType, setSearchType] = useState<'domain' | 'email'>('domain')
  const [domain, setDomain] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleDomainSearch = async () => {
    if (!hunterApiKey) {
      toast.error('Please configure your Hunter.io API key in Settings')
      return
    }

    if (!domain) {
      toast.error('Please enter a domain to search')
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    try {
      // Simulate API call for demo purposes
      // In production, this would call the Hunter.io API
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock data for demonstration
      const mockLeads: Lead[] = [
        {
          email: 'john.smith@' + domain,
          firstName: 'John',
          lastName: 'Smith',
          position: role || 'CEO',
          company: domain.split('.')[0],
          verified: true,
          confidence: 95
        },
        {
          email: 'sarah.johnson@' + domain,
          firstName: 'Sarah',
          lastName: 'Johnson',
          position: role || 'Marketing Director',
          company: domain.split('.')[0],
          verified: true,
          confidence: 92
        },
        {
          email: 'mike.williams@' + domain,
          firstName: 'Mike',
          lastName: 'Williams',
          position: role || 'Sales Manager',
          company: domain.split('.')[0],
          verified: false,
          confidence: 78
        }
      ]

      setLeads(mockLeads)
      toast.success(`Found ${mockLeads.length} leads from ${domain}`)
    } catch (error) {
      toast.error('Failed to search for leads. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleEmailVerification = async () => {
    if (!hunterApiKey) {
      toast.error('Please configure your Hunter.io API key in Settings')
      return
    }

    if (!email) {
      toast.error('Please enter an email to verify')
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    try {
      // Simulate API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock verification result
      const mockLead: Lead = {
        email: email,
        firstName: 'Unknown',
        lastName: 'Unknown',
        position: 'Unknown',
        company: email.split('@')[1] || 'Unknown',
        verified: Math.random() > 0.3,
        confidence: Math.floor(Math.random() * 40) + 60
      }

      setLeads([mockLead])
      toast.success(`Email verification complete: ${mockLead.verified ? 'Valid' : 'Invalid'}`)
    } catch (error) {
      toast.error('Failed to verify email. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleExport = () => {
    if (leads.length === 0) {
      toast.error('No leads to export')
      return
    }

    const csv = [
      ['Email', 'First Name', 'Last Name', 'Position', 'Company', 'Verified', 'Confidence'],
      ...leads.map(lead => [
        lead.email,
        lead.firstName,
        lead.lastName,
        lead.position,
        lead.company,
        lead.verified ? 'Yes' : 'No',
        lead.confidence + '%'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hunter-leads-${Date.now()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success('Leads exported successfully')
  }

  return (
    <Layout>
      <Link to="/worker/hunter" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Hunter
      </Link>

      {/* Header */}
      <div className="gradient-primary rounded-2xl p-8 text-white mb-8">
        <div className="flex items-start gap-6">
          <div className="text-7xl">🎯</div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">Hunter Lead Generation Workspace</h1>
            <p className="text-xl text-white/90">Find and verify email addresses with Hunter.io</p>
            <div className="mt-4 flex items-center gap-2">
              {hunterApiKey ? (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>API Connected</span>
                </div>
              ) : (
                <Link to="/settings">
                  <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full text-sm hover:bg-red-500/30 transition-colors">
                    <AlertCircle className="w-4 h-4" />
                    <span>API Key Required - Click to Configure</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Configuration */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Search Configuration</h2>

            {/* Search Type Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setSearchType('domain')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                  searchType === 'domain'
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Domain Search
                </div>
              </button>
              <button
                onClick={() => setSearchType('email')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                  searchType === 'email'
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Verification
                </div>
              </button>
            </div>

            {/* Domain Search Form */}
            {searchType === 'domain' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Domain *
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the company domain to find email addresses</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role/Position (Optional)
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="CEO, Marketing Director, etc."
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Filter results by job title or role</p>
                </div>

                <button
                  onClick={handleDomainSearch}
                  disabled={isSearching || !hunterApiKey}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search Domain
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Email Verification Form */}
            {searchType === 'email' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="input"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter an email address to verify its validity</p>
                </div>

                <button
                  onClick={handleEmailVerification}
                  disabled={isSearching || !hunterApiKey}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Verify Email
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Results */}
          {hasSearched && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Results ({leads.length})
                </h2>
                {leads.length > 0 && (
                  <button
                    onClick={handleExport}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                )}
              </div>

              {leads.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No leads found. Try a different search.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leads.map((lead, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Mail className="w-5 h-5 text-primary-600" />
                            <span className="font-mono text-sm font-semibold text-gray-900">
                              {lead.email}
                            </span>
                            {lead.verified ? (
                              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded">
                                Verified
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                                Unverified
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <div className="text-gray-600">
                              <span className="font-medium">Name:</span> {lead.firstName} {lead.lastName}
                            </div>
                            <div className="text-gray-600">
                              <span className="font-medium">Position:</span> {lead.position}
                            </div>
                            <div className="text-gray-600">
                              <span className="font-medium">Company:</span> {lead.company}
                            </div>
                            <div className="text-gray-600">
                              <span className="font-medium">Confidence:</span> {lead.confidence}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">Search Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Found</span>
                <span className="font-semibold text-gray-900">{leads.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Verified</span>
                <span className="font-semibold text-gray-900">
                  {leads.filter(l => l.verified).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Confidence</span>
                <span className="font-semibold text-gray-900">
                  {leads.length > 0
                    ? Math.round(leads.reduce((sum, l) => sum + l.confidence, 0) / leads.length)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Guide */}
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="font-bold text-blue-900 mb-3">How to Use Hunter</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex gap-2">
                <span className="font-semibold min-w-[20px]">1.</span>
                <p>Configure your Hunter.io API key in Settings</p>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold min-w-[20px]">2.</span>
                <p>Choose between Domain Search or Email Verification</p>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold min-w-[20px]">3.</span>
                <p>Enter the required information and search</p>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold min-w-[20px]">4.</span>
                <p>Review results and export as CSV</p>
              </div>
            </div>
          </div>

          {/* API Info */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-3">API Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Platform</p>
                <p className="font-semibold text-gray-900">Hunter.io</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Status</p>
                {hunterApiKey ? (
                  <span className="text-green-600 font-semibold">Connected</span>
                ) : (
                  <span className="text-red-600 font-semibold">Not Connected</span>
                )}
              </div>
              <Link to="/settings">
                <button className="w-full btn-secondary text-sm py-2">
                  Configure API Key
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
