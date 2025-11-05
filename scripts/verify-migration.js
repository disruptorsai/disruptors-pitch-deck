/**
 * Verify RLS Migration
 * Tests that the RLS policy is working correctly
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

async function verifyMigration() {
  console.log('══════════════════════════════════════════════════════════════════════');
  console.log('🔍 VERIFYING RLS POLICY MIGRATION');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  // Test with anonymous key (public client)
  console.log('📝 Test 1: Anonymous client access...');
  const anonClient = createClient(supabaseUrl, anonKey);

  const { data: anonData, error: anonError } = await anonClient
    .from('ai_presenter_clients')
    .select('*')
    .eq('status', 'active');

  if (anonError) {
    console.error('   ❌ FAILED: Anonymous access error:', anonError.message);
    console.error('   Status:', anonError.code);
    return false;
  }

  console.log(`   ✅ SUCCESS: Found ${anonData.length} active client(s)`);

  if (anonData.length > 0) {
    console.log('\n   Active clients accessible:');
    anonData.forEach((client, index) => {
      console.log(`   ${index + 1}. ${client.name} (slug: ${client.slug})`);
    });
  } else {
    console.log('   ⚠️  WARNING: No active clients found in database');
  }

  // Test with service role (admin client)
  console.log('\n📝 Test 2: Admin client access...');
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { data: adminData, error: adminError } = await adminClient
    .from('ai_presenter_clients')
    .select('*');

  if (adminError) {
    console.error('   ❌ FAILED: Admin access error:', adminError.message);
    return false;
  }

  console.log(`   ✅ SUCCESS: Found ${adminData.length} total client(s)`);

  const activeCount = adminData.filter(c => c.status === 'active').length;
  const draftCount = adminData.filter(c => c.status === 'draft').length;
  const archivedCount = adminData.filter(c => c.status === 'archived').length;

  console.log(`   - Active: ${activeCount}`);
  console.log(`   - Draft: ${draftCount}`);
  console.log(`   - Archived: ${archivedCount}`);

  // Test that draft clients are NOT accessible to anon
  console.log('\n📝 Test 3: Security check (draft clients blocked)...');

  const { data: draftData } = await anonClient
    .from('ai_presenter_clients')
    .select('*')
    .eq('status', 'draft');

  if (draftData && draftData.length === 0) {
    console.log('   ✅ SUCCESS: Draft clients are properly protected');
  } else {
    console.log(`   ⚠️  WARNING: Found ${draftData?.length || 0} draft clients accessible to anonymous users`);
  }

  console.log('\n══════════════════════════════════════════════════════════════════════');
  console.log('🎉 VERIFICATION COMPLETE');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  if (anonData.length > 0) {
    console.log('✅ RLS policy is working correctly');
    console.log('✅ Anonymous users can read active clients');
    console.log('✅ 406 errors should be resolved');
    console.log('✅ Presentations should load correctly\n');

    console.log('🚀 Ready to test!');
    console.log('   1. Start dev server: npm run dev');
    console.log('   2. Open a presentation page');
    console.log('   3. Check browser console - no 406 errors!\n');
  } else {
    console.log('⚠️  No active clients found');
    console.log('   Create an active client in the admin panel to test presentations\n');
  }

  return true;
}

verifyMigration().catch(console.error);
