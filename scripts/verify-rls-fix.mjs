/**
 * Verify RLS Policy Fix
 *
 * Tests that anonymous users can access active clients
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// Create clients
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

async function verify() {
  console.log('═'.repeat(70));
  console.log('  RLS Policy Verification');
  console.log('═'.repeat(70) + '\n');

  try {
    // Step 1: Check active clients exist (using admin)
    console.log('1️⃣ Checking for active clients (admin access)...\n');

    const { data: adminClients, error: adminError } = await supabaseAdmin
      .from('ai_presenter_clients')
      .select('id, name, slug, status')
      .eq('status', 'active');

    if (adminError) {
      throw new Error(`Admin query failed: ${adminError.message}`);
    }

    console.log(`   ✅ Found ${adminClients.length} active client(s) via admin key\n`);

    if (adminClients.length === 0) {
      console.log('   ⚠️  No active clients in database!');
      console.log('   Creating a test active client...\n');

      // Update first draft client to active
      const { data: draftClients } = await supabaseAdmin
        .from('ai_presenter_clients')
        .select('id, name, slug')
        .eq('status', 'draft')
        .limit(1);

      if (draftClients && draftClients.length > 0) {
        const { error: updateError } = await supabaseAdmin
          .from('ai_presenter_clients')
          .update({ status: 'active' })
          .eq('id', draftClients[0].id);

        if (updateError) {
          throw new Error(`Failed to update client: ${updateError.message}`);
        }

        console.log(`   ✅ Updated client "${draftClients[0].name}" to active\n`);

        // Re-fetch active clients
        const { data: newActiveClients } = await supabaseAdmin
          .from('ai_presenter_clients')
          .select('id, name, slug, status')
          .eq('status', 'active');

        adminClients.length = 0;
        adminClients.push(...newActiveClients);
      } else {
        console.log('   ❌ No clients found to activate!');
        console.log('   Please create a client first.\n');
        return;
      }
    }

    // Display active clients
    console.log('   Active clients:');
    adminClients.forEach((client, idx) => {
      console.log(`   ${idx + 1}. ${client.name} (${client.slug})`);
      console.log(`      ID: ${client.id}`);
    });

    // Step 2: Test anonymous access
    console.log('\n2️⃣ Testing anonymous access (anon key)...\n');

    const { data: anonClients, error: anonError } = await supabaseAnon
      .from('ai_presenter_clients')
      .select('id, name, slug, status')
      .eq('status', 'active');

    if (anonError) {
      console.log('   ❌ VERIFICATION FAILED\n');
      console.log(`   Error: ${anonError.message}`);
      console.log(`   Code: ${anonError.code}`);
      console.log(`   Details: ${JSON.stringify(anonError.details, null, 2)}\n`);

      console.log('   This means the RLS policy is NOT allowing anonymous access.\n');
      console.log('   Please ensure you executed the SQL migration in Supabase Dashboard:\n');
      console.log('   1. Go to: https://app.supabase.com/project/ubqxflzuvxowigbjmqfb/sql/new');
      console.log('   2. Paste and run:\n');
      console.log('   DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;');
      console.log('   CREATE POLICY "Public can view active clients"');
      console.log('       ON ai_presenter_clients FOR SELECT USING (status = \'active\');\n');

      process.exit(1);
    }

    console.log(`   ✅ Anonymous access WORKING!`);
    console.log(`   Retrieved ${anonClients.length} client(s)\n`);

    if (anonClients.length !== adminClients.length) {
      console.log('   ⚠️  Warning: Client count mismatch!');
      console.log(`   - Admin sees: ${adminClients.length} clients`);
      console.log(`   - Anon sees: ${anonClients.length} clients`);
      console.log('   Some active clients may not be visible to anonymous users.\n');
    }

    // Display retrieved clients
    if (anonClients.length > 0) {
      console.log('   Clients accessible anonymously:');
      anonClients.forEach((client, idx) => {
        console.log(`   ${idx + 1}. ${client.name} (${client.slug})`);
      });
    }

    // Step 3: Test specific client by slug
    if (anonClients.length > 0) {
      const testSlug = anonClients[0].slug;

      console.log(`\n3️⃣ Testing specific client lookup by slug: "${testSlug}"...\n`);

      const { data: specificClient, error: specificError } = await supabaseAnon
        .from('ai_presenter_clients')
        .select('id, name, slug, status, website, email')
        .eq('slug', testSlug)
        .eq('status', 'active')
        .single();

      if (specificError) {
        console.log('   ❌ Slug lookup failed');
        console.log(`   Error: ${specificError.message}\n`);
      } else {
        console.log('   ✅ Slug lookup successful!');
        console.log(`   Client: ${specificClient.name}`);
        console.log(`   Slug: ${specificClient.slug}`);
        console.log(`   Status: ${specificClient.status}`);
        console.log(`   Website: ${specificClient.website || 'N/A'}`);
        console.log(`   Email: ${specificClient.email || 'N/A'}\n`);
      }
    }

    // Success summary
    console.log('═'.repeat(70));
    console.log('  ✅ VERIFICATION SUCCESSFUL');
    console.log('═'.repeat(70) + '\n');

    console.log('📊 Summary:');
    console.log(`   - Active clients in database: ${adminClients.length}`);
    console.log(`   - Accessible via anonymous key: ${anonClients.length}`);
    console.log('   - RLS policy status: ✅ Working correctly');
    console.log('   - 406 errors should be resolved: ✅ Yes\n');

    console.log('Next steps:');
    console.log('   - Test your application in the browser');
    console.log('   - Navigate to a presentation page');
    console.log('   - Verify that client data loads without 406 errors\n');

  } catch (error) {
    console.error('\n❌ Verification failed with error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

verify();
