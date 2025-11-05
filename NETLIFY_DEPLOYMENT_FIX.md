# Netlify Deployment Fix - Security Update

## What Changed?

Your application was exposing the Anthropic API key client-side, which is a security vulnerability. This fix moves all AI API calls to secure Netlify Functions (serverless backend), keeping your API keys safe.

## Changes Made

1. **Created Netlify Functions** (`netlify/functions/ai-service.ts`)
   - Server-side endpoint for AI operations
   - API keys stay secure server-side

2. **Updated Client Code** (`src/lib/ai-service.ts`)
   - Now calls Netlify Functions instead of Anthropic directly
   - No more API keys in browser

3. **Configuration Files**
   - Added `netlify.toml` for proper build configuration
   - Updated `.env.example` to show correct environment variable names

## How to Deploy the Fix

### Step 1: Update Environment Variables in Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Navigate to **Site settings** → **Environment variables**
4. **IMPORTANT:** Update the variable name:
   - **Remove:** `VITE_ANTHROPIC_API_KEY`
   - **Add:** `ANTHROPIC_API_KEY` (without VITE_ prefix)
   - Use the same API key value

5. Keep these variables with VITE_ prefix (they're safe for client):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Step 2: Deploy the Changes

```bash
# Commit the changes
git add .
git commit -m "fix: Move Anthropic API calls to secure Netlify Functions"
git push origin main
```

### Step 3: Verify Deployment

1. Wait for Netlify to finish building (you'll get a notification)
2. Visit your deployed site
3. The configuration error should be gone
4. Test AI features to ensure they work

## Environment Variables Summary

### Client-Side (VITE_ prefix - safe to expose)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Server-Side (NO VITE_ prefix - kept secret)
```env
ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

## Why This Fix Is Important

**Before (Insecure):**
- API key was bundled into JavaScript files
- Anyone could inspect your site and steal the key
- Could lead to unauthorized API usage and charges

**After (Secure):**
- API key only exists on Netlify's servers
- Client code calls your Netlify Function
- Netlify Function makes authenticated API calls
- API key never exposed to browsers

## Testing Locally

To test with Netlify Functions locally:

```bash
# Install Netlify CLI if you haven't
npm install -g netlify-cli

# Run dev server with Netlify Functions
netlify dev
```

This will start both your Vite dev server and Netlify Functions on `http://localhost:8888`

## Troubleshooting

### "Function not found" error
- Make sure you pushed all changes to git
- Check Netlify build logs for function compilation errors
- Verify `netlify.toml` is in the root directory

### API calls still failing
- Double-check environment variable names (no VITE_ prefix for ANTHROPIC_API_KEY)
- Ensure you triggered a new deployment after updating variables
- Check Netlify Function logs in the dashboard

### Need to clear cache?
1. In Netlify Dashboard: **Deploys** → **Trigger deploy**
2. Select **Clear cache and deploy site**

## Support

If you continue to have issues:
1. Check Netlify Function logs in the dashboard
2. Verify all environment variables are set correctly
3. Ensure the build completed successfully
