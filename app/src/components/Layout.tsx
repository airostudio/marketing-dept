import { ReactNode, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Users, ListTodo, Settings as SettingsIcon, LogOut } from 'lucide-react'
import { useStore } from '../store/useStore'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const resetSetup = useStore(state => state.resetSetup)
  const branding = useStore(state => state.branding)

  // Update favicon and document title dynamically
  useEffect(() => {
    // Update favicon
    if (branding.icon) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement
      if (link) {
        link.href = branding.icon
      }
    }

    // Update document title
    if (branding.companyName) {
      document.title = branding.companyName
    }
  }, [branding.icon, branding.companyName])

  // Get logo and company name with fallbacks
  const logoSrc = branding.icon || branding.logo || '/assets/icon.svg'
  const companyName = branding.companyName || 'AI Marketing Department'

  const navigation = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Workers', path: '/#workers', icon: Users },
    { name: 'Tasks', path: '/tasks', icon: ListTodo },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 gradient-primary text-white p-6 overflow-y-auto">
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoSrc}
              alt={companyName}
              className="w-12 h-12 rounded-lg object-contain bg-white/10 p-1"
            />
            <div>
              <h1 className="text-xl font-bold">
                {companyName.split(' ')[0] || 'AI Marketing'}
              </h1>
              <p className="text-sm text-white/80">
                {companyName.split(' ').slice(1).join(' ') || 'Department'}
              </p>
            </div>
          </Link>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto pt-8">
          <button
            onClick={resetSetup}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Reset Setup</span>
          </button>
        </div>

        <div className="mt-4 p-4 bg-white/10 rounded-lg">
          <p className="text-xs text-white/60 mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-semibold">All Systems Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
