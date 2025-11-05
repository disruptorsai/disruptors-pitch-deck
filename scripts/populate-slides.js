/**
 * Populate AI Presenter Slides
 *
 * Executes the slides population for demo client
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const CLIENT_ID = 'c1111111-1111-1111-1111-111111111111';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

console.log('🔧 Initializing Supabase client...');
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function populateSlides() {
  try {
    // Step 1: Get or create presentation
    console.log('\n📋 Step 1: Finding/creating presentation...');
    let { data: presentation, error: presError } = await supabase
      .from('ai_presenter_presentations')
      .select('id, title')
      .eq('client_id', CLIENT_ID)
      .single();

    let presentationId;

    if (presError || !presentation) {
      console.log('   Creating new presentation...');
      const { data: newPres, error: createError } = await supabase
        .from('ai_presenter_presentations')
        .insert({
          client_id: CLIENT_ID,
          title: 'Disruptors Media - Agency Presentation',
          description: 'Professional pitch deck showcasing our AI-powered marketing services',
          status: 'active'
        })
        .select()
        .single();

      if (createError) throw createError;
      presentation = newPres;
      presentationId = newPres.id;
      console.log('   ✓ Created presentation:', presentationId);
    } else {
      presentationId = presentation.id;
      console.log('   ✓ Using existing presentation:', presentationId);
    }

    // Step 2: Clear existing slides
    console.log('\n🗑️  Step 2: Clearing existing slides...');
    const { error: deleteError } = await supabase
      .from('ai_presenter_slides')
      .delete()
      .eq('presentation_id', presentationId);

    if (deleteError) throw deleteError;
    console.log('   ✓ Cleared existing slides');

    // Step 3: Insert new slides
    console.log('\n📝 Step 3: Inserting 9 slides...');

    const slides = [
      {
        presentation_id: presentationId,
        title: 'Welcome to Disruptors Media',
        subtitle: 'Transform Your Marketing with AI',
        content: '<p>Data-driven strategies that deliver measurable results. We combine cutting-edge AI technology with proven marketing expertise to help businesses scale intelligently.</p>',
        slide_type: 'hero',
        order_index: 1,
        is_visible: true
      },
      {
        presentation_id: presentationId,
        title: 'Your Marketing Intelligence Hub',
        subtitle: 'Real-time insights and performance metrics',
        content: '<ul><li><strong>Campaign Performance:</strong> Track ROI across all channels</li><li><strong>Audience Intelligence:</strong> AI-powered customer insights</li><li><strong>Competitive Analysis:</strong> Stay ahead of market trends</li><li><strong>Growth Forecasting:</strong> Predictive analytics for planning</li></ul>',
        slide_type: 'content',
        order_index: 2,
        is_visible: true
      },
      {
        presentation_id: presentationId,
        title: 'About Disruptors Media',
        subtitle: 'AI-Powered Marketing Agency',
        content: '<p>We are a team of marketing experts, data scientists, and AI specialists dedicated to helping businesses achieve extraordinary growth through intelligent automation and data-driven decision making.</p><h3>Our Track Record</h3><ul><li>150+ Clients Served</li><li>327% Average ROI</li><li>5+ Years Industry Experience</li><li>98% Client Satisfaction</li></ul>',
        slide_type: 'content',
        order_index: 3,
        is_visible: true
      },
      {
        presentation_id: presentationId,
        title: 'Free Marketing Diagnostic',
        subtitle: 'Discover your growth opportunities in 60 seconds',
        content: '<p>Answer a few quick questions and receive a personalized marketing assessment powered by AI. We will analyze your current strategy and identify specific opportunities for improvement.</p>',
        slide_type: 'content',
        order_index: 4,
        is_visible: true
      },
      {
        presentation_id: presentationId,
        title: 'Success Stories',
        subtitle: 'Proven Results Across Industries',
        content: '<p>See how we have helped businesses like yours achieve transformational growth through AI-powered marketing strategies. Real clients, real results.</p>',
        slide_type: 'content',
        order_index: 5,
        is_visible: true
      },
      {
        presentation_id: presentationId,
        title: 'Our Capabilities',
        subtitle: 'Full-Stack Marketing Solutions',
        content: '<h3>AI-Powered Strategy</h3><p>Machine learning algorithms analyze your market and identify optimal growth opportunities</p><h3>Performance Marketing</h3><p>Data-driven paid acquisition across Google, Facebook, LinkedIn, and emerging platforms</p><h3>Content Excellence</h3><p>AI-assisted content creation that resonates with your audience and drives engagement</p><h3>Analytics & Insights</h3><p>Comprehensive reporting and actionable insights to guide your marketing decisions</p>',
        slide_type: 'content',
        order_index: 6,
        is_visible: true
      },
      {
        presentation_id: presentationId,
        title: 'Growth Blueprint',
        subtitle: 'Your Custom Growth Roadmap - A proven 90-day framework',
        content: '<h3>Phase 1: Discovery & Audit (Week 1-2)</h3><p>Comprehensive analysis of your current marketing, competitive landscape, and growth opportunities</p><h3>Phase 2: Strategy & Planning (Week 3-4)</h3><p>Development of your custom marketing strategy with clear KPIs and success metrics</p><h3>Phase 3: Implementation (Week 5-8)</h3><p>Launch and optimization of campaigns across selected channels with continuous testing</p><h3>Phase 4: Scale & Optimize (Week 9-12)</h3><p>Data-driven scaling of winning campaigns and continuous improvement based on performance</p>',
        slide_type: 'content',
        order_index: 7,
        is_visible: true
      },
      {
        presentation_id: presentationId,
        title: 'Investment Options',
        subtitle: 'Flexible Plans for Every Stage',
        content: '<p>Choose the right level of support for your business. All plans include dedicated account management and quarterly strategy reviews.</p><ul><li><strong>Launch:</strong> Perfect for businesses testing AI-powered marketing - $2,500/mo</li><li><strong>Scale:</strong> For growing companies ready to multiply their marketing leverage - $5,500/mo</li><li><strong>Dominate:</strong> Enterprise-level AI marketing systems for market leaders - $12,000/mo</li></ul>',
        slide_type: 'content',
        order_index: 8,
        is_visible: true
      },
      {
        presentation_id: presentationId,
        title: 'Ready to Transform Your Marketing?',
        subtitle: 'Book your free strategy session today',
        content: '<p>In 30 minutes, we will analyze your current marketing, identify quick wins, and outline a custom growth strategy. No obligation, just actionable insights.</p><h3>What You Get:</h3><ul><li>Free marketing audit ($2,500 value)</li><li>Custom growth recommendations</li><li>Competitive intelligence report</li><li>ROI projections for your industry</li></ul><p><strong>Contact:</strong> hello@disruptorsmedia.com | +1 (555) 123-4567</p>',
        slide_type: 'content',
        order_index: 9,
        is_visible: true
      }
    ];

    const { data: insertedSlides, error: insertError } = await supabase
      .from('ai_presenter_slides')
      .insert(slides)
      .select();

    if (insertError) throw insertError;
    console.log(`   ✓ Inserted ${insertedSlides.length} slides`);

    // Step 4: Verify results
    console.log('\n🔍 Step 4: Verifying slides...');
    const { data: verifySlides, error: verifyError } = await supabase
      .from('ai_presenter_slides')
      .select('order_index, title, subtitle, slide_type, is_visible')
      .eq('presentation_id', presentationId)
      .order('order_index', { ascending: true });

    if (verifyError) throw verifyError;

    console.log('\n╔═════════════════════════════════════════════════════════════════════╗');
    console.log('║                        SLIDES VERIFICATION                          ║');
    console.log('╠═════════════════════════════════════════════════════════════════════╣');
    console.log('║  #  │ Type    │ Title                                   │ Visible ║');
    console.log('╠═════════════════════════════════════════════════════════════════════╣');

    verifySlides.forEach(slide => {
      const idx = String(slide.order_index).padStart(2, ' ');
      const type = slide.slide_type.padEnd(7, ' ');
      const title = slide.title.substring(0, 38).padEnd(38, ' ');
      const visible = slide.is_visible ? '  ✓   ' : '  ✗   ';
      console.log(`║ ${idx}  │ ${type} │ ${title} │ ${visible}║`);
    });

    console.log('╚═════════════════════════════════════════════════════════════════════╝');

    console.log('\n✅ SUCCESS! Migration completed');
    console.log(`   - Presentation ID: ${presentationId}`);
    console.log(`   - Client ID: ${CLIENT_ID}`);
    console.log(`   - Total slides: ${verifySlides.length}`);
    console.log(`   - All visible: ${verifySlides.every(s => s.is_visible) ? 'Yes' : 'No'}`);

    return { success: true, presentationId, slides: verifySlides };

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
    return { success: false, error };
  }
}

// Execute
populateSlides().then(result => {
  process.exit(result.success ? 0 : 1);
});
