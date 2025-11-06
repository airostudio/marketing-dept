import { useState, useEffect } from 'react';
import {
  getLists,
  getListMembers,
  addSubscriber,
  getCampaignReports,
  getAccountInfo,
  getConfigStatus,
  getListStats
} from '../integrations/mailchimp';
import './Sage.css';

function Sage() {
  const [activeTab, setActiveTab] = useState('lists');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Lists state
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState('');

  // Add Subscriber form
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscriberFirstName, setSubscriberFirstName] = useState('');
  const [subscriberLastName, setSubscriberLastName] = useState('');
  const [subscriberTags, setSubscriberTags] = useState('');

  // Members state
  const [members, setMembers] = useState([]);

  // Reports state
  const [reports, setReports] = useState([]);

  // Account info state
  const [accountInfo, setAccountInfo] = useState(null);

  const configStatus = getConfigStatus();

  // Load lists on mount
  useEffect(() => {
    if (configStatus.isConfigured) {
      loadLists();
    }
  }, [configStatus.isConfigured]);

  const loadLists = async () => {
    try {
      const data = await getLists();
      setLists(data);
      if (data.length > 0 && !selectedListId) {
        setSelectedListId(data[0].id);
      }
    } catch (err) {
      console.error('Error loading lists:', err);
    }
  };

  const handleViewLists = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await getLists();
      setLists(data);
      setResult({ type: 'lists', data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscriber = async () => {
    if (!selectedListId || !subscriberEmail) {
      setError('Please select a list and enter an email address');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const tags = subscriberTags
        ? subscriberTags.split(',').map(t => t.trim()).filter(t => t)
        : [];

      const data = await addSubscriber({
        listId: selectedListId,
        email: subscriberEmail,
        firstName: subscriberFirstName,
        lastName: subscriberLastName,
        tags
      });

      setResult({ type: 'subscriber', data });
      // Clear form
      setSubscriberEmail('');
      setSubscriberFirstName('');
      setSubscriberLastName('');
      setSubscriberTags('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMembers = async () => {
    if (!selectedListId) {
      setError('Please select a list');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await getListMembers(selectedListId, 50);
      setMembers(data);
      setResult({ type: 'members', data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReports = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await getCampaignReports(10);
      setReports(data);
      setResult({ type: 'reports', data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAccount = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await getAccountInfo();
      setAccountInfo(data);
      setResult({ type: 'account', data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'lists', label: 'Audience Lists', icon: '📋' },
    { id: 'add-subscriber', label: 'Add Subscriber', icon: '➕' },
    { id: 'members', label: 'View Subscribers', icon: '👥' },
    { id: 'reports', label: 'Campaign Reports', icon: '📊' },
    { id: 'account', label: 'Account Info', icon: 'ℹ️' },
  ];

  if (!configStatus.isConfigured) {
    return (
      <div className="sage-page">
        <div className="sage-header">
          <h1>📧 Sage - Email Campaign Manager</h1>
          <p>Powered by Mailchimp</p>
        </div>
        <div className="config-warning">
          <h2>⚠️ Configuration Required</h2>
          <p>{configStatus.message}</p>
          <div className="config-steps">
            <h3>Setup Steps:</h3>
            <ol>
              <li>Sign up at <a href="https://mailchimp.com" target="_blank" rel="noopener noreferrer">mailchimp.com</a></li>
              <li>Get your API key from Account → Extras → API keys</li>
              <li>Note your server prefix (e.g., us7) from your API key</li>
              <li>Add to <code>/app/.env</code>:
                <pre>VITE_MAILCHIMP_API_KEY=your_key_here-us7
VITE_MAILCHIMP_SERVER_PREFIX=us7</pre>
              </li>
              <li>Restart the dev server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sage-page">
      <div className="sage-header">
        <h1>📧 Sage - Email Campaign Manager</h1>
        <p>Powered by Mailchimp - Free: 500 contacts, 2,500 emails/month</p>
      </div>

      <div className="sage-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id);
              setResult(null);
              setError('');
            }}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="sage-content">
        <div className="form-section">
          {/* Audience Lists Tab */}
          {activeTab === 'lists' && (
            <div className="form">
              <h2>📋 View Audience Lists</h2>
              <p>View all your Mailchimp audience lists and their statistics.</p>
              <button
                className="generate-btn"
                onClick={handleViewLists}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load All Lists'}
              </button>
            </div>
          )}

          {/* Add Subscriber Tab */}
          {activeTab === 'add-subscriber' && (
            <div className="form">
              <h2>➕ Add Subscriber</h2>
              <div className="form-group">
                <label>Select List</label>
                <select
                  value={selectedListId}
                  onChange={(e) => setSelectedListId(e.target.value)}
                >
                  <option value="">-- Select a list --</option>
                  {lists.map(list => (
                    <option key={list.id} value={list.id}>
                      {list.name} ({list.stats?.member_count || 0} members)
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={subscriberEmail}
                  onChange={(e) => setSubscriberEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={subscriberFirstName}
                  onChange={(e) => setSubscriberFirstName(e.target.value)}
                  placeholder="John"
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={subscriberLastName}
                  onChange={(e) => setSubscriberLastName(e.target.value)}
                  placeholder="Doe"
                />
              </div>
              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={subscriberTags}
                  onChange={(e) => setSubscriberTags(e.target.value)}
                  placeholder="customer, vip, newsletter"
                />
              </div>
              <button
                className="generate-btn"
                onClick={handleAddSubscriber}
                disabled={loading || !selectedListId || !subscriberEmail}
              >
                {loading ? 'Adding...' : 'Add Subscriber'}
              </button>
            </div>
          )}

          {/* View Members Tab */}
          {activeTab === 'members' && (
            <div className="form">
              <h2>👥 View Subscribers</h2>
              <div className="form-group">
                <label>Select List</label>
                <select
                  value={selectedListId}
                  onChange={(e) => setSelectedListId(e.target.value)}
                >
                  <option value="">-- Select a list --</option>
                  {lists.map(list => (
                    <option key={list.id} value={list.id}>
                      {list.name} ({list.stats?.member_count || 0} members)
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="generate-btn"
                onClick={handleViewMembers}
                disabled={loading || !selectedListId}
              >
                {loading ? 'Loading...' : 'View Subscribers'}
              </button>
            </div>
          )}

          {/* Campaign Reports Tab */}
          {activeTab === 'reports' && (
            <div className="form">
              <h2>📊 Campaign Reports</h2>
              <p>View performance statistics for your recent campaigns.</p>
              <button
                className="generate-btn"
                onClick={handleViewReports}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load Campaign Reports'}
              </button>
            </div>
          )}

          {/* Account Info Tab */}
          {activeTab === 'account' && (
            <div className="form">
              <h2>ℹ️ Account Information</h2>
              <p>View your Mailchimp account details and usage statistics.</p>
              <button
                className="generate-btn"
                onClick={handleViewAccount}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'View Account Info'}
              </button>
            </div>
          )}
        </div>

        <div className="result-section">
          <h3>Results</h3>
          {error && (
            <div className="error-box">
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && result.type === 'lists' && (
            <div className="result-box">
              <h4>Your Audience Lists ({result.data.length})</h4>
              {result.data.map(list => (
                <div key={list.id} className="list-card">
                  <h5>{list.name}</h5>
                  <div className="list-stats">
                    <span>📊 {list.stats?.member_count || 0} members</span>
                    <span>📈 {((list.stats?.open_rate || 0) * 100).toFixed(1)}% open rate</span>
                    <span>🖱️ {((list.stats?.click_rate || 0) * 100).toFixed(1)}% click rate</span>
                  </div>
                  <p className="list-id">ID: {list.id}</p>
                </div>
              ))}
            </div>
          )}

          {result && result.type === 'subscriber' && (
            <div className="result-box success">
              <h4>✅ Subscriber Added Successfully</h4>
              <p><strong>Email:</strong> {result.data.email_address}</p>
              <p><strong>Status:</strong> {result.data.status}</p>
              <p><strong>Name:</strong> {result.data.merge_fields?.FNAME} {result.data.merge_fields?.LNAME}</p>
              {result.data.tags?.length > 0 && (
                <p><strong>Tags:</strong> {result.data.tags.map(t => t.name).join(', ')}</p>
              )}
            </div>
          )}

          {result && result.type === 'members' && (
            <div className="result-box">
              <h4>Subscribers ({result.data.length})</h4>
              <div className="members-list">
                {result.data.map(member => (
                  <div key={member.id} className="member-card">
                    <p><strong>{member.merge_fields?.FNAME} {member.merge_fields?.LNAME}</strong></p>
                    <p>{member.email_address}</p>
                    <span className={`status-badge ${member.status}`}>{member.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && result.type === 'reports' && (
            <div className="result-box">
              <h4>Campaign Reports ({result.data.length})</h4>
              {result.data.map(report => (
                <div key={report.id} className="report-card">
                  <h5>{report.campaign_title}</h5>
                  <div className="report-stats">
                    <div className="stat">
                      <span className="stat-label">Sent</span>
                      <span className="stat-value">{report.emails_sent}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Opens</span>
                      <span className="stat-value">{report.opens?.unique_opens || 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Clicks</span>
                      <span className="stat-value">{report.clicks?.unique_clicks || 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Open Rate</span>
                      <span className="stat-value">{(report.opens?.open_rate || 0).toFixed(2)}%</span>
                    </div>
                  </div>
                  <p className="report-date">Sent: {new Date(report.send_time).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}

          {result && result.type === 'account' && (
            <div className="result-box">
              <h4>Account Information</h4>
              <div className="account-info">
                <p><strong>Account Name:</strong> {result.data.account_name}</p>
                <p><strong>Email:</strong> {result.data.email}</p>
                <p><strong>Contact Count:</strong> {result.data.total_subscribers}</p>
                <p><strong>Industry:</strong> {result.data.industry_stats?.type}</p>
                <p><strong>Plan:</strong> {result.data.pricing_plan_type}</p>
              </div>
            </div>
          )}

          {!result && !error && !loading && (
            <div className="empty-state">
              Select an action from the tabs and click the button to see results here
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Connecting to Mailchimp...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sage;
