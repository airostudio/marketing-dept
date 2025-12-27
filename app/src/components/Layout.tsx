import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ListTodo, Settings as SettingsIcon, LogOut, Sparkles, LayoutDashboard, Users } from 'lucide-react'
import { useStore } from '../store/useStore'
import MadisonNotifications from './MadisonNotifications'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { resetSetup, workers } = useStore()

  const navigation = [
    { name: 'Manager', path: '/', icon: Sparkles },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Agents', path: '/agents', icon: Users },
    { name: 'Tasks', path: '/tasks', icon: ListTodo },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    if (path === '/dashboard') return location.pathname === '/dashboard'
    if (path === '/agents') return location.pathname === '/agents' || location.pathname.startsWith('/worker')
    return location.pathname.startsWith(path)
  }

  const activeAgents = workers.filter(w => w.status === 'active').length

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 gradient-primary text-white p-6 overflow-y-auto z-30">
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/icon.svg"
              alt="AI Marketing Department"
              className="w-12 h-12 rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold">AI Marketing</h1>
              <p className="text-sm text-white/80">Department</p>
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
                {item.name === 'Agents' && (
                  <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {workers.length}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Team Status */}
        <div className="mt-8 p-4 bg-white/10 rounded-lg">
          <p className="text-xs text-white/60 mb-2 font-medium">TEAM LEADERSHIP</p>
          <Link to="/worker/scotty" className="flex items-center gap-3 mb-3 hover:bg-white/10 p-2 rounded-lg transition-colors -mx-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
              👔
            </div>
            <div className="text-sm">
              <p className="font-semibold">Scott Morrison</p>
              <p className="text-white/60 text-xs">VP of Sales & Marketing</p>
            </div>
          </Link>
          <Link to="/worker/madison" className="flex items-center gap-3 hover:bg-white/10 p-2 rounded-lg transition-colors -mx-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
              📋
            </div>
            <div className="text-sm">
              <p className="font-semibold">Madison Clarke</p>
              <p className="text-white/60 text-xs">Executive Assistant</p>
            </div>
          </Link>
        </div>

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
            <span className="text-sm font-semibold">{activeAgents} Agents Online</span>
          </div>
        </div>
      </aside>

      {/* Top Bar */}
      <header className="fixed top-0 left-64 right-0 h-16 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 z-20 flex items-center justify-end px-8">
        <div className="flex items-center gap-4">
          <MadisonNotifications />
          <div className="h-8 w-px bg-gray-700" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-sm">
              👤
            </div>
            <span className="text-sm text-gray-300">Admin</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-64 pt-16 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
