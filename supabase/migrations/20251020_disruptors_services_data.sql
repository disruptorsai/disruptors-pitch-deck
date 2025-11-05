-- Disruptors Media Service Offerings Data
-- Migration to add 9 AI-powered marketing mechanisms
-- Generated: 2025-10-20

-- =====================================================
-- CLEAN EXISTING SERVICE DATA
-- =====================================================

-- Delete existing services/capabilities for the demo client
DELETE FROM ai_presenter_services
WHERE client_id = 'c1111111-1111-1111-1111-111111111111';

-- =====================================================
-- INSERT SERVICE OFFERINGS
-- =====================================================

INSERT INTO ai_presenter_services (
  client_id,
  name,
  slug,
  tagline,
  description,
  features,
  icon_url,
  order_index,
  is_visible,
  is_featured
) VALUES
(
  'c1111111-1111-1111-1111-111111111111',
  'Social Media Marketing',
  'social-media-marketing',
  'Stop the guess-work with content marketing',
  'We find the top performing content in your niche, and we create YOUR unique spin on it. Demonstrate visibility, engagement, and audience growth with AI-powered content strategy.',
  jsonb_build_array(
    jsonb_build_object('metric', 'Average Follower Growth', 'value', '+127%', 'timeframe', 'within 6 months'),
    jsonb_build_object('metric', 'Engagement Rate Increase', 'value', '+82%', 'timeframe', 'compared to prior campaigns'),
    jsonb_build_object('metric', 'Cost per Lead (CPL) Reduction', 'value', '-41%', 'timeframe', 'through optimized targeting')
  ),
  null,
  1,
  true,
  true
),
(
  'c1111111-1111-1111-1111-111111111111',
  'AI Automation',
  'ai-automation',
  'Free your team from robotic work',
  'We free up you and your team from robotic work so you can focus on what ONLY you can do, which is connect on a human level with your clients. Show efficiency and time leverage through intelligent automation.',
  jsonb_build_array(
    jsonb_build_object('metric', 'Average Task Automation Rate', 'value', '68%', 'timeframe', 'of robotic actions replaced within a year'),
    jsonb_build_object('metric', 'Time Saved per Team Member', 'value', '9 hours', 'timeframe', 'per week'),
    jsonb_build_object('metric', 'Response Time Improvement', 'value', '+210%', 'timeframe', 'faster than manual workflows')
  ),
  null,
  2,
  true,
  true
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Lead Generation',
  'lead-generation',
  'Quality leads at the right time',
  'Our systems don''t just bring leads. They bring the *right* ones at the *right* time with the *right* messaging. Highlight quality, scalability, and ROI with proven lead generation systems.',
  jsonb_build_array(
    jsonb_build_object('metric', 'Average Qualified Lead Increase', 'value', '+162%', 'timeframe', 'over baseline'),
    jsonb_build_object('metric', 'Cold Outbound Volume', 'value', '400,000', 'timeframe', 'cold outbound messages per week across all campaigns'),
    jsonb_build_object('metric', 'Lead-to-Appointment Conversion Rate', 'value', '7.3%', 'timeframe', 'vs 1% industry average')
  ),
  null,
  3,
  true,
  true
),
(
  'c1111111-1111-1111-1111-111111111111',
  'CRM Management',
  'crm-management',
  'From contact list to closing machine',
  'We turn your CRM from a contact list into a closing/retention machine. Prove retention and operational intelligence through AI-powered customer journey optimization.',
  jsonb_build_array(
    jsonb_build_object('metric', 'Client Retention Rate Increase', 'value', '+31%', 'timeframe', 'after 60 days'),
    jsonb_build_object('metric', 'Pipeline Efficiency Improvement', 'value', '+47%', 'timeframe', 'via AI data cleaning and automated customer journey optimization'),
    jsonb_build_object('metric', 'Average Time-to-Follow-Up Reduction', 'value', '-130%', 'timeframe', 'immediate response automation')
  ),
  null,
  4,
  true,
  false
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Paid Advertising',
  'paid-advertising',
  'Eliminate the guesswork',
  'We leverage testing, competitor data, and creative expertise to eliminate the guesswork and funnel sales into your business. Establish profit efficiency and campaign optimization with data-driven advertising.',
  jsonb_build_array(
    jsonb_build_object('metric', 'Average Return on Ad Spend (ROAS)', 'value', '5.6X', 'timeframe', 'across all campaigns'),
    jsonb_build_object('metric', 'Click-Through Rate Improvement', 'value', '+133%', 'timeframe', 'after AI creative testing'),
    jsonb_build_object('metric', 'Customer Acquisition Cost (CAC) Reduction', 'value', '-29%', 'timeframe', 'through optimization')
  ),
  null,
  5,
  true,
  true
),
(
  'c1111111-1111-1111-1111-111111111111',
  'SEO & GEO',
  'seo-geo',
  'Dominate Google and AI platforms',
  'We build visibility engines that dominate both Google and AI platforms, even as AI transforms the way people search for solutions. Prove compounding long-term visibility and local dominance.',
  jsonb_build_array(
    jsonb_build_object('metric', 'Average Website Traffic Increase', 'value', '+187%', 'timeframe', 'in 6 months'),
    jsonb_build_object('metric', 'Average AI-Generated References/Month', 'value', '340+', 'timeframe', 'indexed mentions'),
    jsonb_build_object('metric', 'Inbound Call Volume Growth', 'value', '+52%', 'timeframe', 'across optimized service areas')
  ),
  null,
  6,
  true,
  false
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Custom Apps',
  'custom-apps',
  'AI employees that reduce workload',
  'We build and optimize AI employees in the form of software that reduce your workload and integrate with other tools. Highlight innovation, scalability, and operational control.',
  jsonb_build_array(
    jsonb_build_object('metric', 'Average Process Time Reduction', 'value', '-60%', 'timeframe', 'with internal automations'),
    jsonb_build_object('metric', 'Client Adoption Rate', 'value', '95%', 'timeframe', 'user engagement within 30 days'),
    jsonb_build_object('metric', 'System ROI Timeline', 'value', '45 days', 'timeframe', 'average turnaround from concept to working app')
  ),
  null,
  7,
  true,
  false
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Fractional CMO',
  'fractional-cmo',
  'C-suite team that scales in sync',
  'When we plug in, you gain a C-suite team that scales strategy and execution in sync. Emphasize strategic partnership and revenue optimization with executive-level marketing leadership.',
  jsonb_build_array(
    jsonb_build_object('metric', 'Revenue Growth Among Retainers', 'value', '+48%', 'timeframe', 'within first 120 days'),
    jsonb_build_object('metric', 'Average Marketing ROI Increase', 'value', '+92%', 'timeframe', 'after full strategy alignment'),
    jsonb_build_object('metric', 'System Efficiency Improvement', 'value', '+61%', 'timeframe', 'via integrated automation tracking')
  ),
  null,
  8,
  true,
  false
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Podcasting',
  'podcasting',
  'Authentic conversation at scale',
  'Nothing scales better than authentic conversation. We ensure that your podcast is seen and heard. Highlight authority, reach, and conversion power through strategic podcast production and distribution.',
  jsonb_build_array(
    jsonb_build_object('metric', 'Audience Growth Rate', 'value', '+142%', 'timeframe', 'in first 60 days post-launch'),
    jsonb_build_object('metric', 'Average Speed to Monetization', 'value', '4 months', 'timeframe', 'from brand new to new streams of monetization'),
    jsonb_build_object('metric', 'Average Engagement Time per Episode Increase', 'value', '300%', 'timeframe', 'increase in viewing time')
  ),
  null,
  9,
  true,
  false
);

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify services were inserted
DO $$
DECLARE
    service_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO service_count
    FROM ai_presenter_services
    WHERE client_id = 'c1111111-1111-1111-1111-111111111111';

    IF service_count = 9 THEN
        RAISE NOTICE 'SUCCESS: 9 service offerings inserted for Disruptors Media';
    ELSE
        RAISE WARNING 'WARNING: Expected 9 services but found %', service_count;
    END IF;
END $$;
