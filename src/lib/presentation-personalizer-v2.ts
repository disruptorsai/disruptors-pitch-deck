/**
 * Presentation Personalizer V2 - Complete AI-Driven Personalization
 *
 * Generates personalized content for ALL presentation slides using
 * comprehensive client intelligence (32 data points)
 */

/**
 * @deprecated This file is deprecated for security reasons
 *
 * ⚠️ SECURITY NOTICE: Direct Anthropic API usage from browser is insecure
 *
 * Use the secure server-side alternative instead:
 * import * as Personalizer from '@/lib/presentation-personalizer-secure';
 *
 * All AI operations now use Netlify Functions to keep API keys secure.
 * See: netlify/functions/presentation-personalizer.js
 */

import type { Client } from './types';

// Anthropic client disabled for security - use Netlify Functions instead
const anthropic = null; // Removed to prevent accidental API key exposure
const MODEL = 'claude-sonnet-4-5-20250929';

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaText: string;
  backgroundStyle: string;
}

export interface BlueprintContent {
  selectedServices: Array<{
    name: string;
    reason: string;
    priority: number;
  }>;
  strategyRationale: string;
  implementationTimeline: Array<{
    phase: string;
    duration: string;
    activities: string[];
  }>;
  expectedOutcomes: string[];
}

export interface DiagnosticContent {
  competitorComparison: Array<{
    name: string;
    strengths: string[];
    weaknesses: string[];
    ourAdvantage: string;
  }>;
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  marketInsights: string;
  aiOpportunities: string[];
}

export interface CapabilitiesContent {
  rankedServices: Array<{
    serviceId: string;
    relevanceScore: number;
    customDescription: string;
    whyRelevant: string;
  }>;
  topRecommendations: string[];
}

export interface CaseStudiesContent {
  relevantCases: Array<{
    caseId: string;
    relevanceScore: number;
    whyThisMatters: string;
  }>;
  industryInsights: string;
  keyMetrics: string[];
}

export interface PricingContent {
  recommendedTier: string;
  rationale: string;
  roiProjection: {
    investment: number;
    projectedReturn: number;
    roi: number;
    paybackMonths: number;
  };
  comparisonText: string;
}

export interface CTAContent {
  headline: string;
  subheadline: string;
  primaryActionText: string;
  secondaryActionText: string;
  urgencyText: string;
  socialProof: string;
}

export interface PersonalizedPresentation {
  hero: HeroContent;
  blueprint: BlueprintContent;
  diagnostic: DiagnosticContent;
  capabilities: CapabilitiesContent;
  caseStudies: CaseStudiesContent;
  pricing: PricingContent;
  cta: CTAContent;
  metadata: {
    generatedAt: string;
    clientName: string;
    industry: string;
    personalizationQuality: 'high' | 'medium' | 'low';
  };
}

// =====================================================
// MAIN PERSONALIZATION FUNCTION
// =====================================================

/**
 * Master function: Generate personalized content for ALL slides
 */
export async function personalizeEntirePresentation(
  client: Client
): Promise<PersonalizedPresentation> {
  console.log('🎨 Generating comprehensive personalization for:', client.name);

  // Check if Anthropic is disabled (for security)
  if (!anthropic) {
    console.warn('⚠️ AI personalization disabled - using fallback content');
    console.warn('  For AI personalization, use server-side Netlify Functions');

    // Return fallback content immediately without trying to call AI
    return {
      hero: {
        headline: `Transform ${client.industry || 'Your Business'} with AI Automation`,
        subheadline: `Discover how ${client.name} can gain a competitive advantage through intelligent systems and strategic automation`,
        ctaText: 'See Your Custom Strategy',
        backgroundStyle: 'default-gradient',
      },
      blueprint: {
        selectedServices: [],
        strategyRationale: 'Custom strategy recommendations available with full AI integration',
        implementationTimeline: [],
        expectedOutcomes: [],
      },
      diagnostic: {
        painPoints: [],
        opportunities: [],
        competitiveThreats: [],
      },
      capabilities: {
        services: [],
        differentiators: [],
      },
      caseStudies: {
        recommendedStudies: [],
        industryInsights: '',
      },
      pricing: {
        recommendedTier: 'custom',
        justification: 'Custom pricing based on your needs',
        estimatedROI: 0,
      },
      cta: {
        primaryMessage: `Ready to Transform ${client.name}?`,
        secondaryMessage: 'Schedule a strategic consultation to discuss your custom solution',
        urgencyMessage: '',
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        clientName: client.name,
        industry: client.industry || 'General',
        personalizationQuality: 'low',
      },
    };
  }

  try {
    // Generate all content in parallel for speed
    const [hero, blueprint, diagnostic, capabilities, caseStudies, pricing, cta] =
      await Promise.all([
        generateHeroContent(client),
        generateBlueprintContent(client),
        generateDiagnosticContent(client),
        generateCapabilitiesContent(client),
        generateCaseStudyContent(client),
        generatePricingContent(client),
        generateCTAContent(client),
      ]);

    return {
      hero,
      blueprint,
      diagnostic,
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
  } catch (error) {
    console.error('Personalization error:', error);
    throw error;
  }
}

// =====================================================
// CONTENT GENERATORS
// =====================================================

/**
 * Generate personalized hero section content
 */
async function generateHeroContent(client: Client): Promise<HeroContent> {
  const prompt = `Create a compelling hero section for "${client.name}" in the ${client.industry || 'business'} industry.

CLIENT INTELLIGENCE:
- Industry: ${client.industry || 'Unknown'}
- Target Market: ${client.target_market || 'Unknown'}
- Top Opportunity: ${client.opportunities?.[0] || 'AI automation'}
- Competitors: ${client.potential_competitors?.slice(0, 3).join(', ') || 'Unknown'}
- Company Size: ${client.company_size || 'Unknown'}

Generate a hero section that:
1. **Headline**: Industry-specific hook (10-15 words) that directly addresses their #1 opportunity with urgency
2. **Subheadline**: Value proposition for their target market (20-30 words) that mentions competitive advantage
3. **CTA Text**: Action-oriented button text (3-5 words) that's specific to their industry
4. **Background Style**: Suggest visual style based on industry (tech-modern, healthcare-trust, ecommerce-energy, etc.)

Return ONLY valid JSON:
{
  "headline": "Transform Healthcare Operations with AI-Powered Patient Engagement",
  "subheadline": "Help mid-market healthcare providers reduce administrative overhead by 40% while improving patient satisfaction—before your competitors automate their workflows",
  "ctaText": "See Your Healthcare Strategy",
  "backgroundStyle": "healthcare-trust"
}`;

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const response = message.content[0];
    if (response.type === 'text') {
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Hero content generation error:', error);
    // Fallback
    return {
      headline: `Transform ${client.industry || 'Your Business'} with AI Automation`,
      subheadline: `Discover how ${client.name} can gain a competitive advantage through intelligent systems and strategic automation`,
      ctaText: 'See Your Custom Strategy',
      backgroundStyle: 'default-gradient',
    };
  }
}

/**
 * Generate AI-driven service recommendations and blueprint
 */
async function generateBlueprintContent(client: Client): Promise<BlueprintContent> {
  const prompt = `Create a customized service recommendation blueprint for "${client.name}".

CLIENT INTELLIGENCE:
- Industry: ${client.industry || 'Unknown'}
- Website Quality: ${client.website_quality || 7}/10
- Has Blog: ${client.has_blog || false}
- SEO Status: ${client.seo_indicators || 'Unknown'}
- Technologies: ${client.technologies_detected?.join(', ') || 'Unknown'}
- Opportunities: ${client.opportunities?.join('; ') || 'Unknown'}
- Company Size: ${client.company_size || 'Unknown'}

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
  "strategyRationale": "This combination addresses your immediate gaps (poor SEO) while building long-term growth engines (content marketing). The fractional CMO ties everything together with strategic oversight.",
  "implementationTimeline": [
    {
      "phase": "Days 1-30: Foundation",
      "duration": "4 weeks",
      "activities": ["SEO audit and fix critical issues", "Content strategy planning", "Analytics setup"]
    }
  ],
  "expectedOutcomes": ["40% increase in organic traffic", "25% reduction in customer acquisition cost", "Improved competitive positioning"]
}`;

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const response = message.content[0];
    if (response.type === 'text') {
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Blueprint content generation error:', error);
    // Fallback
    return {
      selectedServices: [
        {
          name: 'Marketing Automation',
          reason: 'Streamline your marketing processes and improve efficiency',
          priority: 1,
        },
        {
          name: 'Lead Generation',
          reason: 'Build a consistent pipeline of qualified prospects',
          priority: 2,
        },
        {
          name: 'Content Marketing',
          reason: 'Establish thought leadership and attract organic traffic',
          priority: 3,
        },
      ],
      strategyRationale: `This combination creates a powerful growth engine for ${client.name}, addressing immediate needs while building long-term competitive advantages.`,
      implementationTimeline: [
        {
          phase: 'Days 1-30: Foundation',
          duration: '4 weeks',
          activities: ['Discovery and audit', 'Strategy development', 'Quick wins implementation'],
        },
        {
          phase: 'Days 31-60: Build & Launch',
          duration: '4 weeks',
          activities: ['Core systems implementation', 'Content creation', 'Campaign launch'],
        },
        {
          phase: 'Days 61-90: Optimize & Scale',
          duration: '4 weeks',
          activities: ['Performance optimization', 'Scale successful campaigns', 'Reporting and refinement'],
        },
      ],
      expectedOutcomes: [
        'Measurable improvement in lead quality and quantity',
        'Reduced manual workload through automation',
        'Stronger market positioning',
      ],
    };
  }
}

/**
 * Generate competitive diagnostic content
 */
async function generateDiagnosticContent(client: Client): Promise<DiagnosticContent> {
  const prompt = `Analyze the competitive landscape for "${client.name}" in ${client.industry || 'their industry'}.

CLIENT INTELLIGENCE:
- Industry: ${client.industry || 'Unknown'}
- Competitors: ${client.potential_competitors?.join(', ') || 'Unknown'}
- Their Strengths: ${client.strengths?.join('; ') || 'Unknown'}
- Competitive Advantages: ${client.competitive_advantages?.join('; ') || 'Unknown'}
- Opportunities: ${client.opportunities?.join('; ') || 'Unknown'}
- Market Position: ${client.market_position || 'Unknown'}

Create a comprehensive competitive analysis:
1. Detailed competitor comparison (strengths, weaknesses, how we can help)
2. SWOT analysis specific to their business
3. Market insights for their industry
4. AI-driven opportunities to outperform competitors

Return ONLY valid JSON with this structure:
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
  "marketInsights": "The industry is shifting toward automation, with early adopters gaining 30-40% efficiency improvements",
  "aiOpportunities": ["Automate repetitive tasks to match competitor efficiency", "AI-powered customer service to exceed industry standards"]
}`;

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const response = message.content[0];
    if (response.type === 'text') {
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Diagnostic content generation error:', error);
    // Fallback
    return {
      competitorComparison: client.potential_competitors?.slice(0, 3).map(comp => ({
        name: comp,
        strengths: ['Market presence', 'Brand recognition'],
        weaknesses: ['Limited innovation', 'Slower adaptation'],
        ourAdvantage: `AI automation can help you match their strengths while being more agile`,
      })) || [],
      swotAnalysis: {
        strengths: client.strengths || ['Strong client relationships', 'Quality service delivery'],
        weaknesses: client.opportunities?.map(o => `Gap: ${o}`) || ['Manual processes', 'Limited scalability'],
        opportunities: ['AI automation adoption', 'Process optimization', 'Market expansion'],
        threats: ['Competitors adopting AI faster', 'Market commoditization'],
      },
      marketInsights: `The ${client.industry || 'industry'} sector is experiencing rapid digital transformation, with AI-driven companies gaining significant competitive advantages.`,
      aiOpportunities: [
        'Automate repetitive tasks to reduce operational costs',
        'Implement AI-driven analytics for better decision making',
        'Enhance customer experience with intelligent automation',
      ],
    };
  }
}

/**
 * Generate capabilities recommendations
 */
async function generateCapabilitiesContent(client: Client): Promise<CapabilitiesContent> {
  const prompt = `Rank and customize service descriptions for "${client.name}".

CLIENT INTELLIGENCE:
- Industry: ${client.industry || 'Unknown'}
- Technologies: ${client.technologies_detected?.join(', ') || 'Unknown'}
- Services They Offer: ${client.services?.join(', ') || 'Unknown'}
- Opportunities: ${client.opportunities?.join('; ') || 'Unknown'}

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
  "topRecommendations": ["Start with SEO to fix immediate visibility issues", "Add content marketing to build long-term authority"]
}`;

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1536,
      messages: [{ role: 'user', content: prompt }],
    });

    const response = message.content[0];
    if (response.type === 'text') {
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Capabilities content generation error:', error);
    // Fallback
    return {
      rankedServices: [],
      topRecommendations: [
        'Focus on high-impact services first',
        'Build a strong foundation before scaling',
        'Measure and optimize continuously',
      ],
    };
  }
}

/**
 * Generate case study recommendations
 */
async function generateCaseStudyContent(client: Client): Promise<CaseStudiesContent> {
  const prompt = `Recommend which case studies to show "${client.name}" in the ${client.industry || 'business'} industry.

CLIENT INTELLIGENCE:
- Industry: ${client.industry || 'Unknown'}
- Sub-Industry: ${client.sub_industry || 'General'}
- Company Size: ${client.company_size || 'Unknown'}
- Opportunities: ${client.opportunities?.join('; ') || 'Unknown'}
- Services They Offer: ${client.services?.join(', ') || 'Unknown'}

Provide guidance on:
1. Which industries' case studies would be most relevant (their industry + related industries)
2. Industry-specific insights to highlight
3. Key metrics that matter most to this type of business

Return ONLY valid JSON:
{
  "relevantCases": [
    {
      "caseId": "healthcare-automation",
      "relevanceScore": 0.95,
      "whyThisMatters": "Like this provider, you're in healthcare facing similar admin overhead challenges"
    }
  ],
  "industryInsights": "Healthcare providers who implement AI automation typically see 30-50% reduction in admin time",
  "keyMetrics": ["Time saved", "Cost reduction", "Patient satisfaction improvement"]
}`;

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1536,
      messages: [{ role: 'user', content: prompt }],
    });

    const response = message.content[0];
    if (response.type === 'text') {
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Case study content generation error:', error);
    // Fallback
    return {
      relevantCases: [],
      industryInsights: `Companies in the ${client.industry || 'business'} sector typically see significant ROI from AI automation investments.`,
      keyMetrics: ['ROI', 'Time Saved', 'Cost Reduction', 'Revenue Growth'],
    };
  }
}

/**
 * Generate pricing recommendations
 */
async function generatePricingContent(client: Client): Promise<PricingContent> {
  const prompt = `Recommend pricing tier for "${client.name}".

CLIENT INTELLIGENCE:
- Industry: ${client.industry || 'Unknown'}
- Company Size: ${client.company_size || 'Unknown'}
- Website Quality: ${client.website_quality || 7}/10
- Technologies: ${client.technologies_detected?.join(', ') || 'Unknown'}
- Opportunities: ${client.opportunities?.join('; ') || 'Unknown'}

AVAILABLE TIERS:
- Starter: $2,500-5,000/month (1-10 employees, basic needs)
- Growth: $5,000-15,000/month (10-100 employees, scaling businesses)
- Enterprise: $15,000+/month (100+ employees, complex needs)

Based on their size and complexity:
1. Recommend the most appropriate tier
2. Explain why this tier fits
3. Calculate industry-specific ROI (use industry multipliers: SaaS 3.5x, E-commerce 2.8x, Healthcare 2.2x, Consulting 4.0x, Other 2.5x)
4. Provide comparison text

Return ONLY valid JSON:
{
  "recommendedTier": "Growth",
  "rationale": "Your team size (50 employees) and medium complexity fit the Growth tier perfectly",
  "roiProjection": {
    "investment": 120000,
    "projectedReturn": 264000,
    "roi": 120,
    "paybackMonths": 5
  },
  "comparisonText": "Companies like yours in healthcare typically invest $5k-10k/month and see 2.2x ROI"
}`;

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const response = message.content[0];
    if (response.type === 'text') {
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Pricing content generation error:', error);
    // Fallback
    return {
      recommendedTier: 'Growth',
      rationale: `Based on your business size and needs, the Growth tier provides the best balance of features and value.`,
      roiProjection: {
        investment: 96000,
        projectedReturn: 240000,
        roi: 150,
        paybackMonths: 6,
      },
      comparisonText: `Companies similar to ${client.name} typically see strong returns on marketing automation investments.`,
    };
  }
}

/**
 * Generate call-to-action content
 */
async function generateCTAContent(client: Client): Promise<CTAContent> {
  const prompt = `Create a compelling call-to-action for "${client.name}".

CLIENT INTELLIGENCE:
- Industry: ${client.industry || 'Unknown'}
- Top Opportunity: ${client.opportunities?.[0] || 'AI automation'}
- Competitors: ${client.potential_competitors?.slice(0, 2).join(' and ') || 'your competitors'}
- Company Size: ${client.company_size || 'Unknown'}

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
  "subheadline": "Schedule a strategy call to discover how AI can reduce your admin overhead by 40%—before your competitors automate their workflows",
  "primaryActionText": "Schedule Strategy Call",
  "secondaryActionText": "Download Case Studies",
  "urgencyText": "Book this week to receive a complimentary workflow audit ($2,500 value)",
  "socialProof": "Healthcare providers like you have reduced admin time by 60% in just 90 days"
}`;

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const response = message.content[0];
    if (response.type === 'text') {
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('CTA content generation error:', error);
    // Fallback
    return {
      headline: `Ready to Transform ${client.name}?`,
      subheadline: `Schedule a strategy call to discover how AI automation can address your ${client.opportunities?.[0] || 'business challenges'}`,
      primaryActionText: 'Schedule a Call',
      secondaryActionText: 'View Case Studies',
      urgencyText: `Don't let ${client.potential_competitors?.[0] || 'competitors'} get ahead with AI automation`,
      socialProof: `Companies in ${client.industry || 'your industry'} are seeing dramatic improvements with AI-powered solutions`,
    };
  }
}
