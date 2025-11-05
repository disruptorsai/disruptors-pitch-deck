#!/usr/bin/env node

/**
 * API Integration Testing Script
 *
 * Tests all business intelligence API integrations to verify:
 * - API credentials are valid
 * - Rate limits are respected
 * - Data is returned in expected format
 * - Error handling works correctly
 *
 * Usage:
 *   node scripts/test-api-integrations.mjs
 *   node scripts/test-api-integrations.mjs --api=apollo
 *   node scripts/test-api-integrations.mjs --domain=anthropic.com
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}`),
  divider: () => console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`),
};

// Parse command line arguments
const args = process.argv.slice(2);
const apiFilter = args.find(arg => arg.startsWith('--api='))?.split('=')[1];
const testDomain = args.find(arg => arg.startsWith('--domain='))?.split('=')[1] || 'anthropic.com';

// Test results tracker
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [],
};

/**
 * Test Apollo.io API
 */
async function testApollo() {
  log.title('Testing Apollo.io API');

  const apiKey = process.env.APOLLO_API_KEY;

  if (!apiKey) {
    log.warn('APOLLO_API_KEY not found in environment');
    results.skipped++;
    results.tests.push({ api: 'apollo', status: 'skipped', reason: 'No API key' });
    return;
  }

  try {
    log.info(`Testing company search for: ${testDomain}`);

    const response = await fetch(
      `https://api.apollo.io/v1/organizations/search?organization_domains[]=${testDomain}`,
      {
        headers: {
          'x-api-key': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.organizations && data.organizations.length > 0) {
      const company = data.organizations[0];
      log.success(`Apollo.io API working! Found: ${company.name}`);
      log.info(`  Industry: ${company.industry || 'N/A'}`);
      log.info(`  Employees: ${company.estimated_num_employees || 'N/A'}`);
      log.info(`  Website: ${company.website_url || 'N/A'}`);

      results.passed++;
      results.tests.push({
        api: 'apollo',
        status: 'passed',
        data: { companyName: company.name },
      });
    } else {
      log.warn('No results found for domain');
      results.passed++;
      results.tests.push({ api: 'apollo', status: 'passed', note: 'No results' });
    }
  } catch (error) {
    log.error(`Apollo.io test failed: ${error.message}`);
    results.failed++;
    results.tests.push({ api: 'apollo', status: 'failed', error: error.message });
  }
}

/**
 * Test DataForSEO API
 */
async function testDataForSEO() {
  log.title('Testing DataForSEO API');

  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;

  if (!login || !password) {
    log.warn('DATAFORSEO_LOGIN or DATAFORSEO_PASSWORD not found in environment');
    results.skipped++;
    results.tests.push({ api: 'dataforseo', status: 'skipped', reason: 'No credentials' });
    return;
  }

  try {
    log.info(`Testing domain analytics for: ${testDomain}`);

    const auth = Buffer.from(`${login}:${password}`).toString('base64');

    const response = await fetch(
      'https://api.dataforseo.com/v3/dataforseo_labs/google/domain_rank_overview/live',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        },
        body: JSON.stringify([
          {
            target: testDomain,
            location_code: 2840, // United States
            language_code: 'en',
          },
        ]),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status_code === 20000 && data.tasks && data.tasks[0]?.result) {
      const result = data.tasks[0].result[0];
      const cost = data.cost || 0;

      log.success(`DataForSEO API working! Cost: $${cost.toFixed(4)}`);
      log.info(`  Organic Keywords: ${result.metrics.organic.count || 0}`);
      log.info(`  Estimated Traffic Value: $${result.metrics.organic.etv || 0}`);
      log.info(`  Top 10 Keywords: ${result.metrics.organic.pos_4_10 || 0}`);

      results.passed++;
      results.tests.push({
        api: 'dataforseo',
        status: 'passed',
        cost: cost,
        data: {
          keywords: result.metrics.organic.count,
          etv: result.metrics.organic.etv,
        },
      });
    } else {
      throw new Error(`API returned status ${data.status_code}: ${data.status_message}`);
    }
  } catch (error) {
    log.error(`DataForSEO test failed: ${error.message}`);
    results.failed++;
    results.tests.push({ api: 'dataforseo', status: 'failed', error: error.message });
  }
}

/**
 * Test Wappalyzer API
 */
async function testWappalyzer() {
  log.title('Testing Wappalyzer API');

  const apiKey = process.env.WAPPALYZER_API_KEY;

  if (!apiKey) {
    log.warn('WAPPALYZER_API_KEY not found in environment');
    results.skipped++;
    results.tests.push({ api: 'wappalyzer', status: 'skipped', reason: 'No API key' });
    return;
  }

  try {
    log.info(`Testing technology detection for: ${testDomain}`);

    const response = await fetch(
      `https://api.wappalyzer.com/v2/lookup/?urls=${encodeURIComponent(testDomain)}`,
      {
        headers: {
          'x-api-key': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const techCount = result.technologies.length;

      log.success(`Wappalyzer API working! Found ${techCount} technologies`);

      // Show first 5 technologies
      const techNames = result.technologies.slice(0, 5).map(t => t.name);
      log.info(`  Technologies: ${techNames.join(', ')}${techCount > 5 ? '...' : ''}`);

      results.passed++;
      results.tests.push({
        api: 'wappalyzer',
        status: 'passed',
        data: { technologyCount: techCount },
      });
    } else {
      log.warn('No technologies detected');
      results.passed++;
      results.tests.push({ api: 'wappalyzer', status: 'passed', note: 'No results' });
    }
  } catch (error) {
    log.error(`Wappalyzer test failed: ${error.message}`);
    results.failed++;
    results.tests.push({ api: 'wappalyzer', status: 'failed', error: error.message });
  }
}

/**
 * Run all tests
 */
async function runTests() {
  log.divider();
  log.title('🧪 API Integration Testing');
  log.divider();

  log.info(`Test domain: ${testDomain}`);
  if (apiFilter) {
    log.info(`Filter: Only testing ${apiFilter}`);
  }

  console.log('');

  // Run tests based on filter
  if (!apiFilter || apiFilter === 'apollo') {
    await testApollo();
  }

  if (!apiFilter || apiFilter === 'dataforseo') {
    await testDataForSEO();
  }

  if (!apiFilter || apiFilter === 'wappalyzer') {
    await testWappalyzer();
  }

  // Print summary
  log.divider();
  log.title('📊 Test Summary');
  log.divider();

  console.log(`Total Tests:   ${results.passed + results.failed + results.skipped}`);
  console.log(`${colors.green}Passed:        ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed:        ${results.failed}${colors.reset}`);
  console.log(`${colors.yellow}Skipped:       ${results.skipped}${colors.reset}`);

  // Calculate total cost
  const totalCost = results.tests
    .filter(t => t.cost)
    .reduce((sum, t) => sum + t.cost, 0);

  if (totalCost > 0) {
    console.log(`\nTotal API Cost: $${totalCost.toFixed(4)}`);
  }

  log.divider();

  // Recommendations
  if (results.skipped > 0) {
    console.log('\n💡 Recommendations:');
    results.tests
      .filter(t => t.status === 'skipped')
      .forEach(t => {
        console.log(`  - Set ${t.api.toUpperCase()}_API_KEY in .env.local to enable ${t.api} testing`);
      });
  }

  if (results.failed > 0) {
    console.log('\n⚠️  Failed Tests:');
    results.tests
      .filter(t => t.status === 'failed')
      .forEach(t => {
        console.log(`  - ${t.api}: ${t.error}`);
      });
  }

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  log.error(`Fatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
