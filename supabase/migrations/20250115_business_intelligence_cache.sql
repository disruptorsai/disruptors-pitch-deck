-- =====================================================
-- Business Intelligence Cache System
-- Created: 2025-01-15
-- Purpose: Cache aggregated data from multiple API sources
-- =====================================================

-- Create cache table for aggregated business intelligence data
CREATE TABLE IF NOT EXISTS business_intelligence_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_domain TEXT NOT NULL UNIQUE,
  company_name TEXT,

  -- Data source JSON fields (stores normalized data from each API)
  apollo_data JSONB,
  dataforseo_data JSONB,
  wappalyzer_data JSONB,
  coresignal_data JSONB,
  bright_data_data JSONB,
  newsapi_data JSONB,
  social_media_data JSONB,
  financial_data JSONB,
  firecrawl_data JSONB,

  -- Aggregation metadata
  data_quality_score INTEGER CHECK (data_quality_score >= 0 AND data_quality_score <= 100),
  total_api_cost NUMERIC(10, 4) DEFAULT 0,
  total_duration_ms INTEGER,

  -- Cache management
  cache_created_at TIMESTAMPTZ DEFAULT NOW(),
  cache_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Status tracking
  data_sources_complete TEXT[] DEFAULT ARRAY[]::TEXT[],
  data_sources_failed TEXT[] DEFAULT ARRAY[]::TEXT[],
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,

  -- Standard timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_bi_cache_domain ON business_intelligence_cache(company_domain);
CREATE INDEX idx_bi_cache_expires ON business_intelligence_cache(cache_expires_at);
CREATE INDEX idx_bi_cache_created ON business_intelligence_cache(cache_created_at DESC);
CREATE INDEX idx_bi_cache_quality ON business_intelligence_cache(data_quality_score DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_bi_cache_timestamp ON business_intelligence_cache;
CREATE TRIGGER update_bi_cache_timestamp
  BEFORE UPDATE ON business_intelligence_cache
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION clean_expired_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM business_intelligence_cache
  WHERE cache_expires_at < NOW();

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Comment on table
COMMENT ON TABLE business_intelligence_cache IS 'Caches aggregated business intelligence data from multiple API sources to reduce costs and improve performance';

-- Comment on columns
COMMENT ON COLUMN business_intelligence_cache.company_domain IS 'Normalized domain (lowercase, no protocol, no www)';
COMMENT ON COLUMN business_intelligence_cache.data_quality_score IS 'Overall data quality score (0-100) based on successful data sources';
COMMENT ON COLUMN business_intelligence_cache.total_api_cost IS 'Total cost in USD for all API calls to generate this cache entry';
COMMENT ON COLUMN business_intelligence_cache.cache_expires_at IS 'When this cache entry expires (default: 24 hours from creation)';
COMMENT ON COLUMN business_intelligence_cache.data_sources_complete IS 'Array of data source names that completed successfully';
COMMENT ON COLUMN business_intelligence_cache.data_sources_failed IS 'Array of data source names that failed';

-- Row Level Security (RLS)
ALTER TABLE business_intelligence_cache ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can do everything
CREATE POLICY "Admins can manage business intelligence cache"
  ON business_intelligence_cache
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_presenter_clients
      WHERE created_by = auth.uid()
      LIMIT 1
    )
  );

-- Policy: Public can read cached data (read-only)
CREATE POLICY "Public can read business intelligence cache"
  ON business_intelligence_cache
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Grant permissions
GRANT SELECT ON business_intelligence_cache TO anon, authenticated;
GRANT ALL ON business_intelligence_cache TO service_role;

-- Create a view for cache statistics
CREATE OR REPLACE VIEW business_intelligence_cache_stats AS
SELECT
  COUNT(*) as total_entries,
  COUNT(*) FILTER (WHERE cache_expires_at >= NOW()) as valid_entries,
  COUNT(*) FILTER (WHERE cache_expires_at < NOW()) as expired_entries,
  AVG(data_quality_score) as avg_quality_score,
  SUM(total_api_cost) as total_cost_cached,
  AVG(total_duration_ms) as avg_duration_ms,
  MAX(cache_created_at) as last_cache_created,
  MIN(cache_created_at) as first_cache_created
FROM business_intelligence_cache;

-- Grant access to view
GRANT SELECT ON business_intelligence_cache_stats TO authenticated, service_role;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Business Intelligence Cache table created successfully!';
  RAISE NOTICE 'Cache expiration: 24 hours (default)';
  RAISE NOTICE 'Run clean_expired_cache() function to manually clean expired entries';
END $$;
