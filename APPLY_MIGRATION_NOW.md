# 🚀 APPLY MIGRATION NOW - Quick Guide

## You Need To Do This Manually (2 Minutes)

Supabase requires SQL migrations to be run via their SQL Editor for security.

---

## Step 1: Open SQL Editor

**Click this link** (or the browser window that just opened):

```
https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/sql/new
```

---

## Step 2: Copy & Paste This SQL

```sql
DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;
CREATE POLICY "Public can view active clients" ON ai_presenter_clients FOR SELECT USING (status = 'active');
```

---

## Step 3: Run It

Click **"Run"** button (or press `Ctrl+Enter`)

You should see: **"Success. No rows returned"**

---

## Step 4: Verify It Worked

Open a terminal and run:

```bash
cd "C:\Users\Will\OneDrive\Documents\Projects\AI Presenter\disruptors-ai-pitch-deck-74a1c8d5 (1)\disruptors-pitch-deck"
node scripts/test-rls-policy.js
```

**Expected output:**
```
✅ RLS POLICY IS WORKING CORRECTLY
```

---

## That's It!

Your 406 errors should now be resolved.

**Need more details?** See `MIGRATION_INSTRUCTIONS.md` or `RLS_MIGRATION_SUMMARY.md`
