# Netlify Deployment Guide

**Quick setup guide for deploying the AI Presenter to Netlify**

## Project Information

**Netlify Project ID:** `a6bdb6e3-1806-47a7-8af3-eb71e7e0c42d`
**Dashboard:** https://app.netlify.com/sites/[your-site-name]/overview
**Functions:** 9 active serverless functions

## Prerequisites

- Netlify account (linked to project ID above)
- Supabase project with database configured
- Anthropic API key (for AI features)
- GitHub repository connected to Netlify
- Netlify CLI installed (`npm install -g netlify-cli`)

---

## Step 1: Configure Environment Variables

Navigate to: **Netlify Dashboard > Site Settings > Environment Variables**

Click **Add a variable** and add each of these:

### Required Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI Features
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### Optional Variables (for enhanced features)

```bash
# Voice AI (DisruptorBot) - Client-side if needed
VITE_ELEVENLABS_API_KEY=your-elevenlabs-key
VITE_ELEVENLABS_AGENT_ID=your-agent-id

# Business Intelligence APIs (ALL server-side only, NO VITE_ prefix)
SERPAPI_KEY=your-serpapi-key
FIRECRAWL_API_KEY=your-firecrawl-key
BRAVE_API_KEY=your-brave-key
XAI_API_KEY=your-grok-api-key
TWITTER_BEARER_TOKEN=your-twitter-token
REDDIT_CLIENT_ID=your-reddit-id
REDDIT_CLIENT_SECRET=your-reddit-secret
REDDIT_USER_AGENT=AI-Presenter-Business-Analyzer/1.0
```

**⚠️ CRITICAL SECURITY NOTES:**
- Variables with `VITE_` prefix are PUBLIC and bundled into client JavaScript
- Variables WITHOUT `VITE_` prefix are PRIVATE and only accessible in Netlify Functions
- **NEVER use `VITE_` prefix for API keys or secrets** - they will be exposed to anyone
- Server-side variables: `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, all BI APIs
- Never commit these values to Git

---

## Step 2: Verify Build Settings

Navigate to: **Netlify Dashboard > Site Settings > Build & deploy**

Ensure these settings:

```
Build command: npm run build
Publish directory: dist
Functions directory: netlify/functions
Node version: 18
```

The `netlify.toml` file in your repo should handle this automatically, but verify it matches.

---

## Step 3: Deploy

### Option A: Automatic Deploy (Recommended)

1. Push your code to the main branch
2. Netlify will automatically deploy
3. Monitor the deploy logs for errors

### Option B: Manual Deploy

1. Go to **Deploys** tab
2. Click **Trigger deploy > Deploy site**
3. For fresh environment variables: **Clear cache and deploy site**

---

## Step 4: Verify Deployment

After deployment completes, run these checks:

### 4.1 Health Check Endpoint

Visit: `https://your-site.netlify.app/.netlify/functions/health`

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T12:00:00.000Z",
  "functions": [
    "health",
    "ai-service",
    "business-analyzer",
    "grok-service",
    "twitter-service",
    "reddit-service",
    "client-management",
    "presentation-personalizer",
    "business-intelligence"
  ],
  "environment": "production"
}
```

If health check fails, check Netlify Function logs for errors.

### 4.2 Test AI Service Function

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/ai-service \
  -H "Content-Type: application/json" \
  -d '{"action":"health"}'
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T12:00:00.000Z",
  "hasApiKey": true,
  "availableActions": [
    "generateCompetitiveAnalysis",
    "generatePitchContent",
    "enhanceContent",
    "generateMetaDescription",
    "health"
  ]
}
```

### 4.3 Test Public Pages

- [ ] Homepage loads: `https://your-site.netlify.app/`
- [ ] Presentation viewer works: `https://your-site.netlify.app/p/disruptors-media-demo`
- [ ] All 9 slides display correctly
- [ ] Navigation between slides works

### 4.4 Test Admin Pages

- [ ] Admin dashboard: `https://your-site.netlify.app/admin`
- [ ] Clients list loads: `https://your-site.netlify.app/admin/clients`
- [ ] Client creation form: `https://your-site.netlify.app/admin/clients/new`

### 4.5 Check Function Logs

Navigate to: **Netlify Dashboard > Functions**

Check each function for errors:
- `ai-service` - Claude API calls working
- `business-analyzer` - Multi-AI orchestration working
- `client-management` - Supabase operations working
- Other functions as needed

Look for:
- No "Missing environment variable" errors
- No "API key invalid" errors
- Successful operations in logs
- No 500 errors

---

## Step 5: Database Setup

If you haven't run the migrations yet:

### 5.1 Run Schema Migration

In Supabase SQL Editor, run:

```sql
-- Run the migrations in this order:
-- 1. supabase/migrations/20250113_ai_presenter_schema.sql
-- 2. supabase/migrations/20250117_add_public_read_policy_clean.sql
-- 3. supabase/migrations/20251020_disruptors_healthcare_data_CORRECTED.sql
-- 4. supabase/migrations/20250117_populate_slides.sql
```

### 5.2 Verify Demo Client Exists

```sql
SELECT id, name, slug, status
FROM ai_presenter_clients
WHERE slug = 'disruptors-media-demo';
```

Should return 1 row with status 'active'.

### 5.3 Verify Slides Exist

```sql
SELECT COUNT(*) as slide_count
FROM ai_presenter_slides s
JOIN ai_presenter_presentations p ON s.presentation_id = p.id
JOIN ai_presenter_clients c ON p.client_id = c.id
WHERE c.slug = 'disruptors-media-demo';
```

Should return `slide_count: 9`.

---

## Troubleshooting

### Issue: "Server configuration error"

**Cause**: Missing `SUPABASE_SERVICE_ROLE_KEY`

**Fix**:
1. Go to Netlify Dashboard > Environment Variables
2. Add `SUPABASE_SERVICE_ROLE_KEY` (NO VITE_ prefix)
3. Trigger new deploy with cache cleared

---

### Issue: Admin pages show empty client list

**Cause**: RLS policies blocking service role, or no clients in database

**Fix**:
1. Check Supabase logs for policy errors
2. Verify RLS policies exist:
   ```sql
   SELECT policyname, cmd
   FROM pg_policies
   WHERE tablename = 'ai_presenter_clients';
   ```
3. Ensure at least one client exists in database

---

### Issue: AI features not working

**Cause**: Missing or invalid `ANTHROPIC_API_KEY`

**Fix**:
1. Verify key is set in Netlify (NO VITE_ prefix)
2. Check key is valid at https://console.anthropic.com/
3. Check Netlify Function logs for API errors

---

### Issue: Presentation viewer shows no slides

**Cause**: Slides not populated in database

**Fix**:
Run `supabase/migrations/20250117_populate_slides.sql` in Supabase SQL Editor

---

### Issue: Build fails with "peer dependency" errors

**Cause**: React Three Fiber version conflicts

**Fix**: Already handled by `netlify.toml` with `NPM_FLAGS = "--legacy-peer-deps"`

If still failing:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install --legacy-peer-deps`
3. Commit and push

---

## Performance Optimization (Optional)

After successful deployment, consider:

1. **Enable Netlify Analytics**
   - Dashboard > Analytics > Enable

2. **Configure Cache Headers**
   - Already configured in `netlify.toml`
   - Static assets cached for 1 year

3. **Enable Asset Optimization**
   - Dashboard > Site Settings > Post Processing
   - Enable "Bundle CSS" and "Minify JS"

4. **Set up Deploy Notifications**
   - Dashboard > Site Settings > Build & deploy > Deploy notifications
   - Add Slack/email notifications for failed builds

---

## Monitoring & Maintenance

### Regular Checks

- **Weekly**: Review Function logs for errors
- **Weekly**: Check health endpoint
- **Monthly**: Review analytics and performance metrics
- **Monthly**: Update dependencies for security patches

### Health Check Endpoint

Set up external monitoring (e.g., UptimeRobot) to ping:
`https://your-site.netlify.app/.netlify/functions/health`

Alert if status changes to "unhealthy".

---

## Security Checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` is NOT prefixed with `VITE_`
- [ ] `ANTHROPIC_API_KEY` is NOT prefixed with `VITE_`
- [ ] No secret keys committed to Git repository
- [ ] RLS policies enabled on all Supabase tables
- [ ] Netlify environment variables are not exposed in browser
- [ ] CORS headers properly configured in Netlify Functions

---

## Support Resources

- **Netlify Functions Guide**: See `NETLIFY_FUNCTIONS.md` for comprehensive functions documentation
- **Development Guide**: See `CLAUDE.md` for complete architecture and development guide
- **Environment Variables**: See `.env.example` for all available variables with security guidelines
- **Project README**: See `README.md` for overview and quick start
- **Netlify Documentation**: https://docs.netlify.com/functions/overview/
- **Supabase Documentation**: https://supabase.com/docs
- **Project Dashboard**: https://app.netlify.com/sites/[your-site-name]/overview

---

## Quick Reference: Environment Variable Table

| Variable | Prefix | Used By | Security Level | Function |
|----------|--------|---------|----------------|----------|
| `VITE_SUPABASE_URL` | VITE_ | Client | Public | Database connection |
| `VITE_SUPABASE_ANON_KEY` | VITE_ | Client | Public (with RLS) | Read operations |
| `SUPABASE_SERVICE_ROLE_KEY` | None | Functions | **SECRET** | Admin operations |
| `ANTHROPIC_API_KEY` | None | Functions | **SECRET** | ai-service.js, business-analyzer.js |
| `SERPAPI_KEY` | None | Functions | **SECRET** | business-analyzer.js |
| `FIRECRAWL_API_KEY` | None | Functions | **SECRET** | business-analyzer.js |
| `BRAVE_API_KEY` | None | Functions | **SECRET** | business-analyzer.js (fallback) |
| `XAI_API_KEY` | None | Functions | **SECRET** | grok-service.js, business-analyzer.js |
| `TWITTER_BEARER_TOKEN` | None | Functions | **SECRET** | twitter-service.js, business-analyzer.js |
| `REDDIT_CLIENT_ID` | None | Functions | **SECRET** | reddit-service.js, business-analyzer.js |
| `REDDIT_CLIENT_SECRET` | None | Functions | **SECRET** | reddit-service.js, business-analyzer.js |
| `VITE_ELEVENLABS_API_KEY` | VITE_ | Client | Public | Voice AI (consider moving to function) |
| `VITE_ELEVENLABS_AGENT_ID` | VITE_ | Client | Public | Voice AI agent |

**Security Rule:** Variables WITHOUT `VITE_` prefix are NEVER exposed to browser - only Netlify Functions can access them.

---

## Netlify CLI Quick Commands

```bash
# Link to project
netlify link --id a6bdb6e3-1806-47a7-8af3-eb71e7e0c42d

# Test locally with functions
netlify dev

# List all functions
netlify functions:list

# Test specific function
netlify functions:invoke health

# Deploy to production
netlify deploy --prod

# View function logs
netlify logs:function ai-service
```

---

**Last Updated**: 2025-01-15
**Version**: 2.0 (Updated for Netlify Functions architecture)
**Netlify Project ID**: a6bdb6e3-1806-47a7-8af3-eb71e7e0c42d
