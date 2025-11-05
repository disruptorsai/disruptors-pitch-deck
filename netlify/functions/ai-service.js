/**
 * Netlify Function: AI Service
 *
 * Serverless function to handle Anthropic API calls securely
 * Keeps API keys server-side and prevents client-side exposure
 */

import Anthropic from '@anthropic-ai/sdk';

const DEFAULT_MODEL = 'claude-sonnet-4-5-20250929'; // Latest Claude Sonnet 4.5

// Initialize Anthropic client with server-side API key
const getAnthropicClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  return new Anthropic({ apiKey });
};

// CORS headers for client requests
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler = async (event, context) => {
  console.log('[AI Service] Function invoked');
  console.log('[AI Service] HTTP Method:', event.httpMethod);
  console.log('[AI Service] Path:', event.path);

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    console.log('[AI Service] Handling CORS preflight');
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    console.log('[AI Service] Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('[AI Service] Parsing request body');
    const { action, payload } = JSON.parse(event.body || '{}');
    console.log('[AI Service] Action:', action);
    console.log('[AI Service] Payload keys:', payload ? Object.keys(payload) : 'none');

    console.log('[AI Service] Checking environment variables');
    const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
    console.log('[AI Service] ANTHROPIC_API_KEY configured:', hasApiKey);

    if (!hasApiKey) {
      console.error('[AI Service] ERROR: ANTHROPIC_API_KEY not found in environment');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Configuration error',
          message: 'ANTHROPIC_API_KEY not configured',
          debug: {
            availableEnvVars: Object.keys(process.env).filter(k => k.includes('ANTHROPIC') || k.includes('VITE'))
          }
        }),
      };
    }

    console.log('[AI Service] Initializing Anthropic client');
    const anthropic = getAnthropicClient();

    console.log('[AI Service] Routing to action handler:', action);
    switch (action) {
      case 'generateCompetitiveAnalysis':
        return await generateCompetitiveAnalysis(anthropic, payload);

      case 'generatePitchContent':
        return await generatePitchContent(anthropic, payload);

      case 'enhanceContent':
        return await enhanceContent(anthropic, payload);

      case 'generateMetaDescription':
        return await generateMetaDescription(anthropic, payload);

      case 'health':
        console.log('[AI Service] Health check requested');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            status: 'ok',
            timestamp: new Date().toISOString(),
            hasApiKey: !!process.env.ANTHROPIC_API_KEY,
            availableActions: [
              'generateCompetitiveAnalysis',
              'generatePitchContent',
              'enhanceContent',
              'generateMetaDescription',
              'health'
            ]
          }),
        };

      default:
        console.log('[AI Service] Invalid action:', action);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: 'Invalid action',
            receivedAction: action,
            availableActions: [
              'generateCompetitiveAnalysis',
              'generatePitchContent',
              'enhanceContent',
              'generateMetaDescription',
              'health'
            ]
          }),
        };
    }
  } catch (error) {
    console.error('[AI Service] ERROR:', error);
    console.error('[AI Service] Error stack:', error.stack);
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

async function generateCompetitiveAnalysis(anthropic, payload) {
  const { name, industry, description, competitors } = payload;

  const prompt = `You are a business strategy consultant specializing in competitive analysis. Generate a comprehensive competitive analysis for the following company:

**Company Name:** ${name}
**Industry:** ${industry}
**Description:** ${description}
${competitors ? `**Known Competitors:** ${competitors.join(', ')}` : ''}

Please provide a detailed competitive analysis in JSON format with the following structure:

{
  "title": "Competitive Analysis for [Company Name]",
  "executive_summary": "A 2-3 sentence high-level overview of the competitive landscape",
  "market_size": "Brief description of the market size and growth potential",
  "market_trends": [
    {
      "title": "Trend name",
      "description": "Detailed description of the trend",
      "impact": "high" | "medium" | "low"
    }
  ],
  "competitors": [
    {
      "name": "Competitor name",
      "description": "Brief description of what they do",
      "strengths": ["Strength 1", "Strength 2", "Strength 3"],
      "weaknesses": ["Weakness 1", "Weakness 2"],
      "market_share": "Estimated market share if known, or 'Unknown'"
    }
  ],
  "strengths": [
    "Company strength 1",
    "Company strength 2",
    "Company strength 3"
  ],
  "weaknesses": [
    "Company weakness 1",
    "Company weakness 2"
  ],
  "opportunities": [
    "Market opportunity 1",
    "Market opportunity 2",
    "Market opportunity 3"
  ],
  "threats": [
    "Market threat 1",
    "Market threat 2"
  ],
  "unique_value_proposition": "A clear statement of what makes this company unique",
  "competitive_advantages": [
    "Competitive advantage 1",
    "Competitive advantage 2",
    "Competitive advantage 3"
  ]
}

Guidelines:
- Be specific and actionable in your analysis
- Identify 3-5 main competitors
- Include 3-5 market trends
- Provide 3-5 items for each SWOT category
- Focus on differentiators and unique positioning
- Use professional business language
- Base analysis on industry best practices and common patterns

Return ONLY the JSON object, no additional text or markdown formatting.`;

  const message = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 4096,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content.find((block) => block.type === 'text');
  if (!content || content.type !== 'text') {
    throw new Error('No text content in Claude response');
  }

  const analysis = JSON.parse(content.text);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      ...analysis,
      ai_model: DEFAULT_MODEL,
      generation_prompt: prompt,
    }),
  };
}

async function generatePitchContent(anthropic, payload) {
  const { companyName, industry, problem, solution } = payload;

  const prompt = `Generate engaging pitch deck slide content for ${companyName} in the ${industry} industry.

Problem: ${problem}
Solution: ${solution}

Create 5-7 compelling slides with titles, subtitles, and bullet-point content. Return as JSON:

{
  "slides": [
    {
      "title": "Slide title",
      "subtitle": "Compelling subtitle",
      "content": "Markdown formatted content with bullet points",
      "suggestedType": "hero|content|split|full-image"
    }
  ]
}`;

  const message = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 3000,
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

async function enhanceContent(anthropic, payload) {
  const { content, contentType } = payload;

  const prompts = {
    service:
      'Enhance this service description to be more compelling and professional:',
    case_study:
      'Improve this case study to better showcase results and impact:',
    slide: 'Make this slide content more engaging and concise:',
  };

  const prompt = `${prompts[contentType]}

${content}

Return the enhanced content in the same format, maintaining any markdown or structure.`;

  const message = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 2000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });

  const textContent = message.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in Claude response');
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ enhancedContent: textContent.text }),
  };
}

async function generateMetaDescription(anthropic, payload) {
  const { title, content } = payload;

  const prompt = `Generate a compelling meta description (max 160 characters) for:

Title: ${title}
Content: ${content}

Return only the meta description text, no quotes or additional formatting.`;

  const message = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 200,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });

  const textContent = message.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in Claude response');
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ metaDescription: textContent.text.trim() }),
  };
}
