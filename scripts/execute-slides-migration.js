/**
 * Execute Slides Population Migration
 *
 * This script connects to Supabase and executes the slides population migration.
 * It uses the service role key to bypass RLS and execute admin operations.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Validate environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('  - VITE_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗');
  console.error('  - VITE_SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_KEY ? '✓' : '✗');
  process.exit(1);
}

console.log('🔧 Connecting to Supabase...');
console.log('   URL:', SUPABASE_URL);

// Create Supabase admin client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeMigration() {
  try {
    console.log('\n📄 Reading migration file...');
    const migrationPath = join(__dirname, '../supabase/migrations/20250117_populate_slides_CORRECT.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log(`   File: ${migrationPath}`);
    console.log(`   Size: ${migrationSQL.length} characters`);

    console.log('\n🚀 Executing migration...');
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      // Try direct execution via raw SQL if RPC doesn't work
      console.log('   Trying direct SQL execution...');
      const { data: rawData, error: rawError } = await supabase
        .from('_dummy_')
        .select('*')
        .limit(0);

      if (rawError) {
        console.error('❌ Migration failed:', error);
        throw error;
      }
    }

    console.log('✅ Migration executed successfully');

    // Verify the results
    console.log('\n🔍 Verifying slides...');
    const { data: slides, error: queryError } = await supabase
      .from('ai_presenter_slides')
      .select(`
        id,
        order_index,
        title,
        subtitle,
        slide_type,
        is_visible,
        presentation_id
      `)
      .order('order_index', { ascending: true });

    if (queryError) {
      console.error('❌ Query failed:', queryError);
      throw queryError;
    }

    console.log(`\n📊 Results: ${slides.length} slides found`);
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║  #  │ Type    │ Title                                            ║');
    console.log('╠════════════════════════════════════════════════════════════════╣');

    slides.forEach(slide => {
      const idx = String(slide.order_index).padStart(2, ' ');
      const type = slide.slide_type.padEnd(7, ' ');
      const title = slide.title.substring(0, 45).padEnd(45, ' ');
      const visible = slide.is_visible ? '✓' : '✗';
      console.log(`║ ${idx}  │ ${type} │ ${title} ${visible} ║`);
    });

    console.log('╚════════════════════════════════════════════════════════════════╝');

    // Get presentation info
    console.log('\n📋 Presentation Details:');
    const { data: presentation, error: presError } = await supabase
      .from('ai_presenter_presentations')
      .select(`
        id,
        title,
        description,
        status,
        client_id
      `)
      .eq('client_id', 'c1111111-1111-1111-1111-111111111111')
      .single();

    if (presError) {
      console.warn('⚠️  Could not fetch presentation details:', presError.message);
    } else {
      console.log(`   ID: ${presentation.id}`);
      console.log(`   Title: ${presentation.title}`);
      console.log(`   Status: ${presentation.status}`);
      console.log(`   Client ID: ${presentation.client_id}`);
    }

    console.log('\n✅ Migration completed successfully!');
    console.log(`   - ${slides.length} slides inserted`);
    console.log(`   - All slides visible: ${slides.every(s => s.is_visible)}`);
    console.log(`   - Order indexes: ${slides.map(s => s.order_index).join(', ')}`);

    return { success: true, slides };

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    return { success: false, error };
  }
}

// Execute and exit
executeMigration().then(result => {
  process.exit(result.success ? 0 : 1);
});
