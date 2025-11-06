import { useState, useEffect } from 'react';
import {
  getConfigStatus,
  initializeGA,
  trackPageView,
  trackEvent,
  getSimulatedAnalytics,
  formatDuration
} from '../integrations/google-analytics';
import './Analyzer.css';

function Analyzer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const configStatus = getConfigStatus();

  useEffect(() => {
    if (configStatus.isConfigured && !configStatus.isInitialized) {
      initializeGA();
    }
  }, [configStatus]);

  useEffect(() => {
    // Track page view when component mounts
    if (configStatus.isInitialized) {
      trackPageView('/analyzer', 'Analyzer Dashboard');
    }
  }, [configStatus.isInitialized]);

  const loadAnalytics = () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const data = getSimulatedAnalytics();
      setAnalytics(data);
      setLoading(false);
    }, 800);
  };

  const handleTrackEvent = (eventName) => {
    trackEvent(eventName, {
      category: 'test',
      label: 'Demo Event',
    });
    alert(`Event tracked: ${eventName}`);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'pages', label: 'Top Pages', icon: '📄' },
    { id: 'sources', label: 'Traffic Sources', icon: '🌐' },
    { id: 'tracking', label: 'Event Tracking', icon: '🎯' },
  ];

  if (!configStatus.isConfigured) {
    return (
      <div className="analyzer-page">
        <div className="analyzer-header">
          <h1>📊 Analyzer - Data Analytics</h1>
          <p>Powered by Google Analytics</p>
        </div>
        <div className="config-warning">
          <h2>⚠️ Configuration Required</h2>
          <p>{configStatus.message}</p>
          <div className="config-steps">
            <h3>Setup Steps:</h3>
            <ol>
              <li>Create a Google Analytics 4 property at <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer">analytics.google.com</a></li>
              <li>Get your Measurement ID (format: G-XXXXXXXXXX)</li>
              <li>Add to <code>/app/.env</code>:
                <pre>VITE_GA_TRACKING_ID=G-XXXXXXXXXX</pre>
              </li>
              <li>Restart the dev server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analyzer-page">
      <div className="analyzer-header">
        <h1>📊 Analyzer - Data Analytics</h1>
        <p>Powered by Google Analytics - Tracking ID: {configStatus.trackingId}</p>
        <div className="status-indicators">
          <span className={`status-indicator ${configStatus.isInitialized ? 'active' : 'inactive'}`}>
            {configStatus.isInitialized ? '● Active' : '○ Not Initialized'}
          </span>
        </div>
      </div>

      <div className="analyzer-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="analyzer-content">
        {!analytics && activeTab !== 'tracking' && (
          <div className="load-section">
            <button
              className="load-btn"
              onClick={loadAnalytics}
              disabled={loading}
            >
              {loading ? 'Loading Analytics...' : 'Load Analytics Dashboard'}
            </button>
            <p className="note">
              Note: This displays simulated analytics data for demonstration purposes.
              In production, this would connect to the Google Analytics Data API.
            </p>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && analytics && (
          <div className="overview-section">
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">👥</div>
                <div className="metric-value">{analytics.overview.totalUsers.toLocaleString()}</div>
                <div className="metric-label">Total Users</div>
                <div className="metric-change positive">+12.3%</div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">📄</div>
                <div className="metric-value">{analytics.overview.totalPageViews.toLocaleString()}</div>
                <div className="metric-label">Page Views</div>
                <div className="metric-change positive">+8.7%</div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">🎯</div>
                <div className="metric-value">{analytics.overview.totalSessions.toLocaleString()}</div>
                <div className="metric-label">Sessions</div>
                <div className="metric-change positive">+15.2%</div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">⏱️</div>
                <div className="metric-value">{formatDuration(analytics.overview.avgSessionDuration)}</div>
                <div className="metric-label">Avg Session Duration</div>
                <div className="metric-change negative">-3.1%</div>
              </div>
            </div>

            <div className="chart-section">
              <h3>Daily Traffic (Last 7 Days)</h3>
              <div className="chart">
                {analytics.daily.map((day, index) => (
                  <div key={index} className="chart-bar-group">
                    <div className="chart-bars">
                      <div
                        className="chart-bar users"
                        style={{ height: `${(day.users / 300) * 100}%` }}
                        title={`Users: ${day.users}`}
                      />
                      <div
                        className="chart-bar pageviews"
                        style={{ height: `${(day.pageViews / 700) * 100}%` }}
                        title={`Page Views: ${day.pageViews}`}
                      />
                    </div>
                    <div className="chart-label">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-color users"></span> Users
                </span>
                <span className="legend-item">
                  <span className="legend-color pageviews"></span> Page Views
                </span>
              </div>
            </div>

            <div className="devices-section">
              <h3>Devices</h3>
              <div className="devices-chart">
                {analytics.devices.map((device, index) => (
                  <div key={index} className="device-bar">
                    <div className="device-info">
                      <span className="device-name">{device.device}</span>
                      <span className="device-percentage">{device.percentage}%</span>
                    </div>
                    <div className="device-progress">
                      <div
                        className="device-progress-bar"
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Top Pages Tab */}
        {activeTab === 'pages' && analytics && (
          <div className="pages-section">
            <h3>Top Performing Pages</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Views</th>
                  <th>Avg Time on Page</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topPages.map((page, index) => (
                  <tr key={index}>
                    <td className="page-path">{page.page}</td>
                    <td>{page.views.toLocaleString()}</td>
                    <td>{formatDuration(page.avgTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Traffic Sources Tab */}
        {activeTab === 'sources' && analytics && (
          <div className="sources-section">
            <h3>Traffic Sources</h3>
            <div className="sources-grid">
              {analytics.topSources.map((source, index) => (
                <div key={index} className="source-card">
                  <div className="source-header">
                    <h4>{source.source}</h4>
                    <span className="source-percentage">{source.percentage}%</span>
                  </div>
                  <div className="source-sessions">{source.sessions} sessions</div>
                  <div className="source-progress">
                    <div
                      className="source-progress-bar"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event Tracking Tab */}
        {activeTab === 'tracking' && (
          <div className="tracking-section">
            <h3>🎯 Event Tracking</h3>
            <p>Test event tracking functionality. Events will be sent to Google Analytics.</p>

            <div className="tracking-actions">
              <div className="tracking-card">
                <h4>Page View Event</h4>
                <p>Track when users view a specific page</p>
                <button
                  className="tracking-btn"
                  onClick={() => trackPageView('/demo-page', 'Demo Page')}
                >
                  Track Page View
                </button>
              </div>

              <div className="tracking-card">
                <h4>Button Click Event</h4>
                <p>Track button interactions</p>
                <button
                  className="tracking-btn"
                  onClick={() => handleTrackEvent('button_click')}
                >
                  Track Button Click
                </button>
              </div>

              <div className="tracking-card">
                <h4>Custom Event</h4>
                <p>Track custom user actions</p>
                <button
                  className="tracking-btn"
                  onClick={() => handleTrackEvent('custom_action')}
                >
                  Track Custom Event
                </button>
              </div>

              <div className="tracking-card">
                <h4>Conversion Event</h4>
                <p>Track conversion actions</p>
                <button
                  className="tracking-btn"
                  onClick={() => handleTrackEvent('conversion')}
                >
                  Track Conversion
                </button>
              </div>
            </div>

            <div className="tracking-info">
              <h4>How to View Your Events</h4>
              <ol>
                <li>Go to <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer">Google Analytics</a></li>
                <li>Navigate to Reports → Realtime</li>
                <li>Click on events to see the ones you just tracked</li>
                <li>Events may take a few seconds to appear</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analyzer;
