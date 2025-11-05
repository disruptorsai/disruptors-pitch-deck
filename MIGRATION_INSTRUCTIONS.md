# RLS Policy Migration Instructions

## Issue Summary

The application is experiencing 406 errors when trying to fetch active clients because the `ai_presenter_clients` table has RLS (Row Level Security) enabled, but there's no public read policy for anonymous users.

## Current Status

**Diagnosis completed:**
- Admin client can see 1 active client: "Disruptors Media" (disruptors-media-demo)
- Anonymous client sees 0 clients (blocked by RLS)
- This confirms the RLS policy needs to be applied

## Migration Required

**File:** `supabase/migrations/20250117_add_public_client_read_policy.sql`

**What it does:**
- Adds a public SELECT policy for the `ai_presenter_clients` table
- Allows anonymous (unauthenticated) users to read ONLY clients with `status = 'active'`
- Draft and archived clients remain protected

## How to Apply (Manual - Required)

Supabase requires migrations to be applied via the SQL Editor for security reasons.

### Step 1: Open Supabase SQL Editor

Click this link or copy to your browser:
```
https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/sql/new
```

### Step 2: Paste the Migration SQL

Copy and paste this SQL into the editor:

```sql
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;

-- Create the policy
CREATE POLICY "Public can view active clients"
    ON ai_presenter_clients
    FOR SELECT
    USING (status = 'active');
```

### Step 3: Execute the SQL

1. Click the "Run" button (or press Ctrl+Enter / Cmd+Enter)
2. You should see: **"Success. No rows returned"**

### Step 4: Verify the Migration

Run the verification script to confirm it's working:

```bash
cd "C:\Users\Will\OneDrive\Documents\Projects\AI Presenter\disruptors-ai-pitch-deck-74a1c8d5 (1)\disruptors-pitch-deck"
node scripts/test-rls-policy.js
```

Expected output:
```
✅ RLS POLICY IS WORKING CORRECTLY
   - Anonymous users can read active clients
   - Draft/archived clients are protected
   - 406 errors should be resolved
```

## What This Fixes

After applying this migration:

1. **406 errors resolved**: Anonymous users can now read active clients
2. **Presentation viewing works**: Public users with access tokens can view presentations
3. **Security maintained**: Only active clients are publicly readable
4. **Admin operations unchanged**: Admin SDK continues to work as before

## Access Flow

The migration enables this user flow:

1. User receives access link with token: `/p/{token}`
2. Token is validated (returns client_id if valid)
3. Frontend fetches client data using anon key (PUBLIC client)
4. **NEW**: Client data is now readable because the client is active
5. Presentation loads with proper branding and content

## Testing After Migration

### Test 1: Anonymous Access (Quick Test)

```bash
node scripts/debug-client-access.js
```

Should show:
```
📊 Analysis:
✅ RLS POLICY WORKING:
  - Both admin and anon see 1 active client(s)
  - Policy is correctly configured
```

### Test 2: Full Test Suite

```bash
node scripts/test-rls-policy.js
```

Should show all tests passing.

### Test 3: Application Test

1. Start the dev server: `npm run dev`
2. Navigate to a presentation page
3. Verify no 406 errors in browser console
4. Confirm client data loads correctly

## Rollback (If Needed)

If you need to remove the policy:

```sql
DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;
```

**Warning**: This will restore 406 errors. Only do this if you have an alternative solution.

## Technical Details

### Policy Specifics

- **Policy Name**: "Public can view active clients"
- **Table**: `ai_presenter_clients`
- **Operation**: SELECT only
- **Condition**: `status = 'active'`
- **Applies To**: Anonymous (unauthenticated) users

### Security Considerations

✅ **Safe:**
- Only active clients are exposed
- Draft clients remain private
- Archived clients remain private
- No write access granted
- No sensitive data in active clients table

❌ **What's NOT exposed:**
- Draft clients
- Archived clients
- Any other tables
- Write operations

### Architecture Alignment

This migration aligns with the project's architecture:
- Uses RLS for security (best practice)
- Follows least privilege principle
- Enables the token-based access flow
- Maintains separation between public and admin operations

## Support

If you encounter issues:

1. Check the Supabase SQL Editor for error messages
2. Verify you're logged into the correct Supabase project
3. Ensure you have admin permissions on the project
4. Check the browser console for any CORS or network errors

## Migration File Location

The complete migration file is located at:
```
supabase/migrations/20250117_add_public_client_read_policy.sql
```

## Next Steps After Migration

1. ✅ Apply the migration via Supabase SQL Editor
2. ✅ Run verification scripts
3. ✅ Test the application
4. ✅ Monitor for any errors
5. ✅ Update migration log if you maintain one

---

**Last Updated**: 2025-01-17
**Migration Version**: 20250117
**Status**: Ready to apply
