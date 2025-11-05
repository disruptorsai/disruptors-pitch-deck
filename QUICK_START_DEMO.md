# Quick Start: Disruptors Media Demo

This guide will get your demo presentation up and running in 5 minutes.

## ✅ Prerequisites Checklist

Make sure you have:
- [ ] Supabase project created
- [ ] `.env.local` file with Supabase credentials
- [ ] Base schema migration applied (`20250113_ai_presenter_schema.sql`)
- [ ] Sample data migration applied (`20250113_sample_data.sql`)

## 🚀 Apply Demo Data (2 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to https://app.supabase.com
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the Migration

1. Open `supabase/migrations/20250117_disruptors_complete_demo_data_FIXED.sql`
2. Copy all the contents (Ctrl+A, Ctrl+C)
3. Paste into the Supabase SQL Editor
4. Click **Run** or press **Ctrl+Enter**

### Step 3: Verify Success

You should see verification results at the bottom showing:
```
pricing_tiers: 3
team_members: 4
case_studies: 6
services: 6
```

If you see these numbers, you're ready to go! 🎉

## 🎬 Test the Presentation (3 minutes)

### Start the Dev Server

```bash
npm run dev
```

### Navigate Through All Pages

Visit these URLs to test the complete flow:

1. **Home** - http://localhost:5173/
   - Should show cinematic hero with Disruptors Media branding

2. **Dashboard** - http://localhost:5173/dashboard
   - Should show all 8 pages in a grid

3. **Introduction** - http://localhost:5173/introduction
   - Should show company intro with video placeholder

4. **Diagnostic** - http://localhost:5173/diagnostic
   - Should show competitive analysis (may show "Awaiting Analysis" for Disruptors Media)
   - For full analysis, switch to TechVenture client in admin

5. **Case Studies** - http://localhost:5173/casestudies
   - Should show **6 case studies**:
     - SaaS Scale-Up (327% ROI)
     - E-Commerce (2.4x ROAS)
     - Healthcare (445% ROI)
     - Manufacturing (47% cost reduction)
     - Professional Services (520% growth)
     - Real Estate (412% conversion)

6. **Capabilities** - http://localhost:5173/capabilities
   - Should show **6 services**:
     - AI-Powered Lead Generation
     - Content Engine Pro
     - Smart Analytics Dashboard
     - Automated Email Campaigns
     - Social Media Automation
     - CRM Integration & Automation

7. **Blueprint** - http://localhost:5173/blueprint
   - Should show personalized strategy recommendations
   - AI-selected services based on business analysis

8. **Pricing** - http://localhost:5173/pricing
   - Should show **3 pricing tiers**:
     - Launch ($2,500/mo)
     - Scale ($5,500/mo) - Featured
     - Dominate ($12,000/mo)

9. **Call to Action** - http://localhost:5173/calltoaction
   - Should show final CTA with booking link
   - Social media links
   - Auto-redirect to home after 60 seconds

## ✨ What's Included

Your demo now has:

### 📊 Data
- ✅ 6 Case Studies with real metrics
- ✅ 6 Services/Capabilities
- ✅ 3 Pricing Tiers
- ✅ 4 Team Members
- ✅ 2 Demo Clients (Disruptors Media + TechVenture prospect)
- ✅ Complete Competitive Analysis
- ✅ Access Links

### 🎨 Pages
- ✅ Home (cinematic landing)
- ✅ Dashboard (navigation hub)
- ✅ Introduction (company overview)
- ✅ Diagnostic (competitive analysis)
- ✅ Case Studies (proof of results)
- ✅ Capabilities (services showcase)
- ✅ Blueprint (AI-personalized strategy)
- ✅ Pricing (investment tiers)
- ✅ Call to Action (conversion)

## 🔧 Common Issues

### "No pricing tiers available yet"

**Solution:** The migration didn't apply. Check:
1. Supabase SQL Editor for errors
2. Table `ai_presenter_pricing_tiers` exists
3. Client ID matches: `c1111111-1111-1111-1111-111111111111`

### "No capabilities configured yet"

**Solution:** Services table needs data. Run:
```sql
SELECT COUNT(*) FROM ai_presenter_services
WHERE client_id = 'c1111111-1111-1111-1111-111111111111';
```
Should return 6. If not, reapply the sample data migration first.

### Competitive Analysis shows "Awaiting Analysis"

This is normal for the Disruptors Media client. The demo includes:
- **Disruptors Media** (`c1111111...`) - The agency (no competitive analysis)
- **TechVenture Solutions** (`c2222222...`) - Demo prospect (HAS competitive analysis)

To see the full diagnostic page with analysis:
1. Go to admin panel
2. Switch active client to TechVenture Solutions
3. Diagnostic page will now show full analysis

### Environment Variables Missing

Make sure `.env.local` has:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🎯 Next Steps

Now that your demo is working:

1. **Customize Branding**
   - Update colors in client record
   - Replace logo URL
   - Customize copy for your brand

2. **Add Real Data**
   - Replace demo case studies with your actual client work
   - Update team members with your actual team
   - Adjust pricing to your actual tiers

3. **Test Personalization**
   - Create a new prospect client
   - Add their competitive analysis
   - See AI-powered personalization in action

4. **Generate Access Links**
   - Use admin panel to create secure access links
   - Set expiration dates and view limits
   - Share with prospects

## 📚 Documentation

For more details:
- **Full Setup Guide**: `DEMO_DATA_SETUP.md`
- **Architecture**: `CLAUDE.md`
- **Migration Guide**: `docs/AI_PRESENTER_MIGRATION_COMPLETE.md`

## 💡 Pro Tips

1. **Test the Full Flow**: Click through all 8 pages in order to experience the complete presentation
2. **Check Mobile**: Open on your phone to test responsive design
3. **Try Personalization**: Add a new client and see how the presentation adapts
4. **Monitor Analytics**: Enable analytics tracking to see presentation engagement

## 🎉 You're Done!

Your AI Presenter demo is now fully populated with:
- 6 impressive case studies
- 6 AI-powered capabilities
- 3 tiered pricing options
- 4 team member profiles
- Complete competitive analysis example
- Professional branding and styling

Start customizing for your brand or use it as-is for demos!

---

**Need Help?**
- Check browser console for errors
- Review Supabase logs for database issues
- Verify all migrations have been applied in order
- Make sure client ID `c1111111-1111-1111-1111-111111111111` exists and is active
