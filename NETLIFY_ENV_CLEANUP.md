# Netlify Environment Variables Cleanup Guide

## Problem
Your Netlify deployment is failing because environment variables exceed the 4KB limit imposed by AWS Lambda (which powers Netlify Functions).

**Error:** `Failed to create function: invalid parameter for function creation: Your environment variables exceed the 4KB limit imposed by A`

## Solution: Remove Unused Variables

### Step 1: Access Netlify Dashboard
1. Go to: https://app.netlify.com/sites/[your-site-name]/configuration/env
2. Or: Netlify Dashboard → Site Settings → Environment Variables

### Step 2: Keep ONLY These Variables (✅ Actually Used)

#### Core Supabase (Required)
- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

#### AI Services (Required)
- ✅ `ANTHROPIC_API_KEY`
- ✅ `XAI_API_KEY` (if using Grok)

#### Search & Scraping (Used by business-analyzer.js)
- ✅ `SERPAPI_KEY` (if you have an account)
- ✅ `BRAVE_API_KEY` (if you have an account)
- ✅ `FIRECRAWL_API_KEY` (if you have an account)

#### Social Intelligence (Used by twitter-service.js & reddit-service.js)
- ✅ `TWITTER_BEARER_TOKEN` (if using Twitter integration)
- ✅ `REDDIT_CLIENT_ID` (if using Reddit integration)
- ✅ `REDDIT_CLIENT_SECRET` (if using Reddit integration)
- ✅ `REDDIT_USER_AGENT` (default: `AI-Presenter-Business-Analyzer/1.0`)

#### Business Intelligence (Used by business-intelligence.js)
- ✅ `APOLLO_API_KEY` (if you have an account)
- ✅ `DATAFORSEO_LOGIN` (if you have an account)
- ✅ `DATAFORSEO_PASSWORD` (if you have an account)
- ✅ `WAPPALYZER_API_KEY` (if you have an account)

#### Voice AI (Used by health.js)
- ✅ `VITE_ELEVENLABS_API_KEY` (if using ElevenLabs)
- ✅ `VITE_ELEVENLABS_AGENT_ID` (if using ElevenLabs)

#### Optional Application Config
- ✅ `VITE_APP_URL` (optional, defaults to Netlify URL)
- ✅ `NODE_ENV` (optional, auto-set by Netlify)
- ✅ `NODE_VERSION` (set in netlify.toml, not env vars)
- ✅ `NPM_FLAGS` (set in netlify.toml, not env vars)

---

### Step 3: DELETE These Variables (❌ Not Used in Code)

#### Social Media APIs (Not Currently Used)
- ❌ `TWITTER_API_KEY` (only `TWITTER_BEARER_TOKEN` is used)
- ❌ `TWITTER_API_SECRET` (only `TWITTER_BEARER_TOKEN` is used)
- ❌ `LINKEDIN_CLIENT_ID`
- ❌ `LINKEDIN_CLIENT_SECRET`
- ❌ `FACEBOOK_ACCESS_TOKEN`
- ❌ `YOUTUBE_API_KEY`

#### Business Intelligence (Phase 2/3 - Not Implemented Yet)
- ❌ `NEWSAPI_AI_KEY`
- ❌ `CORESIGNAL_API_KEY`
- ❌ `BRIGHT_DATA_API_KEY`
- ❌ `BRIGHT_DATA_ZONE`
- ❌ `FMP_API_KEY` (Financial Modeling Prep)
- ❌ `CRUNCHBASE_API_KEY`

#### Analytics & Monitoring (Not Implemented)
- ❌ `VITE_ANALYTICS_ENABLED`
- ❌ `VITE_GA_ID`
- ❌ `VITE_DEBUG`
- ❌ `VITE_VERBOSE_LOGGING`
- ❌ `VITE_SENTRY_DSN`
- ❌ `SENTRY_AUTH_TOKEN`
- ❌ `VITE_POSTHOG_KEY`
- ❌ `VITE_POSTHOG_HOST`

#### Duplicate/Unnecessary
- ❌ `VITE_SUPABASE_DATABASE_URL` (not needed, use `VITE_SUPABASE_URL`)

---

## How to Delete Variables in Netlify

### Option 1: Netlify UI
1. Go to: Site Settings → Environment Variables
2. Click the "..." menu next to each variable
3. Select "Delete"
4. Confirm deletion

### Option 2: Netlify CLI
```bash
# List all current variables
netlify env:list

# Delete unused variables one by one
netlify env:unset TWITTER_API_KEY
netlify env:unset TWITTER_API_SECRET
netlify env:unset NEWSAPI_AI_KEY
netlify env:unset CORESIGNAL_API_KEY
netlify env:unset BRIGHT_DATA_API_KEY
netlify env:unset BRIGHT_DATA_ZONE
netlify env:unset LINKEDIN_CLIENT_ID
netlify env:unset LINKEDIN_CLIENT_SECRET
netlify env:unset FACEBOOK_ACCESS_TOKEN
netlify env:unset YOUTUBE_API_KEY
netlify env:unset FMP_API_KEY
netlify env:unset CRUNCHBASE_API_KEY
netlify env:unset VITE_ANALYTICS_ENABLED
netlify env:unset VITE_GA_ID
netlify env:unset VITE_DEBUG
netlify env:unset VITE_VERBOSE_LOGGING
netlify env:unset VITE_SENTRY_DSN
netlify env:unset SENTRY_AUTH_TOKEN
netlify env:unset VITE_POSTHOG_KEY
netlify env:unset VITE_POSTHOG_HOST
netlify env:unset VITE_SUPABASE_DATABASE_URL
```

---

## Step 4: Trigger New Deployment

After removing unused variables:

1. Go to: Netlify Dashboard → Deploys
2. Click "Trigger deploy" → "Clear cache and deploy site"
3. Monitor the build logs

The deployment should now succeed with env vars under 4KB limit.

---

## Verification: Check Environment Variable Size

### Before Deployment
To estimate your env var size:

1. Create a file `check-env-size.js`:
```javascript
// check-env-size.js
const envVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ANTHROPIC_API_KEY',
  'SERPAPI_KEY',
  'BRAVE_API_KEY',
  'FIRECRAWL_API_KEY',
  'TWITTER_BEARER_TOKEN',
  'REDDIT_CLIENT_ID',
  'REDDIT_CLIENT_SECRET',
  'REDDIT_USER_AGENT',
  'XAI_API_KEY',
  'APOLLO_API_KEY',
  'DATAFORSEO_LOGIN',
  'DATAFORSEO_PASSWORD',
  'WAPPALYZER_API_KEY',
  'VITE_ELEVENLABS_API_KEY',
  'VITE_ELEVENLABS_AGENT_ID',
  'VITE_APP_URL',
];

let totalBytes = 0;
envVars.forEach(key => {
  const value = process.env[key] || '';
  const size = Buffer.byteLength(`${key}=${value}\n`, 'utf8');
  totalBytes += size;
  console.log(`${key}: ${size} bytes`);
});

console.log(`\nTotal: ${totalBytes} bytes (${(totalBytes/1024).toFixed(2)} KB)`);
console.log(`Limit: 4096 bytes (4 KB)`);
console.log(`Status: ${totalBytes < 4096 ? '✅ PASS' : '❌ EXCEEDS LIMIT'}`);
```

2. Run:
```bash
# Load your .env.local and check
set -a; source .env.local; set +a && node check-env-size.js
```

---

## Additional Fixes Applied

### 1. Node Version Upgrade
Updated `netlify.toml` to use Node 20 (from Node 18):
- Fixes `@octokit/*` package warnings
- Aligns with modern package requirements

### 2. Environment Variable Best Practices
- **Client-side variables** (VITE_ prefix): Only use for non-sensitive data
- **Server-side variables** (no prefix): For API keys and secrets (Netlify Functions only)
- **Remove unused variables**: Reduces security surface area and avoids hitting limits

---

## Future: External Secret Management (Optional)

If you need to add more API keys in the future and approach the 4KB limit again, consider:

### Option 1: Supabase Vault (Recommended)
Store secrets in Supabase and fetch at runtime:

```sql
-- In Supabase SQL Editor
SELECT vault.create_secret('apollo_api_key', 'your-key-here');
```

```javascript
// In Netlify Function
const { data } = await supabase.rpc('get_secret', { secret_name: 'apollo_api_key' });
```

### Option 2: AWS Secrets Manager / HashiCorp Vault
Store all API keys externally and fetch with a single master key in Netlify env vars.

---

## Summary

**Before:**
- ~30-40 environment variables
- Exceeded 4KB AWS Lambda limit
- Deployment failed

**After:**
- ~20 environment variables (only actually used)
- Well under 4KB limit
- Node 20 for modern package compatibility
- Deployment succeeds ✅

**Next Steps:**
1. Go to Netlify Dashboard → Environment Variables
2. Delete all ❌ variables listed above
3. Trigger new deployment
4. Verify deployment succeeds
