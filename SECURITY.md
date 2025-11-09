# Security Guide - Secure Backend Proxy Architecture

## 🔐 Architecture Overview

This application uses a **secure backend proxy** to protect API keys. All API keys are stored server-side only and are **NEVER** exposed to the client browser.

### How It Works

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Browser   │─────▶│  Backend    │─────▶│  External    │
│  (Client)   │      │  Proxy API  │      │  API Services│
└─────────────┘      └─────────────┘      └──────────────┘
   No API keys        Has API keys        (Gemini, Rytr, etc)
```

- **Client (Browser)**: Makes requests to `/api/proxy?service=serviceName`
- **Backend Proxy**: Vercel serverless function that securely stores and uses API keys
- **External APIs**: Google Gemini, Rytr AI, ZoomInfo, etc.

## 🔐 Critical Security Rules

### NEVER use VITE_ prefix for API keys!

❌ **OLD (INSECURE)**:
```bash
VITE_GOOGLE_GEMINI_API_KEY=abc123  # Exposed to client!
```

✅ **NEW (SECURE)**:
```bash
GOOGLE_GEMINI_API_KEY=abc123  # Server-side only!
```

Variables without the `VITE_` prefix are **server-side only** and cannot be accessed from the browser.

## Local Development Setup

### 1. Create Your .env File

Copy the example file and add your real API keys:

```bash
cp .env.example .env
```

Then edit `.env` and replace the placeholder values with your actual API keys.

**Important**: Use the variable names **without VITE_ prefix**:
- ✅ `GOOGLE_GEMINI_API_KEY=...`
- ❌ `VITE_GOOGLE_GEMINI_API_KEY=...`

### 2. Verify .gitignore

The `.env` file is listed in `.gitignore` to prevent accidental commits:

```
.env
.env.local
app/.env
app/.env.local
```

### 3. Start Development Server

```bash
# Terminal 1: Start the app
cd app && npm run dev

# The app will use the backend proxy automatically
```

### 4. Testing API Connections

The app automatically checks which APIs are configured by calling `/api/health`. You can test this endpoint directly:

```bash
curl http://localhost:5173/api/health
```

Response:
```json
{
  "configured": ["googleGemini", "rytrAi"],
  "timestamp": "2024-11-09T00:00:00.000Z"
}
```

## Vercel Deployment

For production deployment on Vercel, **never** commit API keys. Instead:

### 1. Add Environment Variables in Vercel Dashboard

1. Go to your project on https://vercel.com
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable individually **WITHOUT VITE_ PREFIX**:
   - **Name**: `GOOGLE_GEMINI_API_KEY` (not VITE_GOOGLE_GEMINI_API_KEY)
   - **Value**: Your actual API key
   - **Environment**: Production (and Preview if needed)
4. Click **Save**

### 2. Required Environment Variables

Add all these in Vercel dashboard (without VITE_ prefix):

```
GOOGLE_GEMINI_API_KEY
RYTR_API_KEY
ZOOMINFO_API_KEY
HUNTER_IO_API_KEY
MAILCHIMP_API_KEY
SMARTLY_IO_API_KEY
DYNAMIC_YIELD_API_KEY
GOOGLE_ANALYTICS_API_KEY
HOTJAR_API_KEY
SURFER_SEO_API_KEY
INTERCOM_API_KEY
```

### 3. Redeploy

After adding environment variables, trigger a new deployment:

```bash
git push origin main
```

Vercel will automatically use the environment variables from the dashboard.

## Backend API Endpoints

### Health Check
```
GET /api/health
```
Returns list of configured services (safe to call from client).

### Proxy Request
```
POST /api/proxy?service=<serviceName>
Content-Type: application/json

{
  "prompt": "Generate content...",
  "model": "gemini-pro"
}
```

Supported services:
- `googleGemini`
- `rytrAi`
- `zoomInfo`
- `hunterIo`
- `mailchimp`
- `smartlyIo`
- `dynamicYield`
- `googleAnalytics`
- `hotjar`
- `surferSeo`
- `intercom`

## Using the API Client

In your frontend code, use the provided API client instead of direct fetch:

```typescript
import { gemini } from '@/utils/apiClient'

// Generate content with Gemini
const result = await gemini.generate('Write a blog post about AI')

if (result.error) {
  console.error('API error:', result.error)
} else {
  console.log('Generated content:', result.data)
}
```

Available clients:
- `gemini.generate(prompt, model)`
- `rytr.generate(options)`
- `zoomInfo.searchContact(query)`
- `hunter.findEmails(domain)`
- `mailchimp.request(endpoint, method, data)`
- And more... (see `/app/src/utils/apiClient.ts`)

## Best Practices

### ✅ DO:
- Use `.env.example` as a template (no real keys)
- Store real keys in `.env` (gitignored)
- Use environment variables in Vercel dashboard for production
- **Remove VITE_ prefix** from all API key variables
- Use the `/api/proxy` endpoint for all API calls
- Rotate API keys regularly
- Use different keys for development and production
- Limit API key permissions to minimum required

### ❌ DON'T:
- Use `VITE_` prefix for sensitive API keys
- Commit `.env` files to git
- Share API keys in Slack, email, or documentation
- Use production keys in development
- Hardcode API keys in source code
- Upload `.env` files to cloud storage
- Include API keys in screenshots or videos
- Call external APIs directly from the browser

## Security Features

### Server-Side Only Keys
- All API keys use non-VITE_ prefix
- Vercel serverless functions handle all API requests
- Keys are never bundled into client JavaScript

### Proxy Protection
- Rate limiting (Vercel automatically applies)
- Request validation
- Error handling without exposing internal details

### No Client Exposure
- Browser never receives API keys
- Dev tools cannot inspect keys
- Network requests only show proxy endpoint

## Key Rotation

If an API key is accidentally exposed:

1. **Immediately revoke** the compromised key in the platform dashboard
2. **Generate a new key**
3. **Update** the key in:
   - Local `.env` file (without VITE_ prefix)
   - Vercel environment variables
   - Team password manager
4. **Monitor** for unusual API usage
5. **Redeploy** the application

## Migration from Client-Side Keys

If you previously used `VITE_` prefixed variables:

1. Update Vercel environment variables:
   - Remove `VITE_GOOGLE_GEMINI_API_KEY`
   - Add `GOOGLE_GEMINI_API_KEY` (no prefix)
2. Update local `.env` file (remove VITE_ prefix)
3. Redeploy application
4. Old client-side code will no longer work
5. Use API client utilities instead

## Additional Resources

- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Backend Proxy Pattern](https://docs.anthropic.com/en/api/security-best-practices)

## Emergency Contact

If you accidentally commit API keys:

1. **Remove from git history**
2. **Rotate all exposed keys immediately**
3. **Verify** new keys are server-side only (no VITE_ prefix)
4. **Redeploy** with secure configuration

---

**Remember**: With the backend proxy, your API keys are truly secure. The browser **never** has access to them!
