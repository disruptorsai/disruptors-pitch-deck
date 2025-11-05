/**
 * Show Migration Instructions
 *
 * Displays clear instructions for applying all 4 Disruptors Media migrations
 *
 * Usage: node scripts/show-migration-instructions.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

console.log('');
console.log('═'.repeat(80));
console.log('🚀  DISRUPTORS MEDIA - DATABASE MIGRATION INSTRUCTIONS');
console.log('═'.repeat(80));
console.log('');
console.log('This guide will walk you through applying 4 database migrations to Supabase.');
console.log('');
console.log('📋 MIGRATIONS TO APPLY:');
console.log('   1. Healthcare Case Studies (6 records with 3-12.5X ROI)');
console.log('   2. Service Offerings (9 AI-powered marketing services)');
console.log('   3. Pricing Tiers (4 tiers from $850 to $5,000+)');
console.log('   4. Conversation Tracking (ICP response tables)');
console.log('');
console.log('═'.repeat(80));
console.log('');

// Display instructions for each migration
const migrations = [
  {
    number: 1,
    file: '20251020_disruptors_healthcare_data.sql',
    name: 'Healthcare Case Studies',
    expected: '6 case studies inserted'
  },
  {
    number: 2,
    file: '20251020_disruptors_services_data.sql',
    name: 'Service Offerings',
    expected: '9 services inserted'
  },
  {
    number: 3,
    file: '20251020_disruptors_pricing_data.sql',
    name: 'Pricing Tiers',
    expected: '4 pricing tiers inserted'
  },
  {
    number: 4,
    file: '20251020_add_conversation_tracking.sql',
    name: 'Conversation Tracking',
    expected: 'Tables created successfully'
  }
];

console.log('📌 STEP-BY-STEP INSTRUCTIONS:');
console.log('');

migrations.forEach((migration, index) => {
  console.log(`┌${'─'.repeat(78)}┐`);
  console.log(`│ MIGRATION ${migration.number}/4: ${migration.name.toUpperCase().padEnd(63)}│`);
  console.log(`└${'─'.repeat(78)}┘`);
  console.log('');
  console.log(`📄 File: supabase/migrations/${migration.file}`);
  console.log(`✅ Expected: ${migration.expected}`);
  console.log('');
  console.log('🔧 Steps:');
  console.log(`   1. Open Supabase SQL Editor:`);
  console.log(`      https://supabase.com/dashboard/project/${projectRef}/sql/new`);
  console.log('');
  console.log(`   2. Open this file in your code editor:`);
  console.log(`      supabase/migrations/${migration.file}`);
  console.log('');
  console.log('   3. Copy ALL the SQL content from the file');
  console.log('');
  console.log('   4. Paste it into the Supabase SQL Editor');
  console.log('');
  console.log('   5. Click "Run" button (or press Ctrl+Enter)');
  console.log('');
  console.log('   6. Wait for execution to complete');
  console.log('');
  console.log('   7. Verify success message appears');
  console.log('');

  if (index < migrations.length - 1) {
    console.log('   ⏭️  Then continue to next migration...');
    console.log('');
  }
});

console.log('═'.repeat(80));
console.log('');
console.log('🔍 AFTER ALL MIGRATIONS ARE APPLIED:');
console.log('');
console.log('Run the verification script to confirm everything is working:');
console.log('');
console.log('   node scripts/verify-disruptors-migrations.js');
console.log('');
console.log('═'.repeat(80));
console.log('');
console.log('📚 DETAILED GUIDE:');
console.log('');
console.log('For detailed troubleshooting and verification instructions, see:');
console.log('   MIGRATION_GUIDE.md');
console.log('');
console.log('═'.repeat(80));
console.log('');
console.log('🔗 QUICK LINKS:');
console.log('');
console.log(`   Supabase SQL Editor:`);
console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql/new`);
console.log('');
console.log(`   Supabase Table Editor:`);
console.log(`   https://supabase.com/dashboard/project/${projectRef}/editor`);
console.log('');
console.log(`   Supabase Dashboard:`);
console.log(`   https://supabase.com/dashboard/project/${projectRef}`);
console.log('');
console.log('═'.repeat(80));
console.log('');
console.log('✨ TIP: Keep this terminal window open for reference while applying migrations!');
console.log('');
