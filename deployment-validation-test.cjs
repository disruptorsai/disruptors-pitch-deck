/**
 * Deployment Validation Test for pitch.disruptorsmedia.com
 * Comprehensive automated testing using Playwright
 */

const { chromium } = require('playwright');

const SITE_URL = 'https://pitch.disruptorsmedia.com';
const EXPECTED_TITLE = 'AI Presenter - Professional Pitch Deck Platform';

async function runDeploymentValidation() {
  console.log('='.repeat(80));
  console.log('DEPLOYMENT VALIDATION TEST - AI PRESENTER');
  console.log('Site URL:', SITE_URL);
  console.log('Timestamp:', new Date().toISOString());
  console.log('='.repeat(80));
  console.log();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  const results = {
    passed: [],
    failed: [],
    warnings: []
  };

  try {
    // Test 1: Homepage Load
    console.log('Test 1: Homepage Load & Title Verification');
    console.log('-'.repeat(40));
    await page.goto(SITE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    const title = await page.title();
    console.log('Page Title:', title);

    if (title === EXPECTED_TITLE) {
      results.passed.push('Homepage title is correct');
      console.log('✓ PASS: Title matches expected value');
    } else {
      results.failed.push(`Homepage title incorrect: "${title}" (expected: "${EXPECTED_TITLE}")`);
      console.log('✗ FAIL: Title does not match expected value');
    }
    console.log();

    // Test 2: Meta Description
    console.log('Test 2: Meta Description Check');
    console.log('-'.repeat(40));
    const metaDescription = await page.$eval('meta[name="description"]', el => el.content).catch(() => null);
    console.log('Meta Description:', metaDescription);
    if (metaDescription && metaDescription.includes('AI Presenter')) {
      results.passed.push('Meta description contains "AI Presenter"');
      console.log('✓ PASS: Meta description present and correct');
    } else {
      results.warnings.push('Meta description missing or incorrect');
      console.log('⚠ WARNING: Meta description issue');
    }
    console.log();

    // Test 3: Favicon Check
    console.log('Test 3: Favicon Verification');
    console.log('-'.repeat(40));
    const favicon = await page.$eval('link[rel="icon"]', el => el.href).catch(() => null);
    console.log('Favicon URL:', favicon);
    if (favicon && favicon.includes('favicon.svg')) {
      results.passed.push('Favicon is correctly set to favicon.svg');
      console.log('✓ PASS: Favicon correctly configured');
    } else if (favicon && favicon.includes('base44')) {
      results.failed.push('Favicon still references Base44');
      console.log('✗ FAIL: Favicon still references Base44');
    } else {
      results.warnings.push('Favicon may not be loading correctly');
      console.log('⚠ WARNING: Favicon issue detected');
    }
    console.log();

    // Test 4: JavaScript/CSS Loading
    console.log('Test 4: Asset Loading Validation');
    console.log('-'.repeat(40));
    const stylesheets = await page.$$eval('link[rel="stylesheet"]', links => links.map(l => l.href));
    const scripts = await page.$$eval('script[src]', scripts => scripts.map(s => s.src));

    console.log('Stylesheets loaded:', stylesheets.length);
    console.log('Scripts loaded:', scripts.length);

    if (stylesheets.length > 0 && scripts.length > 0) {
      results.passed.push('CSS and JavaScript assets loading');
      console.log('✓ PASS: Assets are loading');
    } else {
      results.failed.push('Assets not loading correctly');
      console.log('✗ FAIL: Assets not loading');
    }
    console.log();

    // Test 5: Console Errors
    console.log('Test 5: Console Error Detection');
    console.log('-'.repeat(40));
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('Console Errors Found:', consoleErrors.length);
    if (consoleErrors.length === 0) {
      results.passed.push('No console errors detected');
      console.log('✓ PASS: No console errors');
    } else {
      results.failed.push(`${consoleErrors.length} console errors detected`);
      console.log('✗ FAIL: Console errors detected');
      consoleErrors.slice(0, 5).forEach(err => console.log('  -', err));
    }
    console.log();

    // Test 6: Network Errors (404s, etc.)
    console.log('Test 6: Network Request Validation');
    console.log('-'.repeat(40));
    const failedRequests = [];
    page.on('response', response => {
      if (response.status() >= 400) {
        failedRequests.push({ url: response.url(), status: response.status() });
      }
    });

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('Failed Requests:', failedRequests.length);
    if (failedRequests.length === 0) {
      results.passed.push('All network requests successful');
      console.log('✓ PASS: No failed network requests');
    } else {
      results.warnings.push(`${failedRequests.length} failed network requests`);
      console.log('⚠ WARNING: Some requests failed');
      failedRequests.slice(0, 5).forEach(req => console.log(`  - ${req.status}: ${req.url}`));
    }
    console.log();

    // Test 7: Main Content Rendering
    console.log('Test 7: Main Content Rendering Check');
    console.log('-'.repeat(40));
    await page.waitForSelector('#root', { timeout: 5000 }).catch(() => null);
    const rootContent = await page.$eval('#root', el => el.innerHTML.length).catch(() => 0);

    console.log('Root element content length:', rootContent);
    if (rootContent > 100) {
      results.passed.push('Main React app is rendering content');
      console.log('✓ PASS: Content is rendering');
    } else {
      results.failed.push('React app may not be rendering correctly');
      console.log('✗ FAIL: Content not rendering properly');
    }
    console.log();

    // Test 8: Mobile Responsiveness
    console.log('Test 8: Mobile Viewport Test');
    console.log('-'.repeat(40));
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const mobileTitle = await page.title();
    if (mobileTitle === EXPECTED_TITLE) {
      results.passed.push('Mobile viewport renders correctly');
      console.log('✓ PASS: Mobile rendering works');
    } else {
      results.warnings.push('Mobile viewport may have issues');
      console.log('⚠ WARNING: Mobile viewport issue');
    }
    console.log();

    // Test 9: Admin Routes Accessibility
    console.log('Test 9: Admin Routes Check');
    console.log('-'.repeat(40));
    await page.setViewportSize({ width: 1920, height: 1080 }); // Reset to desktop
    const adminResponse = await page.goto(`${SITE_URL}/admin`, { waitUntil: 'networkidle' }).catch(() => null);

    if (adminResponse && adminResponse.status() === 200) {
      results.passed.push('Admin route is accessible');
      console.log('✓ PASS: Admin route loads');
    } else {
      results.warnings.push('Admin route may not be accessible');
      console.log('⚠ WARNING: Admin route issue');
    }
    console.log();

    // Test 10: Performance Metrics
    console.log('Test 10: Basic Performance Metrics');
    console.log('-'.repeat(40));
    await page.goto(SITE_URL, { waitUntil: 'load' });
    const performanceTiming = JSON.parse(
      await page.evaluate(() => JSON.stringify(window.performance.timing))
    );

    const loadTime = performanceTiming.loadEventEnd - performanceTiming.navigationStart;
    console.log('Page Load Time:', loadTime + 'ms');

    if (loadTime < 5000) {
      results.passed.push('Page load time is acceptable (<5s)');
      console.log('✓ PASS: Good load time');
    } else if (loadTime < 10000) {
      results.warnings.push('Page load time is slow (>5s)');
      console.log('⚠ WARNING: Slow load time');
    } else {
      results.failed.push('Page load time is very slow (>10s)');
      console.log('✗ FAIL: Very slow load time');
    }
    console.log();

  } catch (error) {
    console.error('Critical Error During Testing:', error.message);
    results.failed.push(`Critical test error: ${error.message}`);
  } finally {
    await browser.close();
  }

  // Final Report
  console.log('='.repeat(80));
  console.log('DEPLOYMENT VALIDATION SUMMARY');
  console.log('='.repeat(80));
  console.log();

  console.log(`✓ PASSED: ${results.passed.length} tests`);
  results.passed.forEach(test => console.log(`  - ${test}`));
  console.log();

  console.log(`⚠ WARNINGS: ${results.warnings.length} items`);
  results.warnings.forEach(warning => console.log(`  - ${warning}`));
  console.log();

  console.log(`✗ FAILED: ${results.failed.length} tests`);
  results.failed.forEach(failure => console.log(`  - ${failure}`));
  console.log();

  const totalTests = results.passed.length + results.warnings.length + results.failed.length;
  const passRate = ((results.passed.length / totalTests) * 100).toFixed(1);

  console.log('='.repeat(80));
  console.log(`OVERALL SCORE: ${passRate}% (${results.passed.length}/${totalTests} passed)`);

  if (results.failed.length === 0) {
    console.log('STATUS: DEPLOYMENT VALIDATION SUCCESSFUL ✓');
  } else if (results.failed.length <= 2) {
    console.log('STATUS: DEPLOYMENT MOSTLY SUCCESSFUL - MINOR ISSUES DETECTED ⚠');
  } else {
    console.log('STATUS: DEPLOYMENT HAS CRITICAL ISSUES - INVESTIGATION REQUIRED ✗');
  }
  console.log('='.repeat(80));

  // Exit code
  process.exit(results.failed.length > 0 ? 1 : 0);
}

runDeploymentValidation();
