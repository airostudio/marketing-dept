import { useState } from 'react'
import { X } from 'lucide-react'
import HunterService from '../services/hunterService'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'

interface CampaignModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CampaignModal({ isOpen, onClose }: CampaignModalProps) {
  const [campaignName, setCampaignName] = useState('')
  const [leadEmails, setLeadEmails] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const { apiCredentials } = useStore()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!campaignName.trim()) {
      toast.error('Please enter a campaign name')
      return
    }

    const apiKey = apiCredentials.hunterIo
    if (!apiKey) {
      toast.error('Hunter.io API key not configured. Please add it in Settings.')
      return
    }

    setIsCreating(true)

    try {
      // Parse emails from textarea (comma or newline separated)
      const emails = leadEmails
        .split(/[,\n]/)
        .map(email => email.trim())
        .filter(email => email.length > 0)

      const result = await HunterService.createCampaign(
        {
          name: campaignName,
          leadEmails: emails.length > 0 ? emails : undefined,
        },
        apiKey
      )

      if (result.success) {
        toast.success(
          `Campaign "${campaignName}" created successfully! ${
            result.data.leadsCount > 0 ? `Added ${result.data.leadsCount} leads.` : ''
          }`
        )
        setCampaignName('')
        setLeadEmails('')
        onClose()
      } else {
        toast.error(result.error || 'Failed to create campaign')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create campaign')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

        {/* Modal */}
        <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900">Start a Campaign</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {/* Campaign Name */}
              <div>
                <label htmlFor="campaignName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Campaign Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="campaignName"
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="e.g., Q4 Outreach Campaign"
                  required
                />
              </div>

              {/* Lead Emails */}
              <div>
                <label htmlFor="leadEmails" className="block text-sm font-semibold text-gray-700 mb-2">
                  Lead Emails (Optional)
                </label>
                <textarea
                  id="leadEmails"
                  value={leadEmails}
                  onChange={(e) => setLeadEmails(e.target.value)}
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-mono text-sm"
                  placeholder="Enter email addresses (one per line or comma-separated)&#10;&#10;Example:&#10;john@example.com&#10;jane@company.com&#10;bob@startup.io"
                />
                <p className="mt-2 text-xs text-gray-500">
                  You can add leads now or add them later through the Hunter.io dashboard
                </p>
              </div>

              {/* Info Box */}
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tip:</strong> After creating your campaign, you can manage it, add more leads,
                  and configure email sequences directly in your{' '}
                  <a
                    href="https://hunter.io/campaigns"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-900"
                  >
                    Hunter.io dashboard
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Campaign'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
