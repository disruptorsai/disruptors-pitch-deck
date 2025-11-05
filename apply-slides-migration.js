/**
 * Apply Slides Migration Script
 * Populates the slides table with default content
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 Applying Slides Migration\n');

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing required environment variables');
  console.error('   Required: VITE_SUPABASE_URL, VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create admin client
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function applyMigration() {
  try {
    // Read the migration file
    const migrationPath = join(__dirname, 'supabase', 'migrations', '20250117_populate_slides.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration file loaded');
    console.log('📝 Executing SQL...\n');

    // Execute the migration
    // Note: Supabase client doesn't directly support raw SQL execution from client
    // We need to parse and execute individual statements

    // For now, let's insert the slides directly using the Supabase client
    const clientId = 'c1111111-1111-1111-1111-111111111111';

    // Get or create presentation
    let { data: presentation, error: presentationError } = await supabase
      .from('ai_presenter_presentations')
      .select('id')
      .eq('client_id', clientId)
      .single();

    if (presentationError) {
      console.log('Creating new presentation...');
      const { data: newPresentation, error: createError } = await supabase
        .from('ai_presenter_presentations')
        .insert({
          client_id: clientId,
          title: 'Disruptors Media - Agency Presentation',
          description: 'Professional pitch deck showcasing our AI-powered marketing services',
          status: 'active'
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }
      presentation = newPresentation;
    }

    console.log('✓ Presentation ID:', presentation.id);

    // Delete existing slides
    const { error: deleteError } = await supabase
      .from('ai_presenter_slides')
      .delete()
      .eq('presentation_id', presentation.id);

    if (deleteError) {
      console.warn('⚠ Error deleting old slides:', deleteError.message);
    } else {
      console.log('✓ Cleared existing slides');
    }

    // Insert new slides (matching actual schema)
    const slides = [
      {
        presentation_id: presentation.id,
        title: 'Welcome',
        subtitle: 'Transform Your Marketing with AI',
        content: 'Disruptors Media combines cutting-edge AI technology with proven marketing expertise to help businesses scale intelligently. Data-driven strategies that deliver measurable results.',
        slide_type: 'hero',
        order_index: 1,
        is_visible: true,
        layout: {
          cta_text: 'See How We Can Help',
          cta_link: '/diagnostic'
        }
      },
      {
        presentation_id: presentation.id,
        title: 'Dashboard',
        subtitle: 'Your Marketing Intelligence Hub',
        content: 'Real-time insights and performance metrics across all your marketing channels.',
        slide_type: 'content',
        order_index: 2,
        is_visible: true
      },
      {
        presentation_id: presentation.id,
        title: 'Introduction',
        subtitle: 'About Disruptors Media',
        content: 'We are a team of marketing experts, data scientists, and AI specialists dedicated to helping businesses achieve extraordinary growth through intelligent automation and data-driven decision making.\n\n150+ Clients Served | 327% Average ROI | 5+ Years Experience | 98% Client Satisfaction',
        slide_type: 'content',
        order_index: 3,
        is_visible: true
      },
      {
        presentation_id: presentation.id,
        title: 'Marketing Diagnostic',
        subtitle: 'Free Marketing Diagnostic',
        content: 'Discover your growth opportunities in 60 seconds. Answer a few quick questions and receive a personalized marketing assessment powered by AI.',
        slide_type: 'content',
        order_index: 4,
        is_visible: true
      },
      {
        presentation_id: presentation.id,
        title: 'Success Stories',
        subtitle: 'Proven Results Across Industries',
        content: 'Real clients, real results. See how we\'ve helped businesses like yours achieve transformational growth through AI-powered marketing strategies.',
        slide_type: 'content',
        order_index: 5,
        is_visible: true
      },
      {
        presentation_id: presentation.id,
        title: 'Our Capabilities',
        subtitle: 'Full-Stack Marketing Solutions',
        content: 'Everything you need to grow: AI-Powered Strategy, Performance Marketing, Content Excellence, and Analytics & Insights.',
        slide_type: 'content',
        order_index: 6,
        is_visible: true
      },
      {
        presentation_id: presentation.id,
        title: 'Growth Blueprint',
        subtitle: 'Your Custom Growth Roadmap',
        content: 'A proven 90-day framework for sustainable growth: Discovery & Audit → Strategy & Planning → Implementation → Scale & Optimize',
        slide_type: 'content',
        order_index: 7,
        is_visible: true
      },
      {
        presentation_id: presentation.id,
        title: 'Investment Options',
        subtitle: 'Flexible Plans for Every Stage',
        content: 'Choose the right level of support for your business. All plans include dedicated account management and quarterly strategy reviews.',
        slide_type: 'content',
        order_index: 8,
        is_visible: true
      },
      {
        presentation_id: presentation.id,
        title: 'Let\'s Get Started',
        subtitle: 'Ready to Transform Your Marketing?',
        content: 'Book your free strategy session today. In 30 minutes, we\'ll analyze your current marketing, identify quick wins, and outline a custom growth strategy.\n\nContact: hello@disruptorsmedia.com | +1 (555) 123-4567 | disruptorsmedia.com',
        slide_type: 'content',
        order_index: 9,
        is_visible: true
      }
    ];

    console.log(`\n📝 Inserting ${slides.length} slides...`);

    const { data: insertedSlides, error: insertError } = await supabase
      .from('ai_presenter_slides')
      .insert(slides)
      .select();

    if (insertError) {
      throw insertError;
    }

    console.log(`✅ Successfully inserted ${insertedSlides.length} slides\n`);

    // Verify
    const { data: verifySlides, count } = await supabase
      .from('ai_presenter_slides')
      .select('*', { count: 'exact' })
      .eq('presentation_id', presentation.id)
      .order('order_index');

    console.log('📊 Verification:');
    console.log(`   Total slides: ${count}`);
    if (verifySlides && verifySlides.length > 0) {
      console.log('\n   Slide List:');
      verifySlides.forEach(slide => {
        console.log(`   ${slide.order_index}. ${slide.title} (${slide.slug}) - ${slide.layout_type}`);
      });
    }

    console.log('\n✅ Migration complete!\n');
    console.log('🎉 Your presentation now has full slide content.');
    console.log('   Visit http://localhost:5176 to see your presentation\n');

  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error);
    process.exit(1);
  }
}

applyMigration();
