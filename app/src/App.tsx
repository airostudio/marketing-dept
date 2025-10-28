import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useStore } from './store/useStore'
import SetupWizard from './pages/SetupWizard'
import Dashboard from './pages/Dashboard'
import WorkerDetail from './pages/WorkerDetail'
import TaskManager from './pages/TaskManager'
import Settings from './pages/Settings'

function App() {
  const isSetupComplete = useStore((state) => state.isSetupComplete)

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />

        <Routes>
          {!isSetupComplete ? (
            <>
              <Route path="/setup" element={<SetupWizard />} />
              <Route path="*" element={<Navigate to="/setup" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/worker/:workerId" element={<WorkerDetail />} />
              <Route path="/tasks" element={<TaskManager />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/setup" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  )
}

export default App
