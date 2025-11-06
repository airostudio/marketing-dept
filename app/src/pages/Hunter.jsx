import { useState } from 'react';
import {
  domainSearch,
  emailFinder,
  verifyEmail,
  getAccountInfo,
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

  const configStatus = getConfigStatus();

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (!configStatus.isConfigured) {
    return (
      <div className="hunter-page">
        <div className="hunter-header">
          <h1>🎯 Hunter - Email Finder</h1>
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
    { id: 'account', label: 'Account Info', icon: '📊' },
  ];

  return (
    <div className="hunter-page">
      <div className="hunter-header">
        <h1>🎯 Hunter - Email Finder</h1>
        <p>Powered by Hunter.io - 50 searches/month free</p>
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
                Find all email addresses associated with a company domain
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
                Check if an email address is valid and deliverable
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
              Fill out the form and click the button to see results here
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
