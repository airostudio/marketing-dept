# Rytr.me Setup Guide for Casey (AI Copywriter)

## What You Need

To integrate Casey (your AI copywriter) with Rytr.me, you'll need:

### 1. Rytr.me Account
- **Free Tier Available**: Yes! Rytr.me offers a generous free plan
- **Sign up**: https://rytr.me
- **What's included in free tier**:
  - 10,000 characters per month
  - 40+ use cases & templates
  - 30+ languages
  - 20+ tones of voice
  - Plagiarism checker
  - Multiple content formats

### 2. Rytr.me API Key

**How to Get Your API Key:**

1. **Log into Rytr.me**
   - Go to https://rytr.me
   - Sign in to your account

2. **Navigate to Account Settings**
   - Click on your profile icon (top right)
   - Select **Account Settings** from dropdown

3. **Access API Keys Section**
   - Look for **API Access** or **Integrations** tab
   - Click on **API Keys**

4. **Create New API Key**
   - Click the **Generate API Key** button
   - Give it a descriptive name (e.g., "Marketing Department")
   - Copy the key immediately

5. **Copy Your Key**
   - ⚠️ **IMPORTANT**: Copy the API key immediately
   - Store it securely (password manager, .env file)
   - You may not be able to view it again!

## API Authentication

Rytr.me uses API key authentication in headers:

```javascript
// Example API call structure
fetch('https://api.rytr.me/v1/ryte', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${YOUR_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    languageId: 'en',
    toneId: 'casual',
    useCaseId: 'marketing_copy',
    inputContexts: {
      PRODUCT_NAME: 'Your Product',
      PRODUCT_DESCRIPTION: 'Brief description'
    },
    variations: 3
  })
})
```

## Available Use Cases

Rytr.me provides 40+ use cases you can access via API:

### Marketing & Ads
- `marketing_copy` - General marketing copy
- `product_description` - E-commerce product descriptions
- `google_ad` - Google Ads copy
- `facebook_ad` - Facebook/Instagram ads
- `linkedin_ad` - LinkedIn ads

### Social Media
- `social_media_post` - General social posts
- `instagram_caption` - Instagram captions
- `twitter_post` - Twitter/X posts
- `linkedin_post` - LinkedIn posts

### Email
- `email_subject` - Email subject lines
- `email_body` - Email body content
- `cold_email` - Cold outreach emails

### Blog & SEO
- `blog_outline` - Blog post outlines
- `blog_intro` - Blog introductions
- `blog_conclusion` - Blog conclusions
- `meta_description` - SEO meta descriptions

### Other
- `headline` - Catchy headlines
- `call_to_action` - Call-to-action text
- `creative_story` - Creative storytelling

## What Casey Can Do with Rytr.me

With the Rytr.me API integrated, Casey can:

✅ **Marketing Copy**
- Product descriptions
- Ad headlines & copy
- Landing page copy
- Call-to-action text

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

✅ **Multiple Tones**
- Casual
- Professional
- Funny
- Inspirational
- Urgent
- Friendly
- And 15+ more!

## Free Tier Limitations

**Monthly Limits:**
- 10,000 characters per month on free plan
- Upgrade to Unlimited plan for no limits

**Best Practices for Free Tier:**
- Use for high-value copy (ads, headlines, product descriptions)
- Choose concise copy formats
- Monitor character count usage in dashboard
- Reserve for final drafts vs iterations

**Character Count Tips:**
- Headlines: ~100 characters
- Product description: ~500 characters
- Social post: ~200 characters
- Email subject: ~50 characters

## Upgrade Options

If you need more than the free tier:

**Saver Plan** (~$9/month):
- 100,000 characters/month
- All use cases & tones
- Plagiarism checker
- Premium support

**Unlimited Plan** (~$29/month):
- Unlimited characters
- Generate unlimited content
- Priority support
- Advanced features
- Custom tones

**Note**: Prices may vary - check https://rytr.me/pricing for current rates

## Setup Checklist

- [ ] Create Rytr.me account at https://rytr.me
- [ ] Verify email address
- [ ] Generate API key from Account Settings
- [ ] Save API key securely in password manager
- [ ] Add API key to `.env` file
- [ ] Test API connection
- [ ] Set monthly character count alerts
- [ ] Configure Casey worker in your marketing platform

## Integration Example

Once you have your API key, add it to your marketing department:

```javascript
// In your .env file (NEVER commit this!)
RYTR_API_KEY=your_api_key_here

// Casey can then use it for tasks
const generateCopy = async (useCase, context) => {
  const response = await fetch('https://api.rytr.me/v1/ryte', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RYTR_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      languageId: 'en',
      toneId: 'casual',
      useCaseId: useCase,
      inputContexts: context,
      variations: 1
    })
  });

  const data = await response.json();
  return data.data[0].text;
};

// Example usage
const productDesc = await generateCopy('product_description', {
  PRODUCT_NAME: 'Smart Water Bottle',
  PRODUCT_DESCRIPTION: 'Tracks hydration, glows to remind you to drink'
});
```

## API Response Format

Rytr.me returns responses in this format:

```json
{
  "data": [
    {
      "text": "Your generated copy appears here...",
      "languageId": "en",
      "toneId": "casual",
      "useCaseId": "product_description"
    }
  ],
  "credits_used": 156
}
```

## Error Handling

Common errors and solutions:

### 401 Unauthorized
- Check API key is correct
- Verify key hasn't expired
- Ensure Bearer token format: `Bearer YOUR_KEY`

### 429 Too Many Requests
- You've hit rate limits
- Wait before retrying
- Consider upgrading plan

### 402 Payment Required
- Free tier character limit reached
- Upgrade plan or wait for monthly reset
- Check usage at https://rytr.me/account

## Documentation Links

- **Official Website**: https://rytr.me
- **API Documentation**: https://rytr.me/api (may require login)
- **Use Cases List**: Available in dashboard
- **Pricing**: https://rytr.me/pricing

## Support

If you run into issues:
- **Help Center**: Check Rytr.me dashboard for help docs
- **Email Support**: Contact via Rytr.me website
- **FAQ**: Available in account dashboard

## Security Best Practices

⚠️ **NEVER share your API key publicly!**

✅ **DO:**
- Store API keys in environment variables
- Use .env files (add to .gitignore)
- Rotate keys regularly
- Monitor usage for unexpected spikes
- Use separate keys for dev/production

❌ **DON'T:**
- Commit API keys to Git
- Share keys in Slack/Email
- Use the same key across projects
- Hardcode keys in source code
- Share keys with untrusted apps

## Monitoring Usage

Track your character usage:
1. Log into https://rytr.me
2. Go to Account Settings
3. View "Usage This Month"
4. Set up alerts when approaching limit

**Pro tip**: Keep a spreadsheet to track:
- Date
- Use case
- Characters used
- Remaining balance

---

**Ready to get started?**
1. Sign up at https://rytr.me
2. Get your API key from Account Settings
3. Add to your `.env` file
4. Let Casey start creating amazing copy!

**Character Budget Planning:**
- If you write 10 product descriptions/month (~500 chars each) = 5,000 chars
- Plus 20 social posts (~200 chars each) = 4,000 chars
- Plus 10 email subjects (~50 chars each) = 500 chars
- **Total**: 9,500 chars - fits within free tier! 🎉
