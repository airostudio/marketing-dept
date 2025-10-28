# Integration Guide

## Overview
This guide covers how to integrate AI marketing tools with your existing technology stack.

## Integration Hub: CRM

Your CRM (Salesforce, HubSpot, etc.) should be the central hub for all integrations.

### Benefits:
- Single source of truth for customer data
- Unified reporting
- Automated workflows
- Better attribution

## Integration Patterns

### Pattern 1: Native Integration
Tools with built-in CRM connectors (easiest).

**Example**: Clearbit → Salesforce
```
1. In Clearbit dashboard: Settings → Integrations
2. Click "Connect Salesforce"
3. Authorize OAuth connection
4. Configure field mapping
5. Enable auto-enrichment
```

### Pattern 2: API Integration
Direct API connections for custom workflows.

**Example**: Hunter.io API
```python
import requests

def find_email(domain, first_name, last_name):
    url = f"https://api.hunter.io/v2/email-finder"
    params = {
        "domain": domain,
        "first_name": first_name,
        "last_name": last_name,
        "api_key": "YOUR_API_KEY"
    }
    response = requests.get(url, params=params)
    return response.json()

# Usage
email = find_email("company.com", "John", "Doe")
```

### Pattern 3: Zapier/Make Integration
No-code integration platform (most flexible).

**Example Zap**: New Lead Workflow
```
Trigger: New lead in ZoomInfo
↓
Action 1: Enrich with Clearbit
↓
Action 2: Find email with Hunter.io
↓
Action 3: Add to Mailchimp list
↓
Action 4: Create Salesforce lead
↓
Action 5: Post to Slack channel
```

### Pattern 4: Webhook Integration
Real-time event notifications.

**Example**: Hotjar → Slack
```javascript
// Hotjar sends webhook on new feedback
{
  "event": "feedback_submitted",
  "data": {
    "url": "https://example.com/pricing",
    "feedback": "Too expensive",
    "sentiment": "negative"
  }
}

// Your webhook handler
app.post('/webhook/hotjar', (req, res) => {
  const feedback = req.body;
  // Post to Slack
  slackClient.post(feedback);
  // Update analytics
  analytics.track(feedback);
});
```

## Integration Recipes

### Recipe 1: Lead Enrichment Pipeline

**Tools**: ZoomInfo → Clearbit → Hunter.io → Salesforce

**Setup**:
1. **ZoomInfo**: Export leads or use Chrome extension
2. **Clearbit**:
   ```bash
   # Set up Salesforce integration
   # Enable auto-enrichment on new leads
   ```
3. **Hunter.io**:
   ```python
   # Salesforce Process Builder or Flow
   # When Lead created → Call Hunter.io API
   # Update Lead.Email field
   ```
4. **Result**: Every new lead automatically enriched

**Time to Setup**: 2-3 hours

---

### Recipe 2: Content Performance Tracking

**Tools**: Google Analytics → PaveAI → Slack

**Setup**:
1. **Google Analytics**: Ensure GA4 is installed
2. **PaveAI**:
   - Connect to GA account
   - Set up weekly insights reports
3. **Slack Integration**:
   - Configure PaveAI → Slack notifications
   - Weekly insights posted to #marketing channel

**Time to Setup**: 30 minutes

---

### Recipe 3: Email Optimization Stack

**Tools**: Mailchimp → Phrasee → Seventh Sense → Google Analytics

**Setup**:
1. **Mailchimp**: Create campaign
2. **Phrasee**:
   - Generate subject line variations
   - A/B test automatically
3. **Seventh Sense**:
   - Available for HubSpot/Marketo
   - Optimizes send times per recipient
4. **Google Analytics**:
   - Track email UTM parameters
   - Measure conversions

**Time to Setup**: 1 hour

---

### Recipe 4: Chatbot → CRM → Email

**Tools**: Drift → Salesforce → Mailchimp

**Setup**:
1. **Drift Playbook**: Qualify leads via chat
2. **Salesforce Integration**:
   ```
   Drift Lead → Creates Salesforce Lead
   Lead Score >= 75 → Create Opportunity
   Lead Score < 75 → Add to nurture campaign
   ```
3. **Mailchimp Integration**:
   ```
   New Salesforce Lead → Add to Mailchimp list
   List determined by Lead Score
   ```

**Time to Setup**: 2 hours

---

### Recipe 5: Social Ad Automation

**Tools**: Smartly.io → Facebook/Instagram → Google Analytics

**Setup**:
1. **Smartly.io**:
   - Connect ad accounts
   - Set up automated rules
   - Configure creative templates
2. **Conversion Tracking**:
   - Install Facebook Pixel
   - Set up Google Analytics goals
   - Configure attribution

**Time to Setup**: 3 hours

---

## Common Integration Challenges

### Challenge 1: Data Mapping
**Problem**: Field names don't match between tools
**Solution**:
- Create mapping document
- Use middleware (Zapier, Make)
- Standardize naming conventions

**Example Mapping**:
```json
{
  "salesforce": {
    "FirstName": "first_name",
    "LastName": "last_name",
    "Email": "email"
  },
  "mailchimp": {
    "FNAME": "first_name",
    "LNAME": "last_name",
    "EMAIL": "email"
  }
}
```

### Challenge 2: Rate Limits
**Problem**: API calls exceed limits
**Solution**:
- Batch operations
- Queue systems
- Upgrade API tier
- Cache responses

**Example Queue**:
```python
from celery import Celery

app = Celery('tasks', broker='redis://localhost')

@app.task(rate_limit='100/m')  # 100 per minute
def enrich_lead(lead_id):
    lead = get_lead(lead_id)
    enriched = clearbit.enrich(lead.email)
    update_lead(lead_id, enriched)
```

### Challenge 3: Data Sync Issues
**Problem**: Data out of sync between systems
**Solution**:
- Implement webhooks for real-time sync
- Schedule regular sync jobs
- Use change data capture (CDC)
- Set up monitoring and alerts

### Challenge 4: Authentication
**Problem**: OAuth tokens expire
**Solution**:
- Implement token refresh
- Use service accounts
- Set up monitoring
- Error handling and retries

```python
def api_call_with_retry(func, max_retries=3):
    for i in range(max_retries):
        try:
            return func()
        except AuthenticationError:
            refresh_token()
            if i == max_retries - 1:
                raise
```

## Integration Checklist

### Before Integration
- [ ] Document current tech stack
- [ ] Identify data flows
- [ ] Check tool compatibility
- [ ] Review API documentation
- [ ] Estimate API usage
- [ ] Plan data mapping
- [ ] Set up dev/test environment

### During Integration
- [ ] Set up authentication
- [ ] Configure field mapping
- [ ] Test with sample data
- [ ] Implement error handling
- [ ] Set up logging
- [ ] Configure rate limiting
- [ ] Test edge cases

### After Integration
- [ ] Monitor for errors
- [ ] Validate data accuracy
- [ ] Document integration
- [ ] Train team
- [ ] Set up alerts
- [ ] Schedule regular reviews
- [ ] Optimize performance

## Tool-Specific Integration Guides

### Salesforce Integration Best Practices
1. Use Process Builder or Flow for automation
2. Create custom fields for AI tool data
3. Set up validation rules
4. Use separate API user
5. Monitor API usage limits

### HubSpot Integration Best Practices
1. Use HubSpot workflows
2. Create custom properties
3. Use lists for segmentation
4. Leverage HubSpot's native integrations
5. Set up deal pipelines

### Google Analytics Integration
1. Use GTM for tag management
2. Set up custom dimensions
3. Configure goals and events
4. Enable enhanced ecommerce
5. Set up cross-domain tracking

## Security Considerations

### API Key Management
- Store in environment variables
- Use secret management (AWS Secrets, Vault)
- Rotate keys regularly
- Limit key permissions
- Monitor usage

### Data Privacy
- Follow GDPR requirements
- Implement data retention policies
- Enable opt-out mechanisms
- Encrypt data in transit
- Regular security audits

### Compliance
- Obtain proper consent
- Document data flows
- Implement access controls
- Regular compliance reviews
- Privacy policy updates

## Monitoring & Maintenance

### What to Monitor
- API response times
- Error rates
- Data sync lag
- API quota usage
- Integration uptime

### Tools for Monitoring
- **Datadog**: APM and monitoring
- **Sentry**: Error tracking
- **PagerDuty**: Alerting
- **New Relic**: Performance monitoring

### Maintenance Schedule
- **Daily**: Check error logs
- **Weekly**: Review sync status
- **Monthly**: API usage audit
- **Quarterly**: Integration review
- **Annually**: Security audit

## Cost Optimization

### Tips to Reduce API Costs
1. Batch requests when possible
2. Cache frequently accessed data
3. Use webhooks instead of polling
4. Implement smart retries
5. Monitor and optimize queries

### Example Caching Strategy
```python
from functools import lru_cache
from datetime import datetime, timedelta

@lru_cache(maxsize=1000)
def get_company_data(domain, cache_timestamp):
    # Cache timestamp ensures fresh data every 24h
    return clearbit.company(domain)

# Usage
cache_key = datetime.now().date()
data = get_company_data("example.com", cache_key)
```

## Troubleshooting

### Common Errors

**401 Unauthorized**
- Check API key
- Verify permissions
- Refresh OAuth token

**429 Too Many Requests**
- Implement rate limiting
- Add delays between requests
- Upgrade API tier

**500 Internal Server Error**
- Check API status page
- Implement retries with exponential backoff
- Contact support

**Data Not Syncing**
- Verify field mapping
- Check webhooks configuration
- Review integration logs
- Test manually

## Next Steps

1. Review `/agents/agent-catalog.json` for available APIs
2. Choose integration pattern for your use case
3. Start with one integration recipe
4. Test thoroughly before production
5. Document your setup
6. Train team on monitoring

## Resources

- [Zapier Integration Directory](https://zapier.com/apps)
- [Make Integration Templates](https://www.make.com/en/templates)
- API documentation for each tool (see agent catalog)
- Integration examples on GitHub
