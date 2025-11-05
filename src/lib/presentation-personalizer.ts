/**
 * @deprecated This file is deprecated for security reasons
 *
 * ⚠️ SECURITY NOTICE: Direct Anthropic API usage from browser is insecure
 *
 * Use the secure server-side alternative instead:
 * import { personalizeHero } from '@/lib/presentation-personalizer-secure';
 *
 * All AI operations now use Netlify Functions to keep API keys secure.
 * See: netlify/functions/presentation-personalizer.js
 */

// Anthropic client disabled for security - use Netlify Functions instead
const anthropic = null; // Removed to prevent accidental API key exposure

export interface ClientIntelligence {
  // Basic Info
  name: string;
  description?: string;
  fullDescription?: string;
  industry?: string;
  subIndustry?: string;
  foundedYear?: string;
  companySize?: string;
  website?: string;

  // Services & Market
  services?: string[];
  keyFeatures?: string[];
  targetMarket?: string;

  // Tech Stack
  technologiesDetected?: string[];
  cms?: string;

  // Competitive Intelligence
  marketPosition?: string;
  competitiveAdvantages?: string[];
  potentialCompetitors?: string[];

  // Business Insights
  strengths?: string[];
  opportunities?: string[];
  websiteQuality?: number;
  seoIndicators?: string;

  // Additional
  certifications?: string[];
  partnerships?: string[];
  hasCaseStudies?: boolean;
  hasBlog?: boolean;

  // Branding
  brandTone?: string;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
}

/**
 * Generate a personalized introduction slide headline and subheadline
 */
export async function generateIntroContent(client: ClientIntelligence): Promise<{
  headline: string;
  subheadline: string;
  openingStatement: string;
}> {
  const prompt = `You are creating a highly personalized AI presentation introduction for "${client.name}".

CLIENT INTELLIGENCE:
${JSON.stringify(client, null, 2)}

Create a compelling introduction that:
1. **Headline**: A powerful, industry-specific hook (8-12 words max) that shows you understand their business. Reference their industry, pain points, or opportunities.
2. **Subheadline**: Specific value proposition (15-20 words) tailored to their tech stack, market position, or identified opportunities.
3. **Opening Statement**: A personalized 2-3 sentence opener that demonstrates deep understanding of their business, mentions specific competitors or technologies they use, and positions AI as the solution to their identified opportunities.

Be SPECIFIC - use their actual industry, competitors, and opportunities. Don't be generic.

Return ONLY valid JSON:
{
  "headline": "Industry-Specific Headline Here",
  "subheadline": "Personalized Value Prop Here",
  "openingStatement": "Deep, personalized opening that shows real understanding..."
}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
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
    console.error('Intro generation error:', error);
    // Fallback to generic intro
    return {
      headline: `Transform ${client.name} with AI Automation`,
      subheadline: `Discover how intelligent automation can revolutionize your ${client.industry || 'business'} operations`,
      openingStatement: `${client.name} operates in a competitive ${client.industry || 'market'}. Our AI-powered solutions help businesses like yours gain a strategic advantage through intelligent automation and data-driven insights.`,
    };
  }
}

/**
 * Generate personalized competitive analysis insights
 */
export async function generateCompetitiveInsights(client: ClientIntelligence): Promise<{
  competitorAnalysis: string;
  competitiveOpportunities: string[];
  differentiationStrategy: string;
}> {
  const prompt = `You are analyzing the competitive landscape for "${client.name}" in the ${client.industry || 'business'} industry.

CLIENT INTELLIGENCE:
- Industry: ${client.industry}
- Competitors: ${client.potentialCompetitors?.join(', ') || 'Unknown'}
- Current Strengths: ${client.strengths?.join(', ') || 'Unknown'}
- Competitive Advantages: ${client.competitiveAdvantages?.join(', ') || 'Unknown'}
- Identified Opportunities: ${client.opportunities?.join(', ') || 'Unknown'}
- Market Position: ${client.marketPosition || 'Unknown'}

Create a competitive analysis that:
1. **Competitor Analysis**: 2-3 sentences analyzing their competitive landscape with SPECIFIC references to their competitors
2. **Competitive Opportunities**: List 3-5 specific AI-driven opportunities that directly address their weaknesses vs. competitors
3. **Differentiation Strategy**: 2-3 sentences on how AI can help them stand out from specific competitors

Be SPECIFIC - use actual competitor names and technologies.

Return ONLY valid JSON:
{
  "competitorAnalysis": "Detailed analysis...",
  "competitiveOpportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3"],
  "differentiationStrategy": "Strategy explanation..."
}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
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
    console.error('Competitive insights error:', error);
    return {
      competitorAnalysis: `${client.name} operates in the ${client.industry || 'business'} sector with several key competitors. Standing out requires strategic differentiation through technology and innovation.`,
      competitiveOpportunities: [
        'Automate manual processes to reduce operational costs',
        'Implement AI-driven analytics for better decision making',
        'Enhance customer experience with intelligent automation',
      ],
      differentiationStrategy: 'By leveraging AI automation, you can deliver faster, more accurate services while reducing costs - creating a sustainable competitive advantage.',
    };
  }
}

/**
 * Generate industry-specific case study recommendations
 */
export async function generateCaseStudyRecommendations(client: ClientIntelligence): Promise<{
  relevantIndustries: string[];
  keyMetricsToHighlight: string[];
  industrySpecificChallenges: string[];
}> {
  const prompt = `You are recommending which case studies to show "${client.name}" in the ${client.industry || 'business'} industry.

CLIENT INTELLIGENCE:
- Industry: ${client.industry}
- Sub-Industry: ${client.subIndustry || 'General'}
- Services They Offer: ${client.services?.join(', ') || 'Unknown'}
- Their Challenges/Opportunities: ${client.opportunities?.join(', ') || 'Unknown'}
- Technologies They Use: ${client.technologiesDetected?.join(', ') || 'Unknown'}

Recommend:
1. **Relevant Industries**: List 3-5 industries whose case studies would be most relevant (their industry + related industries)
2. **Key Metrics to Highlight**: What ROI metrics matter most to this type of business? (e.g., "time saved", "cost reduction", "revenue increase")
3. **Industry-Specific Challenges**: List 3-5 challenges common in their industry that case studies should address

Return ONLY valid JSON:
{
  "relevantIndustries": ["Industry 1", "Industry 2", "Industry 3"],
  "keyMetricsToHighlight": ["Metric 1", "Metric 2", "Metric 3"],
  "industrySpecificChallenges": ["Challenge 1", "Challenge 2", "Challenge 3"]
}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
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
    console.error('Case study recommendations error:', error);
    return {
      relevantIndustries: [client.industry || 'Business Services', 'Technology', 'Professional Services'],
      keyMetricsToHighlight: ['ROI', 'Time Saved', 'Cost Reduction', 'Revenue Growth'],
      industrySpecificChallenges: [
        'Manual process inefficiencies',
        'Data silos and integration challenges',
        'Scaling operations cost-effectively',
      ],
    };
  }
}

/**
 * Generate personalized opportunity-focused messaging
 */
export async function generateOpportunityMessaging(client: ClientIntelligence): Promise<{
  primaryOpportunity: string;
  opportunityDescription: string;
  implementationStrategy: string;
  expectedImpact: string;
}> {
  const prompt = `You are identifying the #1 AI opportunity for "${client.name}".

CLIENT INTELLIGENCE:
- Industry: ${client.industry}
- Services: ${client.services?.join(', ') || 'Unknown'}
- Identified Opportunities: ${client.opportunities?.join(', ') || 'Unknown'}
- Current Strengths: ${client.strengths?.join(', ') || 'Unknown'}
- Technologies: ${client.technologiesDetected?.join(', ') || 'Unknown'}
- Website Quality: ${client.websiteQuality}/10

Identify their SINGLE biggest opportunity for AI implementation:
1. **Primary Opportunity**: One-line description of the #1 opportunity (10-15 words)
2. **Opportunity Description**: 2-3 sentences explaining WHY this is their biggest opportunity
3. **Implementation Strategy**: 2-3 sentences on HOW to implement AI for this opportunity
4. **Expected Impact**: Quantify the potential impact with specific metrics

Be SPECIFIC to their business model and industry.

Return ONLY valid JSON:
{
  "primaryOpportunity": "One-line opportunity",
  "opportunityDescription": "Why this matters...",
  "implementationStrategy": "How to do it...",
  "expectedImpact": "Expected results..."
}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
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
    console.error('Opportunity messaging error:', error);
    return {
      primaryOpportunity: `Automate core ${client.industry || 'business'} processes with AI`,
      opportunityDescription: `${client.name} can significantly reduce operational overhead and improve service quality by implementing intelligent automation in key workflows.`,
      implementationStrategy: 'Start with high-volume, repetitive tasks that currently require manual intervention. Deploy AI agents to handle these processes autonomously while maintaining human oversight for edge cases.',
      expectedImpact: 'Potential 40-60% reduction in processing time, 30-50% cost savings, and improved accuracy rates to 95%+ through consistent AI-driven execution.',
    };
  }
}

/**
 * Master function to generate all personalized content for a client
 */
export async function personalizeEntirePresentation(client: ClientIntelligence) {
  console.log('🎨 Personalizing presentation for:', client.name);

  try {
    // Generate all personalized content in parallel for speed
    const [intro, competitive, caseStudyRecs, opportunity] = await Promise.all([
      generateIntroContent(client),
      generateCompetitiveInsights(client),
      generateCaseStudyRecommendations(client),
      generateOpportunityMessaging(client),
    ]);

    return {
      intro,
      competitive,
      caseStudyRecs,
      opportunity,
      metadata: {
        generatedAt: new Date().toISOString(),
        clientName: client.name,
        industry: client.industry,
        personalizationQuality: client.fullDescription ? 'high' : 'medium',
      },
    };
  } catch (error) {
    console.error('Presentation personalization error:', error);
    throw error;
  }
}
