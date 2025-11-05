-- DisruptorBot Voice AI Conversation Tracking
-- Tracks real-time voice and text conversations with the AI assistant
-- Generated: 2025-10-20

-- =====================================================
-- VOICE CONVERSATION SESSIONS
-- =====================================================

CREATE TABLE ai_presenter_voice_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Association
    client_id UUID REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,
    access_link_id UUID REFERENCES ai_presenter_access_links(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL, -- Browser session identifier

    -- ElevenLabs Integration
    elevenlabs_conversation_id TEXT, -- ElevenLabs conversation ID
    agent_id TEXT, -- ElevenLabs agent ID used

    -- Session Metadata
    interaction_mode TEXT NOT NULL DEFAULT 'voice', -- 'voice', 'text', 'hybrid'
    current_slide_slug TEXT, -- Which slide user was on when they started

    -- Timing
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER, -- Total conversation duration

    -- Status
    status TEXT DEFAULT 'active', -- 'active', 'ended', 'interrupted', 'error'

    -- Analytics
    message_count INTEGER DEFAULT 0,
    user_message_count INTEGER DEFAULT 0,
    ai_message_count INTEGER DEFAULT 0,

    -- Technical Metadata
    user_agent TEXT,
    ip_address INET,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for voice sessions
CREATE INDEX idx_voice_sessions_client ON ai_presenter_voice_sessions(client_id);
CREATE INDEX idx_voice_sessions_access_link ON ai_presenter_voice_sessions(access_link_id);
CREATE INDEX idx_voice_sessions_session ON ai_presenter_voice_sessions(session_id);
CREATE INDEX idx_voice_sessions_status ON ai_presenter_voice_sessions(status);
CREATE INDEX idx_voice_sessions_created ON ai_presenter_voice_sessions(created_at DESC);
CREATE INDEX idx_voice_sessions_elevenlabs ON ai_presenter_voice_sessions(elevenlabs_conversation_id);

-- =====================================================
-- VOICE CONVERSATION MESSAGES
-- =====================================================

CREATE TABLE ai_presenter_voice_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Association
    voice_session_id UUID NOT NULL REFERENCES ai_presenter_voice_sessions(id) ON DELETE CASCADE,

    -- Message Data
    role TEXT NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL, -- Message text/transcript

    -- Audio Metadata (for voice messages)
    audio_duration_ms INTEGER, -- Audio duration in milliseconds
    audio_url TEXT, -- URL to stored audio file (if applicable)
    confidence_score DECIMAL(3,2), -- Speech-to-text confidence (0.00-1.00)

    -- Context
    current_slide_slug TEXT, -- Slide user was viewing during this message
    intent TEXT, -- Detected intent: 'question', 'objection', 'interest', 'navigation', etc.
    topics TEXT[], -- Array of topics mentioned: ['pricing', 'seo', 'case_studies']

    -- Sentiment Analysis
    sentiment TEXT, -- 'positive', 'negative', 'neutral', 'mixed'
    sentiment_score DECIMAL(3,2), -- -1.00 to 1.00

    -- Function Calling / Actions
    action_taken TEXT, -- 'navigate_to_slide', 'show_case_study', 'show_pricing', etc.
    action_params JSONB, -- Parameters for the action

    -- Metadata
    sequence_number INTEGER NOT NULL, -- Message order in conversation
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for voice messages
CREATE INDEX idx_voice_messages_session ON ai_presenter_voice_messages(voice_session_id);
CREATE INDEX idx_voice_messages_role ON ai_presenter_voice_messages(role);
CREATE INDEX idx_voice_messages_intent ON ai_presenter_voice_messages(intent);
CREATE INDEX idx_voice_messages_created ON ai_presenter_voice_messages(created_at DESC);
CREATE INDEX idx_voice_messages_sequence ON ai_presenter_voice_messages(voice_session_id, sequence_number);
CREATE INDEX idx_voice_messages_topics ON ai_presenter_voice_messages USING GIN(topics);

-- =====================================================
-- CONVERSATION INSIGHTS
-- =====================================================

CREATE TABLE ai_presenter_conversation_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Association
    voice_session_id UUID NOT NULL REFERENCES ai_presenter_voice_sessions(id) ON DELETE CASCADE,
    client_id UUID REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,

    -- Aggregated Insights
    primary_interests TEXT[], -- Main topics client asked about
    objections_raised TEXT[], -- Concerns or objections mentioned
    questions_asked TEXT[], -- List of all questions

    -- Qualification Signals
    budget_indicators JSONB, -- Detected budget signals
    timeline_indicators JSONB, -- Detected timeline/urgency signals
    decision_maker_signals JSONB, -- Authority indicators

    -- Engagement Metrics
    engagement_score INTEGER, -- 0-100 based on interaction quality
    interest_level TEXT, -- 'high', 'medium', 'low'
    readiness_to_buy TEXT, -- 'ready', 'considering', 'researching', 'not_ready'

    -- Services Interest
    services_discussed TEXT[], -- Service slugs mentioned
    recommended_tier TEXT, -- Recommended pricing tier

    -- Next Steps
    suggested_follow_up TEXT, -- AI-generated follow-up recommendation
    next_best_action TEXT, -- 'schedule_call', 'send_proposal', 'nurture', etc.

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for conversation insights
CREATE INDEX idx_conversation_insights_session ON ai_presenter_conversation_insights(voice_session_id);
CREATE INDEX idx_conversation_insights_client ON ai_presenter_conversation_insights(client_id);
CREATE INDEX idx_conversation_insights_interest ON ai_presenter_conversation_insights(interest_level);
CREATE INDEX idx_conversation_insights_readiness ON ai_presenter_conversation_insights(readiness_to_buy);
CREATE INDEX idx_conversation_insights_services ON ai_presenter_conversation_insights USING GIN(services_discussed);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE ai_presenter_voice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_presenter_voice_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_presenter_conversation_insights ENABLE ROW LEVEL SECURITY;

-- Service role full access (for admin SDK operations)
CREATE POLICY "Service role full access to voice sessions"
    ON ai_presenter_voice_sessions
    FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to voice messages"
    ON ai_presenter_voice_messages
    FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to conversation insights"
    ON ai_presenter_conversation_insights
    FOR ALL
    USING (auth.role() = 'service_role');

-- Public can insert and read their own session data
CREATE POLICY "Public can insert voice sessions"
    ON ai_presenter_voice_sessions
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public can read own voice sessions"
    ON ai_presenter_voice_sessions
    FOR SELECT
    USING (session_id = current_setting('app.session_id', true));

CREATE POLICY "Public can update own voice sessions"
    ON ai_presenter_voice_sessions
    FOR UPDATE
    USING (session_id = current_setting('app.session_id', true))
    WITH CHECK (session_id = current_setting('app.session_id', true));

CREATE POLICY "Public can insert voice messages"
    ON ai_presenter_voice_messages
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public can read voice messages from own sessions"
    ON ai_presenter_voice_messages
    FOR SELECT
    USING (
        voice_session_id IN (
            SELECT id FROM ai_presenter_voice_sessions
            WHERE session_id = current_setting('app.session_id', true)
        )
    );

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE TRIGGER ai_presenter_voice_sessions_updated_at
    BEFORE UPDATE ON ai_presenter_voice_sessions
    FOR EACH ROW
    EXECUTE FUNCTION ai_presenter_update_updated_at();

CREATE TRIGGER ai_presenter_conversation_insights_updated_at
    BEFORE UPDATE ON ai_presenter_conversation_insights
    FOR EACH ROW
    EXECUTE FUNCTION ai_presenter_update_updated_at();

-- Auto-increment message count on voice sessions
CREATE OR REPLACE FUNCTION ai_presenter_increment_message_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE ai_presenter_voice_sessions
    SET
        message_count = message_count + 1,
        user_message_count = user_message_count + CASE WHEN NEW.role = 'user' THEN 1 ELSE 0 END,
        ai_message_count = ai_message_count + CASE WHEN NEW.role = 'assistant' THEN 1 ELSE 0 END,
        updated_at = NOW()
    WHERE id = NEW.voice_session_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_message_count_trigger
    AFTER INSERT ON ai_presenter_voice_messages
    FOR EACH ROW
    EXECUTE FUNCTION ai_presenter_increment_message_count();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Get full conversation history for a session
CREATE OR REPLACE FUNCTION ai_presenter_get_conversation_history(p_session_id UUID)
RETURNS TABLE (
    role TEXT,
    content TEXT,
    intent TEXT,
    topics TEXT[],
    current_slide_slug TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.role,
        m.content,
        m.intent,
        m.topics,
        m.current_slide_slug,
        m.created_at
    FROM ai_presenter_voice_messages m
    WHERE m.voice_session_id = p_session_id
    ORDER BY m.sequence_number ASC;
END;
$$ LANGUAGE plpgsql;

-- Calculate engagement score based on conversation metrics
CREATE OR REPLACE FUNCTION ai_presenter_calculate_engagement_score(p_session_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_score INTEGER := 0;
    v_message_count INTEGER;
    v_duration_seconds INTEGER;
    v_question_count INTEGER;
BEGIN
    -- Get session metrics
    SELECT
        message_count,
        duration_seconds
    INTO v_message_count, v_duration_seconds
    FROM ai_presenter_voice_sessions
    WHERE id = p_session_id;

    -- Count questions asked
    SELECT COUNT(*)
    INTO v_question_count
    FROM ai_presenter_voice_messages
    WHERE voice_session_id = p_session_id
    AND role = 'user'
    AND (content LIKE '%?%' OR intent = 'question');

    -- Calculate score (0-100)
    -- Messages: up to 40 points (1 point per message, max 40)
    v_score := v_score + LEAST(v_message_count, 40);

    -- Duration: up to 30 points (1 point per 10 seconds, max 30)
    v_score := v_score + LEAST(COALESCE(v_duration_seconds, 0) / 10, 30);

    -- Questions: up to 30 points (5 points per question, max 30)
    v_score := v_score + LEAST(v_question_count * 5, 30);

    RETURN v_score;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate conversation insights
CREATE OR REPLACE FUNCTION ai_presenter_generate_conversation_insights(p_session_id UUID)
RETURNS UUID AS $$
DECLARE
    v_insight_id UUID;
    v_client_id UUID;
    v_services_discussed TEXT[];
    v_topics TEXT[];
    v_questions TEXT[];
    v_engagement_score INTEGER;
BEGIN
    -- Get client_id from session
    SELECT client_id INTO v_client_id
    FROM ai_presenter_voice_sessions
    WHERE id = p_session_id;

    -- Aggregate topics discussed
    SELECT array_agg(DISTINCT unnest(topics))
    INTO v_topics
    FROM ai_presenter_voice_messages
    WHERE voice_session_id = p_session_id
    AND topics IS NOT NULL;

    -- Get questions asked
    SELECT array_agg(content)
    INTO v_questions
    FROM ai_presenter_voice_messages
    WHERE voice_session_id = p_session_id
    AND role = 'user'
    AND (content LIKE '%?%' OR intent = 'question');

    -- Calculate engagement score
    v_engagement_score := ai_presenter_calculate_engagement_score(p_session_id);

    -- Insert or update insights
    INSERT INTO ai_presenter_conversation_insights (
        voice_session_id,
        client_id,
        primary_interests,
        questions_asked,
        engagement_score,
        interest_level
    ) VALUES (
        p_session_id,
        v_client_id,
        v_topics,
        v_questions,
        v_engagement_score,
        CASE
            WHEN v_engagement_score >= 70 THEN 'high'
            WHEN v_engagement_score >= 40 THEN 'medium'
            ELSE 'low'
        END
    )
    ON CONFLICT (voice_session_id)
    DO UPDATE SET
        primary_interests = EXCLUDED.primary_interests,
        questions_asked = EXCLUDED.questions_asked,
        engagement_score = EXCLUDED.engagement_score,
        interest_level = EXCLUDED.interest_level,
        updated_at = NOW()
    RETURNING id INTO v_insight_id;

    RETURN v_insight_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE ai_presenter_voice_sessions IS 'Tracks voice AI conversation sessions with DisruptorBot';
COMMENT ON TABLE ai_presenter_voice_messages IS 'Stores individual messages in voice conversations';
COMMENT ON TABLE ai_presenter_conversation_insights IS 'AI-generated insights and analytics from conversations';
COMMENT ON COLUMN ai_presenter_voice_sessions.interaction_mode IS 'How user is interacting: voice, text, or hybrid';
COMMENT ON COLUMN ai_presenter_voice_messages.intent IS 'Detected user intent: question, objection, interest, navigation, etc.';
COMMENT ON COLUMN ai_presenter_voice_messages.topics IS 'Array of topics mentioned in message';
COMMENT ON COLUMN ai_presenter_conversation_insights.engagement_score IS 'Calculated engagement score 0-100 based on interaction quality';
COMMENT ON FUNCTION ai_presenter_calculate_engagement_score IS 'Calculates 0-100 engagement score based on messages, duration, and questions';
COMMENT ON FUNCTION ai_presenter_generate_conversation_insights IS 'Auto-generates conversation insights and analytics';
