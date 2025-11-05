import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ubqxflzuvxowigbjmqfb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicXhmbHp1dnhvd2lnYmptcWZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODUxMjQzOCwiZXhwIjoyMDc0MDg4NDM4fQ.FnhnaAxWjMo41M7Gmm_bXFXZuegzW5HfitvB1APNDDk';

console.log('🔧 AI Presenter Demo Data Loader');
console.log('==========================================\n');
console.log(`📍 Supabase URL: ${SUPABASE_URL}`);
console.log(`🔑 Service Key: ${SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...\n`);

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const CLIENT_ID = 'c1111111-1111-1111-1111-111111111111';

async function clearExistingData() {
  console.log('🧹 Clearing existing demo data...');

  try {
    // Delete in reverse dependency order
    await supabase.from('ai_presenter_analytics_events').delete().eq('client_id', CLIENT_ID);
    await supabase.from('ai_presenter_access_links').delete().eq('client_id', CLIENT_ID);
    await supabase.from('ai_presenter_competitive_analysis').delete().eq('client_id', CLIENT_ID);
    await supabase.from('ai_presenter_team_members').delete().eq('client_id', CLIENT_ID);
    await supabase.from('ai_presenter_pricing_tiers').delete().eq('client_id', CLIENT_ID);
    await supabase.from('ai_presenter_case_studies').delete().eq('client_id', CLIENT_ID);
    await supabase.from('ai_presenter_services').delete().eq('client_id', CLIENT_ID);
    await supabase.from('ai_presenter_presentations').delete().eq('client_id', CLIENT_ID);
    await supabase.from('ai_presenter_clients').delete().eq('id', CLIENT_ID);

    console.log('   ✅ Cleared existing data\n');
  } catch (error) {
    console.log(`   ⚠️  Clear operation completed (some items may not have existed)\n`);
  }
}

async function insertClient() {
  console.log('👤 Creating client: Disruptors Media...');

  const { data, error } = await supabase
    .from('ai_presenter_clients')
    .insert({
      id: CLIENT_ID,
      name: 'Disruptors Media',
      slug: 'disruptors-media-demo',
      description: 'AI-Powered Marketing Agency specializing in growth strategies and marketing automation. We architect intelligent systems that multiply efficiency, profitability, and creativity for ambitious businesses.',
      website: 'https://disruptorsmedia.com',
      email: 'hello@disruptorsmedia.com',
      phone: '+1 (555) 123-4567',
      logo_url: 'https://res.cloudinary.com/dvcvxhzmt/image/upload/v1755696782/disruptors-media/brand/logos/gold-logo-banner.png',
      primary_color: '#D4AF37',
      secondary_color: '#000000',
      status: 'active',
      company_size: '25-50 employees',
      industry: 'Marketing & Advertising',
      target_market: 'B2B SaaS, E-Commerce, Professional Services, Healthcare',
      full_description: 'AI-Powered Marketing Agency specializing in growth strategies and marketing automation. We architect intelligent systems that multiply efficiency, profitability, and creativity for ambitious businesses. We build AI-powered marketing systems that give you an unfair advantage. From predictive lead scoring to automated content creation, every solution is designed to maximize leverage - achieving greater output with less effort, time, and cost.',
      brand_tone: 'Professional, innovative, data-driven',
      market_position: 'Premium AI-powered marketing automation provider',
      has_case_studies: true,
      has_blog: true,
      has_real_content: true
    })
    .select();

  if (error) {
    console.error(`   ❌ Error: ${error.message}\n`);
    throw error;
  }

  console.log(`   ✅ Created client: ${data[0].name}\n`);
  return data[0];
}

async function insertCaseStudies() {
  console.log('📊 Creating case studies...');

  const caseStudies = [
    {
      client_id: CLIENT_ID,
      title: 'SaaS Scale-Up: 300% Revenue Growth',
      slug: 'saas-scale-up',
      client_name: 'CloudTech Solutions',
      industry: 'B2B SaaS',
      challenge: 'A growing SaaS platform struggled to convert trial users into paying customers. Their organic traffic was high but conversion rates were below industry benchmarks.',
      solution: 'We implemented an AI-powered lead scoring system combined with personalized email sequences and strategic content marketing. Automated workflows identified high-intent prospects and delivered targeted messaging at optimal times.',
      results: {
        roi_percentage: 327,
        revenue_increase: '$2.4M',
        conversion_lift: '185%',
        time_to_value: '90 days'
      },
      metrics: [
        { label: 'Revenue Growth', value: '327%', type: 'percentage' },
        { label: 'Trial-to-Paid Conversion', value: '185%', type: 'percentage' },
        { label: 'MRR Increase', value: '$2.4M', type: 'currency' }
      ],
      order_index: 1,
      is_featured: true
    },
    {
      client_id: CLIENT_ID,
      title: 'E-Commerce: Doubled ROAS in 6 Months',
      slug: 'ecommerce-doubled-roas',
      client_name: 'StyleHub Retail',
      industry: 'E-Commerce',
      challenge: 'An established e-commerce brand was experiencing declining ad performance and rising customer acquisition costs across paid channels.',
      solution: 'We restructured their entire paid media strategy using AI-driven audience segmentation and dynamic creative optimization. Implemented automated bidding strategies and cross-channel attribution modeling.',
      results: {
        roi_percentage: 215,
        roas_improvement: '2.4x',
        cac_reduction: '-42%',
        time_to_value: '120 days'
      },
      metrics: [
        { label: 'ROAS', value: '2.4x', type: 'multiplier' },
        { label: 'CAC Reduction', value: '-42%', type: 'percentage' },
        { label: 'Revenue Increase', value: '215%', type: 'percentage' }
      ],
      order_index: 2,
      is_featured: true
    },
    {
      client_id: CLIENT_ID,
      title: 'Healthcare: AI-Powered Patient Acquisition',
      slug: 'healthcare-patient-acquisition',
      client_name: 'HealthFirst Network',
      industry: 'Healthcare',
      challenge: 'A healthcare provider network needed to increase patient bookings while maintaining HIPAA compliance and reducing marketing spend.',
      solution: 'Deployed an AI-powered chatbot for 24/7 appointment scheduling integrated with their existing practice management system. Combined with local SEO optimization and targeted content marketing.',
      results: {
        roi_percentage: 445,
        booking_increase: '310%',
        cost_reduction: '-38%',
        time_to_value: '60 days'
      },
      metrics: [
        { label: 'Patient Bookings', value: '+310%', type: 'percentage' },
        { label: 'Marketing Efficiency', value: '-38%', type: 'percentage' },
        { label: 'ROI', value: '445%', type: 'percentage' }
      ],
      order_index: 3,
      is_featured: false
    },
    {
      client_id: CLIENT_ID,
      title: 'Manufacturing: Supply Chain Optimization',
      slug: 'manufacturing-supply-chain',
      client_name: 'Precision Manufacturing Co.',
      industry: 'Manufacturing',
      challenge: 'A mid-size manufacturer faced unpredictable demand patterns causing inventory issues and lost sales opportunities.',
      solution: 'Implemented AI-powered demand forecasting and automated inventory management. Real-time alerts trigger restocking before stockouts occur.',
      results: {
        roi_percentage: 385,
        cost_reduction: '$1.8M annually',
        efficiency_gain: '47%',
        time_to_value: '75 days'
      },
      metrics: [
        { label: 'Inventory Costs', value: '-47%', type: 'percentage' },
        { label: 'Forecast Accuracy', value: '94%', type: 'percentage' },
        { label: 'Annual Savings', value: '$1.8M', type: 'currency' }
      ],
      order_index: 4,
      is_featured: false
    },
    {
      client_id: CLIENT_ID,
      title: 'Professional Services: Client Acquisition',
      slug: 'professional-services-acquisition',
      client_name: 'Elite Consulting Group',
      industry: 'Professional Services',
      challenge: 'A boutique consulting firm relied on referrals and had no scalable client acquisition process.',
      solution: 'Built AI-driven LinkedIn outreach system with personalized messaging at scale. Integrated with CRM for automatic lead nurturing.',
      results: {
        roi_percentage: 520,
        client_increase: '+215%',
        cost_per_lead: '-68%',
        time_to_value: '45 days'
      },
      metrics: [
        { label: 'New Clients', value: '+215%', type: 'percentage' },
        { label: 'Cost Per Lead', value: '-68%', type: 'percentage' },
        { label: 'Revenue Growth', value: '520%', type: 'percentage' }
      ],
      order_index: 5,
      is_featured: true
    },
    {
      client_id: CLIENT_ID,
      title: 'Real Estate: Automated Lead Nurturing',
      slug: 'real-estate-lead-nurturing',
      client_name: 'Prime Properties Group',
      industry: 'Real Estate',
      challenge: 'Real estate firm generated leads but struggled to follow up consistently, losing deals to more responsive competitors.',
      solution: 'Deployed AI chatbot for instant lead response 24/7. Automated email and SMS sequences tailored to property interests and buyer stage.',
      results: {
        roi_percentage: 412,
        response_time: '2 minutes (from 4 hours)',
        conversion_rate: '+156%',
        time_to_value: '30 days'
      },
      metrics: [
        { label: 'Lead Response Time', value: '2min', type: 'time' },
        { label: 'Conversion Rate', value: '+156%', type: 'percentage' },
        { label: 'Deals Closed', value: '+412%', type: 'percentage' }
      ],
      order_index: 6,
      is_featured: false
    }
  ];

  for (const cs of caseStudies) {
    const { error } = await supabase
      .from('ai_presenter_case_studies')
      .insert(cs);

    if (error) {
      console.error(`   ❌ Error inserting "${cs.title}": ${error.message}`);
    } else {
      console.log(`   ✅ ${cs.title}`);
    }
  }

  console.log('');
}

async function insertServices() {
  console.log('🛠️  Creating services...');

  const services = [
    {
      client_id: CLIENT_ID,
      name: 'AI-Powered Lead Generation',
      slug: 'ai-lead-generation',
      description: 'Leverage machine learning to identify, score, and convert high-intent prospects automatically. Our proprietary algorithms analyze thousands of data points to predict customer behavior.',
      features: [
        'Predictive lead scoring with 92% accuracy',
        'Automated multi-channel outreach sequences',
        'Real-time intent signal monitoring',
        'Dynamic audience segmentation',
        'Conversion rate optimization'
      ],
      order_index: 1
    },
    {
      client_id: CLIENT_ID,
      name: 'Content Engine Pro',
      slug: 'content-engine-pro',
      description: 'AI-assisted content creation that maintains your brand voice while scaling output. Generate blog posts, social media, emails, and ad copy in minutes.',
      features: [
        'SEO-optimized blog post generation',
        'Brand voice training and consistency',
        'Multi-format content adaptation',
        'A/B testing and performance tracking',
        'Content calendar automation'
      ],
      order_index: 2
    },
    {
      client_id: CLIENT_ID,
      name: 'Smart Analytics Dashboard',
      slug: 'smart-analytics-dashboard',
      description: 'Unified view of all your marketing metrics with AI-powered insights and recommendations. See what\'s working and what needs optimization in real-time.',
      features: [
        'Cross-channel attribution modeling',
        'Predictive revenue forecasting',
        'Automated anomaly detection',
        'Custom report builder',
        'Real-time performance alerts'
      ],
      order_index: 3
    },
    {
      client_id: CLIENT_ID,
      name: 'Automated Email Campaigns',
      slug: 'automated-email-campaigns',
      description: 'Behavior-triggered email sequences that convert. Our AI determines the perfect timing, messaging, and frequency for each subscriber.',
      features: [
        'Behavioral trigger automation',
        'Dynamic content personalization',
        'Send-time optimization',
        'Engagement scoring',
        'Deliverability optimization'
      ],
      order_index: 4
    },
    {
      client_id: CLIENT_ID,
      name: 'Social Media Automation',
      slug: 'social-media-automation',
      description: 'Schedule, publish, and analyze social content across all platforms from one dashboard. AI-powered caption writing and optimal posting times.',
      features: [
        'Multi-platform scheduling',
        'AI caption generation',
        'Hashtag research and optimization',
        'Engagement analytics',
        'Competitor monitoring'
      ],
      order_index: 5
    },
    {
      client_id: CLIENT_ID,
      name: 'CRM Integration & Automation',
      slug: 'crm-integration-automation',
      description: 'Connect all your tools and automate repetitive workflows. Our AI learns from your data to suggest process improvements.',
      features: [
        'Two-way CRM sync (HubSpot, Salesforce)',
        'Custom workflow automation',
        'Data enrichment and cleaning',
        'Pipeline forecasting',
        'Team collaboration tools'
      ],
      order_index: 6
    }
  ];

  for (const service of services) {
    const { error } = await supabase
      .from('ai_presenter_services')
      .insert(service);

    if (error) {
      console.error(`   ❌ Error inserting "${service.name}": ${error.message}`);
    } else {
      console.log(`   ✅ ${service.name}`);
    }
  }

  console.log('');
}

async function insertPricingTiers() {
  console.log('💰 Creating pricing tiers...');

  const tiers = [
    {
      client_id: CLIENT_ID,
      name: 'Launch',
      slug: 'launch',
      description: 'Perfect for businesses testing AI-powered marketing for the first time',
      price: 2500.00,
      billing_period: 'monthly',
      price_label: '$2,500/month or $27,000/year (save 10%)',
      features: [
        'AI Lead Generation (up to 500 leads/mo)',
        'Automated Email Sequences (3 sequences)',
        'Content Engine Pro (10 posts/mo)',
        'Basic Analytics Dashboard',
        'Monthly Strategy Call',
        'Email Support'
      ],
      is_highlighted: false,
      badge_text: null,
      sort_order: 1,
      cta_text: 'Start Your Growth',
      color_scheme: '#00D9FF',
      is_active: true
    },
    {
      client_id: CLIENT_ID,
      name: 'Scale',
      slug: 'scale',
      description: 'For growing companies ready to multiply their marketing leverage',
      price: 5500.00,
      billing_period: 'monthly',
      price_label: '$5,500/month or $59,400/year (save 10%)',
      features: [
        'AI Lead Generation (unlimited)',
        'Automated Email Sequences (unlimited)',
        'Content Engine Pro (30 posts/mo)',
        'Smart Analytics Dashboard with AI insights',
        'Social Media Automation (all platforms)',
        'CRM Integration & Automation',
        'Bi-weekly Strategy Calls',
        'Priority Support',
        'Dedicated Account Manager'
      ],
      is_highlighted: true,
      badge_text: 'Most Popular',
      sort_order: 2,
      cta_text: 'Scale Your Success',
      color_scheme: '#FF6A00',
      is_active: true
    },
    {
      client_id: CLIENT_ID,
      name: 'Dominate',
      slug: 'dominate',
      description: 'Enterprise-level AI marketing systems for market leaders',
      price: 12000.00,
      billing_period: 'monthly',
      price_label: '$12,000/month or $129,600/year (save 10%)',
      features: [
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
      ],
      is_highlighted: false,
      badge_text: 'Premium',
      sort_order: 3,
      cta_text: 'Dominate Your Market',
      color_scheme: '#9B30FF',
      is_active: true
    }
  ];

  for (const tier of tiers) {
    const { error } = await supabase
      .from('ai_presenter_pricing_tiers')
      .insert(tier);

    if (error) {
      console.error(`   ❌ Error inserting "${tier.name}": ${error.message}`);
    } else {
      console.log(`   ✅ ${tier.name} - $${tier.price}/month`);
    }
  }

  console.log('');
}

async function insertTeamMembers() {
  console.log('👥 Creating team members...');

  const team = [
    {
      client_id: CLIENT_ID,
      name: 'Sarah Chen',
      role: 'Chief AI Officer',
      bio: 'Former AI research lead at Google. Sarah architected ML systems processing 10M+ daily decisions before founding Disruptors Media\'s AI division. Expert in Machine Learning Architecture, Predictive Analytics, AI Strategy & Implementation, and Natural Language Processing.',
      photo_url: 'https://res.cloudinary.com/dvcvxhzmt/image/upload/v1/team/sarah-chen.jpg',
      linkedin_url: 'https://linkedin.com/in/sarahchen',
      order_index: 1
    },
    {
      client_id: CLIENT_ID,
      name: 'Marcus Rodriguez',
      role: 'Head of Growth Systems',
      bio: '10+ years scaling startups from 0 to $50M ARR. Marcus built the automated growth engine that powers our client success stories. Specializes in Growth Marketing, Marketing Automation, Conversion Optimization, and Data-Driven Strategy.',
      photo_url: 'https://res.cloudinary.com/dvcvxhzmt/image/upload/v1/team/marcus-rodriguez.jpg',
      linkedin_url: 'https://linkedin.com/in/marcusrodriguez',
      order_index: 2
    },
    {
      client_id: CLIENT_ID,
      name: 'Dr. Aisha Patel',
      role: 'Director of Analytics',
      bio: 'PhD in Data Science from MIT. Aisha transforms raw marketing data into actionable insights using advanced statistical modeling. Expert in Advanced Analytics, Statistical Modeling, Attribution Science, and Business Intelligence.',
      photo_url: 'https://res.cloudinary.com/dvcvxhzmt/image/upload/v1/team/aisha-patel.jpg',
      linkedin_url: 'https://linkedin.com/in/aishapatel',
      order_index: 3
    },
    {
      client_id: CLIENT_ID,
      name: 'James O\'Sullivan',
      role: 'Creative Director',
      bio: 'Award-winning creative who led campaigns for Fortune 500 brands. James ensures AI-generated content maintains emotional resonance and brand authenticity. Specializes in Brand Strategy, Creative Direction, Content Strategy, and AI-Assisted Creativity.',
      photo_url: 'https://res.cloudinary.com/dvcvxhzmt/image/upload/v1/team/james-osullivan.jpg',
      linkedin_url: 'https://linkedin.com/in/jamesosullivan',
      order_index: 4
    }
  ];

  for (const member of team) {
    const { error } = await supabase
      .from('ai_presenter_team_members')
      .insert(member);

    if (error) {
      console.error(`   ❌ Error inserting "${member.name}": ${error.message}`);
    } else {
      console.log(`   ✅ ${member.name} - ${member.role}`);
    }
  }

  console.log('');
}

async function insertPresentation() {
  console.log('🎨 Creating default presentation...');

  const { error } = await supabase
    .from('ai_presenter_presentations')
    .insert({
      client_id: CLIENT_ID,
      title: 'Disruptors Media - Growth Proposal',
      description: 'Comprehensive AI-powered marketing proposal',
      theme: {
        primaryColor: '#D4AF37',
        secondaryColor: '#000000',
        accentColor: '#FF6A00'
      },
      is_default: true
    });

  if (error) {
    console.error(`   ❌ Error: ${error.message}\n`);
  } else {
    console.log(`   ✅ Default presentation created\n`);
  }
}

async function verifyData() {
  console.log('═══════════════════════════════════════════');
  console.log('VERIFICATION');
  console.log('═══════════════════════════════════════════\n');

  const checks = [
    { table: 'ai_presenter_clients', expected: 1, label: 'Client', useId: true },
    { table: 'ai_presenter_case_studies', expected: 6, label: 'Case Studies' },
    { table: 'ai_presenter_services', expected: 6, label: 'Services' },
    { table: 'ai_presenter_pricing_tiers', expected: 3, label: 'Pricing Tiers' },
    { table: 'ai_presenter_team_members', expected: 4, label: 'Team Members' },
    { table: 'ai_presenter_presentations', expected: 1, label: 'Presentations' },
  ];

  let allPassed = true;

  for (const check of checks) {
    const query = check.useId
      ? supabase.from(check.table).select('*', { count: 'exact', head: true }).eq('id', CLIENT_ID)
      : supabase.from(check.table).select('*', { count: 'exact', head: true }).eq('client_id', CLIENT_ID);

    const { count, error } = await query;

    if (error) {
      console.log(`   ❌ ${check.label}: Error - ${error.message}`);
      allPassed = false;
    } else if (count === check.expected) {
      console.log(`   ✅ ${check.label}: ${count} record(s)`);
    } else {
      console.log(`   ⚠️  ${check.label}: Expected ${check.expected}, found ${count}`);
      allPassed = false;
    }
  }

  console.log('');
  return allPassed;
}

async function main() {
  try {
    // Test connection
    console.log('🔌 Testing database connection...');
    const { error: connectionError } = await supabase
      .from('ai_presenter_clients')
      .select('count', { count: 'exact', head: true });

    if (connectionError) {
      console.error(`   ❌ Connection failed: ${connectionError.message}\n`);
      process.exit(1);
    }

    console.log('   ✅ Connected successfully!\n');

    // Clear existing data
    await clearExistingData();

    // Insert all data
    await insertClient();
    await insertCaseStudies();
    await insertServices();
    await insertPricingTiers();
    await insertTeamMembers();
    await insertPresentation();

    // Verify
    const verified = await verifyData();

    if (verified) {
      console.log('✅ All demo data loaded successfully!\n');
      console.log('🎉 You can now access Disruptors Media demo at:');
      console.log(`   Slug: disruptors-media-demo`);
      console.log(`   Client ID: ${CLIENT_ID}\n`);
    } else {
      console.log('⚠️  Demo data loaded with some warnings. Please review above.\n');
    }

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
