import { useState, useEffect } from 'react';
import { getUsageStats, isRytrConfigured } from '../integrations/rytr';
import './Stats.css';

function Stats() {
  const [rytrUsage, setRytrUsage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isConfigured = isRytrConfigured();

  useEffect(() => {
    if (isConfigured) {
      loadRytrUsage();
    }
  }, [isConfigured]);

  const loadRytrUsage = async () => {
    setLoading(true);
    setError('');
    try {
      const usage = await getUsageStats();
      setRytrUsage(usage);
    } catch (err) {
      setError('Unable to load usage stats. Check your API key.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const tools = [
    {
      category: 'Marketing & Ads',
      icon: '📢',
      items: [
        { name: 'Product Description', desc: 'Compelling e-commerce product descriptions', emoji: '📦' },
        { name: 'Google Ads', desc: 'High-converting Google Ad copy', emoji: '🔍' },
        { name: 'Facebook Ads', desc: 'Engaging Facebook & Instagram ads', emoji: '👍' },
        { name: 'LinkedIn Ads', desc: 'Professional LinkedIn ad campaigns', emoji: '💼' },
        { name: 'Headlines', desc: 'Attention-grabbing headlines', emoji: '📰' },
        { name: 'Call to Action', desc: 'Persuasive CTA copy', emoji: '👆' },
        { name: 'Marketing Copy', desc: 'General marketing content', emoji: '✨' },
      ]
    },
    {
      category: 'Social Media',
      icon: '📱',
      items: [
        { name: 'Social Media Post', desc: 'General social content', emoji: '📲' },
        { name: 'Instagram Caption', desc: 'Engaging Instagram captions', emoji: '📷' },
        { name: 'Twitter/X Post', desc: 'Viral tweet content', emoji: '🐦' },
        { name: 'LinkedIn Post', desc: 'Professional LinkedIn updates', emoji: '💼' },
      ]
    },
    {
      category: 'Email Marketing',
      icon: '📧',
      items: [
        { name: 'Email Subject Lines', desc: 'High open-rate subject lines', emoji: '📬' },
        { name: 'Email Body', desc: 'Persuasive email content', emoji: '✉️' },
        { name: 'Cold Email', desc: 'Outreach email templates', emoji: '🎯' },
      ]
    },
    {
      category: 'Blog & SEO',
      icon: '✍️',
      items: [
        { name: 'Blog Outline', desc: 'Structured article outlines', emoji: '📝' },
        { name: 'Blog Introduction', desc: 'Engaging article intros', emoji: '🎬' },
        { name: 'Blog Conclusion', desc: 'Powerful article endings', emoji: '🏁' },
        { name: 'Meta Description', desc: 'SEO-optimized meta descriptions', emoji: '🔍' },
      ]
    },
    {
      category: 'Other',
      icon: '💡',
      items: [
        { name: 'Creative Story', desc: 'Storytelling content', emoji: '📖' },
      ]
    }
  ];

  const platforms = [
    {
      id: 'casey',
      name: 'Casey',
      emoji: '📝',
      role: 'AI Copywriter',
      platform: 'Rytr.me',
      tier: 'Free',
      limit: '10K chars/month',
      tools: 18,
      status: isConfigured ? 'active' : 'inactive',
      color: '#667eea'
    },
    {
      id: 'hunter',
      name: 'Hunter',
      emoji: '🎯',
      role: 'Lead Hunter',
      platform: 'Hunter.io',
      tier: 'Free',
      limit: '50 searches/month',
      tools: 4,
      status: 'inactive',
      color: '#ff6b6b'
    },
    {
      id: 'sage',
      name: 'Sage',
      emoji: '📧',
      role: 'Email Wizard',
      platform: 'Mailchimp',
      tier: 'Free',
      limit: '500 contacts',
      tools: 5,
      status: 'inactive',
      color: '#4ecdc4'
    },
    {
      id: 'analyzer',
      name: 'Analyzer',
      emoji: '📊',
      role: 'Data Analyst',
      platform: 'Google Analytics',
      tier: 'Free',
      limit: 'Unlimited',
      tools: 8,
      status: 'inactive',
      color: '#f9ca24'
    },
    {
      id: 'heatley',
      name: 'Heatley',
      emoji: '🔥',
      role: 'UX Specialist',
      platform: 'Hotjar',
      tier: 'Free',
      limit: '35 sessions/day',
      tools: 6,
      status: 'inactive',
      color: '#ff9ff3'
    }
  ];

  const totalTools = tools.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="stats-page">
      <div className="stats-header">
        <h1>📊 Marketing Department Stats</h1>
        <p>Overview of all available tools and platform usage</p>
      </div>

      {/* Platform Overview Cards */}
      <div className="platforms-section">
        <h2>🤖 AI Workers Overview</h2>
        <div className="platforms-grid">
          {platforms.map(platform => (
            <div
              key={platform.id}
              className={`platform-card ${platform.status}`}
              style={{ borderTopColor: platform.color }}
            >
              <div className="platform-header">
                <div className="platform-emoji">{platform.emoji}</div>
                <div className="platform-info">
                  <h3>{platform.name}</h3>
                  <p className="platform-role">{platform.role}</p>
                </div>
                <div className={`status-badge ${platform.status}`}>
                  {platform.status === 'active' ? '✓ Active' : '○ Inactive'}
                </div>
              </div>
              <div className="platform-stats">
                <div className="stat-item">
                  <span className="stat-label">Platform</span>
                  <span className="stat-value">{platform.platform}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Tier</span>
                  <span className="stat-value">{platform.tier}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Limit</span>
                  <span className="stat-value">{platform.limit}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Tools</span>
                  <span className="stat-value">{platform.tools} available</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rytr.me Usage Stats */}
      {isConfigured && (
        <div className="usage-section">
          <div className="section-header">
            <h2>📝 Casey (Rytr.me) Usage</h2>
            <button onClick={loadRytrUsage} className="refresh-btn" disabled={loading}>
              {loading ? '⏳ Loading...' : '🔄 Refresh'}
            </button>
          </div>

          {error && (
            <div className="error-card">
              <p>{error}</p>
            </div>
          )}

          {rytrUsage && !error && (
            <div className="usage-cards">
              <div className="usage-card">
                <div className="usage-icon">📊</div>
                <div className="usage-info">
                  <h3>Characters Used</h3>
                  <p className="usage-number">{rytrUsage.creditsUsed || 0}</p>
                  <p className="usage-sub">out of 10,000/month</p>
                </div>
              </div>
              <div className="usage-card">
                <div className="usage-icon">🔋</div>
                <div className="usage-info">
                  <h3>Characters Remaining</h3>
                  <p className="usage-number">{rytrUsage.creditsLeft || 10000}</p>
                  <p className="usage-sub">
                    {Math.round(((rytrUsage.creditsLeft || 10000) / 10000) * 100)}% remaining
                  </p>
                </div>
              </div>
              <div className="usage-card">
                <div className="usage-icon">📅</div>
                <div className="usage-info">
                  <h3>Resets On</h3>
                  <p className="usage-number">
                    {rytrUsage.resetDate || 'Next month'}
                  </p>
                  <p className="usage-sub">Monthly reset</p>
                </div>
              </div>
            </div>
          )}

          {!rytrUsage && !loading && !error && (
            <div className="empty-usage">
              <p>Click refresh to load usage statistics</p>
            </div>
          )}
        </div>
      )}

      {/* Available Tools */}
      <div className="tools-section">
        <h2>🛠️ Available Tools ({totalTools} total)</h2>
        <div className="tools-grid">
          {tools.map((category, idx) => (
            <div key={idx} className="tool-category">
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <h3>{category.category}</h3>
                <span className="category-count">{category.items.length}</span>
              </div>
              <div className="category-items">
                {category.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="tool-item">
                    <span className="tool-emoji">{item.emoji}</span>
                    <div className="tool-info">
                      <h4>{item.name}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="summary-section">
        <h2>📈 Quick Summary</h2>
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-icon">🤖</div>
            <h3>5</h3>
            <p>AI Workers</p>
          </div>
          <div className="summary-card">
            <div className="summary-icon">🛠️</div>
            <h3>{totalTools}</h3>
            <p>Total Tools</p>
          </div>
          <div className="summary-card">
            <div className="summary-icon">💰</div>
            <h3>$0</h3>
            <p>Monthly Cost</p>
          </div>
          <div className="summary-card">
            <div className="summary-icon">⚡</div>
            <h3>100%</h3>
            <p>Free Tier</p>
          </div>
        </div>
      </div>

      {/* Setup Notice */}
      {!isConfigured && (
        <div className="setup-notice">
          <h3>⚙️ Setup Required</h3>
          <p>
            Casey (Rytr.me) needs configuration to show usage statistics.
            Add your <code>RYTR_API_KEY</code> to the .env file.
          </p>
          <a href="https://rytr.me" target="_blank" rel="noopener noreferrer" className="setup-link">
            Get API Key from Rytr.me →
          </a>
        </div>
      )}
    </div>
  );
}

export default Stats;
