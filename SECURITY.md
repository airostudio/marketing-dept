# Security Guide - API Key Management

## 🔐 Critical Security Rules

### NEVER commit API keys to git!

All API keys and secrets must be kept secure and never committed to version control.

## Local Development Setup

### 1. Create Your .env File

Copy the example file and add your real API keys:

```bash
cp .env.example .env
```

Then edit `.env` and replace the placeholder values with your actual API keys.

### 2. Verify .gitignore

The `.env` file is listed in `.gitignore` to prevent accidental commits:

```
.env
.env.local
app/.env
app/.env.local
```

### 3. Check Before Committing

Always verify that `.env` files are not staged:

```bash
git status
```

If you see `.env` in the output, **DO NOT COMMIT**. Run:

```bash
git reset .env
```

## Vercel Deployment

For production deployment on Vercel, **never** commit API keys. Instead:

### 1. Add Environment Variables in Vercel Dashboard

1. Go to your project on https://vercel.com
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable individually:
   - **Name**: `VITE_GOOGLE_GEMINI_API_KEY`
   - **Value**: Your actual API key
   - **Environment**: Production (and Preview if needed)
4. Click **Save**

### 2. Required Environment Variables

Add all these in Vercel dashboard:

```
VITE_GOOGLE_GEMINI_API_KEY
VITE_RYTR_API_KEY
VITE_HUNTERIO_API_KEY
VITE_MAILCHIMP_API_KEY
VITE_GA_MEASUREMENT_ID
VITE_HOTJAR_SITE_ID
```

### 3. Redeploy

After adding environment variables, trigger a new deployment:

```bash
git push origin main
```

Vercel will automatically use the environment variables from the dashboard.

## Other Deployment Platforms

### Netlify

1. Go to **Site settings** → **Environment variables**
2. Add each variable as Key/Value pairs
3. Redeploy

### Railway

1. Go to your project → **Variables**
2. Add environment variables
3. Redeploy automatically triggers

### Docker/Self-Hosted

Use a `.env` file on the server that is **not** in version control:

```bash
# On your server
vim .env  # Add your keys
docker-compose up -d
```

## Best Practices

### ✅ DO:
- Use `.env.example` as a template (no real keys)
- Store real keys in `.env` (gitignored)
- Use environment variables in Vercel/Netlify dashboard for production
- Rotate API keys regularly
- Use different keys for development and production
- Limit API key permissions to minimum required

### ❌ DON'T:
- Commit `.env` files to git
- Share API keys in Slack, email, or documentation
- Use production keys in development
- Hardcode API keys in source code
- Upload `.env` files to cloud storage
- Include API keys in screenshots or videos

## Key Rotation

If an API key is accidentally exposed:

1. **Immediately revoke** the compromised key in the platform dashboard
2. **Generate a new key**
3. **Update** the key in:
   - Local `.env` file
   - Vercel/Netlify environment variables
   - Team password manager
4. **Monitor** for unusual API usage
5. **Redeploy** the application

## Team Collaboration

### Sharing Keys Securely

Use a password manager for team collaboration:
- **1Password** - Teams plan
- **LastPass** - Business plan
- **Bitwarden** - Organizations plan

**Never** share keys via:
- Email
- Slack/Teams
- GitHub issues
- Text messages

## Checking for Exposed Keys

Run this command to check if any sensitive files are tracked:

```bash
git ls-files | grep -E "\.env$|\.env\.local$|secret|key"
```

If you see any `.env` files, remove them immediately:

```bash
git rm --cached .env
git commit -m "Remove accidentally committed .env file"
git push
```

Then rotate all exposed API keys!

## Additional Resources

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)

## Emergency Contact

If you accidentally commit API keys:

1. **Remove from git history** (see above)
2. **Rotate all exposed keys immediately**
3. **Review git history** to ensure complete removal
4. **Enable secret scanning** on GitHub

---

**Remember**: Security is everyone's responsibility. When in doubt, ask before committing!
