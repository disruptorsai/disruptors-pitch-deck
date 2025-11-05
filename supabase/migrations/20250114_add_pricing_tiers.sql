-- Add Pricing Tiers Table
-- Migration to add pricing tier functionality to AI Presenter
-- Generated: 2025-01-14

-- =====================================================
-- PRICING TIERS TABLE
-- =====================================================

CREATE TABLE ai_presenter_pricing_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Client Association (optional - can be global or client-specific)
    client_id UUID REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,

    -- Tier Information
    name TEXT NOT NULL, -- e.g., "Starter", "Growth", "Enterprise"
    slug TEXT NOT NULL,
    description TEXT,

    -- Pricing
    price DECIMAL(10, 2), -- Monthly price
    billing_period TEXT DEFAULT 'monthly', -- 'monthly', 'quarterly', 'annual'
    price_label TEXT, -- Custom label like "$5,000/month" or "Custom Pricing"

    -- Features
    features JSONB DEFAULT '[]'::jsonb, -- Array of feature strings
    included_services TEXT[], -- Array of service IDs or names

    -- Display Options
    sort_order INTEGER DEFAULT 0,
    is_highlighted BOOLEAN DEFAULT false, -- Mark as "Most Popular" or featured
    badge_text TEXT, -- e.g., "Most Popular", "Best Value"
    color_scheme TEXT, -- Hex color for custom styling

    -- Call to Action
    cta_text TEXT DEFAULT 'Get Started',
    cta_url TEXT,

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT ai_presenter_pricing_tiers_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Create indexes
CREATE INDEX idx_ai_presenter_pricing_tiers_client ON ai_presenter_pricing_tiers(client_id);
CREATE INDEX idx_ai_presenter_pricing_tiers_slug ON ai_presenter_pricing_tiers(client_id, slug);
CREATE INDEX idx_ai_presenter_pricing_tiers_sort ON ai_presenter_pricing_tiers(sort_order);
CREATE INDEX idx_ai_presenter_pricing_tiers_active ON ai_presenter_pricing_tiers(is_active);

-- Trigger for updated_at
CREATE TRIGGER ai_presenter_pricing_tiers_updated_at
    BEFORE UPDATE ON ai_presenter_pricing_tiers
    FOR EACH ROW
    EXECUTE FUNCTION ai_presenter_update_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE ai_presenter_pricing_tiers ENABLE ROW LEVEL SECURITY;

-- Public read access for active pricing tiers
CREATE POLICY "Allow public read access to active pricing tiers"
    ON ai_presenter_pricing_tiers
    FOR SELECT
    USING (is_active = true);

-- Admin full access (authenticated users)
CREATE POLICY "Allow authenticated users full access to pricing tiers"
    ON ai_presenter_pricing_tiers
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Service role full access
CREATE POLICY "Allow service role full access to pricing tiers"
    ON ai_presenter_pricing_tiers
    FOR ALL
    USING (auth.role() = 'service_role');

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample pricing tiers (uncomment to use)
/*
INSERT INTO ai_presenter_pricing_tiers (name, slug, description, price, features, sort_order, is_highlighted, badge_text, cta_text) VALUES
    (
        'Starter',
        'starter',
        'Perfect for small businesses getting started with AI',
        2500.00,
        '["Lead Generation System", "Basic Analytics", "Email Support", "1 User Account", "Monthly Reports"]'::jsonb,
        0,
        false,
        null,
        'Start Growing'
    ),
    (
        'Growth',
        'growth',
        'Ideal for growing businesses ready to scale',
        5000.00,
        '["Everything in Starter", "Paid Advertising Management", "SEO & GEO Optimization", "Priority Support", "5 User Accounts", "Weekly Reports", "Custom Integrations"]'::jsonb,
        1,
        true,
        'Most Popular',
        'Scale Your Business'
    ),
    (
        'Enterprise',
        'enterprise',
        'Complete AI-powered solution for established companies',
        10000.00,
        '["Everything in Growth", "Fractional CMO Services", "White-Label Options", "Dedicated Account Manager", "Unlimited Users", "Daily Reports", "Custom Development", "24/7 Support"]'::jsonb,
        2,
        false,
        'Premium',
        'Let\'s Talk'
    );
*/

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE ai_presenter_pricing_tiers IS 'Pricing tier configurations for AI Presenter presentations';
COMMENT ON COLUMN ai_presenter_pricing_tiers.client_id IS 'Optional client association - NULL for global tiers';
COMMENT ON COLUMN ai_presenter_pricing_tiers.features IS 'JSON array of feature strings for display';
COMMENT ON COLUMN ai_presenter_pricing_tiers.is_highlighted IS 'Mark tier as featured/recommended';
COMMENT ON COLUMN ai_presenter_pricing_tiers.sort_order IS 'Display order (0 = first)';
