# QUICK FIX - Deployment Issue

## Problem
Site is showing blank page due to missing environment variables in Netlify.

## Error Message
```
supabaseKey is required.
```

## Solution (15 minutes)

### 1. Get Environment Variable Values

From your local `.env.local` file, you need these values:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_SUPABASE_SERVICE_ROLE_KEY
- VITE_ANTHROPIC_API_KEY

### 2. Add to Netlify

1. Go to: https://app.netlify.com
2. Find site: pitch.disruptorsmedia.com
3. Click: Site settings
4. Navigate: Build & deploy > Environment > Environment variables
5. Click: Add a variable (for each one below)

Add these variables:
```
VITE_SUPABASE_URL = [value from .env.local]
VITE_SUPABASE_ANON_KEY = [value from .env.local]
VITE_SUPABASE_SERVICE_ROLE_KEY = [value from .env.local]
VITE_ANTHROPIC_API_KEY = [value from .env.local]
```

### 3. Redeploy

1. Go to: Deploys tab
2. Click: Trigger deploy
3. Select: Clear cache and deploy site
4. Wait: 2-3 minutes for build

### 4. Verify

Run this command to test:
```bash
node test-deployment.mjs
```

Expected: All tests pass, site fully functional.

## Reference

Full details in: DEPLOYMENT_VALIDATION_REPORT.md
