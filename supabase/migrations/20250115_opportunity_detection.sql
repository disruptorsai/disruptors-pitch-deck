-- =====================================================
-- Opportunity Detection System
-- Created: 2025-01-15
-- Purpose: Store detected opportunities for clients
-- =====================================================

-- Create enum for opportunity categories
CREATE TYPE opportunity_category AS ENUM (
  'seo',
  'content',
  'social',
  'website',
  'paid_advertising',
  'marketing_automation',
  'customer_service_ai',
  'content_generation_ai',
  'process_automation',
  'analytics_ai',
  'training'
);

-- Create enum for opportunity priority
CREATE TYPE opportunity_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- Create table for detected opportunities
CREATE TABLE IF NOT EXISTS detected_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,

  -- Opportunity details
  category opportunity_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence TEXT NOT NULL, -- Data points that prove this opportunity exists

  -- Scoring (all scores 1-10)
  impact_score INTEGER CHECK (impact_score >= 1 AND impact_score <= 10),
  evidence_strength INTEGER CHECK (evidence_strength >= 1 AND evidence_strength <= 10),
  service_alignment INTEGER CHECK (service_alignment >= 1 AND service_alignment <= 10),

  -- Total score calculated as (impact × evidence × alignment) / 100
  total_score NUMERIC GENERATED ALWAYS AS (
    (impact_score * evidence_strength * service_alignment) / 100.0
  ) STORED,

  priority opportunity_priority,

  -- Implementation details
  our_service TEXT, -- Which of our services addresses this
  quick_win BOOLEAN DEFAULT FALSE, -- Can this be implemented quickly?
  current_state_metric TEXT, -- e.g., "Currently ranking for 127 keywords"
  potential_improvement_metric TEXT, -- e.g., "Could rank for 1,843 keywords"
  timeline_estimate TEXT, -- e.g., "3-6 months"
  budget_range TEXT, -- e.g., "$5,000 - $15,000"

  -- ROI projection
  expected_outcome TEXT, -- What will improve
  roi_potential TEXT, -- e.g., "340% increase in organic leads"
  implementation_complexity TEXT, -- low/medium/high

  -- Metadata
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_opportunities_client ON detected_opportunities(client_id);
CREATE INDEX idx_opportunities_category ON detected_opportunities(category);
CREATE INDEX idx_opportunities_priority ON detected_opportunities(priority);
CREATE INDEX idx_opportunities_score ON detected_opportunities(total_score DESC);
CREATE INDEX idx_opportunities_active ON detected_opportunities(is_active) WHERE is_active = true;
CREATE INDEX idx_opportunities_quick_wins ON detected_opportunities(quick_win) WHERE quick_win = true;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_opportunities_timestamp ON detected_opportunities;
CREATE TRIGGER update_opportunities_timestamp
  BEFORE UPDATE ON detected_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-assign priority based on total score
CREATE OR REPLACE FUNCTION assign_opportunity_priority()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate total score
  DECLARE
    calculated_score NUMERIC;
  BEGIN
    calculated_score := (NEW.impact_score * NEW.evidence_strength * NEW.service_alignment) / 100.0;

    -- Assign priority based on score
    IF calculated_score >= 8 THEN
      NEW.priority := 'critical';
    ELSIF calculated_score >= 6 THEN
      NEW.priority := 'high';
    ELSIF calculated_score >= 4 THEN
      NEW.priority := 'medium';
    ELSE
      NEW.priority := 'low';
    END IF;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-assign priority
DROP TRIGGER IF EXISTS auto_assign_priority ON detected_opportunities;
CREATE TRIGGER auto_assign_priority
  BEFORE INSERT OR UPDATE OF impact_score, evidence_strength, service_alignment
  ON detected_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION assign_opportunity_priority();

-- Create table for competitive benchmarks
CREATE TABLE IF NOT EXISTS competitive_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,

  -- SEO Metrics
  client_domain_authority INTEGER,
  client_organic_traffic INTEGER,
  client_keyword_count INTEGER,
  client_backlink_count INTEGER,

  -- Competitor averages
  competitor_avg_domain_authority INTEGER,
  competitor_avg_organic_traffic INTEGER,
  competitor_avg_keyword_count INTEGER,
  competitor_avg_backlink_count INTEGER,

  -- Top competitor details
  top_competitor_domain TEXT,
  top_competitor_domain_authority INTEGER,
  top_competitor_organic_traffic INTEGER,
  top_competitor_keyword_count INTEGER,

  -- Gap analysis
  keyword_gap_count INTEGER, -- Keywords competitors rank for that client doesn't
  backlink_gap_count INTEGER, -- Backlinks competitors have that client doesn't
  content_gap_topics TEXT[], -- Topics to cover

  -- Social media comparison
  client_social_engagement_rate NUMERIC(5, 2),
  competitor_avg_social_engagement_rate NUMERIC(5, 2),

  -- Technology gaps
  missing_technologies TEXT[], -- Technologies competitors use that client doesn't
  competitor_common_technologies TEXT[],

  -- Metadata
  benchmark_date TIMESTAMPTZ DEFAULT NOW(),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_benchmarks_client ON competitive_benchmarks(client_id);
CREATE INDEX idx_benchmarks_date ON competitive_benchmarks(benchmark_date DESC);

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_benchmarks_timestamp ON competitive_benchmarks;
CREATE TRIGGER update_benchmarks_timestamp
  BEFORE UPDATE ON competitive_benchmarks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE detected_opportunities IS 'Stores AI-detected opportunities for clients based on business intelligence analysis';
COMMENT ON COLUMN detected_opportunities.total_score IS 'Calculated as (impact × evidence × alignment) / 100, range 0.01-10.00';
COMMENT ON COLUMN detected_opportunities.priority IS 'Auto-assigned based on total_score: critical(8+), high(6-8), medium(4-6), low(<4)';
COMMENT ON COLUMN detected_opportunities.evidence IS 'Specific data points proving this opportunity (e.g., "DataForSEO: Competitor ranks for 1,843 keywords, client ranks for 127")';
COMMENT ON COLUMN detected_opportunities.quick_win IS 'Can this be implemented quickly with high impact?';

COMMENT ON TABLE competitive_benchmarks IS 'Stores competitive benchmark data comparing client to industry competitors';

-- Row Level Security
ALTER TABLE detected_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitive_benchmarks ENABLE ROW LEVEL SECURITY;

-- Policies for detected_opportunities
CREATE POLICY "Users can view their opportunities"
  ON detected_opportunities
  FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM ai_presenter_clients WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can manage opportunities"
  ON detected_opportunities
  FOR ALL
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM ai_presenter_clients WHERE created_by = auth.uid()
    )
  );

-- Policies for competitive_benchmarks
CREATE POLICY "Users can view their benchmarks"
  ON competitive_benchmarks
  FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM ai_presenter_clients WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can manage benchmarks"
  ON competitive_benchmarks
  FOR ALL
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM ai_presenter_clients WHERE created_by = auth.uid()
    )
  );

-- Grant permissions
GRANT SELECT ON detected_opportunities TO authenticated;
GRANT ALL ON detected_opportunities TO service_role;

GRANT SELECT ON competitive_benchmarks TO authenticated;
GRANT ALL ON competitive_benchmarks TO service_role;

-- Create view for opportunity summary by client
CREATE OR REPLACE VIEW client_opportunity_summary AS
SELECT
  client_id,
  COUNT(*) as total_opportunities,
  COUNT(*) FILTER (WHERE priority = 'critical') as critical_count,
  COUNT(*) FILTER (WHERE priority = 'high') as high_count,
  COUNT(*) FILTER (WHERE priority = 'medium') as medium_count,
  COUNT(*) FILTER (WHERE priority = 'low') as low_count,
  COUNT(*) FILTER (WHERE quick_win = true) as quick_win_count,
  AVG(total_score) as avg_opportunity_score,
  ARRAY_AGG(DISTINCT category) as opportunity_categories
FROM detected_opportunities
WHERE is_active = true
GROUP BY client_id;

-- Grant access to view
GRANT SELECT ON client_opportunity_summary TO authenticated, service_role;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Opportunity Detection tables created successfully!';
  RAISE NOTICE 'Priority auto-assignment enabled based on scoring';
  RAISE NOTICE 'Use client_opportunity_summary view for dashboard stats';
END $$;
