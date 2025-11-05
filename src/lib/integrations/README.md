
# Business Intelligence API Integrations

This directory contains API client modules for comprehensive business intelligence gathering.

## Overview

Each client module provides a clean, consistent interface to external APIs with built-in:
- ✅ Error handling with custom error classes
- ✅ Retry logic with exponential backoff
- ✅ Rate limiting and request throttling
- ✅ Data normalization to consistent format
- ✅ Cost/usage tracking for monitoring
- ✅ TypeScript type definitions

## Available Integrations

### Phase 1: Priority Tier 1 (Implemented)

#### 1. Apollo.io (`apollo-client.ts`)
**Purpose:** Company enrichment and firmographic data

**Key Methods:**
- `searchCompanies(query)` - Search for companies by name or domain
- `enrichCompany(domain)` - Get detailed company data
- `getTechnologies(domain)` - Get technology stack
- `getCompanyData(domainOrName)` - Comprehensive company data with normalization

**Data Provided:**
- Company name, domain, website
- Industry and sub-industry
- Employee count and revenue estimates
- Founded year and description
- Contact information (phone)
- Location (city, state, country)
- Social media URLs (LinkedIn, Facebook, Twitter)
- Technology stack

**Rate Limits:** 100 requests/day (Growth plan)

**Cost:** $149/month

**Example:**
```typescript
import { apolloClient } from './integrations/apollo-client';

const companyData = await apolloClient.getCompanyData('anthropic.com', true);
console.log(companyData.name); // "Anthropic"
console.log(companyData.employeeCount); // 150
```

---

#### 2. DataForSEO (`dataforseo-client.ts`)
**Purpose:** SEO intelligence and competitor analysis

**Key Methods:**
- `getDomainAnalytics(domain)` - Domain authority, organic keywords, traffic estimates
- `getBacklinks(domain, limit)` - Backlink profile analysis
- `getCompetitors(domain, limit)` - Competitor identification and comparison
- `getKeywordData(keywords)` - Keyword search volume and competition
- `getComprehensiveSEOData(domain)` - All SEO data in parallel

**Data Provided:**
- Organic keyword count and distribution
- Estimated traffic value
- Keyword position distribution (top 1, 3, 10, etc.)
- Backlink count and referring domains
- Top backlinks with anchor text
- Competitor domains and metrics
- Keyword gap analysis

**Rate Limits:** 600 requests/minute

**Cost:** Pay-per-request ($0.25-2.50 per endpoint)

**Special Features:**
- Cost tracking via `getTotalCost()` method
- Automatic cost logging for each request

**Example:**
```typescript
import { dataForSEOClient } from './integrations/dataforseo-client';

const seoData = await dataForSEOClient.getComprehensiveSEOData('anthropic.com');
console.log(seoData.organicKeywords); // 1,234
console.log(seoData.competitors); // Array of competitor domains
console.log(dataForSEOClient.getTotalCost()); // $2.45
```

---

#### 3. Wappalyzer (`wappalyzer-client.ts`)
**Purpose:** Technology stack detection

**Key Methods:**
- `lookupTechnologies(url)` - Detect all technologies on a website
- `categorizeTechnologies(technologies)` - Group technologies by category
- `hasTechnology(technologies, categorySlug)` - Check if category exists
- `getTechnologiesByCategory(technologies, categorySlug)` - Filter by category
- `analyzeTechnologyStack(url)` - Comprehensive analysis with categorization
- `identifyMissingTechnologies(technologies)` - Find gaps (opportunities)

**Data Provided:**
- Detected technologies with confidence scores
- Categories: CMS, frameworks, analytics, marketing automation, CRM, e-commerce, etc.
- Insights: hasMarketingAutomation, hasCRM, hasAnalytics, etc.
- Missing critical technologies (opportunities)

**Rate Limits:** No hard limit, quota-based (5,000 lookups/month)

**Cost:** $250/month

**Special Features:**
- Usage tracking via `getLookupCount()` method
- Automatic categorization and insights

**Example:**
```typescript
import { wappalyzerClient } from './integrations/wappalyzer-client';

const techStack = await wappalyzerClient.analyzeTechnologyStack('anthropic.com');
console.log(techStack.summary.cms); // ["WordPress"]
console.log(techStack.insights.hasMarketingAutomation); // false
console.log(wappalyzerClient.identifyMissingTechnologies(techStack.technologies));
// ["Marketing Automation (HubSpot, Marketo, ActiveCampaign)"]
```

---

## Data Normalization

All client modules include a `normalize*Data()` method that converts API-specific responses to a consistent format:

```typescript
{
  // Source-specific data fields
  ...data,

  // Common metadata
  dataSource: string,        // e.g., 'apollo', 'dataforseo', 'wappalyzer'
  retrievedAt: string,       // ISO timestamp
}
```

This allows the data aggregation service to merge data from multiple sources seamlessly.

## Error Handling

Each client has a custom error class:
- `ApolloClientError`
- `DataForSEOClientError`
- `WappalyzerClientError`

All clients implement:
1. **Retry logic** with exponential backoff (default: 3 attempts)
2. **Timeout handling** with configurable timeouts
3. **Rate limit detection** (don't retry 4xx errors except 429)
4. **Detailed error messages** with status codes and API responses

Example:
```typescript
try {
  const data = await apolloClient.getCompanyData('invalid-domain');
} catch (error) {
  if (error instanceof ApolloClientError) {
    console.error(`Apollo error (${error.statusCode}): ${error.message}`);
    console.error(error.response); // Full API error response
  }
}
```

## Usage in Data Aggregation

The `DataAggregationService` (`src/lib/services/data-aggregator.ts`) orchestrates all API clients:

```typescript
import { dataAggregator } from './services/data-aggregator';

const results = await dataAggregator.aggregateAllData({
  domain: 'anthropic.com',
  companyName: 'Anthropic',
  timeout: 15000, // 15 seconds per API
  skipCache: false,
});

console.log(results.apollo); // Apollo data
console.log(results.dataforseo); // DataForSEO data
console.log(results.wappalyzer); // Wappalyzer data
console.log(results.successCount); // How many APIs succeeded
console.log(results.totalCost); // Total API cost
console.log(results.totalDuration); // Total time in ms
```

## Environment Variables

Each client requires specific environment variables:

```bash
# Apollo.io
APOLLO_API_KEY=your-api-key-here

# DataForSEO (uses Basic Auth)
DATAFORSEO_LOGIN=your-login-here
DATAFORSEO_PASSWORD=your-password-here

# Wappalyzer
WAPPALYZER_API_KEY=your-api-key-here
```

See `.env.example` for complete list and documentation.

## Testing

Run the integration test script to verify all APIs are working:

```bash
node scripts/test-api-integrations.mjs
```

Test specific API:
```bash
node scripts/test-api-integrations.mjs --api=apollo
```

Test with custom domain:
```bash
node scripts/test-api-integrations.mjs --domain=openai.com
```

## Cost Monitoring

Track API costs to stay within budget:

```typescript
// DataForSEO tracks costs automatically
console.log(dataForSEOClient.getTotalCost()); // $5.23

// Wappalyzer tracks usage
console.log(wappalyzerClient.getLookupCount()); // 42

// Data aggregator provides total cost across all APIs
const results = await dataAggregator.aggregateAllData({...});
console.log(results.totalCost); // $7.68
```

## Phase 2 & 3 Integrations (Future)

### Phase 2: Priority Tier 2
- **Coresignal** (`coresignal-client.ts`) - Job posting analysis
- **Bright Data** (`bright-data-client.ts`) - Review intelligence
- **NewsAPI.ai** (`newsapi-client.ts`) - News monitoring

### Phase 3: Priority Tier 3
- **Social Media** (`social-media-client.ts`) - Twitter, LinkedIn, Facebook, YouTube
- **Financial** (`financial-client.ts`) - Financial Modeling Prep, Crunchbase

## Best Practices

1. **Always use singleton instances:**
   ```typescript
   import { apolloClient } from './integrations/apollo-client';
   // NOT: import ApolloClient from './integrations/apollo-client';
   ```

2. **Handle errors gracefully:**
   ```typescript
   try {
     const data = await apolloClient.getCompanyData(domain);
   } catch (error) {
     console.error('Apollo failed, but continue with other sources');
     // Don't let one API failure block entire process
   }
   ```

3. **Use data aggregation service instead of calling clients directly:**
   ```typescript
   // Good: Let aggregator handle parallel calls and errors
   const results = await dataAggregator.aggregateAllData({...});

   // Avoid: Manual parallel handling
   const [apollo, dataforseo, wappalyzer] = await Promise.all([...]);
   ```

4. **Cache aggressively:**
   - Data aggregator caches for 24 hours by default
   - Use `skipCache: true` only when necessary
   - Check cache hit rate: `dataAggregator.getCacheStats()`

5. **Monitor costs:**
   - Set budget alerts in API dashboards
   - Track costs in application: `results.totalCost`
   - Aim for < $110 per comprehensive analysis

6. **Respect rate limits:**
   - Clients handle rate limiting automatically
   - Don't make concurrent calls to same API (use data aggregator)
   - Monitor usage against quotas

## Troubleshooting

### "API key is required" Error
Ensure environment variables are set in `.env.local` and Netlify dashboard.

### "Timeout" Error
Increase timeout in aggregation config:
```typescript
await dataAggregator.aggregateAllData({
  ...config,
  timeout: 30000, // 30 seconds
});
```

### "Rate limit exceeded" Error
- Apollo.io: Wait until daily quota resets (100 req/day)
- Wappalyzer: Check monthly quota (5,000 lookups)
- DataForSEO: Should not hit limit (600 req/min), but check rate

### High API Costs
- Review caching strategy (is cache being used?)
- Reduce frequency of fresh analyses
- Consider lower-tier plans or alternative providers

## Support

For API-specific issues:
- Apollo.io: https://help.apollo.io/
- DataForSEO: https://dataforseo.com/support
- Wappalyzer: https://www.wappalyzer.com/support

For integration issues:
- Check `MASTER_IMPLEMENTATION_PLAN.md`
- Review test script output
- Consult `BUSINESS_INTELLIGENCE_STRATEGY.md`

---

**Last Updated:** January 2025
**Version:** 1.0 (Phase 1 Complete)
