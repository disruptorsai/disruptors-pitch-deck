# AI Presenter - Complete Product Requirements Document
## Optimized for Base44 / Lovable / Bolt

---

## PROJECT OVERVIEW

Build a professional presentation platform for agencies and consultants that provides secure, token-based access control for pitch decks, AI-powered competitive analysis using Claude 3.5, and comprehensive analytics tracking. The application features dynamic presentation personalization, voice interaction capabilities, and a complete admin interface for managing clients, content, and access links.

---

## TECH STACK

### Frontend
- **Framework**: React 18+ with Vite
- **Language**: TypeScript + JSX (mixed)
- **Routing**: React Router v7 with nested routes
- **State Management**: TanStack React Query v5 for data fetching
- **Styling**: Tailwind CSS 3.x with custom animations
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion for advanced animations
- **Icons**: Lucide React

### Backend & Database
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Storage**: Supabase Storage for file uploads
- **Authentication**: Token-based access control (no user accounts for viewers)
- **Serverless Functions**: Netlify Functions for AI and secure operations

### AI & External APIs
- **AI Provider**: Anthropic Claude 3.5 Sonnet via @anthropic-ai/sdk
- **Voice**: ElevenLabs Conversational AI (optional integration)
- **Web Search**: SerpAPI (optional, for business intelligence)
- **Web Scraping**: Firecrawl API (optional, for business intelligence)

### Deployment
- **Hosting**: Netlify
- **Build**: Vite production build to dist/
- **Environment**: Node 18+

---

## ENVIRONMENT VARIABLES

```bash
# Supabase (Required)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Anthropic AI (Required for AI features)
VITE_ANTHROPIC_API_KEY=your-anthropic-key

# Optional External APIs
VITE_SERPAPI_KEY=your-serpapi-key
VITE_FIRECRAWL_API_KEY=your-firecrawl-key

# Application Configuration
VITE_ANALYTICS_ENABLED=true
VITE_APP_URL=https://your-domain.com
```

**IMPORTANT**: All client-side environment variables MUST be prefixed with `VITE_` because this is a Vite project, not Next.js.

---

## DATABASE SCHEMA

### Table Naming Convention
All tables use the `ai_presenter_` prefix to namespace them within a shared Supabase project.

### Custom PostgreSQL Types

```sql
-- Client status
CREATE TYPE ai_presenter_client_status AS ENUM ('active', 'archived', 'draft');

-- Access link status
CREATE TYPE ai_presenter_access_status AS ENUM ('active', 'expired', 'revoked');

-- Analytics event types
CREATE TYPE ai_presenter_event_type AS ENUM (
    'presentation_view',
    'slide_view',
    'case_study_view',
    'service_view',
    'pdf_download',
    'link_click',
    'form_submit'
);
```

### 1. ai_presenter_clients

**Purpose**: Store client/company information with branding configuration

```sql
CREATE TABLE ai_presenter_clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Basic Information
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    industry TEXT,
    sub_industry TEXT,

    -- Branding
    logo_url TEXT,
    primary_color TEXT DEFAULT '#000000',
    secondary_color TEXT DEFAULT '#ffffff',

    -- Contact Information
    website TEXT,
    email TEXT,
    phone TEXT,

    -- Business Intelligence (for personalization)
    company_size TEXT,
    annual_revenue TEXT,
    target_market TEXT,
    pain_points JSONB DEFAULT '[]'::jsonb,
    business_goals JSONB DEFAULT '[]'::jsonb,

    -- Configuration
    status ai_presenter_client_status DEFAULT 'draft',
    settings JSONB DEFAULT '{}'::jsonb,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,

    CONSTRAINT ai_presenter_clients_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX idx_ai_presenter_clients_slug ON ai_presenter_clients(slug);
CREATE INDEX idx_ai_presenter_clients_status ON ai_presenter_clients(status);
```

### 2. ai_presenter_access_links

**Purpose**: Token-based access control for secure presentation sharing

```sql
CREATE TABLE ai_presenter_access_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Link Information
    client_id UUID NOT NULL REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,

    -- Access Control
    status ai_presenter_access_status DEFAULT 'active',
    expires_at TIMESTAMPTZ,
    max_views INTEGER,
    view_count INTEGER DEFAULT 0,

    -- Password Protection (optional)
    password_hash TEXT,

    -- Customization
    custom_message TEXT,
    allowed_sections JSONB,

    -- Tracking
    last_accessed_at TIMESTAMPTZ,
    ip_whitelist TEXT[],

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,

    CONSTRAINT ai_presenter_access_links_token_format CHECK (LENGTH(token) >= 32)
);

CREATE INDEX idx_ai_presenter_access_links_token ON ai_presenter_access_links(token);
CREATE INDEX idx_ai_presenter_access_links_client_id ON ai_presenter_access_links(client_id);
```

### 3. ai_presenter_presentations

**Purpose**: Presentation configuration and hero content

```sql
CREATE TABLE ai_presenter_presentations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

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
    theme JSONB DEFAULT '{}'::jsonb,
    layout TEXT DEFAULT 'modern',
    is_default BOOLEAN DEFAULT false,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_presenter_presentations_client_id ON ai_presenter_presentations(client_id);
CREATE UNIQUE INDEX idx_ai_presenter_presentations_one_default_per_client
    ON ai_presenter_presentations(client_id)
    WHERE is_default = true;
```

### 4. ai_presenter_slides

**Purpose**: Individual presentation slides with ordering

```sql
CREATE TABLE ai_presenter_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    presentation_id UUID NOT NULL REFERENCES ai_presenter_presentations(id) ON DELETE CASCADE,

    -- Content
    title TEXT NOT NULL,
    subtitle TEXT,
    content TEXT,

    -- Media
    image_url TEXT,
    video_url TEXT,
    background_image_url TEXT,

    -- Layout
    slide_type TEXT DEFAULT 'content',
    layout JSONB DEFAULT '{}'::jsonb,

    -- Ordering
    order_index INTEGER NOT NULL DEFAULT 0,

    -- Visibility
    is_visible BOOLEAN DEFAULT true,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_presenter_slides_presentation_id ON ai_presenter_slides(presentation_id);
CREATE INDEX idx_ai_presenter_slides_order_index ON ai_presenter_slides(presentation_id, order_index);
```

### 5. ai_presenter_services

**Purpose**: Service offerings displayed in the presentation

```sql
CREATE TABLE ai_presenter_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    client_id UUID NOT NULL REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,

    -- Content
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,

    -- Media
    icon_url TEXT,
    image_url TEXT,

    -- Pricing (optional)
    pricing JSONB,

    -- Ordering
    order_index INTEGER NOT NULL DEFAULT 0,

    -- Visibility
    is_visible BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT ai_presenter_services_unique_slug_per_client UNIQUE (client_id, slug)
);

CREATE INDEX idx_ai_presenter_services_client_id ON ai_presenter_services(client_id);
```

### 6. ai_presenter_case_studies

**Purpose**: Portfolio case studies with metrics

```sql
CREATE TABLE ai_presenter_case_studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    client_id UUID NOT NULL REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,

    -- Basic Information
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    client_name TEXT NOT NULL,
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
    gallery_urls JSONB DEFAULT '[]'::jsonb,

    -- Metrics
    metrics JSONB DEFAULT '[]'::jsonb,

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

    CONSTRAINT ai_presenter_case_studies_unique_slug_per_client UNIQUE (client_id, slug)
);

CREATE INDEX idx_ai_presenter_case_studies_client_id ON ai_presenter_case_studies(client_id);
CREATE INDEX idx_ai_presenter_case_studies_tags ON ai_presenter_case_studies USING GIN(tags);
```

### 7. ai_presenter_competitive_analysis

**Purpose**: AI-generated competitive analysis and market insights

```sql
CREATE TABLE ai_presenter_competitive_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    client_id UUID NOT NULL REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,

    -- Analysis Content
    title TEXT NOT NULL DEFAULT 'Competitive Analysis',
    executive_summary TEXT,

    -- Market Overview
    market_size TEXT,
    market_trends JSONB DEFAULT '[]'::jsonb,

    -- Competitors
    competitors JSONB DEFAULT '[]'::jsonb,

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
    ai_model TEXT,
    generation_prompt TEXT,
    generated_at TIMESTAMPTZ,

    -- Visibility
    is_visible BOOLEAN DEFAULT true,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT ai_presenter_competitive_analysis_one_per_client UNIQUE (client_id)
);

CREATE INDEX idx_ai_presenter_competitive_analysis_client_id ON ai_presenter_competitive_analysis(client_id);
```

### 8. ai_presenter_team_members

**Purpose**: Team profiles for the About/Team section

```sql
CREATE TABLE ai_presenter_team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

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

CREATE INDEX idx_ai_presenter_team_members_client_id ON ai_presenter_team_members(client_id);
```

### 9. ai_presenter_analytics_events

**Purpose**: Track user interactions and engagement

```sql
CREATE TABLE ai_presenter_analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Association
    client_id UUID REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,
    access_link_id UUID REFERENCES ai_presenter_access_links(id) ON DELETE SET NULL,

    -- Event Data
    event_type ai_presenter_event_type NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,

    -- Session Tracking
    session_id TEXT,

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

CREATE INDEX idx_ai_presenter_analytics_events_client_id ON ai_presenter_analytics_events(client_id);
CREATE INDEX idx_ai_presenter_analytics_events_created_at ON ai_presenter_analytics_events(created_at DESC);
CREATE INDEX idx_ai_presenter_analytics_events_session_id ON ai_presenter_analytics_events(session_id);
```

### 10. ai_presenter_file_uploads

**Purpose**: Track files uploaded to Supabase Storage

```sql
CREATE TABLE ai_presenter_file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    client_id UUID NOT NULL REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,

    -- File Information
    filename TEXT NOT NULL,
    storage_path TEXT UNIQUE NOT NULL,
    public_url TEXT,

    -- File Metadata
    file_size INTEGER,
    mime_type TEXT,

    -- Organization
    file_type TEXT,
    entity_type TEXT,
    entity_id UUID,

    -- Metadata
    uploaded_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_presenter_file_uploads_client_id ON ai_presenter_file_uploads(client_id);
CREATE INDEX idx_ai_presenter_file_uploads_entity ON ai_presenter_file_uploads(entity_type, entity_id);
```

### 11. ai_presenter_cache

**Purpose**: Database-level caching for performance optimization

```sql
CREATE TABLE ai_presenter_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    cache_key TEXT UNIQUE NOT NULL,
    cache_value JSONB NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT ai_presenter_cache_valid_expiration CHECK (expires_at > created_at)
);

CREATE INDEX idx_ai_presenter_cache_key ON ai_presenter_cache(cache_key);
CREATE INDEX idx_ai_presenter_cache_expires_at ON ai_presenter_cache(expires_at);
```

### 12. ai_presenter_voice_sessions

**Purpose**: Track voice conversation sessions with ElevenLabs

```sql
CREATE TABLE ai_presenter_voice_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Association
    client_id UUID NOT NULL REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,
    access_link_id UUID REFERENCES ai_presenter_access_links(id) ON DELETE SET NULL,

    -- Session Information
    session_id TEXT NOT NULL,
    elevenlabs_conversation_id TEXT,
    agent_id TEXT,

    -- Configuration
    interaction_mode TEXT DEFAULT 'voice',
    current_slide_slug TEXT,

    -- Status
    status TEXT DEFAULT 'active',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_presenter_voice_sessions_session_id ON ai_presenter_voice_sessions(session_id);
CREATE INDEX idx_ai_presenter_voice_sessions_client_id ON ai_presenter_voice_sessions(client_id);
```

### 13. ai_presenter_voice_messages

**Purpose**: Store individual messages in voice conversations

```sql
CREATE TABLE ai_presenter_voice_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    voice_session_id UUID NOT NULL REFERENCES ai_presenter_voice_sessions(id) ON DELETE CASCADE,

    -- Message Content
    role TEXT NOT NULL,
    content TEXT NOT NULL,

    -- Audio
    audio_duration_ms INTEGER,
    audio_url TEXT,
    confidence_score DECIMAL(3, 2),

    -- Context
    current_slide_slug TEXT,
    sequence_number INTEGER NOT NULL,

    -- Analysis
    intent TEXT,
    topics TEXT[],
    sentiment TEXT,
    sentiment_score DECIMAL(3, 2),

    -- Action Taken
    action_taken TEXT,
    action_params JSONB,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_presenter_voice_messages_session_id ON ai_presenter_voice_messages(voice_session_id);
CREATE INDEX idx_ai_presenter_voice_messages_sequence ON ai_presenter_voice_messages(voice_session_id, sequence_number);
```

### 14. ai_presenter_conversation_insights

**Purpose**: AI-generated insights from conversation analysis

```sql
CREATE TABLE ai_presenter_conversation_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    voice_session_id UUID NOT NULL REFERENCES ai_presenter_voice_sessions(id) ON DELETE CASCADE,

    -- Interest Analysis
    primary_interests TEXT[],
    objections_raised TEXT[],

    -- Engagement Metrics
    engagement_score INTEGER CHECK (engagement_score >= 0 AND engagement_score <= 100),
    interest_level TEXT,
    readiness_to_buy TEXT,

    -- Service Interest
    services_discussed TEXT[],
    recommended_tier TEXT,

    -- Follow-up
    suggested_follow_up TEXT,
    next_best_action TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT ai_presenter_conversation_insights_one_per_session UNIQUE (voice_session_id)
);

CREATE INDEX idx_ai_presenter_conversation_insights_session_id ON ai_presenter_conversation_insights(voice_session_id);
```

---

## POSTGRESQL FUNCTIONS

### 1. Generate Access Token

```sql
CREATE OR REPLACE FUNCTION ai_presenter_generate_access_token()
RETURNS TEXT AS $$
BEGIN
    RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Validate Access Token

```sql
CREATE OR REPLACE FUNCTION ai_presenter_validate_access_token(
    p_token TEXT,
    p_password TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_link RECORD;
BEGIN
    SELECT * INTO v_link FROM ai_presenter_access_links WHERE token = p_token;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('valid', false, 'error', 'Invalid access token');
    END IF;

    IF v_link.status != 'active' THEN
        RETURN jsonb_build_object('valid', false, 'error', 'Access link is not active');
    END IF;

    IF v_link.expires_at IS NOT NULL AND v_link.expires_at < NOW() THEN
        UPDATE ai_presenter_access_links SET status = 'expired' WHERE id = v_link.id;
        RETURN jsonb_build_object('valid', false, 'error', 'Access link has expired');
    END IF;

    IF v_link.max_views IS NOT NULL AND v_link.view_count >= v_link.max_views THEN
        RETURN jsonb_build_object('valid', false, 'error', 'Maximum view count reached');
    END IF;

    IF v_link.password_hash IS NOT NULL THEN
        IF p_password IS NULL THEN
            RETURN jsonb_build_object('valid', false, 'error', 'Password required', 'requires_password', true);
        END IF;

        IF NOT (v_link.password_hash = crypt(p_password, v_link.password_hash)) THEN
            RETURN jsonb_build_object('valid', false, 'error', 'Invalid password');
        END IF;
    END IF;

    UPDATE ai_presenter_access_links
    SET view_count = view_count + 1, last_accessed_at = NOW()
    WHERE id = v_link.id;

    RETURN jsonb_build_object(
        'valid', true,
        'client_id', v_link.client_id,
        'access_link_id', v_link.id,
        'allowed_sections', v_link.allowed_sections,
        'custom_message', v_link.custom_message
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Auto-update Updated_At Timestamp

```sql
CREATE OR REPLACE FUNCTION ai_presenter_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 4. Apply Triggers

```sql
CREATE TRIGGER ai_presenter_clients_updated_at
    BEFORE UPDATE ON ai_presenter_clients
    FOR EACH ROW EXECUTE FUNCTION ai_presenter_update_updated_at();

CREATE TRIGGER ai_presenter_presentations_updated_at
    BEFORE UPDATE ON ai_presenter_presentations
    FOR EACH ROW EXECUTE FUNCTION ai_presenter_update_updated_at();

CREATE TRIGGER ai_presenter_slides_updated_at
    BEFORE UPDATE ON ai_presenter_slides
    FOR EACH ROW EXECUTE FUNCTION ai_presenter_update_updated_at();

CREATE TRIGGER ai_presenter_services_updated_at
    BEFORE UPDATE ON ai_presenter_services
    FOR EACH ROW EXECUTE FUNCTION ai_presenter_update_updated_at();

CREATE TRIGGER ai_presenter_case_studies_updated_at
    BEFORE UPDATE ON ai_presenter_case_studies
    FOR EACH ROW EXECUTE FUNCTION ai_presenter_update_updated_at();

CREATE TRIGGER ai_presenter_competitive_analysis_updated_at
    BEFORE UPDATE ON ai_presenter_competitive_analysis
    FOR EACH ROW EXECUTE FUNCTION ai_presenter_update_updated_at();

CREATE TRIGGER ai_presenter_team_members_updated_at
    BEFORE UPDATE ON ai_presenter_team_members
    FOR EACH ROW EXECUTE FUNCTION ai_presenter_update_updated_at();
```

---

## ROW LEVEL SECURITY (RLS) POLICIES

### Enable RLS on All Tables

```sql
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
ALTER TABLE ai_presenter_voice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_presenter_voice_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_presenter_conversation_insights ENABLE ROW LEVEL SECURITY;
```

### Admin Policies (Authenticated Users)

```sql
-- Admins can do everything on all tables
CREATE POLICY "Admins full access to clients"
    ON ai_presenter_clients FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to access_links"
    ON ai_presenter_access_links FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to presentations"
    ON ai_presenter_presentations FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to slides"
    ON ai_presenter_slides FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to services"
    ON ai_presenter_services FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to case_studies"
    ON ai_presenter_case_studies FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to competitive_analysis"
    ON ai_presenter_competitive_analysis FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to team_members"
    ON ai_presenter_team_members FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to file_uploads"
    ON ai_presenter_file_uploads FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins view analytics"
    ON ai_presenter_analytics_events FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to voice_sessions"
    ON ai_presenter_voice_sessions FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to voice_messages"
    ON ai_presenter_voice_messages FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to conversation_insights"
    ON ai_presenter_conversation_insights FOR ALL
    USING (auth.role() = 'authenticated');
```

### Public Policies (Anonymous Users)

```sql
-- Analytics can be inserted by anyone
CREATE POLICY "Anyone can insert analytics"
    ON ai_presenter_analytics_events FOR INSERT
    WITH CHECK (true);

-- Cache can be managed by system
CREATE POLICY "System can manage cache"
    ON ai_presenter_cache FOR ALL
    USING (true);

-- Service role can read all data (for token-validated access)
CREATE POLICY "Service role read clients"
    ON ai_presenter_clients FOR SELECT
    USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role read presentations"
    ON ai_presenter_presentations FOR SELECT
    USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role read slides"
    ON ai_presenter_slides FOR SELECT
    USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role read services"
    ON ai_presenter_services FOR SELECT
    USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role read case_studies"
    ON ai_presenter_case_studies FOR SELECT
    USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role read competitive_analysis"
    ON ai_presenter_competitive_analysis FOR SELECT
    USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role read team_members"
    ON ai_presenter_team_members FOR SELECT
    USING (auth.jwt()->>'role' = 'service_role');
```

---

## SUPABASE STORAGE

### Bucket Configuration

**Bucket Name**: `ai-presenter-files`

**Settings**:
- Public: `false` (use signed URLs)
- File size limit: 50MB
- Allowed MIME types: `image/*`, `video/*`, `application/pdf`

**Folder Structure**:
```
ai-presenter-files/
├── {client_id}/
│   ├── logo/
│   ├── images/
│   ├── videos/
│   ├── documents/
│   └── case-studies/
```

**Storage Policies**:

```sql
-- Authenticated users can upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'ai-presenter-files');

-- Authenticated users can read all files
CREATE POLICY "Authenticated users can read files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'ai-presenter-files');

-- Authenticated users can update files they uploaded
CREATE POLICY "Authenticated users can update files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'ai-presenter-files');

-- Authenticated users can delete files
CREATE POLICY "Authenticated users can delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'ai-presenter-files');
```

---

## APPLICATION ROUTES

### Public Routes (No Authentication Required)

**1. Home Page** - `/`
- Hero section with scramble text animation
- Start button that opens icebreaker dialog
- Dashboard navigation button
- Social media links
- Easter egg: Click "Disrupt" 5 times in 2 seconds to reveal admin/demos access

**2. Dashboard** - `/Dashboard`
- Navigation hub for all sections
- Cards for each section with icons and descriptions
- Smooth animations and hover effects
- Background video or gradient

**3. Introduction** - `/Introduction`
- Who we are section
- Mission and vision
- Key statistics
- Team overview

**4. The Problem** - `/TheProblem`
- Pain points visualization
- Industry challenges
- Market gap analysis

**5. Why AI** - `/WhyAI`
- AI benefits explanation
- Use cases and examples
- ROI calculator

**6. Diagnostic** - `/Diagnostic`
- Interactive business diagnostic tool
- Multi-step form with progress indicator
- Real-time scoring
- Results with personalized recommendations

**7. Case Studies** - `/CaseStudies`
- Grid or carousel of case studies
- Filter by industry/category
- Detailed case study modals
- Metrics and results visualization

**8. Capabilities** - `/Capabilities`
- Services showcase
- Feature highlights
- Technology stack
- Integration capabilities

**9. Blueprint** - `/Blueprint`
- Implementation roadmap
- Timeline visualization
- Phase-by-phase breakdown
- Milestones and deliverables

**10. Pricing** - `/Pricing`
- Pricing tiers comparison
- Feature matrix
- Custom quote form
- FAQ section

**11. Call To Action** - `/CallToAction`
- Final conversion section
- Contact form
- Calendar scheduling integration (optional)
- Social proof

**12. Presentation Viewer** - `/p/:token`
- Token-validated access
- Password prompt if required
- Full presentation with navigation
- Analytics tracking on all interactions

**13. Presentation Error** - `/presentation-error`
- Shown when token is invalid, expired, or access denied
- User-friendly error messages
- Contact information

### Admin Routes (Protected)

**Admin Layout** - `/admin/*`
- Side navigation bar with sections
- User profile dropdown
- Logout button
- Breadcrumb navigation

**14. Admin Dashboard** - `/admin`
- Overview statistics
- Recent activity feed
- Quick actions
- Charts and metrics

**15. Clients Manager** - `/admin/clients`
- List of all clients with filters and search
- Status badges (active, draft, archived)
- Actions: View, Edit, Delete, Create Access Link
- Pagination and sorting

**16. Smart Client Form** - `/admin/clients/new`
- Multi-step form for creating new clients
- AI-powered business intelligence extraction
- Website URL input → Auto-fetch business data
- Generate competitive analysis during creation
- Logo upload
- Brand color picker

**17. Client Edit Form** - `/admin/clients/:id`
- Edit existing client information
- Update branding
- Manage presentations, services, case studies
- View analytics

**18. Access Link Generator** - `/admin/access-links`
- Create new access links
- Select client from dropdown
- Configure expiration, view limits, password
- Copy link to clipboard
- View all links with status

**19. Analytics Dashboard** - `/admin/analytics`
- Client-level analytics
- Event timeline
- Geographic distribution map
- Top pages and engagement metrics
- Export reports

**20. Content Editor** - `/admin/content`
- Drag-and-drop slide reordering
- Inline editing of content
- Media library
- Preview mode

**21. Settings** - `/admin/settings`
- Application configuration
- API key management
- Notification settings
- User management

---

## CORE COMPONENTS

### 1. Layout Component (`src/pages/Layout.jsx`)

**Purpose**: Wrapper for public presentation pages with navigation

**Features**:
- Persistent navigation sidebar with slide links
- Progress indicator
- Branding (client logo or Disruptors logo)
- Smooth page transitions
- Responsive hamburger menu on mobile

**Props**:
- `currentPageName`: string - Active page for highlighting
- `children`: ReactNode - Page content

### 2. Admin Layout Component (`src/pages/admin/AdminLayout.jsx`)

**Purpose**: Wrapper for admin pages with sidebar navigation

**Features**:
- Left sidebar with navigation links
- User profile section
- Logout functionality
- Breadcrumb navigation
- Responsive drawer on mobile

### 3. AnimatedHero Component (`src/components/AnimatedHero.jsx`)

**Purpose**: Animated background for hero sections

**Features**:
- Particle system or gradient animation
- Customizable colors based on client branding
- Performance-optimized with React Three Fiber or CSS

### 4. ScrambleText Component (`src/components/effects/ScrambleText.jsx`)

**Purpose**: Text scramble/glitch animation effect

**Props**:
- `text`: string - Text to display
- `delay`: number - Delay before animation starts
- `autoScramble`: boolean - Auto-repeat animation
- `scrambleInterval`: number - Time between auto-scrambles

### 5. TouchFeedback Component (`src/components/TouchFeedback.jsx`)

**Purpose**: Touch/click feedback for interactive elements

**Props**:
- `variant`: 'button' | 'subtle' | 'card'
- `children`: ReactNode

**Features**:
- Ripple effect on touch/click
- Haptic feedback on mobile (if supported)
- Scale animation

### 6. ScrollReveal Component (`src/components/ScrollReveal.jsx`)

**Purpose**: Reveal animations on scroll

**Props**:
- `animation`: 'fade' | 'slide' | 'scale' | 'rotate'
- `delay`: number
- `children`: ReactNode

**Features**:
- Intersection Observer for performance
- Customizable animation variants
- Once or repeat animations

### 7. ClientLogo Component (`src/components/branding/ClientLogo.jsx`)

**Purpose**: Display client logo with fallback

**Props**:
- `size`: 'small' | 'medium' | 'large'
- `className`: string

**Features**:
- Fetch logo from client data
- Fallback to Disruptors logo
- Responsive sizing

### 8. IcebreakerDialog Component (`src/components/conversation/IcebreakerDialog.jsx`)

**Purpose**: Interactive icebreaker question at start of presentation

**Props**:
- `isOpen`: boolean
- `onClose`: function
- `onSubmit`: function(data)

**Features**:
- Fun opening question
- Collect visitor's response
- Store in session for personalization
- Smooth modal animation

### 9. DiagnosticForm Component (`src/components/diagnostic/DiagnosticForm.jsx`)

**Purpose**: Multi-step business diagnostic questionnaire

**Features**:
- Progress indicator
- Question types: multiple choice, slider, text input
- Real-time scoring
- Results page with personalized recommendations
- Export results as PDF

### 10. ServiceCard Component (`src/components/services/ServiceCard.jsx`)

**Purpose**: Display individual service offering

**Props**:
- `service`: Service object
- `variant`: 'grid' | 'list' | 'featured'

**Features**:
- Icon display
- Feature list
- Pricing (if available)
- CTA button
- Hover effects

### 11. CaseStudyCard Component (`src/components/casestudies/CaseStudyCard.jsx`)

**Purpose**: Display case study in grid or carousel

**Props**:
- `caseStudy`: CaseStudy object
- `onClick`: function

**Features**:
- Featured image
- Client logo
- Metrics preview
- Category badge
- Read more button

### 12. MetricsDisplay Component (`src/components/metrics/MetricsDisplay.jsx`)

**Purpose**: Animated metrics/statistics display

**Props**:
- `metrics`: Array of { label, value, unit }

**Features**:
- Count-up animation
- Icons for visual interest
- Grid or horizontal layout

### 13. PricingCard Component (`src/components/pricing/PricingCard.jsx`)

**Purpose**: Display pricing tier

**Props**:
- `tier`: Pricing tier object
- `featured`: boolean

**Features**:
- Price display with currency
- Feature list with checkmarks
- CTA button
- Popular badge
- Hover animation

### 14. ContactForm Component (`src/components/forms/ContactForm.jsx`)

**Purpose**: Lead capture form

**Features**:
- Form validation
- Submit to database via API
- Success/error messages
- Loading state
- Integrates with analytics

### 15. AnalyticsTracker Component (`src/components/analytics/AnalyticsTracker.jsx`)

**Purpose**: Automatic event tracking

**Features**:
- Track page views on mount
- Track scroll depth
- Track time on page
- Track interactions (clicks, form submits)
- Send events to analytics service

---

## CUSTOM HOOKS

### 1. useClient Hook (`src/hooks/use-client.ts`)

**Purpose**: Fetch and cache client data

```typescript
const { client, loading, error, refetch } = useClient(clientSlug);
```

**Features**:
- React Query integration
- Automatic caching (5 min)
- Error handling
- Refetch capability

### 2. usePersonalizedPresentation Hook (`src/hooks/use-personalized-presentation.ts`)

**Purpose**: Fetch personalized presentation data

```typescript
const {
  client,
  personalization,
  isLoading,
  isGenerating
} = usePersonalizedPresentation();
```

**Features**:
- Detect if personalization exists
- Generate personalization if needed
- Loading states for generation
- Fallback to default content

### 3. useAnalytics Hook (`src/hooks/use-analytics.ts`)

**Purpose**: Track analytics events

```typescript
const { trackEvent, trackPageView } = useAnalytics();
```

**Features**:
- Automatic session ID generation
- IP and user agent detection
- Batch event sending
- Error resilience

### 4. useAccessToken Hook (`src/hooks/use-access-token.ts`)

**Purpose**: Validate and manage access tokens

```typescript
const {
  isValid,
  loading,
  error,
  validate,
  context
} = useAccessToken();
```

**Features**:
- Token validation via API
- Password handling
- Store context in session
- Redirect on invalid token

### 5. useMobile Hook (`src/hooks/use-mobile.jsx`)

**Purpose**: Detect mobile devices and screen size

```typescript
const isMobile = useMobile();
```

**Features**:
- Responsive breakpoint detection (768px)
- Window resize listener
- Debounced updates

---

## NETLIFY FUNCTIONS

### 1. Client Management Function

**Path**: `netlify/functions/client-management.js`

**Actions**:
- `get`: Get client by ID or slug
- `list`: List all clients with pagination
- `create`: Create new client
- `update`: Update existing client
- `delete`: Delete client

**Request**:
```json
{
  "action": "get",
  "payload": { "slug": "acme-corp" }
}
```

**Response**:
```json
{
  "id": "uuid",
  "name": "Acme Corp",
  "slug": "acme-corp",
  ...
}
```

### 2. AI Service Function

**Path**: `netlify/functions/ai-service.js`

**Actions**:
- `generateCompetitiveAnalysis`: Generate market analysis using Claude
- `generatePitchContent`: Generate pitch deck content
- `enhanceContent`: AI-enhance existing content
- `generateMetaDescription`: Generate SEO descriptions

**Request**:
```json
{
  "action": "generateCompetitiveAnalysis",
  "payload": {
    "name": "Acme Corp",
    "industry": "Enterprise SaaS",
    "description": "AI-powered workflow automation",
    "competitors": ["Competitor A", "Competitor B"]
  }
}
```

**Response**:
```json
{
  "title": "Competitive Analysis: Acme Corp",
  "executive_summary": "...",
  "market_size": "...",
  "market_trends": [...],
  "competitors": [...],
  "strengths": [...],
  "weaknesses": [...],
  "opportunities": [...],
  "threats": [...],
  "unique_value_proposition": "...",
  "competitive_advantages": [...],
  "ai_model": "claude-3-5-sonnet-20241022",
  "generation_prompt": "..."
}
```

### 3. Business Analyzer Function

**Path**: `netlify/functions/business-analyzer.js`

**Purpose**: Analyze business website and extract intelligence

**Actions**:
- `analyzeWebsite`: Scrape and analyze business website
- `extractBusinessInfo`: Extract company info, services, etc.
- `generatePersonalization`: Create personalized presentation content

**Request**:
```json
{
  "action": "analyzeWebsite",
  "payload": {
    "url": "https://example.com",
    "clientName": "Example Corp"
  }
}
```

**Response**:
```json
{
  "companyInfo": {
    "name": "Example Corp",
    "description": "...",
    "industry": "Technology",
    "services": [...]
  },
  "personalization": {
    "hero": {
      "headline": "Transform Example Corp with AI",
      "subheadline": "...",
      "ctaText": "See How We Can Help"
    },
    "painPoints": [...],
    "recommendations": [...]
  }
}
```

### 4. Presentation Personalizer Function

**Path**: `netlify/functions/presentation-personalizer.js`

**Purpose**: Generate personalized presentation content

**Request**:
```json
{
  "action": "personalize",
  "payload": {
    "clientId": "uuid",
    "businessData": {...}
  }
}
```

**Response**:
```json
{
  "hero": {
    "headline": "...",
    "subheadline": "...",
    "ctaText": "..."
  },
  "introduction": {
    "content": "..."
  },
  "services": [...],
  "caseStudies": [...]
}
```

---

## SDK IMPLEMENTATION

### Core SDK Class

**File**: `src/lib/ai-presenter-sdk.ts`

**Features**:
- In-memory caching with TTL
- Admin vs public client modes
- Error handling wrapper
- Type-safe operations

**Example Usage**:

```typescript
import { sdk, adminSDK } from '@/lib/ai-presenter-sdk';

// Public operations
const client = await sdk.getClientBySlug('acme-corp');
const services = await sdk.getServices(client.id);

// Admin operations
const newClient = await adminSDK.createClient({
  name: 'New Client',
  slug: 'new-client'
});
```

### Service Layer

**1. AI Service** (`src/lib/ai-service.ts`)
- Wrapper for Anthropic Claude API
- Calls Netlify Functions to keep API keys secure
- Methods: generateCompetitiveAnalysis, generatePitchContent, enhanceContent

**2. Storage Service** (`src/lib/storage-service.ts`)
- File upload/download
- Signed URL generation
- File organization by client/entity

**3. Analytics Service** (`src/lib/analytics-service.ts`)
- Event tracking
- Session management
- Batch event sending

**4. Business Analyzer** (`src/lib/business-analyzer.ts`)
- Website scraping integration
- Business intelligence extraction
- Personalization generation

---

## USER WORKFLOWS

### Workflow 1: Admin Creates New Client with AI

1. Admin navigates to `/admin/clients/new`
2. Enter client name and website URL
3. Click "Analyze Website" button
4. System calls business analyzer function
   - Scrapes website
   - Extracts business info (services, about, team)
   - Identifies industry and pain points
5. Form auto-populates with extracted data
6. Admin reviews and edits as needed
7. Click "Generate Competitive Analysis"
8. System calls AI service to generate market analysis
9. Admin reviews AI-generated content
10. Click "Create Client"
11. Client created in database
12. Redirect to client detail page

### Workflow 2: Admin Generates Access Link

1. Admin navigates to `/admin/access-links`
2. Click "Create New Link" button
3. Select client from dropdown
4. Enter link name (e.g., "Investor Meeting - March 2025")
5. Configure options:
   - Expiration date (optional)
   - Max views (optional)
   - Password protection (optional)
   - Allowed sections (optional - select which pages to show)
6. Click "Generate Link"
7. System generates secure token
8. Copy link to clipboard: `https://your-domain.com/p/{token}`
9. Share link with recipient

### Workflow 3: Prospect Accesses Presentation

1. Prospect receives link: `https://your-domain.com/p/{token}`
2. Clicks link → Redirects to presentation viewer
3. System validates token
4. If password-protected, show password prompt
5. Enter password → Validate
6. If valid, load client data and personalized content
7. Show icebreaker dialog (optional)
   - "What brings you here today?"
   - Capture response for personalization
8. Display home page with personalized content
9. Navigate through presentation using sidebar or bottom nav
10. All interactions tracked via analytics:
    - Page views
    - Time on page
    - Clicks
    - Form submissions

### Workflow 4: Admin Views Analytics

1. Admin navigates to `/admin/analytics`
2. Select client from dropdown
3. Select date range
4. View metrics:
   - Total views by access link
   - Unique sessions
   - Page engagement (time on page, scroll depth)
   - Geographic distribution
   - Conversion funnel
5. Export report as CSV or PDF
6. Identify high-engagement prospects
7. Follow up with personalized outreach

### Workflow 5: Personalized Presentation Generation

1. When prospect first accesses presentation via token
2. System checks if personalization exists for client
3. If not exists:
   - Show loading screen: "Personalizing Your Presentation..."
   - Call presentation personalizer function
   - Generate personalized content using:
     - Client business data
     - Industry insights
     - Competitive analysis
     - Visitor context (if available)
   - Save personalization to database
4. Load personalized content:
   - Custom hero headline mentioning client industry
   - Tailored pain points
   - Relevant case studies
   - Customized service recommendations
5. Display presentation with personalized content
6. Track effectiveness via analytics

---

## STYLING & DESIGN SYSTEM

### Color Palette

**Brand Colors** (Disruptors Media):
- Primary: `#FF6A00` (Orange)
- Secondary: `#0E0E0E` (Near Black)
- Accent: `#FFD700` (Gold)
- Background: `#0E0E0E`
- Text: `#FFFFFF`

**Semantic Colors**:
- Success: `#10B981` (Green)
- Error: `#EF4444` (Red)
- Warning: `#F59E0B` (Amber)
- Info: `#3B82F6` (Blue)

**Client Branding**:
- Use `client.primary_color` and `client.secondary_color` for gradients
- Apply to hero backgrounds, buttons, accents
- Maintain 4.5:1 contrast ratio for accessibility

### Typography

**Font Family**: System font stack
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

**Font Sizes**:
- Heading 1: `4xl` (2.25rem) on mobile, `7xl` (4.5rem) on desktop
- Heading 2: `3xl` (1.875rem) on mobile, `5xl` (3rem) on desktop
- Heading 3: `2xl` (1.5rem) on mobile, `3xl` (1.875rem) on desktop
- Body: `base` (1rem)
- Small: `sm` (0.875rem)

### Animations

**Page Transitions**:
- Fade + slide on route change
- Duration: 300ms
- Easing: ease-in-out

**Scroll Animations**:
- Fade in from bottom on scroll
- Stagger children by 100ms
- Trigger at 10% viewport intersection

**Hover Effects**:
- Scale: 1.05 on hover
- Glow effect on primary buttons
- Color transition: 200ms

**Special Effects**:
- Scramble text on hero headline
- Particle system on backgrounds
- Gradient animations

### Responsive Breakpoints

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

**Mobile-First Approach**:
- Default styles for mobile
- Use `md:` prefix for tablet and up
- Use `lg:` prefix for desktop

### Component Styling Patterns

**Cards**:
```css
bg-white/5
backdrop-blur-sm
border border-white/10
rounded-xl
p-6
hover:bg-white/10 transition-all duration-300
```

**Buttons**:
```css
Primary:
  bg-gradient-to-r from-[#FF6A00] to-[#FF8533]
  hover:shadow-[0_0_20px_rgba(255,106,0,0.5)]
  text-white font-bold px-6 py-3 rounded-xl

Secondary:
  border-2 border-white/20
  hover:border-white/40
  bg-white/5 backdrop-blur-sm
  text-white px-6 py-3 rounded-xl
```

**Inputs**:
```css
bg-white/10
border border-white/20
text-white
placeholder:text-white/40
focus:border-[#FF6A00]
focus:ring-2 focus:ring-[#FF6A00]/20
rounded-lg px-4 py-2
```

---

## SPECIAL FEATURES

### 1. AI-Powered Competitive Analysis

**Location**: Dashboard, Admin Client Form

**Functionality**:
- Admin inputs: company name, industry, description, competitors
- System calls Claude 3.5 Sonnet API
- AI generates:
  - Executive summary
  - Market size and trends
  - Competitor analysis
  - SWOT analysis
  - Unique value proposition
  - Competitive advantages
- Save to `ai_presenter_competitive_analysis` table
- Display in presentation with charts and visuals

**Claude Prompt Template**:
```
You are a business strategy consultant. Analyze the following company and provide a comprehensive competitive analysis.

Company: {name}
Industry: {industry}
Description: {description}
Known Competitors: {competitors}

Provide a detailed analysis including:
1. Executive Summary
2. Market Size and Growth Potential
3. Key Market Trends (at least 5)
4. Competitor Analysis (for each competitor: strengths, weaknesses, market share)
5. SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats)
6. Unique Value Proposition
7. Competitive Advantages (at least 5)

Format the response as JSON with the following structure:
{
  "title": "Competitive Analysis: [Company Name]",
  "executive_summary": "...",
  "market_size": "...",
  "market_trends": [
    { "title": "...", "description": "...", "impact": "high|medium|low" }
  ],
  "competitors": [
    {
      "name": "...",
      "description": "...",
      "strengths": ["..."],
      "weaknesses": ["..."],
      "market_share": "..."
    }
  ],
  "strengths": ["..."],
  "weaknesses": ["..."],
  "opportunities": ["..."],
  "threats": ["..."],
  "unique_value_proposition": "...",
  "competitive_advantages": ["..."]
}
```

### 2. Business Intelligence Extraction

**Location**: Admin Smart Client Form

**Functionality**:
- Admin enters website URL
- System scrapes website using Firecrawl API
- Extract:
  - Company name and tagline
  - About/description
  - Services offered
  - Team members
  - Contact information
  - Industry keywords
- Use Claude to analyze and structure data
- Auto-populate client form

**Claude Prompt for Extraction**:
```
Analyze the following website content and extract structured business information.

Website Content:
{scraped_content}

Extract and return JSON with:
{
  "name": "company name",
  "description": "concise description",
  "industry": "primary industry",
  "sub_industry": "sub-industry if applicable",
  "services": ["service 1", "service 2", ...],
  "team_members": [
    { "name": "...", "role": "...", "bio": "..." }
  ],
  "contact": {
    "email": "...",
    "phone": "...",
    "address": "..."
  },
  "pain_points": ["inferred pain point 1", ...],
  "target_market": "inferred target market"
}
```

### 3. Dynamic Content Personalization

**Location**: All public presentation pages

**Functionality**:
- On first access via token, check if personalization exists
- If not, generate personalized content:
  - Analyze client business data
  - Analyze visitor context (industry, company size, etc.)
  - Use Claude to generate customized:
    - Hero headline and subheadline
    - Introduction text mentioning client's industry
    - Service descriptions highlighting relevant features
    - Case study selection (most relevant to client)
    - Call-to-action copy
- Save personalization to database
- Load personalized content on subsequent visits

**Personalization AI Prompt**:
```
Create personalized presentation content for the following scenario:

Client Business:
- Name: {client.name}
- Industry: {client.industry}
- Description: {client.description}
- Pain Points: {client.pain_points}
- Goals: {client.business_goals}

Visitor Context:
- Icebreaker Response: {icebreaker_response}
- Session Data: {session_data}

Generate personalized content:
{
  "hero": {
    "headline": "compelling headline mentioning their industry",
    "subheadline": "value proposition tailored to their goals",
    "ctaText": "action-oriented CTA"
  },
  "introduction": {
    "content": "introduction acknowledging their business context"
  },
  "problem": {
    "content": "problem statement resonating with their pain points"
  },
  "solution": {
    "content": "solution highlighting relevant features"
  },
  "cta": {
    "content": "final CTA with urgency and relevance"
  }
}
```

### 4. Interactive Business Diagnostic

**Location**: `/Diagnostic` page

**Functionality**:
- Multi-step questionnaire (5-10 questions)
- Question types:
  - Multiple choice
  - Slider (1-10 scale)
  - Text input
- Real-time scoring based on answers
- Calculate scores for:
  - Digital Maturity: 0-100
  - AI Readiness: 0-100
  - Growth Potential: 0-100
- Results page shows:
  - Score breakdown with charts
  - Personalized recommendations
  - Suggested services based on scores
  - Next steps
- Export results as PDF
- Send results to admin via email

**Question Examples**:
1. "How much of your business processes are automated?" (Slider 0-10)
2. "What's your biggest challenge right now?" (Multiple choice)
3. "How do you currently handle customer data?" (Multiple choice)
4. "On a scale of 1-10, how satisfied are you with your current tools?" (Slider)
5. "What's your annual revenue?" (Range selection)

**Scoring Algorithm**:
```javascript
// Digital Maturity Score
const digitalMaturity = (
  (automationLevel * 10) +
  (digitalToolsUsage * 10) +
  (dataAnalyticsLevel * 10) +
  (customerExperienceScore * 10)
) / 4;

// AI Readiness Score
const aiReadiness = (
  (dataQuality * 10) +
  (technicalCapability * 10) +
  (teamReadiness * 10) +
  (budgetAllocation * 10)
) / 4;

// Growth Potential Score
const growthPotential = (
  (marketOpportunity * 10) +
  (competitivePosition * 10) +
  (innovationCapacity * 10) +
  (scalabilityScore * 10)
) / 4;
```

### 5. Voice Conversation with DisruptorBot

**Location**: Available on any page via floating button

**Functionality**:
- Floating microphone button in bottom-right corner
- Click to start voice conversation
- Integration with ElevenLabs Conversational AI
- Bot capabilities:
  - Answer questions about services
  - Navigate to different sections
  - Provide more details on case studies
  - Book a demo/meeting
  - Capture lead information
- Conversation stored in database:
  - Voice messages with transcripts
  - Intent recognition
  - Sentiment analysis
  - Actions taken (navigation, form fills)
- Admin can review conversations and insights

**Bot Configuration**:
```javascript
const disruptorBotConfig = {
  agentId: process.env.VITE_ELEVENLABS_AGENT_ID,
  voice: "professional-male",
  personality: "helpful, knowledgeable, consultative",
  knowledge: [
    "Services offered",
    "Case studies",
    "Pricing information",
    "Company background"
  ],
  actions: [
    "navigate_to_page",
    "show_case_study",
    "book_demo",
    "send_email"
  ]
};
```

### 6. Analytics Dashboard

**Location**: `/admin/analytics`

**Functionality**:
- Real-time metrics:
  - Total views by access link
  - Unique sessions
  - Average session duration
  - Page views by page
  - Conversion rate (form submissions / views)
- Engagement metrics:
  - Time on page
  - Scroll depth
  - Clicks on CTAs
  - Video play rate (if videos present)
- Geographic distribution:
  - Map visualization
  - Top countries/cities
- Event timeline:
  - Chronological list of all events
  - Filter by event type, date range
- Export capabilities:
  - CSV export
  - PDF report generation
- Filters:
  - Date range picker
  - Client selector
  - Access link selector
  - Event type filter

**Charts**:
- Line chart: Views over time
- Bar chart: Page views by page
- Pie chart: Event type distribution
- Heatmap: Time of day/day of week activity
- Funnel chart: Conversion funnel

---

## PERFORMANCE OPTIMIZATIONS

### 1. Caching Strategy

**SDK In-Memory Cache**:
- TTL: 5 minutes default
- Keys: `{method}:{params}`
- Automatic invalidation on mutations

**Database Cache Table**:
- Store expensive queries
- TTL: configurable per query
- Auto-cleanup function for expired entries

**React Query Configuration**:
```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

### 2. Code Splitting

**Route-Based Splitting**:
```javascript
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Wrap with Suspense
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/" element={<Home />} />
    ...
  </Routes>
</Suspense>
```

### 3. Image Optimization

**Lazy Loading**:
```jsx
<img
  src={imageUrl}
  alt="..."
  loading="lazy"
  decoding="async"
/>
```

**Responsive Images**:
```jsx
<picture>
  <source srcSet={imageUrl + '?w=400'} media="(max-width: 640px)" />
  <source srcSet={imageUrl + '?w=800'} media="(max-width: 1024px)" />
  <img src={imageUrl + '?w=1200'} alt="..." />
</picture>
```

### 4. Animation Performance

**Use CSS Transforms**:
- Prefer `transform` and `opacity` for animations
- Avoid animating `width`, `height`, `top`, `left`

**Framer Motion Optimization**:
```javascript
const optimizedVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};
```

**Reduce Motion Preference**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5. Bundle Size Optimization

**Tree Shaking**:
- Import only used functions from libraries
- Use named imports instead of default

**Example**:
```javascript
// ❌ Bad
import _ from 'lodash';

// ✅ Good
import { debounce, throttle } from 'lodash-es';
```

**Analyze Bundle**:
```bash
npm run build -- --analyze
```

---

## ACCESSIBILITY (A11Y)

### 1. Semantic HTML

Use proper HTML5 semantic elements:
- `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
- `<button>` for interactive elements (not `<div>`)
- `<a>` for links (not `<button>`)

### 2. ARIA Labels

**Navigation**:
```jsx
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/home">Home</a></li>
  </ul>
</nav>
```

**Buttons**:
```jsx
<button aria-label="Close dialog" onClick={onClose}>
  <X className="w-6 h-6" />
</button>
```

**Form Fields**:
```jsx
<label htmlFor="email">Email Address</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={errors.email ? "true" : "false"}
/>
{errors.email && (
  <span role="alert" className="error">
    {errors.email.message}
  </span>
)}
```

### 3. Keyboard Navigation

**Tab Order**:
- Ensure logical tab order
- Use `tabIndex={0}` for interactive custom elements
- Use `tabIndex={-1}` to exclude from tab order

**Focus Management**:
```javascript
// Trap focus in modal
const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    onClose();
  }

  if (e.key === 'Tab') {
    // Trap focus within modal
  }
};
```

### 4. Color Contrast

**Minimum Contrast Ratios**:
- Normal text: 4.5:1
- Large text (18pt+): 3:1
- UI components: 3:1

**Tools**: Use WebAIM Contrast Checker

### 5. Screen Reader Support

**Skip Links**:
```jsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

**Live Regions**:
```jsx
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

---

## SEO OPTIMIZATION

### 1. Meta Tags

**Dynamic Meta Tags** (React Helmet or similar):
```jsx
<Helmet>
  <title>{client.name} - AI-Powered Presentation</title>
  <meta name="description" content={client.description} />
  <meta property="og:title" content={client.name} />
  <meta property="og:description" content={client.description} />
  <meta property="og:image" content={client.logo_url} />
  <meta property="og:url" content={window.location.href} />
  <meta name="twitter:card" content="summary_large_image" />
</Helmet>
```

### 2. Structured Data

**Organization Schema**:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Disruptors Media",
  "url": "https://your-domain.com",
  "logo": "https://your-domain.com/logo.png",
  "sameAs": [
    "https://linkedin.com/company/disruptorsmedia",
    "https://instagram.com/disruptorsmedia"
  ]
}
```

### 3. Sitemap

Generate dynamic sitemap for public routes:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <lastmod>2025-01-13</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://your-domain.com/Dashboard</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 4. Robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /p/

Sitemap: https://your-domain.com/sitemap.xml
```

---

## SECURITY CONSIDERATIONS

### 1. Environment Variables

**Never expose**:
- `VITE_SUPABASE_SERVICE_ROLE_KEY` (use only in Netlify Functions)
- `VITE_ANTHROPIC_API_KEY` (use only in Netlify Functions)

**Safe to expose** (with `VITE_` prefix):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 2. Row Level Security (RLS)

**All tables must have RLS enabled** with appropriate policies:
- Authenticated users (admins): Full access
- Anonymous users: Read-only via service role
- Token validation controls access programmatically

### 3. Token Security

**Token Generation**:
- Use cryptographically secure random generation
- Minimum 32 bytes (64 hex characters)
- Store hash, not plain text (if possible)

**Token Validation**:
- Check expiration
- Check view count limits
- Verify password (bcrypt)
- Check IP whitelist
- Log all access attempts

### 4. Input Validation

**Server-Side Validation**:
- Validate all inputs in Netlify Functions
- Use schema validation (Zod, Yup)
- Sanitize user inputs to prevent XSS

**Example**:
```javascript
import { z } from 'zod';

const clientSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
});

// Validate
const result = clientSchema.safeParse(payload);
if (!result.success) {
  return {
    statusCode: 400,
    body: JSON.stringify({ error: result.error })
  };
}
```

### 5. Rate Limiting

**Implement rate limiting** in Netlify Functions:
- Max 100 requests per minute per IP
- Max 1000 requests per hour per IP
- Use Netlify Edge Functions or external service (Upstash)

### 6. CORS Configuration

**Netlify Functions CORS**:
```javascript
const headers = {
  'Access-Control-Allow-Origin': process.env.VITE_APP_URL,
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
```

---

## TESTING

### 1. Unit Tests

**Framework**: Vitest

**Test Coverage**:
- SDK methods
- Utility functions
- Custom hooks
- Form validation

**Example**:
```javascript
import { describe, it, expect, vi } from 'vitest';
import { sdk } from '@/lib/ai-presenter-sdk';

describe('AIPresenterSDK', () => {
  it('should get client by slug', async () => {
    const client = await sdk.getClientBySlug('test-client');
    expect(client).toBeDefined();
    expect(client.slug).toBe('test-client');
  });
});
```

### 2. Integration Tests

**Test Flows**:
- Client creation workflow
- Access link generation
- Presentation viewing with token
- Analytics tracking
- AI content generation

### 3. E2E Tests

**Framework**: Playwright or Cypress

**Test Scenarios**:
- Admin creates client and access link
- Prospect accesses presentation via token
- Prospect completes diagnostic form
- Admin views analytics

**Example**:
```javascript
test('prospect can access presentation with valid token', async ({ page }) => {
  await page.goto('/p/valid-token-here');
  await expect(page.locator('h1')).toContainText("Let's Disrupt");

  // Click start button
  await page.click('button:has-text("START")');

  // Verify navigation
  await expect(page).toHaveURL(/\/Introduction/);
});
```

---

## DEPLOYMENT CHECKLIST

### Pre-Deployment

- [ ] Run build: `npm run build`
- [ ] Check for TypeScript errors: `npm run type-check`
- [ ] Run linter: `npm run lint`
- [ ] Test all user workflows manually
- [ ] Verify environment variables are set in Netlify
- [ ] Check database migrations are applied
- [ ] Verify Supabase Storage bucket exists
- [ ] Test Netlify Functions locally

### Deployment

- [ ] Push to main branch or run `netlify deploy --prod`
- [ ] Verify build completes successfully
- [ ] Check deployment URL works
- [ ] Test token-based access
- [ ] Test admin login
- [ ] Verify analytics tracking
- [ ] Test AI features
- [ ] Check mobile responsiveness

### Post-Deployment

- [ ] Monitor error logs (Netlify Function logs)
- [ ] Check Supabase database for errors
- [ ] Verify analytics data is being collected
- [ ] Test all external API integrations
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure custom domain (if applicable)
- [ ] Set up SSL certificate (automatic with Netlify)

---

## SAMPLE DATA FOR TESTING

### Sample Client

```json
{
  "name": "Acme Corporation",
  "slug": "acme-corp",
  "description": "Leading provider of innovative enterprise solutions",
  "industry": "Enterprise SaaS",
  "sub_industry": "Workflow Automation",
  "logo_url": "https://example.com/acme-logo.png",
  "primary_color": "#0066CC",
  "secondary_color": "#00CC66",
  "website": "https://acme-corp.example.com",
  "email": "contact@acme-corp.example.com",
  "phone": "+1-555-123-4567",
  "company_size": "500-1000",
  "annual_revenue": "$50M-$100M",
  "target_market": "Mid-market enterprises",
  "status": "active"
}
```

### Sample Services

```json
[
  {
    "name": "AI Strategy Consulting",
    "slug": "ai-strategy",
    "tagline": "Transform Your Business with AI",
    "description": "Comprehensive AI strategy development and implementation planning",
    "features": [
      { "title": "Business Assessment", "description": "Evaluate AI readiness" },
      { "title": "Strategy Development", "description": "Custom AI roadmap" },
      { "title": "ROI Analysis", "description": "Financial impact modeling" }
    ],
    "pricing": {
      "amount": 15000,
      "currency": "USD",
      "billing_period": "one-time"
    },
    "is_featured": true
  },
  {
    "name": "AI Implementation",
    "slug": "ai-implementation",
    "tagline": "Turn Strategy into Reality",
    "description": "End-to-end AI solution implementation and integration",
    "features": [
      { "title": "Custom Development", "description": "Tailored AI solutions" },
      { "title": "Integration", "description": "Seamless system integration" },
      { "title": "Training", "description": "Team enablement" }
    ],
    "pricing": {
      "amount": 50000,
      "currency": "USD",
      "billing_period": "project"
    },
    "is_featured": true
  }
]
```

### Sample Case Studies

```json
[
  {
    "title": "Retail Giant Increases Sales 35% with AI",
    "slug": "retail-ai-success",
    "client_name": "RetailMax Inc.",
    "industry": "Retail",
    "challenge": "Struggling with inventory management and personalization at scale",
    "solution": "Implemented AI-powered demand forecasting and customer personalization engine",
    "results": "35% increase in sales, 40% reduction in stockouts, 25% improvement in customer satisfaction",
    "testimonial": "The AI solution transformed our business. We're now able to predict demand with incredible accuracy.",
    "testimonial_author": "John Smith",
    "testimonial_role": "CEO, RetailMax Inc.",
    "metrics": [
      { "label": "Sales Increase", "value": "35", "unit": "%" },
      { "label": "Stockout Reduction", "value": "40", "unit": "%" },
      { "label": "Customer Satisfaction", "value": "25", "unit": "% ↑" }
    ],
    "tags": ["AI", "Retail", "Personalization"],
    "category": "Enterprise",
    "is_featured": true
  }
]
```

---

## ADDITIONAL FEATURES TO IMPLEMENT

### 1. Email Notifications

**Use Case**: Notify admin when prospect views presentation

**Implementation**:
- Use Netlify Functions + SendGrid/Mailgun
- Trigger on first view of presentation
- Email contains: prospect info, timestamp, access link used

### 2. Calendar Integration

**Use Case**: Allow prospects to book demo directly from presentation

**Implementation**:
- Integrate Calendly or Cal.com
- Embed booking widget in Call To Action page
- Auto-populate with prospect info from icebreaker

### 3. PDF Export

**Use Case**: Generate PDF version of presentation for offline viewing

**Implementation**:
- Use Puppeteer in Netlify Function
- Generate PDF from rendered presentation
- Download or email to prospect

### 4. Multi-Language Support

**Use Case**: Present in multiple languages

**Implementation**:
- Use i18next for internationalization
- Store translations in JSON files
- Language selector in header
- Auto-detect browser language

### 5. White-Label Mode

**Use Case**: Agencies can rebrand for their clients

**Implementation**:
- Admin can upload own logo
- Custom domain support
- Remove "Powered by Disruptors" branding (paid tier)

### 6. Collaboration Features

**Use Case**: Multiple admins collaborate on presentations

**Implementation**:
- User roles: Admin, Editor, Viewer
- Real-time collaborative editing (Yjs or similar)
- Comment threads on slides
- Version history

---

## SUCCESS METRICS

### Key Performance Indicators (KPIs)

**Engagement Metrics**:
- Average session duration: Target > 5 minutes
- Pages per session: Target > 4
- Bounce rate: Target < 30%
- Scroll depth: Target > 70%

**Conversion Metrics**:
- Form submission rate: Target > 10%
- CTA click rate: Target > 20%
- Demo booking rate: Target > 5%

**AI Feature Usage**:
- Competitive analysis generation: Track usage
- Business intelligence extraction: Track success rate
- Personalization effectiveness: A/B test vs non-personalized

**Admin Efficiency**:
- Time to create new client: Target < 5 minutes
- AI content acceptance rate: Target > 80%

---

## FINAL NOTES FOR AI CODE GENERATOR

### Project Structure

```
ai-presenter/
├── src/
│   ├── lib/                   # Core SDK and services
│   │   ├── ai-presenter-sdk.ts
│   │   ├── ai-service.ts
│   │   ├── storage-service.ts
│   │   ├── analytics-service.ts
│   │   ├── business-analyzer.ts
│   │   ├── supabase-client.ts
│   │   └── types.ts
│   ├── hooks/                 # Custom React hooks
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── effects/          # Animation components
│   │   ├── conversation/     # Voice/chat components
│   │   ├── forms/            # Form components
│   │   └── ...
│   ├── pages/                # Page components
│   │   ├── admin/           # Admin pages
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Introduction.jsx
│   │   ├── Diagnostic.jsx
│   │   ├── CaseStudies.jsx
│   │   ├── Capabilities.jsx
│   │   ├── Blueprint.jsx
│   │   ├── Pricing.jsx
│   │   ├── CallToAction.jsx
│   │   ├── Layout.jsx
│   │   └── index.jsx         # Routing configuration
│   ├── utils/                # Utility functions
│   ├── App.jsx               # Root component
│   └── main.jsx              # Entry point
├── netlify/
│   └── functions/            # Serverless functions
│       ├── client-management.js
│       ├── ai-service.js
│       ├── business-analyzer.js
│       └── presentation-personalizer.js
├── public/                   # Static assets
├── supabase/
│   └── migrations/          # Database migrations
├── .env.example             # Environment template
├── netlify.toml             # Netlify configuration
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
└── jsconfig.json            # Path aliases
```

### Key Implementation Priorities

1. **Database First**: Set up all tables with RLS policies
2. **SDK Layer**: Build complete SDK with all methods
3. **Netlify Functions**: Implement secure serverless functions
4. **Public Pages**: Build all 11 public presentation pages
5. **Admin Interface**: Build complete admin dashboard
6. **AI Features**: Integrate Claude for competitive analysis
7. **Analytics**: Implement comprehensive tracking
8. **Testing**: Add unit and E2E tests
9. **Polish**: Animations, transitions, responsive design
10. **Deploy**: Test deployment and monitoring

### Common Pitfalls to Avoid

1. **Environment Variables**: Use `VITE_` prefix for client-side vars
2. **RLS Policies**: Always enable RLS on new tables
3. **API Keys**: Never expose service role key or AI keys client-side
4. **Caching**: Invalidate caches on mutations
5. **Error Handling**: Wrap all async operations in try-catch
6. **Loading States**: Show loading indicators for all async operations
7. **Mobile Responsive**: Test on mobile devices frequently
8. **Accessibility**: Use semantic HTML and ARIA labels
9. **Performance**: Lazy load images and routes
10. **Security**: Validate all inputs server-side

---

## READY TO BUILD

This PRD contains everything needed to build the complete AI Presenter application from scratch. All database schemas, API endpoints, components, pages, features, workflows, and integrations are specified in detail.

**Estimated Development Time**: 4-6 weeks for full implementation

**Estimated Line Count**: ~15,000-20,000 lines of code

**Complexity Level**: Advanced (requires experience with React, TypeScript, Supabase, Netlify, and AI APIs)

---

**VERSION**: 1.0.0
**LAST UPDATED**: January 31, 2025
**PREPARED FOR**: Base44 / Lovable / Bolt AI Code Generators
