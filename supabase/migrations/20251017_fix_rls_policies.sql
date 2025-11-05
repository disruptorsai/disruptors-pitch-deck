-- RLS Policy Fix Migration
-- Generated: 2025-10-17T22:53:14.513Z
-- Purpose: Allow anonymous users to view active clients

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can view active clients" ON ai_presenter_clients;

-- Create new policy
CREATE POLICY "Public can view active clients"
    ON ai_presenter_clients
    FOR SELECT
    USING (status = 'active');

-- Verify policy was created
SELECT
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'ai_presenter_clients'
  AND policyname = 'Public can view active clients';
