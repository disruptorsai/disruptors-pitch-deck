/**
 * Direct SQL Execution using PostgreSQL Connection
 *
 * This script attempts to connect directly to Supabase PostgreSQL
 * and execute the RLS policy migration SQL.
 *
 * Connection details can be found in Supabase Dashboard:
 * Project Settings → Database → Connection String
 */

import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

console.log('═'.repeat(70));
console.log('  Direct PostgreSQL SQL Execution');
console.log('═'.repeat(70) + '\n');

// Extract project reference from URL
const projectRef = SUPABASE_URL.replace('https://', '').replace('http://', '').split('.')[0];
console.log(`Project Reference: ${projectRef}`);

// Note: The actual database password is NOT the service role key
// It's a separate database password that can be found in Supabase Dashboard
console.log('\n⚠️  IMPORTANT:\n');
console.log('To connect directly to PostgreSQL, you need the DATABASE PASSWORD,');
console.log('which is different from the service role key.\n');

console.log('To get your database password:');
console.log('1. Go to: https://app.supabase.com/project/ubqxflzuvxowigbjmqfb/settings/database');
console.log('2. Find "Database Password" section');
console.log('3. Click "Reset Database Password" if you don\'t have it\n');

console.log('Since we cannot get the database password programmatically,');
console.log('we will use the Supabase SDK approach instead.\n');

console.log('═'.repeat(70));
console.log('  Executing SQL via Supabase SDK');
console.log('═'.repeat(70) + '\n');

// Create admin client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// SQL to execute
const SQL_STATEMENTS = [
  {
    name: 'Drop existing policy',
    sql: 'DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients',
  },
  {
    name: 'Create new policy',
    sql: `CREATE POLICY "Public can view active clients" ON ai_presenter_clients FOR SELECT USING (status = 'active')`,
  },
];

async function executeSQLStatements() {
  console.log('Attempting to execute SQL statements...\n');

  try {
    // Try using the query builder to check if policies exist
    console.log('1️⃣ Checking current RLS policies...\n');

    // We can't directly query pg_policies with Supabase SDK,
    // but we can use RPC if we create a function

    console.log('   ⚠️  Direct SQL execution via SDK is not supported.\n');

    console.log('   Instead, I will provide you with multiple ways to execute the SQL:\n');

    console.log('═'.repeat(70));
    console.log('  METHOD 1: Supabase Dashboard SQL Editor (RECOMMENDED)');
    console.log('═'.repeat(70) + '\n');

    console.log('1. Open: https://app.supabase.com/project/ubqxflzuvxowigbjmqfb/sql/new\n');

    console.log('2. Paste this SQL:\n');
    console.log('```sql');
    console.log('-- Drop existing policy');
    console.log('DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;');
    console.log('');
    console.log('-- Create new policy');
    console.log('CREATE POLICY "Public can view active clients"');
    console.log('    ON ai_presenter_clients');
    console.log('    FOR SELECT');
    console.log('    USING (status = \'active\');');
    console.log('```\n');

    console.log('3. Click "Run" (or press Ctrl+Enter)\n');

    console.log('4. Run verification:');
    console.log('   node scripts/verify-rls-fix.mjs\n');

    console.log('═'.repeat(70));
    console.log('  METHOD 2: Using psql Command Line');
    console.log('═'.repeat(70) + '\n');

    console.log('If you have psql installed, you can connect directly:\n');

    console.log('1. Get your connection string from:');
    console.log('   https://app.supabase.com/project/ubqxflzuvxowigbjmqfb/settings/database\n');

    console.log('2. Connect:');
    console.log('   psql "postgresql://postgres:[YOUR-PASSWORD]@db.[project-ref].supabase.co:5432/postgres"\n');

    console.log('3. Execute:');
    console.log('   DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;');
    console.log('   CREATE POLICY "Public can view active clients" ON ai_presenter_clients FOR SELECT USING (status = \'active\');\n');

    console.log('═'.repeat(70));
    console.log('  METHOD 3: Create an RPC Function (Advanced)');
    console.log('═'.repeat(70) + '\n');

    console.log('Create a function in Supabase Dashboard that can execute DDL:\n');

    console.log('```sql');
    console.log('CREATE OR REPLACE FUNCTION fix_rls_policies()');
    console.log('RETURNS void');
    console.log('LANGUAGE plpgsql');
    console.log('SECURITY DEFINER');
    console.log('AS $$');
    console.log('BEGIN');
    console.log('  DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;');
    console.log('  CREATE POLICY "Public can view active clients" ON ai_presenter_clients FOR SELECT USING (status = \'active\');');
    console.log('END;');
    console.log('$$;');
    console.log('```\n');

    console.log('Then call it via SDK:');
    console.log('```javascript');
    console.log('await supabase.rpc(\'fix_rls_policies\');');
    console.log('```\n');

    console.log('═'.repeat(70) + '\n');

    console.log('📝 Migration file has been created at:');
    console.log('   supabase/migrations/20251017_fix_rls_policies.sql\n');

    console.log('You can review and apply it in the Supabase Dashboard.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

executeSQLStatements();
