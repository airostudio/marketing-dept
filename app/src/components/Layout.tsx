import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Users, ListTodo, Settings as SettingsIcon } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

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
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto pt-8 p-4 bg-white/10 rounded-lg">
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
