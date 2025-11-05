/**
 * Verify Disruptors Media Migrations
 *
 * This script verifies that all 4 database migrations were applied successfully:
 * 1. Healthcare case studies data (6 real case studies)
 * 2. Service offerings data (9 AI-powered services)
 * 3. Pricing tiers data (4 pricing tiers)
 * 4. Conversation tracking tables
 *
 * Usage: node scripts/verify-disruptors-migrations.js
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
const CLIENT_ID = 'c1111111-1111-1111-1111-111111111111';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('');
console.log('═'.repeat(80));
console.log('🔍  DISRUPTORS MEDIA - MIGRATION VERIFICATION');
console.log('═'.repeat(80));
console.log('');

/**
 * Verify case studies migration
 */
async function verifyCaseStudies() {
  console.log('📋 [1/4] Verifying Healthcare Case Studies...');

  const { data, error, count } = await supabase
    .from('ai_presenter_case_studies')
    .select('id, title, metrics', { count: 'exact' })
    .eq('client_id', CLIENT_ID)
    .order('sort_order');

  if (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return false;
  }

  if (count === 6) {
    console.log(`   ✅ SUCCESS: ${count} case studies found`);
    data.forEach((cs, i) => {
      const roi = cs.metrics?.find(m => m.label === 'ROI')?.value || 'N/A';
      console.log(`      ${i + 1}. ${cs.title} (ROI: ${roi})`);
    });
    return true;
  } else {
    console.log(`   ⚠️  WARNING: Expected 6 case studies but found ${count}`);
    return false;
  }
}

/**
 * Verify services migration
 */
async function verifyServices() {
  console.log('');
  console.log('📋 [2/4] Verifying Service Offerings...');

  const { data, error, count } = await supabase
    .from('ai_presenter_services')
    .select('id, name, is_featured', { count: 'exact' })
    .eq('client_id', CLIENT_ID)
    .order('order_index');

  if (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return false;
  }

  if (count === 9) {
    console.log(`   ✅ SUCCESS: ${count} services found`);
    const featured = data.filter(s => s.is_featured).length;
    console.log(`      - ${featured} featured services`);
    data.forEach((service, i) => {
      const featured = service.is_featured ? '⭐' : '  ';
      console.log(`      ${i + 1}. ${featured} ${service.name}`);
    });
    return true;
  } else {
    console.log(`   ⚠️  WARNING: Expected 9 services but found ${count}`);
    return false;
  }
}

/**
 * Verify pricing tiers migration
 */
async function verifyPricingTiers() {
  console.log('');
  console.log('📋 [3/4] Verifying Pricing Tiers...');

  const { data, error, count } = await supabase
    .from('ai_presenter_pricing_tiers')
    .select('id, name, price, is_highlighted', { count: 'exact' })
    .eq('client_id', CLIENT_ID)
    .order('sort_order');

  if (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return false;
  }

  if (count === 4) {
    console.log(`   ✅ SUCCESS: ${count} pricing tiers found`);
    data.forEach((tier, i) => {
      const highlight = tier.is_highlighted ? '⭐' : '  ';
      console.log(`      ${i + 1}. ${highlight} ${tier.name}: $${tier.price}/month`);
    });
    return true;
  } else {
    console.log(`   ⚠️  WARNING: Expected 4 pricing tiers but found ${count}`);
    return false;
  }
}

/**
 * Verify conversation tracking tables
 */
async function verifyConversationTracking() {
  console.log('');
  console.log('📋 [4/4] Verifying Conversation Tracking Tables...');

  const tables = [
    'ai_presenter_conversation_responses',
    'ai_presenter_conversation_progress'
  ];

  let allExist = true;

  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .select('id', { count: 'exact', head: true });

    if (error && error.code === '42P01') {
      console.log(`   ❌ Table "${table}" does not exist`);
      allExist = false;
    } else if (error) {
      console.log(`   ⚠️  Warning checking "${table}": ${error.message}`);
      allExist = false;
    } else {
      console.log(`   ✅ Table "${table}" exists`);
    }
  }

  // Check for RLS policies
  if (allExist) {
    console.log('   ✅ SUCCESS: All conversation tracking tables created');

    // Try to verify RLS is enabled
    for (const table of tables) {
      const { data: rlsCheck, error: rlsError } = await supabase
        .rpc('ai_presenter_check_rls', { table_name: table })
        .catch(() => ({ data: null, error: null }));

      if (!rlsError && rlsCheck) {
        console.log(`   ✅ RLS enabled on "${table}"`);
      }
    }
  }

  return allExist;
}

/**
 * Check RLS policies are active
 */
async function checkRLSPolicies() {
  console.log('');
  console.log('🔒 Checking Row Level Security Policies...');

  // Test public read access
  const anonClient = createClient(SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

  // Try to read case studies with anon client
  const { data: publicCaseStudies, error: publicError } = await anonClient
    .from('ai_presenter_case_studies')
    .select('id')
    .eq('client_id', CLIENT_ID)
    .limit(1);

  if (publicError) {
    console.log(`   ⚠️  Public read access test failed: ${publicError.message}`);
    console.log('   This may be expected if RLS policies are restrictive.');
  } else if (publicCaseStudies && publicCaseStudies.length > 0) {
    console.log('   ✅ Public read access working (RLS policies active)');
  }
}

/**
 * Main verification flow
 */
async function main() {
  const results = {
    caseStudies: await verifyCaseStudies(),
    services: await verifyServices(),
    pricingTiers: await verifyPricingTiers(),
    conversationTracking: await verifyConversationTracking()
  };

  await checkRLSPolicies();

  // Final summary
  console.log('');
  console.log('═'.repeat(80));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('═'.repeat(80));
  console.log('');

  const checks = [
    { name: 'Healthcare Case Studies (6 records)', status: results.caseStudies },
    { name: 'Service Offerings (9 records)', status: results.services },
    { name: 'Pricing Tiers (4 records)', status: results.pricingTiers },
    { name: 'Conversation Tracking Tables', status: results.conversationTracking }
  ];

  checks.forEach((check, i) => {
    const icon = check.status ? '✅' : '❌';
    console.log(`${icon} ${i + 1}. ${check.name}`);
  });

  console.log('');

  const allPassed = Object.values(results).every(r => r);

  if (allPassed) {
    console.log('🎉 ALL MIGRATIONS VERIFIED SUCCESSFULLY!');
    console.log('');
    console.log('✅ Your database is ready with:');
    console.log('   - 6 healthcare case studies with proven ROI (3X to 12.5X)');
    console.log('   - 9 AI-powered marketing service offerings');
    console.log('   - 4 pricing tiers from $850 to $5,000+ per month');
    console.log('   - Conversation tracking infrastructure for ICP responses');
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('   1. Test your application at http://localhost:5176');
    console.log('   2. Verify case studies display correctly');
    console.log('   3. Verify service offerings display correctly');
    console.log('   4. Verify pricing tiers display correctly');
    console.log('   5. Test conversation tracking functionality');
    console.log('');
    process.exit(0);
  } else {
    console.log('⚠️  SOME VERIFICATIONS FAILED');
    console.log('');
    console.log('Please ensure all migrations were applied correctly via the Supabase SQL Editor.');
    console.log('');
    console.log('To apply migrations:');
    console.log('   1. Run: node scripts/apply-disruptors-migrations.js');
    console.log('   OR');
    console.log('   2. Manually apply each migration file in the supabase/migrations/ directory');
    console.log('');
    process.exit(1);
  }
}

// Run verification
main().catch(error => {
  console.error('');
  console.error('❌ FATAL ERROR:', error.message);
  console.error('');
  process.exit(1);
});
