/**
 * Deployment Validation Script
 * Comprehensive automated testing for AI Presenter deployment
 * Tests: accessibility, functionality, performance, environment configuration
 */

import { chromium } from 'playwright';

// IMPORTANT: Configured for your Netlify deployment
// Site ID: 81ac201a-cab4-4e51-af43-37340b09d988
// Site Name: disruptors-pitch
// Repository: https://github.com/TechIntegrationLabs/disruptors-pitch-deck
const DEPLOYMENT_URL = process.env.DEPLOYMENT_URL || 'https://pitch.disruptorsmedia.com';
const TIMEOUT = 30000; // 30 seconds
const NETLIFY_SITE_ID = '81ac201a-cab4-4e51-af43-37340b09d988';

const results = {
  timestamp: new Date().toISOString(),
  deploymentUrl: DEPLOYMENT_URL,
  tests: [],
  summary: {
    passed: 0,
    failed: 0,
    warnings: 0,
    totalTests: 0,
  },
  issues: [],
  recommendations: [],
};

function logTest(name, status, message, details = null) {
  const test = { name, status, message, timestamp: new Date().toISOString() };
  if (details) test.details = details;

  results.tests.push(test);
  results.summary.totalTests++;

  if (status === 'pass') {
    results.summary.passed++;
    console.log(`✓ PASS: ${name} - ${message}`);
  } else if (status === 'fail') {
    results.summary.failed++;
    results.issues.push({ test: name, message, details });
    console.log(`✗ FAIL: ${name} - ${message}`);
  } else if (status === 'warn') {
    results.summary.warnings++;
    console.log(`⚠ WARN: ${name} - ${message}`);
  }
}

async function testDeploymentAccessibility(page) {
  console.log('\n=== Testing Deployment Accessibility ===');

  try {
    const response = await page.goto(DEPLOYMENT_URL, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT
    });

    if (!response) {
      logTest('Deployment Accessibility', 'fail', 'No response received from deployment URL');
      return false;
    }

    const status = response.status();

    if (status === 200) {
      logTest('Deployment Accessibility', 'pass', `Site accessible with status ${status}`);
      return true;
    } else if (status === 404) {
      logTest('Deployment Accessibility', 'fail', 'Site returns 404 - deployment may have failed or not yet deployed', { status });
      results.recommendations.push({
        priority: 'critical',
        issue: 'Deployment not accessible (404)',
        solution: 'Check Netlify dashboard for build errors. Verify deployment completed successfully.',
        steps: [
          `Visit https://app.netlify.com/sites/${NETLIFY_SITE_ID}/deploys`,
          'Check latest deployment status',
          'Review build logs for errors',
          'Verify build command and publish directory in netlify.toml',
          'Trigger new deployment: Deploys → Clear cache and deploy site'
        ]
      });
      return false;
    } else {
      logTest('Deployment Accessibility', 'fail', `Unexpected status code: ${status}`, { status });
      return false;
    }
  } catch (error) {
    logTest('Deployment Accessibility', 'fail', `Failed to access deployment: ${error.message}`, { error: error.toString() });

    if (error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
      results.recommendations.push({
        priority: 'critical',
        issue: 'DNS resolution failed',
        solution: 'Site may not exist or DNS is not configured',
        steps: [
          'Verify the Netlify site URL is correct',
          'Check if site was deleted or renamed',
          'Ensure deployment succeeded in Netlify dashboard'
        ]
      });
    }

    return false;
  }
}

async function testConfigDiagnosticPage(page) {
  console.log('\n=== Testing Config Diagnostic Page ===');

  try {
    const configUrl = `${DEPLOYMENT_URL}/config-test.html`;
    const response = await page.goto(configUrl, {
      waitUntil: 'networkidle',
      timeout: TIMEOUT
    });

    if (!response || response.status() !== 200) {
      logTest('Config Diagnostic Page', 'fail', `Diagnostic page not accessible (status: ${response?.status() || 'unknown'})`);
      return;
    }

    // Wait for page to load and execute
    await page.waitForTimeout(2000);

    // Check for environment variable status
    const envResults = await page.evaluate(() => {
      const envElements = document.querySelectorAll('#env-results .test-row');
      const results = [];

      envElements.forEach(row => {
        const label = row.querySelector('.test-label')?.textContent;
        const status = row.querySelector('.status')?.textContent;
        const value = row.querySelector('.test-value code')?.textContent;

        if (label && status) {
          results.push({ variable: label, status, valuePreview: value || 'N/A' });
        }
      });

      return results;
    });

    const overallStatus = await page.evaluate(() => {
      const alert = document.querySelector('#env-results .alert');
      return alert?.className.includes('alert-success') ? 'valid' : 'invalid';
    });

    if (overallStatus === 'valid') {
      logTest('Config Diagnostic Page', 'pass', 'All required environment variables present', { envResults });
    } else {
      logTest('Config Diagnostic Page', 'fail', 'Missing required environment variables', { envResults });

      const missingVars = envResults.filter(v => v.status === 'MISSING');
      if (missingVars.length > 0) {
        results.recommendations.push({
          priority: 'critical',
          issue: `Missing ${missingVars.length} required environment variable(s)`,
          solution: 'Configure environment variables in Netlify dashboard',
          missingVariables: missingVars.map(v => v.variable),
          steps: [
            'Log into Netlify dashboard: https://app.netlify.com',
            'Navigate to: Site Settings → Environment variables',
            'Add missing variables from .env.example',
            'Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY',
            'Trigger new deployment after adding variables'
          ]
        });
      }
    }

    // Check code version
    const versionInfo = await page.evaluate(() => {
      const versionElements = document.querySelectorAll('#version-results .test-row');
      const info = {};

      versionElements.forEach(row => {
        const key = row.querySelector('.test-label')?.textContent;
        const value = row.querySelector('.test-value')?.textContent;
        if (key && value) info[key] = value;
      });

      return info;
    });

    logTest('Code Version Detection', 'pass', 'Version information extracted', versionInfo);

  } catch (error) {
    logTest('Config Diagnostic Page', 'fail', `Error testing diagnostic page: ${error.message}`);
  }
}

async function testMainApplicationRoutes(page) {
  console.log('\n=== Testing Main Application Routes ===');

  const routes = [
    { path: '/', name: 'Home Page', critical: true },
    { path: '/Home', name: 'Home Route', critical: true },
    { path: '/Dashboard', name: 'Dashboard', critical: true },
    { path: '/Introduction', name: 'Introduction', critical: false },
    { path: '/Diagnostic', name: 'Diagnostic', critical: false },
    { path: '/admin', name: 'Admin Dashboard', critical: false },
  ];

  for (const route of routes) {
    try {
      const url = `${DEPLOYMENT_URL}${route.path}`;
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: TIMEOUT
      });

      if (response && response.status() === 200) {
        // Check for error boundaries or error messages
        const hasError = await page.evaluate(() => {
          const errorText = document.body.textContent || '';
          return errorText.includes('Missing Environment Variable') ||
                 errorText.includes('Configuration Error') ||
                 errorText.includes('Something went wrong');
        });

        if (hasError) {
          logTest(`Route: ${route.name}`, 'fail', 'Page loads but shows error message');
        } else {
          logTest(`Route: ${route.name}`, 'pass', `Route accessible at ${route.path}`);
        }
      } else {
        const severity = route.critical ? 'fail' : 'warn';
        logTest(`Route: ${route.name}`, severity, `Route returned status ${response?.status() || 'unknown'}`);
      }
    } catch (error) {
      const severity = route.critical ? 'fail' : 'warn';
      logTest(`Route: ${route.name}`, severity, `Error accessing route: ${error.message}`);
    }
  }
}

async function testPerformanceMetrics(page) {
  console.log('\n=== Testing Performance Metrics ===');

  try {
    await page.goto(DEPLOYMENT_URL, { waitUntil: 'networkidle', timeout: TIMEOUT });

    const performanceMetrics = await page.evaluate(() => {
      const timing = performance.timing;
      const navigation = performance.getEntriesByType('navigation')[0];

      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
        firstPaint: navigation?.fetchStart || 0,
        domInteractive: timing.domInteractive - timing.navigationStart,
      };
    });

    const dclTime = performanceMetrics.domContentLoaded;

    if (dclTime < 3000) {
      logTest('Performance: DOM Content Loaded', 'pass', `${dclTime}ms (excellent)`, performanceMetrics);
    } else if (dclTime < 5000) {
      logTest('Performance: DOM Content Loaded', 'warn', `${dclTime}ms (acceptable but could be improved)`, performanceMetrics);
    } else {
      logTest('Performance: DOM Content Loaded', 'fail', `${dclTime}ms (slow - optimization needed)`, performanceMetrics);
      results.recommendations.push({
        priority: 'medium',
        issue: 'Slow page load performance',
        solution: 'Optimize bundle size and implement code splitting',
        steps: [
          'Review Vite build output for large chunks (warning shown in build)',
          'Implement dynamic imports for heavy components',
          'Consider lazy loading routes with React.lazy()',
          'Optimize images and assets',
          'Enable compression and CDN caching'
        ]
      });
    }
  } catch (error) {
    logTest('Performance Metrics', 'warn', `Could not measure performance: ${error.message}`);
  }
}

async function testAssetLoading(page) {
  console.log('\n=== Testing Asset Loading ===');

  try {
    const failedRequests = [];

    page.on('requestfailed', request => {
      failedRequests.push({
        url: request.url(),
        error: request.failure()?.errorText,
      });
    });

    await page.goto(DEPLOYMENT_URL, { waitUntil: 'networkidle', timeout: TIMEOUT });

    if (failedRequests.length === 0) {
      logTest('Asset Loading', 'pass', 'All assets loaded successfully');
    } else {
      logTest('Asset Loading', 'fail', `${failedRequests.length} assets failed to load`, { failedRequests });
    }

    // Check for console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Wait a bit to catch console errors
    await page.waitForTimeout(3000);

    if (consoleErrors.length === 0) {
      logTest('Console Errors', 'pass', 'No JavaScript errors detected');
    } else {
      logTest('Console Errors', 'warn', `${consoleErrors.length} console errors detected`, { errors: consoleErrors });
    }

  } catch (error) {
    logTest('Asset Loading', 'warn', `Could not complete asset test: ${error.message}`);
  }
}

async function testSEOBasics(page) {
  console.log('\n=== Testing SEO Basics ===');

  try {
    await page.goto(DEPLOYMENT_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });

    const seoData = await page.evaluate(() => {
      return {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content,
        hasH1: !!document.querySelector('h1'),
        viewport: document.querySelector('meta[name="viewport"]')?.content,
        charset: document.querySelector('meta[charset]')?.getAttribute('charset'),
      };
    });

    if (seoData.title && seoData.title.length > 0) {
      logTest('SEO: Page Title', 'pass', `Title present: "${seoData.title}"`);
    } else {
      logTest('SEO: Page Title', 'fail', 'No page title found');
    }

    if (seoData.description) {
      logTest('SEO: Meta Description', 'pass', 'Meta description present');
    } else {
      logTest('SEO: Meta Description', 'warn', 'No meta description found');
    }

    if (seoData.hasH1) {
      logTest('SEO: H1 Tag', 'pass', 'H1 tag present on page');
    } else {
      logTest('SEO: H1 Tag', 'warn', 'No H1 tag found');
    }

  } catch (error) {
    logTest('SEO Basics', 'warn', `Could not complete SEO test: ${error.message}`);
  }
}

async function runAllTests() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   AI PRESENTER - DEPLOYMENT VALIDATION & RECOVERY SUITE   ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\nDeployment URL: ${DEPLOYMENT_URL}`);
  console.log(`Start Time: ${results.timestamp}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 DeploymentValidator/1.0',
  });
  const page = await context.newPage();

  try {
    // Phase 1: Critical deployment checks
    const isAccessible = await testDeploymentAccessibility(page);

    if (isAccessible) {
      // Phase 2: Configuration and functionality tests
      await testConfigDiagnosticPage(page);
      await testMainApplicationRoutes(page);

      // Phase 3: Performance and quality tests
      await testPerformanceMetrics(page);
      await testAssetLoading(page);
      await testSEOBasics(page);
    } else {
      console.log('\n⚠ Deployment not accessible - skipping remaining tests');
      results.recommendations.unshift({
        priority: 'critical',
        issue: 'Deployment failed or not accessible',
        solution: 'Immediate action required to restore deployment',
        steps: [
          `Check Netlify deployment status at: https://app.netlify.com/sites/${NETLIFY_SITE_ID}`,
          'Review build logs for errors',
          'Verify git push was successful',
          'Check if build command completed successfully',
          'Ensure all required environment variables are set',
          'Try manual deployment: git push origin main --force (if needed)',
          'Consider rollback to previous working deployment if critical'
        ]
      });
    }
  } catch (error) {
    console.error('\n✗ Critical error during testing:', error);
    results.issues.push({
      test: 'Test Suite Execution',
      message: 'Unexpected error during test execution',
      details: error.toString()
    });
  } finally {
    await browser.close();
  }

  // Generate final report
  generateReport();
}

function generateReport() {
  console.log('\n\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                    VALIDATION REPORT                       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const { passed, failed, warnings, totalTests } = results.summary;
  const successRate = totalTests > 0 ? ((passed / totalTests) * 100).toFixed(1) : 0;

  console.log('SUMMARY:');
  console.log(`  Total Tests:     ${totalTests}`);
  console.log(`  Passed:          ${passed} ✓`);
  console.log(`  Failed:          ${failed} ✗`);
  console.log(`  Warnings:        ${warnings} ⚠`);
  console.log(`  Success Rate:    ${successRate}%`);

  // Deployment health score
  let healthScore = 100;
  healthScore -= (failed * 10);
  healthScore -= (warnings * 3);
  healthScore = Math.max(0, healthScore);

  console.log(`  Health Score:    ${healthScore}/100`);

  let healthStatus = 'EXCELLENT';
  if (healthScore < 95) healthStatus = 'GOOD';
  if (healthScore < 80) healthStatus = 'FAIR';
  if (healthScore < 60) healthStatus = 'POOR';
  if (healthScore < 40) healthStatus = 'CRITICAL';

  console.log(`  Overall Status:  ${healthStatus}\n`);

  // Issues
  if (results.issues.length > 0) {
    console.log('ISSUES DETECTED:');
    results.issues.forEach((issue, index) => {
      console.log(`  ${index + 1}. [${issue.test}] ${issue.message}`);
    });
    console.log('');
  }

  // Recommendations
  if (results.recommendations.length > 0) {
    console.log('RECOMMENDATIONS:');
    results.recommendations.forEach((rec, index) => {
      console.log(`\n  ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.issue}`);
      console.log(`     Solution: ${rec.solution}`);
      if (rec.steps) {
        console.log('     Steps:');
        rec.steps.forEach((step, i) => {
          console.log(`       ${i + 1}. ${step}`);
        });
      }
      if (rec.missingVariables) {
        console.log(`     Missing: ${rec.missingVariables.join(', ')}`);
      }
    });
    console.log('');
  }

  // Save report to file
  const reportPath = 'deployment-validation-report.json';
  const fs = require('fs');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nDetailed report saved to: ${reportPath}`);

  // Exit code based on critical failures
  const criticalFailures = results.recommendations.filter(r => r.priority === 'critical').length;
  if (criticalFailures > 0) {
    console.log(`\n⚠ WARNING: ${criticalFailures} critical issue(s) detected - immediate action required!`);
    process.exit(1);
  } else if (failed > 0) {
    console.log(`\n⚠ ${failed} test(s) failed - review and fix issues`);
    process.exit(1);
  } else {
    console.log('\n✓ All tests passed - deployment is healthy!');
    process.exit(0);
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
