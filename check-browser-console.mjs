/**
 * Browser Console Inspector
 * Opens the dev server in a headless browser and captures all console output
 */

import { chromium } from 'playwright';

async function checkBrowserConsole() {
  console.log('🌐 Launching browser to inspect http://localhost:5180/...\n');

  const browser = await chromium.launch({
    headless: false, // Show browser so you can see it
    devtools: true,  // Open DevTools automatically
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Collect all console messages
  const consoleLogs = [];

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleLogs.push({ type, text });

    // Print to our terminal as well
    const icon = {
      'log': '📝',
      'info': 'ℹ️',
      'warn': '⚠️',
      'error': '❌',
      'debug': '🔍',
    }[type] || '📋';

    console.log(`${icon} [${type.toUpperCase()}] ${text}`);
  });

  // Capture page errors
  page.on('pageerror', error => {
    console.log('❌ [PAGE ERROR]', error.message);
  });

  // Capture network failures
  page.on('requestfailed', request => {
    console.log('🔴 [NETWORK FAILED]', request.url(), request.failure()?.errorText);
  });

  try {
    console.log('🔄 Navigating to http://localhost:5180/...\n');
    await page.goto('http://localhost:5180/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log('\n✅ Page loaded successfully!\n');

    // Wait a bit for React to initialize
    await page.waitForTimeout(3000);

    // Get the page title and URL
    const title = await page.title();
    const url = page.url();

    console.log('📄 Page Title:', title);
    console.log('🔗 Current URL:', url);

    // Check if error page is showing
    const errorVisible = await page.locator('text=Configuration Error').isVisible().catch(() => false);
    console.log('❌ Configuration Error Visible:', errorVisible);

    // Try to get import.meta.env from the page context
    console.log('\n🔍 Attempting to read import.meta.env from page context...\n');

    const envVars = await page.evaluate(() => {
      // Check what's available in the window object
      return {
        windowKeys: Object.keys(window).filter(k =>
          k.includes('env') || k.includes('ENV') || k.includes('vite') || k.includes('VITE')
        ),
      };
    });

    console.log('🌍 Environment check:', JSON.stringify(envVars, null, 2));

    // Take a screenshot
    const screenshotPath = 'browser-screenshot.png';
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    console.log(`📸 Screenshot saved to: ${screenshotPath}`);

    console.log('\n📊 Summary of Console Output:');
    console.log('═'.repeat(60));

    // Filter for DEBUG messages
    const debugMessages = consoleLogs.filter(log => log.text.includes('🔍 DEBUG:'));

    if (debugMessages.length > 0) {
      console.log('\n🔍 DEBUG Messages Found:');
      debugMessages.forEach(log => {
        console.log(`  ${log.text}`);
      });
    } else {
      console.log('\n⚠️  NO DEBUG MESSAGES FOUND!');
      console.log('This means the debugging code may not be executing.');
    }

    console.log('\n📝 All Console Logs:');
    consoleLogs.forEach(log => {
      console.log(`  [${log.type}] ${log.text}`);
    });

    console.log('\n✅ Inspection complete! Browser will remain open for 30 seconds...');
    console.log('   Check the DevTools console in the browser window!\n');

    // Keep browser open for inspection
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('\n❌ Error during inspection:', error.message);
    console.error(error);
  } finally {
    await browser.close();
    console.log('\n👋 Browser closed.');
  }
}

checkBrowserConsole().catch(console.error);
