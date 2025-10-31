# Copy.ai Setup Guide for Casey (AI Copywriter)

## What You Need

To integrate Casey (your AI copywriter) with Copy.ai, you'll need:

### 1. Copy.ai Account
- **Free Tier Available**: Yes! Copy.ai offers a free plan
- **Sign up**: https://www.copy.ai
- **What's included in free tier**:
  - 2,000 words per month
  - 90+ copywriting tools
  - Blog wizard tool
  - Email templates
  - Social media posts

### 2. Copy.ai API Key

**How to Get Your API Key:**

1. **Log into Copy.ai**
   - Go to https://app.copy.ai
   - Sign in to your account

2. **Navigate to API Keys**
   - Click on **Configuration** in the left sidebar
   - Click on the **API Keys** card

3. **Create New API Key**
   - Click the **Create** button (top right)
   - Provide a **Key Name** (e.g., "Marketing Department")
   - Select **User**
   - (Optional) Set **Expiry Date**
   - Click **Create**

4. **Copy Your Key**
   - ⚠️ **IMPORTANT**: Copy the API key immediately
   - You won't be able to view it again!
   - Store it securely (password manager, .env file)

## API Authentication

Copy.ai uses HTTP header-based authentication:

```javascript
// Example API call structure
fetch('https://api.copy.ai/api/workflow/{workflow_id}', {
  method: 'POST',
  headers: {
    'x-copy-ai-api-key': 'YOUR_API_KEY_HERE',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    // Your workflow parameters
  })
})
```

## What Casey Can Do with Copy.ai

With the Copy.ai API integrated, Casey can:

✅ **Marketing Copy**
- Product descriptions
- Ad headlines
- Email subject lines
- Landing page copy

✅ **Social Media**
- Instagram captions
- Twitter/X posts
- LinkedIn content
- Facebook ads

✅ **Long-Form Content**
- Blog post outlines
- Article introductions
- Content briefs
- SEO meta descriptions

✅ **E-commerce**
- Product descriptions
- Category descriptions
- Marketing emails
- Promotional copy

## Free Tier Limitations

**Monthly Limits:**
- 2,000 words per month on free plan
- Upgrade to Pro for unlimited words

**Best Practices for Free Tier:**
- Use for high-value copy (ads, headlines)
- Reserve for final drafts vs iterations
- Monitor word count usage

## Upgrade Options

If you need more than the free tier:

**Pro Plan** (~$49/month):
- Unlimited words
- Priority support
- Advanced features
- Team collaboration

**Enterprise Plan**:
- Custom pricing
- API access guaranteed
- Dedicated support
- Custom integrations

## Setup Checklist

- [ ] Create Copy.ai account
- [ ] Generate API key from Configuration > API Keys
- [ ] Save API key securely
- [ ] Test API connection
- [ ] Set monthly word count alerts
- [ ] Configure Casey worker in your marketing platform

## Integration Example

Once you have your API key, add it to your marketing department:

```javascript
// In your .env file (NEVER commit this!)
COPYAI_API_KEY=your_api_key_here

// Casey can then use it for tasks
const generateCopy = async (prompt) => {
  const response = await fetch('https://api.copy.ai/api/workflow/{workflow_id}', {
    method: 'POST',
    headers: {
      'x-copy-ai-api-key': process.env.COPYAI_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: {
        prompt: prompt
      }
    })
  });

  return await response.json();
};
```

## Documentation Links

- **Official Docs**: https://docs.copy.ai
- **API Reference**: https://docs.copy.ai/reference
- **Getting Started**: https://docs.copy.ai/docs/getting-started
- **Workflows API**: https://docs.copy.ai/docs/getting-started

## Support

If you run into issues:
- **Help Center**: https://support.copy.ai
- **Community**: https://community.copy.ai
- **Email**: support@copy.ai

## Security Best Practices

⚠️ **NEVER share your API key publicly!**

✅ **DO:**
- Store API keys in environment variables
- Use .env files (add to .gitignore)
- Rotate keys regularly
- Set expiry dates on keys

❌ **DON'T:**
- Commit API keys to Git
- Share keys in Slack/Email
- Use the same key across projects
- Leave keys without expiry

---

**Ready to get started?**
1. Sign up at https://www.copy.ai
2. Get your API key
3. Let Casey start creating amazing copy!
