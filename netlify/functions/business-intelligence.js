/**
 * Netlify Function: Business Intelligence Aggregator
 *
 * Orchestrates Phase 1 business intelligence APIs:
 * - Apollo.io (company enrichment)
 * - DataForSEO (SEO intelligence)
 * - Wappalyzer (technology detection)
 *
 * Handles caching, parallel execution, and opportunity detection
 */

import { createClient } from '@supabase/supabase-js';

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Content-Type': 'application/json',
};

// Initialize Supabase client
const getSupabaseClient = () => {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase credentials not configured');
  }

  return createClient(url, key);
};

/**
 * Apollo.io API Client
 */
class ApolloClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.apollo.io/v1';
  }

  async getCompanyData(domain) {
    console.log('[Apollo] Fetching company data for:', domain);

    const response = await fetch(
      `${this.baseUrl}/organizations/search?organization_domains[]=${domain}`,
      {
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Apollo API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.organizations || data.organizations.length === 0) {
      return null;
    }

    const company = data.organizations[0];

    return {
      name: company.name,
      domain: company.domain,
      website: company.website_url,
      industry: company.industry,
      subIndustry: company.sub_industries?.[0] || null,
      employeeCount: company.estimated_num_employees,
      revenue: company.annual_revenue,
      foundedYear: company.founded_year,
      description: company.short_description || company.description,
      phone: company.phone,
      city: company.city,
      state: company.state,
      country: company.country,
      linkedinUrl: company.linkedin_url,
      facebookUrl: company.facebook_url,
      twitterUrl: company.twitter_url,
      technologies: company.technologies || [],
      dataSource: 'apollo',
      retrievedAt: new Date().toISOString(),
    };
  }
}

/**
 * DataForSEO API Client
 */
class DataForSEOClient {
  constructor(login, password) {
    this.login = login;
    this.password = password;
    this.baseUrl = 'https://api.dataforseo.com/v3';
    this.totalCost = 0;
  }

  async getDomainAnalytics(domain, locationCode = 2840) {
    console.log('[DataForSEO] Fetching domain analytics for:', domain);

    const auth = Buffer.from(`${this.login}:${this.password}`).toString('base64');

    const response = await fetch(
      `${this.baseUrl}/dataforseo_labs/google/domain_rank_overview/live`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        },
        body: JSON.stringify([
          {
            target: domain,
            location_code: locationCode,
            language_code: 'en',
          },
        ]),
      }
    );

    if (!response.ok) {
      throw new Error(`DataForSEO API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status_code !== 20000 || !data.tasks || !data.tasks[0]?.result) {
      throw new Error(`DataForSEO error: ${data.status_message}`);
    }

    const result = data.tasks[0].result[0];
    const cost = data.cost || 0;
    this.totalCost += cost;

    return {
      organicKeywords: result.metrics.organic.count || 0,
      estimatedTrafficValue: result.metrics.organic.etv || 0,
      top3Keywords: result.metrics.organic.pos_1_3 || 0,
      top10Keywords: result.metrics.organic.pos_4_10 || 0,
      top100Keywords: result.metrics.organic.pos_11_100 || 0,
      cost,
      dataSource: 'dataforseo',
      retrievedAt: new Date().toISOString(),
    };
  }

  async getBacklinks(domain, limit = 100) {
    console.log('[DataForSEO] Fetching backlinks for:', domain);

    const auth = Buffer.from(`${this.login}:${this.password}`).toString('base64');

    const response = await fetch(
      `${this.baseUrl}/dataforseo_labs/google/bulk_backlinks/live`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        },
        body: JSON.stringify([
          {
            targets: [domain],
            limit,
            include_subdomains: true,
          },
        ]),
      }
    );

    if (!response.ok) {
      throw new Error(`DataForSEO API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status_code !== 20000) {
      throw new Error(`DataForSEO error: ${data.status_message}`);
    }

    const cost = data.cost || 0;
    this.totalCost += cost;

    const result = data.tasks[0]?.result?.[0];

    return {
      totalBacklinks: result?.total_count || 0,
      referringDomains: result?.referring_domains || 0,
      backlinks: result?.items || [],
      cost,
    };
  }

  async getCompetitors(domain, locationCode = 2840, limit = 10) {
    console.log('[DataForSEO] Fetching competitors for:', domain);

    const auth = Buffer.from(`${this.login}:${this.password}`).toString('base64');

    const response = await fetch(
      `${this.baseUrl}/dataforseo_labs/google/competitors_domain/live`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        },
        body: JSON.stringify([
          {
            target: domain,
            location_code: locationCode,
            language_code: 'en',
            limit,
          },
        ]),
      }
    );

    if (!response.ok) {
      throw new Error(`DataForSEO API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status_code !== 20000) {
      throw new Error(`DataForSEO error: ${data.status_message}`);
    }

    const cost = data.cost || 0;
    this.totalCost += cost;

    const result = data.tasks[0]?.result?.[0]?.items || [];

    return {
      competitors: result.map(comp => ({
        domain: comp.domain,
        avgPosition: comp.avg_position,
        sumPosition: comp.sum_position,
        intersections: comp.intersections,
      })),
      cost,
    };
  }

  getTotalCost() {
    return this.totalCost;
  }
}

/**
 * Wappalyzer API Client
 */
class WappalyzerClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.wappalyzer.com/v2';
    this.lookupCount = 0;
  }

  async analyzeTechnologyStack(url) {
    console.log('[Wappalyzer] Analyzing technology stack for:', url);

    const response = await fetch(
      `${this.baseUrl}/lookup/?urls=${encodeURIComponent(url)}`,
      {
        headers: {
          'x-api-key': this.apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Wappalyzer API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    this.lookupCount++;

    if (!data.results || data.results.length === 0) {
      return {
        technologies: [],
        summary: {},
        insights: {},
        dataSource: 'wappalyzer',
        retrievedAt: new Date().toISOString(),
      };
    }

    const result = data.results[0];
    const technologies = result.technologies || [];

    // Categorize technologies
    const categorize = (slug) => {
      return technologies.filter(t =>
        t.categories?.some(c => c.slug === slug)
      );
    };

    const summary = {
      cms: categorize('cms').map(t => t.name),
      frameworks: categorize('javascript-frameworks').map(t => t.name),
      analytics: categorize('analytics').map(t => t.name),
      marketingAutomation: categorize('marketing-automation').map(t => t.name),
      crm: categorize('crm').map(t => t.name),
      ecommerce: categorize('ecommerce').map(t => t.name),
    };

    const insights = {
      hasMarketingAutomation: summary.marketingAutomation.length > 0,
      hasCRM: summary.crm.length > 0,
      hasAnalytics: summary.analytics.length > 0,
      hasEcommerce: summary.ecommerce.length > 0,
    };

    // Identify missing technologies (opportunities)
    const missingTechnologies = [];
    if (!insights.hasMarketingAutomation) {
      missingTechnologies.push('Marketing Automation (HubSpot, Marketo, ActiveCampaign)');
    }
    if (!insights.hasCRM) {
      missingTechnologies.push('CRM System (Salesforce, HubSpot CRM, Pipedrive)');
    }
    if (!insights.hasAnalytics) {
      missingTechnologies.push('Analytics Platform (Google Analytics, Mixpanel, Amplitude)');
    }

    return {
      technologies,
      summary,
      insights,
      missingTechnologies,
      dataSource: 'wappalyzer',
      retrievedAt: new Date().toISOString(),
    };
  }

  getLookupCount() {
    return this.lookupCount;
  }
}

/**
 * Check cache for existing data
 */
async function checkCache(supabase, domain) {
  console.log('[Cache] Checking for:', domain);

  const { data, error } = await supabase
    .from('business_intelligence_cache')
    .select('*')
    .eq('company_domain', domain)
    .gt('cache_expires_at', new Date().toISOString())
    .single();

  if (error || !data) {
    console.log('[Cache] Miss');
    return null;
  }

  console.log('[Cache] Hit! Using cached data');
  return data;
}

/**
 * Store data in cache
 */
async function storeInCache(supabase, domain, apolloData, dataforseoData, wappalyzerData, totalCost) {
  console.log('[Cache] Storing data for:', domain);

  // Calculate data quality score
  const dataQualityScore = Math.round(
    (apolloData ? 30 : 0) +
    (dataforseoData ? 40 : 0) +
    (wappalyzerData ? 30 : 0)
  );

  const dataSources = [];
  const failedSources = [];

  if (apolloData) dataSources.push('apollo');
  else failedSources.push('apollo');

  if (dataforseoData) dataSources.push('dataforseo');
  else failedSources.push('dataforseo');

  if (wappalyzerData) dataSources.push('wappalyzer');
  else failedSources.push('wappalyzer');

  const { data, error } = await supabase
    .from('business_intelligence_cache')
    .upsert({
      company_domain: domain,
      apollo_data: apolloData,
      dataforseo_data: dataforseoData,
      wappalyzer_data: wappalyzerData,
      data_quality_score: dataQualityScore,
      total_api_cost: totalCost,
      cache_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      data_sources_complete: dataSources,
      data_sources_failed: failedSources,
    }, {
      onConflict: 'company_domain',
    })
    .select()
    .single();

  if (error) {
    console.error('[Cache] Store error:', error);
    throw error;
  }

  console.log('[Cache] Stored successfully');
  return data;
}

/**
 * Detect opportunities from aggregated data
 */
function detectOpportunities(apolloData, dataforseoData, wappalyzerData) {
  const opportunities = [];

  // SEO Opportunities
  if (dataforseoData) {
    if (dataforseoData.organicKeywords < 100) {
      opportunities.push({
        category: 'seo',
        title: 'Low organic keyword rankings',
        description: `Currently ranking for only ${dataforseoData.organicKeywords} organic keywords. Industry leaders typically rank for 1,000+.`,
        evidence: `DataForSEO: ${dataforseoData.organicKeywords} keywords, Traffic Value: $${dataforseoData.estimatedTrafficValue}`,
        impactScore: 9,
        evidenceStrength: 10,
        serviceAlignment: 10,
        quickWin: false,
        currentStateMetric: `${dataforseoData.organicKeywords} organic keywords`,
        potentialImprovementMetric: '500-1,000 keywords in 6 months',
        expectedOutcome: 'Significantly increased organic search visibility and traffic',
        roiPotential: '300-500% increase in organic leads',
        timelineEstimate: '3-6 months',
        budgetRange: '$5,000 - $15,000',
      });
    }

    if (dataforseoData.totalBacklinks < 100) {
      opportunities.push({
        category: 'seo',
        title: 'Weak backlink profile',
        description: `Only ${dataforseoData.totalBacklinks || 0} backlinks detected. Strong domain authority requires 500+ quality backlinks.`,
        evidence: `DataForSEO: ${dataforseoData.totalBacklinks || 0} backlinks, ${dataforseoData.referringDomains || 0} referring domains`,
        impactScore: 8,
        evidenceStrength: 9,
        serviceAlignment: 9,
        quickWin: false,
        currentStateMetric: `${dataforseoData.totalBacklinks || 0} backlinks`,
        potentialImprovementMetric: '200-500 quality backlinks',
        expectedOutcome: 'Improved domain authority and search rankings',
        roiPotential: '200% increase in organic traffic',
        timelineEstimate: '4-8 months',
        budgetRange: '$3,000 - $10,000',
      });
    }
  }

  // Technology Gap Opportunities
  if (wappalyzerData) {
    if (!wappalyzerData.insights.hasMarketingAutomation) {
      opportunities.push({
        category: 'marketing_automation',
        title: 'No marketing automation detected',
        description: 'Missing marketing automation platform. Competitors using HubSpot, Marketo, or ActiveCampaign have 3x higher lead conversion rates.',
        evidence: `Wappalyzer: No marketing automation detected. Missing: ${wappalyzerData.missingTechnologies?.join(', ')}`,
        impactScore: 10,
        evidenceStrength: 10,
        serviceAlignment: 10,
        quickWin: true,
        currentStateMetric: 'No marketing automation',
        potentialImprovementMetric: 'Full marketing automation suite',
        expectedOutcome: 'Automated lead nurturing, scoring, and conversion',
        roiPotential: '250% increase in lead-to-customer conversion',
        timelineEstimate: '1-2 months',
        budgetRange: '$2,000 - $5,000',
      });
    }

    if (!wappalyzerData.insights.hasCRM) {
      opportunities.push({
        category: 'customer_service_ai',
        title: 'No CRM system detected',
        description: 'Missing CRM platform for customer relationship management. Essential for sales pipeline visibility and customer data organization.',
        evidence: 'Wappalyzer: No CRM system detected',
        impactScore: 9,
        evidenceStrength: 10,
        serviceAlignment: 8,
        quickWin: true,
        currentStateMetric: 'No CRM system',
        potentialImprovementMetric: 'Integrated CRM with sales automation',
        expectedOutcome: 'Centralized customer data and improved sales efficiency',
        roiPotential: '150% increase in sales team productivity',
        timelineEstimate: '1-2 months',
        budgetRange: '$1,500 - $4,000',
      });
    }
  }

  // Content Opportunities
  if (apolloData && dataforseoData) {
    if (dataforseoData.organicKeywords > 0 && dataforseoData.organicKeywords < 500) {
      opportunities.push({
        category: 'content',
        title: 'Content gap analysis shows missing topics',
        description: 'Competitors are ranking for hundreds of keywords you\'re not targeting. Strategic content creation can capture this traffic.',
        evidence: `DataForSEO: ${dataforseoData.competitors?.competitors?.length || 0} competitors found with significantly more keyword coverage`,
        impactScore: 8,
        evidenceStrength: 8,
        serviceAlignment: 10,
        quickWin: false,
        currentStateMetric: `${dataforseoData.organicKeywords} keywords covered`,
        potentialImprovementMetric: '300-500 new keyword rankings',
        expectedOutcome: 'Comprehensive content strategy targeting high-value keywords',
        roiPotential: '200% increase in organic traffic',
        timelineEstimate: '3-6 months',
        budgetRange: '$4,000 - $12,000',
      });
    }
  }

  return opportunities;
}

/**
 * Store opportunities in database
 */
async function storeOpportunities(supabase, clientId, opportunities) {
  if (opportunities.length === 0) {
    console.log('[Opportunities] None detected');
    return [];
  }

  console.log('[Opportunities] Storing', opportunities.length, 'opportunities');

  const records = opportunities.map(opp => ({
    client_id: clientId,
    category: opp.category,
    title: opp.title,
    description: opp.description,
    evidence: opp.evidence,
    impact_score: opp.impactScore,
    evidence_strength: opp.evidenceStrength,
    service_alignment: opp.serviceAlignment,
    our_service: getServiceForCategory(opp.category),
    quick_win: opp.quickWin,
    current_state_metric: opp.currentStateMetric,
    potential_improvement_metric: opp.potentialImprovementMetric,
    timeline_estimate: opp.timelineEstimate,
    budget_range: opp.budgetRange,
    expected_outcome: opp.expectedOutcome,
    roi_potential: opp.roiPotential,
    implementation_complexity: opp.quickWin ? 'low' : 'medium',
  }));

  const { data, error } = await supabase
    .from('detected_opportunities')
    .insert(records)
    .select();

  if (error) {
    console.error('[Opportunities] Store error:', error);
    throw error;
  }

  console.log('[Opportunities] Stored successfully');
  return data;
}

/**
 * Map opportunity category to service
 */
function getServiceForCategory(category) {
  const mapping = {
    'seo': 'SEO & Content Strategy',
    'content': 'Content Marketing & SEO',
    'social': 'Social Media Management',
    'website': 'Website Development & Optimization',
    'paid_advertising': 'Paid Advertising Management',
    'marketing_automation': 'Marketing Automation Setup & Management',
    'customer_service_ai': 'AI-Powered Customer Service Solutions',
    'content_generation_ai': 'AI Content Generation Services',
    'process_automation': 'Business Process Automation',
    'analytics_ai': 'AI Analytics & Insights',
    'training': 'AI Training & Implementation',
  };

  return mapping[category] || 'Custom Business Solutions';
}

/**
 * Main handler
 */
export const handler = async (event, context) => {
  console.log('[Business Intelligence] Function invoked');

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST and GET requests
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const supabase = getSupabaseClient();
    const body = event.httpMethod === 'POST' ? JSON.parse(event.body || '{}') : {};
    const { action, domain, clientId, skipCache = false } = body;

    console.log('[Business Intelligence] Action:', action || 'analyze', '| Domain:', domain);

    // Check required parameters
    if (!domain) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'domain is required' }),
      };
    }

    // Check cache first (unless skipCache is true)
    if (!skipCache) {
      const cached = await checkCache(supabase, domain);
      if (cached) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            ...cached,
            cacheHit: true,
            message: 'Data retrieved from cache',
          }),
        };
      }
    }

    const startTime = Date.now();

    // Initialize API clients
    const apolloClient = process.env.APOLLO_API_KEY
      ? new ApolloClient(process.env.APOLLO_API_KEY)
      : null;

    const dataForSEOClient = (process.env.DATAFORSEO_LOGIN && process.env.DATAFORSEO_PASSWORD)
      ? new DataForSEOClient(process.env.DATAFORSEO_LOGIN, process.env.DATAFORSEO_PASSWORD)
      : null;

    const wappalyzerClient = process.env.WAPPALYZER_API_KEY
      ? new WappalyzerClient(process.env.WAPPALYZER_API_KEY)
      : null;

    // Execute all API calls in parallel
    console.log('[Business Intelligence] Executing parallel API calls...');

    const results = await Promise.allSettled([
      apolloClient ? apolloClient.getCompanyData(domain) : Promise.resolve(null),
      dataForSEOClient ? Promise.all([
        dataForSEOClient.getDomainAnalytics(domain),
        dataForSEOClient.getBacklinks(domain, 100),
        dataForSEOClient.getCompetitors(domain, 2840, 10),
      ]).then(([analytics, backlinks, competitors]) => ({
        ...analytics,
        ...backlinks,
        ...competitors,
      })) : Promise.resolve(null),
      wappalyzerClient ? wappalyzerClient.analyzeTechnologyStack(`https://${domain}`) : Promise.resolve(null),
    ]);

    // Extract results
    const apolloData = results[0].status === 'fulfilled' ? results[0].value : null;
    const dataforseoData = results[1].status === 'fulfilled' ? results[1].value : null;
    const wappalyzerData = results[2].status === 'fulfilled' ? results[2].value : null;

    const totalDuration = Date.now() - startTime;
    const totalCost = dataForSEOClient ? dataForSEOClient.getTotalCost() : 0;

    console.log('[Business Intelligence] Analysis complete:', {
      duration: totalDuration + 'ms',
      cost: '$' + totalCost.toFixed(4),
      apollo: apolloData ? '✓' : '✗',
      dataforseo: dataforseoData ? '✓' : '✗',
      wappalyzer: wappalyzerData ? '✓' : '✗',
    });

    // Store in cache
    const cacheData = await storeInCache(supabase, domain, apolloData, dataforseoData, wappalyzerData, totalCost);

    // Detect and store opportunities (if clientId provided)
    let opportunities = [];
    if (clientId) {
      const detectedOpportunities = detectOpportunities(apolloData, dataforseoData, wappalyzerData);
      opportunities = await storeOpportunities(supabase, clientId, detectedOpportunities);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        domain,
        apollo: apolloData,
        dataforseo: dataforseoData,
        wappalyzer: wappalyzerData,
        metadata: {
          totalDuration,
          totalCost,
          successCount: [apolloData, dataforseoData, wappalyzerData].filter(Boolean).length,
          failureCount: 3 - [apolloData, dataforseoData, wappalyzerData].filter(Boolean).length,
          cacheHit: false,
        },
        opportunities: opportunities.length > 0 ? {
          count: opportunities.length,
          critical: opportunities.filter(o => o.priority === 'critical').length,
          high: opportunities.filter(o => o.priority === 'high').length,
          quickWins: opportunities.filter(o => o.quick_win).length,
        } : null,
      }),
    };
  } catch (error) {
    console.error('[Business Intelligence] ERROR:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
