/**
 * Rytr.me Integration for Casey (AI Copywriter)
 *
 * This module handles all interactions with Rytr.me API.
 *
 * SETUP REQUIRED:
 * 1. Sign up at https://rytr.me
 * 2. Get API key from Account Settings > API Keys
 * 3. Add your API key to .env file as VITE_RYTR_API_KEY
 */

const RYTR_API_KEY = import.meta.env.VITE_RYTR_API_KEY || '';
const API_BASE_URL = 'https://api.rytr.me/v1';

// ============================================
// AVAILABLE USE CASES
// ============================================
// These are the use case IDs available in Rytr.me
// See full list at: https://rytr.me (login required)

const USE_CASES = {
  // Marketing & Ads
  productDescription: 'product_description',
  googleAd: 'google_ad',
  facebookAd: 'facebook_ad',
  linkedinAd: 'linkedin_ad',
  headline: 'headline',
  callToAction: 'call_to_action',

  // Social Media
  socialMediaPost: 'social_media_post',
  instagramCaption: 'instagram_caption',
  twitterPost: 'twitter_post',
  linkedinPost: 'linkedin_post',

  // Email
  emailSubject: 'email_subject',
  emailBody: 'email_body',
  coldEmail: 'cold_email',

  // Blog & SEO
  blogOutline: 'blog_outline',
  blogIntro: 'blog_intro',
  blogConclusion: 'blog_conclusion',
  metaDescription: 'meta_description',

  // Other
  creativeStory: 'creative_story',
  marketingCopy: 'marketing_copy',
};

// ============================================
// AVAILABLE TONES
// ============================================

const TONES = {
  casual: 'casual',
  professional: 'professional',
  friendly: 'friendly',
  luxury: 'luxury',
  urgent: 'urgent',
  relaxed: 'relaxed',
  confident: 'confident',
  funny: 'funny',
  inspirational: 'inspirational',
  persuasive: 'persuasive',
  empathetic: 'empathetic',
  formal: 'formal',
  bold: 'bold',
  adventurous: 'adventurous',
  witty: 'witty',
  thoughtful: 'thoughtful',
  warm: 'warm',
  playful: 'playful',
};

/**
 * Call Rytr.me API
 * @param {string} useCaseId - The use case ID
 * @param {object} inputContexts - Input context for the use case
 * @param {string} toneId - The tone to use
 * @param {number} variations - Number of variations to generate
 * @returns {Promise<object>} - API response
 */
async function callRytr(useCaseId, inputContexts, toneId = 'casual', variations = 1) {
  if (!RYTR_API_KEY) {
    throw new Error('Rytr.me API key not found. Set VITE_RYTR_API_KEY in .env file');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/ryte`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RYTR_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        languageId: 'en',
        toneId: toneId,
        useCaseId: useCaseId,
        inputContexts: inputContexts,
        variations: variations,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Rytr.me API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Rytr.me API error:', error);
    throw error;
  }
}

/**
 * Generate product description
 * @param {object} params - Product details
 * @returns {Promise<string>} - Generated product description
 */
export async function generateProductDescription({
  productName,
  features,
  targetAudience,
  tone = 'professional'
}) {
  const result = await callRytr(
    USE_CASES.productDescription,
    {
      PRODUCT_NAME: productName,
      PRODUCT_DESCRIPTION: features,
      TARGET_AUDIENCE: targetAudience,
    },
    tone
  );

  return result.data?.[0]?.text || '';
}

/**
 * Generate social media post
 * @param {object} params - Social post details
 * @returns {Promise<string>} - Generated social post
 */
export async function generateSocialPost({
  topic,
  platform = 'general',
  tone = 'casual',
  includeHashtags = true
}) {
  // Map platform to appropriate use case
  const useCaseMap = {
    instagram: USE_CASES.instagramCaption,
    twitter: USE_CASES.twitterPost,
    linkedin: USE_CASES.linkedinPost,
    facebook: USE_CASES.socialMediaPost,
    general: USE_CASES.socialMediaPost,
  };

  const useCase = useCaseMap[platform.toLowerCase()] || USE_CASES.socialMediaPost;

  const hashtagText = includeHashtags ? ' Include relevant hashtags.' : '';

  const result = await callRytr(
    useCase,
    {
      TOPIC: topic,
      ADDITIONAL_INFO: `Platform: ${platform}.${hashtagText}`,
    },
    tone
  );

  return result.data?.[0]?.text || '';
}

/**
 * Generate email subject lines
 * @param {object} params - Email details
 * @returns {Promise<string[]>} - Array of subject line variations
 */
export async function generateEmailSubjects({
  emailContent,
  goal = 'open',
  count = 5
}) {
  const result = await callRytr(
    USE_CASES.emailSubject,
    {
      EMAIL_CONTENT: emailContent,
      GOAL: `Optimize for ${goal} rate`,
    },
    'persuasive',
    count
  );

  return result.data?.map(item => item.text) || [];
}

/**
 * Generate ad copy
 * @param {object} params - Ad details
 * @returns {Promise<object>} - Headlines and descriptions
 */
export async function generateAdCopy({
  product,
  platform = 'google',
  cta = 'Shop Now',
  targetAudience
}) {
  // Map platform to appropriate use case
  const useCaseMap = {
    google: USE_CASES.googleAd,
    facebook: USE_CASES.facebookAd,
    instagram: USE_CASES.facebookAd,
    linkedin: USE_CASES.linkedinAd,
  };

  const useCase = useCaseMap[platform.toLowerCase()] || USE_CASES.googleAd;

  // Generate ad copy
  const adResult = await callRytr(
    useCase,
    {
      PRODUCT_NAME: product,
      TARGET_AUDIENCE: targetAudience,
      CALL_TO_ACTION: cta,
    },
    'persuasive',
    3
  );

  // Generate headlines separately
  const headlineResult = await callRytr(
    USE_CASES.headline,
    {
      TOPIC: product,
      CONTEXT: `For ${platform} ad targeting ${targetAudience}`,
    },
    'bold',
    3
  );

  return {
    headlines: headlineResult.data?.map(item => item.text) || [],
    descriptions: adResult.data?.map(item => item.text) || [],
    ctas: [cta], // Rytr doesn't generate CTAs separately, use provided one
  };
}

/**
 * Generate blog post outline
 * @param {object} params - Blog details
 * @returns {Promise<object>} - Structured outline
 */
export async function generateBlogOutline({
  topic,
  keywords = '',
  targetLength = 'medium',
  audience = 'general'
}) {
  const lengthGuide = {
    short: '500-800 words',
    medium: '1000-1500 words',
    long: '2000+ words',
  };

  const result = await callRytr(
    USE_CASES.blogOutline,
    {
      TOPIC: topic,
      KEYWORDS: keywords,
      TARGET_LENGTH: lengthGuide[targetLength] || '1000-1500 words',
      TARGET_AUDIENCE: audience,
    },
    'professional'
  );

  const outlineText = result.data?.[0]?.text || '';

  // Parse the outline text into structured format
  // Note: This is a simplified parser - actual structure depends on Rytr's output
  return {
    title: topic,
    outline: outlineText,
    targetLength: lengthGuide[targetLength],
  };
}

/**
 * Generate blog introduction
 * @param {object} params - Blog intro details
 * @returns {Promise<string>} - Generated introduction
 */
export async function generateBlogIntro({ topic, keywords = '', tone = 'professional' }) {
  const result = await callRytr(
    USE_CASES.blogIntro,
    {
      TOPIC: topic,
      KEYWORDS: keywords,
    },
    tone
  );

  return result.data?.[0]?.text || '';
}

/**
 * Generate SEO meta description
 * @param {object} params - Page details
 * @returns {Promise<string>} - Generated meta description
 */
export async function generateMetaDescription({ pageTitle, pageContent, keywords = '' }) {
  const result = await callRytr(
    USE_CASES.metaDescription,
    {
      PAGE_TITLE: pageTitle,
      PAGE_CONTENT: pageContent,
      KEYWORDS: keywords,
    },
    'professional'
  );

  return result.data?.[0]?.text || '';
}

/**
 * Generate marketing copy (general purpose)
 * @param {object} params - Copy details
 * @returns {Promise<string>} - Generated copy
 */
export async function generateMarketingCopy({
  purpose,
  context,
  tone = 'professional'
}) {
  const result = await callRytr(
    USE_CASES.marketingCopy,
    {
      PURPOSE: purpose,
      CONTEXT: context,
    },
    tone
  );

  return result.data?.[0]?.text || '';
}

/**
 * Check if Rytr.me is configured
 * @returns {boolean}
 */
export function isRytrConfigured() {
  return Boolean(RYTR_API_KEY);
}

/**
 * Get configuration status
 * @returns {object} - Configuration details
 */
export function getConfigStatus() {
  const hasApiKey = Boolean(RYTR_API_KEY);

  return {
    isConfigured: hasApiKey,
    hasApiKey,
    message: !hasApiKey
      ? 'API key not set. Add VITE_RYTR_API_KEY to .env file'
      : 'Rytr.me is ready to use!',
  };
}

/**
 * Get usage statistics from Rytr.me
 * @returns {Promise<object>} - Usage stats
 */
export async function getUsageStats() {
  if (!RYTR_API_KEY) {
    throw new Error('Rytr.me API key not found');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/usage`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RYTR_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get usage stats: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Rytr.me usage:', error);
    throw error;
  }
}

// Example usage:
/*

import {
  generateProductDescription,
  generateSocialPost,
  generateAdCopy,
  isRytrConfigured,
  getUsageStats
} from './integrations/rytr';

// Check if configured
if (!isRytrConfigured()) {
  console.log('Rytr.me needs to be configured first!');
  console.log('Get your API key from https://rytr.me');
}

// Generate product description
const description = await generateProductDescription({
  productName: 'Smart Watch Pro',
  features: 'Heart rate monitor, GPS, waterproof, 7-day battery',
  targetAudience: 'fitness enthusiasts',
  tone: 'energetic'
});

console.log(description);

// Generate social post for Instagram
const instagramPost = await generateSocialPost({
  topic: 'New product launch - Smart Watch Pro',
  platform: 'instagram',
  tone: 'excited',
  includeHashtags: true
});

console.log(instagramPost);

// Generate Google Ad copy
const adCopy = await generateAdCopy({
  product: 'Smart Watch Pro',
  platform: 'google',
  cta: 'Shop Now',
  targetAudience: 'fitness enthusiasts aged 25-45'
});

console.log('Headlines:', adCopy.headlines);
console.log('Descriptions:', adCopy.descriptions);

// Check usage
const usage = await getUsageStats();
console.log('Characters used this month:', usage.creditsUsed);
console.log('Characters remaining:', usage.creditsLeft);

*/
