-- Populate Slides for Disruptors Media Presentation
-- Run this migration to add slide content to your presentation

BEGIN;

-- First, get or create the presentation ID
DO $$
DECLARE
  v_client_id uuid := 'c1111111-1111-1111-1111-111111111111';
  v_presentation_id uuid;
BEGIN
  -- Get the existing presentation ID or create one
  SELECT id INTO v_presentation_id
  FROM ai_presenter_presentations
  WHERE client_id = v_client_id
  LIMIT 1;

  -- If no presentation exists, create one
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
  END IF;

  -- Clear existing slides for this presentation
  DELETE FROM ai_presenter_slides WHERE presentation_id = v_presentation_id;

  -- Insert slides in order
  INSERT INTO ai_presenter_slides (
    presentation_id,
    title,
    content,
    slide_type,
    order_index,
    is_visible
  ) VALUES
  -- Slide 1: Home/Cover
  (
    v_presentation_id,
    'Welcome',
    'Transform Your Marketing with AI. Data-driven strategies that deliver measurable results. Disruptors Media combines cutting-edge AI technology with proven marketing expertise to help businesses scale intelligently.',
    'hero',
    1,
    true
  ),
  -- Slide 2: Dashboard/Overview
  (
    v_presentation_id,
    'Dashboard',
    'Your Marketing Intelligence Hub. Real-time insights and performance metrics. Track campaign performance, audience intelligence, competitive analysis, and growth forecasting.',
    'dashboard',
    2,
    true
  ),
  -- Slide 3: Introduction
  (
    v_presentation_id,
    'Introduction',
    'About Disruptors Media - AI-Powered Marketing Agency. We are a team of marketing experts, data scientists, and AI specialists dedicated to helping businesses achieve extraordinary growth through intelligent automation and data-driven decision making. 150+ Clients Served | 327% Average ROI | 5+ Years Experience | 98% Client Satisfaction',
    'content',
    3,
    true
  ),
  -- Slide 4: Diagnostic
  (
    v_presentation_id,
    'Marketing Diagnostic',
    'Free Marketing Diagnostic. Discover your growth opportunities in 60 seconds. Answer a few quick questions and receive a personalized marketing assessment powered by AI.',
    'interactive',
    4,
    true
  ),
  -- Slide 5: Case Studies
  (
    v_presentation_id,
    'Success Stories',
    'Proven Results Across Industries. Real clients, real results. See how we have helped businesses like yours achieve transformational growth through AI-powered marketing strategies.',
    'case_studies',
    5,
    true
  ),
  -- Slide 6: Capabilities
  (
    v_presentation_id,
    'Our Capabilities',
    'Full-Stack Marketing Solutions. AI-Powered Strategy: Machine learning algorithms analyze your market. Performance Marketing: Data-driven paid acquisition. Content Excellence: AI-assisted content creation. Analytics & Insights: Comprehensive reporting.',
    'capabilities',
    6,
    true
  ),
  -- Slide 7: Blueprint
  (
    v_presentation_id,
    'Growth Blueprint',
    'Your Custom Growth Roadmap - A proven 90-day framework. Discovery & Audit (Week 1-2). Strategy & Planning (Week 3-4). Implementation (Week 5-8). Scale & Optimize (Week 9-12).',
    'timeline',
    7,
    true
  ),
  -- Slide 8: Pricing
  (
    v_presentation_id,
    'Investment Options',
    'Flexible Plans for Every Stage. Choose the right level of support for your business. All plans include dedicated account management and quarterly strategy reviews.',
    'pricing',
    8,
    true
  ),
  -- Slide 9: Call to Action
  (
    v_presentation_id,
    'Let''s Get Started',
    'Ready to Transform Your Marketing? Book your free strategy session today. In 30 minutes, we will analyze your current marketing, identify quick wins, and outline a custom growth strategy. Contact: hello@disruptorsmedia.com | +1 (555) 123-4567',
    'cta',
    9,
    true
  );

END $$;

COMMIT;

-- Verify the slides were inserted
SELECT
  s.order_index,
  s.title,
  s.slide_type,
  s.is_visible
FROM ai_presenter_slides s
JOIN ai_presenter_presentations p ON s.presentation_id = p.id
JOIN ai_presenter_clients c ON p.client_id = c.id
WHERE c.slug = 'disruptors-media-demo'
ORDER BY s.order_index;
