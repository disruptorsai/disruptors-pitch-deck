/**
 * Visual Validation Test - Screenshot and Content Verification
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://pitch.disruptorsmedia.com';

async function visualValidation() {
  console.log('Visual Validation Test for pitch.disruptorsmedia.com');
  console.log('='.repeat(60));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    // Load homepage
    console.log('\nLoading homepage...');
    await page.goto(SITE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000); // Wait for React to fully render

    // Capture screenshot
    const screenshotPath = path.join(__dirname, 'deployment-screenshot-desktop.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('✓ Desktop screenshot saved:', screenshotPath);

    // Check for actual rendered content
    const bodyText = await page.textContent('body');
    console.log('\nPage contains text content:', bodyText.length > 500 ? 'YES' : 'NO');
    console.log('Text length:', bodyText.length);

    // Check for navigation elements
    const navExists = await page.$('nav').catch(() => null);
    console.log('Navigation element exists:', navExists ? 'YES' : 'NO');

    // Check for main content area
    const mainContent = await page.$('#root > *').catch(() => null);
    console.log('Main content exists:', mainContent ? 'YES' : 'NO');

    // Mobile screenshot
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const mobileScreenshotPath = path.join(__dirname, 'deployment-screenshot-mobile.png');
    await page.screenshot({ path: mobileScreenshotPath, fullPage: true });
    console.log('✓ Mobile screenshot saved:', mobileScreenshotPath);

    // Test admin page
    console.log('\nTesting admin route...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${SITE_URL}/admin`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const adminScreenshotPath = path.join(__dirname, 'deployment-screenshot-admin.png');
    await page.screenshot({ path: adminScreenshotPath, fullPage: true });
    console.log('✓ Admin screenshot saved:', adminScreenshotPath);

    console.log('\n' + '='.repeat(60));
    console.log('✓ Visual validation complete');
    console.log('Screenshots saved to:', __dirname);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('Error during visual validation:', error);
  } finally {
    await browser.close();
  }
}

visualValidation();
