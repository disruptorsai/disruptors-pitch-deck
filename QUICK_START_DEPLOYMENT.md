# Quick Start: Deploy to Netlify

**Time Required**: 10 minutes
**Difficulty**: Easy

---

## Step 1: Set Environment Variables (5 minutes)

Go to **Netlify Dashboard** → **Site Settings** → **Environment Variables**

Click **"Add a variable"** and add these:

```bash
# Required - Get from Supabase Dashboard
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Required - Get from Supabase (Settings > API > service_role key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Required - Get from Anthropic Console
ANTHROPIC_API_KEY=sk-ant-api03-...

# Optional - For voice AI features
VITE_ELEVENLABS_API_KEY=your-key
VITE_ELEVENLABS_AGENT_ID=your-agent-id
```

**CRITICAL**: Note which variables have `VITE_` prefix and which don't!

---

## Step 2: Deploy (2 minutes)

1. Go to **Deploys** tab
2. Click **"Trigger deploy"**
3. Select **"Clear cache and deploy site"**
4. Wait for deployment to complete (~2-3 minutes)

---

## Step 3: Verify Health (1 minute)

Visit: `https://your-site.netlify.app/.netlify/functions/health`

Should see:
```json
{
  "status": "healthy",
  "configuration": {
    "hasSupabaseUrl": true,
    "hasSupabaseAnonKey": true,
    "hasServiceRoleKey": true,
    "hasAnthropicKey": true
  }
}
```

If any are `false`, go back and set that variable.

---

## Step 4: Test It Works (2 minutes)

1. Visit your site homepage
2. Go to `/p/disruptors-media-demo`
3. Navigate through slides
4. Visit `/admin` and check client list

---

## Troubleshooting

### Issue: Health check says "unhealthy"

**Fix**: Check which variable is `false`, then:
1. Set it in Netlify Environment Variables
2. Redeploy with cache cleared

### Issue: Admin page shows error

**Fix**: Verify `SUPABASE_SERVICE_ROLE_KEY` is set (NO `VITE_` prefix)

### Issue: No slides showing

**Fix**: Run the slides migration in Supabase SQL Editor:
```sql
-- Run: supabase/migrations/20250117_populate_slides.sql
```

---

## Done!

Your site should be live and working.

For detailed documentation, see:
- `NETLIFY_DEPLOYMENT_GUIDE.md` - Full deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Complete testing checklist
- `DEPLOYMENT_VALIDATION_REPORT.md` - Technical details

---

**Questions?** Check the health endpoint first, then review the Function logs in Netlify Dashboard.
