/**
 * Debug Client Access
 *
 * Detailed debugging of the active client access issue
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

console.log('🐛 Debugging Active Client Access\n');
console.log('═'.repeat(60));
console.log('');

const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const anonClient = createClient(SUPABASE_URL, ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  console.log('Step 1: Get active client details (admin view)\n');

  const { data: activeClients, error: adminError } = await adminClient
    .from('ai_presenter_clients')
    .select('*')
    .eq('status', 'active');

  if (adminError) {
    console.error('Admin query error:', adminError);
    return;
  }

  console.log(`Found ${activeClients?.length || 0} active client(s):\n`);

  if (activeClients && activeClients.length > 0) {
    activeClients.forEach((client, idx) => {
      console.log(`Client ${idx + 1}:`);
      console.log(`  ID: ${client.id}`);
      console.log(`  Name: ${client.name}`);
      console.log(`  Slug: ${client.slug}`);
      console.log(`  Status: ${client.status}`);
      console.log(`  Status Type: ${typeof client.status}`);
      console.log(`  Status === 'active': ${client.status === 'active'}`);
      console.log(`  Status String: "${client.status}"`);
      console.log(`  Status Bytes: ${Array.from(client.status).map(c => c.charCodeAt(0)).join(',')}`);
      console.log('');
    });
  }

  console.log('─'.repeat(60));
  console.log('');

  console.log('Step 2: Try anonymous access with different queries\n');

  // Query 1: eq('status', 'active')
  console.log('Query 1: .eq("status", "active")');
  const { data: q1Data, error: q1Error, count: q1Count } = await anonClient
    .from('ai_presenter_clients')
    .select('*', { count: 'exact' })
    .eq('status', 'active');

  if (q1Error) {
    console.log('  ❌ Error:', q1Error.message, `(${q1Error.code})`);
  } else {
    console.log(`  ✅ Success: ${q1Data?.length || 0} rows, count: ${q1Count}`);
    if (q1Data && q1Data.length > 0) {
      q1Data.forEach(c => console.log(`     - ${c.name} (${c.status})`));
    }
  }
  console.log('');

  // Query 2: No filter
  console.log('Query 2: No filter (should only return active due to RLS)');
  const { data: q2Data, error: q2Error, count: q2Count } = await anonClient
    .from('ai_presenter_clients')
    .select('*', { count: 'exact' });

  if (q2Error) {
    console.log('  ❌ Error:', q2Error.message, `(${q2Error.code})`);
  } else {
    console.log(`  ✅ Success: ${q2Data?.length || 0} rows, count: ${q2Count}`);
    if (q2Data && q2Data.length > 0) {
      q2Data.forEach(c => console.log(`     - ${c.name} (${c.status})`));
    }
  }
  console.log('');

  // Query 3: Filter by slug
  if (activeClients && activeClients.length > 0) {
    const activeSlug = activeClients[0].slug;
    console.log(`Query 3: .eq("slug", "${activeSlug}")`);
    const { data: q3Data, error: q3Error } = await anonClient
      .from('ai_presenter_clients')
      .select('*')
      .eq('slug', activeSlug);

    if (q3Error) {
      console.log('  ❌ Error:', q3Error.message, `(${q3Error.code})`);
    } else {
      console.log(`  ✅ Success: ${q3Data?.length || 0} rows`);
      if (q3Data && q3Data.length > 0) {
        q3Data.forEach(c => console.log(`     - ${c.name} (${c.status})`));
      }
    }
    console.log('');

    // Query 4: Filter by ID
    const activeId = activeClients[0].id;
    console.log(`Query 4: .eq("id", "${activeId}")`);
    const { data: q4Data, error: q4Error } = await anonClient
      .from('ai_presenter_clients')
      .select('*')
      .eq('id', activeId);

    if (q4Error) {
      console.log('  ❌ Error:', q4Error.message, `(${q4Error.code})`);
    } else {
      console.log(`  ✅ Success: ${q4Data?.length || 0} rows`);
      if (q4Data && q4Data.length > 0) {
        q4Data.forEach(c => console.log(`     - ${c.name} (${c.status})`));
      }
    }
    console.log('');
  }

  console.log('═'.repeat(60));
  console.log('');

  console.log('📊 Analysis:\n');

  if (activeClients && activeClients.length > 0) {
    const adminCount = activeClients.length;
    const anonCount = q1Data?.length || 0;

    if (adminCount > 0 && anonCount === 0) {
      console.log('🚨 ISSUE DETECTED:');
      console.log(`  - Admin sees ${adminCount} active client(s)`);
      console.log(`  - Anon sees ${anonCount} active client(s)`);
      console.log('');
      console.log('Possible causes:');
      console.log('  1. RLS policy may not be created yet');
      console.log('  2. RLS policy exists but has incorrect condition');
      console.log('  3. Another RLS policy is blocking access');
      console.log('  4. Table RLS is enabled but no SELECT policy exists for anon');
      console.log('');
      console.log('Solution: Apply the migration via Supabase SQL Editor');
      console.log('  https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/sql/new');
      console.log('');
      console.log('SQL to run:');
      console.log('  DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;');
      console.log('  CREATE POLICY "Public can view active clients" ON ai_presenter_clients FOR SELECT USING (status = \'active\');');
    } else if (adminCount === anonCount) {
      console.log('✅ RLS POLICY WORKING:');
      console.log(`  - Both admin and anon see ${adminCount} active client(s)`);
      console.log('  - Policy is correctly configured');
    }
  } else {
    console.log('⚠️  No active clients in database');
    console.log('  Cannot verify RLS policy behavior without active clients');
  }

  console.log('');
  console.log('═'.repeat(60));
}

main();
