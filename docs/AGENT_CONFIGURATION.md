# Agent Configuration Guide

## 📍 Environment File Location

All API keys and configuration for the AI Marketing Department are stored in:

```
/home/user/marketing-dept/app/.env
```

**Important**: This file is gitignored and will NOT be committed to version control for security.

---

## 🔑 Current Configuration

### ✅ Already Configured

#### Casey (AI Copywriter) - Rytr.me
**Location**: `/home/user/marketing-dept/app/.env`

```bash
# Rytr.me API Configuration
VITE_RYTR_API_KEY=90ECPFOACTFO2KE2LPHZR
```

**Status**: ✅ Active (Unlimited tier)
**Platform**: https://app.rytr.me
**Worker File**: `/agents/workers/casey-the-copywriter.json`

---

## ⚙️ Pending Configuration

These workers need API keys to be added to `/app/.env`:

### Hunter (Lead Hunter) - Hunter.io
**Platform**: https://hunter.io
**Worker File**: `/agents/workers/hunter-the-finder.json`

```bash
# Add to /app/.env
VITE_HUNTERIO_API_KEY=your_api_key_here
```

**How to get**:
1. Sign up at https://hunter.io
2. Go to API section in dashboard
3. Copy your API key
4. Free tier: 50 searches/month

---

### Sage (Email Marketing) - Mailchimp
**Platform**: https://mailchimp.com
**Worker File**: `/agents/workers/sage-the-send-timer.json`

```bash
# Add to /app/.env
VITE_MAILCHIMP_API_KEY=your_api_key_here
VITE_MAILCHIMP_SERVER_PREFIX=us1  # Check your API key for server prefix
```

**How to get**:
1. Sign up at https://mailchimp.com
2. Go to Account > Extras > API keys
3. Generate new API key
4. Note your server prefix (e.g., us1, us2, etc.)
5. Free tier: 500 contacts

---

### Analyzer (Analytics) - Google Analytics
**Platform**: https://analytics.google.com
**Worker File**: `/agents/workers/analyzer-the-insight-finder.json`

```bash
# Add to /app/.env
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

**How to get**:
1. Create Google Analytics account
2. Set up a new property
3. Get your Measurement ID (starts with G-)
4. Free tier: Unlimited

---

### Heatley (UX Analytics) - Hotjar
**Platform**: https://www.hotjar.com
**Worker File**: `/agents/workers/heatley-the-heatmapper.json`

```bash
# Add to /app/.env
VITE_HOTJAR_SITE_ID=your_site_id_here
```

**How to get**:
1. Sign up at https://www.hotjar.com
2. Add your website
3. Get your Site ID from dashboard
4. Free tier: 35 sessions/day

---

### Sonic (Content Writer) - Writesonic
**Platform**: https://writesonic.com
**Worker File**: `/agents/workers/sonic-the-writer.json`

```bash
# Add to /app/.env
VITE_WRITESONIC_API_KEY=your_api_key_here
```

**How to get**:
1. Sign up at https://writesonic.com
2. Go to Settings > API Keys
3. Generate new API key
4. Free tier: 10,000 words/month

---

## 📝 Complete .env File Template

Here's what your `/app/.env` file should look like with all agents configured:

```bash
# ===================================
# AI MARKETING DEPARTMENT - API KEYS
# ===================================

# Casey - AI Copywriter (Rytr.me) ✅ CONFIGURED
VITE_RYTR_API_KEY=90ECPFOACTFO2KE2LPHZR

# Hunter - Lead Hunter (Hunter.io)
VITE_HUNTERIO_API_KEY=your_hunterio_key_here

# Sage - Email Marketing (Mailchimp)
VITE_MAILCHIMP_API_KEY=your_mailchimp_key_here
VITE_MAILCHIMP_SERVER_PREFIX=us1

# Analyzer - Analytics (Google Analytics)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# Heatley - UX Analytics (Hotjar)
VITE_HOTJAR_SITE_ID=your_hotjar_site_id_here

# Sonic - Content Writer (Writesonic)
VITE_WRITESONIC_API_KEY=your_writesonic_key_here

# ===================================
# IMPORTANT NOTES
# ===================================
# - VITE_ prefix is required for environment variables in Vite projects
# - Never commit this file to Git (it's in .gitignore)
# - Restart dev server after changing this file: npm run dev
# - See .env.example for template
```

---

## 🔄 How to Update Configuration

### 1. Edit the .env File

```bash
# Navigate to app directory
cd /home/user/marketing-dept/app

# Edit .env file with your favorite editor
nano .env
# or
vim .env
```

### 2. Add Your API Key

```bash
VITE_YOUR_PLATFORM_API_KEY=your_actual_key_here
```

### 3. Restart the Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

### 4. Verify Configuration

Visit the corresponding agent page (e.g., `/casey`) and check if the configuration warning disappears.

---

## 📂 Agent Worker Files Location

All individual agent configurations are stored in:

```
/home/user/marketing-dept/agents/workers/
```

**Available Workers**:
- `casey-the-copywriter.json` - Rytr.me (Configured ✅)
- `sonic-the-writer.json` - Writesonic
- `hunter-the-finder.json` - Hunter.io
- `analyzer-the-insight-finder.json` - Google Analytics
- `heatley-the-heatmapper.json` - Hotjar
- `sage-the-send-timer.json` - Mailchimp (Legacy)
- `smarta-the-ad-optimizer.json` - Smartly.io
- `dynamo-the-personalizer.json` - Dynamic Yield
- `surfy-the-seo-optimizer.json` - Surfer SEO
- `chatty-the-support-bot.json` - Support bot
- `zoey-the-prospector.json` - ZoomInfo

---

## 🔒 Security Best Practices

### DO:
✅ Store API keys in `.env` file
✅ Keep `.env` in `.gitignore`
✅ Use environment variables in code
✅ Rotate keys regularly
✅ Use different keys for dev/production

### DON'T:
❌ Commit `.env` to Git
❌ Share API keys in Slack/Email
❌ Hardcode keys in source code
❌ Use production keys in development
❌ Share your `.env` file

---

## 🆘 Troubleshooting

### Error: "API key not set"

**Solution**:
1. Check file exists: `/home/user/marketing-dept/app/.env`
2. Verify API key is set with correct variable name (with `VITE_` prefix)
3. Restart dev server: `npm run dev`

### Error: "VITE_RYTR_API_KEY is not defined"

**Solution**:
1. Ensure variable starts with `VITE_` prefix
2. Check for typos in variable name
3. Restart dev server after adding

### Configuration Not Loading

**Solution**:
1. Verify `.env` file is in `/app/` directory (not root)
2. Check file has no extra spaces or quotes
3. Restart dev server completely (stop and start)

---

## 📊 Configuration Status Dashboard

You can check which agents are configured by visiting:

```
http://localhost:5173/stats
```

The Stats page shows:
- ✅ Active workers (API keys configured)
- ⚪ Inactive workers (needs configuration)
- Real-time usage statistics
- Platform status

---

## 🎯 Quick Start

To get started with your first agent:

1. **Choose a platform** (Rytr.me is already configured!)
2. **Sign up** for free tier
3. **Get API key** from platform dashboard
4. **Add to .env**:
   ```bash
   cd /home/user/marketing-dept/app
   echo "VITE_PLATFORM_API_KEY=your_key" >> .env
   ```
5. **Restart server**:
   ```bash
   npm run dev
   ```
6. **Visit agent page** to start using!

---

## 📞 Support

If you need help configuring agents:
1. Check individual platform setup guides in `/docs/setup/`
2. See platform documentation links above
3. Review `.env.example` for template

**Example Guides Available**:
- `/docs/setup/RYTR_SETUP.md` - Rytr.me setup (complete)
- `/docs/QUICK_START_FREE_PLATFORMS.md` - Overview of all platforms
