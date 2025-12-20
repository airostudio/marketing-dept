# API Setup Guide

## Quick Start - Get Your Free API Keys

The marketing department uses **two AI platforms** to power your agents:

### 1. Google Gemini (PRIMARY - REQUIRED)
**Cost:** 100% FREE - No credit card required
**Used by:** Scotty, Content Creation, Email Marketing, SEO, Support
**Sign up:** https://aistudio.google.com/app/apikey

**Steps:**
1. Visit https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key
5. Paste into `.env` file: `VITE_GEMINI_API_KEY=your_key_here`

### 2. DeepSeek (SECONDARY - OPTIONAL)
**Cost:** $0.14 per million tokens (incredibly cheap)
**Used by:** Data Analytics, Lead Generation, Social Ads
**Sign up:** https://platform.deepseek.com/api_keys

**Steps:**
1. Visit https://platform.deepseek.com/signup
2. Create account
3. Go to API Keys section
4. Generate new API key
5. Paste into `.env` file: `VITE_DEEPSEEK_API_KEY=your_key_here`

## Environment Variables Setup

### Method 1: Using .env File (Recommended)

Edit `/app/.env` and add your API keys:

```env
# Google Gemini API Key (FREE)
VITE_GEMINI_API_KEY=AIzaSyD...your_key_here...

# DeepSeek API Key (Optional)
VITE_DEEPSEEK_API_KEY=sk-...your_key_here...
```

### Method 2: System Environment Variables

Alternatively, set system environment variables:

```bash
export VITE_GEMINI_API_KEY="your_gemini_key_here"
export VITE_DEEPSEEK_API_KEY="your_deepseek_key_here"
```

## Verifying Setup

After adding your API keys:

1. **Restart** the dev server (Ctrl+C, then `npm run dev`)
2. **Open browser** console (F12)
3. Look for: `✅ Gemini API initialized from environment`
4. **Assign a test task** to any agent
5. **Watch the Activity Feed** for real-time updates

## What Each Agent Uses

### Google Gemini Agents:
- 🎯 **Scotty** - Task Orchestrator
- ✍️ **Jasper** - Content Creator
- 📝 **Casey** - Copywriter
- ⏰ **Sage** - Email Campaign Manager
- 🏄 **Surfy** - SEO Specialist
- 💬 **Chatty** - Customer Support
- 🎨 **Dynamo** - Experience Optimizer

### DeepSeek Agents:
- 🔍 **Zoey** - Lead Prospecting
- 🎯 **Hunter** - Email Finder
- 🎯 **Smarta** - Social Ads Manager
- 📊 **Analyzer** - Data Analytics
- 🔥 **Heatley** - UX Analyst

## Troubleshooting

### "API key not configured" Error
- Check that you added the key to `.env` file
- Make sure there are no spaces around the `=` sign
- Restart the dev server after adding keys

### "404 Error" When Assigning Tasks
- This means no API keys are configured
- Follow the Gemini setup instructions above
- At minimum, you NEED the Gemini API key

### Keys Not Loading
- Check file is named exactly `.env` (not `.env.txt`)
- File must be in `/app/` directory
- Restart dev server: `Ctrl+C` then `npm run dev`
- Clear browser cache and reload

## Cost Information

### Gemini Pricing
- **Free tier:** 60 requests per minute
- **Free quota:** Generous - perfect for this use case
- **No credit card required**

### DeepSeek Pricing (Optional)
- **Input:** $0.14 per million tokens
- **Output:** $0.28 per million tokens
- **Example:** 1,000 tasks ≈ $0.50
- **Pay-as-you-go** - no monthly fees

## Security Notes

✅ API keys are stored in browser localStorage
✅ Keys are auto-loaded from `.env` on startup
✅ Never committed to git (in `.gitignore`)
✅ Direct API calls (no third-party servers)

⚠️ **Production:** Use backend proxy for API calls
⚠️ **Team use:** Each user needs their own keys

## Need Help?

1. Check browser console (F12) for error messages
2. Verify API keys are valid at their respective platforms
3. Test with a simple task to one agent
4. Watch Activity Feed for real-time agent updates

---

**Ready to start?** Get your FREE Gemini key: https://aistudio.google.com/app/apikey
