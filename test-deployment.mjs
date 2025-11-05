/**
 * Deployment Validation Test for AI Presenter Personalization System
 * Tests pitch.disruptorsmedia.com for functionality, performance, and errors
 */

import { chromium } from 'playwright';
import { performance } from 'perf_hooks';

const SITE_URL = 'https://pitch.disruptorsmedia.com';
const TEST_TIMEOUT = 30000;

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  log('\n' + '='.repeat(80), colors.cyan);
  log(`  ${title}`, colors.cyan);
  log('='.repeat(80), colors.cyan);
}

function logSuccess(message) {
  log(`✓ ${message}`, colors.green);
}

function logError(message) {
  log(`✗ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ ${message}`, colors.blue);
}

const results = {
  passed: [],
  failed: [],
  warnings: [],
  performance: {},
  consoleErrors: [],
  networkErrors: [],
};

async function testDeployment() {
  let browser;
  let context;
  let page;

  try {
    logSection('DEPLOYMENT VALIDATION - AI PRESENTER PERSONALIZATION SYSTEM');
    logInfo(`Testing: ${SITE_URL}`);
    logInfo(`Timestamp: ${new Date().toISOString()}`);

    // Launch browser
    log('\nLaunching browser...');
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Deployment-Validator/1.0',
    });

    page = await context.newPage();

    // Capture console messages
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        results.consoleErrors.push(text);
        logError(`Console Error: ${text}`);
      } else if (type === 'warning') {
        results.warnings.push(text);
        logWarning(`Console Warning: ${text}`);
      }
    });

    // Capture network errors
    page.on('requestfailed', (request) => {
      const failure = `${request.url()} - ${request.failure().errorText}`;
      results.networkErrors.push(failure);
      logError(`Network Error: ${failure}`);
    });

    // ===================================================================
    // TEST 1: Site Accessibility & Initial Load
    // ===================================================================
    logSection('TEST 1: Site Accessibility & Initial Load');

    const startTime = performance.now();
    try {
      const response = await page.goto(SITE_URL, {
        waitUntil: 'networkidle',
        timeout: TEST_TIMEOUT,
      });

      const loadTime = performance.now() - startTime;
      results.performance.initialLoad = loadTime;

      if (response && response.ok()) {
        logSuccess(`Site loaded successfully (${response.status()})`);
        logInfo(`Load time: ${loadTime.toFixed(2)}ms`);
        results.passed.push('Site accessibility');
      } else {
        logError(`Site returned status: ${response?.status() || 'unknown'}`);
        results.failed.push('Site accessibility');
      }
    } catch (error) {
      logError(`Failed to load site: ${error.message}`);
      results.failed.push('Site accessibility');
      throw error;
    }

    // ===================================================================
    // TEST 2: Page Title & Meta Tags
    // ===================================================================
    logSection('TEST 2: Page Title & Meta Tags');

    const title = await page.title();
    logInfo(`Page title: ${title}`);

    if (title && title.length > 0) {
      logSuccess('Page title present');
      results.passed.push('Page title');
    } else {
      logError('Page title missing');
      results.failed.push('Page title');
    }

    // ===================================================================
    // TEST 3: React Application Bootstrap
    // ===================================================================
    logSection('TEST 3: React Application Bootstrap');

    try {
      // Wait for React root to render
      await page.waitForSelector('#root', { timeout: 5000 });
      logSuccess('React root element found');
      results.passed.push('React bootstrap');

      // Check if content is rendered
      const rootContent = await page.textContent('#root');
      if (rootContent && rootContent.trim().length > 0) {
        logSuccess('React app rendered content');
        logInfo(`Content length: ${rootContent.trim().length} characters`);
        results.passed.push('React content rendering');
      } else {
        logWarning('React root found but appears empty');
        results.warnings.push('Empty React root');
      }
    } catch (error) {
      logError(`React bootstrap failed: ${error.message}`);
      results.failed.push('React bootstrap');
    }

    // ===================================================================
    // TEST 4: Personalization Engine Initialization
    // ===================================================================
    logSection('TEST 4: Personalization Engine Initialization');

    try {
      // Check if presentation-personalizer module loaded
      const personalizationCheck = await page.evaluate(() => {
        return {
          hasPersonalizer: typeof window.PresentationPersonalizer !== 'undefined',
          hasBusinessAnalyzer: typeof window.BusinessAnalyzer !== 'undefined',
          reactQueryActive: typeof window.__REACT_QUERY_DEVTOOLS__ !== 'undefined' ||
                           document.querySelectorAll('[data-rq]').length > 0,
        };
      });

      if (personalizationCheck.reactQueryActive) {
        logSuccess('React Query active (data fetching layer working)');
        results.passed.push('React Query initialization');
      } else {
        logInfo('React Query devtools not detected (normal in production)');
      }

      // Check for personalization-related elements
      const personalizationElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('[data-personalized], [data-ai-generated]');
        return {
          count: elements.length,
          types: Array.from(elements).map(el => el.getAttribute('data-personalized') || el.getAttribute('data-ai-generated')),
        };
      });

      if (personalizationElements.count > 0) {
        logSuccess(`Found ${personalizationElements.count} personalized elements`);
        logInfo(`Types: ${personalizationElements.types.join(', ')}`);
        results.passed.push('Personalization elements present');
      } else {
        logWarning('No personalized elements detected (may require active client)');
        results.warnings.push('No personalized elements');
      }
    } catch (error) {
      logError(`Personalization check failed: ${error.message}`);
      results.failed.push('Personalization engine');
    }

    // ===================================================================
    // TEST 5: Home Page Navigation & Content
    // ===================================================================
    logSection('TEST 5: Home Page Navigation & Content');

    try {
      // Check if we're on a presentation page or need to navigate
      const currentUrl = page.url();
      logInfo(`Current URL: ${currentUrl}`);

      // Look for navigation elements
      const navCheck = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href]'));
        return {
          totalLinks: links.length,
          internalLinks: links.filter(a => a.href.startsWith(window.location.origin)).length,
          homeLink: links.find(a => a.href.includes('/home') || a.textContent.toLowerCase().includes('home')),
        };
      });

      logInfo(`Found ${navCheck.totalLinks} links (${navCheck.internalLinks} internal)`);

      if (navCheck.totalLinks > 0) {
        logSuccess('Navigation links present');
        results.passed.push('Navigation elements');
      } else {
        logWarning('No navigation links found');
        results.warnings.push('Missing navigation');
      }

      // Try to find home page content indicators
      const homeContent = await page.evaluate(() => {
        const bodyText = document.body.textContent;
        const hasWelcome = /welcome|introduction|get started/i.test(bodyText);
        const hasHeading = document.querySelector('h1, h2') !== null;
        return { hasWelcome, hasHeading, bodyTextLength: bodyText.length };
      });

      if (homeContent.hasHeading) {
        logSuccess('Page has heading structure');
        results.passed.push('Content structure');
      }

      logInfo(`Page content length: ${homeContent.bodyTextLength} characters`);

    } catch (error) {
      logError(`Home page test failed: ${error.message}`);
      results.failed.push('Home page content');
    }

    // ===================================================================
    // TEST 6: Blueprint Page (AI Recommendations)
    // ===================================================================
    logSection('TEST 6: Blueprint Page (AI Recommendations)');

    try {
      // Try to navigate to blueprint page
      const blueprintUrl = `${SITE_URL}/blueprint`;
      logInfo(`Navigating to: ${blueprintUrl}`);

      const blueprintResponse = await page.goto(blueprintUrl, {
        waitUntil: 'networkidle',
        timeout: 15000,
      });

      if (blueprintResponse && blueprintResponse.ok()) {
        logSuccess('Blueprint page accessible');
        results.passed.push('Blueprint page access');

        // Check for blueprint-specific content
        const blueprintCheck = await page.evaluate(() => {
          const bodyText = document.body.textContent;
          const hasBlueprint = /blueprint|roadmap|strategy|recommendation/i.test(bodyText);
          const hasAIContent = /ai|generated|personalized|analysis/i.test(bodyText);
          return { hasBlueprint, hasAIContent };
        });

        if (blueprintCheck.hasBlueprint || blueprintCheck.hasAIContent) {
          logSuccess('Blueprint page contains relevant content');
          results.passed.push('Blueprint content');
        } else {
          logWarning('Blueprint page loaded but content unclear');
          results.warnings.push('Blueprint content verification');
        }
      } else {
        logWarning(`Blueprint page returned status: ${blueprintResponse?.status() || 'unknown'}`);
        results.warnings.push('Blueprint page status');
      }
    } catch (error) {
      logError(`Blueprint page test failed: ${error.message}`);
      results.failed.push('Blueprint page');
    }

    // ===================================================================
    // TEST 7: Asset Loading & Resources
    // ===================================================================
    logSection('TEST 7: Asset Loading & Resources');

    try {
      const resources = await page.evaluate(() => {
        const scripts = document.querySelectorAll('script[src]').length;
        const styles = document.querySelectorAll('link[rel="stylesheet"]').length;
        const images = document.querySelectorAll('img').length;
        const imagesWithSrc = document.querySelectorAll('img[src]').length;

        return { scripts, styles, images, imagesWithSrc };
      });

      logInfo(`Scripts: ${resources.scripts}, Styles: ${resources.styles}, Images: ${resources.images}`);

      if (resources.scripts > 0) {
        logSuccess('JavaScript assets loaded');
        results.passed.push('JavaScript assets');
      }

      if (resources.styles > 0) {
        logSuccess('CSS assets loaded');
        results.passed.push('CSS assets');
      }

      if (resources.images > 0) {
        logSuccess(`Found ${resources.images} images (${resources.imagesWithSrc} with src)`);
        results.passed.push('Image assets');
      }
    } catch (error) {
      logError(`Asset check failed: ${error.message}`);
      results.failed.push('Asset loading');
    }

    // ===================================================================
    // TEST 8: Performance Metrics
    // ===================================================================
    logSection('TEST 8: Performance Metrics');

    try {
      const perfMetrics = await page.evaluate(() => {
        const perf = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
          loadComplete: perf.loadEventEnd - perf.loadEventStart,
          domInteractive: perf.domInteractive - perf.fetchStart,
          transferSize: perf.transferSize,
        };
      });

      logInfo(`DOM Content Loaded: ${perfMetrics.domContentLoaded.toFixed(2)}ms`);
      logInfo(`Load Complete: ${perfMetrics.loadComplete.toFixed(2)}ms`);
      logInfo(`DOM Interactive: ${perfMetrics.domInteractive.toFixed(2)}ms`);
      logInfo(`Transfer Size: ${(perfMetrics.transferSize / 1024).toFixed(2)} KB`);

      results.performance = { ...results.performance, ...perfMetrics };

      if (perfMetrics.domInteractive < 2500) {
        logSuccess('DOM Interactive < 2.5s (excellent)');
        results.passed.push('Performance - DOM Interactive');
      } else if (perfMetrics.domInteractive < 5000) {
        logWarning(`DOM Interactive: ${perfMetrics.domInteractive.toFixed(0)}ms (acceptable)`);
        results.warnings.push('Performance - DOM Interactive (slow)');
      } else {
        logError(`DOM Interactive: ${perfMetrics.domInteractive.toFixed(0)}ms (poor)`);
        results.failed.push('Performance - DOM Interactive');
      }
    } catch (error) {
      logError(`Performance metrics failed: ${error.message}`);
      results.failed.push('Performance metrics');
    }

    // ===================================================================
    // TEST 9: Environment Variables & Configuration
    // ===================================================================
    logSection('TEST 9: Environment Variables & Configuration');

    try {
      const envCheck = await page.evaluate(() => {
        // Check for common error messages that indicate missing env vars
        const bodyText = document.body.textContent;
        const hasEnvError = /missing.*environment.*variable|undefined.*vite_|configuration.*error/i.test(bodyText);

        // Check for Supabase initialization
        const hasSupabaseError = /supabase.*failed|database.*connection.*error/i.test(bodyText);

        return { hasEnvError, hasSupabaseError };
      });

      if (!envCheck.hasEnvError) {
        logSuccess('No environment variable errors detected');
        results.passed.push('Environment variables');
      } else {
        logError('Environment variable errors detected in page');
        results.failed.push('Environment variables');
      }

      if (!envCheck.hasSupabaseError) {
        logSuccess('No Supabase connection errors detected');
        results.passed.push('Supabase configuration');
      } else {
        logError('Supabase connection errors detected');
        results.failed.push('Supabase configuration');
      }
    } catch (error) {
      logError(`Environment check failed: ${error.message}`);
      results.failed.push('Environment configuration');
    }

    // ===================================================================
    // TEST 10: Mobile Responsiveness
    // ===================================================================
    logSection('TEST 10: Mobile Responsiveness');

    try {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      await page.reload({ waitUntil: 'networkidle' });

      const mobileCheck = await page.evaluate(() => {
        const width = window.innerWidth;
        const isMobile = width <= 768;
        const hasOverflow = document.body.scrollWidth > window.innerWidth;

        return { width, isMobile, hasOverflow };
      });

      logInfo(`Mobile viewport: ${mobileCheck.width}px`);

      if (mobileCheck.isMobile && !mobileCheck.hasOverflow) {
        logSuccess('Mobile responsive (no horizontal overflow)');
        results.passed.push('Mobile responsiveness');
      } else if (mobileCheck.hasOverflow) {
        logWarning('Horizontal overflow detected on mobile');
        results.warnings.push('Mobile horizontal overflow');
      }

      // Reset to desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
    } catch (error) {
      logError(`Mobile test failed: ${error.message}`);
      results.failed.push('Mobile responsiveness');
    }

    // ===================================================================
    // FINAL RESULTS SUMMARY
    // ===================================================================
    logSection('DEPLOYMENT VALIDATION SUMMARY');

    const totalTests = results.passed.length + results.failed.length;
    const passRate = totalTests > 0 ? ((results.passed.length / totalTests) * 100).toFixed(1) : 0;

    log(`\nTests Passed: ${results.passed.length}`, colors.green);
    log(`Tests Failed: ${results.failed.length}`, colors.red);
    log(`Warnings: ${results.warnings.length}`, colors.yellow);
    log(`Pass Rate: ${passRate}%`, passRate >= 80 ? colors.green : colors.red);

    if (results.failed.length > 0) {
      log('\nFailed Tests:', colors.red);
      results.failed.forEach(test => log(`  - ${test}`, colors.red));
    }

    if (results.warnings.length > 0) {
      log('\nWarnings:', colors.yellow);
      results.warnings.forEach(warning => log(`  - ${warning}`, colors.yellow));
    }

    if (results.consoleErrors.length > 0) {
      log('\nConsole Errors:', colors.red);
      results.consoleErrors.slice(0, 10).forEach(err => log(`  - ${err}`, colors.red));
      if (results.consoleErrors.length > 10) {
        log(`  ... and ${results.consoleErrors.length - 10} more`, colors.red);
      }
    }

    if (results.networkErrors.length > 0) {
      log('\nNetwork Errors:', colors.red);
      results.networkErrors.forEach(err => log(`  - ${err}`, colors.red));
    }

    log('\nPerformance Metrics:', colors.blue);
    Object.entries(results.performance).forEach(([key, value]) => {
      const displayValue = typeof value === 'number' ? `${value.toFixed(2)}ms` : value;
      log(`  ${key}: ${displayValue}`, colors.blue);
    });

    logSection('RECOMMENDATIONS');

    if (results.failed.length === 0 && results.consoleErrors.length === 0) {
      logSuccess('Deployment is HEALTHY - All critical tests passed!');
      logSuccess('Personalization system is deployed and functional.');
    } else if (results.failed.length > 0) {
      logError('Deployment has CRITICAL ISSUES - Immediate attention required!');
      log('\nRecommended Actions:', colors.yellow);

      if (results.failed.includes('Environment variables')) {
        log('  1. Verify Netlify environment variables are correctly set', colors.yellow);
        log('     - Check VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY', colors.yellow);
        log('     - Check VITE_ANTHROPIC_API_KEY for AI features', colors.yellow);
      }

      if (results.failed.includes('React bootstrap')) {
        log('  2. Check build process - React app may not be bundling correctly', colors.yellow);
        log('     - Run: npm run build locally and check for errors', colors.yellow);
      }

      if (results.networkErrors.length > 0) {
        log('  3. Investigate network errors - may indicate missing assets', colors.yellow);
        log('     - Check Netlify build logs for asset generation issues', colors.yellow);
      }
    } else {
      logWarning('Deployment is FUNCTIONAL with minor warnings.');
      log('\nConsider addressing:', colors.yellow);
      results.warnings.forEach(warning => log(`  - ${warning}`, colors.yellow));
    }

    log('\n' + '='.repeat(80), colors.cyan);
    log('  Validation Complete', colors.cyan);
    log('='.repeat(80), colors.cyan);

    // Exit with appropriate code
    process.exit(results.failed.length > 0 ? 1 : 0);

  } catch (error) {
    logError(`\nCritical error during validation: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (page) await page.close();
    if (context) await context.close();
    if (browser) await browser.close();
  }
}

// Run the test
testDeployment();
