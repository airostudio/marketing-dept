#!/usr/bin/env node

/**
 * API Key Verification Script
 * Verifies all configured AI API keys are valid and working
 */

const https = require('https');
const http = require('http');

// API Keys to verify
const apiKeys = {
  rytr: process.env.RYTR_API_KEY || '90ECPFOACTFO2KE2LPHZR',
  hunter: '4f87decfcf8cce273a9d752c1252b853f24b8fe1',
  googleAnalytics: 'G-RBDJ4G0LGN'
};

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'http:' ? http : https;
    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => reject(error));

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function verifyRytrAPI(apiKey) {
  log('\n🔍 Verifying Rytr API Key...', 'cyan');

  try {
    // Rytr API endpoint
    const response = await makeRequest({
      hostname: 'api.rytr.me',
      path: '/v1/account',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.statusCode === 200) {
      const data = JSON.parse(response.body);
      log('✅ Rytr API Key: VALID', 'green');
      log(`   Account: ${data.email || 'N/A'}`, 'blue');
      log(`   Credits: ${data.credits || 'N/A'}`, 'blue');
      return { valid: true, service: 'Rytr', details: data };
    } else if (response.statusCode === 401) {
      log('❌ Rytr API Key: INVALID (Unauthorized)', 'red');
      return { valid: false, service: 'Rytr', error: 'Unauthorized' };
    } else {
      log(`⚠️  Rytr API Key: Status ${response.statusCode}`, 'yellow');
      return { valid: false, service: 'Rytr', error: `HTTP ${response.statusCode}` };
    }
  } catch (error) {
    log(`❌ Rytr API Key: ERROR - ${error.message}`, 'red');
    return { valid: false, service: 'Rytr', error: error.message };
  }
}

async function verifyHunterAPI(apiKey) {
  log('\n🔍 Verifying Hunter.io API Key...', 'cyan');

  try {
    // Hunter.io API endpoint - using account info endpoint
    const response = await makeRequest({
      hostname: 'api.hunter.io',
      path: `/v2/account?api_key=${apiKey}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.statusCode === 200) {
      const data = JSON.parse(response.body);
      if (data.data) {
        log('✅ Hunter.io API Key: VALID', 'green');
        log(`   Email: ${data.data.email || 'N/A'}`, 'blue');
        log(`   Plan: ${data.data.plan_name || 'Free'}`, 'blue');
        log(`   Requests: ${data.data.requests?.searches?.used || 0}/${data.data.requests?.searches?.available || 0}`, 'blue');
        return { valid: true, service: 'Hunter.io', details: data.data };
      } else {
        log('⚠️  Hunter.io API Key: Unexpected response', 'yellow');
        return { valid: false, service: 'Hunter.io', error: 'Unexpected response format' };
      }
    } else if (response.statusCode === 401) {
      log('❌ Hunter.io API Key: INVALID (Unauthorized)', 'red');
      return { valid: false, service: 'Hunter.io', error: 'Unauthorized' };
    } else {
      log(`⚠️  Hunter.io API Key: Status ${response.statusCode}`, 'yellow');
      return { valid: false, service: 'Hunter.io', error: `HTTP ${response.statusCode}` };
    }
  } catch (error) {
    log(`❌ Hunter.io API Key: ERROR - ${error.message}`, 'red');
    return { valid: false, service: 'Hunter.io', error: error.message };
  }
}

function verifyGoogleAnalytics(measurementId) {
  log('\n🔍 Verifying Google Analytics Measurement ID...', 'cyan');

  // GA4 measurement IDs should start with G-
  if (measurementId.match(/^G-[A-Z0-9]+$/)) {
    log('✅ Google Analytics ID: VALID FORMAT', 'green');
    log(`   Measurement ID: ${measurementId}`, 'blue');
    log('   Note: Cannot verify without credentials/property access', 'yellow');
    return { valid: true, service: 'Google Analytics', details: { format: 'valid', id: measurementId } };
  } else {
    log('❌ Google Analytics ID: INVALID FORMAT', 'red');
    return { valid: false, service: 'Google Analytics', error: 'Invalid format' };
  }
}

async function main() {
  log('\n═══════════════════════════════════════════════════════', 'blue');
  log('   AI Marketing Department - API Key Verification', 'blue');
  log('═══════════════════════════════════════════════════════\n', 'blue');

  const results = [];

  // Verify Rytr API
  results.push(await verifyRytrAPI(apiKeys.rytr));

  // Verify Hunter.io API
  results.push(await verifyHunterAPI(apiKeys.hunter));

  // Verify Google Analytics
  results.push(verifyGoogleAnalytics(apiKeys.googleAnalytics));

  // Summary
  log('\n═══════════════════════════════════════════════════════', 'blue');
  log('   Verification Summary', 'blue');
  log('═══════════════════════════════════════════════════════\n', 'blue');

  const validKeys = results.filter(r => r.valid).length;
  const totalKeys = results.length;

  log(`Total Keys Checked: ${totalKeys}`, 'cyan');
  log(`Valid Keys: ${validKeys}`, 'green');
  log(`Invalid Keys: ${totalKeys - validKeys}`, validKeys === totalKeys ? 'green' : 'red');

  results.forEach(result => {
    const status = result.valid ? '✅ LIVE' : '❌ FAILED';
    const color = result.valid ? 'green' : 'red';
    log(`\n${result.service}: ${status}`, color);
    if (result.error) {
      log(`  Error: ${result.error}`, 'red');
    }
  });

  log('\n═══════════════════════════════════════════════════════\n', 'blue');

  // Exit with appropriate code
  process.exit(validKeys === totalKeys ? 0 : 1);
}

main();
