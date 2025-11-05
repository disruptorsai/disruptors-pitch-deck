/**
 * Netlify Function: Presentation Personalizer
 *
 * Server-side AI personalization using Anthropic API
 * Keeps API keys secure and prevents client-side exposure
 */

import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-sonnet-4-5-20250929';

// Initialize Anthropic client with server-side API key
const getAnthropicClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  return new Anthropic({ apiKey });
};

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler = async (event, context) => {
  console.log('[Presentation Personalizer] Function invoked');
  console.log('[Presentation Personalizer] HTTP Method:', event.httpMethod);

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
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
      console.error('[Presentation Personalizer] ERROR: ANTHROPIC_API_KEY not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Configuration error',
          message: 'ANTHROPIC_API_KEY not configured',
        }),
      };
    }

    const anthropic = getAnthropicClient();

    switch (action) {
      case 'personalizeHero':
        return await personalizeHero(anthropic, payload);

      case 'personalizeBlueprint':
        return await personalizeBlueprint(anthropic, payload);

      case 'personalizeDiagnostic':
        return await personalizeDiagnostic(anthropic, payload);

      case 'personalizeIntroduction':
        return await personalizeIntroduction(anthropic, payload);

      case 'personalizeCapabilities':
        return await personalizeCapabilities(anthropic, payload);

      case 'personalizeCaseStudies':
        return await personalizeCaseStudies(anthropic, payload);

      case 'personalizeTheProblem':
        return await personalizeTheProblem(anthropic, payload);

      case 'personalizeWhyAI':
        return await personalizeWhyAI(anthropic, payload);

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: 'Invalid action',
            receivedAction: action,
            availableActions: [
              'personalizeHero',
              'personalizeBlueprint',
              'personalizeDiagnostic',
              'personalizeIntroduction',
              'personalizeCapabilities',
              'personalizeCaseStudies',
              'personalizeTheProblem',
              'personalizeWhyAI',
            ],
          }),
        };
    }
  } catch (error) {
    console.error('[Presentation Personalizer] ERROR:', error);
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

/**
 * Personalize Hero slide content
 */
async function personalizeHero(anthropic, payload) {
  const { clientData, companyIntelligence } = payload;

  const prompt = `Generate personalized hero slide content for ${clientData.name}.

Client Information:
- Company: ${clientData.name}
- Industry: ${companyIntelligence?.industry || 'Unknown'}
- Description: ${clientData.description || 'N/A'}
- Business Model: ${companyIntelligence?.businessModel || 'N/A'}
- Target Market: ${companyIntelligence?.targetMarket || 'N/A'}
- Primary Challenge: ${companyIntelligence?.primaryChallenge || 'N/A'}

Generate a compelling hero slide in JSON format:

{
  "headline": "Powerful, benefit-driven headline (max 60 chars)",
  "subheadline": "Compelling value proposition (max 120 chars)",
  "ctaText": "Action-oriented CTA button text (max 25 chars)",
  "backgroundStyle": "dark|light|gradient"
}

Make it specific to their industry, target market, and primary challenge.
Return ONLY the JSON object.`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1000,
    temperature: 0.8,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content.find((block) => block.type === 'text');
  if (!content || content.type !== 'text') {
    throw new Error('No text content in Claude response');
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(JSON.parse(content.text)),
  };
}

/**
 * Personalize Blueprint slide content
 */
async function personalizeBlueprint(anthropic, payload) {
  const { clientData, companyIntelligence, services } = payload;

  const prompt = `Generate a personalized AI marketing blueprint for ${clientData.name}.

Client Information:
- Company: ${clientData.name}
- Industry: ${companyIntelligence?.industry || 'Unknown'}
- Business Model: ${companyIntelligence?.businessModel || 'N/A'}
- Target Market: ${companyIntelligence?.targetMarket || 'N/A'}
- Primary Challenge: ${companyIntelligence?.primaryChallenge || 'N/A'}
- Strategic Goals: ${companyIntelligence?.strategicGoals?.join(', ') || 'N/A'}

Available Services:
${services.map((s, i) => `${i + 1}. ${s.name} - ${s.description}`).join('\n')}

Generate a strategic blueprint in JSON format:

{
  "selectedServices": [
    {
      "name": "Service name from the list above",
      "reason": "Why this service is essential for this client",
      "priority": 1-5 (5 = highest)
    }
  ],
  "strategyRationale": "Overall strategic approach tailored to their needs (150-200 words)",
  "implementationTimeline": [
    {
      "phase": "Phase name",
      "duration": "Timeframe",
      "activities": ["Activity 1", "Activity 2", "Activity 3"]
    }
  ],
  "expectedOutcomes": ["Specific measurable outcome 1", "Specific measurable outcome 2", "Specific measurable outcome 3"]
}

Select 3-5 most relevant services. Focus on their primary challenge and strategic goals.
Return ONLY the JSON object.`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 3000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content.find((block) => block.type === 'text');
  if (!content || content.type !== 'text') {
    throw new Error('No text content in Claude response');
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(JSON.parse(content.text)),
  };
}

/**
 * Personalize Diagnostic slide content
 */
async function personalizeDiagnostic(anthropic, payload) {
  const { clientData, companyIntelligence, competitiveAnalysis } = payload;

  const prompt = `Generate a personalized competitive diagnostic for ${clientData.name}.

Client Information:
- Company: ${clientData.name}
- Industry: ${companyIntelligence?.industry || 'Unknown'}
- Target Market: ${companyIntelligence?.targetMarket || 'N/A'}

Competitive Analysis:
${JSON.stringify(competitiveAnalysis, null, 2)}

Generate a diagnostic comparison in JSON format:

{
  "competitorComparison": [
    {
      "name": "Competitor name",
      "strengths": ["Strength 1", "Strength 2"],
      "weaknesses": ["Weakness 1", "Weakness 2"],
      "ourAdvantage": "How we outperform them"
    }
  ],
  "marketGaps": ["Gap 1", "Gap 2", "Gap 3"],
  "opportunityScore": 1-100,
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
}

Include 3-4 top competitors. Be specific and data-driven.
Return ONLY the JSON object.`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2500,
    temperature: 0.6,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content.find((block) => block.type === 'text');
  if (!content || content.type !== 'text') {
    throw new Error('No text content in Claude response');
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(JSON.parse(content.text)),
  };
}

/**
 * Personalize Introduction slide
 */
async function personalizeIntroduction(anthropic, payload) {
  const { clientData, companyIntelligence } = payload;

  const prompt = `Generate a personalized introduction for ${clientData.name}.

Client Information:
- Company: ${clientData.name}
- Industry: ${companyIntelligence?.industry || 'Unknown'}
- Description: ${clientData.description || 'N/A'}
- Target Market: ${companyIntelligence?.targetMarket || 'N/A'}

Generate introduction content in JSON format:

{
  "opening": "Engaging opening statement about AI marketing (2-3 sentences)",
  "industryContext": "Why AI marketing matters in their industry (2-3 sentences)",
  "valueProposition": "Our unique value proposition for them (2-3 sentences)",
  "credibilityBuilders": ["Credibility point 1", "Credibility point 2", "Credibility point 3"]
}

Make it specific to their industry and target market.
Return ONLY the JSON object.`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1500,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content.find((block) => block.type === 'text');
  if (!content || content.type !== 'text') {
    throw new Error('No text content in Claude response');
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(JSON.parse(content.text)),
  };
}

/**
 * Personalize Capabilities slide
 */
async function personalizeCapabilities(anthropic, payload) {
  const { clientData, companyIntelligence } = payload;

  const prompt = `Generate personalized AI capabilities highlighting for ${clientData.name}.

Client Information:
- Company: ${clientData.name}
- Industry: ${companyIntelligence?.industry || 'Unknown'}
- Primary Challenge: ${companyIntelligence?.primaryChallenge || 'N/A'}
- Strategic Goals: ${companyIntelligence?.strategicGoals?.join(', ') || 'N/A'}

Generate capabilities content in JSON format:

{
  "capabilities": [
    {
      "title": "Capability name",
      "description": "How this capability solves their specific challenge",
      "examples": ["Industry-specific example 1", "Example 2"]
    }
  ],
  "whyNow": "Why they need these AI capabilities now (2-3 sentences)",
  "competitiveEdge": "How these capabilities give them an edge (2-3 sentences)"
}

Include 4-6 most relevant capabilities for their industry and challenges.
Return ONLY the JSON object.`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content.find((block) => block.type === 'text');
  if (!content || content.type !== 'text') {
    throw new Error('No text content in Claude response');
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(JSON.parse(content.text)),
  };
}

/**
 * Personalize Case Studies slide
 */
async function personalizeCaseStudies(anthropic, payload) {
  const { clientData, companyIntelligence, caseStudies } = payload;

  const prompt = `Select and personalize case studies for ${clientData.name}.

Client Information:
- Company: ${clientData.name}
- Industry: ${companyIntelligence?.industry || 'Unknown'}
- Business Model: ${companyIntelligence?.businessModel || 'N/A'}
- Primary Challenge: ${companyIntelligence?.primaryChallenge || 'N/A'}

Available Case Studies:
${caseStudies.map((cs, i) => `${i + 1}. ${cs.title} - ${cs.client_name} (${cs.industry}) - ${cs.challenge}`).join('\n')}

Generate personalized case study presentation in JSON format:

{
  "selectedCaseStudies": [
    {
      "id": "case study ID from list",
      "relevanceExplanation": "Why this is relevant to this client (1 sentence)",
      "keyTakeaway": "Main lesson for this client (1 sentence)"
    }
  ],
  "overviewText": "Why these case studies matter to this client (2-3 sentences)",
  "callToAction": "Next step invitation specific to their situation (1 sentence)"
}

Select 2-3 most relevant case studies based on industry similarity and challenge alignment.
Return ONLY the JSON object.`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content.find((block) => block.type === 'text');
  if (!content || content.type !== 'text') {
    throw new Error('No text content in Claude response');
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(JSON.parse(content.text)),
  };
}

/**
 * Personalize The Problem slide
 */
async function personalizeTheProblem(anthropic, payload) {
  const { clientData, companyIntelligence } = payload;

  const prompt = `Generate personalized problem statement for ${clientData.name}.

Client Information:
- Company: ${clientData.name}
- Industry: ${companyIntelligence?.industry || 'Unknown'}
- Target Market: ${companyIntelligence?.targetMarket || 'N/A'}
- Primary Challenge: ${companyIntelligence?.primaryChallenge || 'N/A'}
- Pain Points: ${companyIntelligence?.painPoints?.join(', ') || 'N/A'}

Generate problem articulation in JSON format:

{
  "problemStatement": "Clear, compelling problem statement for their industry (2-3 sentences)",
  "painPoints": [
    {
      "title": "Pain point title",
      "description": "Specific impact on their business",
      "costOfInaction": "What happens if they don't solve this"
    }
  ],
  "urgency": "Why this problem needs to be solved now (2-3 sentences)",
  "industryStats": ["Relevant stat 1", "Relevant stat 2", "Relevant stat 3"]
}

Include 3-4 pain points. Make it resonate with their specific situation.
Return ONLY the JSON object.`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content.find((block) => block.type === 'text');
  if (!content || content.type !== 'text') {
    throw new Error('No text content in Claude response');
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(JSON.parse(content.text)),
  };
}

/**
 * Personalize Why AI slide
 */
async function personalizeWhyAI(anthropic, payload) {
  const { clientData, companyIntelligence } = payload;

  const prompt = `Generate personalized "Why AI?" content for ${clientData.name}.

Client Information:
- Company: ${clientData.name}
- Industry: ${companyIntelligence?.industry || 'Unknown'}
- Business Model: ${companyIntelligence?.businessModel || 'N/A'}
- Strategic Goals: ${companyIntelligence?.strategicGoals?.join(', ') || 'N/A'}

Generate AI rationale in JSON format:

{
  "mainReason": "Primary reason why AI is transformative for their industry (2-3 sentences)",
  "benefits": [
    {
      "title": "Benefit name",
      "description": "How this benefit applies to them specifically",
      "example": "Concrete example in their industry"
    }
  ],
  "competitiveImperative": "Why AI adoption is a competitive necessity (2-3 sentences)",
  "roiPreview": "Expected ROI and business impact (2-3 sentences)"
}

Include 4-5 most compelling benefits for their situation.
Return ONLY the JSON object.`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content.find((block) => block.type === 'text');
  if (!content || content.type !== 'text') {
    throw new Error('No text content in Claude response');
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(JSON.parse(content.text)),
  };
}
