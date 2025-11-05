-- Add comprehensive business intelligence fields to ai_presenter_clients table
-- This enables AI-powered presentation personalization

ALTER TABLE ai_presenter_clients
ADD COLUMN IF NOT EXISTS full_description TEXT,
ADD COLUMN IF NOT EXISTS industry VARCHAR(255),
ADD COLUMN IF NOT EXISTS sub_industry VARCHAR(255),
ADD COLUMN IF NOT EXISTS founded_year VARCHAR(50),
ADD COLUMN IF NOT EXISTS company_size VARCHAR(100),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS contact_form_url TEXT,
ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tertiary_color VARCHAR(7),
ADD COLUMN IF NOT EXISTS brand_tone VARCHAR(100),
ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS key_features JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS target_market TEXT,
ADD COLUMN IF NOT EXISTS technologies_detected JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS cms VARCHAR(100),
ADD COLUMN IF NOT EXISTS market_position TEXT,
ADD COLUMN IF NOT EXISTS competitive_advantages JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS potential_competitors JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS strengths JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS opportunities JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS website_quality INTEGER DEFAULT 7,
ADD COLUMN IF NOT EXISTS seo_indicators TEXT,
ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS partnerships JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS has_case_studies BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_blog BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_real_content BOOLEAN DEFAULT false;

-- Add helpful comment
COMMENT ON TABLE ai_presenter_clients IS 'Client information with comprehensive business intelligence for AI-powered presentation personalization';

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_clients_industry ON ai_presenter_clients(industry);
CREATE INDEX IF NOT EXISTS idx_clients_website_quality ON ai_presenter_clients(website_quality);
