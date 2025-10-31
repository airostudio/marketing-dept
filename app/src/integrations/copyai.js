/**
 * Copy.ai Integration for Casey (AI Copywriter)
 *
 * This module handles all interactions with Copy.ai workflows.
 *
 * SETUP REQUIRED:
 * 1. Set up workflows in Copy.ai (see docs/setup/COPYAI_WORKFLOWS_GUIDE.md)
 * 2. Get workflow IDs from your Copy.ai account
 * 3. Add your API key to .env file
 */

const COPYAI_API_KEY = process.env.COPYAI_API_KEY || '';
const API_BASE_URL = 'https://api.copy.ai/api';

// ============================================
// WORKFLOW IDS - YOU NEED TO FILL THESE IN!
// ============================================
// Get these from your Copy.ai workflows
// See: docs/setup/COPYAI_WORKFLOWS_GUIDE.md

const WORKFLOW_IDS = {
  productDescription: 'wf_REPLACE_WITH_YOUR_WORKFLOW_ID',
  socialPost: 'wf_REPLACE_WITH_YOUR_WORKFLOW_ID',
  emailSubject: 'wf_REPLACE_WITH_YOUR_WORKFLOW_ID',
  adCopy: 'wf_REPLACE_WITH_YOUR_WORKFLOW_ID',
  blogOutline: 'wf_REPLACE_WITH_YOUR_WORKFLOW_ID',
};

/**
 * Run a Copy.ai workflow
 * @param {string} workflowId - The workflow ID from Copy.ai
 * @param {object} inputs - Input variables for the workflow
 * @returns {Promise<object>} - Workflow results
 */
async function runWorkflow(workflowId, inputs) {
  if (!COPYAI_API_KEY) {
    throw new Error('Copy.ai API key not found. Set COPYAI_API_KEY in .env file');
  }

  if (workflowId.includes('REPLACE')) {
    throw new Error(
      'Workflow ID not configured. Please set up workflows in Copy.ai and update WORKFLOW_IDS'
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/workflow/${workflowId}`, {
      method: 'POST',
      headers: {
        'x-copy-ai-api-key': COPYAI_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startVariables: inputs,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Copy.ai API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Copy.ai workflow error:', error);
    throw error;
  }
}

/**
 * Generate product description
 * @param {object} params - Product details
 * @returns {Promise<string>} - Generated product description
 */
export async function generateProductDescription({ productName, features, targetAudience, tone = 'professional' }) {
  const result = await runWorkflow(WORKFLOW_IDS.productDescription, {
    productName,
    features,
    targetAudience,
    tone,
  });

  return result.output?.generatedCopy || result.output;
}

/**
 * Generate social media post
 * @param {object} params - Social post details
 * @returns {Promise<string>} - Generated social post
 */
export async function generateSocialPost({ topic, platform, tone = 'casual', includeHashtags = true }) {
  const result = await runWorkflow(WORKFLOW_IDS.socialPost, {
    topic,
    platform, // 'instagram', 'twitter', 'linkedin', 'facebook'
    tone,
    includeHashtags,
  });

  return result.output?.generatedCopy || result.output;
}

/**
 * Generate email subject lines
 * @param {object} params - Email details
 * @returns {Promise<string[]>} - Array of subject line variations
 */
export async function generateEmailSubjects({ emailContent, goal, count = 5 }) {
  const result = await runWorkflow(WORKFLOW_IDS.emailSubject, {
    emailContent,
    goal, // 'open', 'click', 'purchase'
    count,
  });

  return result.output?.subjectLines || [result.output];
}

/**
 * Generate ad copy
 * @param {object} params - Ad details
 * @returns {Promise<object>} - Headlines, descriptions, and CTAs
 */
export async function generateAdCopy({ product, platform, cta, targetAudience }) {
  const result = await runWorkflow(WORKFLOW_IDS.adCopy, {
    product,
    platform, // 'google', 'facebook', 'instagram', 'linkedin'
    cta,
    targetAudience,
  });

  return {
    headlines: result.output?.headlines || [],
    descriptions: result.output?.descriptions || [],
    ctas: result.output?.ctas || [],
  };
}

/**
 * Generate blog post outline
 * @param {object} params - Blog details
 * @returns {Promise<object>} - Structured outline
 */
export async function generateBlogOutline({ topic, keywords, targetLength, audience }) {
  const result = await runWorkflow(WORKFLOW_IDS.blogOutline, {
    topic,
    keywords,
    targetLength, // 'short' (500-800), 'medium' (1000-1500), 'long' (2000+)
    audience,
  });

  return {
    title: result.output?.title,
    introduction: result.output?.introduction,
    sections: result.output?.sections || [],
    conclusion: result.output?.conclusion,
  };
}

/**
 * Check if Copy.ai is configured
 * @returns {boolean}
 */
export function isCopyAiConfigured() {
  return Boolean(
    COPYAI_API_KEY &&
    !WORKFLOW_IDS.productDescription.includes('REPLACE')
  );
}

/**
 * Get configuration status
 * @returns {object} - Configuration details
 */
export function getConfigStatus() {
  const hasApiKey = Boolean(COPYAI_API_KEY);
  const workflowsConfigured = !WORKFLOW_IDS.productDescription.includes('REPLACE');

  return {
    isConfigured: hasApiKey && workflowsConfigured,
    hasApiKey,
    workflowsConfigured,
    message: !hasApiKey
      ? 'API key not set. Add COPYAI_API_KEY to .env file'
      : !workflowsConfigured
      ? 'Workflow IDs not configured. Update WORKFLOW_IDS in copyai.js'
      : 'Copy.ai is ready to use!',
  };
}

// Example usage:
/*

import {
  generateProductDescription,
  generateSocialPost,
  isCopyAiConfigured
} from './integrations/copyai';

// Check if configured
if (!isCopyAiConfigured()) {
  console.log('Copy.ai needs to be configured first!');
}

// Generate product description
const description = await generateProductDescription({
  productName: 'Smart Watch Pro',
  features: 'Heart rate monitor, GPS, waterproof, 7-day battery',
  targetAudience: 'fitness enthusiasts',
  tone: 'energetic'
});

console.log(description);

// Generate social post
const instagramPost = await generateSocialPost({
  topic: 'New product launch',
  platform: 'instagram',
  tone: 'excited',
  includeHashtags: true
});

console.log(instagramPost);

*/
