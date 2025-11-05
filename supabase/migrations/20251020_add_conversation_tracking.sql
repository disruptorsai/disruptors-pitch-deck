-- Add Conversation Tracking for ICP Responses
-- Tracks user responses during the sales conversation flow
-- Generated: 2025-10-20

-- =====================================================
-- CONVERSATION RESPONSES TABLE
-- =====================================================

CREATE TABLE ai_presenter_conversation_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Association
    client_id UUID REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,
    access_link_id UUID REFERENCES ai_presenter_access_links(id) ON DELETE CASCADE,
    session_id TEXT, -- Browser session identifier

    -- Question/Prompt Identification
    question_id TEXT NOT NULL, -- e.g., 'icebreaker', 'icp_industry', 'icp_revenue_goal'
    question_type TEXT NOT NULL, -- 'icebreaker', 'icp', 'objection'
    question_text TEXT, -- The actual question asked

    -- Response Data
    response JSONB NOT NULL, -- Flexible structure for different response types

    -- Metadata
    page_path TEXT, -- Which page the question was triggered from
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_conversation_responses_client ON ai_presenter_conversation_responses(client_id);
CREATE INDEX idx_conversation_responses_access_link ON ai_presenter_conversation_responses(access_link_id);
CREATE INDEX idx_conversation_responses_session ON ai_presenter_conversation_responses(session_id);
CREATE INDEX idx_conversation_responses_question ON ai_presenter_conversation_responses(question_id);
CREATE INDEX idx_conversation_responses_type ON ai_presenter_conversation_responses(question_type);
CREATE INDEX idx_conversation_responses_created ON ai_presenter_conversation_responses(created_at DESC);

-- =====================================================
-- CONVERSATION PROGRESS TRACKING
-- =====================================================

CREATE TABLE ai_presenter_conversation_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Association
    client_id UUID REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,
    access_link_id UUID REFERENCES ai_presenter_access_links(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,

    -- Progress Tracking
    current_stage TEXT NOT NULL, -- 'icebreaker', 'intro', 'icp', 'diagnostic', 'case_studies', 'capabilities', 'pricing', 'cta'
    stages_completed TEXT[] DEFAULT ARRAY[]::TEXT[], -- Array of completed stage IDs
    conversation_data JSONB DEFAULT '{}'::jsonb, -- Aggregated responses and context

    -- Service Selection
    selected_services TEXT[] DEFAULT ARRAY[]::TEXT[], -- Service slugs selected by user
    recommended_tier TEXT, -- Recommended pricing tier based on selections

    -- Metadata
    started_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,

    -- Ensure one progress per session
    CONSTRAINT unique_session_progress UNIQUE(session_id)
);

-- Create indexes for conversation progress
CREATE INDEX idx_conversation_progress_client ON ai_presenter_conversation_progress(client_id);
CREATE INDEX idx_conversation_progress_access_link ON ai_presenter_conversation_progress(access_link_id);
CREATE INDEX idx_conversation_progress_session ON ai_presenter_conversation_progress(session_id);
CREATE INDEX idx_conversation_progress_stage ON ai_presenter_conversation_progress(current_stage);
CREATE INDEX idx_conversation_progress_updated ON ai_presenter_conversation_progress(updated_at DESC);

-- Trigger for updated_at
CREATE TRIGGER ai_presenter_conversation_progress_updated_at
    BEFORE UPDATE ON ai_presenter_conversation_progress
    FOR EACH ROW
    EXECUTE FUNCTION ai_presenter_update_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE ai_presenter_conversation_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_presenter_conversation_progress ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for admin SDK operations)
CREATE POLICY "Service role full access to conversation responses"
    ON ai_presenter_conversation_responses
    FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to conversation progress"
    ON ai_presenter_conversation_progress
    FOR ALL
    USING (auth.role() = 'service_role');

-- Allow public to insert their own responses (anonymous users)
CREATE POLICY "Public can insert conversation responses"
    ON ai_presenter_conversation_responses
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public can insert conversation progress"
    ON ai_presenter_conversation_progress
    FOR INSERT
    WITH CHECK (true);

-- Allow public to update their own session progress
CREATE POLICY "Public can update own session progress"
    ON ai_presenter_conversation_progress
    FOR UPDATE
    USING (session_id = current_setting('app.session_id', true))
    WITH CHECK (session_id = current_setting('app.session_id', true));

-- Allow public to read their own session progress
CREATE POLICY "Public can read own session progress"
    ON ai_presenter_conversation_progress
    FOR SELECT
    USING (session_id = current_setting('app.session_id', true));

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get conversation context for a session
CREATE OR REPLACE FUNCTION ai_presenter_get_conversation_context(p_session_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_context JSONB;
BEGIN
    SELECT jsonb_object_agg(question_id, response)
    INTO v_context
    FROM ai_presenter_conversation_responses
    WHERE session_id = p_session_id;

    RETURN COALESCE(v_context, '{}'::jsonb);
END;
$$;

-- Function to calculate recommended pricing tier based on selections
CREATE OR REPLACE FUNCTION ai_presenter_calculate_recommended_tier(p_selected_services TEXT[])
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_service_count INTEGER;
BEGIN
    v_service_count := array_length(p_selected_services, 1);

    -- Recommendation logic based on service count
    IF v_service_count >= 8 THEN
        RETURN 'enterprise';
    ELSIF v_service_count >= 5 THEN
        RETURN 'executive';
    ELSIF v_service_count >= 3 THEN
        RETURN 'growth';
    ELSE
        RETURN 'agency';
    END IF;
END;
$$;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE ai_presenter_conversation_responses IS 'Stores individual user responses during sales conversation flow';
COMMENT ON TABLE ai_presenter_conversation_progress IS 'Tracks overall conversation progress and service selections per session';
COMMENT ON COLUMN ai_presenter_conversation_responses.question_type IS 'Type: icebreaker, icp, objection';
COMMENT ON COLUMN ai_presenter_conversation_responses.response IS 'JSONB structure varies by question type';
COMMENT ON COLUMN ai_presenter_conversation_progress.stages_completed IS 'Array of stage IDs user has completed';
COMMENT ON COLUMN ai_presenter_conversation_progress.selected_services IS 'Array of service slugs user selected in Blueprint';
COMMENT ON FUNCTION ai_presenter_get_conversation_context IS 'Aggregates all responses for a session into single JSONB object';
COMMENT ON FUNCTION ai_presenter_calculate_recommended_tier IS 'Returns recommended pricing tier slug based on service selection count';
