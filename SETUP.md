# AI Presenter - Complete Setup Guide

This guide will walk you through setting up the AI Presenter application from scratch.

## 📋 Prerequisites

Before you begin, make sure you have:

- [ ] Node.js 18+ installed
- [ ] A Supabase account (free tier works)
- [ ] An Anthropic API key (for AI features)
- [ ] Git installed
- [ ] A code editor (VS Code recommended)

---

## 🚀 Step 1: Environment Setup

### 1.1 Install Dependencies

```bash
cd "disruptors-ai-pitch-deck-74a1c8d5 (1)"
npm install
```

### 1.2 Create Environment File

```bash
cp .env.example .env.local
```

### 1.3 Configure Environment Variables

Edit `.env.local` with your actual values:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Anthropic API (for AI features)
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Application URL
VITE_APP_URL=http://localhost:5173
```

**Where to find these:**
- Supabase keys: https://app.supabase.com/project/YOUR_PROJECT/settings/api
- Anthropic API key: https://console.anthropic.com/

---

## 🗄️ Step 2: Database Setup

### 2.1 Apply Main Schema Migration

1. Open Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/20250113_ai_presenter_schema.sql`
4. Paste and click "Run"
5. Wait for confirmation (should take 5-10 seconds)

### 2.2 Apply Pricing Tiers Migration

1. In SQL Editor, click "New Query"
2. Copy contents of `supabase/migrations/20250114_add_pricing_tiers.sql`
3. Paste and click "Run"

### 2.3 Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Click "Create new bucket"
3. Configure:
   - **Name:** `ai-presenter-files`
   - **Public:** Unchecked (private)
   - **File size limit:** 52428800 (50MB)
   - **Allowed MIME types:** Leave empty (all types)
4. Click "Create bucket"

### 2.4 Verify Setup

Run this SQL query to verify tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'ai_presenter_%'
ORDER BY table_name;
```

You should see 12 tables:
- ai_presenter_access_links
- ai_presenter_analytics_events
- ai_presenter_cache
- ai_presenter_case_studies
- ai_presenter_clients
- ai_presenter_competitive_analysis
- ai_presenter_file_uploads
- ai_presenter_presentations
- ai_presenter_pricing_tiers
- ai_presenter_services
- ai_presenter_slides
- ai_presenter_team_members

---

## 🧪 Step 3: Test the Application

### 3.1 Start Development Server

```bash
npm run dev
```

The app should start at http://localhost:5173

### 3.2 Access Admin Dashboard

Open your browser and navigate to:
```
http://localhost:5173/admin
```

You should see the admin dashboard with:
- Overview statistics
- Quick actions
- Recent clients section

### 3.3 Test Database Connection

1. Click "New Client" in the admin dashboard
2. If you see the form, database connection is working!

---

## 📊 Step 4: Add Sample Data (Optional)

### 4.1 Create Your First Client

Using the admin dashboard:

1. Go to http://localhost:5173/admin/clients
2. Click "New Client"
3. Fill in:
   - **Name:** Demo Client
   - **Slug:** demo-client
   - **Description:** A sample client for testing
   - **Status:** Active

Or use SQL:

```sql
INSERT INTO ai_presenter_clients (name, slug, description, status)
VALUES ('Demo Client', 'demo-client', 'A sample client for testing', 'active');
```

### 4.2 Add Sample Pricing Tiers

Uncomment the sample data in `supabase/migrations/20250114_add_pricing_tiers.sql` and run it, or use this SQL:

```sql
INSERT INTO ai_presenter_pricing_tiers (name, slug, description, price, features, sort_order, is_highlighted, badge_text, cta_text) VALUES
    (
        'Starter',
        'starter',
        'Perfect for small businesses getting started with AI',
        2500.00,
        '["Lead Generation System", "Basic Analytics", "Email Support", "1 User Account"]'::jsonb,
        0,
        false,
        null,
        'Start Growing'
    ),
    (
        'Growth',
        'growth',
        'Ideal for growing businesses ready to scale',
        5000.00,
        '["Everything in Starter", "Paid Advertising", "SEO Optimization", "Priority Support", "5 Users"]'::jsonb,
        1,
        true,
        'Most Popular',
        'Scale Your Business'
    );
```

### 4.3 Generate Access Link

1. Go to http://localhost:5173/admin/access-links
2. Click "Generate New Link"
3. Select your client
4. Enter a name like "Test Link"
5. Click "Generate Link"
6. Copy the generated URL and test it!

---

## ✅ Step 5: Verify Everything Works

### Checklist

- [ ] Admin dashboard loads at `/admin`
- [ ] Clients page shows client list
- [ ] Access links can be generated
- [ ] Presentation pages load (Home, Dashboard, etc.)
- [ ] No console errors in browser
- [ ] Database queries work (check Network tab)

### Common Issues

#### "Multiple GoTrueClient instances" Warning
**Fix:** This is just a warning and won't affect functionality. Ignore it for now.

#### "Supabase credentials not found"
**Fix:** Make sure `.env.local` exists and has the correct VITE_ prefixes.

#### Tables don't exist
**Fix:** Re-run the SQL migrations in Supabase SQL Editor.

#### Port 5173 already in use
**Fix:** Kill the process using that port or use `npm run dev -- --port 3000`

---

## 🏗️ Step 6: Build for Production

### 6.1 Test Production Build

```bash
npm run build
npm run preview
```

This builds the app and serves it locally to test production behavior.

### 6.2 Deploy to Netlify

**Option A: Using Netlify CLI**

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

**Option B: Connect GitHub Repository**

1. Push code to GitHub
2. Go to Netlify Dashboard
3. Click "Import from Git"
4. Select your repository
5. Build settings are auto-detected from `netlify.toml`
6. Add environment variables in Netlify UI:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_SUPABASE_SERVICE_ROLE_KEY
   - ANTHROPIC_API_KEY
   - VITE_APP_URL (set to your Netlify URL)
7. Click "Deploy"

---

## 🎨 Step 7: Customize

### Update Branding

Edit these files:
- `src/pages/admin/AdminLayout.jsx` - Admin branding
- `src/pages/Layout.jsx` - Public presentation branding
- `tailwind.config.js` - Colors and design tokens

### Add Custom Pages

1. Create new component in `src/pages/admin/`
2. Add route in `src/pages/index.jsx`
3. Add navigation item in `src/pages/admin/AdminLayout.jsx`

---

## 📚 Step 8: Learn the Features

### Admin Features

- **Dashboard** (`/admin`) - Overview and quick actions
- **Clients** (`/admin/clients`) - Manage client profiles
- **Access Links** (`/admin/access-links`) - Generate secure presentation links
- **Analytics** (Coming soon) - View presentation metrics
- **Content** (Coming soon) - Edit slides and content
- **Settings** (Coming soon) - Configure application

### Presentation Features

- **Home** - Cinematic landing page
- **Dashboard** - Navigation hub
- **Introduction** - Company overview
- **Diagnostic** - AI-powered competitive analysis
- **Case Studies** - Portfolio showcase
- **Capabilities** - Service offerings
- **Blueprint** - Recommended strategy
- **Pricing** - Investment tiers
- **Call to Action** - Booking page

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore` for a reason
2. **Rotate keys regularly** - Especially if they're exposed
3. **Use strong passwords** - For access link protection
4. **Set expiration dates** - On all access links
5. **Monitor view counts** - Watch for suspicious activity
6. **Enable RLS** - All tables have Row Level Security enabled
7. **Use HTTPS** - Always in production

---

## 🆘 Getting Help

### Documentation

- [Main README](./README.md)
- [Migration Guide](./docs/AI_PRESENTER_MIGRATION_COMPLETE.md)
- [Installation Guide](./INSTALLATION.md)

### Troubleshooting

1. Check browser console for errors
2. Check Supabase logs in dashboard
3. Verify environment variables are set correctly
4. Make sure migrations ran successfully
5. Check that storage bucket was created

### Support Resources

- Supabase Docs: https://supabase.com/docs
- Vite Docs: https://vitejs.dev
- React Router Docs: https://reactrouter.com

---

## 🎉 You're Ready!

Your AI Presenter installation is complete. Here's what to do next:

1. **Create your first client** in the admin dashboard
2. **Generate an access link** to share presentations
3. **Customize the branding** to match your company
4. **Add your content** (case studies, services, team members)
5. **Set up analytics** to track engagement

Welcome to AI Presenter! 🚀

---

**Need more help?** Check out the full documentation in the `docs/` folder.
