-- =====================================================
-- DISRUPTORS MEDIA COMPLETE DEMO DATA
-- Comprehensive data to populate full presentation demo
-- Run this after base schema and sample data migrations
-- =====================================================

BEGIN;

-- =====================================================
-- 1. ADD PRICING TIERS
-- =====================================================

INSERT INTO ai_presenter_pricing_tiers (
  client_id,
  name,
  description,
  price_monthly,
  price_annual,
  features,
  is_featured,
  sort_order,
  button_text,
  accent_color
) VALUES
(
  'c1111111-1111-1111-1111-111111111111',
  'Launch',
  'Perfect for businesses testing AI-powered marketing for the first time',
  2500,
  27000, -- 10% discount
  jsonb_build_array(
    'AI Lead Generation (up to 500 leads/mo)',
    'Automated Email Sequences (3 sequences)',
    'Content Engine Pro (10 posts/mo)',
    'Basic Analytics Dashboard',
    'Monthly Strategy Call',
    'Email Support'
  ),
  false,
  1,
  'Start Your Growth',
  '#00D9FF'
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Scale',
  'For growing companies ready to multiply their marketing leverage',
  5500,
  59400, -- 10% discount
  jsonb_build_array(
    'AI Lead Generation (unlimited)',
    'Automated Email Sequences (unlimited)',
    'Content Engine Pro (30 posts/mo)',
    'Smart Analytics Dashboard with AI insights',
    'Social Media Automation (all platforms)',
    'CRM Integration & Automation',
    'Bi-weekly Strategy Calls',
    'Priority Support',
    'Dedicated Account Manager'
  ),
  true,
  2,
  'Scale Your Success',
  '#FF6A00'
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Dominate',
  'Enterprise-level AI marketing systems for market leaders',
  12000,
  129600, -- 10% discount
  jsonb_build_array(
    'Everything in Scale tier',
    'Custom AI Model Training',
    'Advanced Predictive Analytics',
    'Fractional CMO Services',
    'Multi-brand Management',
    'Custom Integration Development',
    'Weekly Strategy Sessions',
    '24/7 Priority Support',
    'Quarterly Business Reviews',
    'White-label Reporting'
  ),
  false,
  3,
  'Dominate Your Market',
  '#9B30FF'
);

-- =====================================================
-- 2. ADD TEAM MEMBERS
-- =====================================================

INSERT INTO ai_presenter_team_members (
  client_id,
  name,
  role,
  bio,
  expertise,
  image_url,
  linkedin_url,
  sort_order
) VALUES
(
  'c1111111-1111-1111-1111-111111111111',
  'Sarah Chen',
  'Chief AI Officer',
  'Former AI research lead at Google. Sarah architected ML systems processing 10M+ daily decisions before founding Disruptors Media''s AI division.',
  jsonb_build_array(
    'Machine Learning Architecture',
    'Predictive Analytics',
    'AI Strategy & Implementation',
    'Natural Language Processing'
  ),
  'https://res.cloudinary.com/dvcvxhzmt/image/upload/v1/team/sarah-chen.jpg',
  'https://linkedin.com/in/sarahchen',
  1
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Marcus Rodriguez',
  'Head of Growth Systems',
  '10+ years scaling startups from 0 to $50M ARR. Marcus built the automated growth engine that powers our client success stories.',
  jsonb_build_array(
    'Growth Marketing',
    'Marketing Automation',
    'Conversion Optimization',
    'Data-Driven Strategy'
  ),
  'https://res.cloudinary.com/dvcvxhzmt/image/upload/v1/team/marcus-rodriguez.jpg',
  'https://linkedin.com/in/marcusrodriguez',
  2
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Dr. Aisha Patel',
  'Director of Analytics',
  'PhD in Data Science from MIT. Aisha transforms raw marketing data into actionable insights using advanced statistical modeling.',
  jsonb_build_array(
    'Advanced Analytics',
    'Statistical Modeling',
    'Attribution Science',
    'Business Intelligence'
  ),
  'https://res.cloudinary.com/dvcvxhzmt/image/upload/v1/team/aisha-patel.jpg',
  'https://linkedin.com/in/aishapatel',
  3
),
(
  'c1111111-1111-1111-1111-111111111111',
  'James O''Sullivan',
  'Creative Director',
  'Award-winning creative who led campaigns for Fortune 500 brands. James ensures AI-generated content maintains emotional resonance and brand authenticity.',
  jsonb_build_array(
    'Brand Strategy',
    'Creative Direction',
    'Content Strategy',
    'AI-Assisted Creativity'
  ),
  'https://res.cloudinary.com/dvcvxhzmt/image/upload/v1/team/james-osullivan.jpg',
  'https://linkedin.com/in/jamesosullivan',
  4
);

-- =====================================================
-- 3. ADD COMPETITIVE ANALYSIS FOR DEMO CLIENT
-- =====================================================

-- First, let's add a demo prospect client for the presentation
INSERT INTO ai_presenter_clients (
  id,
  name,
  slug,
  description,
  website,
  email,
  industry,
  company_size,
  annual_revenue,
  status
) VALUES (
  'c2222222-2222-2222-2222-222222222222',
  'TechVenture Solutions',
  'techventure-demo',
  'B2B SaaS company providing project management software',
  'https://techventuresolutions.example.com',
  'info@techventuresolutions.example.com',
  'B2B SaaS',
  '50-100 employees',
  '$5-10M',
  'prospect'
) ON CONFLICT (id) DO NOTHING;

-- Add competitive analysis for demo client
INSERT INTO ai_presenter_competitive_analysis (
  client_id,
  market_overview,
  key_competitors,
  competitive_advantages,
  market_gaps,
  ai_opportunities,
  recommended_strategies,
  analysis_data
) VALUES (
  'c2222222-2222-2222-2222-222222222222',
  'The B2B SaaS project management space is highly competitive with established players like Monday.com, Asana, and ClickUp. However, there''s a significant opportunity in AI-powered project intelligence and predictive resource allocation.',
  jsonb_build_array(
    jsonb_build_object(
      'name', 'Monday.com',
      'strength', 'Visual workflow builder and extensive integrations',
      'weakness', 'Complex pricing structure, limited AI features'
    ),
    jsonb_build_object(
      'name', 'Asana',
      'strength', 'Strong enterprise features and team collaboration',
      'weakness', 'Steep learning curve, expensive for growing teams'
    ),
    jsonb_build_object(
      'name', 'ClickUp',
      'strength', 'Feature-rich with everything-in-one approach',
      'weakness', 'Can feel overwhelming, UI complexity'
    )
  ),
  jsonb_build_array(
    'AI-powered predictive analytics for project timelines',
    'Automated resource allocation based on team capacity',
    'Superior customer onboarding with AI assistants',
    'More affordable pricing for mid-market companies'
  ),
  jsonb_build_array(
    'Lack of AI-driven predictive project management',
    'Complex onboarding processes deterring new users',
    'Limited automation in resource planning',
    'Gap in serving 50-200 employee companies'
  ),
  jsonb_build_array(
    'Implement AI chatbot for instant customer support (reduce support costs 40%)',
    'Deploy predictive analytics for project risk identification',
    'Automate lead scoring to focus sales on high-intent prospects',
    'Create AI-powered content engine for blog and social media',
    'Build automated email nurture sequences based on user behavior'
  ),
  jsonb_build_array(
    'Increase trial-to-paid conversion through AI-guided onboarding',
    'Reduce customer acquisition cost with targeted AI lead generation',
    'Expand market share in 50-200 employee segment'
  ),
  jsonb_build_object(
    'competitors', jsonb_build_array(
      jsonb_build_object(
        'name', 'Monday.com',
        'market_share', '23%',
        'strengths', jsonb_build_array('Visual builder', 'Integrations', 'Brand recognition'),
        'weaknesses', jsonb_build_array('Complex pricing', 'Limited AI', 'Feature bloat')
      ),
      jsonb_build_object(
        'name', 'Asana',
        'market_share', '19%',
        'strengths', jsonb_build_array('Enterprise ready', 'Team collaboration', 'Reliability'),
        'weaknesses', jsonb_build_array('Steep learning curve', 'Expensive', 'Rigid workflows')
      ),
      jsonb_build_object(
        'name', 'ClickUp',
        'market_share', '15%',
        'strengths', jsonb_build_array('Feature rich', 'Customizable', 'Value pricing'),
        'weaknesses', jsonb_build_array('UI complexity', 'Performance issues', 'Support quality')
      )
    ),
    'client_strengths', jsonb_build_array(
      'Simpler, more intuitive interface',
      'AI-powered predictive capabilities',
      'Better pricing for mid-market',
      'Faster implementation time',
      'Superior customer support NPS (72)'
    ),
    'client_weaknesses', jsonb_build_array(
      'Lower brand recognition vs established players',
      'Smaller integration marketplace (127 vs 500+)',
      'Limited enterprise-level security features',
      'Smaller customer base for social proof'
    ),
    'opportunities', jsonb_build_array(
      jsonb_build_object(
        'opportunity', 'AI-Powered Lead Scoring',
        'impact', 'Increase conversion rate by 45%',
        'effort', 'Medium',
        'timeline', '60-90 days'
      ),
      jsonb_build_object(
        'opportunity', 'Automated Content Marketing',
        'impact', 'Generate 50+ qualified leads/month',
        'effort', 'Low',
        'timeline', '30-45 days'
      ),
      jsonb_build_object(
        'opportunity', 'Predictive Customer Analytics',
        'impact', 'Reduce churn by 28%',
        'effort', 'High',
        'timeline', '90-120 days'
      ),
      jsonb_build_object(
        'opportunity', 'AI Chatbot for Support & Sales',
        'impact', 'Handle 60% of inquiries automatically',
        'effort', 'Medium',
        'timeline', '45-60 days'
      )
    )
  )
);

-- =====================================================
-- 4. ADD MORE CASE STUDIES (BRING TOTAL TO 6)
-- =====================================================

INSERT INTO ai_presenter_case_studies (
  client_id,
  title,
  industry,
  challenge,
  solution,
  results,
  metrics,
  accent_color,
  sort_order,
  is_featured
) VALUES
(
  'c1111111-1111-1111-1111-111111111111',
  'Manufacturing: Supply Chain Optimization',
  'Manufacturing',
  'A mid-size manufacturer faced unpredictable demand patterns causing inventory issues and lost sales opportunities.',
  'Implemented AI-powered demand forecasting and automated inventory management. Real-time alerts trigger restocking before stockouts occur.',
  jsonb_build_object(
    'roi_percentage', 385,
    'cost_reduction', '$1.8M annually',
    'efficiency_gain', '47%',
    'time_to_value', '75 days'
  ),
  jsonb_build_array(
    jsonb_build_object('label', 'Inventory Costs', 'value', '-47%', 'type', 'percentage'),
    jsonb_build_object('label', 'Forecast Accuracy', 'value', '94%', 'type', 'percentage'),
    jsonb_build_object('label', 'Annual Savings', 'value', '$1.8M', 'type', 'currency')
  ),
  '#00FFD9',
  4,
  false
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Professional Services: Client Acquisition',
  'Professional Services',
  'A boutique consulting firm relied on referrals and had no scalable client acquisition process.',
  'Built AI-driven LinkedIn outreach system with personalized messaging at scale. Integrated with CRM for automatic lead nurturing.',
  jsonb_build_object(
    'roi_percentage', 520,
    'client_increase', '+215%',
    'cost_per_lead', '-68%',
    'time_to_value', '45 days'
  ),
  jsonb_build_array(
    jsonb_build_object('label', 'New Clients', 'value', '+215%', 'type', 'percentage'),
    jsonb_build_object('label', 'Cost Per Lead', 'value', '-68%', 'type', 'percentage'),
    jsonb_build_object('label', 'Revenue Growth', 'value', '520%', 'type', 'percentage')
  ),
  '#FFD700',
  5,
  true
),
(
  'c1111111-1111-1111-1111-111111111111',
  'Real Estate: Automated Lead Nurturing',
  'Real Estate',
  'Real estate firm generated leads but struggled to follow up consistently, losing deals to more responsive competitors.',
  'Deployed AI chatbot for instant lead response 24/7. Automated email and SMS sequences tailored to property interests and buyer stage.',
  jsonb_build_object(
    'roi_percentage', 412,
    'response_time', '2 minutes (from 4 hours)',
    'conversion_rate', '+156%',
    'time_to_value', '30 days'
  ),
  jsonb_build_array(
    jsonb_build_object('label', 'Lead Response Time', 'value', '2min', 'type', 'time'),
    jsonb_build_object('label', 'Conversion Rate', 'value', '+156%', 'type', 'percentage'),
    jsonb_build_object('label', 'Deals Closed', 'value', '+412%', 'type', 'percentage')
  ),
  '#FF00FF',
  6,
  false
);

-- =====================================================
-- 5. ADD ACCESS LINKS FOR DEMO
-- =====================================================

INSERT INTO ai_presenter_access_links (
  client_id,
  name,
  token,
  expires_at,
  max_views,
  view_count,
  allowed_sections,
  status
) VALUES
(
  'c1111111-1111-1111-1111-111111111111',
  'Demo Presentation - Full Access',
  'demo-full-access-' || substr(md5(random()::text), 1, 12),
  NOW() + INTERVAL '30 days',
  NULL, -- unlimited
  0,
  jsonb_build_array('all'),
  'active'
),
(
  'c2222222-2222-2222-2222-222222222222',
  'TechVenture Proposal',
  'techventure-proposal-' || substr(md5(random()::text), 1, 12),
  NOW() + INTERVAL '14 days',
  50,
  0,
  jsonb_build_array('all'),
  'active'
);

-- =====================================================
-- 6. UPDATE DISRUPTORS MEDIA CLIENT WITH MORE DETAILS
-- =====================================================

UPDATE ai_presenter_clients
SET
  description = 'AI-Powered Marketing Agency specializing in growth strategies and marketing automation. We architect intelligent systems that multiply efficiency, profitability, and creativity for ambitious businesses.',
  company_size = '25-50 employees',
  annual_revenue = '$5-10M',
  industry = 'Marketing & Advertising',
  target_market = 'B2B SaaS, E-Commerce, Professional Services, Healthcare',
  value_proposition = 'We build AI-powered marketing systems that give you an unfair advantage. From predictive lead scoring to automated content creation, every solution is designed to maximize leverage - achieving greater output with less effort, time, and cost.',
  mission_statement = 'To empower businesses with AI leverage - building systems that multiply efficiency, profitability, and creativity. When human creativity meets machine precision, disruption becomes inevitable.',
  branding_config = jsonb_build_object(
    'colors', jsonb_build_object(
      'primary', '#D4AF37',
      'secondary', '#000000',
      'accent', '#FF6A00',
      'background', '#0E0E0E',
      'text', '#FFFFFF'
    ),
    'fonts', jsonb_build_object(
      'heading', 'Inter',
      'body', 'Inter'
    ),
    'voice', jsonb_build_array(
      'Bold and confident',
      'Data-driven and results-focused',
      'Future-forward with practical application',
      'Empowering without hype'
    )
  )
WHERE id = 'c1111111-1111-1111-1111-111111111111';

-- =====================================================
-- 7. ADD PRESENTATION CONFIGURATION
-- =====================================================

-- Update the default presentation with more details
UPDATE ai_presenter_presentations
SET
  description = 'Comprehensive AI-powered marketing proposal showcasing proven systems, case studies, and custom strategy recommendations',
  theme = jsonb_build_object(
    'primaryColor', '#D4AF37',
    'secondaryColor', '#000000',
    'accentColor', '#FF6A00',
    'backgroundColor', '#0E0E0E',
    'textColor', '#FFFFFF',
    'gradients', jsonb_build_object(
      'primary', 'from-[#D4AF37] to-[#FF6A00]',
      'accent', 'from-[#FF6A00] to-[#9B30FF]'
    )
  ),
  settings = jsonb_build_object(
    'autoAdvance', false,
    'showAnalytics', true,
    'enablePersonalization', true,
    'transitionDuration', 800
  )
WHERE client_id = 'c1111111-1111-1111-1111-111111111111'
AND is_default = true;

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify pricing tiers
SELECT name, price_monthly, is_featured
FROM ai_presenter_pricing_tiers
WHERE client_id = 'c1111111-1111-1111-1111-111111111111'
ORDER BY sort_order;

-- Verify team members
SELECT name, role
FROM ai_presenter_team_members
WHERE client_id = 'c1111111-1111-1111-1111-111111111111'
ORDER BY sort_order;

-- Verify case studies
SELECT title, industry, is_featured
FROM ai_presenter_case_studies
WHERE client_id = 'c1111111-1111-1111-1111-111111111111'
ORDER BY sort_order;

-- Verify services
SELECT name, pricing_model
FROM ai_presenter_services
WHERE client_id = 'c1111111-1111-1111-1111-111111111111'
ORDER BY sort_order;

-- Summary
SELECT
  (SELECT COUNT(*) FROM ai_presenter_pricing_tiers WHERE client_id = 'c1111111-1111-1111-1111-111111111111') as pricing_tiers,
  (SELECT COUNT(*) FROM ai_presenter_team_members WHERE client_id = 'c1111111-1111-1111-1111-111111111111') as team_members,
  (SELECT COUNT(*) FROM ai_presenter_case_studies WHERE client_id = 'c1111111-1111-1111-1111-111111111111') as case_studies,
  (SELECT COUNT(*) FROM ai_presenter_services WHERE client_id = 'c1111111-1111-1111-1111-111111111111') as services;
