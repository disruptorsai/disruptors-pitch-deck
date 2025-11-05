# API Keys Acquisition Guide

## 🎯 Overview

This guide will help you obtain all required API keys for the enhanced business analyzer. Claude will automate most of the process using Playwright MCP Browser Automation.

---

## ✅ Already Configured

These API keys are already in your `.env.local`:

| Service | Status | Value |
|---------|--------|-------|
| **Anthropic Claude** | ✅ Ready | `sk-ant-api03-linXUwdfy...` |
| **OpenAI** | ✅ Ready | `sk-proj-jD_mwLys2HAtf4pUS...` |
| **SerpAPI** | ✅ Ready | `4f8829f14d6d1ca...` |
| **Firecrawl** | ✅ Ready | `fc-d10185109a594cc...` |
| **DataForSEO** | ✅ Ready | `will@disruptorsmedia.com` / `e1ea5e75ba659fe8` |
| **Supabase** | ✅ Ready | Project configured |

---

## ❌ Need to Obtain

### Priority Tier 1 (Free or Essential)

#### 1. xAI Grok API
- **Website**: https://x.ai/api
- **Cost**: $3/million tokens (pay-as-you-go)
- **Login Method**: Google or X/Twitter account
- **Process**:
  1. Navigate to https://x.ai/api
  2. Click "Get API Key" or "Sign Up"
  3. Log in with Google (will@disruptorsmedia.com)
  4. Navigate to API Keys section
  5. Create new API key
  6. Copy key to `.env.local`

**Estimated Time**: 5 minutes

---

#### 2. X/Twitter API (Basic Tier)
- **Website**: https://developer.x.com/
- **Cost**: $100/month (Basic tier) or Free tier (very limited)
- **Login Method**: Twitter account
- **Process**:
  1. Navigate to https://developer.x.com/
  2. Apply for developer account
  3. Create new app
  4. Generate Bearer Token
  5. Copy API Key, Secret, and Bearer Token

**Approval Time**: 1-2 weeks (requires review)
**Estimated Setup**: 15 minutes

**Free Alternative**: Try the Free tier first (very limited rate limits)

---

#### 3. Reddit API
- **Website**: https://www.reddit.com/prefs/apps
- **Cost**: FREE
- **Login Method**: Reddit account or Google
- **Process**:
  1. Navigate to https://www.reddit.com/prefs/apps
  2. Log in with Google (will@disruptorsmedia.com) or create Reddit account
  3. Click "Create App" or "Create Another App"
  4. Select "script" type
  5. Fill in details:
     - Name: "AI Presenter Business Analyzer"
     - Description: "Business intelligence analysis tool"
     - Redirect URI: http://localhost:8080
  6. Get Client ID and Client Secret

**Estimated Time**: 5 minutes

---

### Priority Tier 2 (Paid Services)

#### 4. Apollo.io API
- **Website**: https://www.apollo.io/
- **Cost**: $149/month (Growth plan required for API)
- **Login Method**: Google or email
- **Process**:
  1. Navigate to https://www.apollo.io/
  2. Sign up with Google (will@disruptorsmedia.com)
  3. Upgrade to Growth plan ($149/month)
  4. Navigate to Settings > Integrations > API
  5. Generate API key

**Estimated Time**: 10 minutes + payment setup
**Note**: 7-day free trial available

---

#### 5. Wappalyzer API
- **Website**: https://www.wappalyzer.com/api/
- **Cost**: $250/month (Startup plan)
- **Login Method**: Email
- **Process**:
  1. Navigate to https://www.wappalyzer.com/api/
  2. Click "Sign Up"
  3. Use will@disruptorsmedia.com
  4. Choose Startup plan ($250/month)
  5. Navigate to API section
  6. Copy API key

**Estimated Time**: 10 minutes + payment setup
**Note**: 14-day free trial with 100 free lookups

---

### Priority Tier 3 (Optional Enhancement)

#### 6. NewsAPI.ai
- **Website**: https://newsapi.ai/
- **Cost**: $99/month (10,000 articles)
- **Login Method**: Email
- **Process**:
  1. Sign up at https://newsapi.ai/
  2. Use will@disruptorsmedia.com
  3. Choose Starter plan
  4. Get API key from dashboard

**Estimated Time**: 5 minutes

---

#### 7. Coresignal
- **Website**: https://coresignal.com/
- **Cost**: $499/month (10,000 API calls)
- **Login Method**: Email + Sales call required
- **Process**:
  1. Fill out contact form
  2. Schedule sales call
  3. Get API key after approval

**Estimated Time**: 1-2 weeks (requires sales process)
**Note**: NOT self-service signup

---

#### 8. Bright Data
- **Website**: https://brightdata.com/
- **Cost**: $200-500/month (custom pricing)
- **Login Method**: Email + Sales call required
- **Process**:
  1. Request demo/pricing
  2. Sales call required
  3. Custom pricing based on volume

**Estimated Time**: 1-2 weeks
**Note**: Enterprise sales process

---

## 📋 Acquisition Sequence

### Recommended Order

**Phase 1: Free/Essential (30 minutes)**
1. ✅ Reddit API (5 min) - FREE
2. ✅ xAI Grok (5 min) - Pay-as-you-go
3. ⏳ X/Twitter API (15 min setup + 1-2 week approval)

**Phase 2: Paid Trials (30 minutes)**
4. Apollo.io (10 min) - $149/month, 7-day trial
5. Wappalyzer (10 min) - $250/month, 14-day trial
6. NewsAPI.ai (5 min) - $99/month

**Phase 3: Enterprise (Weeks)**
7. Coresignal - Requires sales call
8. Bright Data - Requires sales call

---

## 🤖 Automation Instructions

### For Each Service, Claude Will:

1. **Navigate to signup page**
2. **Detect authentication status**
   - If logged in with Google → proceed
   - If not → pause for you to log in
3. **Navigate through signup flow**
4. **Extract API key/credentials**
5. **Add to `.env.local` automatically**
6. **Verify key works** (test API call)

### Your Role:
- **Approve each step** (Claude shows you what it's doing)
- **Enter payment info** when required (Claude will pause)
- **Verify final API keys** before saving

---

## 💰 Cost Summary

### Monthly Costs (if you enable all services)

| Service | Cost | Free Trial | Priority |
|---------|------|-----------|----------|
| xAI Grok | Pay-per-use | - | High |
| Twitter API | $100/month | - | High |
| Reddit API | FREE | - | High |
| Apollo.io | $149/month | 7 days | Medium |
| Wappalyzer | $250/month | 14 days | Medium |
| NewsAPI.ai | $99/month | - | Low |
| Coresignal | $499/month | - | Low |
| Bright Data | $300/month (est) | - | Low |

**Minimum Monthly**: ~$250-350 (Grok + Twitter + Apollo + Wappalyzer)
**Maximum Monthly**: ~$1,397 (all services)

### Recommendations

**Start With** (Free/Low Cost):
- ✅ Reddit API (FREE)
- ✅ xAI Grok ($20-50/month estimated usage)
- ✅ Twitter Free tier first, upgrade if needed

**Add If Budget Allows**:
- Apollo.io ($149) - Worth it for company enrichment
- Wappalyzer ($250) - Valuable for tech stack analysis

**Skip For Now** (Unless Essential):
- Coresignal - Very expensive, niche use case
- Bright Data - Expensive, alternatives exist
- NewsAPI.ai - Grok already provides news

---

## 🚀 Ready to Start?

### Command to Begin:

**"Let's start obtaining API keys. Begin with Reddit since it's free."**

Claude will:
1. Open browser tab to https://www.reddit.com/prefs/apps
2. Detect if you're logged in
3. Guide you through app creation
4. Extract Client ID and Secret
5. Add to `.env.local`
6. Test the API connection

Then we'll proceed to the next service in sequence.

---

## 📝 Environment Variables Template

Here's what your `.env.local` will look like when complete:

```bash
# ✅ Already Have
ANTHROPIC_API_KEY=sk-ant-api03-linXUwdfy...
OPENAI_API_KEY=sk-proj-jD_mwLys2HAtf4pUS...
SERPAPI_KEY=4f8829f14d6d1ca...
FIRECRAWL_API_KEY=fc-d10185109a594cc...
DATAFORSEO_LOGIN=will@disruptorsmedia.com
DATAFORSEO_PASSWORD=e1ea5e75ba659fe8

# ❌ Need to Obtain
XAI_API_KEY=your-xai-grok-api-key-here
TWITTER_API_KEY=your-twitter-api-key-here
TWITTER_API_SECRET=your-twitter-api-secret-here
TWITTER_BEARER_TOKEN=your-twitter-bearer-token-here
REDDIT_CLIENT_ID=your-reddit-client-id-here
REDDIT_CLIENT_SECRET=your-reddit-client-secret-here
REDDIT_USER_AGENT=AI-Presenter-Business-Analyzer/1.0
APOLLO_API_KEY=your-apollo-api-key-here
WAPPALYZER_API_KEY=your-wappalyzer-api-key-here
NEWSAPI_AI_KEY=your-newsapi-ai-key-here
```

---

**Questions before we begin?** Once you're ready, we can start with the free services and work our way up!
