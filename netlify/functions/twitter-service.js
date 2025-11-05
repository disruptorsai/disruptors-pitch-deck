/**
 * X/Twitter API Service
 *
 * Fetches tweets, trends, and social sentiment data
 * Uses Twitter API v2
 */

const TWITTER_API_BASE = 'https://api.twitter.com/2';

/**
 * Get Twitter bearer token from env
 */
function getTwitterAuth() {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;

  if (!bearerToken || bearerToken === 'your-twitter-bearer-token-here') {
    console.warn('[Twitter Service] TWITTER_BEARER_TOKEN not configured - Twitter features unavailable');
    return null;
  }

  return bearerToken;
}

/**
 * Search recent tweets about a business
 */
export async function searchTweets(businessName, websiteUrl) {
  const bearerToken = getTwitterAuth();

  if (!bearerToken) {
    console.warn('[Twitter Service] Skipping Twitter search - no API key');
    return {
      tweets: [],
      summary: 'Twitter data unavailable - API key not configured'
    };
  }

  try {
    // Build search query - look for business name, handle, or domain
    const searchQueries = [businessName];

    // Extract domain from URL if provided
    if (websiteUrl) {
      try {
        const domain = new URL(websiteUrl).hostname.replace('www.', '');
        searchQueries.push(domain);
      } catch (e) {
        // Invalid URL, skip
      }
    }

    const query = searchQueries.map(q => `"${q}"`).join(' OR ');

    console.log('[Twitter Service] Searching tweets:', query);

    const response = await fetch(
      `${TWITTER_API_BASE}/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=20&tweet.fields=created_at,public_metrics,author_id,lang&expansions=author_id&user.fields=username,name,verified`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('[Twitter Service] API error:', response.status, error);

      // Return empty result on error
      return {
        tweets: [],
        summary: `Twitter API error: ${response.status}`,
        error: error.detail || error.title || 'Unknown error'
      };
    }

    const data = await response.json();

    // Process tweets
    const tweets = (data.data || []).map(tweet => {
      const author = (data.includes?.users || []).find(u => u.id === tweet.author_id);

      return {
        id: tweet.id,
        text: tweet.text,
        createdAt: tweet.created_at,
        metrics: {
          likes: tweet.public_metrics?.like_count || 0,
          retweets: tweet.public_metrics?.retweet_count || 0,
          replies: tweet.public_metrics?.reply_count || 0,
          impressions: tweet.public_metrics?.impression_count || 0,
        },
        author: {
          username: author?.username || 'unknown',
          name: author?.name || 'Unknown',
          verified: author?.verified || false,
        },
        language: tweet.lang,
        url: `https://twitter.com/${author?.username}/status/${tweet.id}`
      };
    });

    // Calculate sentiment and engagement
    const totalLikes = tweets.reduce((sum, t) => sum + t.metrics.likes, 0);
    const totalRetweets = tweets.reduce((sum, t) => sum + t.metrics.retweets, 0);
    const avgEngagement = tweets.length > 0
      ? (totalLikes + totalRetweets) / tweets.length
      : 0;

    // Simple sentiment analysis based on engagement
    let sentiment = 'neutral';
    if (avgEngagement > 50) sentiment = 'positive';
    else if (avgEngagement < 5 && tweets.length > 5) sentiment = 'negative';

    console.log(`[Twitter Service] Found ${tweets.length} tweets, avg engagement: ${avgEngagement.toFixed(1)}`);

    return {
      tweets: tweets.slice(0, 10), // Return top 10
      totalFound: tweets.length,
      sentiment,
      engagement: {
        totalLikes,
        totalRetweets,
        avgEngagement: Math.round(avgEngagement),
      },
      summary: `Found ${tweets.length} recent tweets with ${sentiment} sentiment`
    };

  } catch (error) {
    console.error('[Twitter Service] Search error:', error);
    return {
      tweets: [],
      summary: 'Twitter search failed',
      error: error.message
    };
  }
}

/**
 * Get trending topics related to an industry
 */
export async function getTrendingTopics(industry) {
  const bearerToken = getTwitterAuth();

  if (!bearerToken) {
    return {
      trends: [],
      summary: 'Twitter trends unavailable'
    };
  }

  try {
    // Search for trending industry-related tweets
    const query = `${industry} (trending OR news OR innovation) -is:retweet`;

    const response = await fetch(
      `${TWITTER_API_BASE}/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=10&tweet.fields=public_metrics`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
      }
    );

    if (!response.ok) {
      return {
        trends: [],
        summary: 'Unable to fetch trends'
      };
    }

    const data = await response.json();
    const tweets = data.data || [];

    // Extract hashtags and topics
    const topics = new Map();

    tweets.forEach(tweet => {
      const hashtags = tweet.text.match(/#\w+/g) || [];
      hashtags.forEach(tag => {
        const count = topics.get(tag) || 0;
        topics.set(tag, count + 1);
      });
    });

    // Sort by frequency
    const trendingTopics = Array.from(topics.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, mentions: count }));

    return {
      trends: trendingTopics,
      totalAnalyzed: tweets.length,
      summary: `Found ${trendingTopics.length} trending topics in ${industry}`
    };

  } catch (error) {
    console.error('[Twitter Service] Trends error:', error);
    return {
      trends: [],
      summary: 'Failed to fetch trends',
      error: error.message
    };
  }
}

/**
 * Get Twitter account information if available
 */
export async function getAccountInfo(username) {
  const bearerToken = getTwitterAuth();

  if (!bearerToken || !username) {
    return null;
  }

  try {
    // Remove @ if present
    const cleanUsername = username.replace('@', '');

    const response = await fetch(
      `${TWITTER_API_BASE}/users/by/username/${cleanUsername}?user.fields=public_metrics,verified,description,created_at`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const user = data.data;

    return {
      username: user.username,
      name: user.name,
      description: user.description,
      verified: user.verified,
      followers: user.public_metrics?.followers_count || 0,
      following: user.public_metrics?.following_count || 0,
      tweets: user.public_metrics?.tweet_count || 0,
      createdAt: user.created_at,
      url: `https://twitter.com/${user.username}`
    };

  } catch (error) {
    console.error('[Twitter Service] Account info error:', error);
    return null;
  }
}
