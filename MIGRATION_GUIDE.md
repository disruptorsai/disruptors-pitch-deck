# Disruptors Media Database Migration Guide

This guide walks you through applying 4 database migrations to populate your Supabase database with real Disruptors Media data.

## Overview

**Migrations to Apply:**
1. `20251020_disruptors_healthcare_data.sql` - 6 real healthcare case studies (3-12.5X ROI)
2. `20251020_disruptors_services_data.sql` - 9 AI-powered marketing service offerings
3. `20251020_disruptors_pricing_data.sql` - 4 pricing tiers (Agency $850 - Enterprise $5,000+)
4. `20251020_add_conversation_tracking.sql` - Conversation tracking tables for ICP responses

**Target Client ID:** `c1111111-1111-1111-1111-111111111111`

---

## Quick Start

### Option 1: Automated Script (Recommended)

```bash
# Run the automated migration script
node scripts/apply-disruptors-migrations.js
```

This script will guide you through each migration step-by-step.

### Option 2: Manual Application

Follow the steps below to manually apply each migration.

---

## Manual Migration Steps

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard
2. Navigate to: **SQL Editor** → **New Query**
3. Or use this direct link: `https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/sql/new`

---

### Migration 1: Healthcare Case Studies

**File:** `supabase/migrations/20251020_disruptors_healthcare_data.sql`

**What it does:**
- Deletes existing demo case studies
- Inserts 6 real healthcare case studies with proven ROI metrics
- Case studies range from 3X to 12.5X ROI

**To Apply:**
1. Open the file: `supabase/migrations/20251020_disruptors_healthcare_data.sql`
2. Copy the entire SQL content
3. Paste into Supabase SQL Editor
4. Click "Run" (or Ctrl+Enter)
5. Verify: Should see "SUCCESS: 6 healthcare case studies inserted"

**Expected Result:**
```
✅ 6 case studies for client c1111111-1111-1111-1111-111111111111
   1. Wellness & Hormone Therapy Clinic (3.5X ROI)
   2. Telehealth Provider (4X ROI)
   3. Aesthetic & Body Contouring Clinic (3.3X ROI)
   4. Specialized Medical Services Practice (3X ROI)
   5. Regional Multi-Location Clinic (4X ROI)
   6. Enterprise-Scale Healthcare Campaign (12.5X ROI)
```

---

### Migration 2: Service Offerings

**File:** `supabase/migrations/20251020_disruptors_services_data.sql`

**What it does:**
- Deletes existing demo services
- Inserts 9 AI-powered marketing service offerings
- Each service includes performance metrics and features

**To Apply:**
1. Open the file: `supabase/migrations/20251020_disruptors_services_data.sql`
2. Copy the entire SQL content
3. Paste into Supabase SQL Editor
4. Click "Run" (or Ctrl+Enter)
5. Verify: Should see "SUCCESS: 9 service offerings inserted"

**Expected Result:**
```
✅ 9 services for client c1111111-1111-1111-1111-111111111111
   1. Social Media Marketing ⭐
   2. AI Automation ⭐
   3. Lead Generation ⭐
   4. CRM Management
   5. Paid Advertising ⭐
   6. SEO & GEO
   7. Custom Apps
   8. Fractional CMO
   9. Podcasting
```

---

### Migration 3: Pricing Tiers

**File:** `supabase/migrations/20251020_disruptors_pricing_data.sql`

**What it does:**
- Deletes existing demo pricing tiers
- Inserts 4 pricing tiers with service mappings
- Tiers range from $850/month to $5,000+/month

**To Apply:**
1. Open the file: `supabase/migrations/20251020_disruptors_pricing_data.sql`
2. Copy the entire SQL content
3. Paste into Supabase SQL Editor
4. Click "Run" (or Ctrl+Enter)
5. Verify: Should see "SUCCESS: 4 pricing tiers inserted"

**Expected Result:**
```
✅ 4 pricing tiers for client c1111111-1111-1111-1111-111111111111
   1. Agency Plan: $850/month
   2. Growth Plan: $1,500/month ⭐ (Most Popular)
   3. Executive Plan: $3,500/month
   4. Enterprise Plan: $5,000+/month
```

---

### Migration 4: Conversation Tracking

**File:** `supabase/migrations/20251020_add_conversation_tracking.sql`

**What it does:**
- Creates `ai_presenter_conversation_responses` table
- Creates `ai_presenter_conversation_progress` table
- Sets up RLS policies for conversation tracking
- Adds helper functions for conversation context

**To Apply:**
1. Open the file: `supabase/migrations/20251020_add_conversation_tracking.sql`
2. Copy the entire SQL content
3. Paste into Supabase SQL Editor
4. Click "Run" (or Ctrl+Enter)
5. Verify: Should see "Success. No rows returned"

**Expected Result:**
```
✅ Tables created:
   - ai_presenter_conversation_responses
   - ai_presenter_conversation_progress
✅ RLS policies enabled
✅ Helper functions created:
   - ai_presenter_get_conversation_context()
   - ai_presenter_calculate_recommended_tier()
```

---

## Verification

### Automated Verification

Run the verification script to check all migrations:

```bash
node scripts/verify-disruptors-migrations.js
```

**Expected Output:**
```
✅ 1. Healthcare Case Studies (6 records)
✅ 2. Service Offerings (9 records)
✅ 3. Pricing Tiers (4 records)
✅ 4. Conversation Tracking Tables
```

### Manual Verification

Run these queries in the Supabase SQL Editor:

```sql
-- Verify case studies (should return 6)
SELECT COUNT(*) FROM ai_presenter_case_studies
WHERE client_id = 'c1111111-1111-1111-1111-111111111111';

-- Verify services (should return 9)
SELECT COUNT(*) FROM ai_presenter_services
WHERE client_id = 'c1111111-1111-1111-1111-111111111111';

-- Verify pricing tiers (should return 4)
SELECT COUNT(*) FROM ai_presenter_pricing_tiers
WHERE client_id = 'c1111111-1111-1111-1111-111111111111';

-- Verify conversation tables exist
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'ai_presenter_conversation_responses'
) AS responses_exists,
EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'ai_presenter_conversation_progress'
) AS progress_exists;
```

---

## RLS Policy Verification

Verify Row Level Security policies are active:

```sql
-- Check RLS is enabled on all tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename LIKE 'ai_presenter_%'
ORDER BY tablename;
```

All tables should show `rowsecurity = true`.

---

## Troubleshooting

### Case Studies Not Showing

**Problem:** Case studies display is empty

**Solution:**
1. Run verification query to check record count
2. Verify client_id matches: `c1111111-1111-1111-1111-111111111111`
3. Check RLS policies allow public read access
4. Clear browser cache and reload

### Services Not Displaying

**Problem:** Service offerings not visible

**Solution:**
1. Verify `is_visible = true` for all services
2. Check `order_index` is set correctly (1-9)
3. Ensure client_id matches
4. Check RLS policies

### Pricing Tiers Missing

**Problem:** Pricing page is empty

**Solution:**
1. Verify `is_active = true` for all tiers
2. Check `sort_order` is set correctly (1-4)
3. Ensure `included_services` array references valid service slugs
4. Verify client_id

### Conversation Tracking Not Working

**Problem:** ICP responses not saving

**Solution:**
1. Verify tables exist using information_schema query
2. Check RLS policies allow public INSERT
3. Verify `session_id` is being generated client-side
4. Check browser console for errors

---

## Next Steps

After all migrations are applied:

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Pages:**
   - Home page: http://localhost:5176
   - Case Studies: http://localhost:5176/CaseStudies
   - Blueprint (Services): http://localhost:5176/Blueprint
   - Pricing: http://localhost:5176/Pricing
   - Diagnostic (ICP): http://localhost:5176/Diagnostic

3. **Verify Data Display:**
   - Case studies show real healthcare examples
   - Service offerings show 9 services with metrics
   - Pricing tiers display correctly with features
   - Conversation tracking saves responses

4. **Test Functionality:**
   - Case study metrics display correctly
   - Service selection in Blueprint
   - Pricing tier comparison
   - ICP question responses save to database

---

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Run verification script: `node scripts/verify-disruptors-migrations.js`
3. Check Supabase logs in Dashboard → Logs
4. Review RLS policies in Dashboard → Authentication → Policies

---

## Migration Files Reference

All migration files are located in: `supabase/migrations/`

- `20251020_disruptors_healthcare_data.sql` (6.5 KB)
- `20251020_disruptors_services_data.sql` (7.2 KB)
- `20251020_disruptors_pricing_data.sql` (5.8 KB)
- `20251020_add_conversation_tracking.sql` (6.4 KB)

**Total:** ~26 KB of SQL migrations

---

## Rollback (If Needed)

To rollback migrations:

```sql
-- Rollback case studies
DELETE FROM ai_presenter_case_studies
WHERE client_id = 'c1111111-1111-1111-1111-111111111111';

-- Rollback services
DELETE FROM ai_presenter_services
WHERE client_id = 'c1111111-1111-1111-1111-111111111111';

-- Rollback pricing tiers
DELETE FROM ai_presenter_pricing_tiers
WHERE client_id = 'c1111111-1111-1111-1111-111111111111';

-- Rollback conversation tracking (CAUTION: Drops tables)
DROP TABLE IF EXISTS ai_presenter_conversation_responses CASCADE;
DROP TABLE IF EXISTS ai_presenter_conversation_progress CASCADE;
DROP FUNCTION IF EXISTS ai_presenter_get_conversation_context(TEXT);
DROP FUNCTION IF EXISTS ai_presenter_calculate_recommended_tier(TEXT[]);
```

---

## Success Checklist

- [ ] Migration 1: 6 healthcare case studies inserted
- [ ] Migration 2: 9 service offerings inserted
- [ ] Migration 3: 4 pricing tiers inserted
- [ ] Migration 4: Conversation tracking tables created
- [ ] Verification script passes all checks
- [ ] RLS policies are active on all tables
- [ ] Application displays data correctly
- [ ] Conversation tracking saves responses

---

**Last Updated:** October 20, 2025
**Version:** 1.0.0
