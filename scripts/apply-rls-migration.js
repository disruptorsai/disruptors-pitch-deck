/**
 * Apply RLS Policy Migration
 *
 * This script guides you through applying the RLS policy manually
 * Opens the Supabase SQL Editor and provides the SQL to paste
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
console.log('🚀 AI Presenter - Apply RLS Policy Migration');
console.log('═'.repeat(70));
console.log('\n');

console.log('📋 Migration: Add public read access for ALL active client data');
console.log('🗄️  Project:', projectRef);
console.log('🔗 URL:', SUPABASE_URL);
console.log('\n');

// Read the comprehensive migration file
const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20250117_add_public_read_policy.sql');
const migrationSQL = readFileSync(migrationPath, 'utf8');

console.log('═'.repeat(70));
console.log('📝 SQL TO EXECUTE');
console.log('═'.repeat(70));
console.log('\n');
console.log(migrationSQL);
console.log('\n');

console.log('═'.repeat(70));
console.log('📌 INSTRUCTIONS');
console.log('═'.repeat(70));
console.log('\n');

console.log('This script will open the Supabase SQL Editor in your browser.');
console.log('Then follow these steps:\n');

console.log('  1️⃣  Wait for the SQL Editor to load');
console.log('  2️⃣  Copy the SQL code above (or from the clipboard if auto-copied)');
console.log('  3️⃣  Paste it into the SQL Editor');
console.log('  4️⃣  Click the "Run" button (or press Ctrl+Enter / Cmd+Enter)');
console.log('  5️⃣  Verify you see "Success. No rows returned"\n');

console.log('═'.repeat(70));
console.log('\n');

// URL to open
const sqlEditorURL = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;

console.log('🔗 Opening SQL Editor in your browser...\n');
console.log(`   ${sqlEditorURL}\n`);

// Try to open browser
const command = process.platform === 'win32' ? 'start' :
                process.platform === 'darwin' ? 'open' : 'xdg-open';

exec(`${command} "${sqlEditorURL}"`, (error) => {
  if (error) {
    console.log('⚠️  Could not auto-open browser. Please open manually:');
    console.log(`   ${sqlEditorURL}\n`);
  } else {
    console.log('✅ Browser opened!\n');
  }

  console.log('═'.repeat(70));
  console.log('🧪 AFTER APPLYING THE MIGRATION');
  console.log('═'.repeat(70));
  console.log('\n');

  console.log('Run this command to verify the migration worked:\n');
  console.log('   node scripts/verify-rls-policy.js\n');

  console.log('Expected output:');
  console.log('   🎉 VERIFICATION COMPLETE - ALL TESTS PASSED!\n');

  console.log('═'.repeat(70));
  console.log('\n');

  console.log('📋 SQL CODE (ready to copy):\n');
  console.log('┌' + '─'.repeat(68) + '┐');
  migrationSQL.split('\n').forEach(line => {
    console.log('│ ' + line.padEnd(67) + '│');
  });
  console.log('└' + '─'.repeat(68) + '┘');
  console.log('\n');

  console.log('💡 Tip: The SQL is also in the migration file:');
  console.log('   supabase/migrations/20250117_add_public_read_policy.sql\n');

  console.log('📚 This migration adds 8 public read policies for:');
  console.log('   • ai_presenter_clients (active clients only)');
  console.log('   • ai_presenter_presentations');
  console.log('   • ai_presenter_slides');
  console.log('   • ai_presenter_services');
  console.log('   • ai_presenter_case_studies');
  console.log('   • ai_presenter_competitive_analysis');
  console.log('   • ai_presenter_team_members');
  console.log('   • ai_presenter_file_uploads\n');

  console.log('═'.repeat(70));
  console.log('\n');
});
