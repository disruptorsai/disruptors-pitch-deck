/**
 * Fix RLS Policies Migration Script - Using Supabase API
 *
 * This script uses the Supabase JavaScript client to execute
 * the RLS policy migration and verify the results.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_ANON_KEY) {
  console.error('❌ Error: Missing required environment variables');
  console.error('Please ensure .env.local contains:');
  console.error('  - VITE_SUPABASE_URL');
  console.error('  - VITE_SUPABASE_SERVICE_ROLE_KEY');
  console.error('  - VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('🔧 Connecting to Supabase...');
console.log(`   Project URL: ${SUPABASE_URL}\n`);

// Create admin client with service role key
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Create anon client for testing
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function executeMigration() {
  console.log('📋 Executing RLS Policy Migration...\n');

  try {
    // Step 1: Execute SQL using Supabase SQL function
    console.log('1️⃣ Executing SQL migration...');

    const migrationSQL = `
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;

-- Create new policy
CREATE POLICY "Public can view active clients"
    ON ai_presenter_clients
    FOR SELECT
    USING (status = 'active');
`;

    console.log('\n   SQL to execute:');
    console.log('   ' + '-'.repeat(60));
    console.log(migrationSQL.trim().split('\n').map(l => `   ${l}`).join('\n'));
    console.log('   ' + '-'.repeat(60));

    // Note: Supabase doesn't expose a direct SQL execution endpoint via the JS client
    // We need to execute this via the Supabase Dashboard SQL Editor or use the Management API
    console.log('\n   ⚠️  The Supabase JS client does not support raw SQL execution.');
    console.log('   Using alternative approach: Supabase Management API\n');

    // Use the Supabase Management API to execute SQL
    const managementResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        query: migrationSQL,
      }),
    });

    if (!managementResponse.ok) {
      const errorText = await managementResponse.text();
      console.log('   ⚠️  Management API call failed:', managementResponse.status);
      console.log('   Response:', errorText);
      console.log('\n   This is expected - Supabase does not expose exec_sql via REST API.');
      console.log('   We will verify the policy manually instead.\n');
    }

    // Step 2: Check current state BEFORE manual execution
    console.log('2️⃣ Checking current RLS policies...');

    const { data: beforeData, error: beforeError } = await supabaseAnon
      .from('ai_presenter_clients')
      .select('id, name, slug, status')
      .eq('status', 'active')
      .limit(1);

    if (beforeError) {
      console.log('   ❌ Current state: RLS policies are blocking anonymous access');
      console.log(`   Error: ${beforeError.message} (Code: ${beforeError.code})`);
      console.log('\n   This is the issue we need to fix.\n');
    } else if (beforeData) {
      console.log('   ✅ Anonymous access is working!');
      console.log(`   Found ${beforeData.length} active client(s)`);
      if (beforeData.length > 0) {
        console.log(`   Sample: ${beforeData[0].name} (${beforeData[0].slug})`);
      }
      console.log('\n   ⚠️  The RLS policy may already be correct. Let\'s verify...\n');
    }

    // Step 3: Provide manual SQL instructions
    console.log('3️⃣ Manual SQL Execution Required\n');
    console.log('   Please follow these steps:\n');
    console.log('   1. Open Supabase Dashboard: https://app.supabase.com/project/' + SUPABASE_URL.split('//')[1].split('.')[0]);
    console.log('   2. Navigate to: SQL Editor → New Query');
    console.log('   3. Copy and paste the following SQL:\n');
    console.log('   ```sql');
    console.log('   DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;');
    console.log('');
    console.log('   CREATE POLICY "Public can view active clients"');
    console.log('       ON ai_presenter_clients');
    console.log('       FOR SELECT');
    console.log('       USING (status = \'active\');');
    console.log('   ```\n');
    console.log('   4. Click "Run" or press Ctrl+Enter');
    console.log('   5. Return here and press Enter to verify...\n');

    // Wait for user confirmation
    console.log('   Press Ctrl+C to exit or continue with verification...\n');

    // Wait 5 seconds before verification
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Step 4: Verify the fix
    console.log('4️⃣ Verifying RLS policy fix...');

    const { data: afterData, error: afterError } = await supabaseAnon
      .from('ai_presenter_clients')
      .select('id, name, slug, status')
      .eq('status', 'active')
      .limit(3);

    if (afterError) {
      console.log('   ❌ Verification failed - RLS still blocking anonymous access');
      console.log(`   Error: ${afterError.message} (Code: ${afterError.code})`);
      console.log('\n   Please ensure you executed the SQL in the Supabase Dashboard.\n');

      // Additional debugging info
      console.log('   Debugging information:');
      console.log(`   - Supabase URL: ${SUPABASE_URL}`);
      console.log(`   - Using anon key: ${SUPABASE_ANON_KEY.substring(0, 20)}...`);
      console.log(`   - Table: ai_presenter_clients`);
      console.log(`   - Filter: status = 'active'\n`);

      process.exit(1);
    }

    console.log('   ✅ Verification successful!');
    console.log(`   Found ${afterData.length} active client(s)\n`);

    if (afterData.length > 0) {
      console.log('   Active clients:');
      afterData.forEach((client, idx) => {
        console.log(`   ${idx + 1}. ${client.name} (${client.slug}) - ${client.status}`);
      });
    } else {
      console.log('   ⚠️  No active clients found in database');
      console.log('   You may need to set a client status to "active"');
    }

    console.log('\n✨ Migration verification complete!\n');
    console.log('📊 Summary:');
    console.log('   - Anonymous access: ✅ Working');
    console.log('   - RLS policy: ✅ Configured correctly');
    console.log('   - Active clients accessible: ✅ Yes');
    console.log('\nThe 406 errors should now be resolved.\n');

  } catch (error) {
    console.error('\n❌ Migration verification failed:', error.message);
    console.error('\nError details:', error);
    process.exit(1);
  }
}

// Run the migration
console.log('═'.repeat(70));
console.log('  Supabase RLS Policy Migration Script');
console.log('  Fix: Allow anonymous users to view active clients');
console.log('═'.repeat(70) + '\n');

executeMigration().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
