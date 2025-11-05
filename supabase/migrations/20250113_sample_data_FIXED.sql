-- Sample Data for AI Presenter Demo (FIXED VERSION)
-- Run this after the schema migration to populate tables with demo content
-- Compatible with actual ai_presenter_case_studies schema

BEGIN;

-- =====================================================
-- 1. CREATE A DEMO CLIENT
-- =====================================================

INSERT INTO ai_presenter_clients (
  id,
  name,
  slug,
  description,
  website,
  email,
  phone,
  logo_url,
  primary_color,
  secondary_color,
  status
) VALUES (
  'c1111111-1111-1111-1111-111111111111',
  'Disruptors Media',
  'disruptors-media-demo',
  'AI-Powered Marketing Agency specializing in growth strategies',
  'https://disruptorsmedia.com',
  'hello@disruptorsmedia.com',
  '+1 (555) 123-4567',
  'https://res.cloudinary.com/dvcvxhzmt/image/upload/v1755696782/disruptors-media/brand/logos/gold-logo-banner.png',
  '#D4AF37',
  '#000000',
  'active'
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. CREATE CASE STUDIES
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
  'SaaS Scale-Up: 300% Revenue Growth',
  'saas-scale-up',
  'CloudTech Solutions',
  'B2B SaaS',
  'A growing SaaS platform struggled to convert trial users into paying customers. Their organic traffic was high but conversion rates were below industry benchmarks.',
  'We implemented an AI-powered lead scoring system combined with personalized email sequences and strategic content marketing. Automated workflows identified high-intent prospects and delivered targeted messaging at optimal times.',
  jsonb_build_object(
    'roi_percentage', 327,
    'revenue_increase', '$2.4M',
    'conversion_lift', '185%',
    'time_to_value', '90 days'
  ),
  jsonb_build_array(
    jsonb_build_object('label', 'Revenue Growth', 'value', '327%', 'type', 'percentage'),
    jsonb_build_object('label', 'Trial-to-Paid Conversion', 'value', '185%', 'type', 'percentage'),
    jsonb_build_object('label', 'MRR Increase', 'value', '$2.4M', 'type', 'currency')
  ),
  1,
  true
),
(
  'c1111111-1111-1111-1111-111111111111',
  'E-Commerce: Doubled ROAS in 6 Months',
  'ecommerce-doubled-roas',
  'StyleHub Retail',
  'E-Commerce',
  'An established e-commerce brand was experiencing declining ad performance and rising customer acquisition costs across paid channels.',
  'We restructured their entire paid media strategy using AI-driven audience segmentation and dynamic creative optimization. Implemented automated bidding strategies and cross-channel attribution modeling.',
  jsonb_build_object(
    'roi_percentage', 215,
    'roas_improvement', '2.4x',
    'cac_reduction', '-42%',
    'time_to_value', '120 days'
  ),
  jsonb_build_array(
    jsonb_build_object('label', 'ROAS', 'value', '2.4x', 'type', 'multiplier'),
    jsonb_build_object('label', 'CAC Reduction', 'value', '-42%', 'type', 'percentage'),
    jsonb_build_object('label', 'Revenue Increase', 'value', '215%', 'type', 'percentage')
  ),
  2,
  true
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Healthcare: AI-Powered Patient Acquisition',
  'healthcare-patient-acquisition',
  'HealthFirst Network',
  'Healthcare',
  'A healthcare provider network needed to increase patient bookings while maintaining HIPAA compliance and reducing marketing spend.',
  'Deployed an AI-powered chatbot for 24/7 appointment scheduling integrated with their existing practice management system. Combined with local SEO optimization and targeted content marketing.',
  jsonb_build_object(
    'roi_percentage', 445,
    'booking_increase', '310%',
    'cost_reduction', '-38%',
    'time_to_value', '60 days'
  ),
  jsonb_build_array(
    jsonb_build_object('label', 'Patient Bookings', 'value', '+310%', 'type', 'percentage'),
    jsonb_build_object('label', 'Marketing Efficiency', 'value', '-38%', 'type', 'percentage'),
    jsonb_build_object('label', 'ROI', 'value', '445%', 'type', 'percentage')
  ),
  3,
  false
);

-- =====================================================
-- 3. CREATE SERVICES/CAPABILITIES
-- =====================================================

INSERT INTO ai_presenter_services (
  client_id,
  name,
  description,
  features,
  pricing_model,
  icon_name,
  accent_color,
  sort_order
) VALUES
(
  'c1111111-1111-1111-1111-111111111111',
  'AI-Powered Lead Generation',
  'Leverage machine learning to identify, score, and convert high-intent prospects automatically. Our proprietary algorithms analyze thousands of data points to predict customer behavior.',
  jsonb_build_array(
    'Predictive lead scoring with 92% accuracy',
    'Automated multi-channel outreach sequences',
    'Real-time intent signal monitoring',
    'Dynamic audience segmentation',
    'Conversion rate optimization'
  ),
  'performance',
  'Target',
  '#00D9FF',
  1
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Content Engine Pro',
  'AI-assisted content creation that maintains your brand voice while scaling output. Generate blog posts, social media, emails, and ad copy in minutes.',
  jsonb_build_array(
    'SEO-optimized blog post generation',
    'Brand voice training and consistency',
    'Multi-format content adaptation',
    'A/B testing and performance tracking',
    'Content calendar automation'
  ),
  'subscription',
  'FileText',
  '#FF6A00',
  2
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Smart Analytics Dashboard',
  'Unified view of all your marketing metrics with AI-powered insights and recommendations. See what''s working and what needs optimization in real-time.',
  jsonb_build_array(
    'Cross-channel attribution modeling',
    'Predictive revenue forecasting',
    'Automated anomaly detection',
    'Custom report builder',
    'Real-time performance alerts'
  ),
  'included',
  'BarChart',
  '#9B30FF',
  3
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Automated Email Campaigns',
  'Behavior-triggered email sequences that convert. Our AI determines the perfect timing, messaging, and frequency for each subscriber.',
  jsonb_build_array(
    'Behavioral trigger automation',
    'Dynamic content personalization',
    'Send-time optimization',
    'Engagement scoring',
    'Deliverability optimization'
  ),
  'subscription',
  'Mail',
  '#D4AF37',
  4
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Social Media Automation',
  'Schedule, publish, and analyze social content across all platforms from one dashboard. AI-powered caption writing and optimal posting times.',
  jsonb_build_array(
    'Multi-platform scheduling',
    'AI caption generation',
    'Hashtag research and optimization',
    'Engagement analytics',
    'Competitor monitoring'
  ),
  'subscription',
  'Share2',
  '#00FF88',
  5
),
(
  'c1111111-1111-1111-1111-111111111111',
  'CRM Integration & Automation',
  'Connect all your tools and automate repetitive workflows. Our AI learns from your data to suggest process improvements.',
  jsonb_build_array(
    'Two-way CRM sync (HubSpot, Salesforce)',
    'Custom workflow automation',
    'Data enrichment and cleaning',
    'Pipeline forecasting',
    'Team collaboration tools'
  ),
  'included',
  'Workflow',
  '#FF0080',
  6
);

-- =====================================================
-- 4. CREATE A DEFAULT PRESENTATION
-- =====================================================

INSERT INTO ai_presenter_presentations (
  client_id,
  name,
  description,
  theme,
  is_default
) VALUES (
  'c1111111-1111-1111-1111-111111111111',
  'Disruptors Media - Growth Proposal',
  'Comprehensive AI-powered marketing proposal',
  jsonb_build_object(
    'primaryColor', '#D4AF37',
    'secondaryColor', '#000000',
    'accentColor', '#FF6A00'
  ),
  true
);

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify client exists
SELECT id, name, slug, status FROM ai_presenter_clients WHERE id = 'c1111111-1111-1111-1111-111111111111';

-- Verify case studies
SELECT title, client_name, industry, order_index FROM ai_presenter_case_studies WHERE client_id = 'c1111111-1111-1111-1111-111111111111' ORDER BY order_index;

-- Verify services
SELECT name, pricing_model FROM ai_presenter_services WHERE client_id = 'c1111111-1111-1111-1111-111111111111' ORDER BY sort_order;

-- Summary
SELECT
  (SELECT COUNT(*) FROM ai_presenter_case_studies WHERE client_id = 'c1111111-1111-1111-1111-111111111111') as case_studies,
  (SELECT COUNT(*) FROM ai_presenter_services WHERE client_id = 'c1111111-1111-1111-1111-111111111111') as services,
  (SELECT COUNT(*) FROM ai_presenter_presentations WHERE client_id = 'c1111111-1111-1111-1111-111111111111') as presentations;
