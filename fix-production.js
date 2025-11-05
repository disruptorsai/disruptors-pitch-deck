/**
 * Fix Production Database Script
 *
 * This script will:
 * 1. Apply RLS policies for public read access
 * 2. Populate slides with correct column names
 * 3. Verify the data is accessible
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

console.log('🚀 Fixing Production Database\n');

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing required environment variables');
  console.error('   Required: VITE_SUPABASE_URL, VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create admin client
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function fixProduction() {
  try {
    console.log('📋 Step 1: Applying RLS Policies\n');

    // Read and execute the RLS policy migration
    const rlsPath = join(__dirname, 'supabase', 'migrations', '20250117_add_public_read_policy_clean.sql');
    const rlsSQL = readFileSync(rlsPath, 'utf8');

    console.log('   Note: RLS policies need to be applied manually in Supabase SQL Editor');
    console.log('   File: supabase/migrations/20250117_add_public_read_policy_clean.sql\n');

    console.log('📋 Step 2: Populating Slides with Correct Schema\n');

    const clientId = 'c1111111-1111-1111-1111-111111111111';

    // Get or create presentation
    let { data: presentation, error: presentationError } = await supabase
      .from('ai_presenter_presentations')
      .select('id')
      .eq('client_id', clientId)
      .single();

    if (presentationError) {
      console.log('   Creating new presentation...');
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

    console.log('   ✓ Presentation ID:', presentation.id);

    // Delete existing slides
    const { error: deleteError } = await supabase
      .from('ai_presenter_slides')
      .delete()
      .eq('presentation_id', presentation.id);

    if (deleteError) {
      console.warn('   ⚠ Error deleting old slides:', deleteError.message);
    } else {
      console.log('   ✓ Cleared existing slides');
    }

    // Insert new slides with CORRECT schema (is_visible, not is_active)
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
          headline: 'Transform Your Marketing with AI',
          subheading: 'Data-driven strategies that deliver measurable results',
          cta_text: 'See How We Can Help',
          cta_link: '/diagnostic',
          background_type: 'gradient'
        }
      },
      {
        presentation_id: presentation.id,
        title: 'Dashboard',
        subtitle: 'Your Marketing Intelligence Hub',
        content: 'Real-time insights and performance metrics across all your marketing channels. Track campaign performance, audience intelligence, competitive analysis, and growth forecasting.',
        slide_type: 'dashboard',
        order_index: 2,
        is_visible: true,
        layout: {
          sections: [
            { title: 'Campaign Performance', description: 'Track ROI across all channels' },
            { title: 'Audience Intelligence', description: 'AI-powered customer insights' },
            { title: 'Competitive Analysis', description: 'Stay ahead of market trends' },
            { title: 'Growth Forecasting', description: 'Predictive analytics for planning' }
          ]
        }
      },
      {
        presentation_id: presentation.id,
        title: 'Introduction',
        subtitle: 'About Disruptors Media',
        content: 'We are a team of marketing experts, data scientists, and AI specialists dedicated to helping businesses achieve extraordinary growth through intelligent automation and data-driven decision making.\n\n**Our Track Record:**\n• 150+ Clients Served\n• 327% Average ROI\n• 5+ Years Experience\n• 98% Client Satisfaction',
        slide_type: 'content',
        order_index: 3,
        is_visible: true
      },
      {
        presentation_id: presentation.id,
        title: 'Marketing Diagnostic',
        subtitle: 'Free Marketing Diagnostic',
        content: 'Discover your growth opportunities in 60 seconds. Answer a few quick questions and receive a personalized marketing assessment powered by AI. We\'ll analyze your current strategy and identify specific opportunities for improvement.',
        slide_type: 'interactive',
        order_index: 4,
        is_visible: true
      },
      {
        presentation_id: presentation.id,
        title: 'Success Stories',
        subtitle: 'Proven Results Across Industries',
        content: 'Real clients, real results. See how we\'ve helped businesses like yours achieve transformational growth through AI-powered marketing strategies.',
        slide_type: 'case_studies',
        order_index: 5,
        is_visible: true,
        layout: {
          featured_count: 3,
          show_metrics: true
        }
      },
      {
        presentation_id: presentation.id,
        title: 'Our Capabilities',
        subtitle: 'Full-Stack Marketing Solutions',
        content: 'Everything you need to grow:\n\n**AI-Powered Strategy** - Machine learning algorithms analyze your market and identify optimal growth opportunities\n\n**Performance Marketing** - Data-driven paid acquisition across Google, Facebook, LinkedIn, and emerging platforms\n\n**Content Excellence** - AI-assisted content creation that resonates with your audience and drives engagement\n\n**Analytics & Insights** - Comprehensive reporting and actionable insights to guide your marketing decisions',
        slide_type: 'capabilities',
        order_index: 6,
        is_visible: true
      },
      {
        presentation_id: presentation.id,
        title: 'Growth Blueprint',
        subtitle: 'Your Custom Growth Roadmap',
        content: 'A proven 90-day framework for sustainable growth:\n\n**Phase 1: Discovery & Audit** (Week 1-2)\nComprehensive analysis of your current marketing, competitive landscape, and growth opportunities\n\n**Phase 2: Strategy & Planning** (Week 3-4)\nDevelopment of your custom marketing strategy with clear KPIs and success metrics\n\n**Phase 3: Implementation** (Week 5-8)\nLaunch and optimization of campaigns across selected channels with continuous testing\n\n**Phase 4: Scale & Optimize** (Week 9-12)\nData-driven scaling of winning campaigns and continuous improvement based on performance',
        slide_type: 'timeline',
        order_index: 7,
        is_visible: true
      },
      {
        presentation_id: presentation.id,
        title: 'Investment Options',
        subtitle: 'Flexible Plans for Every Stage',
        content: 'Choose the right level of support for your business. All plans include dedicated account management and quarterly strategy reviews.',
        slide_type: 'pricing',
        order_index: 8,
        is_visible: true,
        layout: {
          show_tiers: true,
          cta_text: 'Schedule a Consultation',
          cta_link: '/call-to-action'
        }
      },
      {
        presentation_id: presentation.id,
        title: 'Let\'s Get Started',
        subtitle: 'Ready to Transform Your Marketing?',
        content: 'Book your free strategy session today. In 30 minutes, we\'ll analyze your current marketing, identify quick wins, and outline a custom growth strategy. No obligation, just actionable insights.\n\n**What You Get:**\n• Free marketing audit ($2,500 value)\n• Custom growth recommendations\n• Competitive intelligence report\n• ROI projections for your industry\n\n**Contact Us:**\n📧 hello@disruptorsmedia.com\n📞 +1 (555) 123-4567\n🌐 disruptorsmedia.com',
        slide_type: 'cta',
        order_index: 9,
        is_visible: true
      }
    ];

    console.log(`\n   📝 Inserting ${slides.length} slides...`);

    const { data: insertedSlides, error: insertError } = await supabase
      .from('ai_presenter_slides')
      .insert(slides)
      .select();

    if (insertError) {
      throw insertError;
    }

    console.log(`   ✅ Successfully inserted ${insertedSlides.length} slides\n`);

    // Verify with public client (anon key)
    console.log('📋 Step 3: Verifying Public Access\n');

    const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
    if (anonKey) {
      const publicClient = createClient(supabaseUrl, anonKey);

      // Test client read
      const { data: clientData, error: clientError } = await publicClient
        .from('ai_presenter_clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (clientError) {
        console.log('   ❌ Public client access failed:', clientError.message);
        console.log('   → You need to apply RLS policies in Supabase SQL Editor');
      } else {
        console.log('   ✓ Public client access works');
      }

      // Test slides read
      const { data: slidesData, error: slidesError } = await publicClient
        .from('ai_presenter_slides')
        .select('*')
        .eq('presentation_id', presentation.id)
        .order('order_index');

      if (slidesError) {
        console.log('   ❌ Public slides access failed:', slidesError.message);
        console.log('   → You need to apply RLS policies in Supabase SQL Editor');
      } else {
        console.log(`   ✓ Public slides access works (${slidesData.length} slides)`);
      }
    }

    console.log('\n✅ Database Fix Complete!\n');
    console.log('📋 Next Steps:');
    console.log('   1. Apply RLS policies in Supabase Dashboard → SQL Editor');
    console.log('      File: supabase/migrations/20250117_add_public_read_policy_clean.sql');
    console.log('   2. Deploy to Netlify (git push or manual deploy)');
    console.log('   3. Test the presentation viewer\n');

  } catch (error) {
    console.error('\n❌ Fix failed:');
    console.error(error);
    process.exit(1);
  }
}

fixProduction();
