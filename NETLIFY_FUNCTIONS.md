# Netlify Functions Documentation

## Overview

This application uses **Netlify Serverless Functions** to keep all API keys and sensitive operations secure on the server. This architecture prevents API key exposure and provides a secure proxy layer for external API calls.

**Netlify Project:** `a6bdb6e3-1806-47a7-8af3-eb71e7e0c42d`

## Why Netlify Functions?

### Security Benefits
- ✅ API keys stay server-side and never expose to browser
- ✅ Rate limiting and cost control at the server level
- ✅ Request validation before calling expensive APIs
- ✅ Centralized error handling and logging
- ✅ CORS configuration managed server-side

### Performance Benefits
- ✅ Parallel data fetching from multiple sources
- ✅ Server-side caching reduces redundant API calls
- ✅ Reduces client bundle size (no SDK libraries in browser)

## Available Functions

### Core Functions

#### 1. `ai-service.js`
**Endpoint:** `/.netlify/functions/ai-service`

**Purpose:** Secure proxy for Anthropic Claude API calls

**Actions:**
- `generateCompetitiveAnalysis` - Generate SWOT analysis and market intelligence
- `generatePitchContent` - Create pitch deck slide content
- `enhanceContent` - Improve existing content with AI
- `generateMetaDescription` - Generate SEO meta descriptions
- `health` - Health check endpoint

**Environment Variables:**
- `ANTHROPIC_API_KEY` (required)

**Example Usage:**
```typescript
const response = await fetch('/.netlify/functions/ai-service', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generateCompetitiveAnalysis',
    payload: {
      name: 'Acme Corp',
      industry: 'Enterprise SaaS',
      description: 'AI-powered workflow automation',
      competitors: ['Competitor A', 'Competitor B']
    }
  })
});

const analysis = await response.json();
console.log(analysis.executive_summary);
```

#### 2. `business-analyzer.js`
**Endpoint:** `/.netlify/functions/business-analyzer`

**Purpose:** Multi-AI orchestration for comprehensive business intelligence

**Data Sources:**
1. Website content scraping (Firecrawl)
2. Real-time intelligence (Grok 4 / X API)
3. Social sentiment (Twitter/X API)
4. Community insights (Reddit API)
5. Contact extraction (regex patterns)

**Actions:**
- `searchBusiness` - Find and verify business website
- `analyzeWebsite` - Comprehensive multi-source analysis

**Environment Variables:**
- `ANTHROPIC_API_KEY` (required)
- `SERPAPI_KEY` (for web search)
- `FIRECRAWL_API_KEY` (for content extraction)
- `BRAVE_API_KEY` (fallback search)
- `XAI_API_KEY` (Grok 4 real-time data)
- `TWITTER_BEARER_TOKEN` (social sentiment)
- `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET` (community insights)

**Example Usage:**
```typescript
// Search for business website
const searchResponse = await fetch('/.netlify/functions/business-analyzer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'searchBusiness',
    payload: { businessName: 'Acme Corporation' }
  })
});

const { primaryUrl, alternatives, confidence } = await searchResponse.json();

// Analyze business
const analysisResponse = await fetch('/.netlify/functions/business-analyzer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'analyzeWebsite',
    payload: { url: primaryUrl, businessName: 'Acme Corporation' }
  })
});

const businessData = await analysisResponse.json();
console.log(businessData.briefDescription);
console.log(businessData.realTimeIntelligence.socialSentiment);
```

#### 3. `grok-service.js`
**Endpoint:** `/.netlify/functions/grok-service`

**Purpose:** Grok 4 API integration for real-time intelligence

**Features:**
- Real-time web search across X/Twitter and web
- Recent news monitoring
- Market trend detection
- Customer feedback analysis
- Competitor mentions tracking

**Environment Variables:**
- `XAI_API_KEY` (required)

#### 4. `twitter-service.js`
**Endpoint:** `/.netlify/functions/twitter-service`

**Purpose:** Twitter/X API integration for social sentiment

**Features:**
- Tweet search and analysis
- Trending topics monitoring
- Account information retrieval
- Engagement metrics calculation

**Environment Variables:**
- `TWITTER_BEARER_TOKEN` (required)

#### 5. `reddit-service.js`
**Endpoint:** `/.netlify/functions/reddit-service`

**Purpose:** Reddit API integration for community insights

**Features:**
- Subreddit search and analysis
- Community sentiment analysis
- Industry discussion monitoring
- Post engagement tracking

**Environment Variables:**
- `REDDIT_CLIENT_ID` (required)
- `REDDIT_CLIENT_SECRET` (required)
- `REDDIT_USER_AGENT` (required)

#### 6. `client-management.js`
**Endpoint:** `/.netlify/functions/client-management`

**Purpose:** Secure client CRUD operations with admin authentication

**Environment Variables:**
- `SUPABASE_SERVICE_ROLE_KEY` (required)

#### 7. `presentation-personalizer.js`
**Endpoint:** `/.netlify/functions/presentation-personalizer`

**Purpose:** Dynamic content personalization based on client data

**Environment Variables:**
- `ANTHROPIC_API_KEY` (required)
- `SUPABASE_SERVICE_ROLE_KEY` (required)

#### 8. `business-intelligence.js`
**Endpoint:** `/.netlify/functions/business-intelligence`

**Purpose:** Advanced business intelligence operations

**Environment Variables:**
- Various BI API keys (DataForSEO, Apollo, Wappalyzer, etc.)

#### 9. `health.js`
**Endpoint:** `/.netlify/functions/health`

**Purpose:** Health check endpoint for monitoring

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T12:00:00.000Z",
  "functions": ["ai-service", "business-analyzer", "..."],
  "environment": "production"
}
```

## Local Development

### Setup
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify (one-time setup)
netlify login

# Link to existing site
netlify link
# Enter site ID: a6bdb6e3-1806-47a7-8af3-eb71e7e0c42d

# Or start dev server without linking
netlify dev
```

### Environment Variables for Local Dev
Create `.env` file in project root with all server-side variables:

```bash
# Supabase
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Anthropic
ANTHROPIC_API_KEY=your-anthropic-key

# Search & Scraping
SERPAPI_KEY=your-serpapi-key
FIRECRAWL_API_KEY=your-firecrawl-key

# Real-time Intelligence
XAI_API_KEY=your-grok-key
TWITTER_BEARER_TOKEN=your-twitter-token
REDDIT_CLIENT_ID=your-reddit-id
REDDIT_CLIENT_SECRET=your-reddit-secret
REDDIT_USER_AGENT=AI-Presenter-Business-Analyzer/1.0
```

**Note:** Netlify Dev automatically loads variables from `.env` for functions

### Testing Functions Locally

#### Start Dev Server
```bash
netlify dev
# Functions available at http://localhost:8888/.netlify/functions/[function-name]
```

#### Test Health Endpoint
```bash
curl http://localhost:8888/.netlify/functions/health
```

#### Test AI Service
```bash
curl -X POST http://localhost:8888/.netlify/functions/ai-service \
  -H "Content-Type: application/json" \
  -d '{"action":"health"}'
```

#### Test Business Analyzer
```bash
curl -X POST http://localhost:8888/.netlify/functions/business-analyzer \
  -H "Content-Type: application/json" \
  -d '{
    "action": "searchBusiness",
    "payload": {"businessName": "Anthropic"}
  }'
```

## Deployment

### Environment Variables Setup

1. **Go to Netlify Dashboard:**
   - URL: https://app.netlify.com/sites/[your-site-name]/configuration/env
   - Or: Site Settings → Environment Variables

2. **Add ALL server-side variables** (without `VITE_` prefix):
   ```
   SUPABASE_SERVICE_ROLE_KEY
   ANTHROPIC_API_KEY
   SERPAPI_KEY
   FIRECRAWL_API_KEY
   BRAVE_API_KEY
   XAI_API_KEY
   TWITTER_API_KEY
   TWITTER_API_SECRET
   TWITTER_BEARER_TOKEN
   REDDIT_CLIENT_ID
   REDDIT_CLIENT_SECRET
   REDDIT_USER_AGENT
   ... (see .env.example for complete list)
   ```

3. **Add client-side variables** (with `VITE_` prefix):
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   VITE_APP_URL
   VITE_ANALYTICS_ENABLED
   ```

### Deploy Functions

#### Automatic Deployment (Recommended)
```bash
# Push to main branch
git add .
git commit -m "Update functions"
git push origin main

# Netlify automatically deploys functions with site
```

#### Manual Deployment
```bash
# Deploy to production
netlify deploy --prod

# Deploy to preview
netlify deploy
```

### Verify Deployment

1. **Check Functions Log:**
   - Dashboard → Functions → [function-name] → Logs

2. **Test Production Endpoint:**
   ```bash
   curl https://[your-site-name].netlify.app/.netlify/functions/health
   ```

3. **Monitor Function Invocations:**
   - Dashboard → Functions → View invocations

## Function Architecture

### File Structure
```
netlify/
├── functions/
│   ├── package.json                    # Module type declaration
│   ├── health.js                        # Health check
│   ├── ai-service.js                    # Claude API proxy
│   ├── business-analyzer.js             # Multi-AI orchestration
│   ├── grok-service.js                  # Grok 4 integration
│   ├── twitter-service.js               # Twitter API
│   ├── reddit-service.js                # Reddit API
│   ├── client-management.js             # Client CRUD
│   ├── presentation-personalizer.js     # Content personalization
│   └── business-intelligence.js         # BI operations
```

### Function Template

```javascript
/**
 * Netlify Function: [Function Name]
 *
 * Description of what this function does
 */

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler = async (event, context) => {
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

    // Access environment variables
    const apiKey = process.env.YOUR_API_KEY;

    // Your logic here
    const result = await yourFunction(payload);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
    };
  }
};
```

## Best Practices

### 1. Environment Variables
- ✅ Always use `process.env.VARIABLE_NAME` (no `VITE_` prefix in functions)
- ✅ Validate required variables at function start
- ✅ Never hardcode API keys in function code
- ✅ Use descriptive error messages if variables are missing

### 2. Error Handling
- ✅ Use try-catch blocks for all async operations
- ✅ Return proper HTTP status codes (200, 400, 404, 500)
- ✅ Log errors with `console.error()` for Netlify logs
- ✅ Return user-friendly error messages to client

### 3. CORS
- ✅ Always handle OPTIONS preflight requests
- ✅ Include CORS headers in all responses
- ✅ Consider restricting origins in production (`Access-Control-Allow-Origin`)

### 4. Performance
- ✅ Use parallel requests with `Promise.all()` when possible
- ✅ Implement caching for expensive operations
- ✅ Set reasonable timeouts for external API calls
- ✅ Monitor function execution time in Netlify dashboard

### 5. Security
- ✅ Validate all input data
- ✅ Sanitize user inputs before using in API calls
- ✅ Rate limit expensive operations
- ✅ Use authentication for admin functions
- ✅ Never log sensitive data (API keys, passwords)

## Monitoring & Debugging

### View Function Logs
1. Go to Netlify Dashboard
2. Functions → Select function
3. View real-time logs and invocation history

### Common Issues

#### Function Timeout
**Symptom:** Function fails after 10 seconds
**Solution:** Optimize slow operations or increase timeout in `netlify.toml`:
```toml
[functions]
  timeout = 30  # Max 30 seconds for Pro plans
```

#### Environment Variable Not Found
**Symptom:** `undefined` when accessing `process.env.VAR_NAME`
**Solution:**
1. Check variable is set in Netlify Dashboard
2. Redeploy site after adding variables
3. Clear cache: "Clear cache and deploy site"

#### CORS Errors
**Symptom:** Browser blocks request with CORS error
**Solution:** Ensure CORS headers in function response:
```javascript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
}
```

#### Cold Start Delays
**Symptom:** First request slow (1-3 seconds)
**Solution:** This is normal for serverless functions. Consider:
- Keeping functions warm with scheduled pings
- Using caching to reduce subsequent calls
- Informing users of initial loading time

## Cost Optimization

### Function Pricing
- **Free Tier:** 125,000 requests/month, 100 hours runtime
- **Pro Plan:** 2 million requests/month included
- **Overage:** $25 per 1 million requests

### Reduce Costs
1. **Implement Caching:** Cache API responses to reduce calls
2. **Batch Operations:** Combine multiple operations in single function call
3. **Client-Side First:** Only use functions for operations requiring API keys
4. **Monitor Usage:** Check Netlify Dashboard → Functions → Usage

## MCP Integration (Future Enhancement)

Consider migrating to Model Context Protocol (MCP) for:
- ✅ Standardized API interfaces
- ✅ Better observability
- ✅ Cross-platform compatibility
- ✅ Enhanced monitoring and logging

## Support & Resources

- **Netlify Functions Docs:** https://docs.netlify.com/functions/overview/
- **Netlify Dashboard:** https://app.netlify.com/sites/[your-site-name]
- **Project ID:** `a6bdb6e3-1806-47a7-8af3-eb71e7e0c42d`
- **This Project Docs:** See `CLAUDE.md` for complete architecture guide

## Quick Reference

### Essential Commands
```bash
# Local development
netlify dev

# Test function locally
curl -X POST http://localhost:8888/.netlify/functions/[name] \
  -H "Content-Type: application/json" \
  -d '{"action":"...", "payload":{...}}'

# Deploy to production
netlify deploy --prod

# View function logs
netlify functions:list
netlify logs:function [function-name]

# Link to project
netlify link --id a6bdb6e3-1806-47a7-8af3-eb71e7e0c42d
```

### Function Endpoints (Production)
```
https://[your-site-name].netlify.app/.netlify/functions/health
https://[your-site-name].netlify.app/.netlify/functions/ai-service
https://[your-site-name].netlify.app/.netlify/functions/business-analyzer
https://[your-site-name].netlify.app/.netlify/functions/grok-service
https://[your-site-name].netlify.app/.netlify/functions/twitter-service
https://[your-site-name].netlify.app/.netlify/functions/reddit-service
https://[your-site-name].netlify.app/.netlify/functions/client-management
https://[your-site-name].netlify.app/.netlify/functions/presentation-personalizer
https://[your-site-name].netlify.app/.netlify/functions/business-intelligence
```
