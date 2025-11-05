# Apply Public Read RLS Policy

## Problem
The application is showing 406 errors and "No active client found" warnings because:
1. RLS (Row Level Security) is enabled on all tables
2. No policy exists to allow **anonymous (public)** users to read client data
3. The `usePersonalizedPresentation` hook tries to query clients directly with the anon key

## Solution
Add RLS policies that allow public read access to **active clients** and their related data.

## How to Apply

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** (left sidebar)

### Step 2: Run the Migration
1. Click "New Query"
2. Copy the entire contents of `supabase/migrations/20250117_add_public_read_policy.sql`
3. Paste into the SQL editor
4. Click "Run" (or press Ctrl/Cmd + Enter)

### Step 3: Verify Success
You should see: `Success. No rows returned`

This is expected - the migration only creates policies, it doesn't return data.

### Step 4: Test the Fix
1. Run the debug script:
   ```bash
   node scripts/debug-active-client.js
   ```

2. Look for the "Anonymous Access Test" section
3. You should now see:
   ```
   ✅ Success! Found 1 active clients:
      ✅ Disruptors Media
         ID: c1111111-1111-1111-1111-111111111111
         Slug: disruptors-media-demo
         Status: active
   ```

### Step 5: Reload Your App
1. Refresh your browser
2. The 406 errors should be gone
3. The "⚠️ No active client found" warnings should disappear
4. The presentation should load correctly

## What This Migration Does

### Security Model
The migration creates a **status-based security model**:
- **Active clients** (`status = 'active'`) → Public read access ✅
- **Draft/Archived clients** (`status = 'draft' or 'archived'`) → Admin only ❌
- **All write operations** → Admin only ✅

### Policies Created
1. **ai_presenter_clients** - Public can read active clients
2. **ai_presenter_presentations** - Public can read presentations linked to active clients
3. **ai_presenter_slides** - Public can read slides for active client presentations
4. **ai_presenter_services** - Public can read visible services for active clients
5. **ai_presenter_case_studies** - Public can read visible case studies for active clients
6. **ai_presenter_competitive_analysis** - Public can read analysis for active clients
7. **ai_presenter_team_members** - Public can read team members for active clients
8. **ai_presenter_file_uploads** - Public can read files for active clients

## Troubleshooting

### If you still see 406 errors after applying:
1. **Clear browser cache** - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. **Check the migration was applied**:
   ```sql
   SELECT policyname, tablename
   FROM pg_policies
   WHERE tablename LIKE 'ai_presenter_%'
   AND policyname LIKE 'Public%';
   ```
   You should see 8 policies returned.

3. **Verify the demo client exists and is active**:
   ```bash
   node scripts/debug-active-client.js
   ```

4. **Check for multiple GoTrueClient warnings** - If you see this, there's a separate issue with Supabase client initialization

### If the demo client doesn't exist:
Run the demo data migration:
```bash
node scripts/apply-demo-data.js
```

## Additional Notes

- This migration is **non-destructive** - it only adds policies, doesn't modify data
- The policies use `USING` clauses to filter based on client status
- Draft and archived clients remain protected - only admins can access them
- All write operations (INSERT, UPDATE, DELETE) remain admin-only
- Analytics tracking remains anonymous-accessible (already configured)

## Next Steps

Once this is working:
1. Test the presentation viewer in an incognito window
2. Verify all pages load without 406 errors
3. Create additional active clients as needed
4. Consider adding token-based access control for premium features (already designed in the schema)
