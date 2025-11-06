/**
 * Google Analytics Integration for Analyzer (Data Analytics)
 *
 * This module handles Google Analytics 4 (GA4) tracking.
 *
 * SETUP REQUIRED:
 * 1. Create a Google Analytics 4 property at https://analytics.google.com
 * 2. Get your Measurement ID (format: G-XXXXXXXXXX)
 * 3. Add your tracking ID to .env file as VITE_GA_TRACKING_ID
 *
 * Note: This integration provides client-side tracking. For server-side
 * analytics reporting, you would need to set up OAuth and use the
 * Google Analytics Data API.
 */

const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || '';

/**
 * Initialize Google Analytics
 * @returns {boolean} - True if initialized successfully
 */
export function initializeGA() {
  if (!GA_TRACKING_ID) {
    console.warn('Google Analytics tracking ID not found');
    return false;
  }

  // Check if gtag is already loaded
  if (window.gtag) {
    return true;
  }

  try {
    // Load gtag.js script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID);

    return true;
  } catch (error) {
    console.error('Error initializing Google Analytics:', error);
    return false;
  }
}

/**
 * Track a page view
 * @param {string} path - Page path
 * @param {string} title - Page title
 */
export function trackPageView(path, title) {
  if (!window.gtag) {
    console.warn('Google Analytics not initialized');
    return;
  }

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
  });
}

/**
 * Track a custom event
 * @param {string} action - Event action
 * @param {object} params - Event parameters
 */
export function trackEvent(action, params = {}) {
  if (!window.gtag) {
    console.warn('Google Analytics not initialized');
    return;
  }

  window.gtag('event', action, params);
}

/**
 * Track a button click
 * @param {string} buttonName - Name of the button
 * @param {string} category - Event category
 */
export function trackButtonClick(buttonName, category = 'engagement') {
  trackEvent('click', {
    event_category: category,
    event_label: buttonName,
  });
}

/**
 * Track a form submission
 * @param {string} formName - Name of the form
 */
export function trackFormSubmission(formName) {
  trackEvent('form_submit', {
    event_category: 'engagement',
    event_label: formName,
  });
}

/**
 * Track user engagement time
 * @param {number} seconds - Engagement time in seconds
 */
export function trackEngagement(seconds) {
  trackEvent('user_engagement', {
    engagement_time_msec: seconds * 1000,
  });
}

/**
 * Track conversions
 * @param {string} conversionName - Name of the conversion
 * @param {number} value - Conversion value
 * @param {string} currency - Currency code (e.g., 'USD')
 */
export function trackConversion(conversionName, value = 0, currency = 'USD') {
  trackEvent('conversion', {
    event_category: 'conversion',
    event_label: conversionName,
    value: value,
    currency: currency,
  });
}

/**
 * Track e-commerce purchase
 * @param {object} params - Purchase parameters
 */
export function trackPurchase({ transactionId, value, currency = 'USD', items = [] }) {
  if (!window.gtag) return;

  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    items: items,
  });
}

/**
 * Track add to cart
 * @param {object} item - Item details
 */
export function trackAddToCart(item) {
  trackEvent('add_to_cart', {
    items: [item],
  });
}

/**
 * Set user properties
 * @param {object} properties - User properties
 */
export function setUserProperties(properties) {
  if (!window.gtag) return;

  window.gtag('set', 'user_properties', properties);
}

/**
 * Set user ID
 * @param {string} userId - User ID
 */
export function setUserId(userId) {
  if (!window.gtag) return;

  window.gtag('config', GA_TRACKING_ID, {
    user_id: userId,
  });
}

/**
 * Check if Google Analytics is configured
 * @returns {boolean}
 */
export function isGAConfigured() {
  return Boolean(GA_TRACKING_ID);
}

/**
 * Get configuration status
 * @returns {object} - Configuration details
 */
export function getConfigStatus() {
  const hasTrackingId = Boolean(GA_TRACKING_ID);
  const isInitialized = Boolean(window.gtag);

  return {
    isConfigured: hasTrackingId,
    isInitialized: isInitialized,
    trackingId: hasTrackingId ? GA_TRACKING_ID : null,
    message: !hasTrackingId
      ? 'Tracking ID not set. Add VITE_GA_TRACKING_ID to .env file'
      : !isInitialized
      ? 'Google Analytics configured but not initialized. Call initializeGA()'
      : 'Google Analytics is ready!',
  };
}

/**
 * Get simulated analytics data for demo purposes
 * This is a mock function - in production, you'd use the GA Data API
 */
export function getSimulatedAnalytics() {
  const today = new Date();
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    last7Days.push({
      date: date.toISOString().split('T')[0],
      pageViews: Math.floor(Math.random() * 500) + 100,
      users: Math.floor(Math.random() * 200) + 50,
      sessions: Math.floor(Math.random() * 250) + 75,
      bounceRate: (Math.random() * 30 + 40).toFixed(2),
      avgSessionDuration: Math.floor(Math.random() * 180) + 120,
    });
  }

  return {
    overview: {
      totalUsers: last7Days.reduce((sum, day) => sum + day.users, 0),
      totalPageViews: last7Days.reduce((sum, day) => sum + day.pageViews, 0),
      totalSessions: last7Days.reduce((sum, day) => sum + day.sessions, 0),
      avgBounceRate: (
        last7Days.reduce((sum, day) => sum + parseFloat(day.bounceRate), 0) / 7
      ).toFixed(2),
      avgSessionDuration: Math.floor(
        last7Days.reduce((sum, day) => sum + day.avgSessionDuration, 0) / 7
      ),
    },
    daily: last7Days,
    topPages: [
      { page: '/home', views: 1250, avgTime: 145 },
      { page: '/casey', views: 892, avgTime: 203 },
      { page: '/stats', views: 654, avgTime: 178 },
      { page: '/hunter', views: 432, avgTime: 156 },
      { page: '/sage', views: 321, avgTime: 189 },
    ],
    topSources: [
      { source: 'Direct', sessions: 450, percentage: 35 },
      { source: 'Google Search', sessions: 380, percentage: 30 },
      { source: 'Social Media', sessions: 256, percentage: 20 },
      { source: 'Referral', sessions: 192, percentage: 15 },
    ],
    devices: [
      { device: 'Desktop', percentage: 52 },
      { device: 'Mobile', percentage: 38 },
      { device: 'Tablet', percentage: 10 },
    ],
  };
}

/**
 * Format duration in seconds to readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration
 */
export function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

// Auto-initialize if tracking ID is configured
if (GA_TRACKING_ID && typeof window !== 'undefined') {
  initializeGA();
}

// Example usage:
/*

import {
  initializeGA,
  trackPageView,
  trackEvent,
  trackButtonClick,
  trackConversion,
  isGAConfigured
} from './integrations/google-analytics';

// Check if configured
if (!isGAConfigured()) {
  console.log('Google Analytics needs to be configured!');
}

// Initialize (usually in App.jsx or main entry point)
initializeGA();

// Track page view (in route changes)
trackPageView('/dashboard', 'Dashboard Page');

// Track button clicks
trackButtonClick('Sign Up Button', 'cta');

// Track custom events
trackEvent('video_play', {
  video_title: 'Product Demo',
  video_duration: 120
});

// Track conversions
trackConversion('Newsletter Signup', 0);

// Track purchases
trackPurchase({
  transactionId: 'T12345',
  value: 99.99,
  currency: 'USD',
  items: [
    {
      item_id: 'SKU123',
      item_name: 'Product Name',
      price: 99.99,
      quantity: 1
    }
  ]
});

// Set user properties
setUserProperties({
  user_type: 'premium',
  subscription_level: 'pro'
});

*/
