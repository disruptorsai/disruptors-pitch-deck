-- Add Public Read Policy for Active Clients
-- This allows the anonymous (public) key to read client data when status='active'
-- Generated: 2025-01-17

-- =====================================================
-- PUBLIC READ POLICIES
-- =====================================================

-- Allow public read access to active clients
-- This is required for the presentation viewer to load client data
CREATE POLICY "Public can view active clients"
    ON ai_presenter_clients FOR SELECT
    USING (status = 'active');

-- Allow public read access to presentations for active clients
CREATE POLICY "Public can view presentations for active clients"
    ON ai_presenter_presentations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM ai_presenter_clients
            WHERE ai_presenter_clients.id = ai_presenter_presentations.client_id
            AND ai_presenter_clients.status = 'active'
        )
    );

-- Allow public read access to slides for active clients
CREATE POLICY "Public can view slides for active clients"
    ON ai_presenter_slides FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM ai_presenter_presentations p
            JOIN ai_presenter_clients c ON c.id = p.client_id
            WHERE p.id = ai_presenter_slides.presentation_id
            AND c.status = 'active'
        )
    );

-- Allow public read access to services for active clients
CREATE POLICY "Public can view services for active clients"
    ON ai_presenter_services FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM ai_presenter_clients
            WHERE ai_presenter_clients.id = ai_presenter_services.client_id
            AND ai_presenter_clients.status = 'active'
            AND ai_presenter_services.is_visible = true
        )
    );

-- Allow public read access to case studies for active clients
CREATE POLICY "Public can view case studies for active clients"
    ON ai_presenter_case_studies FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM ai_presenter_clients
            WHERE ai_presenter_clients.id = ai_presenter_case_studies.client_id
            AND ai_presenter_clients.status = 'active'
            AND ai_presenter_case_studies.is_visible = true
        )
    );

-- Allow public read access to competitive analysis for active clients
CREATE POLICY "Public can view competitive analysis for active clients"
    ON ai_presenter_competitive_analysis FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM ai_presenter_clients
            WHERE ai_presenter_clients.id = ai_presenter_competitive_analysis.client_id
            AND ai_presenter_clients.status = 'active'
            AND ai_presenter_competitive_analysis.is_visible = true
        )
    );

-- Allow public read access to team members for active clients
CREATE POLICY "Public can view team members for active clients"
    ON ai_presenter_team_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM ai_presenter_clients
            WHERE ai_presenter_clients.id = ai_presenter_team_members.client_id
            AND ai_presenter_clients.status = 'active'
            AND ai_presenter_team_members.is_visible = true
        )
    );

-- Allow public read access to file uploads for active clients
CREATE POLICY "Public can view files for active clients"
    ON ai_presenter_file_uploads FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM ai_presenter_clients
            WHERE ai_presenter_clients.id = ai_presenter_file_uploads.client_id
            AND ai_presenter_clients.status = 'active'
        )
    );
