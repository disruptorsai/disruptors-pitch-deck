# RLS Policy Fix Instructions

## Problem Identified

Your Supabase database has an RLS (Row Level Security) policy issue:
- **Admin access**: Finds 1 active client ✅
- **Anonymous access**: Returns 0 clients (even though the query succeeds) ❌

This is causing 406 errors in your application when trying to load client data.

## Solution

Execute the following SQL in your Supabase Dashboard to fix the RLS policy:

### Step 1: Open Supabase SQL Editor

Click this link to open the SQL Editor:
**https://app.supabase.com/project/ubqxflzuvxowigbjmqfb/sql/new**

### Step 2: Copy and Paste This SQL

```sql
-- Drop the existing policy (if it exists)
DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;

-- Create the corrected policy
CREATE POLICY "Public can view active clients"
    ON ai_presenter_clients
    FOR SELECT
    USING (status = 'active');
```

### Step 3: Execute the SQL

Click the **"RUN"** button (or press `Ctrl+Enter`)

You should see: **"Success. No rows returned"**

### Step 4: Verify the Fix

Run this command in your terminal:

```bash
node scripts/verify-rls-fix.mjs
```

You should see output showing that anonymous access is now working.

## What This Does

The SQL above:

1. **Drops** any existing "Public can view active clients" policy to avoid conflicts
2. **Creates** a new policy that allows anonymous users to SELECT (read) from the `ai_presenter_clients` table
3. **Restricts** access to only rows where `status = 'active'`

## Expected Result

After executing the SQL:
- ✅ Anonymous users can query `ai_presenter_clients` table
- ✅ Only clients with `status='active'` are visible
- ✅ 406 errors in your application will be resolved
- ✅ Your presentation pages will load correctly

## Current Database State

From the diagnosis script:

| Client | Slug | Status | Accessible? |
|--------|------|--------|-------------|
| Disruptors Media | disruptors-media-demo | active | ❌ Should be ✅ |
| disruptors media | disruptors-media-1 | draft | ❌ (Correctly blocked) |
| E-District | e-district | draft | ❌ (Correctly blocked) |
| Test Client | test-client | draft | ❌ (Correctly blocked) |
| Disruptors Media | disruptors-media | draft | ❌ (Correctly blocked) |

After the fix, the first client should be accessible via anonymous access.

## Troubleshooting

If the fix doesn't work immediately:

1. **Clear your browser cache** and refresh the application
2. **Check the Supabase logs** for any errors
3. **Verify the policy was created** by running:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'ai_presenter_clients';
   ```
4. **Check if RLS is enabled** on the table:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'ai_presenter_clients';
   ```

## Files Created

Several helper scripts have been created in the `scripts/` directory:

1. **`scripts/check-clients.mjs`** - Check all clients and their status
2. **`scripts/verify-rls-fix.mjs`** - Verify the RLS policy is working
3. **`scripts/final-rls-solution.mjs`** - Comprehensive diagnosis and fix guide
4. **`supabase/migrations/20251017_fix_rls_policies.sql`** - Migration file with the SQL

## Need More Help?

If you continue to experience issues:

1. Check the Supabase Dashboard authentication settings
2. Verify the anon key is correct in your `.env.local` file
3. Check browser console for detailed error messages
4. Review the Supabase logs for rejected queries

---

**Next Steps:**
1. Execute the SQL above in Supabase Dashboard
2. Run `node scripts/verify-rls-fix.mjs` to confirm
3. Test your application in the browser
