# Quick Start: Free AI Marketing Platforms

Get your AI Marketing Department running with **100% FREE** tools!

## Overview

This guide shows you how to set up all 5 free-tier AI workers:

| Worker | Platform | Free Tier Limit | Setup Time |
|--------|----------|-----------------|------------|
| 📝 **Casey** | Rytr.me | 10,000 characters/month | 3 min |
| 🎯 **Hunter** | Hunter.io | 50 searches/month | 3 min |
| 📧 **Sage** | Mailchimp | 500 contacts | 10 min |
| 📊 **Analyzer** | Google Analytics | Unlimited | 15 min |
| 🔥 **Heatley** | Hotjar | 35 sessions/day | 10 min |

**Total Setup Time: ~35 minutes** for complete AI marketing stack!

---

## 1. 📝 Casey - Rytr.me (AI Copywriter)

### What You Get Free
- 10,000 characters per month
- 40+ use cases & templates
- 30+ languages
- 20+ tones of voice
- Plagiarism checker

### Setup Steps

1. **Sign Up**: https://rytr.me
2. **Get API Key**:
   - Log into your Rytr account
   - Go to Account Settings
   - Find API section
   - Copy your API key
3. **Test It**: Try writing something in the dashboard

### Use Cases
- Product descriptions
- Ad headlines & copy
- Social media posts
- Email content
- Blog posts & articles
- SEO meta descriptions

**Detailed Guide**: [Rytr.me Setup](./setup/RYTR_SETUP.md)

---

## 2. 🎯 Hunter - Hunter.io (Email Finder)

### What You Get Free
- 50 email searches per month
- Email verification
- Domain search
- Bulk verification

### Setup Steps

1. **Sign Up**: https://hunter.io
2. **Get API Key**:
   - Go to https://hunter.io/api_keys
   - Click "Create API Key"
   - Copy the key
3. **Note Your Limits**: 50 searches/month

### Use Cases
- Find decision-maker emails
- Verify contact lists
- Discover company email patterns
- Lead enrichment

### API Example
```bash
curl "https://api.hunter.io/v2/domain-search?domain=company.com&api_key=YOUR_KEY"
```

---

## 3. 📧 Sage - Mailchimp (Email Marketing)

### What You Get Free
- 500 contacts
- 1,000 emails per month
- Basic templates
- Signup forms
- Marketing CRM

### Setup Steps

1. **Sign Up**: https://mailchimp.com/pricing/free/
2. **Get API Key**:
   - Go to Account > Extras > API Keys
   - Click "Create A Key"
   - Copy and save it
3. **Create First Audience**:
   - Go to Audience > Create Audience
   - Fill in business details

### Use Cases
- Newsletter campaigns
- Welcome email series
- Product announcements
- Automated workflows

### API Example
```bash
curl -X GET \
  "https://us1.api.mailchimp.com/3.0/campaigns" \
  -u "anystring:YOUR_API_KEY"
```

---

## 4. 📊 Analyzer - Google Analytics (Web Analytics)

### What You Get Free
- **Unlimited** - Completely free!
- Real-time reporting
- Conversion tracking
- Audience insights
- Custom reports

### Setup Steps

1. **Sign Up**: https://analytics.google.com
2. **Create Property**:
   - Click "Start measuring"
   - Enter website details
   - Choose web platform
3. **Get Tracking ID**:
   - Copy your Measurement ID (G-XXXXXXXXXX)
   - Add tracking code to your site
4. **Get API Access** (optional):
   - Go to https://console.cloud.google.com
   - Enable Google Analytics API
   - Create service account
   - Download credentials JSON

### Use Cases
- Traffic analysis
- Conversion tracking
- User behavior
- Goal monitoring

### Quick Installation
```html
<!-- Add to your website <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 5. 🔥 Heatley - Hotjar (User Experience)

### What You Get Free
- 35 sessions per day
- Unlimited heatmaps
- Basic recordings
- Incoming feedback

### Setup Steps

1. **Sign Up**: https://www.hotjar.com/pricing/
2. **Add Site**:
   - Click "Add Site"
   - Enter your website URL
   - Copy tracking code
3. **Install Tracking**:
   - Paste code before `</head>`
   - Verify installation
4. **Get Site ID** (for API):
   - Settings > Sites & Organizations
   - Copy your Site ID

### Use Cases
- Heatmap analysis
- Session recordings
- Conversion funnel issues
- User feedback

### Quick Installation
```html
<!-- Add to your website <head> -->
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:YOUR_SITE_ID,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

---

## Environment Variables

Create a `.env` file to store all your API keys securely:

```bash
# Rytr.me (✅ CONFIGURED)
VITE_RYTR_API_KEY=90ECPFOACTFO2KE2LPHZR

# Hunter.io
VITE_HUNTERIO_API_KEY=your_hunterio_key_here

# Mailchimp
VITE_MAILCHIMP_API_KEY=your_mailchimp_key_here
VITE_MAILCHIMP_SERVER_PREFIX=us1  # Check your API key for server prefix

# Google Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# Hotjar
VITE_HOTJAR_SITE_ID=your_site_id_here

# Note: VITE_ prefix is required for environment variables in Vite projects
```

**⚠️ IMPORTANT**: Add `.env` to your `.gitignore`!

---

## Cost Comparison

| Platform | Free Tier | Paid Plans Start At |
|----------|-----------|-------------------|
| Rytr.me | 10K chars/mo | $9/mo (100K chars) |
| Hunter.io | 50 searches/mo | $49/mo (500 searches) |
| Mailchimp | 500 contacts | $13/mo (500 contacts) |
| Google Analytics | ∞ FREE | Always free |
| Hotjar | 35 sessions/day | $39/mo (100 sessions/day) |

**Total if paid**: ~$110/month
**Your cost**: **$0/month** 🎉

---

## Upgrade When You Grow

**When to consider upgrading**:

📝 **Rytr.me**: When you need more than 10,000 characters/month
🎯 **Hunter.io**: When you need 50+ email searches/month
📧 **Mailchimp**: When you hit 500 contacts
📊 **Google Analytics**: Never! Always free
🔥 **Hotjar**: When you need more than 35 sessions/day

---

## Next Steps

1. ✅ Sign up for all 5 platforms
2. ✅ Get your API keys
3. ✅ Add keys to `.env` file
4. ✅ Test each integration
5. ✅ Start automating your marketing!

---

## Support

Need help? Check individual setup guides:
- [Rytr.me Setup Guide](./setup/RYTR_SETUP.md)
- [Hunter.io Documentation](https://hunter.io/api-documentation)
- [Mailchimp API Docs](https://mailchimp.com/developer/)
- [Google Analytics Setup](https://support.google.com/analytics)
- [Hotjar Help Center](https://help.hotjar.com)

---

**Ready to supercharge your marketing with AI? Start with platform #1! 🚀**
