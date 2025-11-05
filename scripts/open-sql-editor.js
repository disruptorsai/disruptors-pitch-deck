/**
 * Open Supabase SQL Editor
 *
 * This script opens the Supabase SQL Editor in your default browser
 * and displays the migration SQL for easy copy-paste
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { exec } from 'child_process';

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
const projectRef = SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

console.log('\n');
console.log('═'.repeat(70));
console.log('  🚀 SUPABASE SQL EDITOR - MIGRATION HELPER');
console.log('═'.repeat(70));
console.log('\n');

if (!projectRef) {
  console.error('❌ Could not determine project reference from SUPABASE_URL');
  process.exit(1);
}

const sqlEditorURL = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;

console.log('📋 STEP 1: Opening Supabase SQL Editor...\n');
console.log(`   Project: ${projectRef}`);
console.log(`   URL: ${sqlEditorURL}\n`);

// Open the URL in default browser
const openCommand = process.platform === 'win32' ? 'start' :
                   process.platform === 'darwin' ? 'open' : 'xdg-open';

exec(`${openCommand} "${sqlEditorURL}"`, (error) => {
  if (error) {
    console.log('⚠️  Could not automatically open browser');
    console.log('   Please manually open: ' + sqlEditorURL);
  } else {
    console.log('✅ SQL Editor opened in your browser\n');
  }

  // Display the SQL to copy
  console.log('─'.repeat(70));
  console.log('📋 STEP 2: Copy this SQL to the editor:');
  console.log('─'.repeat(70));
  console.log('\n');

  const migrationSQL = `-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;

-- Create the policy
CREATE POLICY "Public can view active clients"
    ON ai_presenter_clients
    FOR SELECT
    USING (status = 'active');`;

  console.log(migrationSQL);
  console.log('\n');
  console.log('─'.repeat(70));
  console.log('\n');

  console.log('📋 STEP 3: Execute the SQL');
  console.log('   • Click the "Run" button (or press Ctrl+Enter)');
  console.log('   • Expected result: "Success. No rows returned"\n');

  console.log('─'.repeat(70));
  console.log('\n');

  console.log('📋 STEP 4: Verify the migration');
  console.log('   Run this command in a new terminal:\n');
  console.log('   cd "C:\\Users\\Will\\OneDrive\\Documents\\Projects\\AI Presenter\\disruptors-ai-pitch-deck-74a1c8d5 (1)\\disruptors-pitch-deck"');
  console.log('   node scripts/test-rls-policy.js\n');

  console.log('─'.repeat(70));
  console.log('\n');

  console.log('💡 Need help?');
  console.log('   • Documentation: MIGRATION_INSTRUCTIONS.md');
  console.log('   • Test scripts: scripts/test-rls-policy.js');
  console.log('   • Debug script: scripts/debug-client-access.js\n');

  console.log('═'.repeat(70));
  console.log('\n');
});
