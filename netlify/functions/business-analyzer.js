/**
 * Netlify Function: Business Analyzer
 *
 * Enhanced serverless function with multi-AI orchestration
 * - Claude Sonnet 4.5 for deep analysis
 * - Grok 4 for real-time X/web data
 * - Twitter API for social sentiment
 * - Reddit API for community insights
 * Keeps all API keys secure server-side
 */

import Anthropic from '@anthropic-ai/sdk';
import { getJson } from 'serpapi';
import { searchBusinessWithGrok, getMarketInsightsWithGrok } from './grok-service.js';
import { searchTweets, getTrendingTopics, getAccountInfo } from './twitter-service.js';
import { searchReddit, getSubredditInfo, analyzeIndustryCommunity } from './reddit-service.js';

const DEFAULT_MODEL = 'claude-sonnet-4-5-20250929'; // Latest Claude Sonnet 4.5

// Initialize Anthropic client
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

/**
 * Search using SerpAPI
 */
async function searchWithSerpAPI(query) {
  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    throw new Error('SERPAPI_KEY not configured');
  }

  try {
    const result = await getJson({
      engine: "google",
      q: query,
      api_key: apiKey,
      num: 5,
    });

    return result.organic_results || [];
  } catch (error) {
    console.error('[Business Analyzer] SerpAPI search failed:', error);
    throw error;
  }
}

/**
 * Fallback search using Brave Search API
 */
async function searchWithBrave(query) {
  const apiKey = process.env.BRAVE_API_KEY;

  if (!apiKey) {
    throw new Error('BRAVE_API_KEY not configured');
  }

  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`,
      {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Brave API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.web?.results || [];
  } catch (error) {
    console.error('[Business Analyzer] Brave search failed:', error);
    throw error;
  }
}

/**
 * Extract website content using Firecrawl
 */
async function extractWebsiteContent(url) {
  const apiKey = process.env.FIRECRAWL_API_KEY;

  if (!apiKey) {
    console.warn('[Business Analyzer] Firecrawl API key not configured');
    return '';
  }

  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url: url,
        formats: ['markdown'],
      }),
    });

    if (!response.ok) {
      throw new Error(`Firecrawl API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data?.markdown) {
      return data.data.markdown;
    }

    throw new Error('Failed to extract content from response');
  } catch (error) {
    console.error('[Business Analyzer] Firecrawl extraction failed:', error);
    return '';
  }
}

/**
 * Search for a business
 */
async function searchBusiness(anthropic, payload) {
  const { businessName, providedUrl } = payload;

  console.log('[Business Analyzer] Searching for:', businessName);

  let searchResults = [];
  let searchMethod = 'none';

  // If URL is provided, verify it
  if (providedUrl) {
    try {
      const content = await extractWebsiteContent(providedUrl);

      const verificationPrompt = `I need to verify if "${providedUrl}" is the correct website for "${businessName}".

Website content snippet:
${content.substring(0, 2000)}

Please analyze and confirm:
1. Is this the correct website for the business?
2. If not certain, what confidence level do you have?

Return ONLY valid JSON in this exact format:
{
  "isCorrect": boolean,
  "confirmedUrl": "${providedUrl}",
  "alternatives": [],
  "confidence": "high/medium/low",
  "reasoning": "brief explanation"
}`;

      const message = await anthropic.messages.create({
        model: DEFAULT_MODEL,
        max_tokens: 1024,
        messages: [{ role: 'user', content: verificationPrompt }],
      });

      const response = message.content[0];
      if (response.type === 'text') {
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result),
          };
        }
      }
    } catch (error) {
      console.warn('[Business Analyzer] URL verification failed:', error);
    }
  }

  // Perform real web search
  try {
    searchResults = await searchWithSerpAPI(`${businessName} official website`);
    searchMethod = 'serpapi';
  } catch (error) {
    console.warn('[Business Analyzer] SerpAPI failed, trying Brave...');

    try {
      searchResults = await searchWithBrave(`${businessName} official website`);
      searchMethod = 'brave';
    } catch (braveError) {
      console.error('[Business Analyzer] Both search methods failed');
      searchMethod = 'ai-only';
    }
  }

  // Extract URLs
  const urls = [];
  if (searchMethod === 'serpapi') {
    urls.push(...searchResults.slice(0, 5).map(r => r.link).filter(Boolean));
  } else if (searchMethod === 'brave') {
    urls.push(...searchResults.slice(0, 5).map(r => r.url).filter(Boolean));
  }

  // Use Claude to analyze results
  const analysisPrompt = searchMethod === 'ai-only'
    ? `Find the official website for "${businessName}".

Provide your best estimate for the primary URL and alternatives.

Return ONLY valid JSON in this exact format:
{
  "primaryUrl": "most likely URL",
  "alternatives": ["url1", "url2", "url3"],
  "confidence": "low",
  "reasoning": "AI inference only - real-time search unavailable"
}`
    : `I searched the web for "${businessName}" and found these results:

${urls.map((url, i) => `${i + 1}. ${url}`).join('\n')}

Please analyze these search results and determine:
1. Which URL is most likely the official website for "${businessName}"
2. Provide 2-3 alternative URLs if uncertain

Return ONLY valid JSON in this exact format:
{
  "primaryUrl": "most likely official URL from the list",
  "alternatives": ["url2", "url3"],
  "confidence": "high/medium/low",
  "reasoning": "brief explanation"
}`;

  const message = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: analysisPrompt }],
  });

  const response = message.content[0];
  if (response.type === 'text') {
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      result.searchMethod = searchMethod;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result),
      };
    }
  }

  throw new Error('Failed to parse AI response');
}

/**
 * Extract contact information using regex patterns
 */
function extractContactInfo(content) {
  const extracted = {
    emails: [],
    phones: [],
    socialMedia: {
      facebook: null,
      twitter: null,
      linkedin: null,
      instagram: null,
      youtube: null,
      tiktok: null,
    },
  };

  // Email regex - improved pattern
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  const emails = content.match(emailRegex) || [];
  extracted.emails = [...new Set(emails.filter(e =>
    !e.includes('example.com') &&
    !e.includes('sentry.io') &&
    !e.includes('placeholder') &&
    !e.includes('@2x') // Filter out image filenames
  ))];

  // Phone regex - multiple patterns
  const phonePatterns = [
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, // (123) 456-7890 or 123-456-7890
    /(\+\d{1,3}\s?)?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g, // +1 234 567 8900
    /tel:([+\d\s()-]+)/gi, // tel: links
  ];

  const phones = new Set();
  phonePatterns.forEach(pattern => {
    const matches = content.match(pattern) || [];
    matches.forEach(phone => {
      const cleaned = phone.replace(/tel:/i, '').trim();
      if (cleaned.length >= 10) phones.add(cleaned);
    });
  });
  extracted.phones = Array.from(phones);

  // Social media URL patterns
  const socialPatterns = {
    facebook: /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.com)\/([a-zA-Z0-9._-]+)/gi,
    twitter: /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([a-zA-Z0-9._-]+)/gi,
    linkedin: /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:company|in)\/([a-zA-Z0-9._-]+)/gi,
    instagram: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._-]+)/gi,
    youtube: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:c\/|channel\/|user\/)?|youtu\.be\/)([a-zA-Z0-9._-]+)/gi,
    tiktok: /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@?([a-zA-Z0-9._-]+)/gi,
  };

  Object.keys(socialPatterns).forEach(platform => {
    const matches = content.match(socialPatterns[platform]);
    if (matches && matches.length > 0) {
      // Get the full URL, not just the username
      const fullUrl = matches[0].startsWith('http') ? matches[0] : `https://${matches[0]}`;
      extracted.socialMedia[platform] = fullUrl;
    }
  });

  return extracted;
}

/**
 * Analyze a website with enhanced multi-source intelligence
 */
async function analyzeWebsite(anthropic, payload) {
  const { url, businessName } = payload;

  console.log('[Business Analyzer] 🚀 Starting enhanced analysis:', businessName);

  // Phase 1: Gather data from all sources in parallel
  console.log('[Business Analyzer] Phase 1: Multi-source data gathering');

  const dataGathering = await Promise.allSettled([
    // Website content
    extractWebsiteContent(url).catch(err => {
      console.warn('[Website] Extraction failed:', err.message);
      return '';
    }),

    // Grok real-time intelligence
    searchBusinessWithGrok(businessName, url).catch(err => {
      console.warn('[Grok] Search failed:', err.message);
      return { error: err.message };
    }),

    // Twitter/X social data
    searchTweets(businessName, url).catch(err => {
      console.warn('[Twitter] Search failed:', err.message);
      return { tweets: [], summary: 'Twitter unavailable' };
    }),

    // Reddit community insights
    searchReddit(businessName, null).catch(err => {
      console.warn('[Reddit] Search failed:', err.message);
      return { posts: [], summary: 'Reddit unavailable' };
    }),
  ]);

  // Extract results
  const websiteContent = dataGathering[0].status === 'fulfilled' ? dataGathering[0].value : '';
  const grokData = dataGathering[1].status === 'fulfilled' ? dataGathering[1].value : {};
  const twitterData = dataGathering[2].status === 'fulfilled' ? dataGathering[2].value : {};
  const redditData = dataGathering[3].status === 'fulfilled' ? dataGathering[3].value : {};

  console.log('[Business Analyzer] Data gathered:', {
    websiteChars: websiteContent.length,
    grokNews: grokData.recentNews?.length || 0,
    tweets: twitterData.tweets?.length || 0,
    redditPosts: redditData.posts?.length || 0,
  });

  // Extract contact info from website
  let extractedContact = null;
  if (websiteContent) {
    extractedContact = extractContactInfo(websiteContent);
    console.log('[Contact Extraction]', {
      emails: extractedContact.emails.length,
      phones: extractedContact.phones.length,
      social: Object.keys(extractedContact.socialMedia).filter(k => extractedContact.socialMedia[k]).length,
    });
  }

  // Phase 2: Build comprehensive analysis prompt with all data sources
  console.log('[Business Analyzer] Phase 2: Claude Sonnet 4.5 synthesis');

  const prompt = websiteContent
    ? `You are performing an ULTRA-COMPREHENSIVE multi-source business intelligence analysis of "${businessName}" (${url}).

You have access to data from FIVE sources:
1. ✅ Website Content (scraped)
2. ✅ Grok 4 Real-Time Intelligence (X/web/news)
3. ✅ Twitter/X Social Sentiment
4. ✅ Reddit Community Discussions
5. ✅ Contact Info Extraction (regex)

Synthesize ALL sources to create the most accurate, up-to-date business profile possible.

═══════════════════════════════════════════════════════
📊 DATA SOURCE 1: WEBSITE CONTENT
═══════════════════════════════════════════════════════
${websiteContent.substring(0, 12000)}

═══════════════════════════════════════════════════════
🤖 DATA SOURCE 2: GROK 4 REAL-TIME INTELLIGENCE
═══════════════════════════════════════════════════════
${grokData.recentNews?.length ? `
RECENT NEWS (${grokData.recentNews.length} items):
${grokData.recentNews.map(n => `- ${n.title} (${n.source}, ${n.date})`).join('\n')}

RECENT DEVELOPMENTS:
${grokData.recentDevelopments?.map(d => `- [${d.type}] ${d.title}: ${d.description}`).join('\n') || 'None found'}

MARKET TRENDS:
- Trending: ${grokData.marketTrends?.trending ? 'YES' : 'NO'}
- Direction: ${grokData.marketTrends?.trendDirection || 'Unknown'}
- Key Insights: ${grokData.marketTrends?.keyInsights?.join(', ') || 'None'}

CUSTOMER FEEDBACK:
- Average Rating: ${grokData.customerFeedback?.averageRating || 'N/A'}
- Common Praise: ${grokData.customerFeedback?.commonPraise?.join(', ') || 'None'}
- Common Complaints: ${grokData.customerFeedback?.commonComplaints?.join(', ') || 'None'}

COMPETITOR MENTIONS:
${grokData.competitorMentions?.map(c => `- ${c.competitor} (${c.sentiment}): ${c.context}`).join('\n') || 'None'}
` : 'Grok data unavailable'}

═══════════════════════════════════════════════════════
🐦 DATA SOURCE 3: TWITTER/X SOCIAL SENTIMENT
═══════════════════════════════════════════════════════
${twitterData.tweets?.length ? `
Found ${twitterData.totalFound} tweets with ${twitterData.sentiment} sentiment

Top Tweets:
${twitterData.tweets.slice(0, 5).map(t => `
- @${t.author.username}: "${t.text.substring(0, 150)}"
  Engagement: ${t.metrics.likes} likes, ${t.metrics.retweets} retweets
`).join('\n')}

Overall Engagement:
- Total Likes: ${twitterData.engagement?.totalLikes || 0}
- Total Retweets: ${twitterData.engagement?.totalRetweets || 0}
- Average Engagement: ${twitterData.engagement?.avgEngagement || 0}
` : 'Twitter data unavailable'}

═══════════════════════════════════════════════════════
🔴 DATA SOURCE 4: REDDIT COMMUNITY INSIGHTS
═══════════════════════════════════════════════════════
${redditData.posts?.length ? `
Found ${redditData.totalFound} Reddit discussions with ${redditData.sentiment} sentiment

Top Discussions:
${redditData.posts.slice(0, 5).map(p => `
- r/${p.subreddit}: "${p.title}"
  Score: ${p.score} | Comments: ${p.numComments} | Ratio: ${p.upvoteRatio}
`).join('\n')}

Community Metrics:
- Average Score: ${redditData.metrics?.avgScore || 0}
- Average Upvote Ratio: ${redditData.metrics?.avgUpvoteRatio || 0}
- Total Comments: ${redditData.metrics?.totalComments || 0}

Top Subreddits:
${redditData.topSubreddits?.map(s => `- r/${s.name} (${s.mentions} mentions)`).join('\n') || 'None'}
` : 'Reddit data unavailable'}

═══════════════════════════════════════════════════════
📞 DATA SOURCE 5: EXTRACTED CONTACT INFORMATION
═══════════════════════════════════════════════════════
${extractedContact ? `
✅ REGEX-EXTRACTED CONTACT DATA (PRIORITY - Use these first!):
- Emails: ${extractedContact.emails.join(', ') || 'None found'}
- Phone Numbers: ${extractedContact.phones.join(', ') || 'None found'}
- Facebook: ${extractedContact.socialMedia.facebook || 'Not found'}
- Twitter/X: ${extractedContact.socialMedia.twitter || 'Not found'}
- LinkedIn: ${extractedContact.socialMedia.linkedin || 'Not found'}
- Instagram: ${extractedContact.socialMedia.instagram || 'Not found'}
- YouTube: ${extractedContact.socialMedia.youtube || 'Not found'}
- TikTok: ${extractedContact.socialMedia.tiktok || 'Not found'}
` : 'Contact extraction unavailable'}

═══════════════════════════════════════════════════════
🎯 YOUR TASK: SYNTHESIZE ALL 5 DATA SOURCES
═══════════════════════════════════════════════════════

ANALYSIS INSTRUCTIONS:
1. Combine insights from ALL sources (website, Grok, Twitter, Reddit, regex)
2. Use real-time data from Grok for recent news and trends
3. Use Twitter sentiment to gauge public perception
4. Use Reddit discussions to understand community sentiment and pain points
5. Prioritize regex-extracted contact info over AI-guessed info
6. Cross-reference data across sources for accuracy
7. Highlight any discrepancies or conflicting information

Extract and synthesize the following information:

## BASIC INFORMATION
1. **Brief Description**: 2-3 sentence elevator pitch
2. **Full Description**: Comprehensive 2-3 paragraph description
3. **Industry**: Primary industry/sector
4. **Sub-Industry**: Specific niche or specialization
5. **Founded Year**: When established (if mentioned)
6. **Company Size**: Employee count or size category (if mentioned)

## CONTACT INFORMATION (CHECK FOOTER CAREFULLY!)
7. **Email**: Primary contact email
8. **Phone**: Main phone number (include country code if present)
9. **Address**: Physical address (if available)
10. **Contact Form URL**: Link to contact page

## DIGITAL PRESENCE
11. **Social Media**: All social media links found
12. **Logo URL**: Direct link to company logo image

## BRANDING
13. **Primary Color**: Main brand color (hex code)
14. **Secondary Color**: Secondary/accent color (hex code)
15. **Tertiary Color**: Additional brand color if present
16. **Brand Tone**: Professional tone/voice

## PRODUCTS & SERVICES
17. **Services**: List of 5-10 main services/products
18. **Key Features**: Standout features or unique selling points
19. **Target Market**: Who their ideal customers are

## TECHNOLOGY STACK
20. **Technologies Detected**: Web technologies, frameworks, or platforms visible
21. **CMS**: Content management system if detectable

## COMPETITIVE INTELLIGENCE
22. **Market Position**: Their positioning in the market
23. **Competitive Advantages**: What makes them unique
24. **Potential Competitors**: 3-5 likely competitors

## BUSINESS INSIGHTS
25. **Strengths**: 3-5 key strengths observed
26. **Opportunities**: 3-5 opportunities for improvement or growth
27. **Website Quality**: Assessment of website professionalism (1-10 scale)
28. **SEO Indicators**: Basic SEO elements noticed

## ADDITIONAL DATA
29. **Certifications**: Any certifications, awards, or credentials
30. **Partnerships**: Notable partners or associations
31. **Case Studies**: Are case studies or testimonials present?
32. **Blog/Resources**: Do they have educational content?

## REAL-TIME INTELLIGENCE (From Grok/Twitter/Reddit)
33. **Social Sentiment**: Overall social media sentiment (positive/negative/neutral/mixed)
34. **Community Perception**: How communities on Reddit/X view this business
35. **Recent News Summary**: Brief summary of recent news/developments
36. **Trending Status**: Is this business currently trending or getting attention?
37. **Customer Satisfaction**: Estimated customer satisfaction based on reviews/feedback

Return ONLY valid JSON in this exact format (use null for missing data):
{
  "briefDescription": "string",
  "fullDescription": "string",
  "industry": "string",
  "subIndustry": "string or null",
  "foundedYear": "string or null",
  "companySize": "string or null",
  "email": "string or null",
  "phone": "string or null",
  "address": "string or null",
  "contactFormUrl": "string or null",
  "socialMedia": {
    "facebook": "url or null",
    "twitter": "url or null",
    "linkedin": "url or null",
    "instagram": "url or null",
    "youtube": "url or null",
    "tiktok": "url or null"
  },
  "logoUrl": "string or null",
  "primaryColor": "#HEXCODE",
  "secondaryColor": "#HEXCODE",
  "tertiaryColor": "#HEXCODE or null",
  "brandTone": "string",
  "services": ["service1", "service2"],
  "keyFeatures": ["feature1", "feature2"],
  "targetMarket": "string",
  "technologiesDetected": ["tech1", "tech2"],
  "cms": "string or null",
  "marketPosition": "string",
  "competitiveAdvantages": ["advantage1", "advantage2"],
  "potentialCompetitors": ["competitor1", "competitor2"],
  "strengths": ["strength1", "strength2"],
  "opportunities": ["opportunity1", "opportunity2"],
  "websiteQuality": 8,
  "seoIndicators": "string",
  "certifications": ["cert1"],
  "partnerships": ["partner1"],
  "hasCaseStudies": true,
  "hasBlog": true,
  "realTimeIntelligence": {
    "socialSentiment": "positive/negative/neutral/mixed",
    "communityPerception": "string summary",
    "recentNewsSummary": "string or null",
    "isTrending": true/false,
    "customerSatisfaction": "high/medium/low/unknown"
  }
}`
    : `I need to analyze the business "${businessName}" at "${url}".

Since I cannot access the website content directly, please provide your best estimates based on the business name and URL. Use null for contact information that cannot be inferred.

Return ONLY valid JSON in the comprehensive format.`;

  const message = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const response = message.content[0];
  if (response.type === 'text') {
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);

      // Validate and provide defaults, prioritizing regex-extracted contact info
      const result = {
        description: data.briefDescription || `Professional services provided by ${businessName}`,
        fullDescription: data.fullDescription || data.briefDescription || `Professional services provided by ${businessName}`,
        industry: data.industry || 'Business Services',
        subIndustry: data.subIndustry || null,
        foundedYear: data.foundedYear || null,
        companySize: data.companySize || null,
        // Prioritize regex-extracted email and phone
        email: (extractedContact?.emails && extractedContact.emails[0]) || data.email || '',
        phone: (extractedContact?.phones && extractedContact.phones[0]) || data.phone || '',
        address: data.address || null,
        contactFormUrl: data.contactFormUrl || null,
        // Merge AI-found social media with regex-extracted, preferring regex
        socialMedia: {
          facebook: extractedContact?.socialMedia?.facebook || data.socialMedia?.facebook || null,
          twitter: extractedContact?.socialMedia?.twitter || data.socialMedia?.twitter || null,
          linkedin: extractedContact?.socialMedia?.linkedin || data.socialMedia?.linkedin || null,
          instagram: extractedContact?.socialMedia?.instagram || data.socialMedia?.instagram || null,
          youtube: extractedContact?.socialMedia?.youtube || data.socialMedia?.youtube || null,
          tiktok: extractedContact?.socialMedia?.tiktok || data.socialMedia?.tiktok || null,
        },
        logoUrl: data.logoUrl || '',
        primaryColor: data.primaryColor || '#FF6A00',
        secondaryColor: data.secondaryColor || '#9B30FF',
        tertiaryColor: data.tertiaryColor || null,
        brandTone: data.brandTone || 'professional',
        services: data.services || [],
        keyFeatures: data.keyFeatures || [],
        targetMarket: data.targetMarket || '',
        technologiesDetected: data.technologiesDetected || [],
        cms: data.cms || null,
        marketPosition: data.marketPosition || '',
        competitiveAdvantages: data.competitiveAdvantages || [],
        potentialCompetitors: data.potentialCompetitors || [],
        strengths: data.strengths || [],
        opportunities: data.opportunities || [],
        websiteQuality: data.websiteQuality || 7,
        seoIndicators: data.seoIndicators || '',
        certifications: data.certifications || [],
        partnerships: data.partnerships || [],
        hasCaseStudies: data.hasCaseStudies || false,
        hasBlog: data.hasBlog || false,
        hasRealContent: websiteContent.length > 0,
        // Real-time intelligence from multi-source analysis
        realTimeIntelligence: data.realTimeIntelligence || {
          socialSentiment: 'unknown',
          communityPerception: 'No community data available',
          recentNewsSummary: null,
          isTrending: false,
          customerSatisfaction: 'unknown'
        },
        // Metadata about data sources used
        _metadata: {
          analysisDate: new Date().toISOString(),
          model: DEFAULT_MODEL,
          dataSources: {
            website: websiteContent.length > 0,
            grok: !grokData.error,
            twitter: twitterData.tweets?.length > 0,
            reddit: redditData.posts?.length > 0,
            contactExtraction: extractedContact !== null
          },
          dataQuality: {
            websiteChars: websiteContent.length,
            grokNewsItems: grokData.recentNews?.length || 0,
            tweetsAnalyzed: twitterData.totalFound || 0,
            redditPostsAnalyzed: redditData.totalFound || 0
          }
        }
      };

      console.log('[Business Analyzer] ✅ Analysis complete');

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result),
      };
    }
  }

  throw new Error('Failed to parse AI response');
}

export const handler = async (event, context) => {
  console.log('[Business Analyzer] Function invoked');

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
    console.log('[Business Analyzer] Action:', action);

    const anthropic = getAnthropicClient();

    switch (action) {
      case 'searchBusiness':
        return await searchBusiness(anthropic, payload);

      case 'analyzeWebsite':
        return await analyzeWebsite(anthropic, payload);

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: 'Invalid action',
            availableActions: ['searchBusiness', 'analyzeWebsite'],
          }),
        };
    }
  } catch (error) {
    console.error('[Business Analyzer] ERROR:', error);
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
