import { Link } from 'react-router-dom';
import { workers } from '../data/workers';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
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

            {worker.id === 'casey' && (
              <Link to="/casey" className="worker-action-btn">
                Launch Casey →
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="cta-section">
        <h2>Ready to Build Your AI Team?</h2>
        <p>
          All these platforms offer free tiers - start automating your marketing today
          without spending a dime!
        </p>
        <div className="cta-buttons">
          <a
            href="https://github.com/airostudio/marketing-dept"
            className="cta-button primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
          <Link to="/stats" className="cta-button secondary">
            View Stats Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
