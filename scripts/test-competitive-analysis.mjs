#!/usr/bin/env node

/**
 * Test Competitive Analysis Table Access
 *
 * This script tests different ways to access the competitive_analysis table
 * to diagnose the 406 error.
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
console.log('   COMPETITIVE ANALYSIS TABLE ACCESS TEST');
console.log('═══════════════════════════════════════════════════════\n');

/**
 * Test 1: Basic SELECT with admin client
 */
async function testAdminSelect() {
  console.log('🧪 Test 1: Admin Client - Basic SELECT');

  const { data, error } = await adminClient
    .from('ai_presenter_competitive_analysis')
    .select('*');

  if (error) {
    console.log('   ❌ Error:', error);
    return false;
  } else {
    console.log(`   ✅ Success - Found ${data.length} rows`);
    if (data.length > 0) {
      console.log('   Sample row:', JSON.stringify(data[0], null, 2).substring(0, 200));
    }
    return true;
  }
}

/**
 * Test 2: SELECT with specific columns
 */
async function testAdminSelectColumns() {
  console.log('\n🧪 Test 2: Admin Client - SELECT specific columns');

  const { data, error } = await adminClient
    .from('ai_presenter_competitive_analysis')
    .select('id, client_id, title, executive_summary');

  if (error) {
    console.log('   ❌ Error:', error);
    return false;
  } else {
    console.log(`   ✅ Success - Found ${data.length} rows`);
    return true;
  }
}

/**
 * Test 3: Public client access
 */
async function testPublicSelect() {
  console.log('\n🧪 Test 3: Public Client (Anon Key) - Basic SELECT');

  const { data, error } = await publicClient
    .from('ai_presenter_competitive_analysis')
    .select('*');

  if (error) {
    console.log('   ❌ Error:', error);
    console.log('   Error code:', error.code);
    console.log('   Error details:', error.details);
    console.log('   Error hint:', error.hint);
    return false;
  } else {
    console.log(`   ✅ Success - Found ${data.length} rows`);
    return true;
  }
}

/**
 * Test 4: Check table structure
 */
async function testTableStructure() {
  console.log('\n🧪 Test 4: Check Table Structure');

  const query = `
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ai_presenter_competitive_analysis'
    ORDER BY ordinal_position;
  `;

  const { data, error } = await adminClient.rpc('exec', { sql: query });

  if (error) {
    console.log('   ⚠️  Cannot check structure (RPC not available)');
    console.log('   Error:', error.message);
    return false;
  } else {
    console.log('   ✅ Table structure:');
    data.forEach(col => {
      console.log(`      - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    return true;
  }
}

/**
 * Test 5: Check RLS policies
 */
async function testRLSPolicies() {
  console.log('\n🧪 Test 5: Check RLS Policies');

  const query = `
    SELECT policyname, permissive, roles, cmd, qual, with_check
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'ai_presenter_competitive_analysis';
  `;

  const { data, error } = await adminClient.rpc('exec', { sql: query });

  if (error) {
    console.log('   ⚠️  Cannot check RLS policies (RPC not available)');
    console.log('   Error:', error.message);
    return false;
  } else {
    if (data.length === 0) {
      console.log('   ⚠️  No RLS policies found!');
      return false;
    }

    console.log(`   ✅ Found ${data.length} RLS policies:`);
    data.forEach(policy => {
      console.log(`      - ${policy.policyname} (${policy.cmd}) for roles: ${policy.roles.join(', ')}`);
    });
    return true;
  }
}

/**
 * Test 6: Insert test data
 */
async function testInsertData() {
  console.log('\n🧪 Test 6: Insert Test Data');

  // First get a client ID
  const { data: clients, error: clientError } = await adminClient
    .from('ai_presenter_clients')
    .select('id')
    .limit(1)
    .single();

  if (clientError || !clients) {
    console.log('   ⚠️  No clients found to test with');
    return false;
  }

  const testData = {
    client_id: clients.id,
    title: 'Test Competitive Analysis',
    executive_summary: 'This is a test summary',
    market_size: 'Large market',
    generated_by_ai: true,
    ai_model: 'test-model',
    is_visible: true
  };

  const { data, error } = await adminClient
    .from('ai_presenter_competitive_analysis')
    .insert(testData)
    .select()
    .single();

  if (error) {
    console.log('   ❌ Error inserting:', error);
    return false;
  } else {
    console.log('   ✅ Successfully inserted test data');
    console.log('   ID:', data.id);

    // Clean up
    const { error: deleteError } = await adminClient
      .from('ai_presenter_competitive_analysis')
      .delete()
      .eq('id', data.id);

    if (deleteError) {
      console.log('   ⚠️  Warning: Could not delete test data');
    } else {
      console.log('   ✅ Test data cleaned up');
    }

    return true;
  }
}

/**
 * Test 7: Check content negotiation headers
 */
async function testContentNegotiation() {
  console.log('\n🧪 Test 7: Test Content Negotiation (406 Error Check)');

  // Test with different Accept headers
  const headers = [
    { 'Accept': 'application/json' },
    { 'Accept': 'application/vnd.pgrst.object+json' },
    { 'Accept': '*/*' },
  ];

  for (const header of headers) {
    console.log(`   Testing with Accept: ${header.Accept}`);

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/ai_presenter_competitive_analysis?select=*`,
        {
          headers: {
            ...header,
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          }
        }
      );

      console.log(`      Status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        console.log(`      ✅ Success - ${Array.isArray(data) ? data.length : 'single'} rows`);
      } else {
        const text = await response.text();
        console.log(`      ❌ Failed: ${text.substring(0, 100)}`);
      }
    } catch (error) {
      console.log(`      ❌ Error: ${error.message}`);
    }
  }

  return true;
}

/**
 * Test 8: Check if table has RLS enabled
 */
async function testRLSEnabled() {
  console.log('\n🧪 Test 8: Check RLS Status');

  const query = `
    SELECT tablename, rowsecurity
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename = 'ai_presenter_competitive_analysis';
  `;

  const { data, error } = await adminClient.rpc('exec', { sql: query });

  if (error) {
    console.log('   ⚠️  Cannot check RLS status (RPC not available)');
    return false;
  } else {
    if (data.length === 0) {
      console.log('   ❌ Table not found!');
      return false;
    }

    const rlsEnabled = data[0].rowsecurity;
    if (rlsEnabled) {
      console.log('   ✅ RLS is ENABLED');
    } else {
      console.log('   ⚠️  RLS is DISABLED');
    }
    return rlsEnabled;
  }
}

/**
 * Main execution
 */
async function main() {
  const results = {
    adminSelect: await testAdminSelect(),
    adminSelectColumns: await testAdminSelectColumns(),
    publicSelect: await testPublicSelect(),
    contentNegotiation: await testContentNegotiation(),
    insertData: await testInsertData(),
  };

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════\n');

  Object.entries(results).forEach(([test, passed]) => {
    console.log(`   ${passed ? '✅' : '❌'} ${test}`);
  });

  console.log('\n═══════════════════════════════════════════════════════\n');
}

// Run the script
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
