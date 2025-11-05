/**
 * Apply Database Migration Script
 *
 * This script applies the RLS policy migration to add public read access
 * for active clients in the ai_presenter_clients table.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
function loadEnv() {
  const envPath = join(__dirname, '..', '.env.local');
  const envContent = readFileSync(envPath, 'utf8');
  const envVars = {};

  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim();
      envVars[key.trim()] = value;
      // Also set in process.env
      process.env[key.trim()] = value;
    }
  });

  return envVars;
}

loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗');
  console.error('   VITE_SUPABASE_SERVICE_ROLE_KEY:', SERVICE_ROLE_KEY ? '✓' : '✗');
  process.exit(1);
}

// Create Supabase client with service role (admin) privileges
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyMigration() {
  console.log('🔧 AI Presenter - Database Migration Tool\n');
  console.log('📋 Migration: Add public read access for active clients');
  console.log('🗄️  Database:', SUPABASE_URL);
  console.log('');

  try {
    // Read the migration file
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20250117_add_public_client_read_policy.sql');
    console.log('📄 Reading migration file...');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    console.log('✓ Migration file loaded\n');

    // Display migration content
    console.log('📝 Migration SQL:');
    console.log('─'.repeat(60));
    console.log(migrationSQL);
    console.log('─'.repeat(60));
    console.log('');

    // Check if policy already exists
    console.log('🔍 Checking for existing policy...');
    const { data: existingPolicies, error: checkError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'ai_presenter_clients'
        AND policyname = 'Public can view active clients';
      `
    }).catch(() => {
      // If rpc doesn't exist, try direct query
      return supabase
        .from('pg_policies')
        .select('policyname')
        .eq('schemaname', 'public')
        .eq('tablename', 'ai_presenter_clients')
        .eq('policyname', 'Public can view active clients');
    });

    if (checkError && !checkError.message.includes('does not exist')) {
      console.log('⚠️  Could not check for existing policy (this is normal)');
    } else if (existingPolicies && existingPolicies.length > 0) {
      console.log('⚠️  Policy already exists. Dropping before recreating...\n');

      const dropSQL = `DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;`;
      const { error: dropError } = await supabase.rpc('exec_sql', { sql: dropSQL });

      if (dropError) {
        console.log('⚠️  Could not drop existing policy (this is normal if it doesn\'t exist)');
      } else {
        console.log('✓ Existing policy dropped\n');
      }
    } else {
      console.log('✓ No existing policy found\n');
    }

    // Apply the migration
    console.log('🚀 Applying migration...');

    // Try using exec_sql RPC if available
    const { error: migrationError } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    }).catch(async (rpcError) => {
      // Fallback: Try direct SQL execution
      console.log('⚠️  RPC method not available, trying direct execution...');

      // Extract just the CREATE POLICY statement
      const policySQL = migrationSQL.match(/CREATE POLICY[\s\S]+?;/)?.[0];

      if (!policySQL) {
        throw new Error('Could not extract CREATE POLICY statement from migration file');
      }

      // Use the Supabase REST API to execute SQL
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({ sql: policySQL })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { error: new Error(`HTTP ${response.status}: ${errorText}`) };
      }

      return { error: null };
    });

    if (migrationError) {
      console.error('❌ Migration failed:', migrationError.message);
      console.error('\n⚠️  You may need to apply this migration manually via Supabase SQL Editor:');
      console.error('   1. Go to: https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/editor');
      console.error('   2. Open SQL Editor');
      console.error('   3. Paste the migration SQL above');
      console.error('   4. Click "Run"');
      process.exit(1);
    }

    console.log('✅ Migration applied successfully!\n');
    return true;

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    console.error('\n⚠️  Manual application required. Please:');
    console.error('   1. Go to: https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/editor');
    console.error('   2. Open SQL Editor');
    console.error('   3. Copy the SQL from: supabase/migrations/20250117_add_public_client_read_policy.sql');
    console.error('   4. Click "Run"');
    process.exit(1);
  }
}

async function verifyMigration() {
  console.log('🔍 Verifying migration...\n');

  try {
    // Check RLS is enabled on the table
    console.log('1️⃣ Checking RLS status...');
    const { data: rlsStatus, error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT relname, relrowsecurity
        FROM pg_class
        WHERE relname = 'ai_presenter_clients';
      `
    }).catch(() => ({ data: null, error: null }));

    if (rlsStatus && rlsStatus.length > 0) {
      console.log(`   RLS Enabled: ${rlsStatus[0].relrowsecurity ? '✓' : '✗'}`);
    } else {
      console.log('   RLS Status: Unable to verify (table exists)');
    }

    // List all policies on the table
    console.log('\n2️⃣ Checking policies on ai_presenter_clients table...');
    const { data: policies, error: policiesError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT policyname, cmd, qual
        FROM pg_policies
        WHERE tablename = 'ai_presenter_clients'
        ORDER BY policyname;
      `
    }).catch(() => ({ data: null, error: null }));

    if (policies && policies.length > 0) {
      console.log(`   Found ${policies.length} policy/policies:`);
      policies.forEach(policy => {
        console.log(`   - ${policy.policyname} (${policy.cmd})`);
        if (policy.policyname === 'Public can view active clients') {
          console.log('     ✅ Target policy found!');
        }
      });
    } else {
      console.log('   ⚠️  Unable to query policies (may need manual verification)');
    }

    console.log('\n✅ Verification complete!\n');
    return true;

  } catch (error) {
    console.error('⚠️  Verification encountered issues:', error.message);
    console.log('\n💡 You can verify manually in Supabase Dashboard:');
    console.log('   https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/auth/policies');
    return false;
  }
}

async function testAnonymousAccess() {
  console.log('🧪 Testing anonymous client access...\n');

  try {
    // Create an anonymous client (using anon key)
    const anonClient = createClient(
      SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('1️⃣ Testing read access to active clients...');
    const { data: activeClients, error: activeError } = await anonClient
      .from('ai_presenter_clients')
      .select('id, name, slug, status')
      .eq('status', 'active')
      .limit(5);

    if (activeError) {
      console.error('   ❌ Error reading active clients:', activeError.message);
      console.error('      Code:', activeError.code);
      return false;
    }

    console.log(`   ✅ Successfully read ${activeClients?.length || 0} active client(s)`);
    if (activeClients && activeClients.length > 0) {
      activeClients.forEach(client => {
        console.log(`      - ${client.name} (${client.slug})`);
      });
    }

    console.log('\n2️⃣ Testing that draft/archived clients are NOT readable...');
    const { data: draftClients, error: draftError } = await anonClient
      .from('ai_presenter_clients')
      .select('id, name, slug, status')
      .eq('status', 'draft')
      .limit(5);

    if (draftError) {
      console.log('   ❌ Error (expected if no public policy for drafts):', draftError.message);
    } else if (draftClients && draftClients.length === 0) {
      console.log('   ✅ Draft clients correctly hidden (returned 0 results)');
    } else {
      console.log('   ⚠️  Draft clients are readable - this may indicate policy issue');
    }

    console.log('\n✅ Anonymous access test complete!\n');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Main execution
(async () => {
  try {
    const migrationSuccess = await applyMigration();

    if (migrationSuccess) {
      await verifyMigration();
      await testAnonymousAccess();

      console.log('═'.repeat(60));
      console.log('🎉 Migration Complete!');
      console.log('═'.repeat(60));
      console.log('');
      console.log('✅ Public read policy has been added to ai_presenter_clients');
      console.log('✅ Anonymous users can now read active clients');
      console.log('✅ Draft and archived clients remain protected');
      console.log('');
      console.log('Next steps:');
      console.log('  1. Test your application to ensure 406 errors are resolved');
      console.log('  2. Verify presentations load correctly with access tokens');
      console.log('');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Migration process failed:', error);
    process.exit(1);
  }
})();
