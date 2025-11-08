/**
 * Hunter.io Integration for Hunter (Email Finder)
 *
 * This module handles all interactions with Hunter.io API.
 *
 * SETUP REQUIRED:
 * 1. Sign up at https://hunter.io
 * 2. Get API key from Dashboard > API section
 * 3. Add your API key to .env file as VITE_HUNTERIO_API_KEY
 */

const HUNTERIO_API_KEY = import.meta.env.VITE_HUNTERIO_API_KEY || '';
const API_BASE_URL = 'https://api.hunter.io/v2';

/**
 * Find email addresses for a domain
 * @param {string} domain - The company domain
 * @returns {Promise<object>} - Email addresses found
 */
export async function domainSearch(domain) {
  if (!HUNTERIO_API_KEY) {
    throw new Error('Hunter.io API key not found. Set VITE_HUNTERIO_API_KEY in .env file');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/domain-search?domain=${encodeURIComponent(domain)}&api_key=${HUNTERIO_API_KEY}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Hunter.io API error: ${response.status} - ${error.errors?.[0]?.details || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Hunter.io domain search error:', error);
    throw error;
  }
}

/**
 * Find specific person's email
 * @param {object} params - Search parameters
 * @returns {Promise<object>} - Email information
 */
export async function emailFinder({ domain, firstName, lastName, company }) {
  if (!HUNTERIO_API_KEY) {
    throw new Error('Hunter.io API key not found');
  }

  try {
    const params = new URLSearchParams({
      domain,
      first_name: firstName,
      last_name: lastName,
      api_key: HUNTERIO_API_KEY
    });

    if (company) params.append('company', company);

    const response = await fetch(`${API_BASE_URL}/email-finder?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Hunter.io API error: ${response.status} - ${error.errors?.[0]?.details || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Hunter.io email finder error:', error);
    throw error;
  }
}

/**
 * Verify an email address
 * @param {string} email - Email to verify
 * @returns {Promise<object>} - Verification result
 */
export async function verifyEmail(email) {
  if (!HUNTERIO_API_KEY) {
    throw new Error('Hunter.io API key not found');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/email-verifier?email=${encodeURIComponent(email)}&api_key=${HUNTERIO_API_KEY}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Hunter.io API error: ${response.status} - ${error.errors?.[0]?.details || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Hunter.io email verification error:', error);
    throw error;
  }
}

/**
 * Get account information
 * @returns {Promise<object>} - Account info including remaining requests
 */
export async function getAccountInfo() {
  if (!HUNTERIO_API_KEY) {
    throw new Error('Hunter.io API key not found');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/account?api_key=${HUNTERIO_API_KEY}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Hunter.io API error: ${response.status} - ${error.errors?.[0]?.details || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Hunter.io account info error:', error);
    throw error;
  }
}

/**
 * Check if Hunter.io is configured
 * @returns {boolean}
 */
export function isHunterConfigured() {
  return Boolean(HUNTERIO_API_KEY);
}

/**
 * Get configuration status
 * @returns {object} - Configuration details
 */
export function getConfigStatus() {
  const hasApiKey = Boolean(HUNTERIO_API_KEY);

  return {
    isConfigured: hasApiKey,
    hasApiKey,
    message: !hasApiKey
      ? 'API key not set. Add VITE_HUNTERIO_API_KEY to .env file'
      : 'Hunter.io is ready to use!',
  };
}

// ============================================
// CAMPAIGN MANAGEMENT
// ============================================

/**
 * Create a new email campaign
 * @param {object} params - Campaign parameters
 * @returns {Promise<object>} - Campaign details
 */
export async function createCampaign({
  name,
  subject,
  emailContent,
  fromEmail,
  fromName,
  replyTo,
  timezone = 'UTC'
}) {
  if (!HUNTERIO_API_KEY) {
    throw new Error('Hunter.io API key not found');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: HUNTERIO_API_KEY,
        name,
        subject,
        body: emailContent,
        from_email: fromEmail,
        from_name: fromName,
        reply_to: replyTo || fromEmail,
        timezone
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Hunter.io API error: ${response.status} - ${error.errors?.[0]?.details || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Hunter.io create campaign error:', error);
    throw error;
  }
}

/**
 * Get all campaigns
 * @param {number} limit - Number of campaigns to retrieve
 * @param {number} offset - Offset for pagination
 * @returns {Promise<array>} - List of campaigns
 */
export async function getCampaigns(limit = 100, offset = 0) {
  if (!HUNTERIO_API_KEY) {
    throw new Error('Hunter.io API key not found');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/campaigns?api_key=${HUNTERIO_API_KEY}&limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Hunter.io API error: ${response.status} - ${error.errors?.[0]?.details || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.data?.campaigns || [];
  } catch (error) {
    console.error('Hunter.io get campaigns error:', error);
    throw error;
  }
}

/**
 * Get campaign details
 * @param {number} campaignId - Campaign ID
 * @returns {Promise<object>} - Campaign details
 */
export async function getCampaign(campaignId) {
  if (!HUNTERIO_API_KEY) {
    throw new Error('Hunter.io API key not found');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/campaigns/${campaignId}?api_key=${HUNTERIO_API_KEY}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Hunter.io API error: ${response.status} - ${error.errors?.[0]?.details || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Hunter.io get campaign error:', error);
    throw error;
  }
}

/**
 * Add recipients to a campaign
 * @param {number} campaignId - Campaign ID
 * @param {array} recipients - Array of recipient objects
 * @returns {Promise<object>} - Result
 */
export async function addCampaignRecipients(campaignId, recipients) {
  if (!HUNTERIO_API_KEY) {
    throw new Error('Hunter.io API key not found');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/recipients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: HUNTERIO_API_KEY,
        recipients: recipients.map(r => ({
          email: r.email,
          first_name: r.firstName,
          last_name: r.lastName,
          company: r.company,
          position: r.position
        }))
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Hunter.io API error: ${response.status} - ${error.errors?.[0]?.details || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Hunter.io add recipients error:', error);
    throw error;
  }
}

/**
 * Send/Schedule a campaign
 * @param {number} campaignId - Campaign ID
 * @param {object} options - Send options
 * @returns {Promise<object>} - Result
 */
export async function sendCampaign(campaignId, { scheduleAt = null } = {}) {
  if (!HUNTERIO_API_KEY) {
    throw new Error('Hunter.io API key not found');
  }

  try {
    const body = {
      api_key: HUNTERIO_API_KEY
    };

    if (scheduleAt) {
      body.schedule_at = scheduleAt;
    }

    const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Hunter.io API error: ${response.status} - ${error.errors?.[0]?.details || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Hunter.io send campaign error:', error);
    throw error;
  }
}

/**
 * Get campaign statistics
 * @param {number} campaignId - Campaign ID
 * @returns {Promise<object>} - Campaign stats
 */
export async function getCampaignStats(campaignId) {
  if (!HUNTERIO_API_KEY) {
    throw new Error('Hunter.io API key not found');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/campaigns/${campaignId}/stats?api_key=${HUNTERIO_API_KEY}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Hunter.io API error: ${response.status} - ${error.errors?.[0]?.details || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Hunter.io get campaign stats error:', error);
    throw error;
  }
}

/**
 * Pause a campaign
 * @param {number} campaignId - Campaign ID
 * @returns {Promise<object>} - Result
 */
export async function pauseCampaign(campaignId) {
  if (!HUNTERIO_API_KEY) {
    throw new Error('Hunter.io API key not found');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/pause`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: HUNTERIO_API_KEY
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Hunter.io API error: ${response.status} - ${error.errors?.[0]?.details || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Hunter.io pause campaign error:', error);
    throw error;
  }
}

/**
 * Delete a campaign
 * @param {number} campaignId - Campaign ID
 * @returns {Promise<object>} - Result
 */
export async function deleteCampaign(campaignId) {
  if (!HUNTERIO_API_KEY) {
    throw new Error('Hunter.io API key not found');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: HUNTERIO_API_KEY
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Hunter.io API error: ${response.status} - ${error.errors?.[0]?.details || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Hunter.io delete campaign error:', error);
    throw error;
  }
}

// Example usage:
/*

import {
  domainSearch,
  emailFinder,
  verifyEmail,
  getAccountInfo,
  isHunterConfigured
} from './integrations/hunter';

// Check if configured
if (!isHunterConfigured()) {
  console.log('Hunter.io needs to be configured first!');
}

// Search for emails at a domain
const results = await domainSearch('stripe.com');
console.log(`Found ${results.emails.length} emails`);

// Find specific person
const email = await emailFinder({
  domain: 'stripe.com',
  firstName: 'John',
  lastName: 'Doe'
});

// Verify an email
const verification = await verifyEmail('test@example.com');
console.log(`Email is ${verification.result}`); // deliverable, undeliverable, risky

// Check account usage
const account = await getAccountInfo();
console.log(`Requests remaining: ${account.requests.searches.available}/${account.requests.searches.available + account.requests.searches.used}`);

*/
