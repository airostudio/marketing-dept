# Vercel Deployment & Environment Variables Setup

## 🚀 Quick Start

This guide shows you how to properly configure API keys in Vercel to ensure they remain **secure and server-side only**.

## ⚠️ CRITICAL SECURITY REQUIREMENTS

### 1. API Keys Source in Production

**In Vercel production, API keys come from Vercel Dashboard Environment Variables ONLY.**

- ✅ **Production Source**: Vercel Dashboard → Settings → Environment Variables
- ❌ **.env files are NOT deployed**: They are in `.gitignore` and completely ignored by Vercel
- ⚠️ **Local development only**: .env files are ONLY used for local development with Vercel CLI

### 2. Never Use VITE_ Prefix

**ALL API keys MUST be set WITHOUT the `VITE_` prefix.**

- ✅ **Correct**: `GOOGLE_GEMINI_API_KEY`
- ❌ **Wrong**: `VITE_GOOGLE_GEMINI_API_KEY`

The `VITE_` prefix exposes variables to the browser bundle, making your API keys publicly accessible. **Never use it for sensitive data.**

### 3. How It Works

```
┌─────────────────────────────────────────────────────────────┐
│ VERCEL PRODUCTION                                           │
│                                                             │
│  Vercel Dashboard Environment Variables                    │
│         ↓                                                   │
│  process.env.GOOGLE_GEMINI_API_KEY                         │
│         ↓                                                   │
│  /api/proxy.ts serverless function                         │
│         ↓                                                   │
│  External API (Google Gemini, Rytr, ZoomInfo, etc.)       │
│                                                             │
│  .env file = NOT USED (gitignored, not deployed)           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ LOCAL DEVELOPMENT                                           │
│                                                             │
│  .env file (gitignored)                                     │
│         ↓                                                   │
│  Vercel CLI loads into process.env                         │
│         ↓                                                   │
│  /api/proxy.ts serverless function                         │
│         ↓                                                   │
│  External API (Google Gemini, Rytr, ZoomInfo, etc.)       │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Step-by-Step Setup

### Step 1: Access Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Log in to your account
3. Select your project: **AI Marketing Department**

### Step 2: Navigate to Environment Variables

1. Click on **Settings** tab
2. Click on **Environment Variables** in the left sidebar

### Step 3: Add Environment Variables

For **each** agent that you want to enable, add its corresponding API key:

#### Required Format:
- **Key**: Environment variable name (without VITE_ prefix)
- **Value**: Your actual API key
- **Environment**: Select which environments need this key:
  - ✅ **Production** - For live site
  - ✅ **Preview** - For pull request previews
  - ⬜ **Development** - For local development (use local `.env` file instead)

### Step 4: Add All Required Variables

Copy and paste these variable names into Vercel (replace values with your actual keys):

```bash
# Jasper - Content Creation (Google Gemini)
GOOGLE_GEMINI_API_KEY=your_actual_gemini_key_here

# Casey - AI Copywriter (Rytr AI)
RYTR_API_KEY=your_actual_rytr_key_here

# Zoey - Lead Prospecting (ZoomInfo)
ZOOMINFO_API_KEY=your_actual_zoominfo_key_here

# Hunter - Email Finder (Hunter.io)
HUNTER_IO_API_KEY=your_actual_hunter_key_here

# Morgan - Email Marketing (Mailchimp)
MAILCHIMP_API_KEY=your_actual_mailchimp_key_here

# Smarta - Ad Campaign Manager (Smartly.io)
SMARTLY_IO_API_KEY=your_actual_smartly_key_here

# Dylan - Personalization (Dynamic Yield)
DYNAMIC_YIELD_API_KEY=your_actual_dynamicyield_key_here

# Gabby - Analytics (Google Analytics)
GOOGLE_ANALYTICS_API_KEY=your_actual_ga_key_here

# Harper - User Insights (Hotjar)
HOTJAR_API_KEY=your_actual_hotjar_key_here

# Sage - SEO Specialist (Surfer SEO)
SURFER_SEO_API_KEY=your_actual_surfer_key_here

# Iris - Customer Support (Intercom)
INTERCOM_API_KEY=your_actual_intercom_key_here
```

### Step 5: Save and Redeploy

1. Click **Save** after adding each variable
2. After all variables are added, go to the **Deployments** tab
3. Click the **⋮** menu on the latest deployment
4. Click **Redeploy**
5. Wait for deployment to complete

## 🔍 How to Verify Setup

After deployment, check which services are configured:

1. Visit your deployed app
2. Go to **Settings** page
3. Scroll to **API Configuration Status**
4. You should see green checkmarks for all configured services

Alternatively, you can check the health endpoint directly:
```
https://your-app.vercel.app/api/health
```

This returns a JSON response with all configured services:
```json
{
  "configured": ["googleGemini", "rytrAi", "zoomInfo"],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔐 Security Best Practices

### DO:
- ✅ Use environment variables WITHOUT `VITE_` prefix
- ✅ Set variables in Vercel Dashboard for production
- ✅ Use different API keys for development vs production
- ✅ Rotate API keys regularly (every 90 days)
- ✅ Use read-only or limited-scope API keys when possible
- ✅ Monitor API usage in each platform's dashboard

### DON'T:
- ❌ Never use `VITE_` prefix for API keys
- ❌ Never commit `.env` files to git
- ❌ Never share API keys in Slack, email, or documentation
- ❌ Never use production keys in development
- ❌ Never expose API keys in client-side code

## 🛠️ Local Development

For **local development only**:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your development API keys:
   ```bash
   GOOGLE_GEMINI_API_KEY=your_dev_key_here
   RYTR_API_KEY=your_dev_key_here
   # ... etc
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The Vercel CLI will automatically load variables from `.env` for local development

**CRITICAL: .env files are ONLY for local development**
- .env files are in `.gitignore` and are **NEVER** committed to git
- .env files are **NEVER** deployed to Vercel
- Vercel production **IGNORES** .env files completely
- Vercel production uses **ONLY** Vercel Dashboard Environment Variables

### How Environment Variables Work

| Environment | Source | Location |
|-------------|--------|----------|
| **Vercel Production** | Vercel Dashboard ONLY | Settings → Environment Variables |
| **Vercel Preview** | Vercel Dashboard ONLY | Settings → Environment Variables |
| **Local Development** | .env file | `/home/user/marketing-dept/.env` |

In **all cases**, the backend code reads from `process.env.VARIABLE_NAME`, but the source differs:
- Production/Preview: `process.env` is populated by Vercel from Dashboard settings
- Local: `process.env` is populated by Vercel CLI from `.env` file

## 🔄 Updating Environment Variables

When you need to update an API key:

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Find the variable you want to update
3. Click **Edit**
4. Update the value
5. Click **Save**
6. Redeploy the application

## 🐛 Troubleshooting

### Agent shows "Not Connected"

**Possible causes:**
1. Environment variable not set in Vercel
2. Environment variable has wrong name (check for VITE_ prefix)
3. API key is invalid or expired
4. Need to redeploy after adding variables

**Solution:**
1. Check Vercel Dashboard → Environment Variables
2. Verify variable name matches exactly (no VITE_ prefix)
3. Test API key in the platform's API documentation
4. Redeploy the application

### API calls fail with 503 error

**Error message**: `"SERVICE_NAME is not configured"`

**Solution:**
1. Add the missing environment variable in Vercel
2. Redeploy the application
3. Clear browser cache and reload

### Changes not taking effect

**Solution:**
1. Ensure you clicked **Save** after adding variables
2. Go to Deployments tab and **Redeploy**
3. Wait for deployment to complete (usually 1-2 minutes)
4. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)

## 📚 Additional Resources

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Security Best Practices](./SECURITY.md)
- [API Integration Guide](./API_INTEGRATION.md)

## 🆘 Need Help?

If you encounter issues:

1. Check the [SECURITY.md](./SECURITY.md) file
2. Verify all environment variables are set correctly
3. Check the browser console for error messages
4. Review the `/api/health` endpoint response
