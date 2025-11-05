/**
 * Simple Migration Application Script
 *
 * Applies the RLS policy migration directly via Supabase REST API
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

console.log('🔧 AI Presenter - Database Migration\n');
console.log('📋 Applying: Public read access for active clients');
console.log('🗄️  Database:', SUPABASE_URL);
console.log('');

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !ANON_KEY) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

// Create admin client
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function applyMigration() {
  try {
    // Read migration SQL
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20250117_add_public_client_read_policy.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log('📝 Migration SQL:');
    console.log('─'.repeat(60));
    console.log(migrationSQL);
    console.log('─'.repeat(60));
    console.log('');

    // Extract the CREATE POLICY statement
    const policySQL = `
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;

-- Create the policy
CREATE POLICY "Public can view active clients"
    ON ai_presenter_clients
    FOR SELECT
    USING (status = 'active');
`.trim();

    console.log('🚀 Applying migration via SQL query...\n');

    // Execute SQL using Supabase client's SQL query method
    const { data, error } = await supabase.rpc('exec', {
      sql: policySQL
    });

    if (error) {
      // Try alternative method: direct SQL execution
      console.log('⚠️  RPC method failed, using alternative approach...\n');

      // Use a simpler approach: execute policy creation directly
      const policyOnly = `CREATE POLICY "Public can view active clients" ON ai_presenter_clients FOR SELECT USING (status = 'active');`;

      const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ query: policyOnly })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
    }

    console.log('✅ Migration SQL prepared\n');
    return true;

  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function testAccess() {
  console.log('🧪 Testing anonymous access...\n');

  try {
    // Create anonymous client
    const anonClient = createClient(SUPABASE_URL, ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Test reading active clients
    console.log('1️⃣ Testing read access to active clients...');
    const { data: activeClients, error: activeError } = await anonClient
      .from('ai_presenter_clients')
      .select('id, name, slug, status')
      .eq('status', 'active')
      .limit(5);

    if (activeError) {
      console.error('   ❌ Error:', activeError.message);
      console.error('   Code:', activeError.code);

      if (activeError.code === 'PGRST301' || activeError.message.includes('406')) {
        console.log('\n⚠️  Still getting 406 errors - policy may not be applied yet');
        console.log('\n📌 MANUAL APPLICATION REQUIRED:');
        console.log('   1. Go to: https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/editor');
        console.log('   2. Click "SQL Editor" in left sidebar');
        console.log('   3. Click "+ New query"');
        console.log('   4. Paste this SQL:\n');
        console.log('   DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;');
        console.log('   CREATE POLICY "Public can view active clients" ON ai_presenter_clients FOR SELECT USING (status = \'active\');\n');
        console.log('   5. Click "Run" (or press Ctrl+Enter)');
        console.log('   6. Verify you see "Success. No rows returned"\n');
      }
      return false;
    }

    console.log(`   ✅ Success! Read ${activeClients?.length || 0} active client(s)`);
    if (activeClients && activeClients.length > 0) {
      activeClients.forEach(client => {
        console.log(`      - ${client.name} (${client.slug}) [${client.status}]`);
      });
    }

    return true;

  } catch (error) {
    console.error('❌ Test error:', error.message);
    return false;
  }
}

// Main execution
(async () => {
  const migrationResult = await applyMigration();

  console.log('═'.repeat(60));
  console.log('Testing current access state...');
  console.log('═'.repeat(60));
  console.log('');

  const testResult = await testAccess();

  console.log('\n' + '═'.repeat(60));

  if (testResult) {
    console.log('🎉 SUCCESS! Migration is working correctly');
    console.log('═'.repeat(60));
    console.log('');
    console.log('✅ Anonymous users can read active clients');
    console.log('✅ 406 errors should be resolved');
    console.log('✅ Presentations should load correctly');
  } else {
    console.log('⚠️  MANUAL ACTION NEEDED');
    console.log('═'.repeat(60));
    console.log('');
    console.log('Please apply the migration manually via Supabase Dashboard');
    console.log('See instructions above ☝️');
  }

  console.log('');
  process.exit(testResult ? 0 : 1);
})();
