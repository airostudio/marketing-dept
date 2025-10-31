import { useState } from 'react';
import './SiteEditor.css';

export default function SiteEditor() {
  const [editMode, setEditMode] = useState(true);
  const [content, setContent] = useState({
    hero: {
      heading: 'Welcome to Your Website',
      subheading: 'Build something amazing with our platform',
      buttonText: 'Get Started'
    },
    about: {
      heading: 'About Us',
      text: 'We help businesses grow with powerful AI tools.'
    },
    features: {
      heading: 'Features',
      items: [
        { icon: '🚀', title: 'Fast', description: 'Lightning-fast performance' },
        { icon: '💎', title: 'Beautiful', description: 'Stunning designs' },
        { icon: '🔒', title: 'Secure', description: 'Enterprise-grade security' }
      ]
    },
    contact: {
      heading: 'Get In Touch',
      email: 'hello@example.com',
      phone: '+1 (555) 123-4567'
    }
  });

  const [selectedSection, setSelectedSection] = useState(null);
  const [colors, setColors] = useState({
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb'
  });

  const updateContent = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateFeature = (index, field, value) => {
    setContent(prev => ({
      ...prev,
      features: {
        ...prev.features,
        items: prev.features.items.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const exportHTML = () => {
    const html = generateHTML(content, colors);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.html';
    a.click();
  };

  return (
    <div className="editor-container">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <h1 className="toolbar-title">🎨 Site Editor</h1>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`toolbar-btn ${editMode ? 'active' : ''}`}
          >
            {editMode ? '✏️ Editing' : '👁️ Preview'}
          </button>
        </div>

        <div className="toolbar-right">
          <button onClick={exportHTML} className="toolbar-btn export">
            💾 Export HTML
          </button>
          <button className="toolbar-btn publish">
            🚀 Publish
          </button>
        </div>
      </div>

      <div className="editor-main">
        {/* Sidebar */}
        {editMode && (
          <div className="editor-sidebar">
            <div className="sidebar-section">
              <h3>Sections</h3>
              <div className="section-list">
                {['hero', 'about', 'features', 'contact'].map(section => (
                  <button
                    key={section}
                    onClick={() => setSelectedSection(section)}
                    className={`section-item ${selectedSection === section ? 'active' : ''}`}
                  >
                    <span className="section-icon">
                      {section === 'hero' && '🎯'}
                      {section === 'about' && 'ℹ️'}
                      {section === 'features' && '✨'}
                      {section === 'contact' && '📧'}
                    </span>
                    <span className="section-name">{section}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Colors</h3>
              <div className="color-picker-group">
                <div>
                  <label>Primary</label>
                  <input
                    type="color"
                    value={colors.primary}
                    onChange={(e) => setColors({...colors, primary: e.target.value})}
                  />
                </div>
                <div>
                  <label>Secondary</label>
                  <input
                    type="color"
                    value={colors.secondary}
                    onChange={(e) => setColors({...colors, secondary: e.target.value})}
                  />
                </div>
                <div>
                  <label>Accent</label>
                  <input
                    type="color"
                    value={colors.accent}
                    onChange={(e) => setColors({...colors, accent: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Canvas */}
        <div className="editor-canvas">
          <div className="website-preview">
            {/* Hero Section */}
            <section
              className={`section-hero ${editMode && selectedSection === 'hero' ? 'selected' : ''}`}
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
              }}
              onClick={() => editMode && setSelectedSection('hero')}
            >
              <div className="hero-content">
                {editMode ? (
                  <>
                    <input
                      className="editable-heading"
                      value={content.hero.heading}
                      onChange={(e) => updateContent('hero', 'heading', e.target.value)}
                      placeholder="Heading"
                    />
                    <input
                      className="editable-subheading"
                      value={content.hero.subheading}
                      onChange={(e) => updateContent('hero', 'subheading', e.target.value)}
                      placeholder="Subheading"
                    />
                    <input
                      className="editable-button"
                      value={content.hero.buttonText}
                      onChange={(e) => updateContent('hero', 'buttonText', e.target.value)}
                      placeholder="Button Text"
                      style={{ backgroundColor: colors.accent }}
                    />
                  </>
                ) : (
                  <>
                    <h1>{content.hero.heading}</h1>
                    <p>{content.hero.subheading}</p>
                    <button style={{ backgroundColor: colors.accent }}>
                      {content.hero.buttonText}
                    </button>
                  </>
                )}
              </div>
            </section>

            {/* About Section */}
            <section
              className={`section-about ${editMode && selectedSection === 'about' ? 'selected' : ''}`}
              onClick={() => editMode && setSelectedSection('about')}
            >
              <div className="about-content">
                {editMode ? (
                  <>
                    <input
                      className="editable-heading-dark"
                      value={content.about.heading}
                      onChange={(e) => updateContent('about', 'heading', e.target.value)}
                      style={{ color: colors.primary }}
                    />
                    <textarea
                      className="editable-text"
                      value={content.about.text}
                      onChange={(e) => updateContent('about', 'text', e.target.value)}
                      rows={3}
                    />
                  </>
                ) : (
                  <>
                    <h2 style={{ color: colors.primary }}>{content.about.heading}</h2>
                    <p>{content.about.text}</p>
                  </>
                )}
              </div>
            </section>

            {/* Features Section */}
            <section
              className={`section-features ${editMode && selectedSection === 'features' ? 'selected' : ''}`}
              onClick={() => editMode && setSelectedSection('features')}
            >
              <div className="features-content">
                {editMode ? (
                  <input
                    className="editable-heading-dark"
                    value={content.features.heading}
                    onChange={(e) => updateContent('features', 'heading', e.target.value)}
                    style={{ color: colors.primary }}
                  />
                ) : (
                  <h2 style={{ color: colors.primary }}>{content.features.heading}</h2>
                )}

                <div className="features-grid">
                  {content.features.items.map((feature, index) => (
                    <div key={index} className="feature-card">
                      {editMode ? (
                        <>
                          <input
                            className="editable-icon"
                            value={feature.icon}
                            onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                            maxLength={2}
                          />
                          <input
                            className="editable-feature-title"
                            value={feature.title}
                            onChange={(e) => updateFeature(index, 'title', e.target.value)}
                          />
                          <textarea
                            className="editable-feature-desc"
                            value={feature.description}
                            onChange={(e) => updateFeature(index, 'description', e.target.value)}
                            rows={2}
                          />
                        </>
                      ) : (
                        <>
                          <div className="feature-icon">{feature.icon}</div>
                          <h3>{feature.title}</h3>
                          <p>{feature.description}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section
              className={`section-contact ${editMode && selectedSection === 'contact' ? 'selected' : ''}`}
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
              }}
              onClick={() => editMode && setSelectedSection('contact')}
            >
              <div className="contact-content">
                {editMode ? (
                  <>
                    <input
                      className="editable-heading"
                      value={content.contact.heading}
                      onChange={(e) => updateContent('contact', 'heading', e.target.value)}
                    />
                    <input
                      className="editable-contact"
                      value={content.contact.email}
                      onChange={(e) => updateContent('contact', 'email', e.target.value)}
                      placeholder="Email"
                    />
                    <input
                      className="editable-contact"
                      value={content.contact.phone}
                      onChange={(e) => updateContent('contact', 'phone', e.target.value)}
                      placeholder="Phone"
                    />
                  </>
                ) : (
                  <>
                    <h2>{content.contact.heading}</h2>
                    <p>📧 {content.contact.email}</p>
                    <p>📱 {content.contact.phone}</p>
                  </>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Properties Panel */}
        {editMode && selectedSection && (
          <div className="editor-properties">
            <h3>Properties</h3>
            <div className="properties-content">
              <p className="properties-hint">
                Click on text in the canvas to edit directly, or use the sidebar to navigate between sections.
              </p>

              <div className="property-group">
                <label>Section: <strong>{selectedSection}</strong></label>
                <p className="property-desc">
                  {selectedSection === 'hero' && 'Main header section with call-to-action'}
                  {selectedSection === 'about' && 'Tell visitors about your business'}
                  {selectedSection === 'features' && 'Highlight your key features'}
                  {selectedSection === 'contact' && 'Contact information section'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function generateHTML(content, colors) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.hero.heading}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    section { padding: 80px 20px; text-align: center; }
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
      color: white;
    }
    .hero h1 { font-size: 4rem; margin-bottom: 1rem; }
    .hero p { font-size: 1.5rem; margin-bottom: 2rem; opacity: 0.9; }
    .hero button {
      background: ${colors.accent};
      color: white;
      border: none;
      padding: 1rem 3rem;
      font-size: 1.2rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
    }
    .about { background: #f8f9fa; }
    .about h2 { font-size: 3rem; color: ${colors.primary}; margin-bottom: 1rem; }
    .about p { font-size: 1.2rem; max-width: 800px; margin: 0 auto; color: #666; }
    .features { background: white; }
    .features h2 { font-size: 3rem; color: ${colors.primary}; margin-bottom: 3rem; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto; }
    .feature { background: #f8f9fa; padding: 2rem; border-radius: 12px; }
    .feature-icon { font-size: 3rem; margin-bottom: 1rem; }
    .feature h3 { font-size: 1.5rem; color: ${colors.primary}; margin-bottom: 0.5rem; }
    .feature p { color: #666; }
    .contact {
      background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
      color: white;
    }
    .contact h2 { font-size: 3rem; margin-bottom: 2rem; }
    .contact p { font-size: 1.2rem; margin: 0.5rem 0; }
  </style>
</head>
<body>
  <section class="hero">
    <div>
      <h1>${content.hero.heading}</h1>
      <p>${content.hero.subheading}</p>
      <button>${content.hero.buttonText}</button>
    </div>
  </section>

  <section class="about">
    <h2>${content.about.heading}</h2>
    <p>${content.about.text}</p>
  </section>

  <section class="features">
    <h2>${content.features.heading}</h2>
    <div class="features-grid">
      ${content.features.items.map(feature => `
        <div class="feature">
          <div class="feature-icon">${feature.icon}</div>
          <h3>${feature.title}</h3>
          <p>${feature.description}</p>
        </div>
      `).join('')}
    </div>
  </section>

  <section class="contact">
    <h2>${content.contact.heading}</h2>
    <p>📧 ${content.contact.email}</p>
    <p>📱 ${content.contact.phone}</p>
  </section>
</body>
</html>`;
}
