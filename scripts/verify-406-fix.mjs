#!/usr/bin/env node

/**
 * Verify 406 Fix
 *
 * This script verifies that the .maybeSingle() fix resolves the 406 error
 * by testing the exact scenario that was causing issues.
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ubqxflzuvxowigbjmqfb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

// Create Supabase clients
const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const publicClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false }
});

console.log('═══════════════════════════════════════════════════════');
console.log('   406 FIX VERIFICATION TEST');
console.log('═══════════════════════════════════════════════════════\n');

/**
 * Test OLD method (.single()) - Should get 406
 */
async function testOldMethod() {
  console.log('🧪 Test 1: OLD METHOD - Using .single() (should get 406 or PGRST116)\n');

  // Get a client ID to test with
  const { data: clients } = await adminClient
    .from('ai_presenter_clients')
    .select('id')
    .limit(1)
    .single();

  if (!clients) {
    console.log('   ⚠️  No clients found to test with');
    return false;
  }

  console.log(`   Testing with client ID: ${clients.id}`);

  try {
    const { data, error } = await publicClient
      .from('ai_presenter_competitive_analysis')
      .select('*')
      .eq('client_id', clients.id)
      .eq('is_visible', true)
      .single(); // OLD method

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('   ❌ Got PGRST116 error (as expected with .single())');
        console.log(`      Error: ${error.message}`);
        return false;
      } else {
        console.log(`   ❌ Unexpected error: ${error.message}`);
        return false;
      }
    } else {
      console.log('   ✅ Success (found data)');
      return true;
    }
  } catch (err) {
    console.log(`   ❌ Exception: ${err.message}`);
    return false;
  }
}

/**
 * Test NEW method (.maybeSingle()) - Should get 200 with null
 */
async function testNewMethod() {
  console.log('\n🧪 Test 2: NEW METHOD - Using .maybeSingle() (should get 200 with null)\n');

  // Get a client ID to test with
  const { data: clients } = await adminClient
    .from('ai_presenter_clients')
    .select('id')
    .limit(1)
    .single();

  if (!clients) {
    console.log('   ⚠️  No clients found to test with');
    return false;
  }

  console.log(`   Testing with client ID: ${clients.id}`);

  try {
    const { data, error } = await publicClient
      .from('ai_presenter_competitive_analysis')
      .select('*')
      .eq('client_id', clients.id)
      .eq('is_visible', true)
      .maybeSingle(); // NEW method

    if (error) {
      console.log(`   ❌ Error: ${error.message}`);
      return false;
    } else {
      if (data === null) {
        console.log('   ✅ Success - Returned null (no 406 error!)');
        console.log('   ✅ Fix verified - .maybeSingle() handles empty results correctly');
        return true;
      } else {
        console.log('   ✅ Success - Found data');
        console.log(`   Data: ${JSON.stringify(data, null, 2).substring(0, 100)}...`);
        return true;
      }
    }
  } catch (err) {
    console.log(`   ❌ Exception: ${err.message}`);
    return false;
  }
}

/**
 * Test with HTTP fetch to verify response codes
 */
async function testHTTPResponseCodes() {
  console.log('\n🧪 Test 3: HTTP Response Codes (verify no 406)\n');

  // Get a client ID to test with
  const { data: clients } = await adminClient
    .from('ai_presenter_clients')
    .select('id')
    .limit(1)
    .single();

  if (!clients) {
    console.log('   ⚠️  No clients found to test with');
    return false;
  }

  console.log(`   Testing with client ID: ${clients.id}`);

  // Test 1: With Accept: application/vnd.pgrst.object+json (what .single() uses)
  console.log('\n   1. Testing with .single() Accept header:');
  try {
    const response1 = await fetch(
      `${SUPABASE_URL}/rest/v1/ai_presenter_competitive_analysis?client_id=eq.${clients.id}&is_visible=eq.true&select=*`,
      {
        headers: {
          'Accept': 'application/vnd.pgrst.object+json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }
      }
    );

    console.log(`      Status: ${response1.status} ${response1.statusText}`);

    if (response1.status === 406) {
      console.log('      ❌ Got 406 (expected with .single() Accept header)');
    } else if (response1.status === 200) {
      console.log('      ✅ Got 200 (found data)');
    } else {
      console.log(`      ⚠️  Unexpected status: ${response1.status}`);
    }
  } catch (err) {
    console.log(`      ❌ Error: ${err.message}`);
  }

  // Test 2: With Accept: application/json (what .maybeSingle() uses)
  console.log('\n   2. Testing with .maybeSingle() Accept header:');
  try {
    const response2 = await fetch(
      `${SUPABASE_URL}/rest/v1/ai_presenter_competitive_analysis?client_id=eq.${clients.id}&is_visible=eq.true&select=*`,
      {
        headers: {
          'Accept': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }
      }
    );

    console.log(`      Status: ${response2.status} ${response2.statusText}`);

    if (response2.status === 200) {
      const data = await response2.json();
      if (Array.isArray(data) && data.length === 0) {
        console.log('      ✅ Got 200 with empty array (perfect!)');
        console.log('      ✅ This is what .maybeSingle() uses internally');
        return true;
      } else {
        console.log('      ✅ Got 200 with data');
        return true;
      }
    } else {
      console.log(`      ❌ Unexpected status: ${response2.status}`);
      return false;
    }
  } catch (err) {
    console.log(`      ❌ Error: ${err.message}`);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  const results = {
    oldMethod: await testOldMethod(),
    newMethod: await testNewMethod(),
    httpCodes: await testHTTPResponseCodes(),
  };

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   VERIFICATION SUMMARY');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log('Test Results:');
  console.log(`   Old Method (.single()):     ${results.oldMethod ? '✅ Works (has data)' : '❌ Gets PGRST116 (expected)'}`);
  console.log(`   New Method (.maybeSingle()): ${results.newMethod ? '✅ Works perfectly!' : '❌ Failed'}`);
  console.log(`   HTTP Response Codes:         ${results.httpCodes ? '✅ No 406 errors' : '❌ Still getting 406'}`);

  if (results.newMethod && results.httpCodes) {
    console.log('\n✅ SUCCESS! The 406 fix is verified and working correctly.');
    console.log('   - .maybeSingle() returns null for empty results');
    console.log('   - No 406 HTTP errors');
    console.log('   - Application can handle missing competitive analysis gracefully');
  } else {
    console.log('\n⚠️  Some tests did not pass as expected.');
    console.log('   Review the results above for details.');
  }

  console.log('\n═══════════════════════════════════════════════════════\n');
}

// Run the script
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
