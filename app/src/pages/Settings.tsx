import { useState, useRef } from 'react'
import { Save, Eye, EyeOff, AlertTriangle, Upload, Image as ImageIcon, Trash2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'

export default function Settings() {
  const { apiCredentials, setApiCredential, resetSetup, branding, updateBranding, resetBranding } = useStore()
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showBrandingReset, setShowBrandingReset] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const iconInputRef = useRef<HTMLInputElement>(null)

  const platforms = [
    { id: 'jasperAi', name: 'Jasper AI', worker: 'Jasper' },
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

  const handleImageUpload = (type: 'logo' | 'icon', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB')
      return
    }

    // Read file and convert to base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      updateBranding({ [type]: base64 })
      toast.success(`${type === 'logo' ? 'Logo' : 'Icon'} uploaded successfully!`)
    }
    reader.onerror = () => {
      toast.error('Failed to upload image')
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = (type: 'logo' | 'icon') => {
    updateBranding({ [type]: undefined })
    toast.success(`${type === 'logo' ? 'Logo' : 'Icon'} removed`)
  }

  const handleCompanyNameChange = (name: string) => {
    updateBranding({ companyName: name })
  }

  const handleBrandingReset = () => {
    resetBranding()
    setShowBrandingReset(false)
    toast.success('Branding reset to defaults')
  }

  return (
    <Layout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your branding, API credentials, and platform connections</p>
        </div>

        {/* Branding & Logo */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Branding & Logo</h2>

          {/* Company Name */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              className="input"
              placeholder="AI Marketing Department"
              value={branding.companyName || ''}
              onChange={(e) => handleCompanyNameChange(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">This will be displayed in the sidebar and throughout the app</p>
          </div>

          {/* Logo Upload */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Company Logo
            </label>

            <div className="flex items-start gap-4">
              {/* Logo Preview */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                  {branding.logo ? (
                    <img src={branding.logo} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Upload Controls */}
              <div className="flex-1">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('logo', e)}
                  className="hidden"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {branding.logo ? 'Change Logo' : 'Upload Logo'}
                  </button>

                  {branding.logo && (
                    <button
                      onClick={() => handleRemoveImage('logo')}
                      className="btn-secondary flex items-center gap-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Recommended: Square image, min 200x200px, max 2MB. PNG or SVG for best quality.
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ✨ Your logo will automatically update across the entire website!
                </p>
              </div>
            </div>
          </div>

          {/* Icon Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              App Icon / Favicon
            </label>

            <div className="flex items-start gap-4">
              {/* Icon Preview */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                  {branding.icon ? (
                    <img src={branding.icon} alt="Icon" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Upload Controls */}
              <div className="flex-1">
                <input
                  ref={iconInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('icon', e)}
                  className="hidden"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => iconInputRef.current?.click()}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {branding.icon ? 'Change Icon' : 'Upload Icon'}
                  </button>

                  {branding.icon && (
                    <button
                      onClick={() => handleRemoveImage('icon')}
                      className="btn-secondary flex items-center gap-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Recommended: Square icon, 64x64px or larger, max 2MB. Will be used in sidebar and browser tab.
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ✨ Your icon will automatically update in the sidebar and browser tab!
                </p>
              </div>
            </div>
          </div>

          {/* Reset Branding */}
          {(branding.logo || branding.icon || branding.companyName !== 'AI Marketing Department') && (
            <div className="pt-6 border-t border-gray-200">
              {!showBrandingReset ? (
                <button
                  onClick={() => setShowBrandingReset(true)}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Reset to default branding
                </button>
              ) : (
                <div className="flex gap-3 items-center">
                  <p className="text-sm text-gray-600">Are you sure? This will remove all custom branding.</p>
                  <button
                    onClick={handleBrandingReset}
                    className="text-sm bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowBrandingReset(false)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
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
