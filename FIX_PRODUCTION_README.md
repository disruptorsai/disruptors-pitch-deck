# Fix Production Database - Complete Guide

## Issues Fixed

This guide addresses the following production issues:

1. ✅ **Slides not loading** - Column name mismatch (`is_active` vs `is_visible`)
2. ✅ **406 error on clients endpoint** - Missing RLS policies for public read access
3. ✅ **Invalid regex pattern error** - HTML pattern attribute in ClientForm.jsx

## What Was Fixed in Code

### 1. Slides Migration File
**File:** `supabase/migrations/20250117_populate_slides.sql`

**Changed:**
- Column `is_active` → `is_visible` (lines 45 and 286)

**Why:** The database schema uses `is_visible`, but the migration script was trying to insert `is_active`, causing slides to fail to populate.

### 2. Client Form Regex Pattern
**File:** `src/pages/admin/ClientForm.jsx` (line 199)

**Changed:**
- Pattern `^[a-z0-9-]+$` → `[a-z0-9\-]+`

**Why:** Modern browsers with unicode regex mode require hyphens in character classes to be escaped or placed at the beginning/end. The original pattern was causing a SyntaxError.

## Steps to Fix Production Database

### Step 1: Apply RLS Policies (Supabase Dashboard)

The 406 error means your production database doesn't have the necessary Row Level Security policies to allow public read access.

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/YOUR_PROJECT
   - Click on **SQL Editor**

2. **Run the RLS Policy Migration**
   - Click **New Query**
   - Copy the entire contents of: `supabase/migrations/20250117_add_public_read_policy_clean.sql`
   - Paste into the SQL editor
   - Click **Run**

3. **Verify Success**
   - You should see: "Success. No rows returned"
   - This creates policies for public read access to:
     - `ai_presenter_clients` (active clients only)
     - `ai_presenter_presentations`
     - `ai_presenter_slides`
     - `ai_presenter_services`
     - `ai_presenter_case_studies`
     - `ai_presenter_competitive_analysis`
     - `ai_presenter_team_members`
     - `ai_presenter_file_uploads`

### Step 2: Populate Slides (Run Script Locally)

Now populate the slides with the correct schema:

```bash
# Make sure you're in the project directory
cd disruptors-pitch-deck

# Run the fix script
node fix-production.js
```

**Expected Output:**
```
🚀 Fixing Production Database

📋 Step 1: Applying RLS Policies
   Note: RLS policies need to be applied manually in Supabase SQL Editor

📋 Step 2: Populating Slides with Correct Schema
   ✓ Presentation ID: [uuid]
   ✓ Cleared existing slides
   📝 Inserting 9 slides...
   ✅ Successfully inserted 9 slides

📋 Step 3: Verifying Public Access
   ✓ Public client access works
   ✓ Public slides access works (9 slides)

✅ Database Fix Complete!
```

If you see errors in Step 3 about public access, it means you need to complete Step 1 (apply RLS policies).

### Step 3: Deploy the Code Fixes

The code changes (regex pattern fix and migration file corrections) need to be deployed:

```bash
# Commit the changes
git add .
git commit -m "fix: Correct slides column name and regex pattern issues"

# Push to trigger Netlify deployment
git push origin main
```

Alternatively, trigger a manual deploy in Netlify:
- Go to Netlify Dashboard
- Click **Trigger deploy** → **Deploy site**

### Step 4: Verify Everything Works

1. **Test the presentation viewer:**
   - Visit your production URL
   - You should now see all slide content loading correctly

2. **Test the admin panel:**
   - Go to `/admin/clients`
   - Edit a client
   - The slug field should no longer show regex errors

3. **Test client preview:**
   - Edit a client in admin
   - Click "Preview Presentation"
   - Should load without 406 errors

## What the Fix Script Does

The `fix-production.js` script:

1. ✅ Connects to your Supabase database using service role key
2. ✅ Ensures a presentation exists for the demo client
3. ✅ Clears any existing slides (to avoid duplicates)
4. ✅ Inserts 9 slides with the **correct schema** (`is_visible` column)
5. ✅ Tests public read access to verify RLS policies are working

## Troubleshooting

### "Missing required environment variables"

**Solution:** Make sure `.env.local` exists with:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### "Public client access failed"

**Solution:** You haven't applied the RLS policies yet. Go back to Step 1 and run the SQL migration in Supabase Dashboard.

### "406 error still appearing"

**Possible causes:**
1. RLS policies not applied → Run Step 1
2. Client status is not 'active' → Check database:
   ```sql
   SELECT id, name, status FROM ai_presenter_clients;
   ```
   If status is 'draft', update it:
   ```sql
   UPDATE ai_presenter_clients
   SET status = 'active'
   WHERE id = 'c1111111-1111-1111-1111-111111111111';
   ```

### "Slides still not showing"

**Possible causes:**
1. Slides weren't inserted → Run Step 2 (fix-production.js)
2. RLS policies blocking access → Run Step 1
3. Verify slides exist:
   ```sql
   SELECT count(*) FROM ai_presenter_slides;
   ```

## Files Modified

- ✅ `supabase/migrations/20250117_populate_slides.sql` - Fixed column name
- ✅ `src/pages/admin/ClientForm.jsx` - Fixed regex pattern
- ✅ `fix-production.js` - New automated fix script (created)

## Need More Help?

If issues persist after following all steps:

1. Check Supabase logs: Dashboard → Logs → **API Logs**
2. Check browser console for specific error messages
3. Verify environment variables are correctly set in Netlify: Site Settings → Environment Variables
4. Ensure all three keys are set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_SERVICE_ROLE_KEY`

## Summary Checklist

- [ ] Apply RLS policies in Supabase SQL Editor
- [ ] Run `node fix-production.js` to populate slides
- [ ] Commit and push code changes
- [ ] Deploy to Netlify
- [ ] Test presentation viewer
- [ ] Test admin client form
- [ ] Test client preview

Once all steps are complete, your production presentation should display all slide content correctly! 🎉
