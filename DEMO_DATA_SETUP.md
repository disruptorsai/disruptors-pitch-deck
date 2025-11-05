# Demo Data Setup Guide

This guide will help you populate your AI Presenter application with comprehensive demo data for Disruptors Media.

## Overview

The complete demo data includes:

- **3 Pricing Tiers**: Launch ($2,500/mo), Scale ($5,500/mo), Dominate ($12,000/mo)
- **4 Team Members**: AI Officer, Growth Lead, Analytics Director, Creative Director
- **6 Case Studies**: SaaS, E-Commerce, Healthcare, Manufacturing, Professional Services, Real Estate
- **6 Services/Capabilities**: AI Lead Generation, Content Engine, Analytics Dashboard, Email Campaigns, Social Media Automation, CRM Integration
- **2 Clients**:
  - Disruptors Media (demo agency)
  - TechVenture Solutions (demo prospect with competitive analysis)
- **Access Links**: Pre-configured demo links

## Prerequisites

1. Supabase project created and configured
2. Base schema migration applied (`20250113_ai_presenter_schema.sql`)
3. Sample data migration applied (`20250113_sample_data.sql`)
4. Supabase credentials in `.env.local`

## Step-by-Step Application

### Option 1: Supabase Dashboard (Recommended)

1. **Log into Supabase Dashboard**
   - Navigate to your project at https://app.supabase.com

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Apply Migration**
   - Copy the contents of `supabase/migrations/20250117_disruptors_complete_demo_data_FIXED.sql`
   - Paste into the SQL editor
   - Click "Run" or press `Ctrl+Enter`

4. **Verify Success**
   - Scroll to the bottom of the results
   - You should see verification query results showing:
     - 3 pricing tiers
     - 4 team members
     - 6 case studies
     - 6 services

### Option 2: Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push

# Or apply specific migration
supabase db execute < supabase/migrations/20250117_disruptors_complete_demo_data_FIXED.sql
```

### Option 3: Direct psql Connection

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run migration
\i supabase/migrations/20250117_disruptors_complete_demo_data_FIXED.sql
```

## Verification

After applying the migration, verify the data:

### Check Pricing Tiers

```sql
SELECT name, price, billing_period, is_highlighted
FROM ai_presenter_pricing_tiers
WHERE client_id = 'c1111111-1111-1111-1111-111111111111'
ORDER BY sort_order;
```

Expected: 3 rows (Launch, Scale, Dominate)

### Check Team Members

```sql
SELECT name, role
FROM ai_presenter_team_members
WHERE client_id = 'c1111111-1111-1111-1111-111111111111'
ORDER BY sort_order;
```

Expected: 4 rows (Sarah Chen, Marcus Rodriguez, Aisha Patel, James O'Sullivan)

### Check Case Studies

```sql
SELECT title, industry
FROM ai_presenter_case_studies
WHERE client_id = 'c1111111-1111-1111-1111-111111111111'
ORDER BY sort_order;
```

Expected: 6 rows across various industries

### Check Services

```sql
SELECT name, pricing_model
FROM ai_presenter_services
WHERE client_id = 'c1111111-1111-1111-1111-111111111111'
ORDER BY sort_order;
```

Expected: 6 rows (Lead Generation, Content Engine, Analytics, Email, Social, CRM)

## Testing the Presentation

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Navigate Through Pages**
   - Home: `/` - Should show cinematic landing
   - Dashboard: `/dashboard` - Should show all 8 pages
   - Introduction: `/introduction` - Should show Disruptors Media intro
   - Diagnostic: `/diagnostic` - Should show competitive analysis (if client has data)
   - Case Studies: `/casestudies` - Should show 6 case studies
   - Capabilities: `/capabilities` - Should show 6 services
   - Blueprint: `/blueprint` - Should show AI-selected services
   - Pricing: `/pricing` - Should show 3 pricing tiers
   - Call to Action: `/calltoaction` - Should show final CTA

3. **Test with Demo Client**

   To see the full presentation with competitive analysis:

   - The migration creates a demo prospect "TechVenture Solutions"
   - This client has complete competitive analysis data
   - Access via admin panel to switch active client

## Data Structure Reference

### Pricing Tiers

- **Launch**: Entry-level tier for testing AI marketing
- **Scale**: Mid-tier with full automation suite (marked as featured)
- **Dominate**: Enterprise tier with custom AI and fractional CMO

### Team Members

- **Sarah Chen**: Chief AI Officer - ML and AI strategy
- **Marcus Rodriguez**: Head of Growth Systems - Marketing automation
- **Dr. Aisha Patel**: Director of Analytics - Data science and insights
- **James O'Sullivan**: Creative Director - Brand and creative strategy

### Case Studies

1. **SaaS Scale-Up**: 327% revenue growth
2. **E-Commerce**: 2.4x ROAS improvement
3. **Healthcare**: 445% ROI, patient acquisition
4. **Manufacturing**: Supply chain optimization, 47% cost reduction
5. **Professional Services**: 520% client increase
6. **Real Estate**: 412% conversion improvement

## Customization

To customize the demo data for your own brand:

1. **Update Client Information**
   ```sql
   UPDATE ai_presenter_clients
   SET
     name = 'Your Company Name',
     description = 'Your description',
     website = 'https://yourwebsite.com',
     logo_url = 'https://your-logo-url.com/logo.png',
     primary_color = '#YOUR_COLOR',
     secondary_color = '#YOUR_COLOR'
   WHERE id = 'c1111111-1111-1111-1111-111111111111';
   ```

2. **Update Team Members**
   - Modify names, roles, bios, and LinkedIn URLs
   - Replace image URLs with your team photos

3. **Customize Case Studies**
   - Update industries to match your target market
   - Modify metrics to reflect your actual results
   - Adjust accent colors to match your brand

4. **Adjust Pricing**
   - Update price_monthly and price_annual values
   - Modify features lists
   - Change tier names and descriptions

## Troubleshooting

### Migration Fails with "relation already exists"

This means you've already applied this migration. You can:

1. Drop the existing data and reapply (WARNING: destroys data):
   ```sql
   DELETE FROM ai_presenter_pricing_tiers WHERE client_id = 'c1111111-1111-1111-1111-111111111111';
   DELETE FROM ai_presenter_team_members WHERE client_id = 'c1111111-1111-1111-1111-111111111111';
   -- Then reapply migration
   ```

2. Or skip this migration and manually update existing records

### No Data Showing in Application

1. Check that client_id matches: `c1111111-1111-1111-1111-111111111111`
2. Verify client is marked as `is_active = true`
3. Check browser console for API errors
4. Verify Supabase credentials in `.env.local`

### RLS Policy Errors

Make sure you're using the correct SDK:
- Public SDK (`sdk`) for read operations
- Admin SDK (`adminSDK`) for write operations

## Next Steps

After applying the demo data:

1. **Test All Pages**: Click through the entire presentation flow
2. **Customize Branding**: Update colors, logos, and copy to match your brand
3. **Add Real Data**: Replace demo case studies with your actual client work
4. **Configure Analytics**: Enable analytics tracking in `.env.local`
5. **Generate Access Links**: Create secure links for client presentations

## Support

For issues or questions:
- Check `CLAUDE.md` for architecture details
- Review `docs/AI_PRESENTER_MIGRATION_COMPLETE.md` for comprehensive guide
- Check Supabase logs for database errors
- Verify environment variables are set correctly

## Summary

This migration provides a complete, realistic demo of the AI Presenter application with:

✅ Full presentation flow data
✅ Realistic case studies with metrics
✅ Professional team profiles
✅ Tiered pricing structure
✅ Competitive analysis example
✅ Branded styling and configuration

The demo showcases all features and can be easily customized for your specific use case.
