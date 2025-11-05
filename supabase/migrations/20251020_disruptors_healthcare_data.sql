-- Disruptors Media Healthcare Case Studies Data
-- Migration to replace demo data with real healthcare case studies
-- Generated: 2025-10-20

-- =====================================================
-- CLEAN EXISTING DEMO DATA
-- =====================================================

-- Delete existing case studies for the demo client
DELETE FROM ai_presenter_case_studies
WHERE client_id = 'c1111111-1111-1111-1111-111111111111';

-- =====================================================
-- INSERT HEALTHCARE CASE STUDIES
-- =====================================================

INSERT INTO ai_presenter_case_studies (
  client_id,
  title,
  slug,
  client_name,
  industry,
  challenge,
  solution,
  results,
  metrics,
  order_index,
  is_featured
) VALUES
(
  'c1111111-1111-1111-1111-111111111111',
  'Wellness & Hormone Therapy Clinic',
  'wellness-hormone-therapy',
  'Healthcare Client',
  'Healthcare',
  'Focused Google Search campaigns around hormone therapy, intimacy wellness, and weight management, with retargeting for non-converting site visitors.',
  'Custom landing pages with patient testimonials and booking flows optimized for mobile.',
  '3.5X ROI with 5.8% CTR and $72 cost per lead. Achieved 11% conversion rate within 90 days.',
  jsonb_build_array(
    jsonb_build_object('label', 'CTR', 'value', '5.8%', 'type', 'percentage', 'benchmark', '3% industry avg'),
    jsonb_build_object('label', 'Cost Per Lead', 'value', '$72', 'type', 'currency'),
    jsonb_build_object('label', 'Conversion Rate', 'value', '11%', 'type', 'percentage'),
    jsonb_build_object('label', 'ROI', 'value', '3.5X', 'type', 'multiplier')
  ),
  1,
  true
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Telehealth Provider',
  'Healthcare',
  'Always-on campaigns targeting urgent care and specialty telehealth, benchmarked at 25,000 impressions and 5+ weekly leads.',
  'Integrated with content marketing and SEO to reinforce messaging.',
  jsonb_build_object(
    'roi_percentage', 400,
    'avg_weekly_impressions', '65,000+',
    'peak_impressions', '117,000',
    'avg_weekly_leads', '15-20',
    'cpl', '$58',
    'time_to_value', '60 days'
  ),
  jsonb_build_array(
    jsonb_build_object('label', 'Weekly Impressions', 'value', '65,000+', 'type', 'number', 'benchmark', 'Peaked at 117K'),
    jsonb_build_object('label', 'Weekly Leads', 'value', '15-20', 'type', 'range', 'benchmark', '3-4X target'),
    jsonb_build_object('label', 'Cost Per Lead', 'value', '$58', 'type', 'currency'),
    jsonb_build_object('label', 'ROI', 'value', '4X', 'type', 'multiplier')
  ),
  '#FF6A00',
  2,
  true
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Aesthetic & Body Contouring Clinic',
  'Healthcare',
  'Multi-channel Google Ads across Search, Display, YouTube, and Shopping, timed with seasonal demand (summer prep, New Year promotions).',
  'Retargeted prior visitors with promotional offers and educational video ads.',
  jsonb_build_object(
    'roi_percentage', 330,
    'ctr', '6.2%',
    'total_leads', '350+',
    'cpl', '$64',
    'revenue_impact', '$210,000+',
    'time_to_value', '180 days'
  ),
  jsonb_build_array(
    jsonb_build_object('label', 'CTR', 'value', '6.2%', 'type', 'percentage'),
    jsonb_build_object('label', 'Consult Requests', 'value', '350+', 'type', 'number', 'benchmark', 'in 6 months'),
    jsonb_build_object('label', 'Cost Per Lead', 'value', '$64', 'type', 'currency'),
    jsonb_build_object('label', 'Revenue Impact', 'value', '$210K+', 'type', 'currency'),
    jsonb_build_object('label', 'ROI', 'value', '3.3X', 'type', 'multiplier')
  ),
  '#9B30FF',
  3,
  true
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Specialized Medical Services Practice',
  'Healthcare',
  'Ran targeted Google Ads alongside an aggressive SEO/content push. Overcame ad restrictions in sensitive medical categories.',
  'Built keyword-rich content, secured backlinks, and retargeted high-intent audiences.',
  jsonb_build_object(
    'roi_percentage', 300,
    'organic_traffic_growth', '+220%',
    'total_leads', '200+',
    'cpl', '$81',
    'time_to_value', '180 days'
  ),
  jsonb_build_array(
    jsonb_build_object('label', 'Organic Traffic Growth', 'value', '+220%', 'type', 'percentage', 'benchmark', 'in 6 months'),
    jsonb_build_object('label', 'Leads from Ads', 'value', '200+', 'type', 'number'),
    jsonb_build_object('label', 'Cost Per Lead', 'value', '$81', 'type', 'currency'),
    jsonb_build_object('label', 'ROI', 'value', '3X', 'type', 'multiplier')
  ),
  '#00FF88',
  4,
  false
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Regional Multi-Location Clinic',
  'Healthcare',
  'Performance Max campaigns with quizzes and incentives as lead magnets. Budget started small ($10/day) and scaled regionally.',
  'Landing pages pixeled for retargeting across Google and Meta.',
  jsonb_build_object(
    'roi_percentage', 400,
    'ctr', '7.1%',
    'total_leads', '450+',
    'cpl', '$55',
    'revenue_impact', '$180,000+',
    'time_to_value', '90 days'
  ),
  jsonb_build_array(
    jsonb_build_object('label', 'CTR', 'value', '7.1%', 'type', 'percentage'),
    jsonb_build_object('label', 'Leads', 'value', '450+', 'type', 'number', 'benchmark', 'across 3 locations in Q1'),
    jsonb_build_object('label', 'Cost Per Lead', 'value', '$55', 'type', 'currency'),
    jsonb_build_object('label', 'Revenue Impact', 'value', '$180K+', 'type', 'currency'),
    jsonb_build_object('label', 'ROI', 'value', '4X', 'type', 'multiplier')
  ),
  '#FFD700',
  5,
  false
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Enterprise-Scale Healthcare Campaign',
  'Healthcare',
  'National-level Google Ads program with a monthly ad spend of $2M, targeting multiple service lines and patient demographics across the U.S.',
  'Comprehensive campaign mix including Search, Display, YouTube, and programmatic retargeting. Performance tracked daily with advanced attribution modeling and conversion-optimized landing funnels.',
  jsonb_build_object(
    'roi_percentage', 1250,
    'annual_ad_spend', '$24M',
    'annual_revenue_generated', '$300M',
    'impact', 'Top provider nationwide',
    'time_to_value', '365 days'
  ),
  jsonb_build_array(
    jsonb_build_object('label', 'Annual Ad Spend', 'value', '$24M', 'type', 'currency'),
    jsonb_build_object('label', 'Annual Revenue', 'value', '$300M', 'type', 'currency'),
    jsonb_build_object('label', 'ROI', 'value', '12.5X', 'type', 'multiplier'),
    jsonb_build_object('label', 'Impact', 'value', 'Market Leader', 'type', 'text', 'benchmark', 'Nationwide dominance in category')
  ),
  '#FF1493',
  6,
  true
);

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify case studies were inserted
DO $$
DECLARE
    case_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO case_count
    FROM ai_presenter_case_studies
    WHERE client_id = 'c1111111-1111-1111-1111-111111111111';

    IF case_count = 6 THEN
        RAISE NOTICE 'SUCCESS: 6 healthcare case studies inserted for Disruptors Media';
    ELSE
        RAISE WARNING 'WARNING: Expected 6 case studies but found %', case_count;
    END IF;
END $$;
