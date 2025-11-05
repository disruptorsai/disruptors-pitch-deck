# AI Presenter - Complete Product Requirements Document (v2)
## Optimized for Base44 / Lovable / Bolt

---

## 🎯 CORE PURPOSE - CRITICAL CONTEXT

**This application creates personalized AI-powered pitch decks for Disruptors Media to present to prospective clients.**

### Key Roles:
- **Disruptors Media** = The service provider (us) - an AI consulting and implementation firm
- **"Clients" in database** = Prospects/potential customers we're pitching TO
- **"Presentation"** = Custom pitch showing how Disruptors can help that specific prospect

### How It Works:
1. Disruptors sales rep gets a new prospect (e.g., "TechCorp Manufacturing")
2. Admin enters prospect's website and basic info into the system
3. **AI analyzes prospect's business**:
   - Scrapes their website
   - Identifies their current services, tech stack, pain points
   - Calculates their AI readiness score
   - Identifies weak spots where they're losing money
4. **System generates personalized presentation**:
   - Hero: "Transform TechCorp's Operations with AI" (uses their name)
   - Problem: Shows THEIR specific pain points with dollar costs
   - Solution: Recommends Disruptors services relevant to THEIR industry
   - Case Studies: Shows examples from similar companies
   - ROI: Calculates potential savings for THEIR business size
   - Blueprint: Custom implementation roadmap for THEIR needs
5. Admin sends secure access link to prospect
6. Prospect sees a presentation that feels custom-built for them
7. **Result**: Higher conversion because it addresses THEIR specific problems

### Example:
**Prospect**: ABC Manufacturing ($50M revenue, manual inventory, no AI tools)

**Generated Presentation**:
- Headline: "Transform ABC Manufacturing's Operations with AI-Powered Automation"
- Shows they're losing $730K/year to manual processes
- Recommends Disruptors' AI Workflow Automation service
- Shows manufacturing case studies
- Projects $500K annual ROI for their business size

### Content Sources:
**Disruptors Media Content** (stored once, used for all presentations):
- Our services (from disruptorsmedia.com)
- Our case studies
- Our team members
- Our credentials

**Prospect-Specific Content** (generated per prospect):
- Their pain points and weak spots
- Their ROI projections
- Recommended services for their needs
- Custom implementation timeline

---

## PROJECT OVERVIEW

Build a professional presentation platform where **Disruptors Media** creates custom AI-powered pitch decks for each prospect. The system analyzes the prospect's business, identifies opportunities for AI integration, and generates a presentation demonstrating exactly how Disruptors Media can help them.

**Key Features**:
- AI-powered business analysis (scrapes prospect website, identifies pain points)
- Automatic ROI calculation based on prospect's business size
- Personalized content generation using Claude 3.5
- Secure, token-based presentation sharing
- Comprehensive analytics to track prospect engagement
- Admin interface for managing prospects and presentations

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
- **Web Scraping**: Firecrawl API (required, for prospect analysis)

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

# Web Scraping (Required for prospect analysis)
VITE_FIRECRAWL_API_KEY=your-firecrawl-key

# Optional External APIs
VITE_SERPAPI_KEY=your-serpapi-key

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
-- Client status (note: "client" = prospect we're pitching to)
CREATE TYPE ai_presenter_client_status AS ENUM ('analyzing', 'ready', 'presented', 'won', 'lost', 'archived');

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

### CORE TABLES

### 1. ai_presenter_clients

**Purpose**: Store prospect information (companies we're pitching Disruptors services to)

**IMPORTANT**: "Client" in this context = Prospect/potential customer of Disruptors Media

```sql
CREATE TABLE ai_presenter_clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Basic Information
    name TEXT NOT NULL, -- Prospect's company name (e.g., "TechCorp Industries")
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    website TEXT, -- Prospect's website URL (for analysis)

    -- Industry Classification
    industry TEXT, -- e.g., "Manufacturing", "Healthcare", "Retail"
    sub_industry TEXT,

    -- Business Profile (Extracted by AI Analysis)
    company_size TEXT, -- 'small', 'mid-market', 'enterprise'
    employee_count INTEGER,
    annual_revenue TEXT, -- '1M-5M', '5M-25M', '25M-100M', '100M+'

    -- AI Analysis Results
    ai_readiness_score INTEGER, -- 0-100, calculated by AI
    digital_maturity_score INTEGER, -- 0-100, calculated by AI
    pain_points JSONB DEFAULT '[]'::jsonb, -- [{title, description, severity, cost}]
    weak_spots JSONB DEFAULT '[]'::jsonb, -- [{area, current_state, opportunity, roi}]
    current_tech_stack JSONB DEFAULT '[]'::jsonb, -- Technologies they currently use
    business_goals JSONB DEFAULT '[]'::jsonb,

    -- Disruptors Service Recommendations (Generated by AI)
    recommended_services JSONB DEFAULT '[]'::jsonb, -- Which Disruptors services fit their needs
    estimated_annual_roi NUMERIC, -- Projected annual savings/revenue increase

    -- Branding (Optional - for customizing their viewing experience)
    logo_url TEXT,
    primary_color TEXT DEFAULT '#000000',
    secondary_color TEXT DEFAULT '#ffffff',

    -- Contact Information
    primary_contact_name TEXT,
    primary_contact_email TEXT,
    primary_contact_phone TEXT,

    -- Status Tracking
    status ai_presenter_client_status DEFAULT 'analyzing',

    -- Personalization
    personalization_generated BOOLEAN DEFAULT false,
    personalization_generated_at TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID, -- Disruptors team member who added this prospect

    CONSTRAINT ai_presenter_clients_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX idx_ai_presenter_clients_slug ON ai_presenter_clients(slug);
CREATE INDEX idx_ai_presenter_clients_status ON ai_presenter_clients(status);
CREATE INDEX idx_ai_presenter_clients_industry ON ai_presenter_clients(industry);
```

### 2. disruptors_content (NEW TABLE)

**Purpose**: Store Disruptors Media's base content library (used across all personalized presentations)

```sql
CREATE TABLE disruptors_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    content_type TEXT NOT NULL, -- 'service', 'case_study', 'team_member', 'credential', 'pricing_tier'
    content_data JSONB NOT NULL,

    -- Filtering/Matching
    tags TEXT[], -- e.g., ['manufacturing', 'ai-automation', 'mid-market']
    industries TEXT[], -- Which industries this content is relevant to

    -- Visibility
    is_active BOOLEAN DEFAULT true,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_disruptors_content_type ON disruptors_content(content_type);
CREATE INDEX idx_disruptors_content_tags ON disruptors_content USING GIN(tags);
CREATE INDEX idx_disruptors_content_industries ON disruptors_content USING GIN(industries);
```

**Example Disruptors Content Records**:

```javascript
// SERVICE
{
  id: 'service-ai-automation',
  content_type: 'service',
  content_data: {
    name: 'AI Workflow Automation',
    tagline: 'Transform Manual Processes with Intelligent Automation',
    description: 'We build custom AI systems that automate repetitive workflows...',
    features: [
      'Custom AI model development',
      'Process analysis and optimization',
      'Integration with existing systems',
      'ROI tracking and reporting'
    ],
    ideal_for: ['Manufacturing', 'Healthcare', 'Finance'],
    typical_roi: '300-600%',
    typical_timeline: '90 days',
    pricing_range: { min: 50000, max: 200000 },
    case_study_ids: ['case-manufacturing-1', 'case-healthcare-2']
  },
  tags: ['automation', 'ai', 'workflow', 'mid-market', 'enterprise'],
  industries: ['Manufacturing', 'Healthcare', 'Finance', 'Retail']
}

// CASE STUDY
{
  id: 'case-manufacturing-1',
  content_type: 'case_study',
  content_data: {
    title: 'Manufacturing Giant Saves $5M with AI Automation',
    client_name: 'ABC Manufacturing', // Can be anonymized
    industry: 'Manufacturing',
    company_size: 'mid-market',
    annual_revenue: '50M-100M',
    challenge: 'Manual inventory processes leading to stockouts and excess inventory',
    solution: 'Implemented AI-powered predictive inventory and demand forecasting system',
    technologies_used: ['Claude AI', 'Custom ML Models', 'API Integration'],
    timeline: '90 days',
    investment: 75000,
    results: {
      annual_savings: 5000000,
      time_saved_percent: 60,
      accuracy_improvement_percent: 85,
      payback_period_months: 2
    },
    testimonial: {
      quote: 'Disruptors Media transformed our operations. The ROI was immediate.',
      author: 'John Smith',
      role: 'COO'
    }
  },
  tags: ['manufacturing', 'inventory', 'automation', 'high-roi'],
  industries: ['Manufacturing']
}

// TEAM MEMBER
{
  id: 'team-will',
  content_type: 'team_member',
  content_data: {
    name: 'Will Johnson',
    role: 'CEO & Founder',
    bio: 'AI strategist with 10+ years experience helping companies transform with AI',
    photo_url: '/team/will.jpg',
    linkedin_url: 'https://linkedin.com/in/willjohnson',
    specializations: ['AI Strategy', 'Enterprise AI', 'ROI Optimization']
  },
  tags: ['leadership', 'strategy'],
  industries: []
}
```

### 3. ai_presenter_business_analysis (NEW TABLE)

**Purpose**: Store detailed AI analysis of each prospect's business

```sql
CREATE TABLE ai_presenter_business_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,

    -- Website Analysis
    website_scraped_content TEXT, -- Raw scraped content
    services_offered TEXT[], -- What the prospect sells/does
    target_customers TEXT[],
    value_proposition TEXT,
    current_tech_stack JSONB DEFAULT '[]'::jsonb,

    -- Business Intelligence
    pain_points JSONB DEFAULT '[]'::jsonb,
    -- [{title, description, severity: 'low'|'medium'|'high', ai_opportunity: 'low'|'medium'|'high', estimated_annual_cost: 150000}]

    weak_spots JSONB DEFAULT '[]'::jsonb,
    -- [{
    --   area: 'Customer Support',
    --   current_state: 'Manual email responses, 48hr turnaround',
    --   opportunity: 'AI chatbot could handle 80% of inquiries instantly',
    --   potential_roi_annual: 150000,
    --   implementation_effort: 'medium',
    --   priority: 'high'
    -- }]

    automation_opportunities JSONB DEFAULT '[]'::jsonb,
    -- [{process_name, current_method, ai_solution, effort, impact, roi_estimate}]

    -- Competitive Position
    competitors TEXT[],
    market_position TEXT, -- 'leader', 'challenger', 'newcomer'

    -- AI Recommendations
    recommended_disruptors_services JSONB DEFAULT '[]'::jsonb,
    -- [{service_id, relevance_score: 0-100, why_relevant, addresses_pain_points: []}]

    quick_wins JSONB DEFAULT '[]'::jsonb,
    -- [{description, timeline, cost, expected_impact}]

    -- Scores
    ai_readiness_score INTEGER, -- 0-100
    digital_maturity_score INTEGER, -- 0-100

    -- ROI Projections
    total_opportunity_value NUMERIC, -- Total annual savings/revenue potential
    recommended_investment NUMERIC,
    projected_payback_months INTEGER,

    -- AI Metadata
    analyzed_by_model TEXT, -- 'claude-3-5-sonnet-20241022'
    analysis_prompt TEXT,
    confidence_score DECIMAL(3,2), -- 0.00-1.00

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT one_analysis_per_client UNIQUE (client_id)
);

CREATE INDEX idx_business_analysis_client_id ON ai_presenter_business_analysis(client_id);
```

### 4. ai_presenter_personalized_content (NEW TABLE)

**Purpose**: Store generated personalized presentation content for each prospect

```sql
CREATE TABLE ai_presenter_personalized_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,

    -- Personalized Content for Each Page
    hero JSONB NOT NULL,
    -- {headline: 'Transform TechCorp...', subheadline: '...', cta_text: '...'}

    introduction JSONB NOT NULL,
    -- {title: '...', content: '...', key_points: [...]}

    problem_section JSONB NOT NULL,
    -- {title: '...', pain_points: [{title, description, cost, visualization_data}], total_cost: 950000}

    why_ai_section JSONB NOT NULL,
    -- {title: '...', industry_specific_benefits: [...], roi_stats: [...], use_cases: [...]}

    solution_section JSONB NOT NULL,
    -- {title: '...', recommended_services: [{service_id, why_for_them, roi_projection}], implementation_approach: '...'}

    weak_spots_section JSONB NOT NULL,
    -- {title: '...', weak_spots: [{area, current, opportunity, roi, priority}]}

    case_studies_section JSONB NOT NULL,
    -- {intro: '...', selected_case_study_ids: [...], relevance_explanation: '...'}

    blueprint_section JSONB NOT NULL,
    -- {timeline_type: '90-day', phases: [{name, duration, deliverables, milestones}]}

    roi_breakdown JSONB NOT NULL,
    -- {investment: 200000, annual_savings: 730000, payback_months: 3, five_year_value: 3650000}

    pricing_section JSONB NOT NULL,
    -- {recommended_tier: 'enterprise', custom_pricing: {...}, justification: '...'}

    cta_section JSONB NOT NULL,
    -- {message: '...', urgency_factor: '...', next_steps: [...]}

    -- Generation Metadata
    version INTEGER DEFAULT 1,
    generated_by_model TEXT,
    generation_prompt TEXT,
    generated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT one_personalized_content_per_client UNIQUE (client_id)
);

CREATE INDEX idx_personalized_content_client_id ON ai_presenter_personalized_content(client_id);
```

### 5. ai_presenter_access_links

**Purpose**: Token-based access control for secure presentation sharing

```sql
CREATE TABLE ai_presenter_access_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Link Information
    client_id UUID NOT NULL REFERENCES ai_presenter_clients(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL, -- e.g., "Investor Meeting - March 2025"

    -- Access Control
    status ai_presenter_access_status DEFAULT 'active',
    expires_at TIMESTAMPTZ,
    max_views INTEGER,
    view_count INTEGER DEFAULT 0,

    -- Password Protection (optional)
    password_hash TEXT,

    -- Customization
    custom_message TEXT,
    allowed_sections JSONB, -- Array of page slugs, NULL = all pages

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
CREATE INDEX idx_ai_presenter_access_links_status ON ai_presenter_access_links(status);
```

### 6-14. [REMAINING TABLES FROM ORIGINAL PRD]

The following tables remain the same as the original PRD:
- `ai_presenter_presentations`
- `ai_presenter_slides`
- `ai_presenter_services`
- `ai_presenter_case_studies`
- `ai_presenter_competitive_analysis`
- `ai_presenter_team_members`
- `ai_presenter_analytics_events`
- `ai_presenter_file_uploads`
- `ai_presenter_cache`
- `ai_presenter_voice_sessions`
- `ai_presenter_voice_messages`
- `ai_presenter_conversation_insights`

---

## AI PERSONALIZATION ENGINE

### Core Process Flow

```javascript
// Main personalization workflow
async function generatePersonalizedPresentationForProspect(clientId) {

  // STEP 1: Analyze Prospect's Business
  console.log('Step 1: Analyzing prospect business...');
  const client = await getClient(clientId);

  // Scrape their website
  const scrapedData = await scrapeWebsite(client.website);

  // Analyze with Claude AI
  const analysis = await analyzeProspectBusiness({
    clientInfo: client,
    scrapedData: scrapedData,
    disruptorsServices: await getDisruptorsServices(),
    disruptorsCaseStudies: await getDisruptorsCaseStudies()
  });

  // Save analysis
  await saveBusinessAnalysis(clientId, analysis);

  // Update client with analysis results
  await updateClient(clientId, {
    ai_readiness_score: analysis.ai_readiness_score,
    digital_maturity_score: analysis.digital_maturity_score,
    pain_points: analysis.pain_points,
    weak_spots: analysis.weak_spots,
    recommended_services: analysis.recommended_disruptors_services,
    status: 'analyzed'
  });

  // STEP 2: Generate Personalized Content
  console.log('Step 2: Generating personalized content...');
  const personalizedContent = await generateContentWithAI({
    client,
    analysis,
    disruptorsServices: await getDisruptorsServices(),
    disruptorsCaseStudies: await getDisruptorsCaseStudies(),
    relevantCaseStudies: await findRelevantCaseStudies(analysis)
  });

  // STEP 3: Save Personalized Content
  console.log('Step 3: Saving personalized content...');
  await savePersonalizedContent(clientId, personalizedContent);

  // Update client status
  await updateClient(clientId, {
    personalization_generated: true,
    personalization_generated_at: new Date(),
    status: 'ready'
  });

  return {
    analysis,
    personalizedContent
  };
}
```

### AI Prompt 1: Business Analysis

```javascript
const businessAnalysisPrompt = `
You are a business analyst for Disruptors Media, an AI consulting and implementation firm specializing in helping businesses transform with artificial intelligence.

Analyze the following prospect's business and identify specific opportunities where Disruptors Media can add value through AI solutions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROSPECT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Company Name: ${prospect.name}
Industry: ${prospect.industry}
Website: ${prospect.website}
Estimated Revenue: ${prospect.annual_revenue || 'Unknown'}
Employee Count: ${prospect.employee_count || 'Unknown'}

Website Content (Scraped):
${scrapedContent}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DISRUPTORS MEDIA SERVICES (for reference)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${JSON.stringify(disruptorsServices, null, 2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR ANALYSIS TASK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. BUSINESS UNDERSTANDING
   - What services/products do they offer?
   - Who are their target customers?
   - What is their value proposition?

2. CURRENT TECHNOLOGY STACK
   - Identify any technologies mentioned on their website
   - Assess their current level of digital sophistication
   - Look for signs of existing AI/automation usage

3. PAIN POINTS (Find 5-10 specific problems)
   For each pain point:
   - Title (concise description)
   - Description (what's happening)
   - Severity: low/medium/high
   - AI Opportunity: low/medium/high (can AI help?)
   - Estimated Annual Cost (be conservative but realistic)
   - Affected Area (e.g., Customer Service, Operations, Sales)

4. WEAK SPOTS (Identify 3-5 critical areas where they're losing money/time/customers)
   For each weak spot:
   - Area (e.g., "Customer Support", "Inventory Management")
   - Current State (what they're doing now, be specific)
   - Opportunity (what's possible with AI)
   - Potential Annual ROI (estimated dollar value)
   - Implementation Effort: low/medium/high
   - Priority: low/medium/high

5. AI READINESS SCORE (0-100)
   Consider:
   - Current technology adoption (0-25 points)
   - Data maturity (0-25 points)
   - Team size and capability (0-25 points)
   - Budget indicators from company size (0-25 points)

6. DIGITAL MATURITY SCORE (0-100)
   Consider:
   - Online presence quality (0-20 points)
   - Digital tools mentioned (0-20 points)
   - E-commerce/automation (0-20 points)
   - Data analytics capability (0-20 points)
   - Modern tech stack (0-20 points)

7. DISRUPTORS SERVICE RECOMMENDATIONS
   For each Disruptors service that could help them:
   - Service ID
   - Relevance Score (0-100)
   - Why Relevant (2-3 sentences specific to their business)
   - Which Pain Points It Addresses (list IDs from your pain points)
   - Estimated ROI for Their Business
   - Implementation Timeline

8. AUTOMATION OPPORTUNITIES (3-5 specific processes)
   - Process Name (be specific to their business)
   - Current Method (how they do it now)
   - AI Solution (what we'd implement)
   - Effort: low/medium/high
   - Impact: low/medium/high
   - ROI Estimate (annual value)

9. QUICK WINS (2-3 things we can implement fast)
   - Description (specific, actionable)
   - Timeline (e.g., "2 weeks")
   - Investment ($)
   - Expected Impact (% improvement or $ saved)

10. FINANCIAL PROJECTIONS
    - Total Opportunity Value (sum of all potential ROI)
    - Recommended Initial Investment
    - Projected Payback Period (months)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPORTANT GUIDELINES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Be specific to their business, not generic
- Use real data from their website when available
- Be conservative with ROI estimates
- Focus on their most pressing problems
- Only recommend Disruptors services that truly fit
- Consider their company size for realistic recommendations

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT (JSON)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Return ONLY valid JSON in this exact structure:

{
  "services_offered": ["service 1", "service 2", ...],
  "target_customers": ["customer type 1", ...],
  "value_proposition": "Their main value prop",
  "current_tech_stack": ["technology 1", "technology 2", ...],
  "pain_points": [
    {
      "id": "pain-1",
      "title": "Slow customer response times",
      "description": "Manual email responses taking 24-48 hours on average",
      "severity": "high",
      "ai_opportunity": "high",
      "estimated_annual_cost": 150000,
      "affected_area": "Customer Support"
    }
  ],
  "weak_spots": [
    {
      "area": "Customer Support",
      "current_state": "Manual email responses, no chatbot, 48hr response time, 3 support staff handling 200 tickets/month",
      "opportunity": "AI chatbot + intelligent routing could handle 80% of common inquiries instantly, reducing response time to minutes",
      "potential_roi_annual": 150000,
      "implementation_effort": "medium",
      "priority": "high"
    }
  ],
  "ai_readiness_score": 45,
  "digital_maturity_score": 55,
  "recommended_disruptors_services": [
    {
      "service_id": "service-ai-chatbot",
      "relevance_score": 95,
      "why_relevant": "Their customer support is entirely manual with slow response times. An AI chatbot would directly address their biggest pain point and deliver immediate ROI.",
      "addresses_pain_points": ["pain-1", "pain-2"],
      "estimated_roi": 150000,
      "implementation_timeline": "30 days"
    }
  ],
  "automation_opportunities": [
    {
      "process_name": "Customer Inquiry Handling",
      "current_method": "Manual email review and response by support staff",
      "ai_solution": "AI-powered chatbot with natural language understanding and intelligent escalation",
      "effort": "medium",
      "impact": "high",
      "roi_estimate": 150000
    }
  ],
  "quick_wins": [
    {
      "description": "Implement AI email auto-responder for common questions",
      "timeline": "2 weeks",
      "investment": 5000,
      "expected_impact": "30% reduction in support team workload, immediate response to common questions"
    }
  ],
  "total_opportunity_value": 730000,
  "recommended_investment": 200000,
  "projected_payback_months": 3
}
`;
```

### AI Prompt 2: Content Generation

```javascript
const contentGenerationPrompt = `
You are a content strategist for Disruptors Media. Generate personalized pitch deck content for this prospect.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROSPECT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${JSON.stringify(prospect, null, 2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUSINESS ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${JSON.stringify(analysis, null, 2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DISRUPTORS SERVICES & CASE STUDIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Services: ${JSON.stringify(disruptorsServices, null, 2)}

Relevant Case Studies: ${JSON.stringify(relevantCaseStudies, null, 2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT GENERATION TASK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate personalized content for ALL sections of the presentation:

1. HERO SECTION
   - Headline: Mention their company name + primary pain point/opportunity
   - Subheadline: Value proposition specific to their industry
   - CTA Text: Action-oriented, relevant to their needs

2. INTRODUCTION
   - Title: Address them directly
   - Content: Show we understand their business context
   - Key Points: 3-4 points about why we're showing them this

3. PROBLEM SECTION (Their Pain Points)
   - Title: Industry-specific, empathetic
   - Pain Points: Use our analysis, include costs
   - Total Cost: Sum of all pain point costs

4. WHY AI SECTION
   - Title: Industry-focused
   - Industry-specific benefits
   - ROI statistics relevant to their size
   - Use cases from their industry

5. SOLUTION SECTION (Disruptors Services)
   - Title: How we'll help them specifically
   - Recommended Services: Which ones, why, ROI
   - Implementation Approach: Tailored to their size

6. WEAK SPOTS ANALYSIS
   - Title: Direct and impactful
   - Weak Spots: Each one detailed with ROI
   - Priority: Which to tackle first

7. CASE STUDIES
   - Intro: Why these case studies are relevant
   - Case Studies: Use the provided relevant ones
   - Relevance Note: Explain similarities

8. BLUEPRINT (Implementation Roadmap)
   - Title: Custom for them
   - Timeline: 90-day, 6-month, or 12-month based on scope
   - Phases: Break down implementation

9. ROI BREAKDOWN
   - Investment: Total cost
   - Annual Savings: From analysis
   - Payback Period: Calculate
   - 5-Year Value: Project forward

10. PRICING
    - Recommended Tier: Based on company size
    - Custom Pricing: Calculate from services
    - Justification: Why this investment makes sense

11. CALL TO ACTION
    - Message: Personalized closing
    - Urgency: Why act now
    - Next Steps: Clear path forward

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPORTANT REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Use their company name throughout
- Reference their specific pain points and weak spots
- Include actual dollar amounts from analysis
- Make it feel custom-built for them
- Professional but conversational tone
- Be specific, not generic
- Focus on ROI and concrete outcomes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT (JSON)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Return ONLY valid JSON with this structure:

{
  "hero": {
    "headline": "Transform [Company]'s [Pain Point] with AI",
    "subheadline": "...",
    "cta_text": "..."
  },
  "introduction": {
    "title": "...",
    "content": "...",
    "key_points": ["...", "...", "..."]
  },
  "problem_section": {
    "title": "...",
    "pain_points": [...from analysis...],
    "total_cost": 730000
  },
  // ... all other sections
}
`;
```

---

## UPDATED USER WORKFLOWS

### Workflow 1: Admin Creates Personalized Presentation

1. Admin logs in → `/admin`
2. Click **"+ New Prospect"** → `/admin/clients/new`
3. **Fill out form**:
   - Company name: "TechCorp Industries"
   - Website: "https://techcorp.com"
   - Industry: "Manufacturing"
   - Estimated revenue: "$50M-$100M"
   - Contact: John Smith, john@techcorp.com
4. Click **"Analyze Business"**
   - Shows: "Analyzing TechCorp Industries... (30-60 seconds)"
   - System scrapes website
   - AI analyzes business
5. **Analysis results displayed**:
   - AI Readiness: 42/100
   - Digital Maturity: 55/100
   - Top Pain Points (with costs)
   - Weak Spots (with ROI projections)
   - Recommended Disruptors services
6. Admin reviews, can edit if needed
7. Click **"Generate Personalized Presentation"**
   - Shows: "Creating custom presentation... (45-90 seconds)"
   - AI generates all personalized content
8. **Preview presentation** - see all sections with personalized content
9. Click **"Save & Create Access Link"**
10. **Copy link**: `https://your-domain.com/p/abc123xyz`
11. **Send to prospect** via email

### Workflow 2: Prospect Views Personalized Presentation

1. Prospect clicks link from Disruptors sales rep
2. Token validation (instant)
3. Sees hero page: **"Transform TechCorp's Operations with AI-Powered Automation"**
4. Navigates through sections:
   - Each section uses THEIR data
   - Shows THEIR pain points with costs
   - Shows THEIR weak spots with ROI
   - Shows manufacturing case studies
   - Shows custom 90-day roadmap
   - Shows pricing for their company size
5. Can interact:
   - Use ROI calculator (pre-filled with their numbers)
   - Take diagnostic quiz
   - Book demo call
6. All interactions tracked for sales follow-up

---

## NETLIFY FUNCTIONS - UPDATED

### Function: prospect-analyzer.js

```javascript
// netlify/functions/prospect-analyzer.js
const Anthropic = require('@anthropic-ai/sdk');
const FirecrawlClient = require('@firecrawl/client');

exports.handler = async (event) => {
  const { client_id, website_url } = JSON.parse(event.body);

  // 1. Get prospect info
  const prospect = await getProspect(client_id);

  // 2. Scrape website
  const firecrawl = new FirecrawlClient(process.env.FIRECRAWL_API_KEY);
  const scrapedData = await firecrawl.scrape(website_url);

  // 3. Get Disruptors content for context
  const disruptorsServices = await getDisruptorsServices();
  const disruptorsCaseStudies = await getDisruptorsCaseStudies();

  // 4. Analyze with Claude
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const analysisPrompt = buildAnalysisPrompt(
    prospect,
    scrapedData.content,
    disruptorsServices,
    disruptorsCaseStudies
  );

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: [{ role: 'user', content: analysisPrompt }]
  });

  const analysis = JSON.parse(response.content[0].text);

  // 5. Save analysis to database
  await saveBusinessAnalysis(client_id, analysis);

  // 6. Update prospect with scores
  await updateProspect(client_id, {
    ai_readiness_score: analysis.ai_readiness_score,
    digital_maturity_score: analysis.digital_maturity_score,
    pain_points: analysis.pain_points,
    weak_spots: analysis.weak_spots,
    recommended_services: analysis.recommended_disruptors_services,
    status: 'analyzed'
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ analysis })
  };
};
```

### Function: presentation-generator.js

```javascript
// netlify/functions/presentation-generator.js
const Anthropic = require('@anthropic-ai/sdk');

exports.handler = async (event) => {
  const { client_id } = JSON.parse(event.body);

  // 1. Get prospect and analysis
  const prospect = await getProspect(client_id);
  const analysis = await getBusinessAnalysis(client_id);

  // 2. Get Disruptors content
  const disruptorsServices = await getDisruptorsServices();
  const relevantCaseStudies = await findRelevantCaseStudies(
    prospect.industry,
    analysis.pain_points
  );

  // 3. Generate personalized content with Claude
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const contentPrompt = buildContentPrompt(
    prospect,
    analysis,
    disruptorsServices,
    relevantCaseStudies
  );

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 8192,
    messages: [{ role: 'user', content: contentPrompt }]
  });

  const personalizedContent = JSON.parse(response.content[0].text);

  // 4. Save to database
  await savePersonalizedContent(client_id, personalizedContent);

  // 5. Update prospect status
  await updateProspect(client_id, {
    personalization_generated: true,
    personalization_generated_at: new Date(),
    status: 'ready'
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ personalizedContent })
  };
};
```

---

## KEY CHANGES FROM V1

### What's New:

1. **Core Purpose Section** - Explicitly explains this is for Disruptors to pitch TO prospects
2. **Terminology Clarity** - "Client" = prospect we're pitching to
3. **New Tables**:
   - `disruptors_content` - Stores Disruptors Media's services, case studies, etc.
   - `ai_presenter_business_analysis` - Stores prospect analysis
   - `ai_presenter_personalized_content` - Stores generated presentation content
4. **Updated Client Table** - Renamed conceptually to represent prospects, added fields for AI analysis results
5. **AI Prompts** - Complete prompts for business analysis and content generation
6. **Personalization Engine** - Detailed workflow for analyzing prospects and generating custom content
7. **Updated Workflows** - Shows admin creating presentation for prospect
8. **Netlify Functions** - Updated to handle prospect analysis and personalization

### What Stayed the Same:

- All original tables for presentations, slides, services, case studies, analytics, etc.
- Token-based access control
- Analytics tracking
- Admin interface structure
- Tech stack and deployment

---

## [REST OF ORIGINAL PRD CONTENT CONTINUES HERE]

All remaining sections from the original PRD remain intact:
- Application Routes
- Core Components
- Custom Hooks
- Styling & Design System
- Performance Optimizations
- Accessibility
- SEO Optimization
- Security Considerations
- Testing
- Deployment Checklist

---

**VERSION**: 2.0.0
**LAST UPDATED**: January 31, 2025
**STATUS**: Ready for Base44/Lovable/Bolt

**KEY IMPROVEMENT**: Now explicitly designed as a personalized presentation generator for Disruptors Media to pitch AI services to prospects, with AI analyzing each prospect's business and generating custom content.
