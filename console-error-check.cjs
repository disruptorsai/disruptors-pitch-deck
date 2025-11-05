/**
 * Console Error Diagnostic Test
 */

const { chromium } = require('playwright');

const SITE_URL = 'https://pitch.disruptorsmedia.com';

async function checkConsoleErrors() {
  console.log('Console Error Diagnostic for pitch.disruptorsmedia.com');
  console.log('='.repeat(60));

  const browser = await chromium.launch({ headless: false }); // Non-headless to see what's happening
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleMessages = [];
  const errors = [];
  const warnings = [];

  // Capture all console messages
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push({ type: msg.type(), text });

    if (msg.type() === 'error') {
      errors.push(text);
      console.log('[ERROR]:', text);
    } else if (msg.type() === 'warning') {
      warnings.push(text);
      console.log('[WARNING]:', text);
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    errors.push(error.message);
    console.log('[PAGE ERROR]:', error.message);
  });

  // Capture failed requests
  page.on('requestfailed', request => {
    errors.push(`Failed request: ${request.url()}`);
    console.log('[FAILED REQUEST]:', request.url(), request.failure().errorText);
  });

  try {
    console.log('\nLoading page...');
    await page.goto(SITE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page loaded, waiting for React...');

    await page.waitForTimeout(5000); // Wait 5 seconds

    // Check page HTML
    const html = await page.content();
    console.log('\nHTML Length:', html.length);

    // Check if root div exists
    const rootDiv = await page.$('#root');
    console.log('Root div exists:', rootDiv ? 'YES' : 'NO');

    if (rootDiv) {
      const rootHTML = await page.$eval('#root', el => el.innerHTML);
      console.log('Root div HTML length:', rootHTML.length);
      console.log('Root div HTML:', rootHTML.substring(0, 500));
    }

    console.log('\n' + '='.repeat(60));
    console.log('Total console messages:', consoleMessages.length);
    console.log('Errors:', errors.length);
    console.log('Warnings:', warnings.length);
    console.log('='.repeat(60));

    if (errors.length > 0) {
      console.log('\nAll Errors:');
      errors.forEach((err, i) => console.log(`${i + 1}. ${err}`));
    }

    // Keep browser open for 10 seconds to see the page
    console.log('\nKeeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('Critical error:', error);
  } finally {
    await browser.close();
  }
}

checkConsoleErrors();
