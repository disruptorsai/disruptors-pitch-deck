import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('Ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Running database migration...\n');

  try {
    // Read the migration file
    const migrationPath = join(__dirname, '../supabase/migrations/20250114_add_comprehensive_client_intelligence.sql');
    const sql = readFileSync(migrationPath, 'utf-8');

    console.log('📄 Migration file loaded');
    console.log('🔧 Applying schema changes...\n');

    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // If exec_sql doesn't exist, try direct execution (requires proper permissions)
      console.log('⚠️  exec_sql RPC not available, trying direct execution...');

      // Split into individual statements and execute
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--'));

      for (const statement of statements) {
        if (statement) {
          const { error: execError } = await supabase.rpc('exec_sql', { sql: statement });
          if (execError) throw execError;
        }
      }
    }

    console.log('✅ Migration completed successfully!\n');
    console.log('📊 New columns added to ai_presenter_clients:');
    console.log('   - full_description (TEXT)');
    console.log('   - industry (VARCHAR)');
    console.log('   - sub_industry (VARCHAR)');
    console.log('   - founded_year (VARCHAR)');
    console.log('   - company_size (VARCHAR)');
    console.log('   - social_media (JSONB)');
    console.log('   - services (JSONB)');
    console.log('   - key_features (JSONB)');
    console.log('   - technologies_detected (JSONB)');
    console.log('   - competitive_advantages (JSONB)');
    console.log('   - potential_competitors (JSONB)');
    console.log('   - strengths (JSONB)');
    console.log('   - opportunities (JSONB)');
    console.log('   - certifications (JSONB)');
    console.log('   - partnerships (JSONB)');
    console.log('   - ... and 11 more fields for complete business intelligence\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\n💡 Manual alternative:');
    console.error('   1. Go to https://app.supabase.com/project/ubqxflzuvxowigbjmqfb/editor');
    console.error('   2. Open SQL Editor');
    console.error('   3. Copy and paste the contents of:');
    console.error('      supabase/migrations/20250114_add_comprehensive_client_intelligence.sql');
    console.error('   4. Click "Run"\n');
    process.exit(1);
  }
}

runMigration();
