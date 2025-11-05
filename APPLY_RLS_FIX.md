# Fix for 406 Error - Apply RLS Policy Migration

## Problem Summary
Clients are saving correctly, but the application cannot fetch active clients because the RLS (Row Level Security) policies block anonymous (public) access. This causes 406 errors when trying to view presentations.

## Root Cause
The `ai_presenter_clients` table only has policies for:
- Authenticated users (admin access)
- Service role (backend operations)

There's NO policy allowing anonymous users to read active clients, which is required for public presentation viewing.

## Solution
Apply the migration to add a public read policy for active clients only.

## Steps to Apply Migration

### Option 1: Supabase Dashboard (Recommended)

1. Log into your Supabase dashboard at https://supabase.com/dashboard
2. Select your project (`ubqxflzuvxowigbjmqfb`)
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the contents of `supabase/migrations/20250117_add_public_client_read_policy.sql`
6. Paste into the SQL editor
7. Click **Run** (or press Ctrl/Cmd + Enter)
8. Verify success - you should see "Success. No rows returned"

### Option 2: Supabase CLI (If you have it installed)

```bash
# From project root
npx supabase db push
```

Or manually apply the specific migration:

```bash
psql $DATABASE_URL < supabase/migrations/20250117_add_public_client_read_policy.sql
```

## Verification

After applying the migration, verify the policy was created:

1. In Supabase Dashboard, go to **Authentication** → **Policies**
2. Find the `ai_presenter_clients` table
3. You should see a new policy: "Public can view active clients"
4. The policy should show:
   - **Allowed operations**: SELECT
   - **Target roles**: anon, public
   - **Policy definition**: `status = 'active'`

## Test the Fix

1. Refresh your application in the browser
2. Open browser DevTools → Console
3. The "Error fetching active client" and 406 errors should be gone
4. Active clients should now load successfully

## What This Policy Does

**Security Note**: This policy is safe and follows the principle of least privilege.

✅ **Allows**:
- Anonymous users can READ clients with `status = 'active'`
- Public presentation viewing via access tokens

❌ **Does NOT allow**:
- Reading draft or archived clients
- Creating, updating, or deleting clients
- Any write operations by anonymous users

Only active, public-facing client data is exposed - exactly what's needed for the presentation viewing feature.

## Additional Fixes Applied

In addition to the RLS policy fix, the following code fix was applied:

**File**: `src/hooks/use-personalized-presentation.ts:9`
- **Changed**: `import { supabase } from '@/api/supabaseClient';`
- **To**: `import { supabase } from '@/lib/supabase-client';`

This eliminates the "Multiple GoTrueClient instances" warning by using the centralized Supabase client.

## Rollback (if needed)

If you need to rollback this change:

```sql
DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;
```

However, note that this will break public presentation viewing functionality.

## Next Steps

After applying this fix, you'll need to complete the presentation viewer implementation to enable custom presentations per client. See the summary at the end of this document for what's remaining.
