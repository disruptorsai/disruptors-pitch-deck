# Database Migration Order

Apply these migrations in **exact order** via Supabase SQL Editor.

## Prerequisites

- Supabase project created
- SQL Editor access
- `.env.local` configured with Supabase credentials

## Migration Sequence

### ✅ Step 1: Main Schema (REQUIRED)
**File:** `supabase/migrations/20250113_ai_presenter_schema.sql`

Creates the core database structure:
- 11 base tables (clients, presentations, slides, services, etc.)
- RLS policies
- Helper functions
- Indexes

**Apply this first!** This is the foundation.

### ✅ Step 2: Sample Data (OPTIONAL)
**File:** `supabase/migrations/20250113_sample_data.sql`

Adds basic demo data:
- Disruptors Media client
- 3 case studies (SaaS, E-Commerce, Healthcare)
- 6 services/capabilities
- 1 default presentation

**You can skip this if you want to start fresh**, but it's helpful for testing.

### ✅ Step 3: Pricing Tiers Table (REQUIRED for Demo Data)
**File:** `supabase/migrations/20250114_add_pricing_tiers.sql`

Creates the pricing tiers table:
- `ai_presenter_pricing_tiers` table
- Indexes and RLS policies
- Triggers

**MUST run this before Step 5!** The demo data migration inserts pricing tiers.

### ✅ Step 4: Client Intelligence (OPTIONAL)
**File:** `supabase/migrations/20250114_add_comprehensive_client_intelligence.sql`

Adds advanced client analytics features:
- Additional client fields
- Intelligence tracking
- Enhanced metadata

**Optional but recommended** for full functionality.

### ✅ Step 5: Complete Demo Data (THIS IS WHAT YOU WANT)
**File:** `supabase/migrations/20250117_disruptors_complete_demo_data_FIXED.sql`

Adds comprehensive demo data:
- **3 pricing tiers** (Launch, Scale, Dominate)
- **6 case studies** (adds 3 more to the existing 3)
- **4 team members** (Sarah Chen, Marcus Rodriguez, Dr. Aisha Patel, James O'Sullivan)
- **2 demo clients** (Disruptors Media + TechVenture with competitive analysis)
- **Access links** for testing

**Run this last!** Depends on all previous tables existing.

---

## Quick Apply (Copy/Paste Order)

Open Supabase SQL Editor and run these **one at a time** in order:

```sql
-- 1. Main Schema (copy entire file)
-- supabase/migrations/20250113_ai_presenter_schema.sql
-- ⚠️ Run this first!

-- 2. Sample Data (optional - copy entire file)
-- supabase/migrations/20250113_sample_data.sql

-- 3. Pricing Tiers Table (copy entire file)
-- supabase/migrations/20250114_add_pricing_tiers.sql
-- ⚠️ MUST run before demo data!

-- 4. Client Intelligence (optional - copy entire file)
-- supabase/migrations/20250114_add_comprehensive_client_intelligence.sql

-- 5. Complete Demo Data (copy entire file)
-- supabase/migrations/20250117_disruptors_complete_demo_data_FIXED.sql
-- ✅ Run this to get full demo
```

---

## Your Current Error

```
ERROR:  42P01: relation "ai_presenter_pricing_tiers" does not exist
```

**What it means:** You tried to run Step 5 (demo data) before Step 3 (pricing tiers table).

**Solution:** Run Step 3 first, then run Step 5 again.

---

## Verification

After applying all migrations, verify with:

```sql
-- Check that all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'ai_presenter_%'
ORDER BY table_name;

-- Should return these tables:
-- ai_presenter_access_links
-- ai_presenter_analytics_events
-- ai_presenter_cache
-- ai_presenter_case_studies
-- ai_presenter_clients
-- ai_presenter_competitive_analysis
-- ai_presenter_file_uploads
-- ai_presenter_presentations
-- ai_presenter_pricing_tiers ← Must see this!
-- ai_presenter_services
-- ai_presenter_slides
-- ai_presenter_team_members

-- Check demo data counts
SELECT
  (SELECT COUNT(*) FROM ai_presenter_pricing_tiers) as pricing_tiers,
  (SELECT COUNT(*) FROM ai_presenter_team_members) as team_members,
  (SELECT COUNT(*) FROM ai_presenter_case_studies) as case_studies,
  (SELECT COUNT(*) FROM ai_presenter_services) as services;

-- Should return:
-- pricing_tiers: 3
-- team_members: 4
-- case_studies: 6
-- services: 6
```

---

## Troubleshooting

### "Table already exists"
**Cause:** You already ran that migration.
**Solution:** Skip it and continue to the next one.

### "Function does not exist"
**Cause:** You skipped Step 1 (main schema).
**Solution:** Go back and run Step 1 first.

### "Relation does not exist"
**Cause:** You skipped a required migration.
**Solution:** Check which table is missing and run the migration that creates it.

### "Duplicate key value"
**Cause:** You're trying to insert data that already exists.
**Solution:** Either:
- Delete existing data first, OR
- Skip the migration if data is already there

---

## Clean Slate (Start Over)

If you want to start completely fresh:

```sql
-- ⚠️ WARNING: This deletes ALL data! ⚠️
DROP TABLE IF EXISTS ai_presenter_pricing_tiers CASCADE;
DROP TABLE IF EXISTS ai_presenter_team_members CASCADE;
DROP TABLE IF EXISTS ai_presenter_competitive_analysis CASCADE;
DROP TABLE IF EXISTS ai_presenter_analytics_events CASCADE;
DROP TABLE IF EXISTS ai_presenter_file_uploads CASCADE;
DROP TABLE IF EXISTS ai_presenter_cache CASCADE;
DROP TABLE IF EXISTS ai_presenter_slides CASCADE;
DROP TABLE IF EXISTS ai_presenter_case_studies CASCADE;
DROP TABLE IF EXISTS ai_presenter_services CASCADE;
DROP TABLE IF EXISTS ai_presenter_presentations CASCADE;
DROP TABLE IF EXISTS ai_presenter_access_links CASCADE;
DROP TABLE IF EXISTS ai_presenter_clients CASCADE;

-- Then run all migrations from Step 1 again
```

---

## Summary for Your Situation

**What to do right now:**

1. Open Supabase SQL Editor
2. Copy/paste `supabase/migrations/20250114_add_pricing_tiers.sql`
3. Click Run
4. Wait for success message
5. Copy/paste `supabase/migrations/20250117_disruptors_complete_demo_data_FIXED.sql`
6. Click Run
7. Verify with the verification query above

**Expected result:**
- 3 pricing tiers
- 4 team members
- 6 case studies
- 6 services

Then your demo will be fully populated! 🎉

---

**Files:**
- This guide: `MIGRATION_ORDER.md`
- Quick start: `QUICK_START_DEMO.md`
- Full guide: `DEMO_DATA_SETUP.md`
