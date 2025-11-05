import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ubqxflzuvxowigbjmqfb.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Applying database migration to Supabase...\n');
console.log(`📍 Database: ${supabaseUrl}\n`);

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Read migration SQL
const migrationSQL = readFileSync('./supabase/migrations/20250114_add_comprehensive_client_intelligence.sql', 'utf-8');

// Split into individual ALTER TABLE statements
const statements = migrationSQL
  .split(';')
  .map(s => s.trim())
  .filter(s => s && s.length > 10 && !s.startsWith('--') && !s.startsWith('COMMENT'));

console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

// Execute each statement
for (let i = 0; i < statements.length; i++) {
  const statement = statements[i];
  console.log(`Executing statement ${i + 1}/${statements.length}...`);

  try {
    // Use Supabase REST API to execute raw SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ query: statement })
    });

    if (!response.ok) {
      console.log(`⚠️  Statement ${i + 1} couldn't be executed via RPC (this is normal)`);
    } else {
      console.log(`✅ Statement ${i + 1} executed`);
    }
  } catch (err) {
    console.log(`⚠️  Error on statement ${i + 1}: ${err.message}`);
  }
}

console.log('\n' + '='.repeat(60));
console.log('⚠️  MANUAL MIGRATION REQUIRED ⚠️');
console.log('='.repeat(60));
console.log('\nDue to Supabase security restrictions, please apply the migration manually:\n');
console.log('1. Open: https://app.supabase.com/project/ubqxflzuvxowigbjmqfb/editor');
console.log('2. Click "SQL Editor" in the left sidebar');
console.log('3. Click "New Query"');
console.log('4. Copy the entire contents of:');
console.log('   supabase/migrations/20250114_add_comprehensive_client_intelligence.sql');
console.log('5. Paste into the SQL editor');
console.log('6. Click "Run" (or press Ctrl+Enter)\n');
console.log('The migration will add 26 new columns to store comprehensive business intelligence.');
console.log('This will enable AI-powered presentation personalization.\n');
