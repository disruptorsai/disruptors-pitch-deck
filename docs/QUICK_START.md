# AI Presenter - Quick Start Guide

Get your AI Presenter application up and running in 15 minutes!

---

## Prerequisites

- [x] Existing Disruptors AI Supabase project access
- [x] Anthropic API key ([Get one here](https://console.anthropic.com/))
- [x] Netlify account ([Sign up here](https://app.netlify.com/signup))
- [x] Node.js 18+ installed
- [x] Git installed

---

## Step 1: Database Setup (5 minutes)

### 1.1 Apply Database Migration

1. Open your Supabase Dashboard: https://app.supabase.com/project/[your-project]
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/20250113_ai_presenter_schema.sql`
5. Paste into the SQL Editor
6. Click **Run** (bottom right)
7. Verify success: You should see "Success. No rows returned"

### 1.2 Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click **Create Bucket**
3. Configure:
   - **Name:** `ai-presenter-files`
   - **Public:** ❌ (Unchecked - keep private)
   - **File size limit:** 52428800 (50MB)
   - **Allowed MIME types:** Leave empty for all types
4. Click **Create Bucket**

### 1.3 Get API Keys

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these values (you'll need them in Step 2):
   - **Project URL** (e.g., `https://xxx.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

---

## Step 2: Environment Configuration (2 minutes)

### 2.1 Create Environment File

```bash
# In your project root
cp .env.example .env.local
```

### 2.2 Fill in Required Values

Open `.env.local` and replace with your actual values:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Anthropic API
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

---

## Step 3: Install Dependencies (2 minutes)

```bash
npm install
```

### Required Dependencies

The migration uses these key packages:
- `@supabase/supabase-js` - Database and storage
- `@anthropic-ai/sdk` - AI features
- `react` & `next` - Frontend framework (if not already installed)

---

## Step 4: Run Migration Script (3 minutes)

### Option A: Automated Migration (Recommended)

If you have existing Base44 data:

```bash
# Edit the configuration in scripts/migrate-from-base44.ts
# Then run:
npx ts-node scripts/migrate-from-base44.ts
```

### Option B: Manual Client Creation

If starting fresh:

```typescript
// Create a test file: scripts/create-test-client.ts
import { adminSDK } from '../src/lib/ai-presenter-sdk';

async function createTestClient() {
  // 1. Create client
  const client = await adminSDK.createClient({
    name: 'Test Client',
    slug: 'test-client',
    description: 'A test client for development',
    status: 'active',
  });

  console.log('✅ Client created:', client.id);

  // 2. Create presentation
  const presentation = await adminSDK.createPresentation({
    client_id: client.id,
    title: 'Test Presentation',
    subtitle: 'Getting Started',
    description: 'This is a test presentation',
    is_default: true,
  });

  console.log('✅ Presentation created:', presentation.id);

  // 3. Create a slide
  const slide = await adminSDK.createSlide({
    presentation_id: presentation.id,
    title: 'Welcome',
    content: 'Welcome to AI Presenter!',
    slide_type: 'hero',
    order_index: 0,
  });

  console.log('✅ Slide created:', slide.id);

  // 4. Create access link
  const accessLink = await adminSDK.createAccessLink({
    client_id: client.id,
    name: 'Test Access Link',
  });

  console.log('✅ Access link created!');
  console.log('🔗 Token:', accessLink.token);
  console.log('🌐 URL:', `http://localhost:3000/p/${accessLink.token}`);
}

createTestClient().catch(console.error);
```

Run it:
```bash
npx ts-node scripts/create-test-client.ts
```

---

## Step 5: Start Development Server (1 minute)

```bash
npm run dev
```

Your app should now be running at: http://localhost:3000

---

## Step 6: Test Your Setup (2 minutes)

### 6.1 Access Test Presentation

Using the access token from Step 4:

```
http://localhost:3000/p/[your-access-token]
```

You should see your test presentation!

### 6.2 Verify Analytics

1. View the presentation
2. Navigate between slides
3. Check the database:

```sql
-- In Supabase SQL Editor
SELECT COUNT(*) FROM ai_presenter_analytics_events;
-- Should show analytics events
```

### 6.3 Test AI Generation (Optional)

```typescript
// In scripts/test-ai.ts
import { adminSDK } from '../src/lib/ai-presenter-sdk';

async function testAI() {
  const client = await adminSDK.getClientBySlug('test-client');

  const analysis = await adminSDK.generateCompetitiveAnalysis(
    client.id,
    {
      name: 'Test Company',
      industry: 'Technology',
      description: 'A test company',
    }
  );

  console.log('AI Analysis:', analysis.executive_summary);
}

testAI();
```

---

## Common Issues & Solutions

### Issue: "Multiple GoTrueClient instances" Warning

**Solution:** Make sure you're importing from the centralized client:

```typescript
// ✅ Correct
import { supabase, supabaseAdmin } from '@/lib/supabase-client';

// ❌ Wrong
import { createClient } from '@supabase/supabase-js';
const myClient = createClient(...);
```

### Issue: Migration Script Fails

**Check:**
1. Database migration was applied successfully
2. Environment variables are set correctly
3. Service role key has proper permissions

**Solution:**
```bash
# Verify environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Check database connection
# In Supabase SQL Editor:
SELECT * FROM ai_presenter_clients LIMIT 1;
```

### Issue: AI Generation Fails

**Check:**
1. ANTHROPIC_API_KEY is set correctly
2. API key has credits/is active

**Solution:**
```typescript
import { aiService } from '@/lib/ai-service';

// Verify configuration
if (!aiService.isConfigured()) {
  console.error('Anthropic API key not set!');
}
```

---

## Next Steps

### For Development

1. **Build Admin Interface**
   - Create client management pages
   - Build access link generator
   - Add analytics dashboard

2. **Customize Presentation UI**
   - Update slide templates
   - Add custom themes
   - Enhance animations

3. **Add Features**
   - PDF export
   - Email notifications
   - Custom branding

### For Production

1. **Deploy to Netlify**
   ```bash
   # Connect to GitHub
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin [your-repo-url]
   git push -u origin main

   # Deploy via Netlify Dashboard
   # 1. Import from GitHub
   # 2. Add environment variables
   # 3. Deploy
   ```

2. **Configure Production Environment**
   - Update `NEXT_PUBLIC_APP_URL` to production domain
   - Set `NODE_ENV=production`
   - Add monitoring (Sentry, PostHog, etc.)

3. **Create Production Clients**
   - Use admin SDK to create real clients
   - Generate access links
   - Configure branding

---

## Helpful Resources

### Documentation
- [Complete Migration Guide](./AI_PRESENTER_MIGRATION_COMPLETE.md)
- [API Reference](./AI_PRESENTER_MIGRATION_COMPLETE.md#api-reference)
- [Deployment Guide](./AI_PRESENTER_MIGRATION_COMPLETE.md#deployment-guide)

### Code Examples
- [Usage Examples](./AI_PRESENTER_MIGRATION_COMPLETE.md#usage-examples)
- [Migration Script](../scripts/migrate-from-base44.ts)
- [Custom Hooks](../src/hooks/use-client.ts)

### External Resources
- [Supabase Docs](https://supabase.com/docs)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [Netlify Docs](https://docs.netlify.com/)

---

## Support

If you encounter issues:

1. Check the [Troubleshooting Section](./AI_PRESENTER_MIGRATION_COMPLETE.md#troubleshooting)
2. Review error logs in browser console and Supabase dashboard
3. Verify all environment variables are set correctly
4. Ensure database migration was applied successfully

---

**Time to Complete:** ~15 minutes
**Difficulty:** Beginner-friendly
**Prerequisites:** Basic knowledge of JavaScript/TypeScript and command line

Happy building! 🚀
