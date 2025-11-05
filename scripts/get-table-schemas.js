/**
 * Get Table Schemas
 *
 * Fetches the actual column definitions for case studies, services, and pricing tiers tables
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

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function getTableSchema() {
  console.log('Fetching table schemas...\n');

  // Try to get a sample row from each table to see the structure
  const tables = [
    'ai_presenter_case_studies',
    'ai_presenter_services',
    'ai_presenter_pricing_tiers'
  ];

  for (const table of tables) {
    console.log(`\n📋 ${table}:`);
    console.log('─'.repeat(60));

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);

    if (error) {
      console.log(`   Error: ${error.message}`);
    } else if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log(`   Columns (${columns.length}):`);
      columns.forEach(col => {
        const value = data[0][col];
        const type = typeof value;
        console.log(`   - ${col} (${type})`);
      });
    } else {
      console.log('   No data in table');
    }
  }
}

getTableSchema();
