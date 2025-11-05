-- Disruptors Media Pricing Tiers Data
-- Migration to add 4 investment-level pricing tiers
-- Generated: 2025-10-20

-- =====================================================
-- CLEAN EXISTING PRICING DATA
-- =====================================================

-- Delete existing pricing tiers for the demo client
DELETE FROM ai_presenter_pricing_tiers
WHERE client_id = 'c1111111-1111-1111-1111-111111111111';

-- =====================================================
-- INSERT PRICING TIERS
-- =====================================================

INSERT INTO ai_presenter_pricing_tiers (
  client_id,
  name,
  slug,
  description,
  price,
  billing_period,
  price_label,
  features,
  included_services,
  sort_order,
  is_highlighted,
  badge_text,
  color_scheme,
  cta_text,
  is_active
) VALUES
(
  'c1111111-1111-1111-1111-111111111111',
  'Agency Plan',
  'agency',
  'Ideal for early-stage companies or established teams needing tactical execution.',
  850.00,
  'monthly',
  'Starting at $850/month',
  jsonb_build_array(
    'Channel-Specific Campaign Management',
    'SEO & SEM Execution (Google + Local)',
    'Paid Social Campaigns + Content Scheduling',
    'Landing Page Optimization',
    'Monthly AI Performance Snapshots',
    'Retargeting Campaign Setup',
    'Creative & Messaging Support'
  ),
  ARRAY['social-media-marketing', 'paid-advertising', 'seo-geo'],
  1,
  false,
  null,
  '#00D9FF',
  'Get Started',
  true
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Growth Plan',
  'growth',
  'Integrated strategy and automation across multiple channels for scalable growth.',
  1500.00,
  'monthly',
  '$1,500/month',
  jsonb_build_array(
    'Cross-Channel Marketing Strategy & Execution',
    'Funnel Mapping + Customer Journey Design',
    'Light Funnel Strategy + KPI Mapping',
    'Oversight of In-House/External Teams',
    'Weekly Leadership Sync Meetings'
  ),
  ARRAY['social-media-marketing', 'ai-automation', 'lead-generation', 'paid-advertising', 'seo-geo'],
  2,
  true,
  'Most Popular',
  '#FF6A00',
  'Start Growing',
  true
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Executive Plan',
  'executive',
  'Hands-on marketing and systems leadership integrated directly with your team.',
  3500.00,
  'monthly',
  '$3,500/month',
  jsonb_build_array(
    'Full-Funnel Growth Strategy & Revenue Tracking',
    'AI System Implementation + Optimization',
    'Channel & Budget Allocation Planning',
    'Custom Software/Dashboard Development (GHL, HubSpot, GA4)',
    'Strategic Consultations with Disruptors Team',
    'Chief Revenue Officer-Style KPI Tracking & Strategy'
  ),
  ARRAY['social-media-marketing', 'ai-automation', 'lead-generation', 'crm-management', 'paid-advertising', 'seo-geo', 'custom-apps'],
  3,
  false,
  'Best for Scale',
  '#9B30FF',
  'Let''s Talk',
  true
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Enterprise Plan',
  'enterprise',
  'Fully embedded CMO partnership with end-to-end marketing and automation oversight.',
  5000.00,
  'monthly',
  '$5,000+/month',
  jsonb_build_array(
    'Full Omni-Channel Strategy & Management',
    'AI Workflow Engineering + Custom Automation on-demand',
    'Strategic Ops (RevOps, Sales Enablement, Tech Stack)',
    'Content & Campaign Oversight (Video, Podcast, Social)',
    'Real-Time Access for Ongoing Collaboration',
    'Software Development for Streamlining Processes through Custom AI Employees',
    'Cross-Functional Team Leadership',
    'Custom Reporting + Forecast Modeling',
    'Slack + On-Demand Access for Real-Time Support'
  ),
  ARRAY['social-media-marketing', 'ai-automation', 'lead-generation', 'crm-management', 'paid-advertising', 'seo-geo', 'custom-apps', 'fractional-cmo', 'podcasting'],
  4,
  false,
  'Premium',
  '#FFD700',
  'Get Full Access',
  true
);

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify pricing tiers were inserted
DO $$
DECLARE
    tier_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO tier_count
    FROM ai_presenter_pricing_tiers
    WHERE client_id = 'c1111111-1111-1111-1111-111111111111';

    IF tier_count = 4 THEN
        RAISE NOTICE 'SUCCESS: 4 pricing tiers inserted for Disruptors Media';
    ELSE
        RAISE WARNING 'WARNING: Expected 4 pricing tiers but found %', tier_count;
    END IF;
END $$;
