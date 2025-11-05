/**
 * Fix RLS Policies Migration Script - Direct PostgreSQL Connection
 *
 * This script connects directly to the Supabase PostgreSQL database
 * and executes SQL commands to fix the RLS policies.
 */

import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Missing required environment variables');
  console.error('Please ensure .env.local contains:');
  console.error('  - VITE_SUPABASE_URL');
  console.error('  - VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];
console.log('🔧 Supabase Project Reference:', projectRef);

// Construct PostgreSQL connection string
// Format: postgresql://postgres.[project-ref]:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
const DB_URL = `postgresql://postgres.${projectRef}:${SUPABASE_SERVICE_ROLE_KEY}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;

console.log('🔧 Connecting to Supabase PostgreSQL...');
console.log(`   Project: ${projectRef}`);

const client = new Client({
  connectionString: DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function executeMigration() {
  console.log('\n📋 Executing RLS Policy Migration...\n');

  try {
    // Connect to the database
    await client.connect();
    console.log('✅ Connected to PostgreSQL database\n');

    // Step 1: Drop existing policy if it exists
    console.log('1️⃣ Dropping existing "Public can view active clients" policy...');
    const dropSQL = `DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;`;

    await client.query(dropSQL);
    console.log('   ✅ Policy dropped successfully');

    // Step 2: Create new policy
    console.log('\n2️⃣ Creating new "Public can view active clients" policy...');
    const createSQL = `
CREATE POLICY "Public can view active clients"
    ON ai_presenter_clients
    FOR SELECT
    USING (status = 'active');
`;

    await client.query(createSQL);
    console.log('   ✅ Policy created successfully');

    // Step 3: Verify the policy was created
    console.log('\n3️⃣ Verifying policy creation...');
    const verifySQL = `
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'ai_presenter_clients'
  AND policyname = 'Public can view active clients';
`;

    const result = await client.query(verifySQL);

    if (result.rows.length > 0) {
      console.log('   ✅ Policy verification successful!');
      console.log('\n   Policy details:');
      console.log('   ----------------');
      console.log('   Table:', result.rows[0].tablename);
      console.log('   Policy:', result.rows[0].policyname);
      console.log('   Command:', result.rows[0].cmd);
      console.log('   Condition:', result.rows[0].qual);
    } else {
      throw new Error('Policy not found after creation');
    }

    // Step 4: Test with a query
    console.log('\n4️⃣ Testing query with active clients...');
    const testSQL = `SELECT id, name, slug, status FROM ai_presenter_clients WHERE status = 'active' LIMIT 3;`;

    const testResult = await client.query(testSQL);
    console.log(`   ✅ Found ${testResult.rows.length} active client(s)`);

    if (testResult.rows.length > 0) {
      console.log('\n   Sample clients:');
      testResult.rows.forEach((row, idx) => {
        console.log(`   ${idx + 1}. ${row.name} (${row.slug}) - ${row.status}`);
      });
    }

    console.log('\n✨ Migration completed successfully!\n');
    console.log('📊 Summary:');
    console.log('   - RLS policy dropped: ✅');
    console.log('   - New policy created: ✅');
    console.log('   - Policy verified: ✅');
    console.log('   - Test query successful: ✅');
    console.log('\nThe 406 errors should now be resolved.');
    console.log('Anonymous users can now access clients with status="active".\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nError details:');
    console.error('  Code:', error.code);
    console.error('  Detail:', error.detail);
    console.error('  Stack:', error.stack);

    console.log('\n⚠️  If the direct connection failed, please try:');
    console.log('\n1. Execute SQL manually in Supabase Dashboard:');
    console.log('   (Dashboard → SQL Editor → New Query)\n');
    console.log('```sql');
    console.log('DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;');
    console.log('');
    console.log('CREATE POLICY "Public can view active clients"');
    console.log('    ON ai_presenter_clients');
    console.log('    FOR SELECT');
    console.log('    USING (status = \'active\');');
    console.log('```\n');

    console.log('2. Or check if the connection string is correct:');
    console.log(`   Project Ref: ${projectRef}`);
    console.log('   Region: aws-0-us-west-1 (default)');
    console.log('   You may need to adjust the region in the connection string.\n');

    process.exit(1);
  } finally {
    // Close the connection
    await client.end();
    console.log('🔌 Database connection closed.');
  }
}

// Run the migration
executeMigration().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
