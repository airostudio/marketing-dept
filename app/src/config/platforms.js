/**
 * AI Platform Configuration
 *
 * This file contains configuration for all AI platforms
 * integrated into the marketing department.
 */

export const aiPlatforms = {
  rytr: {
    name: "Rytr AI",
    url: "https://app.rytr.me",
    apiKey: import.meta.env.VITE_RYTR_API_KEY || '',
    tier: "unlimited",
    features: {
      productDescription: true,
      socialMediaPost: true,
      emailSubject: true,
      adCopy: true,
      blogOutline: true,
      blogIntro: true,
      metaDescription: true,
      marketingCopy: true,
    },
    limits: {
      freeCharacters: 10000,
      charactersPerMonth: "unlimited", // For unlimited tier
    },
    documentation: "https://rytr.me/api",
  },

  // Additional platforms can be added here
  hunterIo: {
    name: "Hunter.io",
    url: "https://hunter.io",
    apiKey: import.meta.env.VITE_HUNTERIO_API_KEY || '',
    tier: "free",
    limits: {
      searchesPerMonth: 50,
    },
  },

  mailchimp: {
    name: "Mailchimp",
    url: "https://mailchimp.com",
    apiKey: import.meta.env.VITE_MAILCHIMP_API_KEY || '',
    tier: "free",
    limits: {
      contacts: 500,
    },
  },

  googleAnalytics: {
    name: "Google Analytics",
    url: "https://analytics.google.com",
    trackingId: import.meta.env.VITE_GA_TRACKING_ID || '',
    tier: "free",
    limits: {
      unlimited: true,
    },
  },

  hotjar: {
    name: "Hotjar",
    url: "https://www.hotjar.com",
    siteId: import.meta.env.VITE_HOTJAR_SITE_ID || '',
    tier: "free",
    limits: {
      sessionsPerDay: 35,
    },
  },
};

/**
 * Get platform configuration by key
 * @param {string} platformKey - The platform key (e.g., 'rytr', 'hunterIo')
 * @returns {object} Platform configuration
 */
export function getPlatform(platformKey) {
  return aiPlatforms[platformKey];
}

/**
 * Check if a platform is configured
 * @param {string} platformKey - The platform key
 * @returns {boolean} True if platform has API key configured
 */
export function isPlatformConfigured(platformKey) {
  const platform = aiPlatforms[platformKey];
  if (!platform) return false;

  return Boolean(
    platform.apiKey ||
    platform.trackingId ||
    platform.siteId
  );
}

/**
 * Get all configured platforms
 * @returns {array} Array of configured platform objects
 */
export function getConfiguredPlatforms() {
  return Object.entries(aiPlatforms)
    .filter(([key]) => isPlatformConfigured(key))
    .map(([key, config]) => ({ key, ...config }));
}

/**
 * Get platform status for all platforms
 * @returns {object} Object with platform keys and their configuration status
 */
export function getAllPlatformStatus() {
  return Object.keys(aiPlatforms).reduce((status, key) => {
    status[key] = {
      name: aiPlatforms[key].name,
      configured: isPlatformConfigured(key),
      tier: aiPlatforms[key].tier,
    };
    return status;
  }, {});
}

export default aiPlatforms;
