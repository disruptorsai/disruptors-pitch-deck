/**
 * Reddit API Service
 *
 * Fetches subreddit discussions, comments, and community insights
 * Uses Reddit API OAuth
 */

const REDDIT_API_BASE = 'https://oauth.reddit.com';
const REDDIT_AUTH_URL = 'https://www.reddit.com/api/v1/access_token';

let accessTokenCache = null;
let tokenExpiry = null;

/**
 * Get Reddit OAuth access token
 */
async function getRedditAccessToken() {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const userAgent = process.env.REDDIT_USER_AGENT || 'AI-Presenter-Business-Analyzer/1.0';

  if (!clientId || !clientSecret ||
      clientId === 'your-reddit-client-id-here' ||
      clientSecret === 'your-reddit-client-secret-here') {
    console.warn('[Reddit Service] REDDIT_CLIENT_ID/SECRET not configured - Reddit features unavailable');
    return null;
  }

  // Return cached token if still valid
  if (accessTokenCache && tokenExpiry && Date.now() < tokenExpiry) {
    return accessTokenCache;
  }

  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch(REDDIT_AUTH_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': userAgent,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`Reddit auth failed: ${response.status}`);
    }

    const data = await response.json();

    accessTokenCache = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 min early

    return accessTokenCache;

  } catch (error) {
    console.error('[Reddit Service] Auth error:', error);
    return null;
  }
}

/**
 * Search Reddit for business mentions
 */
export async function searchReddit(businessName, industry) {
  const accessToken = await getRedditAccessToken();

  if (!accessToken) {
    return {
      posts: [],
      summary: 'Reddit data unavailable - API not configured'
    };
  }

  try {
    const query = `${businessName} ${industry || ''}`;
    const userAgent = process.env.REDDIT_USER_AGENT || 'AI-Presenter-Business-Analyzer/1.0';

    console.log('[Reddit Service] Searching:', query);

    const response = await fetch(
      `${REDDIT_API_BASE}/search?q=${encodeURIComponent(query)}&limit=25&sort=relevance&t=month`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': userAgent,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Reddit search failed: ${response.status}`);
    }

    const data = await response.json();
    const posts = (data.data?.children || []).map(child => child.data);

    // Filter and process posts
    const relevantPosts = posts
      .filter(post => !post.is_self || post.selftext) // Has content
      .map(post => ({
        id: post.id,
        title: post.title,
        subreddit: post.subreddit,
        author: post.author,
        score: post.score,
        upvoteRatio: post.upvote_ratio,
        numComments: post.num_comments,
        created: new Date(post.created_utc * 1000).toISOString(),
        url: `https://reddit.com${post.permalink}`,
        text: post.selftext?.substring(0, 500) || '',
        flair: post.link_flair_text || null,
      }))
      .slice(0, 15);

    // Analyze sentiment based on scores
    const avgScore = relevantPosts.reduce((sum, p) => sum + p.score, 0) / relevantPosts.length || 0;
    const avgRatio = relevantPosts.reduce((sum, p) => sum + p.upvoteRatio, 0) / relevantPosts.length || 0;

    let sentiment = 'neutral';
    if (avgRatio > 0.8) sentiment = 'positive';
    else if (avgRatio < 0.5) sentiment = 'negative';
    else if (avgRatio > 0.65) sentiment = 'mostly positive';
    else if (avgRatio < 0.6) sentiment = 'mixed';

    // Identify top subreddits
    const subredditCounts = {};
    relevantPosts.forEach(post => {
      subredditCounts[post.subreddit] = (subredditCounts[post.subreddit] || 0) + 1;
    });

    const topSubreddits = Object.entries(subredditCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, mentions: count }));

    console.log(`[Reddit Service] Found ${relevantPosts.length} posts, sentiment: ${sentiment}`);

    return {
      posts: relevantPosts,
      totalFound: relevantPosts.length,
      sentiment,
      metrics: {
        avgScore: Math.round(avgScore),
        avgUpvoteRatio: avgRatio.toFixed(2),
        totalComments: relevantPosts.reduce((sum, p) => sum + p.numComments, 0),
      },
      topSubreddits,
      summary: `Found ${relevantPosts.length} Reddit discussions with ${sentiment} sentiment`
    };

  } catch (error) {
    console.error('[Reddit Service] Search error:', error);
    return {
      posts: [],
      summary: 'Reddit search failed',
      error: error.message
    };
  }
}

/**
 * Get subreddit info if a business has a dedicated community
 */
export async function getSubredditInfo(subredditName) {
  const accessToken = await getRedditAccessToken();

  if (!accessToken || !subredditName) {
    return null;
  }

  try {
    const userAgent = process.env.REDDIT_USER_AGENT || 'AI-Presenter-Business-Analyzer/1.0';

    const response = await fetch(
      `${REDDIT_API_BASE}/r/${subredditName}/about`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': userAgent,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const sub = data.data;

    return {
      name: sub.display_name,
      title: sub.title,
      description: sub.public_description,
      subscribers: sub.subscribers,
      activeUsers: sub.active_user_count,
      created: new Date(sub.created_utc * 1000).toISOString(),
      over18: sub.over18,
      url: `https://reddit.com/r/${sub.display_name}`,
    };

  } catch (error) {
    console.error('[Reddit Service] Subreddit info error:', error);
    return null;
  }
}

/**
 * Analyze community discussions about an industry
 */
export async function analyzeIndustryCommunity(industry) {
  const accessToken = await getRedditAccessToken();

  if (!accessToken) {
    return {
      insights: [],
      summary: 'Reddit community analysis unavailable'
    };
  }

  try {
    const userAgent = process.env.REDDIT_USER_AGENT || 'AI-Presenter-Business-Analyzer/1.0';

    // Search for industry discussions
    const response = await fetch(
      `${REDDIT_API_BASE}/search?q=${encodeURIComponent(industry + ' industry trends')}&limit=20&sort=hot&t=week`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': userAgent,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Reddit industry search failed: ${response.status}`);
    }

    const data = await response.json();
    const posts = (data.data?.children || []).map(child => child.data);

    // Extract key insights from hot discussions
    const insights = posts
      .filter(post => post.score > 10) // Popular posts
      .map(post => ({
        topic: post.title,
        engagement: post.score + post.num_comments,
        subreddit: post.subreddit,
        url: `https://reddit.com${post.permalink}`,
      }))
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 10);

    return {
      insights,
      totalDiscussions: posts.length,
      summary: `Found ${insights.length} trending industry discussions on Reddit`
    };

  } catch (error) {
    console.error('[Reddit Service] Industry analysis error:', error);
    return {
      insights: [],
      summary: 'Failed to analyze industry community',
      error: error.message
    };
  }
}
