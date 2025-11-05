/**
 * Direct Migration Application via Supabase Management API
 *
 * This script uses the Supabase Management API to execute SQL directly
 */

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

// Extract project ref from URL
const projectRef = SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

console.log('🔧 AI Presenter - Direct SQL Migration\n');
console.log('📋 Migration: Public read access for active clients');
console.log('🗄️  Project:', projectRef);
console.log('');

if (!projectRef || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing configuration');
  process.exit(1);
}

// The SQL to execute
const migrationSQL = `
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;

-- Create the policy
CREATE POLICY "Public can view active clients"
    ON ai_presenter_clients
    FOR SELECT
    USING (status = 'active');
`;

async function executeSQLDirectly() {
  try {
    console.log('📝 SQL to execute:');
    console.log('─'.repeat(60));
    console.log(migrationSQL);
    console.log('─'.repeat(60));
    console.log('');

    console.log('🚀 Executing SQL via Supabase query endpoint...\n');

    // Use the PostgREST rpc endpoint
    const rpcEndpoint = `${SUPABASE_URL}/rest/v1/rpc/exec`;

    console.log(`📡 Endpoint: ${rpcEndpoint}`);

    const response = await fetch(rpcEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        query: migrationSQL
      })
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.log(`⚠️  Response status: ${response.status}`);
      console.log(`Response: ${responseText}\n`);

      // This is expected - Supabase doesn't expose a direct SQL execution endpoint
      console.log('📌 Programmatic SQL execution is not available via REST API.');
      console.log('   This is a security feature of Supabase.\n');

      return false;
    }

    console.log('✅ SQL executed successfully!\n');
    return true;

  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function main() {
  const result = await executeSQLDirectly();

  console.log('═'.repeat(60));
  console.log('📌 MANUAL APPLICATION REQUIRED');
  console.log('═'.repeat(60));
  console.log('');
  console.log('Supabase requires SQL migrations to be applied via the Dashboard');
  console.log('for security reasons. Please follow these steps:\n');

  console.log('1️⃣  Open Supabase SQL Editor:');
  console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql/new\n`);

  console.log('2️⃣  Paste this SQL:\n');
  console.log('   ' + '─'.repeat(55));
  console.log(migrationSQL.split('\n').map(line => '   ' + line).join('\n'));
  console.log('   ' + '─'.repeat(55));
  console.log('');

  console.log('3️⃣  Click "Run" (or press Ctrl+Enter)\n');

  console.log('4️⃣  Verify success:');
  console.log('   You should see: "Success. No rows returned"\n');

  console.log('5️⃣  Test the application:');
  console.log('   The 406 errors should be resolved\n');

  console.log('═'.repeat(60));
  console.log('');

  // Show direct link
  console.log('🔗 Quick link:');
  console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql/new`);
  console.log('');
}

main();
