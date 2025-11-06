/**
 * Mailchimp Integration for Sage (Email Campaign Manager)
 *
 * This module handles all interactions with Mailchimp API v3.0.
 *
 * SETUP REQUIRED:
 * 1. Sign up at https://mailchimp.com
 * 2. Get API key from Account > Extras > API keys
 * 3. Add your API key to .env file as VITE_MAILCHIMP_API_KEY
 * 4. Add your server prefix (e.g., us7) as VITE_MAILCHIMP_SERVER_PREFIX
 */

const MAILCHIMP_API_KEY = import.meta.env.VITE_MAILCHIMP_API_KEY || '';
const MAILCHIMP_SERVER_PREFIX = import.meta.env.VITE_MAILCHIMP_SERVER_PREFIX || '';

// Extract server prefix from API key if not provided separately
const getServerPrefix = () => {
  if (MAILCHIMP_SERVER_PREFIX) return MAILCHIMP_SERVER_PREFIX;

  // API key format: xxxxxxxxxxxxx-us7
  const match = MAILCHIMP_API_KEY.match(/-([a-z0-9]+)$/);
  return match ? match[1] : '';
};

const SERVER_PREFIX = getServerPrefix();
const API_BASE_URL = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0`;

/**
 * Make authenticated request to Mailchimp API
 * @param {string} endpoint - API endpoint (e.g., '/lists')
 * @param {object} options - Fetch options
 * @returns {Promise<object>} - API response
 */
async function callMailchimp(endpoint, options = {}) {
  if (!MAILCHIMP_API_KEY) {
    throw new Error('Mailchimp API key not found. Set VITE_MAILCHIMP_API_KEY in .env file');
  }

  if (!SERVER_PREFIX) {
    throw new Error('Mailchimp server prefix not found. Set VITE_MAILCHIMP_SERVER_PREFIX in .env file');
  }

  try {
    // Mailchimp uses Basic Auth with 'anystring' as username and API key as password
    const auth = btoa(`anystring:${MAILCHIMP_API_KEY}`);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `Mailchimp API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Mailchimp API error:', error);
    throw error;
  }
}

/**
 * Get all audience lists
 * @returns {Promise<array>} - Array of lists
 */
export async function getLists() {
  const data = await callMailchimp('/lists?count=100');
  return data.lists || [];
}

/**
 * Get a specific list by ID
 * @param {string} listId - List ID
 * @returns {Promise<object>} - List details
 */
export async function getList(listId) {
  return await callMailchimp(`/lists/${listId}`);
}

/**
 * Add a subscriber to a list
 * @param {object} params - Subscriber details
 * @returns {Promise<object>} - Subscriber info
 */
export async function addSubscriber({ listId, email, firstName = '', lastName = '', tags = [] }) {
  const data = {
    email_address: email,
    status: 'subscribed',
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
    },
    tags: tags,
  };

  return await callMailchimp(`/lists/${listId}/members`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update a subscriber
 * @param {object} params - Subscriber details
 * @returns {Promise<object>} - Updated subscriber info
 */
export async function updateSubscriber({ listId, email, firstName, lastName, tags }) {
  const subscriberHash = await getSubscriberHash(email);

  const data = {
    email_address: email,
    merge_fields: {},
  };

  if (firstName) data.merge_fields.FNAME = firstName;
  if (lastName) data.merge_fields.LNAME = lastName;
  if (tags && tags.length > 0) data.tags = tags;

  return await callMailchimp(`/lists/${listId}/members/${subscriberHash}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Get subscriber info
 * @param {string} listId - List ID
 * @param {string} email - Subscriber email
 * @returns {Promise<object>} - Subscriber info
 */
export async function getSubscriber(listId, email) {
  const subscriberHash = await getSubscriberHash(email);
  return await callMailchimp(`/lists/${listId}/members/${subscriberHash}`);
}

/**
 * Get all members of a list
 * @param {string} listId - List ID
 * @param {number} count - Number of members to retrieve
 * @returns {Promise<array>} - Array of members
 */
export async function getListMembers(listId, count = 100) {
  const data = await callMailchimp(`/lists/${listId}/members?count=${count}`);
  return data.members || [];
}

/**
 * Create a campaign
 * @param {object} params - Campaign details
 * @returns {Promise<object>} - Campaign info
 */
export async function createCampaign({
  listId,
  subject,
  fromName,
  fromEmail,
  replyTo,
  title = 'New Campaign'
}) {
  const data = {
    type: 'regular',
    recipients: {
      list_id: listId,
    },
    settings: {
      subject_line: subject,
      title: title,
      from_name: fromName,
      reply_to: replyTo || fromEmail,
    },
  };

  return await callMailchimp('/campaigns', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Set campaign content
 * @param {string} campaignId - Campaign ID
 * @param {string} html - HTML content
 * @returns {Promise<object>} - Campaign content info
 */
export async function setCampaignContent(campaignId, html) {
  return await callMailchimp(`/campaigns/${campaignId}/content`, {
    method: 'PUT',
    body: JSON.stringify({ html }),
  });
}

/**
 * Send a campaign
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<object>} - Send result
 */
export async function sendCampaign(campaignId) {
  return await callMailchimp(`/campaigns/${campaignId}/actions/send`, {
    method: 'POST',
  });
}

/**
 * Get campaign reports
 * @param {number} count - Number of campaigns to retrieve
 * @returns {Promise<array>} - Array of campaign reports
 */
export async function getCampaignReports(count = 10) {
  const data = await callMailchimp(`/reports?count=${count}`);
  return data.reports || [];
}

/**
 * Get specific campaign report
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<object>} - Campaign report
 */
export async function getCampaignReport(campaignId) {
  return await callMailchimp(`/reports/${campaignId}`);
}

/**
 * Get account info
 * @returns {Promise<object>} - Account details
 */
export async function getAccountInfo() {
  return await callMailchimp('/');
}

/**
 * Get subscriber hash (MD5 of lowercase email)
 * @param {string} email - Email address
 * @returns {Promise<string>} - MD5 hash
 */
async function getSubscriberHash(email) {
  const msgBuffer = new TextEncoder().encode(email.toLowerCase());
  const hashBuffer = await crypto.subtle.digest('MD5', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if Mailchimp is configured
 * @returns {boolean}
 */
export function isMailchimpConfigured() {
  return Boolean(MAILCHIMP_API_KEY && SERVER_PREFIX);
}

/**
 * Get configuration status
 * @returns {object} - Configuration details
 */
export function getConfigStatus() {
  const hasApiKey = Boolean(MAILCHIMP_API_KEY);
  const hasServerPrefix = Boolean(SERVER_PREFIX);

  return {
    isConfigured: hasApiKey && hasServerPrefix,
    hasApiKey,
    hasServerPrefix,
    message: !hasApiKey
      ? 'API key not set. Add VITE_MAILCHIMP_API_KEY to .env file'
      : !hasServerPrefix
      ? 'Server prefix not set. Add VITE_MAILCHIMP_SERVER_PREFIX to .env file'
      : 'Mailchimp is ready to use!',
  };
}

/**
 * Get list stats
 * @param {string} listId - List ID
 * @returns {Promise<object>} - List statistics
 */
export async function getListStats(listId) {
  const list = await getList(listId);
  return {
    totalMembers: list.stats?.member_count || 0,
    subscribedMembers: list.stats?.member_count || 0,
    unsubscribedMembers: list.stats?.unsubscribe_count || 0,
    cleanedMembers: list.stats?.cleaned_count || 0,
    openRate: list.stats?.open_rate || 0,
    clickRate: list.stats?.click_rate || 0,
  };
}

// Example usage:
/*

import {
  getLists,
  addSubscriber,
  createCampaign,
  setCampaignContent,
  sendCampaign,
  getCampaignReports,
  isMailchimpConfigured
} from './integrations/mailchimp';

// Check if configured
if (!isMailchimpConfigured()) {
  console.log('Mailchimp needs to be configured first!');
}

// Get all lists
const lists = await getLists();
console.log('Your lists:', lists);

// Add a subscriber
const subscriber = await addSubscriber({
  listId: 'abc123',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  tags: ['customer', 'vip']
});

// Create a campaign
const campaign = await createCampaign({
  listId: 'abc123',
  subject: 'Welcome to our newsletter!',
  fromName: 'Your Company',
  fromEmail: 'hello@yourcompany.com',
  replyTo: 'support@yourcompany.com',
  title: 'Welcome Campaign'
});

// Set campaign content
await setCampaignContent(campaign.id, '<h1>Welcome!</h1><p>Thanks for subscribing.</p>');

// Send campaign
await sendCampaign(campaign.id);

// Get campaign reports
const reports = await getCampaignReports();
console.log('Campaign stats:', reports);

*/
