#!/usr/bin/env node

/**
 * Database Migration Check and Apply Script
 *
 * This script:
 * 1. Checks which tables exist in the database
 * 2. Identifies missing tables that should be created
 * 3. Applies the main schema migration if needed
 * 4. Verifies RLS policies are in place
 * 5. Tests access to the competitive_analysis table
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ubqxflzuvxowigbjmqfb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable not set');
  process.exit(1);
}

// Create Supabase clients
const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const publicClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Expected tables
const EXPECTED_TABLES = [
  'ai_presenter_clients',
  'ai_presenter_access_links',
  'ai_presenter_presentations',
  'ai_presenter_slides',
  'ai_presenter_services',
  'ai_presenter_case_studies',
  'ai_presenter_competitive_analysis',
  'ai_presenter_team_members',
  'ai_presenter_analytics_events',
  'ai_presenter_file_uploads',
  'ai_presenter_cache',
];

/**
 * Check which tables exist in the database
 */
async function checkExistingTables() {
  console.log('\n🔍 Checking existing tables...\n');

  const { data, error } = await adminClient.rpc('exec_sql', {
    sql: `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name LIKE 'ai_presenter_%'
      ORDER BY table_name;
    `
  });

  if (error) {
    // Try alternative method using direct query
    const { data: tables, error: tableError } = await adminClient
      .from('information_schema.tables')
      .select('table_name')
      .like('table_name', 'ai_presenter_%')
      .eq('table_schema', 'public');

    if (tableError) {
      console.error('❌ Error checking tables:', tableError);
      // Use raw SQL query instead
      const query = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name LIKE 'ai_presenter_%'
        ORDER BY table_name;
      `;

      const { data: rawData, error: rawError } = await adminClient.rpc('exec', { sql: query });

      if (rawError) {
        console.error('❌ Failed to query tables:', rawError);
        return [];
      }

      return rawData || [];
    }

    return tables || [];
  }

  return data || [];
}

/**
 * Query tables directly to check existence
 */
async function checkTablesDirectly() {
  console.log('\n🔍 Checking tables directly...\n');

  const existingTables = [];
  const missingTables = [];

  for (const tableName of EXPECTED_TABLES) {
    try {
      const { data, error } = await adminClient
        .from(tableName)
        .select('*')
        .limit(1);

      if (error) {
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          console.log(`❌ Missing: ${tableName}`);
          missingTables.push(tableName);
        } else if (error.code === '42501') {
          console.log(`✅ Exists (access denied - RLS enabled): ${tableName}`);
          existingTables.push(tableName);
        } else {
          console.log(`⚠️  Unknown error for ${tableName}:`, error.message);
          existingTables.push(tableName); // Assume exists but has issues
        }
      } else {
        console.log(`✅ Exists: ${tableName} (${data?.length || 0} rows)`);
        existingTables.push(tableName);
      }
    } catch (err) {
      console.log(`❌ Error checking ${tableName}:`, err.message);
      missingTables.push(tableName);
    }
  }

  return { existingTables, missingTables };
}

/**
 * Apply the main schema migration
 */
async function applyMainSchemaMigration() {
  console.log('\n📦 Reading main schema migration file...\n');

  const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20250113_ai_presenter_schema.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf8');

  console.log('🚀 Applying main schema migration...');
  console.log('   (This may take a minute...)\n');

  // Split by statements (simple split on semicolons, may need refinement)
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';

    try {
      const { error } = await adminClient.rpc('exec', { sql: statement });

      if (error) {
        // Check if error is "already exists" - that's okay
        if (error.message.includes('already exists') ||
            error.message.includes('duplicate')) {
          console.log(`⏭️  Skipping (already exists): Statement ${i + 1}/${statements.length}`);
          successCount++;
        } else {
          console.error(`❌ Error in statement ${i + 1}/${statements.length}:`, error.message.substring(0, 100));
          errorCount++;
          errors.push({ statement: i + 1, error: error.message });
        }
      } else {
        successCount++;
        if (i % 10 === 0) {
          console.log(`✅ Progress: ${i + 1}/${statements.length} statements processed`);
        }
      }
    } catch (err) {
      console.error(`❌ Exception in statement ${i + 1}:`, err.message);
      errorCount++;
      errors.push({ statement: i + 1, error: err.message });
    }
  }

  console.log(`\n📊 Migration Summary:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);

  if (errors.length > 0 && errors.length < 10) {
    console.log('\n❌ Errors encountered:');
    errors.forEach(({ statement, error }) => {
      console.log(`   Statement ${statement}: ${error.substring(0, 150)}`);
    });
  }

  return { successCount, errorCount, errors };
}

/**
 * Execute SQL directly using Supabase SQL query
 */
async function executeSQLDirect(sql) {
  const { data, error } = await adminClient.rpc('exec', { sql });

  if (error) {
    throw new Error(`SQL execution failed: ${error.message}`);
  }

  return data;
}

/**
 * Apply migration using direct SQL execution
 */
async function applyMigrationDirect() {
  console.log('\n📦 Applying migration using direct SQL execution...\n');

  const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20250113_ai_presenter_schema.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf8');

  try {
    await executeSQLDirect(migrationSQL);
    console.log('✅ Migration applied successfully!');
    return true;
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    return false;
  }
}

/**
 * Test access to competitive_analysis table
 */
async function testCompetitiveAnalysisAccess() {
  console.log('\n🧪 Testing access to ai_presenter_competitive_analysis table...\n');

  // Test with admin client
  console.log('   Testing with admin client (service role)...');
  const { data: adminData, error: adminError } = await adminClient
    .from('ai_presenter_competitive_analysis')
    .select('*')
    .limit(1);

  if (adminError) {
    console.log(`   ❌ Admin access failed: ${adminError.message}`);
  } else {
    console.log(`   ✅ Admin access successful (${adminData?.length || 0} rows)`);
  }

  // Test with public client
  console.log('   Testing with public client (anon key)...');
  const { data: publicData, error: publicError } = await publicClient
    .from('ai_presenter_competitive_analysis')
    .select('*')
    .limit(1);

  if (publicError) {
    if (publicError.code === '42501') {
      console.log(`   ⚠️  Public access denied (RLS working as expected): ${publicError.message}`);
    } else {
      console.log(`   ❌ Public access error: ${publicError.message}`);
    }
  } else {
    console.log(`   ✅ Public access successful (${publicData?.length || 0} rows)`);
  }

  return { adminError, publicError };
}

/**
 * Check RLS policies
 */
async function checkRLSPolicies() {
  console.log('\n🔒 Checking RLS policies...\n');

  const query = `
    SELECT
      schemaname,
      tablename,
      policyname,
      permissive,
      roles,
      cmd
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename LIKE 'ai_presenter_%'
    ORDER BY tablename, policyname;
  `;

  try {
    const { data, error } = await adminClient.rpc('exec', { sql: query });

    if (error) {
      console.error('❌ Error checking RLS policies:', error.message);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('⚠️  No RLS policies found');
      return [];
    }

    // Group by table
    const policiesByTable = {};
    data.forEach(policy => {
      if (!policiesByTable[policy.tablename]) {
        policiesByTable[policy.tablename] = [];
      }
      policiesByTable[policy.tablename].push(policy);
    });

    Object.entries(policiesByTable).forEach(([tableName, policies]) => {
      console.log(`   ${tableName}: ${policies.length} policies`);
      policies.forEach(p => {
        console.log(`      - ${p.policyname} (${p.cmd})`);
      });
    });

    return data;
  } catch (err) {
    console.error('❌ Exception checking RLS:', err.message);
    return [];
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('   AI PRESENTER DATABASE MIGRATION CHECKER');
  console.log('═══════════════════════════════════════════════════════');

  console.log(`\n📍 Supabase URL: ${SUPABASE_URL}`);
  console.log(`🔑 Using service role key: ${SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...`);

  // Step 1: Check existing tables
  const { existingTables, missingTables } = await checkTablesDirectly();

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Existing tables: ${existingTables.length}/${EXPECTED_TABLES.length}`);
  console.log(`   ❌ Missing tables: ${missingTables.length}/${EXPECTED_TABLES.length}`);

  if (missingTables.length > 0) {
    console.log('\n⚠️  Missing tables detected. The main schema migration needs to be applied.');
    console.log('\n📝 Missing tables:');
    missingTables.forEach(t => console.log(`   - ${t}`));

    console.log('\n❓ This script cannot automatically apply the migration.');
    console.log('   Please apply the migration manually using one of these methods:');
    console.log('\n   Method 1: Supabase Dashboard');
    console.log('   1. Go to: https://app.supabase.com/project/ubqxflzuvxowigbjmqfb/sql/new');
    console.log('   2. Copy the contents of: supabase/migrations/20250113_ai_presenter_schema.sql');
    console.log('   3. Paste into the SQL Editor and click "Run"');
    console.log('\n   Method 2: Supabase CLI');
    console.log('   1. Install: npm install -g supabase');
    console.log('   2. Link project: supabase link --project-ref ubqxflzuvxowigbjmqfb');
    console.log('   3. Apply migrations: supabase db push');
  } else {
    console.log('\n✅ All expected tables exist!');
  }

  // Step 2: Test competitive_analysis access
  if (existingTables.includes('ai_presenter_competitive_analysis')) {
    await testCompetitiveAnalysisAccess();
  }

  // Step 3: Check RLS policies
  await checkRLSPolicies();

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   DIAGNOSTIC COMPLETE');
  console.log('═══════════════════════════════════════════════════════\n');
}

// Run the script
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
