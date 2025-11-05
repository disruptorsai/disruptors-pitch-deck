/**
 * Apply Disruptors Media Migrations
 *
 * This script guides you through applying 4 database migrations:
 * 1. Healthcare case studies data (6 real case studies with 3-12.5X ROI)
 * 2. Service offerings data (9 AI-powered marketing mechanisms)
 * 3. Pricing tiers data (4 pricing tiers from Agency $850 to Enterprise $5,000+)
 * 4. Conversation tracking tables (ICP response tracking)
 *
 * Usage: node scripts/apply-disruptors-migrations.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';

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

const CLIENT_ID = 'c1111111-1111-1111-1111-111111111111';

// Initialize Supabase client for verification
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Define migrations in order
const migrations = [
  {
    number: 1,
    file: '20251020_disruptors_healthcare_data.sql',
    name: 'Healthcare Case Studies',
    description: 'Replace demo data with 6 real healthcare case studies (3-12.5X ROI)',
    expectedRecords: 6,
    table: 'ai_presenter_case_studies'
  },
  {
    number: 2,
    file: '20251020_disruptors_services_data.sql',
    name: 'Service Offerings',
    description: 'Add 9 AI-powered marketing service offerings with performance metrics',
    expectedRecords: 9,
    table: 'ai_presenter_services'
  },
  {
    number: 3,
    file: '20251020_disruptors_pricing_data.sql',
    name: 'Pricing Tiers',
    description: 'Add 4 pricing tiers (Agency $850 - Enterprise $5,000+)',
    expectedRecords: 4,
    table: 'ai_presenter_pricing_tiers'
  },
  {
    number: 4,
    file: '20251020_add_conversation_tracking.sql',
    name: 'Conversation Tracking',
    description: 'Create conversation tracking tables for ICP responses',
    expectedRecords: null, // Table creation, not data insertion
    tables: ['ai_presenter_conversation_responses', 'ai_presenter_conversation_progress']
  }
];

console.log('');
console.log('═'.repeat(80));
console.log('🚀  DISRUPTORS MEDIA - DATABASE MIGRATION APPLICATION');
console.log('═'.repeat(80));
console.log('');
console.log('📊 Project:', projectRef);
console.log('🗄️  Database:', SUPABASE_URL);
console.log('🎯 Target Client ID:', CLIENT_ID);
console.log('');
console.log('📝 Migrations to Apply:');
migrations.forEach(m => {
  console.log(`   ${m.number}. ${m.name} - ${m.description}`);
});
console.log('');

if (!projectRef || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase configuration in .env.local');
  process.exit(1);
}

/**
 * Display migration SQL with instructions
 */
function displayMigrationInstructions(migration) {
  const migrationPath = join(__dirname, '..', 'supabase', 'migrations', migration.file);
  const sql = readFileSync(migrationPath, 'utf8');

  console.log('');
  console.log('═'.repeat(80));
  console.log(`📝 MIGRATION ${migration.number}: ${migration.name.toUpperCase()}`);
  console.log('═'.repeat(80));
  console.log('');
  console.log('📋 Description:', migration.description);
  console.log('📄 File:', migration.file);
  console.log('📊 SQL Size:', `${(sql.length / 1024).toFixed(2)} KB`);
  console.log('');

  console.log('┌' + '─'.repeat(78) + '┐');
  console.log('│ STEP 1: OPEN SUPABASE SQL EDITOR' + ' '.repeat(44) + '│');
  console.log('└' + '─'.repeat(78) + '┘');
  console.log('');
  console.log(`🔗 Click here: https://supabase.com/dashboard/project/${projectRef}/sql/new`);
  console.log('');

  console.log('┌' + '─'.repeat(78) + '┐');
  console.log('│ STEP 2: COPY SQL MIGRATION CONTENT' + ' '.repeat(43) + '│');
  console.log('└' + '─'.repeat(78) + '┘');
  console.log('');
  console.log(`📂 Location: supabase/migrations/${migration.file}`);
  console.log('');
  console.log('💡 The SQL content is displayed below:');
  console.log('');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║ SQL MIGRATION CONTENT' + ' '.repeat(56) + '║');
  console.log('╠' + '═'.repeat(78) + '╣');

  // Display SQL with line numbers
  const lines = sql.split('\n');
  lines.forEach((line, i) => {
    const lineNum = (i + 1).toString().padStart(4, ' ');
    const displayLine = line.length > 70 ? line.substring(0, 70) + '...' : line;
    console.log(`║ ${lineNum} │ ${displayLine.padEnd(70)} ║`);
  });

  console.log('╚' + '═'.repeat(78) + '╝');
  console.log('');

  console.log('┌' + '─'.repeat(78) + '┐');
  console.log('│ STEP 3: PASTE & EXECUTE IN SQL EDITOR' + ' '.repeat(40) + '│');
  console.log('└' + '─'.repeat(78) + '┘');
  console.log('');
  console.log('1. Paste the SQL content from above into the Supabase SQL Editor');
  console.log('2. Click "Run" button (or press Ctrl+Enter)');
  console.log('3. Wait for the query to complete');
  console.log('4. Check for success message or any errors');
  console.log('');

  if (migration.expectedRecords) {
    console.log('✅ Expected Result:');
    console.log(`   - ${migration.expectedRecords} records inserted into ${migration.table}`);
    console.log(`   - Success message should show: "SUCCESS: ${migration.expectedRecords} records..."`);
  } else {
    console.log('✅ Expected Result:');
    console.log(`   - Tables created: ${migration.tables.join(', ')}`);
    console.log('   - No errors during execution');
  }
  console.log('');
}

/**
 * Verify migration was applied successfully
 */
async function verifyMigration(migration) {
  console.log('┌' + '─'.repeat(78) + '┐');
  console.log('│ STEP 4: VERIFY MIGRATION SUCCESS' + ' '.repeat(45) + '│');
  console.log('└' + '─'.repeat(78) + '┘');
  console.log('');
  console.log('🔍 Checking database...');
  console.log('');

  try {
    if (migration.expectedRecords) {
      // Verify data insertion
      const { data, error, count } = await supabase
        .from(migration.table)
        .select('*', { count: 'exact', head: false })
        .eq('client_id', CLIENT_ID);

      if (error) {
        console.log(`❌ VERIFICATION FAILED:`, error.message);
        console.log('');
        console.log('⚠️  Please ensure:');
        console.log('   1. The migration SQL was executed successfully');
        console.log('   2. No errors occurred during execution');
        console.log('   3. The Supabase dashboard shows no errors');
        console.log('');
        return false;
      }

      console.log(`✅ VERIFICATION SUCCESSFUL!`);
      console.log('');
      console.log(`📊 Records found: ${count} (Expected: ${migration.expectedRecords})`);

      if (count === migration.expectedRecords) {
        console.log('');
        console.log('🎉 Perfect! All records inserted correctly.');

        // Show sample data
        if (data && data.length > 0) {
          console.log('');
          console.log('📋 Sample Records:');
          data.slice(0, 3).forEach((record, i) => {
            const title = record.title || record.name;
            const price = record.price ? ` ($${record.price})` : '';
            console.log(`   ${i + 1}. ${title}${price}`);
          });
          if (data.length > 3) {
            console.log(`   ... and ${data.length - 3} more`);
          }
        }
      } else {
        console.log('');
        console.log(`⚠️  WARNING: Expected ${migration.expectedRecords} records but found ${count}`);
        console.log('   This might indicate the migration was partially applied.');
        console.log('   Please check the Supabase SQL Editor for any error messages.');
      }

      console.log('');
      return count === migration.expectedRecords;

    } else {
      // Verify table creation
      let allTablesExist = true;

      for (const tableName of migration.tables) {
        const { error } = await supabase
          .from(tableName)
          .select('id', { count: 'exact', head: true });

        if (error && error.code === '42P01') { // Table doesn't exist
          console.log(`❌ Table "${tableName}" does not exist`);
          allTablesExist = false;
        } else if (error) {
          console.log(`⚠️  Warning checking "${tableName}":`, error.message);
        } else {
          console.log(`✅ Table "${tableName}" exists`);
        }
      }

      console.log('');

      if (allTablesExist) {
        console.log('🎉 All tables created successfully!');
        console.log('');
        return true;
      } else {
        console.log('⚠️  Some tables are missing. Please re-run the migration.');
        console.log('');
        return false;
      }
    }

  } catch (error) {
    console.log(`❌ VERIFICATION ERROR:`, error.message);
    console.log('');
    return false;
  }
}

/**
 * Wait for user confirmation
 */
async function waitForUserConfirmation() {
  console.log('┌' + '─'.repeat(78) + '┐');
  console.log('│ PRESS ENTER TO VERIFY...' + ' '.repeat(53) + '│');
  console.log('└' + '─'.repeat(78) + '┘');
  console.log('');
  console.log('After you have executed the SQL in the Supabase SQL Editor,');
  console.log('press ENTER to verify the migration was successful.');
  console.log('');

  return new Promise(resolve => {
    process.stdin.once('data', () => {
      resolve();
    });
  });
}

/**
 * Main migration application flow
 */
async function main() {
  const results = [];

  for (const migration of migrations) {
    displayMigrationInstructions(migration);

    await waitForUserConfirmation();

    const success = await verifyMigration(migration);

    results.push({
      migration: migration.name,
      success
    });

    if (!success) {
      console.log('❌ Migration verification failed!');
      console.log('');
      console.log('Please fix the issues before continuing.');
      console.log('You can re-run this script to continue from where you left off.');
      console.log('');
      process.exit(1);
    }

    console.log('');
    console.log('─'.repeat(80));
    console.log('');

    if (migration.number < migrations.length) {
      console.log('✅ Migration complete! Moving to next migration...');
      console.log('');
    }
  }

  // Final summary
  console.log('');
  console.log('═'.repeat(80));
  console.log('🎉  ALL MIGRATIONS COMPLETED SUCCESSFULLY!');
  console.log('═'.repeat(80));
  console.log('');
  console.log('📊 Summary:');
  results.forEach((result, i) => {
    console.log(`   ${i + 1}. ${result.migration}: ${result.success ? '✅' : '❌'}`);
  });
  console.log('');

  const successCount = results.filter(r => r.success).length;

  if (successCount === results.length) {
    console.log('✅ All migrations applied successfully!');
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('   1. Verify data in your application');
    console.log('   2. Test case studies display');
    console.log('   3. Test service offerings display');
    console.log('   4. Test pricing tiers display');
    console.log('   5. Test conversation tracking functionality');
    console.log('');
    console.log('🔗 View your data:');
    console.log(`   https://supabase.com/dashboard/project/${projectRef}/editor`);
  } else {
    console.log('⚠️  Some migrations failed. Please review and re-run.');
  }

  console.log('');
  console.log('═'.repeat(80));
  console.log('');
}

// Run the script
main().catch(error => {
  console.error('');
  console.error('❌ FATAL ERROR:', error.message);
  console.error('');
  process.exit(1);
});
