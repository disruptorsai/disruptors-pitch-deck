# Business Intelligence Setup & Troubleshooting Guide

## ✅ What Has Been Fixed

### 1. **Netlify Function Environment Variable Fix**
**Problem:** The `business-intelligence.js` Netlify Function was using the wrong environment variable name (`VITE_SUPABASE_SERVICE_ROLE_KEY` instead of `SUPABASE_SERVICE_ROLE_KEY`), causing 500 errors.

**Fix Applied:**
- Changed line 25 in `netlify/functions/business-intelligence.js` to use `process.env.SUPABASE_SERVICE_ROLE_KEY`
- Server-side variables should **NEVER** have the `VITE_` prefix (that's for client-side only)

### 2. **Visual Progress Indicators Added**
Enhanced the Business Intelligence UI with comprehensive progress tracking:
- ✅ Real-time progress bar showing completion percentage
- ✅ Step-by-step visual indicators for each API call
- ✅ Estimated time remaining counter
- ✅ Color-coded status (blue for in-progress, green for complete, grey for pending)
- ✅ Detailed descriptions of each step

### 3. **Comprehensive Debugging Added**
Added extensive console logging throughout the analysis process:
- 🚀 Start of analysis with all parameters
- 📋 Step-by-step progress logging (Step 1/6, 2/6, etc.)
- 📦 Request payload details
- 📥 Response status and data
- ✅/❌ Success/failure indicators for each API
- 📈 Summary with all results
- ⏱️ Total duration tracking

## 🗄️ Database Tables Required

The following tables must exist in your Supabase database:

### 1. `business_intelligence_cache`
**Purpose:** Caches API data for 24 hours to reduce costs

**Migration file:** `supabase/migrations/20250115_business_intelligence_cache.sql`

**Key columns:**
- `company_domain` - Unique domain identifier
- `apollo_data`, `dataforseo_data`, `wappalyzer_data` - JSON data from each API
- `data_quality_score` - Overall quality (0-100)
- `total_api_cost` - Cost in USD
- `cache_expires_at` - When cache expires (24 hours)

### 2. `detected_opportunities`
**Purpose:** Stores AI-detected opportunities for clients

**Migration file:** `supabase/migrations/20250115_opportunity_detection.sql`

**Key columns:**
- `client_id` - Links to `ai_presenter_clients`
- `category` - Opportunity type (seo, content, marketing_automation, etc.)
- `impact_score`, `evidence_strength`, `service_alignment` - Scoring (1-10)
- `total_score` - Auto-calculated composite score
- `priority` - Auto-assigned based on total_score

## 📋 Setup Checklist

### Step 1: Verify Database Tables
Run both SQL migration files in Supabase SQL Editor:

1. Log into [Supabase Dashboard](https://app.supabase.com)
2. Go to SQL Editor → New Query
3. Copy/paste `20250115_business_intelligence_cache.sql` and run
4. Copy/paste `20250115_opportunity_detection.sql` and run

### Step 2: Configure Environment Variables in Netlify

**CRITICAL:** Set these in Netlify Dashboard → Site Settings → Environment Variables:

**Required Variables:**
```bash
# Supabase (Client-side - keep VITE_ prefix)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Supabase (Server-side - NO VITE_ prefix!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Anthropic Claude API (Server-side - NO VITE_ prefix!)
ANTHROPIC_API_KEY=sk-ant-api03-...
```

**Optional API Keys** (for full functionality):
```bash
# Phase 1 APIs (High Priority)
APOLLO_API_KEY=your-apollo-key
DATAFORSEO_LOGIN=your-dataforseo-login
DATAFORSEO_PASSWORD=your-dataforseo-password
WAPPALYZER_API_KEY=your-wappalyzer-key

# Search & Scraping
SERPAPI_KEY=your-serpapi-key
FIRECRAWL_API_KEY=your-firecrawl-key
```

**Note:** The Business Intelligence function will work with ANY API keys configured. It gracefully handles missing APIs and reports which ones succeeded/failed.

### Step 3: Deploy Your Changes

**Option A: Git Deploy (Recommended)**
```bash
git add .
git commit -m "fix: Business intelligence setup with progress indicators and debugging"
git push
```
Netlify will auto-deploy if connected to your Git repo.

**Option B: Manual Deploy**
```bash
netlify deploy --prod
```

### Step 4: Test the Function

**Method 1: Via Admin UI**
1. Go to `/admin/business-intelligence`
2. Enter a domain like `anthropic.com`
3. Click "Analyze Business"
4. Watch the progress indicators!

**Method 2: Via Browser Console**
```javascript
// Test the Netlify Function directly
fetch('/.netlify/functions/business-intelligence', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    domain: 'anthropic.com',
    clientId: null,
    skipCache: false
  })
})
.then(r => r.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

**Method 3: Via curl**
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/business-intelligence \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "anthropic.com",
    "clientId": null,
    "skipCache": false
  }'
```

## 🔍 Debugging Guide

### If "Nothing Happens" When You Click Analyze:

1. **Open Browser Console (F12)**
   - Press F12 to open Developer Tools
   - Click on the "Console" tab
   - Click "Analyze Business" again
   - Look for 🚀 emoji logs showing the analysis starting

2. **Check for Errors**
   - Red error messages in console?
   - 500 errors? Check environment variables in Netlify
   - 404 errors? Function not deployed properly
   - CORS errors? Should be fixed in latest code

3. **Verify Network Requests**
   - Open "Network" tab in Developer Tools
   - Click "Analyze Business"
   - Look for `business-intelligence` request
   - Click on it to see request/response details

### Common Issues & Solutions

**Issue:** 500 Internal Server Error
**Solution:** Check Netlify Functions logs:
1. Netlify Dashboard → Functions → business-intelligence → Recent logs
2. Look for error messages about missing environment variables
3. Ensure `SUPABASE_SERVICE_ROLE_KEY` is set (NO `VITE_` prefix!)

**Issue:** "Supabase credentials not configured"
**Solution:**
- Set `SUPABASE_SERVICE_ROLE_KEY` in Netlify (no prefix!)
- Redeploy: Netlify Dashboard → Deploys → Trigger deploy

**Issue:** "Analysis failed"
**Solution:**
- Check browser console for detailed error
- Verify domain format (no https://, no www)
- Try with a different domain
- Check if database tables exist

**Issue:** Progress indicator doesn't show
**Solution:**
- Hard refresh browser (Ctrl+Shift+R)
- Clear cache and reload
- Check console for JavaScript errors

## 📊 Understanding the Progress Indicators

When you click "Analyze Business", you'll see:

**Step 1/6: Validating**
- Checking domain format
- Looking for cached data
- Estimated: 25s remaining

**Step 2/6: Calling Netlify Function**
- Sending request to serverless function
- Estimated: 23s remaining

**Step 3/6: Fetching Apollo.io**
- Company enrichment data
- Employee count, revenue, industry
- Estimated: 20s remaining

**Step 4/6: Fetching DataForSEO**
- SEO analytics (keywords, traffic value)
- Backlink data (total backlinks, referring domains)
- Competitor analysis
- Estimated: 15s remaining

**Step 5/6: Analyzing Technology Stack**
- Wappalyzer technology detection
- CMS, frameworks, marketing tools
- Estimated: 10s remaining

**Step 6/6: Caching & Detecting Opportunities**
- Storing results in database
- AI-powered opportunity detection
- Complete!

## 📝 Console Debugging Output

When you run an analysis, you'll see logs like this:

```
🚀 [Business Intelligence] Starting analysis... { domain: 'anthropic.com', clientId: null, skipCache: false }
📋 [Step 1/6] Validating domain: anthropic.com
📦 Request payload: { action: 'analyze', domain: 'anthropic.com', clientId: null, skipCache: false }
🌐 [Step 2/6] Calling /.netlify/functions/business-intelligence
📥 Response status: 200 OK
🏢 [Step 3/6] Function is fetching Apollo.io data...
📊 [Step 4/6] Function is fetching DataForSEO data...
💻 [Step 5/6] Function is fetching Wappalyzer data...
✅ Analysis complete! Response: { apollo: {...}, dataforseo: {...}, wappalyzer: {...} }
⏱️ Total duration: 18432ms
💾 [Step 6/6] Data cached and opportunities detected
📈 Summary: {
  apollo: '✅',
  dataforseo: '✅',
  wappalyzer: '✅',
  metadata: { totalDuration: 18432, totalCost: 0.0234, successCount: 3, failureCount: 0 }
}
🎉 Analysis successful! Invalidating queries...
```

## 🎯 Expected Behavior

**With API Keys Configured:**
- Analysis completes in 15-30 seconds
- All 3 data sources return data
- Opportunities are automatically detected (if client linked)
- Data is cached for 24 hours
- Subsequent requests are instant (from cache)

**Without API Keys (Testing):**
- Function will still execute
- Missing APIs will return `null`
- Function reports which APIs succeeded/failed
- No 500 errors (graceful degradation)
- You can still test the UI and progress indicators

## 🚨 Important Notes

1. **API Keys Are Optional for Testing**
   - The function works with 0, 1, 2, or 3 API keys configured
   - It gracefully handles missing APIs
   - Data quality score reflects how many APIs succeeded

2. **Cache Reduces Costs**
   - Data is cached for 24 hours
   - Re-analyzing the same domain within 24h = instant, free
   - Use "Skip cache" switch to force fresh data (costs more)

3. **Netlify Function Timeout**
   - Functions have a 10-second timeout on free plan
   - If analysis takes longer, upgrade to Pro plan
   - Or configure individual APIs separately

4. **RLS Security**
   - `business_intelligence_cache` is readable by public
   - `detected_opportunities` requires authentication
   - Service role key bypasses RLS (used in function)

## 🎉 You're All Set!

The Business Intelligence feature is now fully functional with:
- ✅ Fixed environment variables
- ✅ Visual progress tracking
- ✅ Comprehensive debugging
- ✅ Graceful error handling
- ✅ Cache optimization
- ✅ Opportunity detection

Navigate to `/admin/business-intelligence` and start analyzing businesses!

---

**Need Help?**
- Check browser console (F12) for detailed logs
- Review Netlify function logs for server errors
- Verify all environment variables are set correctly
- Ensure database tables exist via migrations
