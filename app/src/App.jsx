import { workers } from './data/workers'
import './index.css'

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>
          🤖 Free AI Marketing Department
          <span className="badge">100% FREE</span>
        </h1>
        <p>
          5 powerful AI workers to supercharge your marketing - all with free tiers!
        </p>
      </header>

      <div className="workers-grid">
        {workers.map((worker) => (
          <div key={worker.id} className="worker-card">
            <div className="worker-header">
              <div className="worker-emoji">{worker.emoji}</div>
              <div className="worker-info">
                <h3>{worker.name}</h3>
                <div className="worker-role">{worker.role}</div>
              </div>
            </div>

            <p className="worker-description">{worker.description}</p>

            <div className="worker-capabilities">
              <h4>Capabilities</h4>
              <div className="capabilities-list">
                {worker.capabilities.map((cap, idx) => (
                  <span key={idx} className="capability-tag">
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            <div className="platform-badge">
              Powered by {worker.platform}
            </div>
          </div>
        ))}
      </div>

      <div className="cta-section">
        <h2>Ready to Build Your AI Team?</h2>
        <p>
          All these platforms offer free tiers - start automating your marketing today
          without spending a dime!
        </p>
        <a
          href="https://github.com/airostudio/marketing-dept"
          className="cta-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
      </div>
    </div>
  )
}

export default App
