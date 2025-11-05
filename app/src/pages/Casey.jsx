import { useState } from 'react';
import {
  generateProductDescription,
  generateSocialPost,
  generateEmailSubjects,
  generateAdCopy,
  generateBlogOutline,
  generateBlogIntro,
  generateMetaDescription,
  generateMarketingCopy,
  isRytrConfigured,
  getConfigStatus
} from '../integrations/rytr';
import './Casey.css';

function Casey() {
  const [activeTab, setActiveTab] = useState('product');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  // Product Description Form
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [productTone, setProductTone] = useState('professional');

  // Social Post Form
  const [socialTopic, setSocialTopic] = useState('');
  const [socialPlatform, setSocialPlatform] = useState('instagram');
  const [socialTone, setSocialTone] = useState('casual');
  const [includeHashtags, setIncludeHashtags] = useState(true);

  // Email Subject Form
  const [emailContent, setEmailContent] = useState('');
  const [emailGoal, setEmailGoal] = useState('open');
  const [subjectCount, setSubjectCount] = useState(5);

  // Ad Copy Form
  const [adProduct, setAdProduct] = useState('');
  const [adPlatform, setAdPlatform] = useState('google');
  const [adCTA, setAdCTA] = useState('Shop Now');
  const [adAudience, setAdAudience] = useState('');

  // Blog Outline Form
  const [blogTopic, setBlogTopic] = useState('');
  const [blogKeywords, setBlogKeywords] = useState('');
  const [blogLength, setBlogLength] = useState('medium');
  const [blogAudience, setBlogAudience] = useState('');

  // Blog Intro Form
  const [introTopic, setIntroTopic] = useState('');
  const [introKeywords, setIntroKeywords] = useState('');
  const [introTone, setIntroTone] = useState('professional');

  // Meta Description Form
  const [metaTitle, setMetaTitle] = useState('');
  const [metaContent, setMetaContent] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');

  // Marketing Copy Form
  const [marketingPurpose, setMarketingPurpose] = useState('');
  const [marketingContext, setMarketingContext] = useState('');
  const [marketingTone, setMarketingTone] = useState('professional');

  const configStatus = getConfigStatus();

  const handleGenerate = async (type) => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      let output;

      switch (type) {
        case 'product':
          output = await generateProductDescription({
            productName,
            features,
            targetAudience,
            tone: productTone
          });
          break;

        case 'social':
          output = await generateSocialPost({
            topic: socialTopic,
            platform: socialPlatform,
            tone: socialTone,
            includeHashtags
          });
          break;

        case 'email':
          const subjects = await generateEmailSubjects({
            emailContent,
            goal: emailGoal,
            count: subjectCount
          });
          output = subjects.join('\n\n');
          break;

        case 'ad':
          const adResult = await generateAdCopy({
            product: adProduct,
            platform: adPlatform,
            cta: adCTA,
            targetAudience: adAudience
          });
          output = `HEADLINES:\n${adResult.headlines.join('\n')}\n\nDESCRIPTIONS:\n${adResult.descriptions.join('\n\n')}\n\nCTAs:\n${adResult.ctas.join('\n')}`;
          break;

        case 'blog-outline':
          const outline = await generateBlogOutline({
            topic: blogTopic,
            keywords: blogKeywords,
            targetLength: blogLength,
            audience: blogAudience
          });
          output = `TITLE: ${outline.title}\n\nOUTLINE:\n${outline.outline}\n\nTARGET LENGTH: ${outline.targetLength}`;
          break;

        case 'blog-intro':
          output = await generateBlogIntro({
            topic: introTopic,
            keywords: introKeywords,
            tone: introTone
          });
          break;

        case 'meta':
          output = await generateMetaDescription({
            pageTitle: metaTitle,
            pageContent: metaContent,
            keywords: metaKeywords
          });
          break;

        case 'marketing':
          output = await generateMarketingCopy({
            purpose: marketingPurpose,
            context: marketingContext,
            tone: marketingTone
          });
          break;

        default:
          throw new Error('Unknown generation type');
      }

      setResult(output);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    alert('Copied to clipboard!');
  };

  const tabs = [
    { id: 'product', label: 'Product Description', icon: '📦' },
    { id: 'social', label: 'Social Media', icon: '📱' },
    { id: 'email', label: 'Email Subjects', icon: '📧' },
    { id: 'ad', label: 'Ad Copy', icon: '📢' },
    { id: 'blog-outline', label: 'Blog Outline', icon: '📝' },
    { id: 'blog-intro', label: 'Blog Intro', icon: '✍️' },
    { id: 'meta', label: 'Meta Description', icon: '🔍' },
    { id: 'marketing', label: 'Marketing Copy', icon: '💼' },
  ];

  if (!configStatus.isConfigured) {
    return (
      <div className="casey-page">
        <div className="casey-header">
          <h1>📝 Casey - AI Copywriter</h1>
          <p>Powered by Rytr.me</p>
        </div>
        <div className="config-warning">
          <h2>⚠️ Configuration Required</h2>
          <p>{configStatus.message}</p>
          <div className="config-steps">
            <h3>Setup Steps:</h3>
            <ol>
              <li>Sign up at <a href="https://rytr.me" target="_blank" rel="noopener noreferrer">rytr.me</a></li>
              <li>Get your API key from Account Settings</li>
              <li>Add <code>VITE_RYTR_API_KEY=your_key_here</code> to your <code>/app/.env</code> file</li>
              <li>Restart the dev server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="casey-page">
      <div className="casey-header">
        <h1>📝 Casey - AI Copywriter</h1>
        <p>Powered by Rytr.me - 10,000 characters/month free</p>
      </div>

      <div className="casey-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id);
              setResult('');
              setError('');
            }}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="casey-content">
        <div className="form-section">
          {/* Product Description Form */}
          {activeTab === 'product' && (
            <div className="form">
              <h2>📦 Generate Product Description</h2>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Smart Water Bottle"
                />
              </div>
              <div className="form-group">
                <label>Features</label>
                <textarea
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="Tracks hydration, glows to remind you to drink, 24oz capacity, BPA-free"
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label>Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Health-conscious professionals"
                />
              </div>
              <div className="form-group">
                <label>Tone</label>
                <select value={productTone} onChange={(e) => setProductTone(e.target.value)}>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="luxury">Luxury</option>
                  <option value="persuasive">Persuasive</option>
                </select>
              </div>
              <button
                className="generate-btn"
                onClick={() => handleGenerate('product')}
                disabled={loading || !productName || !features}
              >
                {loading ? 'Generating...' : 'Generate Product Description'}
              </button>
            </div>
          )}

          {/* Social Media Form */}
          {activeTab === 'social' && (
            <div className="form">
              <h2>📱 Generate Social Media Post</h2>
              <div className="form-group">
                <label>Topic</label>
                <input
                  type="text"
                  value={socialTopic}
                  onChange={(e) => setSocialTopic(e.target.value)}
                  placeholder="New product launch announcement"
                />
              </div>
              <div className="form-group">
                <label>Platform</label>
                <select value={socialPlatform} onChange={(e) => setSocialPlatform(e.target.value)}>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="facebook">Facebook</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tone</label>
                <select value={socialTone} onChange={(e) => setSocialTone(e.target.value)}>
                  <option value="casual">Casual</option>
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="funny">Funny</option>
                  <option value="inspirational">Inspirational</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={includeHashtags}
                    onChange={(e) => setIncludeHashtags(e.target.checked)}
                  />
                  Include Hashtags
                </label>
              </div>
              <button
                className="generate-btn"
                onClick={() => handleGenerate('social')}
                disabled={loading || !socialTopic}
              >
                {loading ? 'Generating...' : 'Generate Social Post'}
              </button>
            </div>
          )}

          {/* Email Subjects Form */}
          {activeTab === 'email' && (
            <div className="form">
              <h2>📧 Generate Email Subject Lines</h2>
              <div className="form-group">
                <label>Email Content Summary</label>
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Brief description of what your email is about"
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label>Goal</label>
                <select value={emailGoal} onChange={(e) => setEmailGoal(e.target.value)}>
                  <option value="open">Maximize Opens</option>
                  <option value="click">Maximize Clicks</option>
                  <option value="purchase">Drive Purchases</option>
                </select>
              </div>
              <div className="form-group">
                <label>Number of Variations</label>
                <input
                  type="number"
                  value={subjectCount}
                  onChange={(e) => setSubjectCount(parseInt(e.target.value))}
                  min="1"
                  max="10"
                />
              </div>
              <button
                className="generate-btn"
                onClick={() => handleGenerate('email')}
                disabled={loading || !emailContent}
              >
                {loading ? 'Generating...' : 'Generate Subject Lines'}
              </button>
            </div>
          )}

          {/* Ad Copy Form */}
          {activeTab === 'ad' && (
            <div className="form">
              <h2>📢 Generate Ad Copy</h2>
              <div className="form-group">
                <label>Product/Service</label>
                <input
                  type="text"
                  value={adProduct}
                  onChange={(e) => setAdProduct(e.target.value)}
                  placeholder="Smart Water Bottle"
                />
              </div>
              <div className="form-group">
                <label>Platform</label>
                <select value={adPlatform} onChange={(e) => setAdPlatform(e.target.value)}>
                  <option value="google">Google Ads</option>
                  <option value="facebook">Facebook/Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
              <div className="form-group">
                <label>Call to Action</label>
                <input
                  type="text"
                  value={adCTA}
                  onChange={(e) => setAdCTA(e.target.value)}
                  placeholder="Shop Now"
                />
              </div>
              <div className="form-group">
                <label>Target Audience</label>
                <input
                  type="text"
                  value={adAudience}
                  onChange={(e) => setAdAudience(e.target.value)}
                  placeholder="Health-conscious professionals aged 25-45"
                />
              </div>
              <button
                className="generate-btn"
                onClick={() => handleGenerate('ad')}
                disabled={loading || !adProduct || !adAudience}
              >
                {loading ? 'Generating...' : 'Generate Ad Copy'}
              </button>
            </div>
          )}

          {/* Blog Outline Form */}
          {activeTab === 'blog-outline' && (
            <div className="form">
              <h2>📝 Generate Blog Outline</h2>
              <div className="form-group">
                <label>Topic</label>
                <input
                  type="text"
                  value={blogTopic}
                  onChange={(e) => setBlogTopic(e.target.value)}
                  placeholder="10 Ways to Stay Hydrated at Work"
                />
              </div>
              <div className="form-group">
                <label>Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={blogKeywords}
                  onChange={(e) => setBlogKeywords(e.target.value)}
                  placeholder="hydration, water, productivity, health"
                />
              </div>
              <div className="form-group">
                <label>Target Length</label>
                <select value={blogLength} onChange={(e) => setBlogLength(e.target.value)}>
                  <option value="short">Short (500-800 words)</option>
                  <option value="medium">Medium (1000-1500 words)</option>
                  <option value="long">Long (2000+ words)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Target Audience</label>
                <input
                  type="text"
                  value={blogAudience}
                  onChange={(e) => setBlogAudience(e.target.value)}
                  placeholder="Office workers"
                />
              </div>
              <button
                className="generate-btn"
                onClick={() => handleGenerate('blog-outline')}
                disabled={loading || !blogTopic}
              >
                {loading ? 'Generating...' : 'Generate Blog Outline'}
              </button>
            </div>
          )}

          {/* Blog Intro Form */}
          {activeTab === 'blog-intro' && (
            <div className="form">
              <h2>✍️ Generate Blog Introduction</h2>
              <div className="form-group">
                <label>Topic</label>
                <input
                  type="text"
                  value={introTopic}
                  onChange={(e) => setIntroTopic(e.target.value)}
                  placeholder="The Importance of Hydration"
                />
              </div>
              <div className="form-group">
                <label>Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={introKeywords}
                  onChange={(e) => setIntroKeywords(e.target.value)}
                  placeholder="hydration, health, water"
                />
              </div>
              <div className="form-group">
                <label>Tone</label>
                <select value={introTone} onChange={(e) => setIntroTone(e.target.value)}>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="inspirational">Inspirational</option>
                </select>
              </div>
              <button
                className="generate-btn"
                onClick={() => handleGenerate('blog-intro')}
                disabled={loading || !introTopic}
              >
                {loading ? 'Generating...' : 'Generate Blog Intro'}
              </button>
            </div>
          )}

          {/* Meta Description Form */}
          {activeTab === 'meta' && (
            <div className="form">
              <h2>🔍 Generate SEO Meta Description</h2>
              <div className="form-group">
                <label>Page Title</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Smart Water Bottle - Stay Hydrated"
                />
              </div>
              <div className="form-group">
                <label>Page Content Summary</label>
                <textarea
                  value={metaContent}
                  onChange={(e) => setMetaContent(e.target.value)}
                  placeholder="Brief description of what the page is about"
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label>Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  placeholder="water bottle, hydration, smart bottle"
                />
              </div>
              <button
                className="generate-btn"
                onClick={() => handleGenerate('meta')}
                disabled={loading || !metaTitle || !metaContent}
              >
                {loading ? 'Generating...' : 'Generate Meta Description'}
              </button>
            </div>
          )}

          {/* Marketing Copy Form */}
          {activeTab === 'marketing' && (
            <div className="form">
              <h2>💼 Generate Marketing Copy</h2>
              <div className="form-group">
                <label>Purpose</label>
                <input
                  type="text"
                  value={marketingPurpose}
                  onChange={(e) => setMarketingPurpose(e.target.value)}
                  placeholder="Landing page hero section"
                />
              </div>
              <div className="form-group">
                <label>Context</label>
                <textarea
                  value={marketingContext}
                  onChange={(e) => setMarketingContext(e.target.value)}
                  placeholder="Product details, target audience, key benefits, etc."
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label>Tone</label>
                <select value={marketingTone} onChange={(e) => setMarketingTone(e.target.value)}>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="persuasive">Persuasive</option>
                  <option value="luxury">Luxury</option>
                  <option value="urgent">Urgent</option>
                  <option value="friendly">Friendly</option>
                </select>
              </div>
              <button
                className="generate-btn"
                onClick={() => handleGenerate('marketing')}
                disabled={loading || !marketingPurpose || !marketingContext}
              >
                {loading ? 'Generating...' : 'Generate Marketing Copy'}
              </button>
            </div>
          )}
        </div>

        <div className="result-section">
          <h3>Generated Copy</h3>
          {error && (
            <div className="error-box">
              <strong>Error:</strong> {error}
            </div>
          )}
          {result && (
            <>
              <div className="result-box">
                <pre>{result}</pre>
              </div>
              <button className="copy-btn" onClick={copyToClipboard}>
                📋 Copy to Clipboard
              </button>
            </>
          )}
          {!result && !error && !loading && (
            <div className="empty-state">
              Fill out the form and click generate to see results here
            </div>
          )}
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Generating copy with Rytr.me...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Casey;
