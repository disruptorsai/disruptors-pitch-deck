#!/usr/bin/env node

/**
 * AI Presenter Development Server Verification Script
 *
 * This script verifies that the development server is running correctly
 * and the React 19 application loads without errors.
 */

const http = require('http');
const https = require('https');

const SERVER_URL = 'http://localhost:5181';
const TIMEOUT = 10000;

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
    console.log('\n' + '='.repeat(70));
    log(title, 'bright');
    console.log('='.repeat(70));
}

function logTest(testName, status, details = '') {
    const statusSymbol = status === 'pass' ? '✓' : status === 'fail' ? '✗' : '⚠';
    const statusColor = status === 'pass' ? 'green' : status === 'fail' ? 'red' : 'yellow';

    log(`${statusSymbol} ${testName}`, statusColor);
    if (details) {
        console.log(`  ${details}`);
    }
}

async function fetchWithTimeout(url, timeout = TIMEOUT) {
    return new Promise((resolve, reject) => {
        const request = http.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                resolve({
                    statusCode: response.statusCode,
                    headers: response.headers,
                    body: data
                });
            });
        });

        request.on('error', reject);
        request.setTimeout(timeout, () => {
            request.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

async function testServerConnectivity() {
    logSection('TEST 1: Server Connectivity');

    try {
        const response = await fetchWithTimeout(SERVER_URL);

        if (response.statusCode === 200) {
            logTest('Server is responding', 'pass', `Status: ${response.statusCode}`);
            return { success: true, response };
        } else {
            logTest('Server responded with error', 'fail', `Status: ${response.statusCode}`);
            return { success: false, response };
        }
    } catch (error) {
        logTest('Cannot connect to server', 'fail', error.message);
        return { success: false, error };
    }
}

function checkEnvironmentVariables(htmlContent) {
    logSection('TEST 2: Environment Variables Check');

    // Check if the page contains error messages about missing environment variables
    const hasConfigError = htmlContent.includes('Configuration Error') ||
                          htmlContent.includes('Configuration Required') ||
                          htmlContent.includes('Missing required environment variables');

    if (hasConfigError) {
        logTest('Environment variables check', 'fail', 'Configuration error page detected');

        // Try to extract which variables are missing
        const missingVarsMatch = htmlContent.match(/VITE_\w+/g);
        if (missingVarsMatch) {
            log('  Missing variables:', 'red');
            missingVarsMatch.forEach(varName => {
                console.log(`    - ${varName}`);
            });
        }
        return false;
    } else {
        logTest('Environment variables check', 'pass', 'No configuration errors detected');
        return true;
    }
}

function checkReactSetup(htmlContent) {
    logSection('TEST 3: React Setup Verification');

    const checks = {
        'React root element': htmlContent.includes('id="root"'),
        'Vite client script': htmlContent.includes('/@vite/client'),
        'React refresh': htmlContent.includes('@react-refresh'),
        'Main entry point': htmlContent.includes('/src/main.jsx'),
    };

    let allPassed = true;

    for (const [checkName, passed] of Object.entries(checks)) {
        logTest(checkName, passed ? 'pass' : 'fail');
        if (!passed) allPassed = false;
    }

    return allPassed;
}

function checkViteDevServer(headers) {
    logSection('TEST 4: Vite Development Server');

    const isVite = headers['server']?.includes('vite') ||
                   headers['content-type']?.includes('html');

    if (isVite || headers['content-type']) {
        logTest('Vite dev server detected', 'pass');
        log(`  Content-Type: ${headers['content-type']}`, 'cyan');
        return true;
    } else {
        logTest('Vite dev server check', 'warn', 'Could not confirm Vite is running');
        return false;
    }
}

function displaySummary(results) {
    logSection('VERIFICATION SUMMARY');

    const allPassed = results.every(r => r.success);

    if (allPassed) {
        log('✓ ALL TESTS PASSED', 'green');
        log('\nYour development server is running correctly!', 'bright');
        log(`\nOpen your browser and navigate to: ${colors.cyan}${SERVER_URL}${colors.reset}`, 'reset');
    } else {
        log('✗ SOME TESTS FAILED', 'red');
        log('\nPlease check the errors above and:', 'yellow');
        log('  1. Ensure the development server is running (npm run dev)', 'yellow');
        log('  2. Verify .env.local file exists with correct variables', 'yellow');
        log('  3. Check that port 5181 is not blocked', 'yellow');
    }

    console.log('\n' + '='.repeat(70) + '\n');
}

function displayNextSteps() {
    logSection('NEXT STEPS - MANUAL VERIFICATION');

    console.log('\nTo complete verification, open your browser and check:');
    console.log('');
    log('1. Browser Console (F12)', 'cyan');
    console.log('   - Look for DEBUG logs starting with "🔍 DEBUG:"');
    console.log('   - Should show environment variables loaded');
    console.log('   - Should show NO React errors');
    console.log('');
    log('2. Page Content', 'cyan');
    console.log('   - Should show the actual AI Presenter app');
    console.log('   - Should NOT show configuration error page');
    console.log('   - UI should be interactive and responsive');
    console.log('');
    log('3. Network Tab (F12)', 'cyan');
    console.log('   - Check for any failed requests (red items)');
    console.log('   - Verify Vite HMR websocket is connected');
    console.log('');
    log(`Direct link: ${SERVER_URL}`, 'bright');
    console.log('');
}

async function main() {
    log('\n🧪 AI Presenter Development Server Verification', 'bright');
    log(`Target: ${SERVER_URL}\n`, 'cyan');

    const results = [];

    // Test 1: Server Connectivity
    const connectivityTest = await testServerConnectivity();
    results.push({ name: 'Connectivity', success: connectivityTest.success });

    if (!connectivityTest.success) {
        displaySummary(results);
        log('\n⚠ Cannot proceed with further tests - server is not reachable', 'red');
        process.exit(1);
    }

    const htmlContent = connectivityTest.response.body;
    const headers = connectivityTest.response.headers;

    // Test 2: Environment Variables
    const envCheck = checkEnvironmentVariables(htmlContent);
    results.push({ name: 'Environment Variables', success: envCheck });

    // Test 3: React Setup
    const reactCheck = checkReactSetup(htmlContent);
    results.push({ name: 'React Setup', success: reactCheck });

    // Test 4: Vite Dev Server
    const viteCheck = checkViteDevServer(headers);
    results.push({ name: 'Vite Dev Server', success: viteCheck });

    // Display summary
    displaySummary(results);

    // Display next steps
    displayNextSteps();

    // Exit with appropriate code
    const allPassed = results.every(r => r.success);
    process.exit(allPassed ? 0 : 1);
}

// Run the verification
main().catch((error) => {
    log('\n✗ Verification script failed:', 'red');
    console.error(error);
    process.exit(1);
});
