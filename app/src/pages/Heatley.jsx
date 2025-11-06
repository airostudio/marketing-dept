import './AgentPlaceholder.css';

function Heatley() {
  return (
    <div className="agent-page heatley">
      <div className="agent-header">
        <h1>🔥 Heatley - User Experience Analyst</h1>
        <p>Powered by Hotjar</p>
      </div>

      <div className="config-section">
        <div className="status-badge pending">⚙️ Configuration Required</div>

        <div className="agent-description">
          <p>
            Heatley shows you exactly how users interact with your site. Through heatmaps and session recordings,
            Heatley reveals the hidden patterns that numbers can't show.
          </p>
        </div>

        <div className="capabilities-grid">
          <h3>🎯 Capabilities</h3>
          <div className="capability-cards">
            <div className="capability-card">
              <div className="capability-icon">🗺️</div>
              <div className="capability-name">Heatmaps</div>
            </div>
            <div className="capability-card">
              <div className="capability-icon">🎥</div>
              <div className="capability-name">Session Recordings</div>
            </div>
            <div className="capability-card">
              <div className="capability-icon">🎯</div>
              <div className="capability-name">Conversion Funnels</div>
            </div>
            <div className="capability-card">
              <div className="capability-icon">📝</div>
              <div className="capability-name">Form Analytics</div>
            </div>
            <div className="capability-card">
              <div className="capability-icon">📊</div>
              <div className="capability-name">User Surveys</div>
            </div>
            <div className="capability-card">
              <div className="capability-icon">💬</div>
              <div className="capability-name">Feedback Polls</div>
            </div>
          </div>
        </div>

        <div className="setup-section">
          <h3>Setup Instructions</h3>
          <ol className="setup-steps">
            <li>Sign up for Hotjar at <a href="https://www.hotjar.com" target="_blank" rel="noopener noreferrer">hotjar.com</a></li>
            <li>Add your website</li>
            <li>Get your Site ID from the dashboard</li>
            <li>Add to <code>/app/.env</code>:
              <pre className="code-block">
VITE_HOTJAR_SITE_ID=your_site_id_here</pre>
            </li>
            <li>Add the Hotjar tracking code to your website</li>
            <li>Restart the dev server</li>
          </ol>
        </div>

        <div className="tier-info">
          <div className="tier-badge">FREE TIER</div>
          <div className="tier-details">
            <div className="tier-item">
              <strong>35 sessions/day</strong>
              <span>1,050 recordings per month</span>
            </div>
            <div className="tier-item">
              <strong>Unlimited heatmaps</strong>
              <span>See all user interactions</span>
            </div>
            <div className="tier-item">
              <strong>3 surveys</strong>
              <span>Gather user feedback</span>
            </div>
          </div>
        </div>

        <div className="coming-soon">
          <h3>🚧 Control Panel Coming Soon</h3>
          <p>
            The full Heatley control panel with heatmap viewer, session replay player, and funnel analysis
            is currently under development. Set up your Site ID now to start collecting data!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Heatley;
