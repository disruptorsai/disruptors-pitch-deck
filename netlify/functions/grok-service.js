/**
 * Grok API Service
 *
 * xAI Grok 4 integration for real-time data and insights
 * Provides access to live X data, web search, and news sources
 */

const GROK_API_BASE = 'https://api.x.ai/v1';
const GROK_MODEL = 'grok-4';

/**
 * Initialize Grok client
 */
function getGrokClient() {
  const apiKey = process.env.XAI_API_KEY;

  if (!apiKey) {
    throw new Error('XAI_API_KEY not configured');
  }

  return apiKey;
}

/**
 * Call Grok API for real-time business intelligence
 */
export async function searchBusinessWithGrok(businessName, websiteUrl) {
  const apiKey = getGrokClient();

  console.log('[Grok Service] Searching for real-time data:', businessName);

  const prompt = `Search for real-time information about "${businessName}" ${websiteUrl ? `(website: ${websiteUrl})` : ''}.

Find the latest:
1. Recent news mentions and press releases
2. Social media sentiment and discussions on X/Twitter
3. Recent developments, product launches, or announcements
4. Current market trends and industry positioning
5. Recent customer feedback and reviews
6. Competitor mentions and market comparisons

Return a comprehensive real-time analysis in JSON format:
{
  "recentNews": [
    {
      "title": "string",
      "source": "string",
      "date": "string",
      "summary": "string",
      "url": "string"
    }
  ],
  "socialSentiment": {
    "overall": "positive/negative/neutral/mixed",
    "twitterMentions": number,
    "keyTopics": ["topic1", "topic2"],
    "sentimentScore": number (0-100)
  },
  "recentDevelopments": [
    {
      "type": "product_launch/partnership/funding/other",
      "title": "string",
      "date": "string",
      "description": "string"
    }
  ],
  "marketTrends": {
    "trending": true/false,
    "trendDirection": "up/down/stable",
    "keyInsights": ["insight1", "insight2"]
  },
  "customerFeedback": {
    "averageRating": number,
    "commonPraise": ["point1", "point2"],
    "commonComplaints": ["point1", "point2"],
    "recentReviews": ["review1", "review2"]
  },
  "competitorMentions": [
    {
      "competitor": "string",
      "context": "string",
      "sentiment": "favorable/unfavorable/neutral"
    }
  ],
  "lastUpdated": "ISO date string"
}`;

  try {
    const response = await fetch(`${GROK_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a business intelligence analyst with access to real-time data from X, web searches, and news sources. Provide comprehensive, accurate, up-to-date information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Grok API error: ${response.status} - ${error.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in Grok response');
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const realTimeData = JSON.parse(jsonMatch[0]);
      console.log('[Grok Service] Real-time data retrieved successfully');
      return realTimeData;
    }

    throw new Error('Failed to parse Grok response JSON');
  } catch (error) {
    console.error('[Grok Service] Error:', error);

    // Return fallback structure on error
    return {
      recentNews: [],
      socialSentiment: {
        overall: 'unknown',
        twitterMentions: 0,
        keyTopics: [],
        sentimentScore: 50
      },
      recentDevelopments: [],
      marketTrends: {
        trending: false,
        trendDirection: 'unknown',
        keyInsights: ['Real-time data unavailable']
      },
      customerFeedback: {
        averageRating: 0,
        commonPraise: [],
        commonComplaints: [],
        recentReviews: []
      },
      competitorMentions: [],
      lastUpdated: new Date().toISOString(),
      error: error.message
    };
  }
}

/**
 * Get real-time market insights using Grok
 */
export async function getMarketInsightsWithGrok(industry, businessName) {
  const apiKey = getGrokClient();

  console.log('[Grok Service] Getting market insights for:', industry);

  const prompt = `Analyze the current state of the ${industry} industry, specifically related to businesses like "${businessName}".

Provide real-time market intelligence:
1. Current industry trends and emerging technologies
2. Major industry news and developments from the past week
3. Key players and market leaders
4. Industry challenges and opportunities
5. Regulatory changes or policy updates
6. Investment and funding trends

Return insights in JSON format:
{
  "industryOverview": "string",
  "currentTrends": ["trend1", "trend2"],
  "recentNews": [
    {
      "headline": "string",
      "date": "string",
      "relevance": "high/medium/low"
    }
  ],
  "keyPlayers": ["company1", "company2"],
  "opportunities": ["opportunity1", "opportunity2"],
  "threats": ["threat1", "threat2"],
  "investmentTrends": "string",
  "regulatoryChanges": "string or null",
  "emergingTechnologies": ["tech1", "tech2"],
  "lastUpdated": "ISO date string"
}`;

  try {
    const response = await fetch(`${GROK_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an industry analyst with access to real-time market data, news, and trends. Provide current, actionable insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse market insights JSON');
  } catch (error) {
    console.error('[Grok Service] Market insights error:', error);
    return {
      industryOverview: 'Market insights unavailable',
      currentTrends: [],
      recentNews: [],
      keyPlayers: [],
      opportunities: [],
      threats: [],
      investmentTrends: 'Unknown',
      regulatoryChanges: null,
      emergingTechnologies: [],
      lastUpdated: new Date().toISOString(),
      error: error.message
    };
  }
}
