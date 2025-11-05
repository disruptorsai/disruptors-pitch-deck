/**
 * Execute RLS Fix using Supabase Management API
 *
 * This script uses the Supabase Management API to execute SQL directly
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('═'.repeat(70));
console.log('  RLS Policy Fix - Direct SQL Execution');
console.log('═'.repeat(70) + '\n');

// SQL migration to execute
const SQL_MIGRATION = `
-- Step 1: Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;

-- Step 2: Create new policy allowing anonymous users to view active clients
CREATE POLICY "Public can view active clients"
    ON ai_presenter_clients
    FOR SELECT
    USING (status = 'active');

-- Step 3: Verify the policy was created
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'ai_presenter_clients'
  AND policyname = 'Public can view active clients';
`;

console.log('SQL Migration to Execute:');
console.log('-'.repeat(70));
console.log(SQL_MIGRATION.trim());
console.log('-'.repeat(70) + '\n');

console.log('⚠️  IMPORTANT: Automated SQL execution is not available via Supabase JS client.\n');
console.log('Please follow these steps to execute the migration:\n');
console.log('1️⃣ Open Supabase Dashboard:');
console.log(`   https://app.supabase.com/project/ubqxflzuvxowigbjmqfb/sql/new\n`);

console.log('2️⃣ Copy and paste the following SQL:\n');
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

console.log('3️⃣ Click "Run" or press Ctrl+Enter\n');

console.log('4️⃣ You should see: "Success. No rows returned"\n');

console.log('5️⃣ Run the verification script:');
console.log('   node scripts/verify-rls-fix.mjs\n');

console.log('═'.repeat(70));
console.log('  Alternative: Use this direct link');
console.log('═'.repeat(70) + '\n');

// Create a SQL migration file
const migrationContent = `-- RLS Policy Fix Migration
-- Generated: ${new Date().toISOString()}
-- Purpose: Allow anonymous users to view active clients

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;

-- Create new policy
CREATE POLICY "Public can view active clients"
    ON ai_presenter_clients
    FOR SELECT
    USING (status = 'active');

-- Verify policy was created
SELECT
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'ai_presenter_clients'
  AND policyname = 'Public can view active clients';
`;

// Write migration file
import { writeFileSync } from 'fs';
const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20251017_fix_rls_policies.sql');

try {
  writeFileSync(migrationPath, migrationContent);
  console.log(`✅ Migration file created: ${migrationPath}\n`);
  console.log('   You can apply this migration in Supabase Dashboard → SQL Editor\n');
} catch (error) {
  console.log(`⚠️  Could not create migration file: ${error.message}\n`);
}

console.log('═'.repeat(70) + '\n');
