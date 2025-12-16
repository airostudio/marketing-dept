# 🚀 Deployment Guide - Scotty AI Marketing Department

**Live Dashboard**: Deploy and access your 15 AI agents through Scotty

---

## ✨ What Gets Deployed

Your comprehensive AI marketing department including:

- **Scotty AI Dashboard** - Modern 2025 HTML5 interface at `/scotty/index.html`
- **15 Professional AI Agents** - All with real names and autonomous capabilities
- **14 Department Guides** - Complete documentation
- **5 Enterprise Workflows** - Advanced orchestration playbooks
- **Legacy UI** - Original dashboard at `/ui/dashboard.html` (backward compatibility)
- **React App** - Full-featured app at `/app/` (optional)

---

## 🌐 Quick Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/airostudio/marketing-dept)

### Manual Deploy

```bash
# 1. Install Vercel CLI (if not already)
npm install -g vercel

# 2. Deploy
vercel

# 3. Follow prompts, deploy!
```

---

## 📁 Deployment Structure

```
Deployed URLs:
├── / (root)                    → Redirects to Scotty dashboard
├── /dashboard                  → Alias to Scotty dashboard
├── /scotty/                    → ⭐ Scotty AI Dashboard (MAIN)
│   ├── index.html              → Dashboard UI
│   └── scotty.js               → Agent orchestration logic
├── /ui/                        → Legacy dashboard (v1.0)
│   ├── dashboard.html          → Old dashboard (redirects to Scotty)
│   └── worker.html             → Individual worker pages
├── /app/                       → React application (optional)
├── /agents/                    → Agent configurations
│   └── workers/*.json          → 15 AI agent profiles
├── /departments/               → 14 department guides
└── /workflows/                 → 5 enterprise workflows
```

---

## ⚙️ Configuration Files

### vercel.json
```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/dashboard",
      "destination": "/scotty/index.html"
    },
    {
      "source": "/",
      "destination": "/scotty/index.html"
    }
  ]
}
```

**What this does:**
- Makes `/` and `/dashboard` both point to Scotty
- Enables clean URLs (no `.html` extensions)
- Redirects old UI to new Scotty dashboard

---

## 🎯 Access Points After Deployment

Once deployed to Vercel, access via:

1. **Main Dashboard** (Scotty):
   - `https://your-app.vercel.app/`
   - `https://your-app.vercel.app/dashboard`
   - `https://your-app.vercel.app/scotty/`

2. **Legacy Dashboard** (v1.0):
   - `https://your-app.vercel.app/ui/dashboard`

3. **React App** (if needed):
   - Deploy separately or use `/app` subdirectory

4. **Documentation**:
   - `https://your-app.vercel.app/README.md`
   - View raw on GitHub for formatting

---

## 🔧 Local Testing

Before deploying, test locally:

### Option 1: Python HTTP Server
```bash
python -m http.server 8000
# Visit: http://localhost:8000
```

### Option 2: Node.js HTTP Server
```bash
npx http-server -p 8000
# Visit: http://localhost:8000
```

### Option 3: Vercel Dev
```bash
vercel dev
# Visit: http://localhost:3000
```

**Expected behavior:**
- Root (`/`) should redirect to Scotty dashboard
- Scotty dashboard should show 15 colorful agent cards
- Clicking agents should show splash screens
- Command center should accept natural language input

---

## 🚨 Troubleshooting

### Issue: 404 on deployment
**Solution**: Check `vercel.json` is in root directory

### Issue: Blank page
**Solution**: Check browser console for JS errors. Ensure `scotty.js` loaded correctly.

### Issue: Agents not showing
**Solution**: Verify `/agents/workers/*.json` files are deployed

### Issue: Splash screens don't work
**Solution**: Check that `scotty.js` has proper event listeners

### Issue: Old dashboard showing instead of Scotty
**Solution**: Clear browser cache or use incognito mode

---

## 📊 Deployment Checklist

Before going live, verify:

- ✅ **Scotty dashboard loads** at root URL
- ✅ **All 15 agents appear** in the grid
- ✅ **Colorful splash screens work** when clicking agents
- ✅ **Command center accepts input** and routes to agents
- ✅ **Activity feed shows** recent activities
- ✅ **Metrics display correctly** (247 tasks, $47K revenue, etc.)
- ✅ **Mobile responsive** (test on phone)
- ✅ **All department links work** from README
- ✅ **Workflow documents accessible**

---

## 🎨 Customization After Deploy

### Update Agent Data
Edit `/agents/workers/*.json` files and redeploy:
```bash
# After editing JSON files
git add agents/workers/
git commit -m "Update agent metrics"
git push
# Vercel auto-deploys
```

### Customize Colors
Edit inline styles in `/scotty/index.html`:
```css
:root {
    --primary: #6366f1;        /* Your brand color */
    --dark: #0f172a;           /* Background */
    /* ... more variables ... */
}
```

### Add New Agents
1. Create `/agents/workers/new-agent.json`
2. Add agent to `scotty.js` agents array
3. Deploy

---

## 🔐 Environment Variables

If using API integrations, set in Vercel dashboard:

```bash
# Vercel Dashboard → Settings → Environment Variables
JASPER_API_KEY=your_key_here
ZOOMINFO_API_KEY=your_key_here
HUNTER_API_KEY=your_key_here
# ... etc for all 50+ tools
```

Access in JavaScript:
```javascript
const apiKey = process.env.JASPER_API_KEY;
```

---

## 🌍 Custom Domain

### Add Custom Domain to Vercel

1. Go to Vercel dashboard → Your project
2. Settings → Domains
3. Add domain: `marketing.yourcompany.com`
4. Follow DNS configuration steps
5. Wait for DNS propagation (5-60 minutes)

Example setup:
```
marketing.yourcompany.com → Scotty Dashboard
app.marketing.yourcompany.com → React App
docs.marketing.yourcompany.com → Documentation
```

---

## 📈 Performance Optimization

Your deployment includes:

✅ **Static files** - No server needed, instant loading
✅ **CDN distribution** - Global edge network
✅ **Compression** - Gzip/Brotli automatic
✅ **Caching** - Smart cache headers
✅ **Image optimization** - WebP where supported

**Expected Performance:**
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Lighthouse Score: 95+

---

## 🔄 Continuous Deployment

Every push to your branch auto-deploys:

```bash
# Make changes
git add .
git commit -m "Updated agent metrics"
git push origin main

# Vercel automatically:
# 1. Detects push
# 2. Builds (if needed)
# 3. Deploys to production
# 4. Invalidates cache
# 5. Live in ~30 seconds
```

---

## 📱 Progressive Web App (PWA)

Want to make Scotty installable? Add `/manifest.json`:

```json
{
  "name": "Scotty AI Marketing Manager",
  "short_name": "Scotty AI",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#6366f1",
  "icons": [
    {
      "src": "/ui/assets/icon.svg",
      "sizes": "512x512",
      "type": "image/svg+xml"
    }
  ]
}
```

---

## 🎯 Production Checklist

Before announcing to team:

- ✅ All agents showing correct metrics
- ✅ Links to departments working
- ✅ Workflows accessible and readable
- ✅ Custom domain configured (optional)
- ✅ Analytics tracking added (Google Analytics)
- ✅ Team trained on using Scotty
- ✅ API keys configured for live tools
- ✅ Slack notifications set up (optional)

---

## 💡 Pro Tips

1. **Bookmark the dashboard** - Add `/dashboard` to team favorites
2. **Mobile shortcut** - Add to home screen for quick access
3. **Browser extension** - Consider building Chrome extension
4. **Slack integration** - Get Scotty updates in Slack
5. **Weekly reports** - Auto-generate and email team

---

## 🆘 Support

**Deployment Issues:**
- Check [Vercel Status](https://vercel-status.com/)
- Review build logs in Vercel dashboard
- Test locally first with `vercel dev`

**Dashboard Issues:**
- Check browser console for errors
- Verify all JSON files are valid
- Clear cache and hard reload (Cmd+Shift+R)

**Performance Issues:**
- Use Lighthouse audit
- Check Network tab for slow requests
- Optimize images if needed

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [HTML5 Best Practices](https://www.w3.org/TR/html/)
- [Web Performance](https://web.dev/performance/)

---

**Deployed Version**: 2.0.0
**Last Updated**: 2025-11-24
**Agents**: 15 Professional AI Workers
**Departments**: 14 Specialized Teams

---

🚀 **Ready to deploy?** Run `vercel` in your terminal!
