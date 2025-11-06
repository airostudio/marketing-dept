import './AgentPlaceholder.css';

function Analyzer() {
  return (
    <div className="agent-page analyzer">
      <div className="agent-header">
        <h1>📊 Analyzer - Data Analytics Specialist</h1>
        <p>Powered by Google Analytics</p>
      </div>

      <div className="config-section">
        <div className="status-badge pending">⚙️ Configuration Required</div>

        <div className="agent-description">
          <p>
            Analyzer dives deep into your website data to uncover insights that drive growth. From traffic patterns
            to conversion funnels, Analyzer reveals what's really working.
          </p>
        </div>

        <div className="capabilities-grid">
          <h3>🎯 Capabilities</h3>
          <div className="capability-cards">
            <div className="capability-card">
              <div className="capability-icon">📈</div>
              <div className="capability-name">Traffic Analysis</div>
            </div>
            <div className="capability-card">
              <div className="capability-icon">🎯</div>
              <div className="capability-name">Conversion Tracking</div>
            </div>
            <div className="capability-card">
              <div className="capability-icon">👤</div>
              <div className="capability-name">User Behavior</div>
            </div>
            <div className="capability-card">
              <div className="capability-icon">🎲</div>
              <div className="capability-name">Goal Monitoring</div>
            </div>
            <div className="capability-card">
              <div className="capability-icon">📋</div>
              <div className="capability-name">Custom Reports</div>
            </div>
            <div className="capability-card">
              <div className="capability-icon">⚡</div>
              <div className="capability-name">Real-time Data</div>
            </div>
          </div>
        </div>

        <div className="setup-section">
          <h3>Setup Instructions</h3>
          <ol className="setup-steps">
            <li>Create a Google Analytics account at <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer">analytics.google.com</a></li>
            <li>Set up a new property for your website</li>
            <li>Get your Measurement ID (starts with G-)</li>
            <li>Add to <code>/app/.env</code>:
              <pre className="code-block">
VITE_GA_TRACKING_ID=G-XXXXXXXXXX</pre>
            </li>
            <li>Add the tracking code to your website</li>
            <li>Restart the dev server</li>
          </ol>
        </div>

        <div className="tier-info">
          <div className="tier-badge free">100% FREE</div>
          <div className="tier-details">
            <div className="tier-item">
              <strong>Unlimited tracking</strong>
              <span>No limits on data collection</span>
            </div>
            <div className="tier-item">
              <strong>Advanced features</strong>
              <span>All features included for free</span>
            </div>
            <div className="tier-item">
              <strong>Custom reporting</strong>
              <span>Build any report you need</span>
            </div>
          </div>
        </div>

        <div className="coming-soon">
          <h3>🚧 Control Panel Coming Soon</h3>
          <p>
            The full Analyzer control panel with custom report building, funnel visualization, and
            real-time dashboard is currently under development. Set up your tracking ID now!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Analyzer;
