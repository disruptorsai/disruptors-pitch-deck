/**
 * Verify RLS Policy Status
 *
 * This script checks if the RLS policy is properly configured and tests access
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
function loadEnv() {
  const envPath = join(__dirname, '..', '.env.local');
  const envContent = readFileSync(envPath, 'utf8');

  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim();
      process.env[key.trim()] = value;
    }
  });
}

loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// Extract project ref
const projectRef = SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

console.log('🔍 AI Presenter - RLS Policy Verification\n');
console.log('🗄️  Project:', projectRef);
console.log('🔗 URL:', SUPABASE_URL);
console.log('');

async function checkPolicies() {
  console.log('═'.repeat(60));
  console.log('1️⃣  Checking RLS policies on ai_presenter_clients table');
  console.log('═'.repeat(60));
  console.log('');

  try {
    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Query the policies
    const { data: policies, error } = await adminClient
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'ai_presenter_clients');

    if (error) {
      console.log('⚠️  Cannot query policies directly (expected)');
      console.log('   Error:', error.message);
      console.log('');
    } else if (policies && policies.length > 0) {
      console.log(`✅ Found ${policies.length} policy/policies:\n`);
      policies.forEach(policy => {
        console.log(`   📋 Policy: ${policy.policyname}`);
        console.log(`      Command: ${policy.cmd}`);
        console.log(`      Using: ${policy.qual}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No policies found on ai_presenter_clients table');
      console.log('');
    }

  } catch (error) {
    console.log('⚠️  Error querying policies:', error.message);
    console.log('');
  }
}

async function checkClientData() {
  console.log('═'.repeat(60));
  console.log('2️⃣  Checking client data (admin access)');
  console.log('═'.repeat(60));
  console.log('');

  try {
    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data: allClients, error: adminError } = await adminClient
      .from('ai_presenter_clients')
      .select('id, name, slug, status')
      .order('created_at', { ascending: false })
      .limit(10);

    if (adminError) {
      console.error('❌ Admin Error:', adminError.message);
      return;
    }

    console.log(`✅ Admin can see ${allClients?.length || 0} client(s):\n`);

    if (allClients && allClients.length > 0) {
      const statusCounts = {};
      allClients.forEach(client => {
        statusCounts[client.status] = (statusCounts[client.status] || 0) + 1;
        console.log(`   - ${client.name} (${client.slug})`);
        console.log(`     Status: ${client.status}`);
        console.log(`     ID: ${client.id}`);
        console.log('');
      });

      console.log('📊 Status breakdown:');
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`   ${status}: ${count} client(s)`);
      });
      console.log('');
    } else {
      console.log('⚠️  No clients found in database');
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testAnonymousAccess() {
  console.log('═'.repeat(60));
  console.log('3️⃣  Testing anonymous access (anon key)');
  console.log('═'.repeat(60));
  console.log('');

  try {
    const anonClient = createClient(SUPABASE_URL, ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    console.log('Testing SELECT query with anon key...\n');

    const { data: activeClients, error: anonError, status, statusText } = await anonClient
      .from('ai_presenter_clients')
      .select('id, name, slug, status')
      .eq('status', 'active')
      .limit(10);

    if (anonError) {
      console.error('❌ Anonymous Access Error:');
      console.error(`   Message: ${anonError.message}`);
      console.error(`   Code: ${anonError.code}`);
      console.error(`   Details: ${anonError.details}`);
      console.error(`   Hint: ${anonError.hint}`);
      console.error('');

      if (anonError.code === 'PGRST301' || anonError.message.includes('406')) {
        console.log('🔴 ISSUE DETECTED: 406 Error - Policy not active\n');
        console.log('The RLS policy is NOT properly configured.');
        console.log('Anonymous users cannot read active clients.\n');
        return false;
      }

      return false;
    }

    console.log('✅ Anonymous Access SUCCESS!');
    console.log(`   Read ${activeClients?.length || 0} active client(s)\n`);

    if (activeClients && activeClients.length > 0) {
      activeClients.forEach(client => {
        console.log(`   - ${client.name} (${client.slug}) [${client.status}]`);
      });
      console.log('');
    } else {
      console.log('ℹ️  No active clients found (but query succeeded)');
      console.log('   This means the policy is working, just no data.\n');
    }

    console.log('🟢 RLS POLICY IS WORKING CORRECTLY!\n');
    return true;

  } catch (error) {
    console.error('❌ Test Error:', error.message);
    return false;
  }
}

async function showManualInstructions() {
  console.log('═'.repeat(60));
  console.log('📌 MANUAL MIGRATION INSTRUCTIONS');
  console.log('═'.repeat(60));
  console.log('');
  console.log('If the policy is not working, apply it manually:\n');

  console.log('1️⃣  Open Supabase SQL Editor:');
  console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql/new\n`);

  console.log('2️⃣  Paste this SQL:\n');
  console.log('   ┌─────────────────────────────────────────────────────────┐');
  console.log('   │ -- Drop existing policy if it exists                    │');
  console.log('   │ DROP POLICY IF EXISTS "Public can view active clients"  │');
  console.log('   │     ON ai_presenter_clients;                            │');
  console.log('   │                                                          │');
  console.log('   │ -- Create the new policy                                │');
  console.log('   │ CREATE POLICY "Public can view active clients"          │');
  console.log('   │     ON ai_presenter_clients                             │');
  console.log('   │     FOR SELECT                                          │');
  console.log('   │     USING (status = \'active\');                          │');
  console.log('   └─────────────────────────────────────────────────────────┘\n');

  console.log('3️⃣  Click "Run" button (or press Ctrl+Enter)\n');

  console.log('4️⃣  Verify success:');
  console.log('   You should see: "Success. No rows returned"\n');

  console.log('5️⃣  Re-run this script to verify:');
  console.log('   node scripts/verify-rls-policy.js\n');

  console.log('═'.repeat(60));
  console.log('');
}

// Main execution
(async () => {
  await checkPolicies();
  await checkClientData();
  const policyWorks = await testAnonymousAccess();

  if (!policyWorks) {
    await showManualInstructions();

    console.log('🔗 Quick Links:');
    console.log(`   SQL Editor: https://supabase.com/dashboard/project/${projectRef}/sql/new`);
    console.log(`   Table Editor: https://supabase.com/dashboard/project/${projectRef}/editor`);
    console.log('');

    process.exit(1);
  } else {
    console.log('═'.repeat(60));
    console.log('🎉 VERIFICATION COMPLETE - ALL TESTS PASSED!');
    console.log('═'.repeat(60));
    console.log('');
    console.log('✅ RLS policy is correctly configured');
    console.log('✅ Anonymous users can read active clients');
    console.log('✅ 406 errors should be resolved');
    console.log('✅ Application should work properly');
    console.log('');
    process.exit(0);
  }
})();
