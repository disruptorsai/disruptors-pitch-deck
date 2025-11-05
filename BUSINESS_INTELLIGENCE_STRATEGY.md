# Business Intelligence Strategy for AI Presenter
## Comprehensive Analysis System for Personalized, Actionable Presentations

**Last Updated:** January 2025
**Status:** Strategic Planning
**Goal:** Build the most comprehensive business intelligence system to identify actual marketing and AI opportunities

---

## Executive Summary

The business analysis feature is the core value proposition of AI Presenter. To create presentations that feel authentically personalized and identify actual opportunities we can help with, we need to move beyond basic website scraping to a **multi-source intelligence system** that combines:

1. **Company Intelligence** - Firmographic, technographic, and financial data
2. **Market Intelligence** - Industry trends, competitive landscape, positioning
3. **Digital Presence Analysis** - Website, SEO, social media, content strategy
4. **Operational Signals** - Job postings, technology stack, process gaps
5. **Sentiment Analysis** - Customer reviews, employee feedback, brand perception
6. **Opportunity Detection** - Marketing weaknesses, AI adoption gaps, automation potential

---

## Current State Analysis

### What We Have (✅)
- **SerpAPI**: Web search for finding business websites
- **Firecrawl**: Website content extraction with markdown output
- **Brave Search**: Fallback search API
- **Claude 3.5 Sonnet**: AI analysis of website content
- **Regex Extraction**: Contact info, social media links
- **Basic Analysis**: Company description, services, branding, competitors

### Current Limitations (⚠️)
1. **Single Data Source**: Only website content - missing critical context
2. **No Financial Data**: Can't assess company health, growth stage, or funding
3. **No Job Posting Analysis**: Missing hiring signals that reveal priorities and pain points
4. **No Review/Sentiment Data**: Can't gauge customer satisfaction or brand perception
5. **No SEO/Marketing Intelligence**: Can't identify actual marketing weaknesses
6. **No Technology Stack Detection**: Can't identify AI/automation opportunities
7. **No Real-Time News**: Missing recent developments, leadership changes, strategic shifts
8. **Static Analysis**: No ongoing monitoring or change detection

### Impact on Goals (❌)
- **Personalization**: Limited context means presentations feel generic
- **Opportunity Identification**: Can't identify actual weaknesses we can help with
- **Credibility**: Without specific, data-backed insights, presentations lack authenticity
- **Value Proposition**: Not demonstrating deep understanding that wins clients

---

## Required Data Sources for Comprehensive Intelligence

### 1. Company Enrichment APIs (Priority: HIGH)

**Purpose:** Firmographic and technographic data to understand company fundamentals

**Top Providers (2025):**

| Provider | Best For | Pricing | Data Coverage |
|----------|----------|---------|---------------|
| **ZoomInfo** | Enterprise-grade contact & company data | $995+/month | 130M contacts, 30M companies |
| **Apollo.io** | All-in-one sales intelligence | $49-149/month | 275M contacts, 60M companies |
| **People Data Labs** | API-first data enrichment | Pay-per-call | 1.5B people, 24M companies |
| **Clearbit (HubSpot)** | Marketing automation integration | $999-4999/month | 40+ data points per company |
| **Proxycurl** | LinkedIn data enrichment | Pay-per-call | Real-time LinkedIn data |

**Data Points We Need:**
- Company size (employee count)
- Revenue estimates
- Funding rounds and investors
- Industry classification (detailed)
- Technology stack
- Growth indicators
- Decision-maker contacts
- Geographic footprint
- Business model

**Recommendation:** Start with **Apollo.io** ($149/month Growth plan) - best balance of data quality, coverage, and cost. Add **People Data Labs** for missing data on pay-per-call basis.

---

### 2. Job Posting Data APIs (Priority: HIGH)

**Purpose:** Identify hiring priorities, growth areas, skill gaps, and operational pain points

**Why This Matters:**
- Job postings reveal **strategic initiatives** (e.g., "AI Product Manager" = exploring AI)
- Hiring for specific roles signals **pain points** (e.g., "SEO Specialist" = weak organic presence)
- Volume of postings indicates **growth stage** and **budget availability**
- Required skills show **technology adoption** and **capability gaps**

**Top Providers (2025):**

| Provider | Best For | Pricing | Coverage |
|----------|----------|---------|----------|
| **Textkernel Market IQ** | Labor market analytics | Custom pricing | 15 global markets |
| **Coresignal Jobs API** | Real-time job data | $499+/month | 399M+ job records |
| **Bright Data Job Postings** | Web-scraped job data | Custom pricing | Global coverage |

**Data Points We Need:**
- Job titles being hired for
- Required skills and technologies
- Experience levels
- Posting frequency (hiring velocity)
- Remote/hybrid policies
- Salary ranges (when available)
- Department growth areas

**Opportunity Detection Examples:**
- Hiring "Content Marketing Manager" → They need content strategy
- Hiring "Marketing Operations Manager" → They need marketing automation
- Hiring "Data Analyst" but no "AI Engineer" → AI implementation opportunity
- Many "Sales" hires but no "Marketing" → Lead generation weakness
- "Customer Success" hires → Possible retention issues

**Recommendation:** **Coresignal Jobs API** ($499/month) - most API-friendly with global coverage.

---

### 3. Review & Sentiment APIs (Priority: HIGH)

**Purpose:** Understand customer satisfaction, pain points, and brand perception

**Why This Matters:**
- **Negative reviews** reveal product/service weaknesses
- **Competitor reviews** show what customers value
- **Response patterns** indicate customer service quality
- **Sentiment trends** show if brand perception is improving or declining
- **Specific complaints** become opportunities (e.g., "poor communication" → marketing/CRM opportunity)

**Top Providers (2025):**

| Provider | Best For | API Access | Pricing |
|----------|----------|------------|---------|
| **Trustpilot API** | Consumer reviews | Yes | Enterprise only |
| **G2 API** | B2B software reviews | Yes (CSV export) | $1,500+/month |
| **Bright Data Review Intelligence** | Multi-source reviews | Yes | Custom pricing |
| **ReviewsBlender** | Aggregated reviews | Yes | Custom pricing |

**Data Points We Need:**
- Overall rating and trend
- Review volume over time
- Sentiment breakdown (positive/negative/neutral)
- Common complaint themes
- Competitor comparison
- Response rate and quality
- Customer personas from reviews

**Opportunity Detection Examples:**
- "Difficult to find information on website" → SEO/UX opportunity
- "Poor customer communication" → Marketing automation opportunity
- "Limited online presence" → Digital marketing opportunity
- "Slow response times" → CRM/chatbot opportunity
- Competitor praised for feature → Competitive differentiation need

**Recommendation:** **Bright Data Review Intelligence Agent** (custom pricing) - can scrape G2, Capterra, Trustpilot, Google Reviews in one system. Alternative: Build CrewAI multi-source scraper.

---

### 4. SEO & Marketing Intelligence APIs (Priority: CRITICAL)

**Purpose:** Identify specific marketing weaknesses and opportunities

**Why This Is Critical:**
- **Direct alignment with your services** - marketing is what you sell
- **Quantifiable opportunities** - "You're losing 10,000 monthly visitors to competitor"
- **Competitive benchmarking** - "Your competitor ranks for 1,500 keywords, you rank for 200"
- **Content gap analysis** - Specific topics they should cover
- **Backlink profile** - Link building opportunities
- **Paid advertising analysis** - PPC strategy insights

**Top Providers (2025):**

| Provider | Best For | API Access | Pricing |
|----------|----------|------------|---------|
| **Semrush API** | Comprehensive SEO data | Yes | $449/mo + API units |
| **Ahrefs API** | Backlink analysis | Yes (v3) | $999+/month (Enterprise) |
| **DataForSEO** | Cost-effective SEO data | Yes | $0.25-2.50 per request |
| **Serpstat API** | Budget-friendly alternative | Yes | $69-499/month |

**Data Points We Need:**

**SEO Metrics:**
- Organic traffic estimates
- Keyword rankings (current position for target keywords)
- Domain authority/rating
- Backlink profile (quantity and quality)
- Top organic keywords
- Traffic trends (growing/declining)
- SERP features captured

**Competitor Intelligence:**
- Competitor organic keywords
- Keyword gaps (competitors rank, they don't)
- Content gaps (topics competitors cover)
- Backlink gap analysis
- Paid advertising strategy

**Content Analysis:**
- Top-performing pages
- Content quality score
- Internal linking structure
- On-page SEO issues

**Opportunity Detection Examples:**
- Low domain authority (15/100) → Link building campaign needed
- Competitor ranks for 500 keywords they don't → Content strategy opportunity
- No blog content → Content marketing opportunity
- Poor mobile performance → Website optimization opportunity
- Zero backlinks from industry publications → PR/outreach opportunity
- High bounce rate pages → UX/conversion optimization opportunity

**Recommendation:** **DataForSEO API** ($0.25-2.50 per request) for cost-effective access to comprehensive SEO data. Upgrade to **Semrush API** if budget allows for deeper competitor analysis.

**Critical Note:** This is the MOST IMPORTANT data source because it directly identifies marketing opportunities you can help with.

---

### 5. Technology Stack Detection APIs (Priority: HIGH)

**Purpose:** Identify technology adoption, AI readiness, and automation opportunities

**Why This Matters:**
- **Current tech stack** shows sophistication level
- **Missing technologies** reveal gaps (e.g., no marketing automation = opportunity)
- **Outdated technologies** signal modernization needs
- **Competitor tech** shows what they're missing
- **AI/ML tools** (or lack thereof) identify AI implementation opportunities

**Top Providers (2025):**

| Provider | Best For | API Access | Pricing |
|----------|----------|------------|---------|
| **BuiltWith** | Comprehensive tech profiling | Yes | $295-995/month |
| **Wappalyzer** | Real-time detection | Yes | $250/month (5,000 lookups) |
| **SimilarTech** | Technology adoption trends | Yes | Custom pricing |
| **Datanyze** | Technographic data | Yes | Custom pricing |

**Data Points We Need:**
- CMS/website platform
- Marketing automation tools
- Analytics platforms
- CRM system
- E-commerce platform
- Chatbot/customer service tools
- Email marketing platform
- Social media management tools
- SEO tools
- Advertising platforms
- AI/ML tools (if any)

**Opportunity Detection Examples:**
- No marketing automation (HubSpot, Marketo) → Marketing automation implementation
- Using Mailchimp but not segmenting → Email marketing optimization
- No chatbot → AI chatbot implementation opportunity
- No CRM or basic CRM → CRM strategy opportunity
- Competitors using AI tools they aren't → AI adoption opportunity
- Outdated website platform → Website modernization
- No heatmapping/session recording → Conversion optimization opportunity

**Recommendation:** **Wappalyzer API** ($250/month) - most cost-effective for real-time detection. Upgrade to **BuiltWith** for historical data and deeper insights.

---

### 6. Real-Time News & Market Intelligence APIs (Priority: MEDIUM)

**Purpose:** Recent developments, strategic initiatives, market position

**Why This Matters:**
- **Recent announcements** show current priorities
- **Leadership changes** indicate strategic shifts
- **Funding rounds** signal growth stage and budget availability
- **Market trends** provide context for recommendations
- **Industry news** helps personalize presentations

**Top Providers (2025):**

| Provider | Best For | API Access | Pricing |
|----------|----------|------------|---------|
| **NewsAPI.ai** | Global news monitoring | Yes | $99-999/month |
| **Event Registry** | 150K global publishers | Yes | Custom pricing |
| **Quantexa (Aylien)** | AI-driven news intelligence | Yes | Enterprise pricing |
| **Contify** | Competitive intelligence | Yes | Custom pricing |

**Data Points We Need:**
- Recent press releases
- Funding announcements
- Leadership changes
- Product launches
- Partnership announcements
- Industry trend articles
- Competitor news
- Market analysis

**Recommendation:** **NewsAPI.ai** ($99/month starter) - best developer experience and global coverage.

---

### 7. Financial Data APIs (Priority: MEDIUM)

**Purpose:** Company financial health, growth trajectory, funding status

**Why This Matters:**
- **Funding stage** indicates budget availability
- **Revenue growth** shows if they can afford services
- **Recent funding** means higher likelihood of investing in growth
- **Financial stress** might mean they need cost-effective solutions
- **IPO/acquisition rumors** provide urgency context

**Top Providers (2025):**

| Provider | Best For | API Access | Pricing |
|----------|----------|------------|---------|
| **Crunchbase API** | Startup funding data | Yes | Custom pricing |
| **Financial Modeling Prep** | Public company financials | Yes | $19.99-69.99/month |
| **Alpha Vantage** | Stock data & fundamentals | Yes | Free-$49.99/month |
| **PitchBook** | Private equity data | Limited | Enterprise pricing |

**Data Points We Need:**
- Total funding raised
- Latest funding round (amount, date, investors)
- Valuation (if available)
- Revenue (estimates or actual)
- Revenue growth rate
- Employee growth rate
- Acquisition history
- Investment focus areas

**Recommendation:** **Financial Modeling Prep** ($29.99/month) for public companies + **Crunchbase** data via company enrichment APIs for startups.

---

### 8. Social Media Intelligence APIs (Priority: MEDIUM)

**Purpose:** Social media presence, engagement, content strategy

**Why This Matters:**
- **Low engagement** = social media strategy opportunity
- **Inconsistent posting** = content calendar opportunity
- **No presence** on key platforms = channel expansion opportunity
- **Competitor comparison** shows gaps
- **Sentiment analysis** of comments reveals brand perception

**Top Providers (2025):**

| Provider | Best For | API Access | Pricing |
|----------|----------|------------|---------|
| **Brandwatch** | Social listening | Yes | Enterprise pricing |
| **Sprout Social** | Social analytics | Yes | $249-499/month per user |
| **Hootsuite** | Multi-platform management | Yes | Custom pricing |
| **Native APIs** | Direct platform access | Yes | Varies (often free) |

**Data Points We Need:**
- Follower counts by platform
- Posting frequency
- Engagement rates (likes, comments, shares)
- Content themes
- Response rates to comments
- Influencer partnerships
- Paid advertising presence
- Competitor comparison

**Recommendation:** Use **native social media APIs** (Twitter, Facebook, Instagram, LinkedIn) where possible. Add **Brandwatch** for comprehensive listening if budget allows.

---

## Comprehensive Analysis Architecture

### Multi-Stage Intelligence Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    Stage 1: Data Gathering                       │
├─────────────────────────────────────────────────────────────────┤
│ 1. Company Enrichment (Apollo.io + People Data Labs)            │
│    └─ Basic firmographics, contacts, revenue estimates          │
│                                                                   │
│ 2. Website Analysis (Firecrawl + Claude)                        │
│    └─ Services, messaging, branding, content quality            │
│                                                                   │
│ 3. Technology Stack (Wappalyzer)                                │
│    └─ Current tools, missing tools, AI adoption level           │
│                                                                   │
│ 4. Job Postings (Coresignal)                                    │
│    └─ Hiring priorities, skill gaps, growth areas               │
│                                                                   │
│ 5. SEO Intelligence (DataForSEO)                                │
│    └─ Rankings, keywords, backlinks, competitors                │
│                                                                   │
│ 6. Reviews & Sentiment (Bright Data + Scraping)                │
│    └─ Customer feedback, pain points, competitor comparison     │
│                                                                   │
│ 7. News & Market Intel (NewsAPI.ai)                            │
│    └─ Recent announcements, market trends, leadership changes   │
│                                                                   │
│ 8. Social Media (Native APIs)                                   │
│    └─ Presence, engagement, content strategy                    │
└─────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────┐
│              Stage 2: AI Analysis & Synthesis                    │
├─────────────────────────────────────────────────────────────────┤
│ Claude 3.5 Sonnet (Opus for critical analysis)                  │
│                                                                   │
│ Analysis Tasks:                                                  │
│ 1. Synthesize all data sources into coherent profile            │
│ 2. Identify patterns and insights across data                   │
│ 3. Benchmark against competitors                                │
│ 4. Calculate opportunity scores                                 │
│ 5. Prioritize recommendations                                   │
│ 6. Generate personalized presentation content                   │
└─────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────┐
│           Stage 3: Opportunity Detection Engine                  │
├─────────────────────────────────────────────────────────────────┤
│ Marketing Opportunities:                                         │
│ • SEO weaknesses (low rankings, keyword gaps)                   │
│ • Content gaps (missing topics)                                 │
│ • Social media underperformance                                 │
│ • Website UX/conversion issues                                  │
│ • Paid advertising opportunities                                │
│ • Brand positioning gaps                                        │
│                                                                   │
│ AI Implementation Opportunities:                                 │
│ • Process automation gaps                                       │
│ • Customer service automation (chatbots)                        │
│ • Marketing automation needs                                    │
│ • Data analytics capabilities                                   │
│ • Content generation opportunities                              │
│ • Predictive analytics potential                                │
│                                                                   │
│ Training & Capability Opportunities:                             │
│ • Skill gaps from job postings                                  │
│ • Technology adoption needs                                     │
│ • Team capability building                                      │
└─────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────┐
│        Stage 4: Personalized Presentation Generation             │
├─────────────────────────────────────────────────────────────────┤
│ 1. Custom slides with company-specific data                     │
│ 2. Competitor benchmarking charts                               │
│ 3. Opportunity prioritization matrix                            │
│ 4. ROI projections for recommendations                          │
│ 5. Implementation roadmap                                       │
│ 6. Case studies matching their industry/challenges              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Opportunity Detection Framework

### Marketing Opportunity Scoring Matrix

Each opportunity is scored on three dimensions:

1. **Impact Potential** (1-10): How much this could improve their business
2. **Evidence Strength** (1-10): How confident we are this is a real opportunity
3. **Service Alignment** (1-10): How well this aligns with our service offerings

**Opportunity Score = (Impact × Evidence × Alignment) / 100**

### Marketing Opportunity Categories

#### 1. SEO Opportunities

**Data Sources:** DataForSEO, Semrush, Ahrefs

**Signals to Detect:**
- Domain Authority < 30 → Link building opportunity (High Impact)
- Organic traffic < 1,000/month → SEO strategy overhaul (High Impact)
- Keyword gap > 500 keywords vs competitor → Content gap opportunity (High Impact)
- Zero backlinks from industry sites → PR/outreach opportunity (Medium Impact)
- No featured snippets captured → SERP optimization opportunity (Medium Impact)
- Technical SEO issues (slow load times, mobile issues) → Technical SEO audit (Medium Impact)

**Presentation Elements:**
- Current vs. Competitor organic traffic comparison chart
- Keyword gap analysis (specific keywords they're missing)
- Top 10 quick-win keywords (low competition, high volume)
- Projected traffic increase timeline
- ROI calculation based on customer lifetime value

#### 2. Content Marketing Opportunities

**Data Sources:** Website analysis, SEO data, social media

**Signals to Detect:**
- No blog or < 1 post/month → Content marketing program (High Impact)
- Blog exists but poor engagement → Content optimization (Medium Impact)
- Competitor content outperforming → Content gap (High Impact)
- No gated content/lead magnets → Lead generation opportunity (High Impact)
- No video content → Video marketing opportunity (Medium Impact)
- Weak thought leadership → Authority building (Medium Impact)

**Presentation Elements:**
- Content audit findings
- Competitor content performance analysis
- Content calendar template
- Topic clusters based on keyword research
- Expected lead generation improvements

#### 3. Social Media Opportunities

**Data Sources:** Social media APIs, competitor benchmarking

**Signals to Detect:**
- Follower count < 1,000 on key platforms → Social growth strategy (Medium Impact)
- Engagement rate < 2% → Social media optimization (High Impact)
- Inconsistent posting (gaps > 1 week) → Content calendar & automation (Medium Impact)
- Competitor outperforming by >50% → Competitive strategy gap (High Impact)
- No employee advocacy program → Team amplification opportunity (Medium Impact)
- No paid social advertising → Paid social opportunity (High Impact)

**Presentation Elements:**
- Social media audit by platform
- Competitor benchmarking dashboard
- Engagement rate trends
- Optimal posting frequency analysis
- Paid social opportunity calculator

#### 4. Website & Conversion Optimization

**Data Sources:** Website analysis, technology stack, SEO data

**Signals to Detect:**
- No clear CTAs → Conversion optimization (High Impact)
- Load time > 3 seconds → Performance optimization (High Impact)
- No A/B testing tools detected → Experimentation opportunity (Medium Impact)
- High bounce rate pages → UX improvement opportunity (High Impact)
- No heatmapping/session recording → User behavior analysis (Medium Impact)
- Poor mobile experience → Mobile optimization (High Impact)
- No exit-intent popups → Lead capture opportunity (Low Impact)

**Presentation Elements:**
- Website performance audit
- UX/UI improvement mockups
- Conversion funnel analysis
- A/B testing roadmap
- Expected conversion rate improvements

#### 5. Paid Advertising Opportunities

**Data Sources:** Technology stack, SEO data, competitor analysis

**Signals to Detect:**
- No Google Ads detected → PPC opportunity (High Impact)
- No retargeting pixels → Remarketing opportunity (High Impact)
- Competitors advertising, they aren't → Competitive disadvantage (High Impact)
- High organic traffic but no paid → Scale opportunity (Medium Impact)
- Advertising but poor landing pages → Campaign optimization (High Impact)

**Presentation Elements:**
- Competitor advertising analysis
- Keyword opportunity report
- Expected CPA based on industry benchmarks
- Landing page optimization recommendations
- Budget allocation strategy

#### 6. Marketing Automation & CRM

**Data Sources:** Technology stack, job postings, website analysis

**Signals to Detect:**
- No marketing automation detected → Automation opportunity (High Impact)
- Basic email platform (Mailchimp) but not using automation → Upgrade opportunity (High Impact)
- Hiring sales/marketing but no CRM → CRM implementation (High Impact)
- No lead scoring detected → Lead qualification improvement (Medium Impact)
- No personalization → Personalization opportunity (High Impact)
- Manual processes evident → Workflow automation (High Impact)

**Presentation Elements:**
- Current process documentation
- Automation workflow diagrams
- Time savings calculations
- Lead nurturing strategy
- ROI projections based on deal velocity improvements

### AI Implementation Opportunity Categories

#### 1. Customer Service Automation

**Data Sources:** Reviews, technology stack, job postings

**Signals to Detect:**
- Reviews mention "slow response times" → Chatbot opportunity (High Impact)
- No chatbot detected → AI customer service (High Impact)
- Hiring customer service reps → Automation potential (Medium Impact)
- High support ticket volume (if detectable) → Ticket routing automation (High Impact)
- No knowledge base → AI-powered knowledge base (Medium Impact)

**Presentation Elements:**
- Current customer service pain points from reviews
- Chatbot ROI calculator (cost savings)
- Implementation timeline
- Pilot program proposal
- Success metrics definition

#### 2. Marketing Content Generation

**Data Sources:** Website content quality, posting frequency, job postings

**Signals to Detect:**
- Inconsistent content publishing → AI content assistance (Medium Impact)
- Hiring content writers → Content generation efficiency (Medium Impact)
- Poor content quality → AI editing & optimization (Low Impact)
- No video transcription → Transcription automation (Low Impact)
- Manual social media posting → AI scheduling & generation (Medium Impact)

**Presentation Elements:**
- Content production current state
- AI-assisted content workflow
- Quality assurance framework
- Cost comparison (current vs. AI-assisted)
- Content calendar acceleration

#### 3. Process Automation

**Data Sources:** Job postings, technology stack, company size

**Signals to Detect:**
- Hiring for repetitive roles → Automation opportunity (High Impact)
- Manual data entry roles → RPA opportunity (High Impact)
- No workflow automation → Process optimization (High Impact)
- Growing team but same tools → Efficiency opportunity (High Impact)

**Presentation Elements:**
- Process mining analysis
- Automation opportunity assessment
- Implementation roadmap
- ROI based on labor cost savings
- Change management plan

#### 4. AI Training & Capability Building

**Data Sources:** Job postings, technology stack, company stage

**Signals to Detect:**
- Hiring AI roles but no AI tools → Training need (High Impact)
- Hiring junior tech talent → Upskilling opportunity (Medium Impact)
- No AI adoption but competitors using it → Capability gap (High Impact)
- Leadership announcing AI initiatives → Training demand (High Impact)

**Presentation Elements:**
- Skills gap analysis
- Training program curriculum
- Implementation timeline
- Cost per employee
- Expected capability improvements

---

## AI Analysis Prompting Strategy

### Comprehensive Analysis Prompt Template

The key to actionable insights is a sophisticated, multi-stage Claude prompt:

```
You are an expert business intelligence analyst specializing in marketing and AI opportunities.

I will provide you with comprehensive data about a business from 8 different sources. Your task is to:

1. Synthesize all data into a coherent business profile
2. Identify specific, actionable marketing weaknesses
3. Identify specific AI implementation opportunities
4. Prioritize opportunities by impact and feasibility
5. Generate presentation-ready insights

## BUSINESS DATA

### Company Profile (Apollo.io + Website)
- Name: {name}
- Industry: {industry}
- Size: {employee_count} employees
- Revenue: ${estimated_revenue}
- Founded: {founded_year}
- Website: {url}
- Description: {description}

### Technology Stack (Wappalyzer)
{technology_list}

### Job Postings (Last 90 Days) (Coresignal)
{job_postings_analysis}

### SEO Performance (DataForSEO)
- Domain Authority: {da}
- Organic Traffic: {monthly_traffic}
- Ranking Keywords: {keyword_count}
- Backlinks: {backlink_count}
- Top Competitors: {competitors}
- Keyword Gap: {keyword_gap_count} keywords competitors rank for that they don't

### Customer Reviews (Bright Data)
- Average Rating: {avg_rating}
- Review Count: {review_count}
- Common Complaints: {complaint_themes}
- Common Praise: {praise_themes}
- Sentiment Trend: {sentiment_trend}

### News & Market Intelligence (NewsAPI.ai)
{recent_news_summary}

### Social Media Presence (Native APIs)
{social_media_metrics}

## YOUR ANALYSIS TASK

### Part 1: Business Understanding
Synthesize all data to understand:
- What stage of growth are they in?
- What are their current strategic priorities (based on hiring, news, initiatives)?
- What is their competitive position?
- What is their digital maturity level?

### Part 2: Marketing Opportunity Identification

For each opportunity category below, provide:
1. SPECIFIC finding (not generic)
2. Evidence from data
3. Impact score (1-10)
4. Our service that addresses it
5. Quick-win potential (yes/no)

Categories:
- SEO Opportunities
- Content Marketing Opportunities
- Social Media Opportunities
- Website/Conversion Opportunities
- Paid Advertising Opportunities
- Marketing Automation Opportunities

### Part 3: AI Implementation Opportunity Identification

For each opportunity category below, provide:
1. SPECIFIC process or area to automate
2. Evidence from data (job postings, pain points, reviews)
3. Impact score (1-10)
4. Implementation complexity (low/medium/high)
5. ROI potential (time or cost savings)

Categories:
- Customer Service Automation
- Marketing Content Generation
- Process Automation (internal operations)
- Data Analytics & Intelligence
- Training & Capability Building

### Part 4: Opportunity Prioritization

Create a prioritized list of the TOP 5 opportunities that:
- Have strong evidence
- Align with our services (marketing, AI)
- Have high impact potential
- Are realistic to implement

For each, provide:
- Opportunity title
- One-sentence description
- Key metric that proves it's needed
- Expected outcome
- Estimated implementation timeline
- Estimated budget range

### Part 5: Presentation Narrative

Write a compelling 2-3 paragraph narrative that:
- Shows deep understanding of their business
- References specific data points that prove we've done our research
- Positions the top opportunities as logical next steps
- Creates urgency without being pushy

## OUTPUT FORMAT

Return ONLY valid JSON in this exact structure:

{
  "businessProfile": {
    "summary": "2-3 sentence synthesis",
    "growthStage": "startup|growth|enterprise",
    "digitalMaturity": "basic|intermediate|advanced",
    "strategicPriorities": ["priority1", "priority2", "priority3"]
  },
  "marketingOpportunities": [
    {
      "category": "SEO|Content|Social|Website|Paid|Automation",
      "title": "Specific opportunity title",
      "description": "Detailed description",
      "evidence": "Specific data point proving this",
      "impactScore": 8,
      "ourService": "Which service addresses this",
      "quickWin": true|false,
      "metrics": {
        "current": "Current state metric",
        "potential": "Potential improvement metric",
        "timeline": "Expected timeline to results"
      }
    }
  ],
  "aiOpportunities": [
    {
      "category": "CustomerService|Content|Process|Analytics|Training",
      "title": "Specific AI opportunity title",
      "description": "Detailed description",
      "evidence": "Specific data point proving this",
      "impactScore": 9,
      "complexity": "low|medium|high",
      "roiPotential": "Specific cost/time savings estimate",
      "implementation": {
        "phases": ["phase1", "phase2"],
        "timeline": "6-12 months",
        "requirements": ["requirement1", "requirement2"]
      }
    }
  ],
  "top5Opportunities": [
    {
      "rank": 1,
      "title": "Opportunity title",
      "description": "One-sentence description",
      "category": "marketing|ai",
      "keyMetric": "The metric that proves this is needed",
      "expectedOutcome": "What will improve",
      "timeline": "3-6 months",
      "budgetRange": "$5,000 - $15,000"
    }
  ],
  "presentationNarrative": "2-3 compelling paragraphs that reference specific data and create urgency",
  "competitiveBenchmark": {
    "theirPosition": "Where they stand",
    "competitorAdvantages": ["What competitors are doing better"],
    "urgency": "Why they need to act now"
  }
}
```

### Analysis Quality Checklist

Before accepting Claude's analysis, verify:

- [ ] Every opportunity references specific data (not generic "you need better SEO")
- [ ] Metrics are included (current state vs. potential improvement)
- [ ] Opportunities align with services we actually offer
- [ ] Evidence is strong (multiple data sources confirm the opportunity)
- [ ] Priority ranking makes logical sense
- [ ] Narrative is compelling and personalized
- [ ] No hallucinated data (everything must come from source data)

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
**Goal:** Establish core data infrastructure

- [x] Current implementation (SerpAPI, Firecrawl, Claude)
- [ ] Add Apollo.io integration ($149/month)
- [ ] Add DataForSEO integration (pay-per-call)
- [ ] Add Wappalyzer integration ($250/month)
- [ ] Create unified data aggregation service
- [ ] Implement data caching layer (Redis/Supabase)
- [ ] Add error handling and fallbacks

**Cost:** $399/month recurring + development time

### Phase 2: Marketing Intelligence (Weeks 3-4)
**Goal:** Enable comprehensive marketing opportunity detection

- [ ] Integrate Coresignal Jobs API ($499/month)
- [ ] Build review aggregation (Bright Data or custom scraper)
- [ ] Add NewsAPI.ai integration ($99/month)
- [ ] Implement SEO competitor benchmarking
- [ ] Create marketing opportunity scoring engine
- [ ] Build opportunity detection algorithms

**Cost:** $598/month additional recurring

### Phase 3: AI Analysis & Presentation (Weeks 5-6)
**Goal:** Generate actionable, personalized presentations

- [ ] Refine Claude analysis prompts
- [ ] Build multi-stage analysis pipeline
- [ ] Create presentation template system
- [ ] Add competitive benchmarking charts
- [ ] Implement ROI calculators
- [ ] Build opportunity prioritization matrix

**Cost:** Anthropic API usage increase (~$50-200/month depending on volume)

### Phase 4: Enhancement & Optimization (Weeks 7-8)
**Goal:** Polish and optimize system

- [ ] Add social media native API integrations
- [ ] Implement change detection & monitoring
- [ ] Build client dashboard for ongoing tracking
- [ ] Add A/B testing for presentation effectiveness
- [ ] Optimize API usage and caching
- [ ] Create admin analytics dashboard

**Cost:** Minimal additional recurring costs

### Phase 5: Advanced Features (Future)
**Goal:** Cutting-edge capabilities

- [ ] Real-time monitoring & alerts
- [ ] Predictive analytics (ML models for opportunity scoring)
- [ ] Integration with CRM for tracking presentation effectiveness
- [ ] Automated follow-up recommendations
- [ ] Industry-specific analysis templates
- [ ] Client self-service portal

**Cost:** TBD based on features

---

## Cost Analysis

### Monthly Recurring Costs (Full Implementation)

| Service | Purpose | Monthly Cost | Priority |
|---------|---------|--------------|----------|
| **Apollo.io Growth** | Company enrichment | $149 | HIGH |
| **Wappalyzer** | Technology detection | $250 | HIGH |
| **DataForSEO** | SEO intelligence | ~$100-300 (usage-based) | CRITICAL |
| **Coresignal Jobs** | Job posting analysis | $499 | HIGH |
| **NewsAPI.ai** | News monitoring | $99 | MEDIUM |
| **Bright Data** | Review aggregation | ~$200-500 (usage-based) | HIGH |
| **SerpAPI** | Web search (current) | ~$50 (current usage) | HIGH |
| **Firecrawl** | Website scraping (current) | ~$50 (current usage) | HIGH |
| **Anthropic API** | AI analysis | ~$100-300 (usage-based) | CRITICAL |
| **Social Media APIs** | Social intelligence | $0 (native APIs) | MEDIUM |
| **Supabase** | Database (current) | Current plan | N/A |
| **Netlify** | Hosting (current) | Current plan | N/A |

**Total Monthly Cost (Full System):** ~$1,497 - $2,197

### Per-Analysis Cost Breakdown

Assuming 20 comprehensive analyses per month:

- Apollo.io: $7.45 per analysis
- Wappalyzer: $12.50 per analysis
- DataForSEO: $5-15 per analysis
- Coresignal: $24.95 per analysis
- NewsAPI.ai: $4.95 per analysis
- Bright Data: $10-25 per analysis
- SerpAPI: $2.50 per analysis
- Firecrawl: $2.50 per analysis
- Anthropic: $5-15 per analysis

**Cost per Comprehensive Analysis:** ~$75 - $110

### ROI Justification

**If each analysis leads to:**
- 1 in 5 closes (20% close rate)
- Average client value: $10,000
- Revenue per 20 analyses: $40,000
- Cost per 20 analyses: $1,500 - $2,200
- **ROI: 1,800% - 2,600%**

Even at 1 in 10 close rate:
- Revenue: $20,000
- Cost: $2,000
- **ROI: 900%**

### Cost Optimization Strategies

1. **Start with Tier 1 priorities** (Apollo, DataForSEO, Wappalyzer)
2. **Use pay-per-call APIs** to test before committing to monthly plans
3. **Cache aggressively** to reduce API calls
4. **Negotiate volume discounts** once proven
5. **Build internal tools** for some data sources (e.g., social media scraping)
6. **Offer tiered analysis packages** (basic vs. comprehensive) to match client needs

---

## Competitive Advantages

### What This System Enables

1. **Quantified Opportunities**
   - "You're losing 8,500 monthly visitors to [Competitor]"
   - "You rank for 127 keywords, [Competitor] ranks for 1,843"
   - "Your social engagement is 0.8%, industry average is 3.2%"

2. **Authentic Personalization**
   - References their actual job postings
   - Quotes their customer reviews
   - Shows their actual competitor comparison
   - Uses their brand colors and messaging

3. **Actionable Roadmap**
   - Prioritized opportunities with ROI projections
   - Specific keywords to target
   - Exact technologies to implement
   - Timeline and budget estimates

4. **Ongoing Value**
   - Monitor changes over time
   - Alert on new opportunities
   - Track implementation progress
   - Benchmark against competitors continuously

### Why This Wins Business

**Current State (Competitor Pitches):**
> "We can help with your SEO and digital marketing strategy."

**Your State (With This System):**
> "We analyzed your digital presence using 8 data sources. You're currently ranking for 127 keywords while your top competitor ranks for 1,843. We identified 487 keyword opportunities where you could capture an estimated 8,500 additional monthly visitors. Your customer reviews mention 'hard to find information' 23 times, which aligns with your 68% bounce rate on service pages. We've built a roadmap to address this that could increase your organic leads by 340% in 6 months. Here's exactly how we'll do it..."

**The difference?** Specificity, data, credibility, confidence.

---

## Next Steps

### Immediate Actions (This Week)

1. **Approve Budget**: Review and approve Phase 1 costs (~$400/month)
2. **API Signup**: Create accounts for Apollo.io, DataForSEO, Wappalyzer
3. **Architecture Review**: Review technical implementation plan with development team
4. **Test Analysis**: Run comprehensive analysis on 1-2 test companies to validate approach

### Key Decisions Needed

1. **Budget Approval**: Full system ($1,500-2,200/month) or phased approach?
2. **Priority Ranking**: Which data sources are most critical?
3. **Timeline**: Aggressive (4 weeks) or measured (8 weeks)?
4. **Pricing Strategy**: How to price comprehensive analysis to clients?
5. **Internal vs. External**: What to build vs. what to buy?

### Success Metrics

**System Performance:**
- Analysis completion time: < 5 minutes per company
- Data source availability: > 95% uptime
- API cost per analysis: < $100
- Cache hit rate: > 60%

**Business Impact:**
- Analysis-to-presentation conversion: > 80%
- Presentation-to-meeting conversion: > 50%
- Meeting-to-close conversion: > 20%
- Average deal size: > $10,000
- Time to close: < 30 days

---

## Conclusion

Building a comprehensive business intelligence system is not optional—it's the core of the value proposition. The investment (~$1,500-2,200/month) is minimal compared to the competitive advantage it provides.

The difference between winning and losing deals will come down to:
- **Specificity**: Actual data vs. generic recommendations
- **Credibility**: Proven research vs. assumptions
- **Urgency**: Quantified opportunities vs. vague potential
- **Confidence**: Detailed roadmap vs. exploratory engagement

This system transforms your pitch from "We think we can help" to "Here's exactly what's wrong and how we'll fix it."

**Ready to build this?** Let's start with Phase 1 this week.
