/**
 * Debug Active Client Access
 *
 * Detailed debugging of why active clients aren't being returned
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

async function testWithAdmin() {
  console.log('═'.repeat(60));
  console.log('1️⃣  Admin Access Test');
  console.log('═'.repeat(60));
  console.log('');

  const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // Test 1: Get all clients
  console.log('Test 1: Get all clients (no filter)\n');
  const { data: all, error: allError } = await adminClient
    .from('ai_presenter_clients')
    .select('*');

  if (allError) {
    console.error('❌ Error:', allError);
    return;
  }

  console.log(`Found ${all.length} total clients:\n`);
  all.forEach(client => {
    console.log(`   📄 ${client.name}`);
    console.log(`      ID: ${client.id}`);
    console.log(`      Slug: ${client.slug}`);
    console.log(`      Status: ${client.status}`);
    console.log(`      Created: ${client.created_at}`);
    console.log('');
  });

  // Test 2: Filter by status
  console.log('Test 2: Filter by status = \'active\'\n');
  const { data: active, error: activeError } = await adminClient
    .from('ai_presenter_clients')
    .select('*')
    .eq('status', 'active');

  if (activeError) {
    console.error('❌ Error:', activeError);
    return;
  }

  console.log(`Found ${active.length} active clients:\n`);
  active.forEach(client => {
    console.log(`   ✅ ${client.name}`);
    console.log(`      ID: ${client.id}`);
    console.log(`      Slug: ${client.slug}`);
    console.log(`      Status: ${client.status}`);
    console.log('');
  });
}

async function testWithAnon() {
  console.log('═'.repeat(60));
  console.log('2️⃣  Anonymous Access Test');
  console.log('═'.repeat(60));
  console.log('');

  const anonClient = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // Test 1: Get all clients (should be filtered by RLS)
  console.log('Test 1: Get all clients with anon key\n');
  const { data: all, error: allError, count, status, statusText } = await anonClient
    .from('ai_presenter_clients')
    .select('*', { count: 'exact' });

  console.log(`Status: ${status} ${statusText}`);
  console.log(`Count: ${count}`);

  if (allError) {
    console.error('❌ Error:', allError);
  } else {
    console.log(`✅ Success! Found ${all.length} clients:\n`);
    if (all.length > 0) {
      all.forEach(client => {
        console.log(`   📄 ${client.name} (${client.slug}) [${client.status}]`);
      });
    } else {
      console.log('   (No clients returned)\n');
    }
  }
  console.log('');

  // Test 2: Filter by status = 'active'
  console.log('Test 2: Filter by status = \'active\' with anon key\n');
  const { data: active, error: activeError, count: activeCount } = await anonClient
    .from('ai_presenter_clients')
    .select('*', { count: 'exact' })
    .eq('status', 'active');

  console.log(`Count: ${activeCount}`);

  if (activeError) {
    console.error('❌ Error:', activeError);
  } else {
    console.log(`✅ Success! Found ${active.length} active clients:\n`);
    if (active.length > 0) {
      active.forEach(client => {
        console.log(`   ✅ ${client.name} (${client.slug}) [${client.status}]`);
      });
    } else {
      console.log('   (No active clients returned)\n');
    }
  }
  console.log('');

  // Test 3: Try getting the specific active client by ID
  console.log('Test 3: Get specific active client by ID\n');
  const { data: specific, error: specificError } = await anonClient
    .from('ai_presenter_clients')
    .select('*')
    .eq('id', 'c1111111-1111-1111-1111-111111111111')
    .single();

  if (specificError) {
    console.error('❌ Error:', specificError);
  } else if (specific) {
    console.log(`✅ Success! Found client:\n`);
    console.log(`   Name: ${specific.name}`);
    console.log(`   Slug: ${specific.slug}`);
    console.log(`   Status: ${specific.status}`);
  }
  console.log('');

  // Test 4: Try getting by slug
  console.log('Test 4: Get active client by slug\n');
  const { data: bySlug, error: slugError } = await anonClient
    .from('ai_presenter_clients')
    .select('*')
    .eq('slug', 'disruptors-media-demo')
    .single();

  if (slugError) {
    console.error('❌ Error:', slugError);
  } else if (bySlug) {
    console.log(`✅ Success! Found client:\n`);
    console.log(`   Name: ${bySlug.name}`);
    console.log(`   Slug: ${bySlug.slug}`);
    console.log(`   Status: ${bySlug.status}`);
  }
  console.log('');
}

async function checkRLSPolicies() {
  console.log('═'.repeat(60));
  console.log('3️⃣  Check RLS Configuration');
  console.log('═'.repeat(60));
  console.log('');

  const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // Check if RLS is enabled on the table
  console.log('Checking RLS status on ai_presenter_clients table...\n');

  const { data, error } = await adminClient
    .rpc('exec', {
      sql: `
        SELECT tablename, rowsecurity
        FROM pg_tables
        WHERE schemaname = 'public' AND tablename = 'ai_presenter_clients';
      `
    });

  if (error) {
    console.log('⚠️  Cannot query table info:', error.message);
  }

  console.log('Note: RLS policies are configured at the database level.');
  console.log('      We cannot query them directly via the client.\n');
}

// Main execution
(async () => {
  await testWithAdmin();
  await testWithAnon();
  await checkRLSPolicies();

  console.log('═'.repeat(60));
  console.log('🎯 DIAGNOSIS');
  console.log('═'.repeat(60));
  console.log('');
  console.log('If anonymous access returns 0 clients but admin sees 1 active client,');
  console.log('this indicates one of the following:\n');
  console.log('1️⃣  RLS policy may not be properly created');
  console.log('2️⃣  RLS policy syntax might be incorrect');
  console.log('3️⃣  RLS is enabled but no policy allows SELECT');
  console.log('4️⃣  Policy exists but USING clause doesn\'t match data\n');
  console.log('Recommended action: Apply the migration manually via Supabase Dashboard');
  console.log('');
})();
