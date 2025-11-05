-- Migration: Add public read access for active clients
-- Date: 2025-01-17
--
-- Problem: Anonymous users (public supabase client) cannot query ai_presenter_clients
-- due to missing public read RLS policy, causing 406 errors.
--
-- Solution: Add a public read policy that allows anonymous users to read
-- ONLY active clients. This enables public presentation viewing via access tokens.

-- Add public read policy for active clients
CREATE POLICY "Public can view active clients"
    ON ai_presenter_clients
    FOR SELECT
    USING (status = 'active');

-- Note: This policy allows anonymous (public) users to read client records
-- that have status='active'. Draft and archived clients remain protected.
-- This is necessary for the public presentation viewing flow where:
-- 1. User has access token
-- 2. Token validates and returns client_id
-- 3. Frontend fetches client data using anon key
-- 4. Client branding and presentation are displayed
