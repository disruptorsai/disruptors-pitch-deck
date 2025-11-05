-- Safe Slides Population (Idempotent)
-- This script can be run multiple times safely
-- It will clear existing slides and repopulate them

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

    RAISE NOTICE 'Created new presentation with ID: %', v_presentation_id;
  ELSE
    RAISE NOTICE 'Using existing presentation with ID: %', v_presentation_id;
  END IF;

  -- Clear existing slides for this presentation
  DELETE FROM ai_presenter_slides WHERE presentation_id = v_presentation_id;
  RAISE NOTICE 'Cleared existing slides';

  -- Insert slides in order
  INSERT INTO ai_presenter_slides (
    presentation_id,
    title,
    slug,
    content,
    layout_type,
    order_index,
    is_visible
  ) VALUES
  -- Slide 1: Home/Cover
  (
    v_presentation_id,
    'Welcome to Disruptors Media',
    'home',
    '<p>Transform Your Marketing with AI-Powered Intelligence</p>',
    'hero',
    1,
    true
  ),
  -- Slide 2: Dashboard/Overview
  (
    v_presentation_id,
    'Your Marketing Dashboard',
    'dashboard',
    '<p>Real-time insights and performance metrics at your fingertips</p>',
    'dashboard',
    2,
    true
  ),
  -- Slide 3: Introduction
  (
    v_presentation_id,
    'About Disruptors Media',
    'introduction',
    '<p>We are a team of marketing experts, data scientists, and AI specialists dedicated to helping businesses achieve extraordinary growth through intelligent automation and data-driven decision making.</p><p>With 5+ years of experience and 150+ clients served, we deliver an average ROI of 327% with 98% client satisfaction.</p>',
    'content',
    3,
    true
  ),
  -- Slide 4: Diagnostic
  (
    v_presentation_id,
    'Free Marketing Diagnostic',
    'diagnostic',
    '<p>Discover your growth opportunities in 60 seconds. Answer a few quick questions and receive a personalized marketing assessment powered by AI.</p>',
    'interactive',
    4,
    true
  ),
  -- Slide 5: Case Studies
  (
    v_presentation_id,
    'Success Stories',
    'case-studies',
    '<p>See how we''ve helped businesses like yours achieve transformational growth through AI-powered marketing strategies.</p>',
    'case_studies',
    5,
    true
  ),
  -- Slide 6: Capabilities
  (
    v_presentation_id,
    'Our Capabilities',
    'capabilities',
    '<h2>Full-Stack Marketing Solutions</h2><ul><li><strong>AI-Powered Strategy:</strong> Machine learning algorithms analyze your market</li><li><strong>Performance Marketing:</strong> Data-driven paid acquisition</li><li><strong>Content Excellence:</strong> AI-assisted content creation</li><li><strong>Analytics & Insights:</strong> Comprehensive reporting and actionable insights</li></ul>',
    'capabilities',
    6,
    true
  ),
  -- Slide 7: Blueprint
  (
    v_presentation_id,
    'Growth Blueprint',
    'blueprint',
    '<h2>Your Custom Growth Roadmap</h2><p>A proven 90-day framework:</p><ol><li>Discovery & Audit (Week 1-2)</li><li>Strategy & Planning (Week 3-4)</li><li>Implementation (Week 5-8)</li><li>Scale & Optimize (Week 9-12)</li></ol>',
    'timeline',
    7,
    true
  ),
  -- Slide 8: Pricing
  (
    v_presentation_id,
    'Investment Options',
    'pricing',
    '<h2>Flexible Plans for Every Stage</h2><p>Choose the right level of support for your business. All plans include dedicated account management and quarterly strategy reviews.</p>',
    'pricing',
    8,
    true
  ),
  -- Slide 9: Call to Action
  (
    v_presentation_id,
    'Let''s Get Started',
    'call-to-action',
    '<h2>Ready to Transform Your Marketing?</h2><p>Book your free strategy session today. In 30 minutes, we''ll analyze your current marketing, identify quick wins, and outline a custom growth strategy.</p>',
    'cta',
    9,
    true
  );

  RAISE NOTICE 'Inserted 9 slides successfully';

END $$;

-- Verify the slides were inserted
SELECT
  s.order_index,
  s.title,
  s.slug,
  s.layout_type,
  s.is_visible,
  LENGTH(s.content::text) as content_length
FROM ai_presenter_slides s
JOIN ai_presenter_presentations p ON s.presentation_id = p.id
JOIN ai_presenter_clients c ON p.client_id = c.id
WHERE c.id = 'c1111111-1111-1111-1111-111111111111'
ORDER BY s.order_index;
