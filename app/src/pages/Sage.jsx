import './AgentPlaceholder.css';

function Sage() {
  return (
    <div className="agent-page sage">
      <div className="agent-header">
        <h1>📧 Sage - Email Campaign Manager</h1>
        <p>Powered by Mailchimp</p>
      </div>

      <div className="config-section">
        <div className="status-badge pending">⚙️ Configuration Required</div>

        <div className="agent-description">
          <p>
            Sage orchestrates your entire email marketing strategy. From beautiful campaigns to
            automated workflows, Sage ensures your message reaches the right people at the right time.
          </p>
        </div>

        <div className="capabilities-grid">
          <h3>🎯 Capabilities</h3>
          <div className="capability-cards">
            <div className="capability-card">
              <div className="capability-icon">📨</div>
              <div className="capability-name">Email Campaigns</div>
            </div>
            <div className="capability-card">
              <div className="capability-icon">⚙️</div>
              <div className="capability-name">Automation Workflows</div>
            </div>
            <div className="capability-card">
              <div className="capability-icon">👥</div>
              <div className="capability-name">Audience Segmentation</div>
            </div>
            <div className="capability-card">
              <div className="capability-icon">🧪</div>
              <div className="capability-name">A/B Testing</div>
            </div>
            <div className="capability-card">
              <div className="capability-icon">🎨</div>
              <div className="capability-name">Landing Pages</div>
            </div>
            <div className="capability-card">
              <div className="capability-icon">📊</div>
              <div className="capability-name">Analytics</div>
            </div>
          </div>
        </div>

        <div className="setup-section">
          <h3>Setup Instructions</h3>
          <ol className="setup-steps">
            <li>Sign up for Mailchimp at <a href="https://mailchimp.com" target="_blank" rel="noopener noreferrer">mailchimp.com</a></li>
            <li>Navigate to Account → Extras → API keys</li>
            <li>Create a new API key</li>
            <li>Note your server prefix (e.g., us1, us2)</li>
            <li>Add to <code>/app/.env</code>:
              <pre className="code-block">
VITE_MAILCHIMP_API_KEY=your_api_key_here
VITE_MAILCHIMP_SERVER_PREFIX=us1</pre>
            </li>
            <li>Restart the dev server</li>
          </ol>
        </div>

        <div className="tier-info">
          <div className="tier-badge">FREE TIER</div>
          <div className="tier-details">
            <div className="tier-item">
              <strong>500 contacts</strong>
              <span>Free forever</span>
            </div>
            <div className="tier-item">
              <strong>2,500 emails/month</strong>
              <span>Plenty to get started</span>
            </div>
            <div className="tier-item">
              <strong>All core features</strong>
              <span>Campaign builder, automation basics</span>
            </div>
          </div>
        </div>

        <div className="coming-soon">
          <h3>🚧 Control Panel Coming Soon</h3>
          <p>
            The full Sage control panel with campaign creation, automation workflows, and analytics
            is currently under development. Set up your API key now to be ready!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sage;
