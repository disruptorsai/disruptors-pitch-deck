const https = require('https');
const http = require('http');

// Fetch and display content
function fetchContent(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function testSite() {
  console.log('Testing https://pitch.disruptorsmedia.com...\n');

  try {
    const result = await fetchContent('https://pitch.disruptorsmedia.com');

    console.log('Status:', result.statusCode);
    console.log('\nHeaders:');
    console.log('  Server:', result.headers.server);
    console.log('  Content-Type:', result.headers['content-type']);
    console.log('  Cache-Control:', result.headers['cache-control']);

    console.log('\nSearching for content indicators...\n');

    // Check for AI Presenter content
    if (result.body.includes('AI Presenter')) {
      console.log('✓ Found "AI Presenter" in HTML');
    }

    if (result.body.includes('Disrupt Your Industry')) {
      console.log('✓ Found "Disrupt Your Industry" in HTML');
    }

    // Check for blog content
    if (result.body.includes('47.32 Billion') || result.body.includes('$47.32 Billion')) {
      console.log('✗ Found "$47.32 Billion" - BLOG CONTENT DETECTED');
    }

    if (result.body.includes('AI Marketing Opportunity')) {
      console.log('✗ Found "AI Marketing Opportunity" - BLOG CONTENT DETECTED');
    }

    // Extract title
    const titleMatch = result.body.match(/<title>(.*?)<\/title>/);
    if (titleMatch) {
      console.log('\nPage Title:', titleMatch[1]);
    }

    // Check what JS bundle is being loaded
    const scriptMatch = result.body.match(/src="\/assets\/(index-[^"]+)"/);
    if (scriptMatch) {
      console.log('JS Bundle:', scriptMatch[1]);
    }

    // Fetch the JS bundle and check its content
    if (scriptMatch) {
      console.log('\nFetching JS bundle content...');
      const jsResult = await fetchContent(`https://pitch.disruptorsmedia.com/assets/${scriptMatch[1]}`);

      const jsContent = jsResult.body;

      if (jsContent.includes('Disrupt Your Industry') || jsContent.includes('Disrupt') && jsContent.includes('Industry')) {
        console.log('✓ JS Bundle contains "Disrupt Your Industry" text');
      }

      if (jsContent.includes('47.32') || jsContent.includes('$47')) {
        console.log('✗ JS Bundle contains "$47" - BLOG CONTENT IN BUNDLE');
      }

      // Check bundle size
      console.log('JS Bundle Size:', Math.round(jsContent.length / 1024), 'KB');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSite();
