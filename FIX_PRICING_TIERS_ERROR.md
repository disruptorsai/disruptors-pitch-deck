# Fix: Pricing Tiers Table Missing

## The Error You're Seeing

```
ERROR:  42P01: relation "ai_presenter_pricing_tiers" does not exist
LINE 13: INSERT INTO ai_presenter_pricing_tiers (
```

## What It Means

You tried to insert data into the `ai_presenter_pricing_tiers` table, but that table doesn't exist yet. You need to create it first!

## The Fix (2 minutes)

### Step 1: Create the Pricing Tiers Table

1. Open Supabase SQL Editor: https://app.supabase.com
2. Click **SQL Editor** → **New Query**
3. Copy the entire contents of: `supabase/migrations/20250114_add_pricing_tiers.sql`
4. Paste into SQL Editor
5. Click **Run** (or press Ctrl+Enter)

You should see:
```
CREATE TABLE
CREATE INDEX
CREATE INDEX
CREATE INDEX
CREATE INDEX
CREATE TRIGGER
ALTER TABLE
CREATE POLICY
CREATE POLICY
CREATE POLICY
COMMENT
```

### Step 2: Now Run the Demo Data

1. Still in Supabase SQL Editor
2. Clear the query box
3. Copy the entire contents of: `supabase/migrations/20250117_disruptors_complete_demo_data_FIXED.sql`
4. Paste into SQL Editor
5. Click **Run** (or press Ctrl+Enter)

You should see at the bottom:
```
pricing_tiers: 3
team_members: 4
case_studies: 6
services: 6
```

## Done! ✅

Your demo data is now loaded:
- 3 pricing tiers (Launch $2.5k, Scale $5.5k, Dominate $12k/month)
- 4 team members
- 6 case studies
- 6 services

Test it:
```bash
npm run dev
```

Visit: http://localhost:5173/pricing

You should see 3 beautiful pricing tiers! 🎉

---

## Why This Happened

The demo data migration (`20250117`) tries to insert pricing tier data, but the pricing tiers table is created in a different migration (`20250114`).

You must create the table **before** inserting data into it.

**Correct order:**
1. Create schema (tables, functions, etc.)
2. Create pricing tiers table ← **You missed this!**
3. Insert demo data

---

## Need More Help?

- **Full migration order:** `MIGRATION_ORDER.md`
- **Quick start guide:** `QUICK_START_DEMO.md`
- **Comprehensive setup:** `DEMO_DATA_SETUP.md`

---

**TL;DR:** Run `20250114_add_pricing_tiers.sql` first, THEN run `20250117_disruptors_complete_demo_data_FIXED.sql`
