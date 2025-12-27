import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useStore } from './store/useStore'
import SetupWizard from './pages/SetupWizard'
import Dashboard from './pages/Dashboard'
import Manager from './pages/Manager'
import WorkerDetail from './pages/WorkerDetail'
import TaskManager from './pages/TaskManager'
import Settings from './pages/Settings'
import Team from './pages/Team'
import AgentProfile from './pages/AgentProfile'
import Deliverables from './pages/Deliverables'
import ProductionValidator from './components/ProductionValidator'

function App() {
  const isSetupComplete = useStore((state) => state.isSetupComplete)

  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Toaster position="top-right" />
        <ProductionValidator />

        <Routes>
          {!isSetupComplete ? (
            <>
              <Route path="/setup" element={<SetupWizard />} />
              <Route path="*" element={<Navigate to="/setup" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Manager />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/agents/:agentId" element={<AgentProfile />} />
              <Route path="/deliverables" element={<Deliverables />} />
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
