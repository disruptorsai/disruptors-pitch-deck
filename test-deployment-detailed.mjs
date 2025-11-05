/**
 * Detailed Deployment Diagnosis for React App Issue
 */

import { chromium } from 'playwright';

const SITE_URL = 'https://pitch.disruptorsmedia.com';

async function diagnose() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();

  // Collect all console messages
  const consoleMessages = [];
  page.on('console', (msg) => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location(),
    });
  });

  // Collect JavaScript errors
  const jsErrors = [];
  page.on('pageerror', (error) => {
    jsErrors.push({
      message: error.message,
      stack: error.stack,
    });
  });

  // Collect network requests
  const requests = [];
  page.on('request', (request) => {
    requests.push({
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
    });
  });

  const responses = [];
  page.on('response', (response) => {
    responses.push({
      url: response.url(),
      status: response.status(),
      statusText: response.statusText(),
    });
  });

  console.log('Loading page...');
  await page.goto(SITE_URL, { waitUntil: 'networkidle', timeout: 30000 });

  // Wait a bit for React to potentially render
  await page.waitForTimeout(3000);

  console.log('\n=== PAGE ANALYSIS ===\n');

  // Check root element
  const rootInfo = await page.evaluate(() => {
    const root = document.getElementById('root');
    return {
      exists: !!root,
      innerHTML: root?.innerHTML || '',
      innerHTMLLength: root?.innerHTML?.length || 0,
      children: root?.children.length || 0,
      display: root ? window.getComputedStyle(root).display : '',
      visibility: root ? window.getComputedStyle(root).visibility : '',
    };
  });

  console.log('Root Element Info:');
  console.log(JSON.stringify(rootInfo, null, 2));

  // Check for React
  const reactCheck = await page.evaluate(() => {
    return {
      hasReact: typeof window.React !== 'undefined',
      hasReactDOM: typeof window.ReactDOM !== 'undefined',
      reactVersion: window.React?.version || 'not found',
      dataReactRoot: document.querySelectorAll('[data-reactroot]').length,
    };
  });

  console.log('\nReact Detection:');
  console.log(JSON.stringify(reactCheck, null, 2));

  // Check for errors in window
  const windowErrors = await page.evaluate(() => {
    return {
      hasErrors: window.__errors || [],
      performance: {
        navigation: performance.getEntriesByType('navigation')[0]?.toJSON() || {},
        resources: performance.getEntriesByType('resource').length,
      },
    };
  });

  console.log('\nWindow Errors:');
  console.log(JSON.stringify(windowErrors, null, 2));

  // Get all scripts
  const scripts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('script')).map(script => ({
      src: script.src,
      type: script.type,
      async: script.async,
      defer: script.defer,
    }));
  });

  console.log('\nScripts:');
  console.log(JSON.stringify(scripts, null, 2));

  // Console messages
  console.log('\n=== CONSOLE MESSAGES ===\n');
  consoleMessages.forEach(msg => {
    console.log(`[${msg.type.toUpperCase()}] ${msg.text}`);
  });

  // JavaScript errors
  if (jsErrors.length > 0) {
    console.log('\n=== JAVASCRIPT ERRORS ===\n');
    jsErrors.forEach(error => {
      console.log(error.message);
      console.log(error.stack);
    });
  }

  // Failed requests
  const failedResponses = responses.filter(r => r.status >= 400);
  if (failedResponses.length > 0) {
    console.log('\n=== FAILED REQUESTS ===\n');
    failedResponses.forEach(r => {
      console.log(`${r.status} ${r.statusText}: ${r.url}`);
    });
  }

  // Check main JS bundle
  const mainJsResponse = responses.find(r => r.url.includes('/assets/index-'));
  if (mainJsResponse) {
    console.log('\n=== MAIN JS BUNDLE ===');
    console.log(`Status: ${mainJsResponse.status}`);
    console.log(`URL: ${mainJsResponse.url}`);

    // Try to fetch the bundle content
    try {
      const bundleContent = await page.evaluate(async (url) => {
        const response = await fetch(url);
        const text = await response.text();
        return {
          size: text.length,
          hasError: text.includes('Error') || text.includes('error'),
          hasReact: text.includes('react'),
          hasReactDOM: text.includes('react-dom'),
          preview: text.substring(0, 500),
        };
      }, mainJsResponse.url);

      console.log('Bundle Info:');
      console.log(JSON.stringify(bundleContent, null, 2));
    } catch (error) {
      console.log('Could not fetch bundle:', error.message);
    }
  }

  console.log('\n=== WAITING 10s FOR ANY DELAYED RENDERING ===\n');
  await page.waitForTimeout(10000);

  // Re-check root
  const rootInfoFinal = await page.evaluate(() => {
    const root = document.getElementById('root');
    return {
      innerHTML: root?.innerHTML || '',
      innerHTMLLength: root?.innerHTML?.length || 0,
      children: root?.children.length || 0,
    };
  });

  console.log('Final Root State:');
  console.log(JSON.stringify(rootInfoFinal, null, 2));

  // Take screenshot
  await page.screenshot({ path: 'deployment-screenshot.png', fullPage: true });
  console.log('\nScreenshot saved to: deployment-screenshot.png');

  // Keep browser open for manual inspection
  console.log('\nBrowser will remain open for 30 seconds for manual inspection...');
  await page.waitForTimeout(30000);

  await browser.close();
}

diagnose().catch(console.error);
