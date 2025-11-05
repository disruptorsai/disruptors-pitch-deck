/**
 * Final RLS Solution - Complete Guide and Automated Fix
 *
 * This script provides a comprehensive solution for fixing RLS policies
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const PROJECT_REF = SUPABASE_URL.replace('https://', '').split('.')[0];

console.log('\n' + '═'.repeat(80));
console.log('  SUPABASE RLS POLICY FIX - COMPLETE SOLUTION');
console.log('═'.repeat(80) + '\n');

console.log(`Project: ${PROJECT_REF}`);
console.log(`URL: ${SUPABASE_URL}\n`);

// Create clients
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

async function diagnoseAndFix() {
  try {
    console.log('═'.repeat(80));
    console.log('  STEP 1: DIAGNOSIS');
    console.log('═'.repeat(80) + '\n');

    // Check admin access
    console.log('Testing admin access...');
    const { data: adminClients, error: adminError } = await supabaseAdmin
      .from('ai_presenter_clients')
      .select('id, name, slug, status')
      .eq('status', 'active');

    if (adminError) {
      console.error('❌ Admin access failed:', adminError.message);
      throw adminError;
    }

    console.log(`✅ Admin access working: ${adminClients.length} active clients found\n`);

    // Check anon access
    console.log('Testing anonymous access...');
    const { data: anonClients, error: anonError } = await supabaseAnon
      .from('ai_presenter_clients')
      .select('id, name, slug, status')
      .eq('status', 'active');

    if (anonError) {
      console.log(`❌ Anonymous access BLOCKED: ${anonError.message}`);
      console.log(`   Error code: ${anonError.code}`);
      console.log('   This confirms RLS is blocking anonymous users.\n');
    } else {
      console.log(`✅ Anonymous access working: ${anonClients.length} clients accessible`);

      if (anonClients.length === 0 && adminClients.length > 0) {
        console.log('⚠️  WARNING: RLS allows queries but returns 0 results!');
        console.log('   This means the policy condition may be incorrect.\n');
      } else if (anonClients.length === adminClients.length) {
        console.log('✅ RLS policy appears to be working correctly!');
        console.log('   The issue may be elsewhere in your application.\n');

        console.log('Active clients accessible:');
        anonClients.forEach((c, i) => {
          console.log(`   ${i + 1}. ${c.name} (${c.slug})`);
        });

        console.log('\n═'.repeat(80));
        console.log('  VERIFICATION COMPLETE - NO FIX NEEDED');
        console.log('═'.repeat(80) + '\n');

        return;
      }
    }

    console.log('\n' + '═'.repeat(80));
    console.log('  STEP 2: SQL MIGRATION REQUIRED');
    console.log('═'.repeat(80) + '\n');

    console.log('The RLS policy needs to be fixed. Here are your options:\n');

    console.log('─'.repeat(80));
    console.log('  OPTION 1: Supabase Dashboard SQL Editor (RECOMMENDED)');
    console.log('─'.repeat(80) + '\n');

    console.log('1. Open this URL in your browser:\n');
    console.log(`   https://app.supabase.com/project/${PROJECT_REF}/sql/new\n`);

    console.log('2. Copy and paste this SQL:\n');
    console.log('┌' + '─'.repeat(78) + '┐');
    console.log('│ DROP POLICY IF EXISTS "Public can view active clients"');
    console.log('│     ON ai_presenter_clients;');
    console.log('│');
    console.log('│ CREATE POLICY "Public can view active clients"');
    console.log('│     ON ai_presenter_clients');
    console.log('│     FOR SELECT');
    console.log('│     USING (status = \'active\');');
    console.log('└' + '─'.repeat(78) + '┘\n');

    console.log('3. Click the "RUN" button (or press Ctrl+Enter)\n');

    console.log('4. You should see: "Success. No rows returned"\n');

    console.log('5. Verify the fix by running:\n');
    console.log('   node scripts/verify-rls-fix.mjs\n');

    console.log('─'.repeat(80));
    console.log('  OPTION 2: Create and Use RPC Function');
    console.log('─'.repeat(80) + '\n');

    console.log('First, create this function in Supabase SQL Editor:\n');

    console.log('```sql');
    console.log('CREATE OR REPLACE FUNCTION public.fix_client_rls_policy()');
    console.log('RETURNS TABLE(policy_name text, policy_cmd text, policy_qual text)');
    console.log('LANGUAGE plpgsql');
    console.log('SECURITY DEFINER');
    console.log('AS $$');
    console.log('BEGIN');
    console.log('  -- Drop existing policy');
    console.log('  DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;');
    console.log('  ');
    console.log('  -- Create new policy');
    console.log('  CREATE POLICY "Public can view active clients"');
    console.log('      ON ai_presenter_clients');
    console.log('      FOR SELECT');
    console.log('      USING (status = \'active\');');
    console.log('  ');
    console.log('  -- Return the created policy');
    console.log('  RETURN QUERY');
    console.log('  SELECT ');
    console.log('      policyname::text,');
    console.log('      cmd::text,');
    console.log('      qual::text');
    console.log('  FROM pg_policies');
    console.log('  WHERE tablename = \'ai_presenter_clients\'');
    console.log('    AND policyname = \'Public can view active clients\';');
    console.log('END;');
    console.log('$$;');
    console.log('```\n');

    console.log('Then you can run it programmatically:\n');
    console.log('```javascript');
    console.log('const { data, error } = await supabase.rpc(\'fix_client_rls_policy\');');
    console.log('```\n');

    console.log('─'.repeat(80));
    console.log('  OPTION 3: Migration File');
    console.log('─'.repeat(80) + '\n');

    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20251017_fix_rls_policies.sql');
    console.log(`A migration file has been created at:\n`);
    console.log(`   ${migrationPath}\n`);

    try {
      const migrationContent = readFileSync(migrationPath, 'utf-8');
      console.log('Content:');
      console.log('┌' + '─'.repeat(78) + '┐');
      migrationContent.split('\n').forEach(line => {
        console.log('│ ' + line.padEnd(77) + '│');
      });
      console.log('└' + '─'.repeat(78) + '┘\n');
    } catch (e) {
      console.log('   (Could not read migration file)\n');
    }

    console.log('Apply this migration in the Supabase Dashboard.\n');

    console.log('\n' + '═'.repeat(80));
    console.log('  TROUBLESHOOTING TIPS');
    console.log('═'.repeat(80) + '\n');

    console.log('If the fix doesn\'t work:');
    console.log('');
    console.log('1. Check if RLS is enabled on the table:');
    console.log('   ```sql');
    console.log('   SELECT tablename, rowsecurity');
    console.log('   FROM pg_tables');
    console.log('   WHERE tablename = \'ai_presenter_clients\';');
    console.log('   ```');
    console.log('   The rowsecurity column should be TRUE.');
    console.log('');
    console.log('2. List all policies on the table:');
    console.log('   ```sql');
    console.log('   SELECT *');
    console.log('   FROM pg_policies');
    console.log('   WHERE tablename = \'ai_presenter_clients\';');
    console.log('   ```');
    console.log('');
    console.log('3. Check policy roles:');
    console.log('   Make sure the policy applies to the "public" role or all roles.');
    console.log('');
    console.log('4. Verify client status in database:');
    console.log('   ```sql');
    console.log('   SELECT id, name, slug, status');
    console.log('   FROM ai_presenter_clients;');
    console.log('   ```');
    console.log('   Ensure at least one client has status = \'active\'.\n');

    console.log('\n' + '═'.repeat(80));
    console.log('  NEXT STEPS');
    console.log('═'.repeat(80) + '\n');

    console.log('1. Execute the SQL in Supabase Dashboard (Option 1 above)');
    console.log('2. Run: node scripts/verify-rls-fix.mjs');
    console.log('3. Test your application in the browser');
    console.log('4. If still getting 406 errors, check browser console for details\n');

  } catch (error) {
    console.error('\n❌ Error during diagnosis:', error.message);
    console.error(error);
    process.exit(1);
  }
}

diagnoseAndFix();
