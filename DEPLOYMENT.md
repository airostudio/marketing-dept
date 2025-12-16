# Deployment Guide - Marketing Department

Complete guide to deploying your AI Marketing Department to production.

## Quick Fix for Vercel

Your frontend is on Vercel but trying to connect to localhost. Here's how to fix it:

### Option A: Deploy Backend to Railway (Recommended)

1. **Deploy Backend:**
   ```bash
   # Push to GitHub if not already
   git add backend/
   git commit -m "Add backend"
   git push
   ```

2. **Railway Setup:**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository
   - Set root directory to `backend`

3. **Add Environment Variables in Railway:**
   ```
   OPENAI_API_KEY=sk-your-actual-key
   DEEPSEEK_API_KEY=your-actual-key
   PORT=3000
   ```

4. **Get Your Backend URL:**
   - Railway will give you: `https://your-app.railway.app`

5. **Update Frontend:**
   - Edit line 838 in `scotty/task-center.html`
   - Change: `return '/api';`
   - To: `return 'https://your-app.railway.app/api';`
   - Commit and push to redeploy on Vercel

### Option B: Run Locally

```bash
# Terminal
cd backend
npm install
node server.js

# Then open task-center.html locally (not on Vercel)
```

## Full Deployment Options

See the complete guide below for all deployment options including Vercel Serverless, Render, and more.

---

## Architecture Overview

```
FRONTEND (Static)          BACKEND (Node.js)
├─ Vercel                  ├─ Railway (Recommended)
├─ Netlify                 ├─ Render
└─ GitHub Pages            └─ Vercel Serverless
```

## Recommended: Vercel + Railway

**Why:** Different services for frontend/backend gives you flexibility and Railway's free tier is generous.

**Setup:**
1. Frontend on Vercel (already done)
2. Backend on Railway (follow Option A above)
3. Update API_BASE to Railway URL

**Cost:** ~$5-50/month (mostly AI API usage)

## See Full Documentation

For complete deployment guides including:
- Vercel Serverless Functions
- All-in-one Vercel deployment
- Render deployment
- Local testing setup
- Environment variables
- CORS configuration
- Security best practices

Visit the backend README.md for detailed instructions.

---

**Quick Answer:** Deploy backend to Railway, update line 838 in task-center.html with your Railway URL, push to Vercel!
