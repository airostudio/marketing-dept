/**
 * API Requirements Detector
 *
 * Identifies which APIs and integrations are needed for a task,
 * and provides setup documentation links.
 */

export interface APIRequirement {
  name: string;
  description: string;
  required: boolean;
  setupUrl: string;
  docsUrl: string;
  pricingUrl?: string;
  freeTier: boolean;
  estimatedCost?: string;
}

export interface TaskAPIRequirements {
  taskDescription: string;
  requiredAPIs: APIRequirement[];
  optionalAPIs: APIRequirement[];
  setupInstructions: string;
  estimatedTotalCost?: string;
}

/**
 * API Database with documentation links
 */
const API_DATABASE: Record<string, APIRequirement> = {
  'google-maps': {
    name: 'Google Maps Platform API',
    description: 'Access to Google Maps data for business searches, geocoding, and places',
    required: true,
    setupUrl: 'https://console.cloud.google.com/google/maps-apis',
    docsUrl: 'https://developers.google.com/maps/documentation',
    pricingUrl: 'https://mapsplatform.google.com/pricing/',
    freeTier: true,
    estimatedCost: '$200/month free credit, then $5-$17 per 1,000 requests'
  },
  'google-places': {
    name: 'Google Places API',
    description: 'Search for businesses, get place details, photos, and reviews',
    required: true,
    setupUrl: 'https://console.cloud.google.com/apis/library/places-backend.googleapis.com',
    docsUrl: 'https://developers.google.com/maps/documentation/places/web-service',
    pricingUrl: 'https://mapsplatform.google.com/pricing/',
    freeTier: true,
    estimatedCost: '$200/month free credit'
  },
  'linkedin-api': {
    name: 'LinkedIn API',
    description: 'Access LinkedIn profiles and company data (requires partnership)',
    required: true,
    setupUrl: 'https://www.linkedin.com/developers/apps',
    docsUrl: 'https://learn.microsoft.com/en-us/linkedin/',
    pricingUrl: 'https://business.linkedin.com/sales-solutions/sales-navigator/pricing',
    freeTier: false,
    estimatedCost: 'Sales Navigator required: $99.99/month'
  },
  'zoominfo': {
    name: 'ZoomInfo API',
    description: 'B2B contact and company data database',
    required: false,
    setupUrl: 'https://www.zoominfo.com/api',
    docsUrl: 'https://api-docs.zoominfo.com/',
    pricingUrl: 'https://www.zoominfo.com/pricing',
    freeTier: false,
    estimatedCost: 'Enterprise pricing (contact sales)'
  },
  'apollo': {
    name: 'Apollo.io API',
    description: 'B2B database with 275M contacts and lead enrichment',
    required: false,
    setupUrl: 'https://app.apollo.io/settings/integrations/api',
    docsUrl: 'https://apolloio.github.io/apollo-api-docs/',
    pricingUrl: 'https://www.apollo.io/pricing',
    freeTier: true,
    estimatedCost: 'Free tier available, Pro from $49/month'
  },
  'hunter-io': {
    name: 'Hunter.io API',
    description: 'Email finding and verification service',
    required: true,
    setupUrl: 'https://hunter.io/api-keys',
    docsUrl: 'https://hunter.io/api-documentation',
    pricingUrl: 'https://hunter.io/pricing',
    freeTier: true,
    estimatedCost: '25 free searches/month, then $49/month'
  },
  'clearbit': {
    name: 'Clearbit API',
    description: 'Company and contact enrichment data',
    required: false,
    setupUrl: 'https://clearbit.com/platform',
    docsUrl: 'https://clearbit.com/docs',
    pricingUrl: 'https://clearbit.com/pricing',
    freeTier: false,
    estimatedCost: 'From $99/month'
  },
  'facebook-ads': {
    name: 'Facebook/Meta Ads API',
    description: 'Create and manage Facebook and Instagram ad campaigns',
    required: true,
    setupUrl: 'https://developers.facebook.com/apps',
    docsUrl: 'https://developers.facebook.com/docs/marketing-apis',
    pricingUrl: 'https://www.facebook.com/business/ads/pricing',
    freeTier: true,
    estimatedCost: 'Pay per ad performance (CPC/CPM)'
  },
  'google-ads': {
    name: 'Google Ads API',
    description: 'Manage Google Ads campaigns programmatically',
    required: true,
    setupUrl: 'https://ads.google.com/intl/en_us/home/tools/manager-accounts/',
    docsUrl: 'https://developers.google.com/google-ads/api/docs/start',
    pricingUrl: 'https://ads.google.com/home/pricing/',
    freeTier: true,
    estimatedCost: 'Pay per click (varies by industry)'
  },
  'mailchimp': {
    name: 'Mailchimp API',
    description: 'Email marketing automation and campaigns',
    required: true,
    setupUrl: 'https://mailchimp.com/developer/',
    docsUrl: 'https://mailchimp.com/developer/marketing/',
    pricingUrl: 'https://mailchimp.com/pricing/',
    freeTier: true,
    estimatedCost: 'Free up to 500 contacts, then from $13/month'
  },
  'sendgrid': {
    name: 'SendGrid API',
    description: 'Email delivery and transactional emails',
    required: true,
    setupUrl: 'https://app.sendgrid.com/settings/api_keys',
    docsUrl: 'https://docs.sendgrid.com/',
    pricingUrl: 'https://sendgrid.com/pricing/',
    freeTier: true,
    estimatedCost: 'Free 100 emails/day, then from $19.95/month'
  },
  'hubspot': {
    name: 'HubSpot API',
    description: 'CRM, marketing automation, and sales tools',
    required: false,
    setupUrl: 'https://developers.hubspot.com/get-started',
    docsUrl: 'https://developers.hubspot.com/docs/api/overview',
    pricingUrl: 'https://www.hubspot.com/pricing',
    freeTier: true,
    estimatedCost: 'Free CRM, Marketing from $50/month'
  },
  'google-analytics': {
    name: 'Google Analytics 4 API',
    description: 'Website and app analytics data',
    required: true,
    setupUrl: 'https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com',
    docsUrl: 'https://developers.google.com/analytics/devguides/reporting/data/v1',
    pricingUrl: 'https://marketingplatform.google.com/about/analytics/compare/',
    freeTier: true,
    estimatedCost: 'Free for standard, Analytics 360 from $50k/year'
  },
  'semrush': {
    name: 'SEMrush API',
    description: 'SEO, keywords, and competitive research data',
    required: true,
    setupUrl: 'https://www.semrush.com/api-documentation/',
    docsUrl: 'https://developer.semrush.com/',
    pricingUrl: 'https://www.semrush.com/pricing/',
    freeTier: false,
    estimatedCost: 'From $119.95/month'
  },
  'ahrefs': {
    name: 'Ahrefs API',
    description: 'SEO backlink and keyword research',
    required: true,
    setupUrl: 'https://ahrefs.com/api',
    docsUrl: 'https://ahrefs.com/api/documentation',
    pricingUrl: 'https://ahrefs.com/pricing',
    freeTier: false,
    estimatedCost: 'From $99/month + $50 API add-on'
  },
  'youtube-data': {
    name: 'YouTube Data API',
    description: 'Access YouTube videos, channels, and analytics',
    required: true,
    setupUrl: 'https://console.cloud.google.com/apis/library/youtube.googleapis.com',
    docsUrl: 'https://developers.google.com/youtube/v3',
    pricingUrl: 'https://developers.google.com/youtube/v3/determine_quota_cost',
    freeTier: true,
    estimatedCost: 'Free (10,000 units/day quota)'
  }
};

/**
 * Detect required APIs based on task description
 */
export function detectRequiredAPIs(taskDescription: string, agentIds: string[]): TaskAPIRequirements {
  const lowerTask = taskDescription.toLowerCase();
  const requiredAPIs: APIRequirement[] = [];
  const optionalAPIs: APIRequirement[] = [];

  // Google Maps / Places detection
  if (
    lowerTask.includes('google maps') ||
    lowerTask.includes('scrape') && (lowerTask.includes('business') || lowerTask.includes('location')) ||
    lowerTask.includes('find businesses') ||
    lowerTask.includes('compile list') && (lowerTask.includes('plumber') || lowerTask.includes('lawyer') || lowerTask.includes('dentist'))
  ) {
    requiredAPIs.push(API_DATABASE['google-maps']);
    requiredAPIs.push(API_DATABASE['google-places']);
  }

  // LinkedIn detection
  if (lowerTask.includes('linkedin')) {
    requiredAPIs.push(API_DATABASE['linkedin-api']);
    optionalAPIs.push(API_DATABASE['apollo']);
    optionalAPIs.push(API_DATABASE['zoominfo']);
  }

  // Lead generation / prospecting
  if (
    agentIds.includes('sarah-chen') ||
    agentIds.includes('zoey') ||
    lowerTask.includes('lead generation') ||
    lowerTask.includes('prospecting')
  ) {
    optionalAPIs.push(API_DATABASE['apollo']);
    optionalAPIs.push(API_DATABASE['zoominfo']);
    optionalAPIs.push(API_DATABASE['clearbit']);
  }

  // Email finding
  if (
    agentIds.includes('hunter') ||
    lowerTask.includes('email') && (lowerTask.includes('find') || lowerTask.includes('verify'))
  ) {
    requiredAPIs.push(API_DATABASE['hunter-io']);
  }

  // Email marketing
  if (
    agentIds.includes('emma-wilson') ||
    agentIds.includes('sage') ||
    lowerTask.includes('email campaign') ||
    lowerTask.includes('newsletter')
  ) {
    requiredAPIs.push(API_DATABASE['mailchimp']);
    optionalAPIs.push(API_DATABASE['sendgrid']);
    optionalAPIs.push(API_DATABASE['hubspot']);
  }

  // Paid ads
  if (
    agentIds.includes('alex-rodriguez') ||
    agentIds.includes('smarta') ||
    lowerTask.includes('facebook ad') ||
    lowerTask.includes('instagram ad') ||
    lowerTask.includes('social ad')
  ) {
    requiredAPIs.push(API_DATABASE['facebook-ads']);
  }

  if (lowerTask.includes('google ad') || lowerTask.includes('ppc')) {
    requiredAPIs.push(API_DATABASE['google-ads']);
  }

  // SEO
  if (
    agentIds.includes('ryan-mitchell') ||
    agentIds.includes('surfy') ||
    lowerTask.includes('seo') ||
    lowerTask.includes('keyword research')
  ) {
    requiredAPIs.push(API_DATABASE['semrush']);
    optionalAPIs.push(API_DATABASE['ahrefs']);
  }

  // Analytics
  if (
    agentIds.includes('david-kim') ||
    agentIds.includes('analyzer') ||
    lowerTask.includes('analytics') ||
    lowerTask.includes('ga4')
  ) {
    requiredAPIs.push(API_DATABASE['google-analytics']);
  }

  // Video marketing
  if (
    agentIds.includes('victor-stone') ||
    lowerTask.includes('youtube') ||
    lowerTask.includes('video')
  ) {
    requiredAPIs.push(API_DATABASE['youtube-data']);
  }

  // Generate setup instructions
  const setupInstructions = generateSetupInstructions(requiredAPIs, optionalAPIs);

  // Calculate total cost
  const estimatedTotalCost = calculateTotalCost(requiredAPIs, optionalAPIs);

  return {
    taskDescription,
    requiredAPIs,
    optionalAPIs,
    setupInstructions,
    estimatedTotalCost
  };
}

/**
 * Generate setup instructions
 */
function generateSetupInstructions(required: APIRequirement[], optional: APIRequirement[]): string {
  let instructions = '## API Setup Required\n\n';

  if (required.length === 0 && optional.length === 0) {
    return 'No external APIs required for this task.';
  }

  if (required.length > 0) {
    instructions += '### Required APIs\n\n';
    required.forEach((api, index) => {
      instructions += `${index + 1}. **${api.name}**\n`;
      instructions += `   - ${api.description}\n`;
      instructions += `   - Setup: ${api.setupUrl}\n`;
      instructions += `   - Documentation: ${api.docsUrl}\n`;
      if (api.pricingUrl) {
        instructions += `   - Pricing: ${api.pricingUrl}\n`;
      }
      instructions += `   - Cost: ${api.estimatedCost}\n`;
      instructions += `   - Free Tier: ${api.freeTier ? 'Yes ✅' : 'No ❌'}\n\n`;
    });
  }

  if (optional.length > 0) {
    instructions += '### Optional APIs (Recommended)\n\n';
    optional.forEach((api, index) => {
      instructions += `${index + 1}. **${api.name}**\n`;
      instructions += `   - ${api.description}\n`;
      instructions += `   - Setup: ${api.setupUrl}\n`;
      instructions += `   - Cost: ${api.estimatedCost}\n\n`;
    });
  }

  return instructions;
}

/**
 * Calculate estimated total cost
 */
function calculateTotalCost(required: APIRequirement[], _optional: APIRequirement[]): string {
  const costs: string[] = [];

  required.forEach(api => {
    if (!api.freeTier) {
      costs.push(api.estimatedCost || 'Contact for pricing');
    }
  });

  if (costs.length === 0) {
    return 'Free (with free tiers) or pay-as-you-go';
  }

  return costs.join(' + ');
}

/**
 * Format API requirements for display
 */
export function formatAPIRequirementsAsMarkdown(requirements: TaskAPIRequirements): string {
  return requirements.setupInstructions;
}
