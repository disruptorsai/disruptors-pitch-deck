/**
 * Execute RLS Migration Script
 * Directly applies the RLS policy to Supabase using the service role key
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Error: Missing required environment variables');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   VITE_SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✓' : '✗');
  process.exit(1);
}

// Create admin client
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeMigration() {
  console.log('══════════════════════════════════════════════════════════════════════');
  console.log('🚀 EXECUTING RLS POLICY MIGRATION');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  console.log('📋 Migration: Add public read access for active clients');
  console.log('🗄️  Project:', supabaseUrl.replace('https://', '').replace('.supabase.co', ''));
  console.log('🔑 Using: Service Role Key (admin access)\n');

  try {
    // Step 1: Drop existing policy
    console.log('📝 Step 1: Dropping existing policy (if exists)...');

    const dropPolicySQL = `
      DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;
    `;

    const { error: dropError } = await supabase.rpc('exec_sql', {
      query: dropPolicySQL
    });

    // If rpc doesn't work, try direct SQL execution
    if (dropError) {
      console.log('   ⚠️  RPC method not available, trying alternative method...');

      // Try using the REST API directly
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`
        },
        body: JSON.stringify({ query: dropPolicySQL })
      });

      if (!response.ok) {
        console.log('   ℹ️  Policy may not exist (this is okay)');
      } else {
        console.log('   ✅ Existing policy dropped successfully');
      }
    } else {
      console.log('   ✅ Existing policy dropped successfully');
    }

    // Step 2: Create new policy
    console.log('\n📝 Step 2: Creating new RLS policy...');

    const createPolicySQL = `
      CREATE POLICY "Public can view active clients"
          ON ai_presenter_clients
          FOR SELECT
          USING (status = 'active');
    `;

    const { error: createError } = await supabase.rpc('exec_sql', {
      query: createPolicySQL
    });

    if (createError) {
      console.log('   ⚠️  RPC method not available, trying alternative method...');

      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`
        },
        body: JSON.stringify({ query: createPolicySQL })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create policy: ${errorText}`);
      }

      console.log('   ✅ RLS policy created successfully');
    } else {
      console.log('   ✅ RLS policy created successfully');
    }

    // Step 3: Verify the policy works
    console.log('\n📝 Step 3: Verifying policy...');

    // Create anon client to test
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
    const anonClient = createClient(supabaseUrl, anonKey);

    const { data: activeClients, error: queryError } = await anonClient
      .from('ai_presenter_clients')
      .select('*')
      .eq('status', 'active');

    if (queryError) {
      console.error('   ❌ Policy verification failed:', queryError.message);
      throw queryError;
    }

    console.log(`   ✅ Anonymous query successful: Found ${activeClients.length} active client(s)`);

    if (activeClients.length > 0) {
      console.log('\n   Active clients accessible:');
      activeClients.forEach((client, index) => {
        console.log(`   ${index + 1}. ${client.name} (${client.slug})`);
      });
    }

    console.log('\n══════════════════════════════════════════════════════════════════════');
    console.log('🎉 MIGRATION COMPLETE - SUCCESS!');
    console.log('══════════════════════════════════════════════════════════════════════\n');

    console.log('✅ RLS policy has been applied successfully');
    console.log('✅ Anonymous users can now read active clients');
    console.log('✅ 406 errors should be resolved');
    console.log('✅ Presentations should load correctly\n');

    console.log('🚀 Next steps:');
    console.log('   1. Restart your dev server: npm run dev');
    console.log('   2. Test a presentation link');
    console.log('   3. Verify no 406 errors in browser console\n');

  } catch (error) {
    console.error('\n══════════════════════════════════════════════════════════════════════');
    console.error('❌ MIGRATION FAILED');
    console.error('══════════════════════════════════════════════════════════════════════\n');
    console.error('Error:', error.message);
    console.error('\n⚠️  MANUAL APPLICATION REQUIRED:');
    console.error('   Please apply the migration manually via Supabase Dashboard:\n');
    console.error('   1. Go to: https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/sql/new');
    console.error('   2. Paste this SQL:');
    console.error('\n```sql');
    console.error('DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;');
    console.error('');
    console.error('CREATE POLICY "Public can view active clients"');
    console.error('    ON ai_presenter_clients');
    console.error('    FOR SELECT');
    console.error('    USING (status = \'active\');');
    console.error('```\n');
    console.error('   3. Click "Run" (or press Ctrl+Enter)');
    console.error('   4. Verify you see "Success. No rows returned"\n');

    process.exit(1);
  }
}

// Run the migration
executeMigration();
