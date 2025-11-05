# Free AI Marketing Department

A simple, beautiful landing page showcasing 5 AI marketing workers - all with **100% FREE** tiers!

## 🎯 What This Is

A lightweight React app that introduces your AI marketing team:
- **Casey** (Copy.ai) - AI Copywriter
- **Hunter** (Hunter.io) - Email Finder
- **Sage** (Mailchimp) - Email Campaigns
- **Analyzer** (Google Analytics) - Analytics
- **Heatley** (Hotjar) - UX Analysis

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📦 What You Need to Actually Use These Tools

This landing page showcases the workers, but to **actually use** them, you need:

### 1. Sign Up for Each Platform

All have free tiers! No credit card required for most:

| Platform | Sign Up Link | Free Tier |
|----------|--------------|-----------|
| Copy.ai | https://www.copy.ai | 2,000 words/month |
| Hunter.io | https://hunter.io | 50 searches/month |
| Mailchimp | https://mailchimp.com | 500 contacts |
| Google Analytics | https://analytics.google.com | Unlimited |
| Hotjar | https://www.hotjar.com | 35 sessions/day |

### 2. Get API Keys

Each platform gives you an API key in their settings:

**Copy.ai**: Configuration > API Keys
**Hunter.io**: https://hunter.io/api_keys
**Mailchimp**: Account > Extras > API Keys
**Google Analytics**: Cloud Console (for API access)
**Hotjar**: Settings > Sites (Site ID)

### 3. Store Keys Securely

Create a `.env` file (never commit this!):

```bash
COPYAI_API_KEY=your_key
HUNTERIO_API_KEY=your_key
MAILCHIMP_API_KEY=your_key
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
HOTJAR_SITE_ID=your_id
```

## 📚 Full Setup Guide

For step-by-step instructions on setting up each platform:

**👉 [Complete Setup Guide](../docs/QUICK_START_FREE_PLATFORMS.md)**

This guide includes:
- Detailed signup steps
- API key location for each platform
- Code examples
- Usage limits
- Best practices

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool (super fast!)
- **Pure CSS** - No dependencies, no bloat

## 📊 Stats

- **Build time**: 762ms
- **Bundle size**: 146KB (47KB gzipped)
- **Dependencies**: Just React + Vite
- **Load time**: Lightning fast ⚡

## 🎨 Customization

Edit the worker data in `src/data/workers.js`:

```javascript
export const workers = [
  {
    id: 'casey',
    name: 'Casey',
    emoji: '📝',
    role: 'AI Copywriter',
    platform: 'Copy.ai',
    description: '...',
    capabilities: [...]
  }
  // Add more workers!
]
```

## 🌐 Deployment

This app is configured for Vercel deployment:

```bash
# Deploy to Vercel
vercel

# Or connect your GitHub repo to Vercel
# and it will auto-deploy on push!
```

## 📁 Project Structure

```
app/
├── public/
│   └── assets/          # Logo files
├── src/
│   ├── data/
│   │   └── workers.js   # Worker definitions
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Styles
├── index.html           # HTML template
├── package.json         # Dependencies
└── vite.config.js       # Vite config
```

## ✨ Features

- Responsive design (mobile-friendly)
- Gradient background
- Hover animations
- Worker capability tags
- Platform badges
- Clean, modern UI

## 🔗 Links

- **Live Demo**: (Add your Vercel URL here)
- **Setup Guide**: [docs/QUICK_START_FREE_PLATFORMS.md](../docs/QUICK_START_FREE_PLATFORMS.md)
- **Copy.ai Setup**: [docs/setup/COPYAI_SETUP.md](../docs/setup/COPYAI_SETUP.md)

## 💡 What's Next?

This is a landing page. To make it functional:

1. **Add API Integration**: Create service functions for each platform
2. **Add Forms**: Let users input tasks for workers
3. **Add Dashboard**: Show real metrics from each platform
4. **Add Authentication**: Protect API keys with user accounts

Want to build the full platform? The workers are ready - just connect the APIs!

## 📄 License

MIT

---

**Start building your AI marketing team today - all for free! 🚀**
