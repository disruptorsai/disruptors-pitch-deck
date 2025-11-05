-- Disruptors Media Healthcare Case Studies Data (CORRECTED)
-- Migration to replace demo data with real healthcare case studies
-- Generated: 2025-10-20
-- CORRECTED: Matches actual database schema

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
  is_featured,
  is_visible
) VALUES
(
  'c1111111-1111-1111-1111-111111111111',
  'Wellness & Hormone Therapy Clinic',
  'wellness-hormone-therapy',
  'Healthcare Client',
  'Healthcare',
  'Focused Google Search campaigns around hormone therapy, intimacy wellness, and weight management, with retargeting for non-converting site visitors.',
  'Custom landing pages with patient testimonials and booking flows optimized for mobile.',
  '3.5X ROI achieved with 5.8% CTR and $72 cost per lead. Conversion rate of 11% within 90 days. Campaign focused on hormone therapy keywords with mobile-optimized landing pages.',
  jsonb_build_array(
    jsonb_build_object('label', 'CTR', 'value', '5.8%', 'unit', '%', 'type', 'percentage'),
    jsonb_build_object('label', 'Cost Per Lead', 'value', '$72', 'unit', 'USD', 'type', 'currency'),
    jsonb_build_object('label', 'Conversion Rate', 'value', '11%', 'unit', '%', 'type', 'percentage'),
    jsonb_build_object('label', 'ROI', 'value', '3.5X', 'unit', 'X', 'type', 'multiplier')
  ),
  1,
  true,
  true
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Telehealth Provider',
  'telehealth-provider',
  'Telehealth Client',
  'Healthcare',
  'Always-on campaigns targeting urgent care and specialty telehealth, benchmarked at 25,000 impressions and 5+ weekly leads.',
  'Integrated with content marketing and SEO to reinforce messaging.',
  '4X ROI with 65,000+ weekly impressions (peaked at 117,000). Generated 15-20 weekly leads at $58 cost per lead within 60 days. Integrated content marketing amplified results.',
  jsonb_build_array(
    jsonb_build_object('label', 'Weekly Impressions', 'value', '65,000+', 'unit', 'impressions', 'type', 'number'),
    jsonb_build_object('label', 'Weekly Leads', 'value', '15-20', 'unit', 'leads', 'type', 'range'),
    jsonb_build_object('label', 'Cost Per Lead', 'value', '$58', 'unit', 'USD', 'type', 'currency'),
    jsonb_build_object('label', 'ROI', 'value', '4X', 'unit', 'X', 'type', 'multiplier')
  ),
  2,
  true,
  true
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Aesthetic & Body Contouring Clinic',
  'aesthetic-body-contouring',
  'Aesthetic Clinic',
  'Healthcare',
  'Multi-channel Google Ads across Search, Display, YouTube, and Shopping, timed with seasonal demand (summer prep, New Year promotions).',
  'Retargeted prior visitors with promotional offers and educational video ads.',
  '3.3X ROI with 6.2% CTR and 350+ consultation requests in 6 months. $64 cost per lead with $210,000+ revenue impact. Seasonal campaigns optimized for summer and New Year demand.',
  jsonb_build_array(
    jsonb_build_object('label', 'CTR', 'value', '6.2%', 'unit', '%', 'type', 'percentage'),
    jsonb_build_object('label', 'Consult Requests', 'value', '350+', 'unit', 'requests', 'type', 'number'),
    jsonb_build_object('label', 'Cost Per Lead', 'value', '$64', 'unit', 'USD', 'type', 'currency'),
    jsonb_build_object('label', 'Revenue Impact', 'value', '$210,000+', 'unit', 'USD', 'type', 'currency'),
    jsonb_build_object('label', 'ROI', 'value', '3.3X', 'unit', 'X', 'type', 'multiplier')
  ),
  3,
  true,
  true
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Specialized Medical Services Practice',
  'specialized-medical-services',
  'Medical Services Client',
  'Healthcare',
  'Ran targeted Google Ads alongside an aggressive SEO/content push. Overcame ad restrictions in sensitive medical categories.',
  'Built keyword-rich content, secured backlinks, and retargeted high-intent audiences.',
  '3X ROI with 220% organic traffic growth in 6 months. 200+ leads from ads at $81 cost per lead. Successfully navigated ad restrictions in sensitive medical categories through SEO integration.',
  jsonb_build_array(
    jsonb_build_object('label', 'Organic Traffic Growth', 'value', '+220%', 'unit', '%', 'type', 'percentage'),
    jsonb_build_object('label', 'Leads from Ads', 'value', '200+', 'unit', 'leads', 'type', 'number'),
    jsonb_build_object('label', 'Cost Per Lead', 'value', '$81', 'unit', 'USD', 'type', 'currency'),
    jsonb_build_object('label', 'ROI', 'value', '3X', 'unit', 'X', 'type', 'multiplier')
  ),
  4,
  false,
  true
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Regional Multi-Location Clinic',
  'regional-multi-location',
  'Multi-Location Clinic',
  'Healthcare',
  'Performance Max campaigns with quizzes and incentives as lead magnets. Budget started small ($10/day) and scaled regionally.',
  'Landing pages pixeled for retargeting across Google and Meta.',
  '4X ROI with 7.1% CTR and 450+ leads across 3 locations in Q1. $55 cost per lead with $180,000+ revenue impact within 90 days. Scaled from $10/day to full regional coverage.',
  jsonb_build_array(
    jsonb_build_object('label', 'CTR', 'value', '7.1%', 'unit', '%', 'type', 'percentage'),
    jsonb_build_object('label', 'Leads', 'value', '450+', 'unit', 'leads', 'type', 'number'),
    jsonb_build_object('label', 'Cost Per Lead', 'value', '$55', 'unit', 'USD', 'type', 'currency'),
    jsonb_build_object('label', 'Revenue Impact', 'value', '$180,000+', 'unit', 'USD', 'type', 'currency'),
    jsonb_build_object('label', 'ROI', 'value', '4X', 'unit', 'X', 'type', 'multiplier')
  ),
  5,
  false,
  true
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Enterprise-Scale Healthcare Campaign',
  'enterprise-healthcare',
  'Enterprise Healthcare Client',
  'Healthcare',
  'National-level Google Ads program with a monthly ad spend of $2M, targeting multiple service lines and patient demographics across the U.S.',
  'Comprehensive campaign mix including Search, Display, YouTube, and programmatic retargeting. Performance tracked daily with advanced attribution modeling and conversion-optimized landing funnels.',
  '12.5X ROI with $24M annual ad spend generating $300M annual revenue. Achieved nationwide market leadership with daily performance tracking and advanced attribution modeling. Top provider in category.',
  jsonb_build_array(
    jsonb_build_object('label', 'Annual Ad Spend', 'value', '$24M', 'unit', 'USD', 'type', 'currency'),
    jsonb_build_object('label', 'Annual Revenue', 'value', '$300M', 'unit', 'USD', 'type', 'currency'),
    jsonb_build_object('label', 'ROI', 'value', '12.5X', 'unit', 'X', 'type', 'multiplier'),
    jsonb_build_object('label', 'Market Position', 'value', 'Leader', 'unit', '', 'type', 'text')
  ),
  6,
  true,
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

-- Display summary of inserted case studies
SELECT
    title,
    slug,
    order_index,
    is_featured,
    (metrics->0->>'value') as first_metric
FROM ai_presenter_case_studies
WHERE client_id = 'c1111111-1111-1111-1111-111111111111'
ORDER BY order_index;
