-- Populate Slides with Correct Schema
-- This matches the actual ai_presenter_slides table structure
-- Safe to run multiple times

DO $$
DECLARE
  v_client_id uuid := 'c1111111-1111-1111-1111-111111111111';
  v_presentation_id uuid;
BEGIN
  -- Get or create presentation
  SELECT id INTO v_presentation_id
  FROM ai_presenter_presentations
  WHERE client_id = v_client_id
  LIMIT 1;

  IF v_presentation_id IS NULL THEN
    INSERT INTO ai_presenter_presentations (
      client_id,
      title,
      description,
      status
    ) VALUES (
      v_client_id,
      'Disruptors Media - Agency Presentation',
      'Professional pitch deck showcasing our AI-powered marketing services',
      'active'
    )
    RETURNING id INTO v_presentation_id;
    RAISE NOTICE 'Created new presentation: %', v_presentation_id;
  ELSE
    RAISE NOTICE 'Using existing presentation: %', v_presentation_id;
  END IF;

  -- Clear existing slides
  DELETE FROM ai_presenter_slides WHERE presentation_id = v_presentation_id;
  RAISE NOTICE 'Cleared existing slides';

  -- Insert slides with correct column names
  INSERT INTO ai_presenter_slides (
    presentation_id,
    title,
    subtitle,
    content,
    slide_type,
    order_index,
    is_visible
  ) VALUES
  -- Slide 1: Welcome
  (
    v_presentation_id,
    'Welcome to Disruptors Media',
    'Transform Your Marketing with AI',
    '<p>Data-driven strategies that deliver measurable results. We combine cutting-edge AI technology with proven marketing expertise to help businesses scale intelligently.</p>',
    'hero',
    1,
    true
  ),
  -- Slide 2: Dashboard
  (
    v_presentation_id,
    'Your Marketing Intelligence Hub',
    'Real-time insights and performance metrics',
    '<ul><li><strong>Campaign Performance:</strong> Track ROI across all channels</li><li><strong>Audience Intelligence:</strong> AI-powered customer insights</li><li><strong>Competitive Analysis:</strong> Stay ahead of market trends</li><li><strong>Growth Forecasting:</strong> Predictive analytics for planning</li></ul>',
    'content',
    2,
    true
  ),
  -- Slide 3: Introduction
  (
    v_presentation_id,
    'About Disruptors Media',
    'AI-Powered Marketing Agency',
    '<p>We are a team of marketing experts, data scientists, and AI specialists dedicated to helping businesses achieve extraordinary growth through intelligent automation and data-driven decision making.</p><h3>Our Track Record</h3><ul><li>150+ Clients Served</li><li>327% Average ROI</li><li>5+ Years Industry Experience</li><li>98% Client Satisfaction</li></ul>',
    'content',
    3,
    true
  ),
  -- Slide 4: Diagnostic
  (
    v_presentation_id,
    'Free Marketing Diagnostic',
    'Discover your growth opportunities in 60 seconds',
    '<p>Answer a few quick questions and receive a personalized marketing assessment powered by AI. We will analyze your current strategy and identify specific opportunities for improvement.</p>',
    'content',
    4,
    true
  ),
  -- Slide 5: Case Studies
  (
    v_presentation_id,
    'Success Stories',
    'Proven Results Across Industries',
    '<p>See how we have helped businesses like yours achieve transformational growth through AI-powered marketing strategies. Real clients, real results.</p>',
    'content',
    5,
    true
  ),
  -- Slide 6: Capabilities
  (
    v_presentation_id,
    'Our Capabilities',
    'Full-Stack Marketing Solutions',
    '<h3>AI-Powered Strategy</h3><p>Machine learning algorithms analyze your market and identify optimal growth opportunities</p><h3>Performance Marketing</h3><p>Data-driven paid acquisition across Google, Facebook, LinkedIn, and emerging platforms</p><h3>Content Excellence</h3><p>AI-assisted content creation that resonates with your audience and drives engagement</p><h3>Analytics & Insights</h3><p>Comprehensive reporting and actionable insights to guide your marketing decisions</p>',
    'content',
    6,
    true
  ),
  -- Slide 7: Blueprint
  (
    v_presentation_id,
    'Growth Blueprint',
    'Your Custom Growth Roadmap - A proven 90-day framework',
    '<h3>Phase 1: Discovery & Audit (Week 1-2)</h3><p>Comprehensive analysis of your current marketing, competitive landscape, and growth opportunities</p><h3>Phase 2: Strategy & Planning (Week 3-4)</h3><p>Development of your custom marketing strategy with clear KPIs and success metrics</p><h3>Phase 3: Implementation (Week 5-8)</h3><p>Launch and optimization of campaigns across selected channels with continuous testing</p><h3>Phase 4: Scale & Optimize (Week 9-12)</h3><p>Data-driven scaling of winning campaigns and continuous improvement based on performance</p>',
    'content',
    7,
    true
  ),
  -- Slide 8: Pricing
  (
    v_presentation_id,
    'Investment Options',
    'Flexible Plans for Every Stage',
    '<p>Choose the right level of support for your business. All plans include dedicated account management and quarterly strategy reviews.</p><ul><li><strong>Launch:</strong> Perfect for businesses testing AI-powered marketing - $2,500/mo</li><li><strong>Scale:</strong> For growing companies ready to multiply their marketing leverage - $5,500/mo</li><li><strong>Dominate:</strong> Enterprise-level AI marketing systems for market leaders - $12,000/mo</li></ul>',
    'content',
    8,
    true
  ),
  -- Slide 9: Call to Action
  (
    v_presentation_id,
    'Ready to Transform Your Marketing?',
    'Book your free strategy session today',
    '<p>In 30 minutes, we will analyze your current marketing, identify quick wins, and outline a custom growth strategy. No obligation, just actionable insights.</p><h3>What You Get:</h3><ul><li>Free marketing audit ($2,500 value)</li><li>Custom growth recommendations</li><li>Competitive intelligence report</li><li>ROI projections for your industry</li></ul><p><strong>Contact:</strong> hello@disruptorsmedia.com | +1 (555) 123-4567</p>',
    'content',
    9,
    true
  );

  RAISE NOTICE 'Successfully inserted 9 slides';

END $$;

-- Verify slides
SELECT
  order_index,
  title,
  subtitle,
  slide_type,
  is_visible,
  LENGTH(content) as content_length
FROM ai_presenter_slides s
JOIN ai_presenter_presentations p ON s.presentation_id = p.id
WHERE p.client_id = 'c1111111-1111-1111-1111-111111111111'
ORDER BY order_index;
