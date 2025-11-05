-- AI Presenter Application - Complete Database Schema
-- Migration for existing Disruptors AI Supabase project
-- All tables are namespaced with 'ai_presenter_' prefix
-- Generated: 2025-01-13

-- =====================================================
-- EXTENSIONS
-- =====================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for token generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- CUSTOM TYPES
-- =====================================================

-- Client status type
CREATE TYPE ai_presenter_client_status AS ENUM ('active', 'archived', 'draft');

-- Access link status type
CREATE TYPE ai_presenter_access_status AS ENUM ('active', 'expired', 'revoked');

-- Analytics event type
CREATE TYPE ai_presenter_event_type AS ENUM (
    'presentation_view',
    'slide_view',
    'case_study_view',
    'service_view',
    'pdf_download',
    'link_click',
    'form_submit'
);

-- =====================================================
-- TABLES
-- =====================================================

-- -------------------------------------------------------
-- Clients Table
-- -------------------------------------------------------
CREATE TABLE ai_presenter_clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Basic Information
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,

    -- Branding
    logo_url TEXT,
    primary_color TEXT DEFAULT '#000000',
    secondary_color TEXT DEFAULT '#ffffff',

    -- Contact Information
    website TEXT,
    email TEXT,
    phone TEXT,

    -- Configuration
    status ai_presenter_client_status DEFAULT 'draft',
    settings JSONB DEFAULT '{}'::jsonb,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID, -- References user from main Disruptors AI users table

    -- Constraints
    CONSTRAINT ai_presenter_clients_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Create index for slug lookups
CREATE INDEX idx_ai_presenter_clients_slug ON ai_presenter_clients(slug);
CREATE INDEX idx_ai_presenter_clients_status ON ai_presenter_clients(status);
CREATE INDEX idx_ai_presenter_clients_created_at ON ai_presenter_clients(created_at DESC);

-- -------------------------------------------------------
-- Access Links Table (Token-based Authentication)
-- -------------------------------------------------------
CREATE TABLE ai_presenter_access_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Link Information
    client_id UUID NOT NULL REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL, -- Descriptive name (e.g., "Investor Pitch - Q1 2025")

    -- Access Control
    status ai_presenter_access_status DEFAULT 'active',
    expires_at TIMESTAMPTZ,
    max_views INTEGER, -- NULL = unlimited
    view_count INTEGER DEFAULT 0,

    -- Password Protection (optional)
    password_hash TEXT, -- bcrypt hash if password protected

    -- Customization
    custom_message TEXT, -- Welcome message for this link
    allowed_sections JSONB, -- Array of allowed section IDs, NULL = all sections

    -- Tracking
    last_accessed_at TIMESTAMPTZ,
    ip_whitelist TEXT[], -- Optional IP restriction

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID, -- References user from main Disruptors AI users table

    -- Constraints
    CONSTRAINT ai_presenter_access_links_token_format CHECK (LENGTH(token) >= 32)
);

-- Create indexes for token lookups and status checks
CREATE INDEX idx_ai_presenter_access_links_token ON ai_presenter_access_links(token);
CREATE INDEX idx_ai_presenter_access_links_client_id ON ai_presenter_access_links(client_id);
CREATE INDEX idx_ai_presenter_access_links_status ON ai_presenter_access_links(status);
CREATE INDEX idx_ai_presenter_access_links_expires_at ON ai_presenter_access_links(expires_at);

-- -------------------------------------------------------
-- Presentations Table
-- -------------------------------------------------------
CREATE TABLE ai_presenter_presentations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Association
    client_id UUID NOT NULL REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,

    -- Content
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,

    -- Hero Section
    hero_image_url TEXT,
    hero_video_url TEXT,
    cta_text TEXT DEFAULT 'Get Started',
    cta_url TEXT,

    -- Configuration
    theme JSONB DEFAULT '{}'::jsonb, -- Custom theme overrides
    layout TEXT DEFAULT 'modern', -- Layout variant
    is_default BOOLEAN DEFAULT false, -- One default per client

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_ai_presenter_presentations_client_id ON ai_presenter_presentations(client_id);
CREATE INDEX idx_ai_presenter_presentations_is_default ON ai_presenter_presentations(is_default);

-- Create partial unique index to enforce one default presentation per client
CREATE UNIQUE INDEX idx_ai_presenter_presentations_one_default_per_client
    ON ai_presenter_presentations(client_id)
    WHERE is_default = true;

-- -------------------------------------------------------
-- Slides Table
-- -------------------------------------------------------
CREATE TABLE ai_presenter_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Association
    presentation_id UUID NOT NULL REFERENCES ai_presenter_presentations(id) ON DELETE CASCADE,

    -- Content
    title TEXT NOT NULL,
    subtitle TEXT,
    content TEXT, -- Markdown or HTML content

    -- Media
    image_url TEXT,
    video_url TEXT,
    background_image_url TEXT,

    -- Layout
    slide_type TEXT DEFAULT 'content', -- content, hero, split, full-image, etc.
    layout JSONB DEFAULT '{}'::jsonb,

    -- Ordering
    order_index INTEGER NOT NULL DEFAULT 0,

    -- Visibility
    is_visible BOOLEAN DEFAULT true,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_ai_presenter_slides_presentation_id ON ai_presenter_slides(presentation_id);
CREATE INDEX idx_ai_presenter_slides_order_index ON ai_presenter_slides(presentation_id, order_index);
CREATE INDEX idx_ai_presenter_slides_is_visible ON ai_presenter_slides(is_visible);

-- -------------------------------------------------------
-- Services Table
-- -------------------------------------------------------
CREATE TABLE ai_presenter_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Association
    client_id UUID NOT NULL REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,

    -- Content
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb, -- Array of feature objects

    -- Media
    icon_url TEXT,
    image_url TEXT,

    -- Pricing (optional)
    pricing JSONB, -- Flexible pricing structure

    -- Ordering
    order_index INTEGER NOT NULL DEFAULT 0,

    -- Visibility
    is_visible BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT ai_presenter_services_unique_slug_per_client
        UNIQUE (client_id, slug)
);

-- Create indexes
CREATE INDEX idx_ai_presenter_services_client_id ON ai_presenter_services(client_id);
CREATE INDEX idx_ai_presenter_services_slug ON ai_presenter_services(client_id, slug);
CREATE INDEX idx_ai_presenter_services_is_featured ON ai_presenter_services(is_featured);
CREATE INDEX idx_ai_presenter_services_order_index ON ai_presenter_services(client_id, order_index);

-- -------------------------------------------------------
-- Case Studies Table
-- -------------------------------------------------------
CREATE TABLE ai_presenter_case_studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Association
    client_id UUID NOT NULL REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,

    -- Basic Information
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    client_name TEXT NOT NULL, -- The client's client
    industry TEXT,

    -- Content
    challenge TEXT,
    solution TEXT,
    results TEXT,
    testimonial TEXT,
    testimonial_author TEXT,
    testimonial_role TEXT,

    -- Media
    featured_image_url TEXT,
    logo_url TEXT,
    gallery_urls JSONB DEFAULT '[]'::jsonb, -- Array of image URLs

    -- Metrics
    metrics JSONB DEFAULT '[]'::jsonb, -- Array of {label, value, unit} objects

    -- Tags and Categories
    tags TEXT[],
    category TEXT,

    -- Ordering
    order_index INTEGER NOT NULL DEFAULT 0,

    -- Visibility
    is_visible BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,

    -- Metadata
    project_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT ai_presenter_case_studies_unique_slug_per_client
        UNIQUE (client_id, slug)
);

-- Create indexes
CREATE INDEX idx_ai_presenter_case_studies_client_id ON ai_presenter_case_studies(client_id);
CREATE INDEX idx_ai_presenter_case_studies_slug ON ai_presenter_case_studies(client_id, slug);
CREATE INDEX idx_ai_presenter_case_studies_is_featured ON ai_presenter_case_studies(is_featured);
CREATE INDEX idx_ai_presenter_case_studies_category ON ai_presenter_case_studies(category);
CREATE INDEX idx_ai_presenter_case_studies_tags ON ai_presenter_case_studies USING GIN(tags);

-- -------------------------------------------------------
-- Competitive Analysis Table
-- -------------------------------------------------------
CREATE TABLE ai_presenter_competitive_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Association
    client_id UUID NOT NULL REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,

    -- Analysis Content
    title TEXT NOT NULL DEFAULT 'Competitive Analysis',
    executive_summary TEXT,

    -- Market Overview
    market_size TEXT,
    market_trends JSONB DEFAULT '[]'::jsonb,

    -- Competitors
    competitors JSONB DEFAULT '[]'::jsonb, -- Array of competitor objects

    -- SWOT Analysis
    strengths JSONB DEFAULT '[]'::jsonb,
    weaknesses JSONB DEFAULT '[]'::jsonb,
    opportunities JSONB DEFAULT '[]'::jsonb,
    threats JSONB DEFAULT '[]'::jsonb,

    -- Positioning
    unique_value_proposition TEXT,
    competitive_advantages JSONB DEFAULT '[]'::jsonb,

    -- AI Generation Metadata
    generated_by_ai BOOLEAN DEFAULT false,
    ai_model TEXT, -- e.g., "claude-3-5-sonnet-20241022"
    generation_prompt TEXT,
    generated_at TIMESTAMPTZ,

    -- Visibility
    is_visible BOOLEAN DEFAULT true,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT ai_presenter_competitive_analysis_one_per_client
        UNIQUE (client_id)
);

-- Create indexes
CREATE INDEX idx_ai_presenter_competitive_analysis_client_id ON ai_presenter_competitive_analysis(client_id);

-- -------------------------------------------------------
-- Team Members Table
-- -------------------------------------------------------
CREATE TABLE ai_presenter_team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Association
    client_id UUID NOT NULL REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,

    -- Personal Information
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,

    -- Media
    photo_url TEXT,

    -- Social Links
    linkedin_url TEXT,
    twitter_url TEXT,
    email TEXT,

    -- Ordering
    order_index INTEGER NOT NULL DEFAULT 0,

    -- Visibility
    is_visible BOOLEAN DEFAULT true,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_ai_presenter_team_members_client_id ON ai_presenter_team_members(client_id);
CREATE INDEX idx_ai_presenter_team_members_order_index ON ai_presenter_team_members(client_id, order_index);

-- -------------------------------------------------------
-- Analytics Events Table
-- -------------------------------------------------------
CREATE TABLE ai_presenter_analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Association
    client_id UUID REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,
    access_link_id UUID REFERENCES ai_presenter_access_links(id) ON DELETE SET NULL,

    -- Event Data
    event_type ai_presenter_event_type NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb, -- Flexible event properties

    -- Session Tracking
    session_id TEXT, -- Anonymous session identifier

    -- Technical Details
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,

    -- Geographic Data (optional)
    country TEXT,
    city TEXT,

    -- Page Context
    page_url TEXT,
    page_title TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for analytics queries
CREATE INDEX idx_ai_presenter_analytics_events_client_id ON ai_presenter_analytics_events(client_id);
CREATE INDEX idx_ai_presenter_analytics_events_access_link_id ON ai_presenter_analytics_events(access_link_id);
CREATE INDEX idx_ai_presenter_analytics_events_event_type ON ai_presenter_analytics_events(event_type);
CREATE INDEX idx_ai_presenter_analytics_events_created_at ON ai_presenter_analytics_events(created_at DESC);
CREATE INDEX idx_ai_presenter_analytics_events_session_id ON ai_presenter_analytics_events(session_id);

-- -------------------------------------------------------
-- File Uploads Table (Supabase Storage Tracking)
-- -------------------------------------------------------
CREATE TABLE ai_presenter_file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Association
    client_id UUID NOT NULL REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,

    -- File Information
    filename TEXT NOT NULL,
    storage_path TEXT UNIQUE NOT NULL, -- Path in Supabase Storage
    public_url TEXT, -- Public URL if applicable

    -- File Metadata
    file_size INTEGER, -- Size in bytes
    mime_type TEXT,

    -- Organization
    file_type TEXT, -- logo, image, video, document, etc.
    entity_type TEXT, -- client, slide, case_study, service, etc.
    entity_id UUID, -- ID of the related entity

    -- Metadata
    uploaded_by UUID, -- References user from main Disruptors AI users table
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_ai_presenter_file_uploads_client_id ON ai_presenter_file_uploads(client_id);
CREATE INDEX idx_ai_presenter_file_uploads_storage_path ON ai_presenter_file_uploads(storage_path);
CREATE INDEX idx_ai_presenter_file_uploads_entity ON ai_presenter_file_uploads(entity_type, entity_id);

-- -------------------------------------------------------
-- Cache Table (Performance Optimization)
-- -------------------------------------------------------
CREATE TABLE ai_presenter_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Cache Key
    cache_key TEXT UNIQUE NOT NULL,

    -- Cache Value
    cache_value JSONB NOT NULL,

    -- Expiration
    expires_at TIMESTAMPTZ NOT NULL,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Auto-cleanup
    CONSTRAINT ai_presenter_cache_valid_expiration CHECK (expires_at > created_at)
);

-- Create indexes for cache lookups
CREATE INDEX idx_ai_presenter_cache_key ON ai_presenter_cache(cache_key);
CREATE INDEX idx_ai_presenter_cache_expires_at ON ai_presenter_cache(expires_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE ai_presenter_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_presenter_access_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_presenter_presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_presenter_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_presenter_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_presenter_case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_presenter_competitive_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_presenter_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_presenter_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_presenter_file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_presenter_cache ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- Admin Policies (Full Access for Authenticated Users)
-- -------------------------------------------------------

-- Clients: Admins have full access
CREATE POLICY "Admins can view all clients"
    ON ai_presenter_clients FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can create clients"
    ON ai_presenter_clients FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update clients"
    ON ai_presenter_clients FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete clients"
    ON ai_presenter_clients FOR DELETE
    USING (auth.role() = 'authenticated');

-- Access Links: Admins have full access
CREATE POLICY "Admins can view all access links"
    ON ai_presenter_access_links FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can create access links"
    ON ai_presenter_access_links FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update access links"
    ON ai_presenter_access_links FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete access links"
    ON ai_presenter_access_links FOR DELETE
    USING (auth.role() = 'authenticated');

-- Presentations: Admins have full access
CREATE POLICY "Admins can manage presentations"
    ON ai_presenter_presentations FOR ALL
    USING (auth.role() = 'authenticated');

-- Slides: Admins have full access
CREATE POLICY "Admins can manage slides"
    ON ai_presenter_slides FOR ALL
    USING (auth.role() = 'authenticated');

-- Services: Admins have full access
CREATE POLICY "Admins can manage services"
    ON ai_presenter_services FOR ALL
    USING (auth.role() = 'authenticated');

-- Case Studies: Admins have full access
CREATE POLICY "Admins can manage case studies"
    ON ai_presenter_case_studies FOR ALL
    USING (auth.role() = 'authenticated');

-- Competitive Analysis: Admins have full access
CREATE POLICY "Admins can manage competitive analysis"
    ON ai_presenter_competitive_analysis FOR ALL
    USING (auth.role() = 'authenticated');

-- Team Members: Admins have full access
CREATE POLICY "Admins can manage team members"
    ON ai_presenter_team_members FOR ALL
    USING (auth.role() = 'authenticated');

-- Analytics: Admins can view, system can insert
CREATE POLICY "Admins can view analytics"
    ON ai_presenter_analytics_events FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert analytics"
    ON ai_presenter_analytics_events FOR INSERT
    WITH CHECK (true); -- Allow anonymous analytics tracking

-- File Uploads: Admins have full access
CREATE POLICY "Admins can manage file uploads"
    ON ai_presenter_file_uploads FOR ALL
    USING (auth.role() = 'authenticated');

-- Cache: System level access
CREATE POLICY "System can manage cache"
    ON ai_presenter_cache FOR ALL
    USING (true);

-- -------------------------------------------------------
-- Public Read Policies (For Presentation Views)
-- -------------------------------------------------------
-- Note: Public read access will be controlled at the application level
-- via token validation. These policies allow the service role to fetch data.

CREATE POLICY "Service role can read all data"
    ON ai_presenter_clients FOR SELECT
    USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can read presentations"
    ON ai_presenter_presentations FOR SELECT
    USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can read slides"
    ON ai_presenter_slides FOR SELECT
    USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can read services"
    ON ai_presenter_services FOR SELECT
    USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can read case studies"
    ON ai_presenter_case_studies FOR SELECT
    USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can read competitive analysis"
    ON ai_presenter_competitive_analysis FOR SELECT
    USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can read team members"
    ON ai_presenter_team_members FOR SELECT
    USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- -------------------------------------------------------
-- Function: Generate Secure Access Token
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION ai_presenter_generate_access_token()
RETURNS TEXT AS $$
BEGIN
    RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -------------------------------------------------------
-- Function: Validate Access Token
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION ai_presenter_validate_access_token(
    p_token TEXT,
    p_password TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_link RECORD;
    v_result JSONB;
BEGIN
    -- Fetch the access link
    SELECT * INTO v_link
    FROM ai_presenter_access_links
    WHERE token = p_token;

    -- Check if link exists
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'valid', false,
            'error', 'Invalid access token'
        );
    END IF;

    -- Check if link is active
    IF v_link.status != 'active' THEN
        RETURN jsonb_build_object(
            'valid', false,
            'error', 'Access link is not active'
        );
    END IF;

    -- Check expiration
    IF v_link.expires_at IS NOT NULL AND v_link.expires_at < NOW() THEN
        -- Auto-expire the link
        UPDATE ai_presenter_access_links
        SET status = 'expired'
        WHERE id = v_link.id;

        RETURN jsonb_build_object(
            'valid', false,
            'error', 'Access link has expired'
        );
    END IF;

    -- Check max views
    IF v_link.max_views IS NOT NULL AND v_link.view_count >= v_link.max_views THEN
        RETURN jsonb_build_object(
            'valid', false,
            'error', 'Maximum view count reached'
        );
    END IF;

    -- Check password if required
    IF v_link.password_hash IS NOT NULL THEN
        IF p_password IS NULL THEN
            RETURN jsonb_build_object(
                'valid', false,
                'error', 'Password required',
                'requires_password', true
            );
        END IF;

        -- Verify password (assumes bcrypt)
        IF NOT (v_link.password_hash = crypt(p_password, v_link.password_hash)) THEN
            RETURN jsonb_build_object(
                'valid', false,
                'error', 'Invalid password'
            );
        END IF;
    END IF;

    -- Update view count and last accessed
    UPDATE ai_presenter_access_links
    SET
        view_count = view_count + 1,
        last_accessed_at = NOW()
    WHERE id = v_link.id;

    -- Return success with client info
    RETURN jsonb_build_object(
        'valid', true,
        'client_id', v_link.client_id,
        'access_link_id', v_link.id,
        'allowed_sections', v_link.allowed_sections,
        'custom_message', v_link.custom_message
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -------------------------------------------------------
-- Function: Update Updated_At Timestamp
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION ai_presenter_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -------------------------------------------------------
-- Triggers: Auto-update updated_at column
-- -------------------------------------------------------
CREATE TRIGGER ai_presenter_clients_updated_at
    BEFORE UPDATE ON ai_presenter_clients
    FOR EACH ROW
    EXECUTE FUNCTION ai_presenter_update_updated_at();

CREATE TRIGGER ai_presenter_presentations_updated_at
    BEFORE UPDATE ON ai_presenter_presentations
    FOR EACH ROW
    EXECUTE FUNCTION ai_presenter_update_updated_at();

CREATE TRIGGER ai_presenter_slides_updated_at
    BEFORE UPDATE ON ai_presenter_slides
    FOR EACH ROW
    EXECUTE FUNCTION ai_presenter_update_updated_at();

CREATE TRIGGER ai_presenter_services_updated_at
    BEFORE UPDATE ON ai_presenter_services
    FOR EACH ROW
    EXECUTE FUNCTION ai_presenter_update_updated_at();

CREATE TRIGGER ai_presenter_case_studies_updated_at
    BEFORE UPDATE ON ai_presenter_case_studies
    FOR EACH ROW
    EXECUTE FUNCTION ai_presenter_update_updated_at();

CREATE TRIGGER ai_presenter_competitive_analysis_updated_at
    BEFORE UPDATE ON ai_presenter_competitive_analysis
    FOR EACH ROW
    EXECUTE FUNCTION ai_presenter_update_updated_at();

CREATE TRIGGER ai_presenter_team_members_updated_at
    BEFORE UPDATE ON ai_presenter_team_members
    FOR EACH ROW
    EXECUTE FUNCTION ai_presenter_update_updated_at();

-- -------------------------------------------------------
-- Function: Clean Expired Cache Entries
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION ai_presenter_clean_expired_cache()
RETURNS INTEGER AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    DELETE FROM ai_presenter_cache
    WHERE expires_at < NOW();

    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STORAGE BUCKETS (Execute after migration)
-- =====================================================
-- Note: These need to be created via Supabase Dashboard or API
--
-- Bucket: ai-presenter-files
-- - Public: false (access controlled via signed URLs)
-- - Allowed MIME types: image/*, video/*, application/pdf
-- - Max file size: 50MB
-- - Folder structure: {client_id}/{entity_type}/{filename}

-- =====================================================
-- SEED DATA (Optional - for development)
-- =====================================================
-- Uncomment below to add sample data

/*
-- Sample Client
INSERT INTO ai_presenter_clients (name, slug, description, status)
VALUES (
    'Disruptors AI',
    'disruptors-ai',
    'AI-powered business automation platform',
    'active'
);

-- Sample Access Link
INSERT INTO ai_presenter_access_links (client_id, token, name)
SELECT
    id,
    ai_presenter_generate_access_token(),
    'Demo Access Link'
FROM ai_presenter_clients
WHERE slug = 'disruptors-ai';
*/

-- =====================================================
-- COMPLETION
-- =====================================================
-- Migration complete!
-- Next steps:
-- 1. Create Supabase Storage bucket: 'ai-presenter-files'
-- 2. Configure bucket policies for authenticated uploads
-- 3. Update application environment variables
-- 4. Run data migration scripts if migrating from Base44

COMMENT ON SCHEMA public IS 'AI Presenter schema migration completed on 2025-01-13';
