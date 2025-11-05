import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗');
  process.exit(1);
}

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('🔧 AI Presenter Database Migration Tool');
console.log('==========================================\n');

async function runSQL(sql, description) {
  console.log(`📝 ${description}...`);

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // If exec_sql doesn't exist, try direct query
      if (error.message.includes('function') && error.message.includes('does not exist')) {
        console.log('   ⚠️  exec_sql function not available, using direct query...');

        // Split SQL into individual statements and execute
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s && !s.startsWith('--'));

        for (const statement of statements) {
          if (statement) {
            const { error: execError } = await supabase.rpc('exec', { sql: statement });
            if (execError) {
              throw execError;
            }
          }
        }
      } else {
        throw error;
      }
    }

    console.log(`   ✅ Success!\n`);
    return true;
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}\n`);
    return false;
  }
}

async function executeMigrationDirect(sql, description) {
  console.log(`📝 ${description}...`);

  try {
    // Use raw query execution
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    console.log(`   ✅ Success!\n`);
    return true;
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}\n`);
    return false;
  }
}

async function checkTableExists(tableName) {
  const { data, error } = await supabase
    .from(tableName)
    .select('id')
    .limit(1);

  if (error && error.code === '42P01') {
    return false; // Table doesn't exist
  }

  return true;
}

async function verifyClient() {
  console.log('🔍 Verifying client exists...');
  const { data, error } = await supabase
    .from('ai_presenter_clients')
    .select('id, name, slug, status')
    .eq('id', 'c1111111-1111-1111-1111-111111111111')
    .single();

  if (error || !data) {
    console.log('   ⚠️  Client not found\n');
    return false;
  }

  console.log(`   ✅ Found: ${data.name} (${data.slug}) - ${data.status}\n`);
  return true;
}

async function verifyData() {
  console.log('🔍 Verifying migrated data...\n');

  const checks = [
    { table: 'ai_presenter_clients', id: 'c1111111-1111-1111-1111-111111111111', expected: 1, label: 'Disruptors Media client' },
    { table: 'ai_presenter_case_studies', client_id: 'c1111111-1111-1111-1111-111111111111', expected: 6, label: 'Case studies' },
    { table: 'ai_presenter_services', client_id: 'c1111111-1111-1111-1111-111111111111', expected: 6, label: 'Services' },
    { table: 'ai_presenter_pricing_tiers', client_id: 'c1111111-1111-1111-1111-111111111111', expected: 3, label: 'Pricing tiers' },
    { table: 'ai_presenter_team_members', client_id: 'c1111111-1111-1111-1111-111111111111', expected: 4, label: 'Team members' },
  ];

  let allPassed = true;

  for (const check of checks) {
    const query = check.id
      ? supabase.from(check.table).select('*', { count: 'exact', head: true }).eq('id', check.id)
      : supabase.from(check.table).select('*', { count: 'exact', head: true }).eq('client_id', check.client_id);

    const { count, error } = await query;

    if (error) {
      console.log(`   ❌ ${check.label}: Error - ${error.message}`);
      allPassed = false;
    } else if (count === check.expected) {
      console.log(`   ✅ ${check.label}: ${count} record(s)`);
    } else {
      console.log(`   ⚠️  ${check.label}: Expected ${check.expected}, found ${count}`);
      allPassed = false;
    }
  }

  console.log('');
  return allPassed;
}

async function main() {
  try {
    // Test connection
    console.log('🔌 Testing database connection...');
    const { data, error } = await supabase.from('ai_presenter_clients').select('count', { count: 'exact', head: true });

    if (error) {
      console.error(`   ❌ Connection failed: ${error.message}\n`);
      process.exit(1);
    }

    console.log('   ✅ Connected successfully!\n');

    // Check if client already exists
    const clientExists = await verifyClient();

    if (clientExists) {
      console.log('⚠️  WARNING: Client c1111111-1111-1111-1111-111111111111 already exists!');
      console.log('   This might cause conflicts. Consider cleaning up first.\n');
    }

    // Load migration files
    const migration1Path = join(projectRoot, 'supabase', 'migrations', '20250113_sample_data_FIXED.sql');
    const migration2Path = join(projectRoot, 'supabase', 'migrations', '20250117_disruptors_complete_demo_data_FIXED.sql');

    console.log('📂 Loading migration files...');
    const migration1SQL = readFileSync(migration1Path, 'utf-8');
    const migration2SQL = readFileSync(migration2Path, 'utf-8');
    console.log('   ✅ Migrations loaded\n');

    // Apply migrations
    console.log('🚀 Applying migrations...\n');

    // Migration 1: Sample data
    console.log('═══════════════════════════════════════════');
    console.log('MIGRATION 1: Sample Data');
    console.log('═══════════════════════════════════════════\n');

    // Split migration 1 into manageable chunks
    const m1Statements = migration1SQL
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--') && s !== 'BEGIN' && s !== 'COMMIT');

    for (let i = 0; i < m1Statements.length; i++) {
      const statement = m1Statements[i];
      if (statement.startsWith('INSERT INTO ai_presenter_clients')) {
        const { error } = await supabase.rpc('exec', { sql: statement + ';' });
        if (error && !error.message.includes('duplicate')) {
          console.error(`Error on statement ${i + 1}: ${error.message}`);
        } else {
          console.log(`   ✅ Executed statement ${i + 1}/${m1Statements.length}`);
        }
      } else if (statement.startsWith('INSERT INTO ai_presenter_case_studies')) {
        // Execute case studies insert
        const { error } = await supabase.rpc('exec', { sql: statement + ';' });
        if (error) {
          console.error(`Error on case studies: ${error.message}`);
        } else {
          console.log(`   ✅ Inserted case studies`);
        }
      } else if (statement.startsWith('INSERT INTO ai_presenter_services')) {
        const { error } = await supabase.rpc('exec', { sql: statement + ';' });
        if (error) {
          console.error(`Error on services: ${error.message}`);
        } else {
          console.log(`   ✅ Inserted services`);
        }
      } else if (statement.startsWith('INSERT INTO ai_presenter_presentations')) {
        const { error } = await supabase.rpc('exec', { sql: statement + ';' });
        if (error) {
          console.error(`Error on presentations: ${error.message}`);
        } else {
          console.log(`   ✅ Inserted presentations`);
        }
      }
    }

    console.log('\n');

    // Migration 2: Complete demo data
    console.log('═══════════════════════════════════════════');
    console.log('MIGRATION 2: Complete Demo Data');
    console.log('═══════════════════════════════════════════\n');

    const m2Statements = migration2SQL
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--') && s !== 'BEGIN' && s !== 'COMMIT');

    for (let i = 0; i < m2Statements.length; i++) {
      const statement = m2Statements[i];
      if (statement.length < 20) continue; // Skip very short statements

      const { error } = await supabase.rpc('exec', { sql: statement + ';' });
      if (error && !error.message.includes('duplicate')) {
        console.error(`Error on statement ${i + 1}: ${error.message}`);
      } else {
        console.log(`   ✅ Executed statement ${i + 1}/${m2Statements.length}`);
      }
    }

    console.log('\n');

    // Verify
    console.log('═══════════════════════════════════════════');
    console.log('VERIFICATION');
    console.log('═══════════════════════════════════════════\n');

    const verified = await verifyData();

    if (verified) {
      console.log('✅ All migrations applied successfully!\n');
    } else {
      console.log('⚠️  Migrations applied with some warnings. Please review above.\n');
    }

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
