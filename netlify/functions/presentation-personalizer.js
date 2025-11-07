/**
 * Netlify Function: Presentation Personalizer
 *
 * Server-side AI personalization using Claude Sonnet 4.5
 * Keeps ANTHROPIC_API_KEY secure on the server
 *
 * Actions:
 * - generateHero: Hero section personalization
 * - generateIntro: Introduction content
 * - generateDiagnostic: Competitive analysis
 * - generateBlueprint: Custom strategy & service recommendations
 * - generateCapabilities: Ranked service recommendations
 * - generateCaseStudies: Case study filtering & relevance
 * - generatePricing: Pricing tier recommendations with ROI
 * - generateCTA: Call-to-action personalization
 * - generateEntirePresentation: All sections in parallel (recommended)
 */

import Anthropic from '@anthropic-ai/sdk';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const MODEL = 'claude-sonnet-4-5-20250929';

// Initialize Anthropic client
const getAnthropicClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured in Netlify environment variables');
  }

  return new Anthropic({ apiKey });
};

/**
 * Parse JSON from Claude's response
 */
function parseAIResponse(content) {
  if (content.type === 'text') {
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  }
  throw new Error('Failed to parse AI response - no valid JSON found');
}

/**
 * Generate personalized hero section content
 */
async function generateHeroContent(client) {
  const anthropic = getAnthropicClient();

  const prompt = `Create a compelling hero section for "${client.name}" in the ${client.industry || 'business'} industry.

CLIENT INTELLIGENCE:
${JSON.stringify({
  industry: client.industry,
  subIndustry: client.sub_industry,
  targetMarket: client.target_market,
  topOpportunity: client.opportunities?.[0],
  competitors: client.potential_competitors?.slice(0, 3),
  companySize: client.company_size,
  services: client.services,
}, null, 2)}

Generate a hero section that:
1. **Headline**: Industry-specific hook (10-15 words) that directly addresses their #1 opportunity with urgency
2. **Subheadline**: Value proposition for their target market (20-30 words) that mentions competitive advantage
3. **CTA Text**: Action-oriented button text (3-5 words) that's specific to their industry

Return ONLY valid JSON:
{
  "headline": "Transform Healthcare Operations with AI-Powered Patient Engagement",
  "subheadline": "Help mid-market healthcare providers reduce administrative overhead by 40% while improving patient satisfaction—before your competitors automate their workflows",
  "ctaText": "See Your Healthcare Strategy"
}`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  return parseAIResponse(message.content[0]);
}

/**
 * Generate personalized introduction content
 */
async function generateIntroContent(client) {
  const anthropic = getAnthropicClient();

  const prompt = `You are creating a highly personalized AI presentation introduction for "${client.name}".

CLIENT INTELLIGENCE:
${JSON.stringify({
  name: client.name,
  industry: client.industry,
  subIndustry: client.sub_industry,
  services: client.services,
  competitiveAdvantages: client.competitive_advantages,
  potentialCompetitors: client.potential_competitors,
  opportunities: client.opportunities,
  marketPosition: client.market_position,
}, null, 2)}

Create a compelling introduction that:
1. **Headline**: A powerful, industry-specific hook (8-12 words max) that shows you understand their business
2. **Subheadline**: Specific value proposition (15-20 words) tailored to their market position
3. **Opening Statement**: A personalized 2-3 sentence opener that demonstrates deep understanding of their business

Be SPECIFIC - use their actual industry, competitors, and opportunities. Don't be generic.

Return ONLY valid JSON:
{
  "headline": "Industry-Specific Headline Here",
  "subheadline": "Personalized Value Prop Here",
  "openingStatement": "Deep, personalized opening that shows real understanding..."
}`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  return parseAIResponse(message.content[0]);
}

/**
 * Generate competitive diagnostic content
 */
async function generateDiagnosticContent(client) {
  const anthropic = getAnthropicClient();

  const prompt = `Analyze the competitive landscape for "${client.name}" in ${client.industry || 'their industry'}.

CLIENT INTELLIGENCE:
${JSON.stringify({
  industry: client.industry,
  competitors: client.potential_competitors,
  strengths: client.strengths,
  competitiveAdvantages: client.competitive_advantages,
  opportunities: client.opportunities,
  marketPosition: client.market_position,
  websiteQuality: client.website_quality,
  seoIndicators: client.seo_indicators,
}, null, 2)}

Create a comprehensive competitive analysis:
1. Detailed competitor comparison (strengths, weaknesses, how we can help)
2. SWOT analysis specific to their business
3. Market insights for their industry
4. AI-driven opportunities to outperform competitors

Return ONLY valid JSON:
{
  "competitorComparison": [
    {
      "name": "Competitor A",
      "strengths": ["Strong SEO", "Large social following"],
      "weaknesses": ["Poor customer service", "Outdated tech"],
      "ourAdvantage": "AI can help you match their SEO while exceeding their service quality"
    }
  ],
  "swotAnalysis": {
    "strengths": ["Strength 1", "Strength 2"],
    "weaknesses": ["Weakness 1", "Weakness 2"],
    "opportunities": ["Opportunity 1", "Opportunity 2"],
    "threats": ["Threat 1", "Threat 2"]
  },
  "marketInsights": "The industry is shifting toward automation...",
  "aiOpportunities": ["Automate X", "AI-powered Y"]
}`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  return parseAIResponse(message.content[0]);
}

/**
 * Generate AI-driven service recommendations and blueprint
 */
async function generateBlueprintContent(client) {
  const anthropic = getAnthropicClient();

  const prompt = `Create a customized service recommendation blueprint for "${client.name}".

CLIENT INTELLIGENCE:
${JSON.stringify({
  industry: client.industry,
  websiteQuality: client.website_quality,
  hasBlog: client.has_blog,
  seoIndicators: client.seo_indicators,
  technologies: client.technologies_detected,
  opportunities: client.opportunities,
  companySize: client.company_size,
  services: client.services,
}, null, 2)}

AVAILABLE SERVICES (select 3-5 most relevant):
- Lead Generation & Nurturing
- Paid Advertising (Google Ads, Meta)
- SEO & Local SEO (GEO)
- Content Marketing & Blog Strategy
- Website Design & Development
- Marketing Automation
- Email Marketing Campaigns
- Social Media Management
- Fractional CMO Services
- Analytics & Conversion Optimization

Based on their data:
1. Select 3-5 services that address their specific opportunities and gaps
2. Explain WHY each service is critical for them
3. Create a 30/60/90 day implementation timeline
4. List expected outcomes

Return ONLY valid JSON:
{
  "selectedServices": [
    {
      "name": "SEO & Local SEO",
      "reason": "Website quality score of 4/10 and poor SEO indicators mean you're losing organic traffic to competitors",
      "priority": 1
    }
  ],
  "strategyRationale": "This combination addresses your immediate gaps...",
  "implementationTimeline": [
    {
      "phase": "Days 1-30: Foundation",
      "duration": "4 weeks",
      "activities": ["SEO audit", "Content strategy", "Analytics setup"]
    }
  ],
  "expectedOutcomes": ["40% increase in organic traffic", "25% reduction in CAC"]
}`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  return parseAIResponse(message.content[0]);
}

/**
 * Generate capabilities recommendations
 */
async function generateCapabilitiesContent(client) {
  const anthropic = getAnthropicClient();

  const prompt = `Rank and customize service descriptions for "${client.name}".

CLIENT INTELLIGENCE:
${JSON.stringify({
  industry: client.industry,
  technologies: client.technologies_detected,
  servicesOffered: client.services,
  opportunities: client.opportunities,
}, null, 2)}

For each service category, determine relevance (0-1 score) and customize the description:
1. How relevant is this service to their specific needs?
2. Customize the description to mention their tech stack or opportunities
3. Explain why it's relevant (or not)

Return ONLY valid JSON:
{
  "rankedServices": [
    {
      "serviceId": "seo",
      "relevanceScore": 0.9,
      "customDescription": "SEO optimized for healthcare providers using WordPress",
      "whyRelevant": "Your WordPress site needs SEO improvement based on your indicators"
    }
  ],
  "topRecommendations": ["Start with SEO to fix immediate visibility issues"]
}`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1536,
    messages: [{ role: 'user', content: prompt }],
  });

  return parseAIResponse(message.content[0]);
}

/**
 * Generate case study recommendations
 */
async function generateCaseStudyContent(client) {
  const anthropic = getAnthropicClient();

  const prompt = `Recommend which case studies to show "${client.name}" in the ${client.industry || 'business'} industry.

CLIENT INTELLIGENCE:
${JSON.stringify({
  industry: client.industry,
  subIndustry: client.sub_industry,
  companySize: client.company_size,
  opportunities: client.opportunities,
  services: client.services,
}, null, 2)}

Provide guidance on:
1. Which industries' case studies would be most relevant
2. Industry-specific insights to highlight
3. Key metrics that matter most to this type of business

Return ONLY valid JSON:
{
  "relevantCases": [
    {
      "caseId": "healthcare-automation",
      "relevanceScore": 0.95,
      "whyThisMatters": "Like this provider, you're in healthcare facing similar challenges"
    }
  ],
  "industryInsights": "Healthcare providers who implement AI automation typically see 30-50% reduction in admin time",
  "keyMetrics": ["Time saved", "Cost reduction", "Patient satisfaction"]
}`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1536,
    messages: [{ role: 'user', content: prompt }],
  });

  return parseAIResponse(message.content[0]);
}

/**
 * Generate pricing recommendations
 */
async function generatePricingContent(client) {
  const anthropic = getAnthropicClient();

  const prompt = `Recommend pricing tier for "${client.name}".

CLIENT INTELLIGENCE:
${JSON.stringify({
  industry: client.industry,
  companySize: client.company_size,
  websiteQuality: client.website_quality,
  technologies: client.technologies_detected,
  opportunities: client.opportunities,
}, null, 2)}

AVAILABLE TIERS:
- Starter: $2,500-5,000/month (1-10 employees, basic needs)
- Growth: $5,000-15,000/month (10-100 employees, scaling businesses)
- Enterprise: $15,000+/month (100+ employees, complex needs)

Based on their size and complexity:
1. Recommend the most appropriate tier
2. Explain why this tier fits
3. Calculate industry-specific ROI
4. Provide comparison text

Return ONLY valid JSON:
{
  "recommendedTier": "Growth",
  "rationale": "Your team size (50 employees) fits the Growth tier perfectly",
  "roiProjection": {
    "investment": 120000,
    "projectedReturn": 264000,
    "roi": 120,
    "paybackMonths": 5
  },
  "comparisonText": "Companies like yours typically invest $5k-10k/month and see 2.2x ROI"
}`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  return parseAIResponse(message.content[0]);
}

/**
 * Generate call-to-action content
 */
async function generateCTAContent(client) {
  const anthropic = getAnthropicClient();

  const prompt = `Create a compelling call-to-action for "${client.name}".

CLIENT INTELLIGENCE:
${JSON.stringify({
  industry: client.industry,
  topOpportunity: client.opportunities?.[0],
  competitors: client.potential_competitors?.slice(0, 2),
  companySize: client.company_size,
}, null, 2)}

Create a CTA that:
1. **Headline**: Personalized, action-oriented (8-12 words)
2. **Subheadline**: Creates urgency by referencing their opportunity and competitors (20-30 words)
3. **Primary Action**: Main CTA button text (3-5 words)
4. **Secondary Action**: Alternative action (3-5 words)
5. **Urgency Text**: Time/competitive urgency (15-20 words)
6. **Social Proof**: Industry-specific testimonial snippet (20-30 words)

Return ONLY valid JSON:
{
  "headline": "Ready to Transform Healthcare Operations at Acme Health?",
  "subheadline": "Schedule a strategy call to discover how AI can reduce your admin overhead by 40%",
  "primaryActionText": "Schedule Strategy Call",
  "secondaryActionText": "Download Case Studies",
  "urgencyText": "Book this week to receive a complimentary workflow audit ($2,500 value)",
  "socialProof": "Healthcare providers like you have reduced admin time by 60% in just 90 days"
}`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  return parseAIResponse(message.content[0]);
}

/**
 * Generate entire presentation (all sections in parallel)
 */
async function generateEntirePresentation(client) {
  console.log('[Presentation Personalizer] Generating entire presentation for:', client.name);

  // Generate all sections in parallel for speed
  const [hero, intro, diagnostic, blueprint, capabilities, caseStudies, pricing, cta] =
    await Promise.all([
      generateHeroContent(client),
      generateIntroContent(client),
      generateDiagnosticContent(client),
      generateBlueprintContent(client),
      generateCapabilitiesContent(client),
      generateCaseStudyContent(client),
      generatePricingContent(client),
      generateCTAContent(client),
    ]);

  return {
    hero,
    intro,
    diagnostic,
    blueprint,
    capabilities,
    caseStudies,
    pricing,
    cta,
    metadata: {
      generatedAt: new Date().toISOString(),
      clientName: client.name,
      industry: client.industry || 'Unknown',
      personalizationQuality: client.full_description ? 'high' : 'medium',
    },
  };
}

/**
 * Main handler
 */
export const handler = async (event, context) => {
  console.log('[Presentation Personalizer] Function invoked');

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { action, payload } = JSON.parse(event.body || '{}');
    console.log('[Presentation Personalizer] Action:', action);

    // Check API key configuration
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[Presentation Personalizer] ANTHROPIC_API_KEY not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Server configuration error',
          message: 'ANTHROPIC_API_KEY not configured in Netlify environment variables',
        }),
      };
    }

    const { client } = payload || {};

    if (!client || !client.name) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid request',
          message: 'payload.client is required with at least a name field',
        }),
      };
    }

    let result;

    switch (action) {
      case 'generateHero':
        result = await generateHeroContent(client);
        break;

      case 'generateIntro':
        result = await generateIntroContent(client);
        break;

      case 'generateDiagnostic':
        result = await generateDiagnosticContent(client);
        break;

      case 'generateBlueprint':
        result = await generateBlueprintContent(client);
        break;

      case 'generateCapabilities':
        result = await generateCapabilitiesContent(client);
        break;

      case 'generateCaseStudies':
        result = await generateCaseStudyContent(client);
        break;

      case 'generatePricing':
        result = await generatePricingContent(client);
        break;

      case 'generateCTA':
        result = await generateCTAContent(client);
        break;

      case 'generateEntirePresentation':
        result = await generateEntirePresentation(client);
        break;

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: 'Invalid action',
            availableActions: [
              'generateHero',
              'generateIntro',
              'generateDiagnostic',
              'generateBlueprint',
              'generateCapabilities',
              'generateCaseStudies',
              'generatePricing',
              'generateCTA',
              'generateEntirePresentation',
            ],
          }),
        };
    }

    console.log('[Presentation Personalizer] Success:', action);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('[Presentation Personalizer] ERROR:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }),
    };
  }
};
