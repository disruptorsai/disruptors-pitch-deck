import { chromium } from 'playwright';

async function validateProduction() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });

  console.log('========================================');
  console.log('  PRODUCTION DEPLOYMENT VALIDATION');
  console.log('========================================\n');
  console.log('Target: https://pitch.disruptorsmedia.com');
  console.log('Timestamp:', new Date().toISOString());
  console.log('\n========================================\n');

  try {
    const cacheBustUrl = `https://pitch.disruptorsmedia.com?cb=${Date.now()}`;
    await page.goto(cacheBustUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(5000);

    const validation = await page.evaluate(() => {
      const bodyText = document.body.innerText || '';
      return {
        bodyLength: bodyText.length,
        hasConfigError: bodyText.includes('Configuration Error'),
        hasMissingVars: bodyText.includes('Missing Environment Variables'),
        hasNetlifyInstructions: bodyText.includes('Netlify'),
        hasSupabaseURL: bodyText.includes('VITE_SUPABASE_URL'),
        hasSupabaseKey: bodyText.includes('VITE_SUPABASE_ANON_KEY'),
        hasAnthropicKey: bodyText.includes('VITE_ANTHROPIC_API_KEY'),
        hasRetryButton: bodyText.includes('Retry Connection'),
        hasStepNumbers: bodyText.includes('Log into Netlify Dashboard'),
        headings: Array.from(document.querySelectorAll('h1, h2')).map(h => h.textContent.trim()),
        buttons: Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim()),
        links: Array.from(document.querySelectorAll('a')).map(a => ({ text: a.textContent.trim(), href: a.href })),
        fullText: bodyText
      };
    });

    console.log('[1] CONTENT PRESENCE CHECK');
    console.log('  Content length:', validation.bodyLength, 'characters');
    console.log('  Status:', validation.bodyLength > 0 ? '✓ PASS' : '✗ FAIL');
    console.log('');

    console.log('[2] ERROR PAGE HEADING CHECK');
    console.log('  "Configuration Error" present:', validation.hasConfigError ? 'YES' : 'NO');
    console.log('  Status:', validation.hasConfigError ? '✓ PASS' : '✗ FAIL');
    console.log('');

    console.log('[3] MISSING VARIABLES SECTION CHECK');
    console.log('  Section header present:', validation.hasMissingVars ? 'YES' : 'NO');
    console.log('  VITE_SUPABASE_URL listed:', validation.hasSupabaseURL ? 'YES' : 'NO');
    console.log('  VITE_SUPABASE_ANON_KEY listed:', validation.hasSupabaseKey ? 'YES' : 'NO');
    console.log('  VITE_ANTHROPIC_API_KEY listed:', validation.hasAnthropicKey ? 'YES' : 'NO');
    const varsPass = validation.hasMissingVars && validation.hasSupabaseURL && validation.hasSupabaseKey && validation.hasAnthropicKey;
    console.log('  Status:', varsPass ? '✓ PASS' : '✗ FAIL');
    console.log('');

    console.log('[4] NETLIFY INSTRUCTIONS CHECK');
    console.log('  Instructions present:', validation.hasNetlifyInstructions ? 'YES' : 'NO');
    console.log('  Step-by-step guidance:', validation.hasStepNumbers ? 'YES' : 'NO');
    const instructionsPass = validation.hasNetlifyInstructions && validation.hasStepNumbers;
    console.log('  Status:', instructionsPass ? '✓ PASS' : '✗ FAIL');
    console.log('');

    console.log('[5] USER ACTIONS CHECK');
    console.log('  Retry button present:', validation.hasRetryButton ? 'YES' : 'NO');
    console.log('  Buttons found:', validation.buttons.length);
    validation.buttons.forEach((b, i) => console.log(`    ${i + 1}. "${b}"`));
    console.log('  Links found:', validation.links.length);
    validation.links.forEach((l, i) => console.log(`    ${i + 1}. "${l.text}" → ${l.href}`));
    const actionsPass = validation.hasRetryButton && validation.buttons.length > 0;
    console.log('  Status:', actionsPass ? '✓ PASS' : '✗ FAIL');
    console.log('');

    console.log('[6] PAGE STRUCTURE CHECK');
    console.log('  Headings found:', validation.headings.length);
    validation.headings.forEach((h, i) => console.log(`    ${i + 1}. ${h}`));
    const structurePass = validation.headings.length >= 2;
    console.log('  Status:', structurePass ? '✓ PASS' : '✗ FAIL');
    console.log('');

    console.log('[7] JAVASCRIPT ERRORS CHECK');
    console.log('  Errors detected:', pageErrors.length);
    if (pageErrors.length > 0) {
      pageErrors.forEach((err, i) => console.log(`    ${i + 1}. ${err.substring(0, 200)}`));
    }
    console.log('  Status:', pageErrors.length === 0 ? '✓ PASS' : '✗ FAIL');
    console.log('');

    // Screenshot
    await page.screenshot({ path: 'production-deployment-screenshot.png', fullPage: true });
    console.log('[8] SCREENSHOT CAPTURED');
    console.log('  Saved to: production-deployment-screenshot.png');
    console.log('');

    // Final verdict
    console.log('========================================');
    console.log('  FINAL VALIDATION RESULT');
    console.log('========================================\n');

    const allChecks = [
      { name: 'Content Presence', pass: validation.bodyLength > 0 },
      { name: 'Error Page Heading', pass: validation.hasConfigError },
      { name: 'Missing Variables Section', pass: varsPass },
      { name: 'Netlify Instructions', pass: instructionsPass },
      { name: 'User Actions', pass: actionsPass },
      { name: 'Page Structure', pass: structurePass },
      { name: 'No JavaScript Errors', pass: pageErrors.length === 0 }
    ];

    const passedChecks = allChecks.filter(c => c.pass).length;
    const totalChecks = allChecks.length;

    console.log('Validation Summary:');
    allChecks.forEach(check => {
      console.log(`  [${check.pass ? '✓' : '✗'}] ${check.name}`);
    });

    console.log('');
    console.log(`Score: ${passedChecks}/${totalChecks} checks passed`);
    console.log('');

    if (passedChecks === totalChecks) {
      console.log('✓✓✓ SUCCESS ✓✓✓');
      console.log('The deployment is FULLY FUNCTIONAL!');
      console.log('Error page displays correctly with all required elements.');
      console.log('Users will see clear instructions instead of a blank page.');
    } else if (passedChecks >= totalChecks * 0.7) {
      console.log('⚠ PARTIAL SUCCESS');
      console.log('Most checks passed, but some elements may be missing.');
      console.log('Review failed checks above for details.');
    } else {
      console.log('✗✗✗ FAILURE ✗✗✗');
      console.log('Critical issues detected. Deployment validation failed.');
    }

    console.log('');
    console.log('========================================\n');

  } catch (error) {
    console.error('Validation error:', error.message);
  } finally {
    await browser.close();
  }
}

validateProduction().catch(console.error);
