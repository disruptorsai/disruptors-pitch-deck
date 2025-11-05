/**
 * Apply Migrations Programmatically
 *
 * This script attempts to apply migrations programmatically by executing
 * individual INSERT statements through the Supabase client.
 *
 * Usage: node scripts/apply-migrations-programmatic.js
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

// Initialize Supabase client with service role
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('');
console.log('═'.repeat(80));
console.log('🚀  PROGRAMMATIC MIGRATION APPLICATION');
console.log('═'.repeat(80));
console.log('');

/**
 * Apply Migration 1: Healthcare Case Studies
 */
async function applyMigration1() {
  console.log('📝 [1/4] Applying Healthcare Case Studies Migration...');
  console.log('');

  try {
    // Delete existing case studies
    console.log('   🗑️  Deleting existing case studies...');
    const { error: deleteError } = await supabase
      .from('ai_presenter_case_studies')
      .delete()
      .eq('client_id', CLIENT_ID);

    if (deleteError) {
      console.log(`   ⚠️  Warning during delete: ${deleteError.message}`);
    } else {
      console.log('   ✅ Existing case studies deleted');
    }

    // Read migration file to extract data
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20251020_disruptors_healthcare_data.sql');
    const sqlContent = readFileSync(migrationPath, 'utf8');

    // Parse and execute (simplified approach - insert the 6 case studies)
    const caseStudies = [
      {
        client_id: CLIENT_ID,
        title: 'Wellness & Hormone Therapy Clinic',
        industry: 'Healthcare',
        challenge: 'Focused Google Search campaigns around hormone therapy, intimacy wellness, and weight management, with retargeting for non-converting site visitors.',
        solution: 'Custom landing pages with patient testimonials and booking flows optimized for mobile.',
        results: {
          roi_percentage: 350,
          ctr: '5.8%',
          cpl: '$72',
          conversion_rate: '11%',
          time_to_value: '90 days'
        },
        metrics: [
          { label: 'CTR', value: '5.8%', type: 'percentage', benchmark: '3% industry avg' },
          { label: 'Cost Per Lead', value: '$72', type: 'currency' },
          { label: 'Conversion Rate', value: '11%', type: 'percentage' },
          { label: 'ROI', value: '3.5X', type: 'multiplier' }
        ],
        accent_color: '#00D9FF',
        sort_order: 1,
        is_featured: true
      },
      {
        client_id: CLIENT_ID,
        title: 'Telehealth Provider',
        industry: 'Healthcare',
        challenge: 'Always-on campaigns targeting urgent care and specialty telehealth, benchmarked at 25,000 impressions and 5+ weekly leads.',
        solution: 'Integrated with content marketing and SEO to reinforce messaging.',
        results: {
          roi_percentage: 400,
          avg_weekly_impressions: '65,000+',
          peak_impressions: '117,000',
          avg_weekly_leads: '15-20',
          cpl: '$58',
          time_to_value: '60 days'
        },
        metrics: [
          { label: 'Weekly Impressions', value: '65,000+', type: 'number', benchmark: 'Peaked at 117K' },
          { label: 'Weekly Leads', value: '15-20', type: 'range', benchmark: '3-4X target' },
          { label: 'Cost Per Lead', value: '$58', type: 'currency' },
          { label: 'ROI', value: '4X', type: 'multiplier' }
        ],
        accent_color: '#FF6A00',
        sort_order: 2,
        is_featured: true
      },
      {
        client_id: CLIENT_ID,
        title: 'Aesthetic & Body Contouring Clinic',
        industry: 'Healthcare',
        challenge: 'Multi-channel Google Ads across Search, Display, YouTube, and Shopping, timed with seasonal demand (summer prep, New Year promotions).',
        solution: 'Retargeted prior visitors with promotional offers and educational video ads.',
        results: {
          roi_percentage: 330,
          ctr: '6.2%',
          total_leads: '350+',
          cpl: '$64',
          revenue_impact: '$210,000+',
          time_to_value: '180 days'
        },
        metrics: [
          { label: 'CTR', value: '6.2%', type: 'percentage' },
          { label: 'Consult Requests', value: '350+', type: 'number', benchmark: 'in 6 months' },
          { label: 'Cost Per Lead', value: '$64', type: 'currency' },
          { label: 'Revenue Impact', value: '$210K+', type: 'currency' },
          { label: 'ROI', value: '3.3X', type: 'multiplier' }
        ],
        accent_color: '#9B30FF',
        sort_order: 3,
        is_featured: true
      },
      {
        client_id: CLIENT_ID,
        title: 'Specialized Medical Services Practice',
        industry: 'Healthcare',
        challenge: 'Ran targeted Google Ads alongside an aggressive SEO/content push. Overcame ad restrictions in sensitive medical categories.',
        solution: 'Built keyword-rich content, secured backlinks, and retargeted high-intent audiences.',
        results: {
          roi_percentage: 300,
          organic_traffic_growth: '+220%',
          total_leads: '200+',
          cpl: '$81',
          time_to_value: '180 days'
        },
        metrics: [
          { label: 'Organic Traffic Growth', value: '+220%', type: 'percentage', benchmark: 'in 6 months' },
          { label: 'Leads from Ads', value: '200+', type: 'number' },
          { label: 'Cost Per Lead', value: '$81', type: 'currency' },
          { label: 'ROI', value: '3X', type: 'multiplier' }
        ],
        accent_color: '#00FF88',
        sort_order: 4,
        is_featured: false
      },
      {
        client_id: CLIENT_ID,
        title: 'Regional Multi-Location Clinic',
        industry: 'Healthcare',
        challenge: 'Performance Max campaigns with quizzes and incentives as lead magnets. Budget started small ($10/day) and scaled regionally.',
        solution: 'Landing pages pixeled for retargeting across Google and Meta.',
        results: {
          roi_percentage: 400,
          ctr: '7.1%',
          total_leads: '450+',
          cpl: '$55',
          revenue_impact: '$180,000+',
          time_to_value: '90 days'
        },
        metrics: [
          { label: 'CTR', value: '7.1%', type: 'percentage' },
          { label: 'Leads', value: '450+', type: 'number', benchmark: 'across 3 locations in Q1' },
          { label: 'Cost Per Lead', value: '$55', type: 'currency' },
          { label: 'Revenue Impact', value: '$180K+', type: 'currency' },
          { label: 'ROI', value: '4X', type: 'multiplier' }
        ],
        accent_color: '#FFD700',
        sort_order: 5,
        is_featured: false
      },
      {
        client_id: CLIENT_ID,
        title: 'Enterprise-Scale Healthcare Campaign',
        industry: 'Healthcare',
        challenge: 'National-level Google Ads program with a monthly ad spend of $2M, targeting multiple service lines and patient demographics across the U.S.',
        solution: 'Comprehensive campaign mix including Search, Display, YouTube, and programmatic retargeting. Performance tracked daily with advanced attribution modeling and conversion-optimized landing funnels.',
        results: {
          roi_percentage: 1250,
          annual_ad_spend: '$24M',
          annual_revenue_generated: '$300M',
          impact: 'Top provider nationwide',
          time_to_value: '365 days'
        },
        metrics: [
          { label: 'Annual Ad Spend', value: '$24M', type: 'currency' },
          { label: 'Annual Revenue', value: '$300M', type: 'currency' },
          { label: 'ROI', value: '12.5X', type: 'multiplier' },
          { label: 'Impact', value: 'Market Leader', type: 'text', benchmark: 'Nationwide dominance in category' }
        ],
        accent_color: '#FF1493',
        sort_order: 6,
        is_featured: true
      }
    ];

    console.log(`   📊 Inserting ${caseStudies.length} case studies...`);

    const { data, error } = await supabase
      .from('ai_presenter_case_studies')
      .insert(caseStudies)
      .select();

    if (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
      return false;
    }

    console.log(`   ✅ SUCCESS: ${data.length} case studies inserted`);
    console.log('');
    return true;

  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    console.log('');
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('⚠️  NOTE: This script will apply migrations programmatically.');
  console.log('   It will delete existing data and insert new data.');
  console.log('');
  console.log('   Press Ctrl+C to cancel, or wait 3 seconds to continue...');
  console.log('');

  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('   ▶️  Starting migrations...');
  console.log('');

  const result1 = await applyMigration1();

  if (!result1) {
    console.log('❌ Migration 1 failed. Stopping here.');
    console.log('');
    console.log('💡 TIP: You can apply migrations manually via Supabase SQL Editor:');
    console.log('   node scripts/show-migration-instructions.js');
    console.log('');
    process.exit(1);
  }

  console.log('═'.repeat(80));
  console.log('');
  console.log('✅ Migration 1 completed successfully!');
  console.log('');
  console.log('📝 NOTE: For the remaining migrations (2-4), please use the SQL Editor:');
  console.log('');
  console.log('   node scripts/show-migration-instructions.js');
  console.log('');
  console.log('   OR manually apply via Supabase Dashboard:');
  console.log('   https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/sql/new');
  console.log('');
  console.log('═'.repeat(80));
  console.log('');
}

main().catch(error => {
  console.error('');
  console.error('❌ FATAL ERROR:', error.message);
  console.error('');
  process.exit(1);
});
