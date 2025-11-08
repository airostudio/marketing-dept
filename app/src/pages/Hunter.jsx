import { useState, useEffect } from 'react';
import {
  domainSearch,
  emailFinder,
  verifyEmail,
  getAccountInfo,
  createCampaign,
  getCampaigns,
  addCampaignRecipients,
  sendCampaign,
  getCampaignStats,
  pauseCampaign,
  isHunterConfigured,
  getConfigStatus
} from '../integrations/hunter';
import './Hunter.css';

function Hunter() {
  const [activeTab, setActiveTab] = useState('domain');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Domain Search Form
  const [domain, setDomain] = useState('');

  // Email Finder Form
  const [finderDomain, setFinderDomain] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');

  // Email Verification Form
  const [emailToVerify, setEmailToVerify] = useState('');

  // Campaign Management
  const [campaigns, setCampaigns] = useState([]);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignBody, setCampaignBody] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [fromName, setFromName] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Recipients for campaign
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientFirstName, setRecipientFirstName] = useState('');
  const [recipientLastName, setRecipientLastName] = useState('');
  const [recipientCompany, setRecipientCompany] = useState('');
  const [recipientsList, setRecipientsList] = useState([]);

  const configStatus = getConfigStatus();

  // Load campaigns when tab changes to campaigns
  useEffect(() => {
    if (activeTab === 'campaigns' && configStatus.isConfigured) {
      loadCampaigns();
    }
  }, [activeTab, configStatus.isConfigured]);

  const loadCampaigns = async () => {
    try {
      const data = await getCampaigns();
      setCampaigns(data);
    } catch (err) {
      console.error('Error loading campaigns:', err);
    }
  };

  const handleDomainSearch = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await domainSearch(domain);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailFinder = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await emailFinder({
        domain: finderDomain,
        firstName,
        lastName,
        company
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerification = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await verifyEmail(emailToVerify);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAccount = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await getAccountInfo();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    setLoading(true);
    setError('');

    try {
      const campaign = await createCampaign({
        name: campaignName,
        subject: campaignSubject,
        emailContent: campaignBody,
        fromEmail,
        fromName
      });

      // Add recipients to campaign if any
      if (recipientsList.length > 0) {
        await addCampaignRecipients(campaign.id, recipientsList);
      }

      alert(`Campaign "${campaignName}" created successfully!`);

      // Reset form
      setCampaignName('');
      setCampaignSubject('');
      setCampaignBody('');
      setFromEmail('');
      setFromName('');
      setRecipientsList([]);
      setShowCampaignForm(false);

      // Reload campaigns
      await loadCampaigns();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecipient = () => {
    if (!recipientEmail) {
      alert('Email is required');
      return;
    }

    const newRecipient = {
      email: recipientEmail,
      firstName: recipientFirstName,
      lastName: recipientLastName,
      company: recipientCompany
    };

    setRecipientsList([...recipientsList, newRecipient]);

    // Clear recipient form
    setRecipientEmail('');
    setRecipientFirstName('');
    setRecipientLastName('');
    setRecipientCompany('');
  };

  const handleRemoveRecipient = (index) => {
    setRecipientsList(recipientsList.filter((_, i) => i !== index));
  };

  const handleSendCampaign = async (campaignId) => {
    if (!confirm('Are you sure you want to send this campaign?')) {
      return;
    }

    setLoading(true);
    try {
      await sendCampaign(campaignId);
      alert('Campaign sent successfully!');
      await loadCampaigns();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseCampaign = async (campaignId) => {
    setLoading(true);
    try {
      await pauseCampaign(campaignId);
      alert('Campaign paused successfully!');
      await loadCampaigns();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStats = async (campaignId) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const stats = await getCampaignStats(campaignId);
      setResult({ campaignStats: stats });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (!configStatus.isConfigured) {
    return (
      <div className="hunter-page">
        <div className="hunter-header">
          <h1>🎯 Hunter - Email Finder & Campaign Manager</h1>
          <p>Powered by Hunter.io</p>
        </div>
        <div className="config-warning">
          <h2>⚠️ Configuration Required</h2>
          <p>{configStatus.message}</p>
          <div className="config-steps">
            <h3>Setup Steps:</h3>
            <ol>
              <li>Sign up at <a href="https://hunter.io" target="_blank" rel="noopener noreferrer">hunter.io</a></li>
              <li>Go to Dashboard &gt; API section</li>
              <li>Copy your API key</li>
              <li>Add <code>VITE_HUNTERIO_API_KEY=your_key_here</code> to your <code>/app/.env</code> file</li>
              <li>Restart the dev server</li>
            </ol>
            <p className="free-tier-info">
              <strong>Free Tier:</strong> 50 searches/month
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'domain', label: 'Domain Search', icon: '🔍' },
    { id: 'finder', label: 'Email Finder', icon: '📧' },
    { id: 'verify', label: 'Verify Email', icon: '✅' },
    { id: 'campaigns', label: 'Campaigns', icon: '📨' },
    { id: 'account', label: 'Account Info', icon: '📊' },
  ];

  return (
    <div className="hunter-page">
      <div className="hunter-header">
        <h1>🎯 Hunter - Email Finder & Campaign Manager</h1>
        <p>Powered by Hunter.io - Find leads, verify emails, send cold campaigns</p>
      </div>

      <div className="hunter-tabs">
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

      <div className="hunter-content">
        <div className="form-section">
          {/* Domain Search Form */}
          {activeTab === 'domain' && (
            <div className="form">
              <h2>🔍 Search Domain for Emails</h2>
              <p className="form-description">
                Find all email addresses associated with a company domain using Hunter's B2B lead database
              </p>
              <div className="form-group">
                <label>Company Domain</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example.com"
                />
              </div>
              <button
                className="generate-btn"
                onClick={handleDomainSearch}
                disabled={loading || !domain}
              >
                {loading ? 'Searching...' : 'Search Domain'}
              </button>
            </div>
          )}

          {/* Email Finder Form */}
          {activeTab === 'finder' && (
            <div className="form">
              <h2>📧 Find Specific Person's Email</h2>
              <p className="form-description">
                Find a person's email using their name and company
              </p>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                />
              </div>
              <div className="form-group">
                <label>Domain</label>
                <input
                  type="text"
                  value={finderDomain}
                  onChange={(e) => setFinderDomain(e.target.value)}
                  placeholder="example.com"
                />
              </div>
              <div className="form-group">
                <label>Company Name (optional)</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Inc"
                />
              </div>
              <button
                className="generate-btn"
                onClick={handleEmailFinder}
                disabled={loading || !firstName || !lastName || !finderDomain}
              >
                {loading ? 'Finding...' : 'Find Email'}
              </button>
            </div>
          )}

          {/* Email Verification Form */}
          {activeTab === 'verify' && (
            <div className="form">
              <h2>✅ Verify Email Address</h2>
              <p className="form-description">
                Verify individual email addresses with the most complete email checker
              </p>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={emailToVerify}
                  onChange={(e) => setEmailToVerify(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>
              <button
                className="generate-btn"
                onClick={handleEmailVerification}
                disabled={loading || !emailToVerify}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="form campaigns-section">
              <div className="campaigns-header">
                <h2>📨 Cold Email Campaigns</h2>
                <button
                  className="start-campaign-btn"
                  onClick={() => setShowCampaignForm(!showCampaignForm)}
                  disabled={loading}
                >
                  {showCampaignForm ? '← Back to Campaigns' : '✉️ Start a Campaign'}
                </button>
              </div>

              {!showCampaignForm && (
                <div className="campaigns-list">
                  <p className="form-description">
                    Create, personalize, schedule, and send targeted cold email campaigns at scale
                  </p>
                  {campaigns.length === 0 ? (
                    <div className="no-campaigns">
                      <p>No campaigns yet. Click "Start a Campaign" to create your first campaign!</p>
                    </div>
                  ) : (
                    <div className="campaign-cards">
                      {campaigns.map(campaign => (
                        <div key={campaign.id} className="campaign-card">
                          <div className="campaign-info">
                            <h4>{campaign.name}</h4>
                            <p className="campaign-subject">Subject: {campaign.subject}</p>
                            <div className="campaign-meta">
                              <span>Status: {campaign.status}</span>
                              <span>Recipients: {campaign.recipients_count || 0}</span>
                            </div>
                          </div>
                          <div className="campaign-actions">
                            {campaign.status === 'draft' && (
                              <button
                                className="campaign-action-btn send"
                                onClick={() => handleSendCampaign(campaign.id)}
                                disabled={loading}
                              >
                                Send
                              </button>
                            )}
                            {campaign.status === 'running' && (
                              <button
                                className="campaign-action-btn pause"
                                onClick={() => handlePauseCampaign(campaign.id)}
                                disabled={loading}
                              >
                                Pause
                              </button>
                            )}
                            <button
                              className="campaign-action-btn stats"
                              onClick={() => handleViewStats(campaign.id)}
                              disabled={loading}
                            >
                              View Stats
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {showCampaignForm && (
                <div className="campaign-form">
                  <h3>Create New Campaign</h3>

                  <div className="form-group">
                    <label>Campaign Name *</label>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="Q4 Outreach Campaign"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Subject *</label>
                    <input
                      type="text"
                      value={campaignSubject}
                      onChange={(e) => setCampaignSubject(e.target.value)}
                      placeholder="Quick question about {company}"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Body *</label>
                    <textarea
                      value={campaignBody}
                      onChange={(e) => setCampaignBody(e.target.value)}
                      placeholder="Hi {first_name},&#10;&#10;I noticed your work at {company}...&#10;&#10;Best regards,&#10;{from_name}"
                      rows={8}
                    />
                    <small>Use variables: {'{first_name}'}, {'{last_name}'}, {'{company}'}, {'{from_name}'}</small>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>From Name *</label>
                      <input
                        type="text"
                        value={fromName}
                        onChange={(e) => setFromName(e.target.value)}
                        placeholder="John Smith"
                      />
                    </div>

                    <div className="form-group">
                      <label>From Email *</label>
                      <input
                        type="email"
                        value={fromEmail}
                        onChange={(e) => setFromEmail(e.target.value)}
                        placeholder="john@yourcompany.com"
                      />
                    </div>
                  </div>

                  <div className="recipients-section">
                    <h4>Add Recipients</h4>
                    <div className="recipient-form">
                      <div className="form-row">
                        <div className="form-group">
                          <input
                            type="email"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            placeholder="recipient@example.com"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="text"
                            value={recipientFirstName}
                            onChange={(e) => setRecipientFirstName(e.target.value)}
                            placeholder="First Name"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="text"
                            value={recipientLastName}
                            onChange={(e) => setRecipientLastName(e.target.value)}
                            placeholder="Last Name"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="text"
                            value={recipientCompany}
                            onChange={(e) => setRecipientCompany(e.target.value)}
                            placeholder="Company"
                          />
                        </div>
                        <button
                          type="button"
                          className="add-recipient-btn"
                          onClick={handleAddRecipient}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {recipientsList.length > 0 && (
                      <div className="recipients-list">
                        <h5>Recipients ({recipientsList.length})</h5>
                        {recipientsList.map((recipient, idx) => (
                          <div key={idx} className="recipient-item">
                            <span>{recipient.email}</span>
                            <span>{recipient.firstName} {recipient.lastName}</span>
                            <span>{recipient.company}</span>
                            <button
                              onClick={() => handleRemoveRecipient(idx)}
                              className="remove-btn"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    className="generate-btn create-campaign-btn"
                    onClick={handleCreateCampaign}
                    disabled={loading || !campaignName || !campaignSubject || !campaignBody || !fromEmail || !fromName}
                  >
                    {loading ? 'Creating Campaign...' : 'Create Campaign'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Account Info */}
          {activeTab === 'account' && (
            <div className="form">
              <h2>📊 Account Information</h2>
              <p className="form-description">
                View your Hunter.io account usage and remaining requests
              </p>
              <button
                className="generate-btn"
                onClick={handleCheckAccount}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Check Account Status'}
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
          {result && (
            <div className="result-box">
              {/* Domain Search Results */}
              {activeTab === 'domain' && result.emails && (
                <div className="domain-results">
                  <h4>Found {result.emails.length} emails for {result.domain}</h4>
                  <div className="emails-list">
                    {result.emails.slice(0, 10).map((email, idx) => (
                      <div key={idx} className="email-item">
                        <div className="email-info">
                          <strong>{email.value}</strong>
                          {email.first_name && email.last_name && (
                            <span className="email-name">
                              {email.first_name} {email.last_name}
                            </span>
                          )}
                          {email.position && (
                            <span className="email-position">{email.position}</span>
                          )}
                        </div>
                        <button
                          className="copy-mini-btn"
                          onClick={() => copyToClipboard(email.value)}
                        >
                          📋
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Email Finder Results */}
              {activeTab === 'finder' && result.email && (
                <div className="finder-results">
                  <h4>Email Found!</h4>
                  <div className="found-email">
                    <div className="email-main">{result.email}</div>
                    <div className="email-score">
                      Confidence Score: {result.score}%
                    </div>
                    <button
                      className="copy-btn"
                      onClick={() => copyToClipboard(result.email)}
                    >
                      📋 Copy Email
                    </button>
                  </div>
                </div>
              )}

              {/* Email Verification Results */}
              {activeTab === 'verify' && result.result && (
                <div className="verify-results">
                  <h4>Verification Result</h4>
                  <div className={`verification-status ${result.result}`}>
                    <div className="status-badge">
                      {result.result === 'deliverable' && '✅ Deliverable'}
                      {result.result === 'undeliverable' && '❌ Undeliverable'}
                      {result.result === 'risky' && '⚠️ Risky'}
                    </div>
                    <div className="status-details">
                      <p><strong>Email:</strong> {result.email}</p>
                      <p><strong>Score:</strong> {result.score}%</p>
                      {result.regexp && <p>✅ Valid format</p>}
                      {result.mx_records && <p>✅ MX records found</p>}
                      {result.smtp_check && <p>✅ SMTP check passed</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Campaign Stats Results */}
              {activeTab === 'campaigns' && result.campaignStats && (
                <div className="campaign-stats-results">
                  <h4>Campaign Statistics</h4>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-label">Sent</div>
                      <div className="stat-value">{result.campaignStats.sent || 0}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Opened</div>
                      <div className="stat-value">{result.campaignStats.opened || 0}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Clicked</div>
                      <div className="stat-value">{result.campaignStats.clicked || 0}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Replied</div>
                      <div className="stat-value">{result.campaignStats.replied || 0}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Info Results */}
              {activeTab === 'account' && result.requests && (
                <div className="account-results">
                  <h4>Account Usage</h4>
                  <div className="usage-stats">
                    <div className="usage-item">
                      <div className="usage-label">Domain Searches</div>
                      <div className="usage-value">
                        {result.requests.searches.used} / {result.requests.searches.available + result.requests.searches.used}
                      </div>
                      <div className="usage-remaining">
                        {result.requests.searches.available} remaining
                      </div>
                    </div>
                    <div className="usage-item">
                      <div className="usage-label">Verifications</div>
                      <div className="usage-value">
                        {result.requests.verifications.used} / {result.requests.verifications.available + result.requests.verifications.used}
                      </div>
                      <div className="usage-remaining">
                        {result.requests.verifications.available} remaining
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {!result && !error && !loading && (
            <div className="empty-state">
              {activeTab === 'campaigns' && !showCampaignForm
                ? 'Your campaigns will appear here. Click "Start a Campaign" to begin!'
                : 'Fill out the form and click the button to see results here'}
            </div>
          )}
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Processing your request...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Hunter;
