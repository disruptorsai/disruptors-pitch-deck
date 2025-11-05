/**
 * Check Clients Script
 *
 * Lists all clients in the database and their status
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

// Create admin client
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// Create anon client
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

async function checkClients() {
  console.log('═'.repeat(70));
  console.log('  Checking Clients in Database');
  console.log('═'.repeat(70) + '\n');

  try {
    // Get all clients using admin client
    console.log('1️⃣ Fetching all clients (using admin/service role key)...\n');

    const { data: adminClients, error: adminError } = await supabaseAdmin
      .from('ai_presenter_clients')
      .select('id, name, slug, status, created_at')
      .order('created_at', { ascending: false });

    if (adminError) {
      console.error('❌ Error fetching clients with admin key:', adminError.message);
      throw adminError;
    }

    if (!adminClients || adminClients.length === 0) {
      console.log('   ⚠️  No clients found in database\n');
      console.log('   You may need to run the demo data migration first.');
      console.log('   See: supabase/migrations/ directory\n');
      return;
    }

    console.log(`   ✅ Found ${adminClients.length} client(s)\n`);
    console.log('   Client List:');
    console.log('   ' + '-'.repeat(70));
    adminClients.forEach((client, idx) => {
      console.log(`   ${idx + 1}. ${client.name}`);
      console.log(`      Slug: ${client.slug}`);
      console.log(`      Status: ${client.status}`);
      console.log(`      ID: ${client.id}`);
      console.log(`      Created: ${new Date(client.created_at).toLocaleDateString()}`);
      console.log('');
    });

    // Count by status
    const statusCounts = adminClients.reduce((acc, client) => {
      acc[client.status] = (acc[client.status] || 0) + 1;
      return acc;
    }, {});

    console.log('   Status Summary:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   - ${status}: ${count}`);
    });

    // Check anonymous access
    console.log('\n2️⃣ Testing anonymous access (using anon key)...\n');

    const { data: anonClients, error: anonError } = await supabaseAnon
      .from('ai_presenter_clients')
      .select('id, name, slug, status')
      .eq('status', 'active');

    if (anonError) {
      console.log('   ❌ Anonymous access FAILED');
      console.log(`   Error: ${anonError.message} (Code: ${anonError.code})`);
      console.log('\n   This means the RLS policy is not allowing anonymous access!');
      console.log('   You need to execute the SQL migration.\n');
      return;
    }

    console.log('   ✅ Anonymous access WORKING');
    console.log(`   Accessible clients: ${anonClients.length}\n`);

    if (anonClients.length > 0) {
      console.log('   Clients accessible via anonymous key:');
      anonClients.forEach((client, idx) => {
        console.log(`   ${idx + 1}. ${client.name} (${client.slug})`);
      });
    } else {
      console.log('   ⚠️  No active clients found');
      console.log('   Anonymous users can query, but no clients have status="active"\n');

      // Find clients with other statuses
      const nonActiveClients = adminClients.filter(c => c.status !== 'active');
      if (nonActiveClients.length > 0) {
        console.log('   Clients with non-active status:');
        nonActiveClients.forEach((client, idx) => {
          console.log(`   ${idx + 1}. ${client.name} (${client.slug}) - Status: ${client.status}`);
        });
        console.log('\n   💡 Suggestion: Update a client to status="active" to test:');
        const firstClient = nonActiveClients[0];
        console.log(`\n   UPDATE ai_presenter_clients`);
        console.log(`   SET status = 'active'`);
        console.log(`   WHERE id = '${firstClient.id}';`);
      }
    }

    console.log('\n═'.repeat(70));
    console.log('  Check Complete');
    console.log('═'.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

checkClients();
