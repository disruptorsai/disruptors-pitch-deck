/**
 * DisruptorBot Context Builder
 *
 * Builds comprehensive context for the AI assistant to understand:
 * - The client's business and competitive landscape
 * - All presentation slides and content
 * - Available services and pricing
 * - Case studies and capabilities
 * - Current viewing context
 */

import { sdk } from './ai-presenter-sdk';

export interface DisruptorBotContext {
  // Core Identity
  identity: {
    name: string;
    role: string;
    personality: string;
  };

  // Client Information
  client: {
    id: string;
    name: string;
    slug: string;
    industry?: string;
    businessType?: string;
    competitiveAnalysis?: {
      summary: string;
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
      keyCompetitors?: Array<{
        name: string;
        strengths: string[];
      }>;
    };
  };

  // Presentation Content
  presentation: {
    title: string;
    slides: Array<{
      slug: string;
      title: string;
      content: string;
      order: number;
    }>;
    currentSlide?: {
      slug: string;
      title: string;
      content: string;
    };
  };

  // Your Services
  services: Array<{
    slug: string;
    title: string;
    description: string;
    category: string;
    features: string[];
  }>;

  // Pricing Tiers
  pricing: Array<{
    tier: string;
    name: string;
    price: string;
    features: string[];
    recommended: boolean;
  }>;

  // Case Studies
  caseStudies: Array<{
    clientName: string;
    industry: string;
    challenge: string;
    solution: string;
    results: string[];
  }>;

  // Capabilities
  capabilities: {
    aiPowered: string[];
    dataAnalytics: string[];
    contentCreation: string[];
  };

  // Instructions
  instructions: string;
}

/**
 * Build complete context for DisruptorBot
 */
export async function buildDisruptorBotContext(
  clientId: string,
  currentSlideSlug?: string
): Promise<DisruptorBotContext> {
  try {
    // First fetch client and presentation to get presentation ID
    const [client, presentation] = await Promise.all([
      sdk.getClientById(clientId),
      sdk.getPresentation(clientId)
    ]);

    if (!client) {
      throw new Error(`Client not found: ${clientId}`);
    }

    // Now fetch remaining data in parallel, including slides with presentation ID
    const [slides, services, caseStudies, competitiveAnalysis] =
      await Promise.all([
        presentation ? sdk.getSlides(presentation.id) : Promise.resolve([]),
        sdk.getServices(clientId),
        sdk.getCaseStudies(clientId),
        sdk.getCompetitiveAnalysis(clientId)
      ]);

    // Find current slide if specified
    const currentSlide = currentSlideSlug
      ? slides.find(s => s.slug === currentSlideSlug)
      : undefined;

    // Build context object
    const context: DisruptorBotContext = {
      identity: {
        name: 'DisruptorBot',
        role: 'AI Marketing Consultant',
        personality: `You are DisruptorBot, an intelligent AI assistant for Disruptors Media,
a cutting-edge AI-powered marketing agency. You are knowledgeable, enthusiastic, professional,
and genuinely helpful. You speak with confidence about our services but never oversell.
You ask clarifying questions to understand the client's needs better. You're concise but
thorough, and you can navigate to different slides in the presentation to show relevant
information. You understand the competitive landscape and can explain how Disruptors Media's
AI-powered approach gives clients an advantage.`
      },

      client: {
        id: client.id,
        name: client.name,
        slug: client.slug,
        industry: client.industry,
        businessType: client.business_type,
        competitiveAnalysis: competitiveAnalysis ? {
          summary: competitiveAnalysis.executive_summary || '',
          strengths: competitiveAnalysis.strengths || [],
          weaknesses: competitiveAnalysis.weaknesses || [],
          opportunities: competitiveAnalysis.opportunities || [],
          threats: competitiveAnalysis.threats || [],
          keyCompetitors: competitiveAnalysis.competitors?.map((c: any) => ({
            name: c.name,
            strengths: c.strengths || []
          }))
        } : undefined
      },

      presentation: {
        title: presentation?.title || 'Disruptors Media - Agency Presentation',
        slides: slides.map(slide => ({
          slug: slide.slug,
          title: slide.title,
          content: extractTextFromHTML(slide.content || ''),
          order: slide.order_index
        })),
        currentSlide: currentSlide ? {
          slug: currentSlide.slug,
          title: currentSlide.title,
          content: extractTextFromHTML(currentSlide.content || '')
        } : undefined
      },

      services: services.map(service => ({
        slug: service.slug,
        title: service.title,
        description: service.description,
        category: service.category,
        features: service.features || []
      })),

      pricing: await getPricingTiers(),

      caseStudies: caseStudies.map(cs => ({
        clientName: cs.client_name,
        industry: cs.industry,
        challenge: cs.challenge,
        solution: cs.solution,
        results: cs.results || []
      })),

      capabilities: {
        aiPowered: [
          'AI-Powered Content Generation',
          'Automated SEO Optimization',
          'Intelligent Ad Targeting',
          'Predictive Analytics',
          'Competitive Intelligence',
          'AI-Driven Insights'
        ],
        dataAnalytics: [
          'Real-time Performance Tracking',
          'Multi-channel Attribution',
          'Conversion Optimization',
          'Audience Segmentation',
          'ROI Forecasting'
        ],
        contentCreation: [
          'AI-Generated Copy',
          'Dynamic Creative Optimization',
          'Multi-format Content',
          'A/B Testing Automation'
        ]
      },

      instructions: `
# Your Role
You are DisruptorBot, the AI assistant for Disruptors Media's presentation. Your goal is to:
1. Answer questions about Disruptors Media's services, pricing, and capabilities
2. Explain the competitive analysis and market insights
3. Navigate users to relevant slides to show information visually
4. Qualify leads by understanding their needs and budget
5. Build excitement about our AI-powered approach

# Key Guidelines
- Always be helpful, knowledgeable, and professional
- Reference the competitive analysis when discussing the client's market
- Suggest navigating to specific slides when it helps illustrate a point
- Ask clarifying questions to better understand needs
- Be honest if you don't know something
- Keep responses concise (2-3 sentences) unless asked for more detail
- Highlight our AI-powered advantage naturally, not forcefully

# Available Actions
You can help users by:
- Answering questions about services (navigate to "Our Services" slide if needed)
- Explaining pricing (navigate to "Pricing" slide if needed)
- Showing case studies (navigate to "Case Studies" slide if needed)
- Discussing competitive insights from the analysis
- Explaining our capabilities and approach

# Current Context
The client is viewing: ${currentSlide?.title || 'the presentation'}
${competitiveAnalysis ? `\nWe have prepared a competitive analysis showing: ${competitiveAnalysis.executive_summary}` : ''}

# Example Interactions
User: "How much does this cost?"
You: "Great question! We have four pricing tiers ranging from our Agency plan at $2,500/month to our Enterprise plan starting at $15,000/month. The right fit depends on your needs - can you tell me about your current marketing challenges? Would you like me to show you the pricing comparison slide?"

User: "What makes you different from other agencies?"
You: "Excellent question! While traditional agencies rely on manual processes, we use AI to amplify every aspect of your marketing - from content generation to predictive analytics. Based on the competitive analysis I've prepared for ${client.name}, I can show you specifically how we outperform your current alternatives. Want to see the competitive landscape slide?"

Remember: Be conversational, helpful, and focus on understanding their needs first!
`.trim()
    };

    return context;
  } catch (error) {
    console.error('Error building DisruptorBot context:', error);
    throw error;
  }
}

/**
 * Convert context to a system prompt for ElevenLabs/Claude
 */
export function contextToSystemPrompt(context: DisruptorBotContext): string {
  const prompt = `
${context.identity.personality}

# CLIENT INFORMATION
Company: ${context.client.name}
Industry: ${context.client.industry || 'Not specified'}
${context.client.competitiveAnalysis ? `
## Competitive Analysis Summary
${context.client.competitiveAnalysis.summary}

### Key Strengths
${context.client.competitiveAnalysis.strengths.map(s => `- ${s}`).join('\n')}

### Key Weaknesses
${context.client.competitiveAnalysis.weaknesses.map(w => `- ${w}`).join('\n')}

### Opportunities
${context.client.competitiveAnalysis.opportunities.map(o => `- ${o}`).join('\n')}

### Threats
${context.client.competitiveAnalysis.threats.map(t => `- ${t}`).join('\n')}

${context.client.competitiveAnalysis.keyCompetitors ? `
### Main Competitors
${context.client.competitiveAnalysis.keyCompetitors.map(c =>
  `**${c.name}**: ${c.strengths.join(', ')}`
).join('\n')}
` : ''}
` : ''}

# PRESENTATION SLIDES AVAILABLE
${context.presentation.slides.map(s =>
  `## ${s.order}. ${s.title} (slug: "${s.slug}")\n${s.content.substring(0, 200)}${s.content.length > 200 ? '...' : ''}`
).join('\n\n')}

${context.presentation.currentSlide ? `
# CURRENT SLIDE
The client is currently viewing: **${context.presentation.currentSlide.title}**
${context.presentation.currentSlide.content}
` : ''}

# OUR SERVICES
${context.services.map(s =>
  `**${s.title}** (${s.category})\n${s.description}\nFeatures: ${s.features.join(', ')}`
).join('\n\n')}

# PRICING TIERS
${context.pricing.map(p =>
  `**${p.name}** - ${p.price}\n${p.features.slice(0, 5).join(', ')}${p.recommended ? ' (Recommended)' : ''}`
).join('\n\n')}

# CASE STUDIES
${context.caseStudies.slice(0, 3).map(cs =>
  `**${cs.clientName}** (${cs.industry})\nChallenge: ${cs.challenge}\nSolution: ${cs.solution}\nResults: ${cs.results.slice(0, 2).join(', ')}`
).join('\n\n')}

# INSTRUCTIONS
${context.instructions}
`.trim();

  return prompt;
}

/**
 * Extract plain text from HTML content
 */
function extractTextFromHTML(html: string): string {
  // Remove HTML tags
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Get pricing tiers (hardcoded for now, can be moved to database)
 */
async function getPricingTiers() {
  return [
    {
      tier: 'agency',
      name: 'Agency',
      price: '$2,500/month',
      features: [
        'AI Content Generation (20 pieces/month)',
        'Basic SEO Optimization',
        'Social Media Management (3 platforms)',
        'Monthly Analytics Report',
        'Email Marketing Campaigns',
        'Dedicated Account Manager'
      ],
      recommended: false
    },
    {
      tier: 'growth',
      name: 'Growth',
      price: '$5,000/month',
      features: [
        'AI Content Generation (50 pieces/month)',
        'Advanced SEO & Technical Audit',
        'Social Media Management (5 platforms)',
        'Paid Ads Management ($5k ad spend)',
        'Weekly Analytics & Insights',
        'A/B Testing & Optimization',
        'Competitive Intelligence Reports',
        'Dedicated Strategy Team'
      ],
      recommended: true
    },
    {
      tier: 'executive',
      name: 'Executive',
      price: '$10,000/month',
      features: [
        'Unlimited AI Content Generation',
        'Enterprise SEO Strategy',
        'Full Social Media Suite',
        'Paid Ads Management ($15k ad spend)',
        'Real-time Dashboard & Alerts',
        'Advanced Predictive Analytics',
        'Custom AI Model Training',
        'Quarterly Strategy Sessions',
        'Priority Support'
      ],
      recommended: false
    },
    {
      tier: 'enterprise',
      name: 'Enterprise',
      price: '$15,000+/month',
      features: [
        'Everything in Executive',
        'Custom AI Solutions',
        'White-label Options',
        'Dedicated AI Team',
        'API Access',
        'Custom Integrations',
        '24/7 Priority Support',
        'On-site Strategy Sessions'
      ],
      recommended: false
    }
  ];
}

/**
 * Update context when slide changes
 */
export async function updateCurrentSlide(
  existingContext: DisruptorBotContext,
  newSlideSlug: string
): Promise<DisruptorBotContext> {
  const newSlide = existingContext.presentation.slides.find(
    s => s.slug === newSlideSlug
  );

  if (!newSlide) {
    return existingContext;
  }

  return {
    ...existingContext,
    presentation: {
      ...existingContext.presentation,
      currentSlide: {
        slug: newSlide.slug,
        title: newSlide.title,
        content: newSlide.content
      }
    }
  };
}
