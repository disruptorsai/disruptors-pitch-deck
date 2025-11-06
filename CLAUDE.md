# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI Presenter** is a professional presentation platform built for agencies and consultants. It provides secure, token-based access control for pitch decks, AI-powered competitive analysis using Claude 3.5, and comprehensive analytics tracking. The application was migrated from Base44 to a standalone TypeScript/React application with Supabase backend.

**Tech Stack:**
- Frontend: Vite + React 18 + TypeScript
- Database: Supabase (PostgreSQL with RLS)
- AI: Anthropic Claude 3.5 Sonnet via @anthropic-ai/sdk
- State: TanStack React Query for data fetching
- Styling: Tailwind CSS + shadcn/ui components
- Deployment: Netlify with Serverless Functions

**Netlify Account Configuration:**
- **Account:** PRIMARY - DisruptorsAI (nfp_MnQi8ZEPrTaGqoT9TBdhba5k3BuDaQLBfb06)
- **Netlify Project ID:** `a6bdb6e3-1806-47a7-8af3-eb71e7e0c42d`
- **Site Name:** `aipresenterapp`
- **Site URL:** https://aipresenterapp.netlify.app
- **Admin URL:** https://app.netlify.com/sites/aipresenterapp/overview
- **Account Slug:** disruptorsai
- **IMPORTANT:** This repository uses the PRIMARY DisruptorsAI account ONLY. The secondary TechIntegrationLabs account is for a different project (disruptors-ai-marketing-hub).

## Essential Commands

```bash
# Development
npm run dev          # Start Vite dev server (default: http://localhost:5173)

# Production
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint on codebase

# Netlify Functions (Local Development)
netlify dev          # Run dev server with functions (port 8888)
netlify functions:list  # List all functions
netlify functions:invoke ai-service --data '{"action":"health"}'  # Test function
```

## Architecture Overview

### ⚡ Netlify Functions Architecture (CRITICAL)

This application uses **Netlify Serverless Functions** to keep all API keys secure on the server. **DO NOT expose API keys to the client-side code.**

**Functions Location:** `netlify/functions/`

**Available Functions:**
- `ai-service.js` - Claude API proxy for content generation, competitive analysis
- `business-analyzer.js` - Multi-AI orchestration (Claude + Grok + Twitter + Reddit + SerpAPI)
- `client-management.js` - Client CRUD operations
- `presentation-personalizer.js` - Dynamic content personalization
- `grok-service.js` - Grok 4 API integration for real-time X/web data
- `twitter-service.js` - Twitter/X API integration for social sentiment
- `reddit-service.js` - Reddit API integration for community insights
- `business-intelligence.js` - Business intelligence operations
- `health.js` - Health check endpoint

**Function Endpoints:** `/.netlify/functions/[function-name]`

**Example Usage:**
```typescript
// Client-side code calls Netlify Function
const response = await fetch('/.netlify/functions/ai-service', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generateCompetitiveAnalysis',
    payload: { name, industry, description, competitors }
  })
});

const result = await response.json();
```

### Core SDK Pattern
The application uses a **custom SDK wrapper** (`src/lib/ai-presenter-sdk.ts`) that abstracts all Supabase operations. This SDK provides:
- In-memory caching with configurable TTL
- Admin vs. public client modes
- Centralized error handling
- Type-safe database operations

**Always use the SDK instead of direct Supabase calls:**
```typescript
import { sdk, adminSDK } from '@/lib/ai-presenter-sdk';

// Public operations (uses anon key with RLS)
const client = await sdk.getClientBySlug('acme-corp');

// Admin operations (uses service role key, bypasses RLS)
const newClient = await adminSDK.createClient({ name: 'New Client', slug: 'new-client' });
```

### Service Layer Architecture
The SDK delegates to specialized services for specific functionality:

- **ai-service.ts** - Claude API integration (now proxied through Netlify Function)
- **storage-service.ts** - Supabase Storage file upload/download with signed URLs
- **analytics-service.ts** - Event tracking (page views, interactions)
- **business-analyzer.ts** - AI-powered business intelligence (proxied through Netlify Function)
- **presentation-personalizer.ts** - Dynamic content personalization

### Database Schema
All tables are namespaced with `ai_presenter_` prefix:

**Core Tables:**
- `ai_presenter_clients` - Client records with branding config
- `ai_presenter_access_links` - Token-based access control
- `ai_presenter_presentations` - Presentation configurations
- `ai_presenter_slides` - Slide content with ordering
- `ai_presenter_services` - Service offerings
- `ai_presenter_case_studies` - Portfolio case studies
- `ai_presenter_competitive_analysis` - AI-generated market analysis
- `ai_presenter_team_members` - Team profiles
- `ai_presenter_analytics_events` - Analytics tracking
- `ai_presenter_file_uploads` - File metadata for Supabase Storage
- `ai_presenter_cache` - Performance cache table

**Security:** All tables have Row Level Security (RLS) policies. Use `adminSDK` for admin operations that bypass RLS.

### Environment Variables

**CRITICAL:** This is a **Vite project with Netlify Functions**. Environment variable naming convention:

**Client-Side (Browser-Accessible) - Requires `VITE_` prefix:**
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Public anon key (has RLS restrictions)
- `VITE_APP_URL` - Application base URL
- `VITE_ANALYTICS_ENABLED` - Toggle analytics tracking
- `VITE_ELEVENLABS_API_KEY` - ElevenLabs voice AI (if needed client-side)
- `VITE_ELEVENLABS_AGENT_ID` - ElevenLabs agent ID

**Server-Side Only (Netlify Functions) - NO `VITE_` prefix:**
- `SUPABASE_SERVICE_ROLE_KEY` - Admin key (bypasses RLS, **NEVER expose to client**)
- `ANTHROPIC_API_KEY` - Claude API key for AI features
- `SERPAPI_KEY` - Web search API for business intelligence
- `FIRECRAWL_API_KEY` - Website scraping for business intelligence
- `BRAVE_API_KEY` - Fallback search API
- `XAI_API_KEY` - Grok 4 API key for real-time intelligence
- `TWITTER_API_KEY` - Twitter API credentials
- `TWITTER_API_SECRET` - Twitter API secret
- `TWITTER_BEARER_TOKEN` - Twitter bearer token
- `REDDIT_CLIENT_ID` - Reddit API credentials
- `REDDIT_CLIENT_SECRET` - Reddit API secret
- `REDDIT_USER_AGENT` - Reddit user agent string
- `DATAFORSEO_LOGIN` - DataForSEO credentials
- `DATAFORSEO_PASSWORD` - DataForSEO password
- `APOLLO_API_KEY` - Apollo.io API key
- `WAPPALYZER_API_KEY` - Technology detection API
- `NEWSAPI_AI_KEY` - News intelligence API

**Why This Matters:**
- Variables with `VITE_` prefix are bundled into client JavaScript (visible to anyone)
- Variables without `VITE_` prefix are ONLY available in Netlify Functions (server-side)
- **NEVER use `VITE_` prefix for sensitive API keys** - they would be exposed in browser

**Netlify Deployment:**
Set ALL environment variables in Netlify Dashboard:
- Site Settings → Environment Variables → Add variables
- Variables are automatically available to both client (if `VITE_`) and Netlify Functions

Copy `.env.example` to `.env.local` and configure for local development.

### Routing Architecture

**Router:** React Router v7 with nested routes

**Structure:**
- `/` - Public presentation pages (wrapped in `Layout.jsx`)
  - `/Home`, `/Dashboard`, `/Introduction`, `/Diagnostic`, etc.
- `/admin/*` - Admin interface (wrapped in `AdminLayout.jsx`)
  - `/admin` - Dashboard
  - `/admin/clients` - Client management
  - `/admin/clients/new` - Smart client creation form with AI analysis
  - `/admin/access-links` - Access link generator

**Routing configuration:** `src/pages/index.jsx`

**SPA Routing:** Netlify is configured to redirect all routes to `/index.html` (see `netlify.toml`)

### Component Organization

**Pages:** `src/pages/` - Full-page components
**UI Components:** `src/components/ui/` - shadcn/ui components (auto-generated, edit carefully)
**Feature Components:** `src/components/{diagnostic,blueprint,casestudies}/` - Page-specific components

**Custom Hooks:**
- `src/hooks/use-client.ts` - Client data fetching with React Query
- `src/hooks/use-mobile.jsx` - Responsive breakpoint detection

### Data Fetching Pattern

Use **React Query** for all async data operations:

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { sdk } from '@/lib/ai-presenter-sdk';

// Fetch data
const { data: client, isLoading, error } = useQuery({
  queryKey: ['client', slug],
  queryFn: () => sdk.getClientBySlug(slug),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Mutations
const createClientMutation = useMutation({
  mutationFn: (data) => adminSDK.createClient(data),
  onSuccess: () => {
    queryClient.invalidateQueries(['clients']);
  },
});
```

**React Query config:** `src/App.jsx` (5 min staleTime, 10 min cacheTime, no refetch on window focus)

## Key Implementation Details

### Access Control Flow
1. User receives access link with unique token: `/p/{token}`
2. Token validation via `adminSDK.validateAccessToken(token, password?)`
3. Validation checks: expiration, view limits, password hash, IP whitelist
4. Returns `ValidationResult` with `client_id` and `allowed_sections`
5. Client data fetched via `sdk.getClientBySlug()` (RLS enforces access)

### AI Competitive Analysis (via Netlify Function)
1. Client calls Netlify Function: `POST /.netlify/functions/ai-service`
2. Function validates request and calls Claude API server-side
3. Claude 3.5 Sonnet generates structured analysis (SWOT, competitors, market trends)
4. Result returned to client
5. Client saves to `ai_presenter_competitive_analysis` table via SDK

### Multi-AI Business Intelligence (via Netlify Function)
1. Client calls `POST /.netlify/functions/business-analyzer`
2. Function orchestrates 5 data sources in parallel:
   - Website content scraping (Firecrawl)
   - Real-time intelligence (Grok 4)
   - Social sentiment (Twitter/X API)
   - Community insights (Reddit API)
   - Contact extraction (regex patterns)
3. Claude Sonnet 4.5 synthesizes all data sources
4. Comprehensive business profile returned

### File Upload Pattern
```typescript
const fileUpload = await adminSDK.uploadFile(clientId, file, {
  entityType: 'case_study',
  entityId: caseStudyId,
  fileType: 'image',
});

// Returns: { id, storage_path, public_url, mime_type, ... }
```

Files stored in Supabase Storage bucket `ai-presenter-files` with signed URLs.

### Analytics Tracking
```typescript
await sdk.trackEvent({
  client_id: 'uuid',
  access_link_id: 'uuid',
  event_type: 'slide_view',
  event_data: { slide_id: 'uuid', slide_title: 'Introduction' },
  page_url: '/introduction',
  session_id: sessionId,
});
```

Automatically captured: IP, user agent, referrer, timestamp.

## Database Migrations

**Location:** `supabase/migrations/`

**Applied migrations:**
- `20250113_ai_presenter_schema.sql` - Core schema + RLS policies
- `20250113_sample_data.sql` - Demo data
- `20250114_add_pricing_tiers.sql` - Pricing functionality
- `20250114_add_comprehensive_client_intelligence.sql` - Enhanced client analytics

**Apply migrations:**
1. Log into Supabase Dashboard
2. SQL Editor → New Query
3. Paste migration SQL and run

**IMPORTANT:** Never modify tables directly. Always create new migration files with timestamp prefix.

## Deployment

**Platform:** Netlify

**Netlify Account & Project:**
- **Account:** PRIMARY - DisruptorsAI
- **Account Token:** nfp_MnQi8ZEPrTaGqoT9TBdhba5k3BuDaQLBfb06
- **Project ID:** `a6bdb6e3-1806-47a7-8af3-eb71e7e0c42d`
- **Site Name:** `aipresenterapp`
- **Site URL:** https://aipresenterapp.netlify.app
- **Dashboard:** https://app.netlify.com/sites/aipresenterapp/overview
- **GitHub Repo:** disruptorsai/disruptors-pitch-deck

**Build settings:**
- Command: `npm run build`
- Publish directory: `dist/` (Vite default output)
- Functions directory: `netlify/functions/`

**Environment variables:** Set all variables in Netlify dashboard under Site Settings → Environment Variables

**Deployment workflow:**
1. Push to main branch (auto-deploy enabled)
2. Or: `netlify deploy --prod` (uses primary account token)
3. Netlify builds `dist/` and deploys functions to `/.netlify/functions/`

**Build output:** Vite produces optimized SPA in `dist/` directory

**Functions deployment:** All `.js` files in `netlify/functions/` are automatically deployed as serverless functions

**⚠️ IMPORTANT - Account Authentication:**
When using Netlify CLI locally, ensure you're authenticated with the PRIMARY account:
```bash
# Set environment variable for primary account
export NETLIFY_AUTH_TOKEN=nfp_MnQi8ZEPrTaGqoT9TBdhba5k3BuDaQLBfb06

# Or use netlify login (will prompt browser login)
netlify login

# Verify you're on the correct account
netlify status
```

## Development Workflow

### Adding a New Page
1. Create page component in `src/pages/YourPage.jsx`
2. Add route in `src/pages/index.jsx`:
   - Import component
   - Add to `PAGES` object
   - Add `<Route>` in appropriate section (public or admin)
3. If admin page: Add to `AdminLayout` sidebar menu

### Adding a New Netlify Function
1. Create file in `netlify/functions/your-function.js`
2. Export `handler` function:
```javascript
export const handler = async (event, context) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  // Your logic here
  const { action, payload } = JSON.parse(event.body || '{}');

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ result: 'success' })
  };
};
```
3. Access environment variables: `process.env.YOUR_VAR_NAME` (no VITE_ prefix)
4. Test locally: `netlify dev`
5. Deploy: Functions auto-deploy with site

### Adding a New Database Table
1. Create migration file: `supabase/migrations/YYYYMMDD_description.sql`
2. Define table with `ai_presenter_` prefix
3. Add RLS policies (typically: public read if active, admin full access)
4. Add TypeScript types to `src/lib/types.ts`
5. Add SDK methods to `src/lib/ai-presenter-sdk.ts`
6. Apply migration in Supabase SQL Editor

### Working with shadcn/ui Components
**DO NOT manually edit** files in `src/components/ui/` - these are generated by shadcn CLI.

**To add new component:**
```bash
npx shadcn-ui@latest add [component-name]
```

**To customize:** Override styles in parent components using Tailwind classes.

### TypeScript + JavaScript Mix
The project uses both `.ts` and `.jsx` files. Vite handles this via `esbuildOptions` in `vite.config.js`:

```js
optimizeDeps: {
  esbuildOptions: {
    loader: { '.js': 'jsx' },
  },
},
```

**Prefer TypeScript** for new files, especially in `src/lib/` and services.

## Common Patterns

### Path Aliases
Use `@/` for `src/` imports:
```typescript
import { sdk } from '@/lib/ai-presenter-sdk';
import { Button } from '@/components/ui/button';
```

Configured in `vite.config.js` and `jsconfig.json`.

### Error Boundaries
The application has a global error boundary in `src/components/error-boundary.tsx`. Use for catching React errors:

```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <YourComponent />
</ErrorBoundary>
```

### Caching Strategy
SDK uses in-memory cache (5 min TTL default). Invalidate on mutations:

```typescript
// In SDK method after mutation
this.invalidateCache('client'); // Invalidates all keys containing 'client'
```

For database-level caching, use `ai_presenter_cache` table via SDK.

## Calling Netlify Functions from Client

**Pattern:**
```typescript
// Generic function caller
async function callNetlifyFunction(functionName: string, data: any) {
  const response = await fetch(`/.netlify/functions/${functionName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Function ${functionName} failed: ${response.status}`);
  }

  return response.json();
}

// Usage examples
const analysis = await callNetlifyFunction('ai-service', {
  action: 'generateCompetitiveAnalysis',
  payload: { name, industry, description, competitors }
});

const businessData = await callNetlifyFunction('business-analyzer', {
  action: 'analyzeWebsite',
  payload: { url, businessName }
});
```

## Migration from Base44

This project was migrated from Base44. Migration artifacts:
- `scripts/migrate-from-base44.ts` - Automated migration script
- `docs/AI_PRESENTER_MIGRATION_COMPLETE.md` - Complete migration guide
- `MIGRATION_SUMMARY.md` - Migration summary

**Note:** No Base44 dependencies remain. All SDK functionality is custom-built.

## Testing

**No test suite currently implemented.** When adding tests:
- Use Vitest (compatible with Vite)
- Place tests adjacent to source files: `ComponentName.test.tsx`
- Mock Supabase calls using `vi.mock()`
- Mock Netlify Functions in tests

## Security Considerations

1. **Never expose service role key client-side** - Only use in Netlify Functions
2. **Never expose API keys client-side** - Use Netlify Functions as proxy
3. **RLS policies** enforce data access - Always test with anon key (public SDK)
4. **Password hashing** uses bcrypt for access link passwords
5. **Token generation** via Postgres function `ai_presenter_generate_access_token`
6. **Signed URLs** for file downloads (expires after configured time)
7. **IP whitelisting** supported on access links
8. **CORS configured** in Netlify Functions for secure cross-origin requests

## Known Gotchas

1. **Vite env vars:** Must use `VITE_` prefix for client-side access, NO prefix for server-side
2. **API keys:** NEVER use `VITE_` prefix for API keys - they would be exposed to browser
3. **Netlify Functions:** All API calls to external services must go through functions
4. **Netlify build:** Ensure `dist/` is published, not `out/` (configured in netlify.toml)
5. **Supabase RLS:** Public client (`sdk`) respects RLS, admin client (`adminSDK`) bypasses it
6. **React Query caching:** Remember to invalidate queries after mutations
7. **shadcn/ui:** Don't manually edit generated components - override with Tailwind classes instead
8. **Path aliases:** VSCode may not autocomplete `@/` imports - ensure jsconfig.json is loaded
9. **Function endpoints:** Always use `/.netlify/functions/` prefix when calling from client

## Netlify-Specific Configuration

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Functions package.json:** `netlify/functions/package.json`
- Declares `"type": "module"` for ES6 imports
- Functions share dependencies with main project

## Documentation

- **Quick Start:** `docs/QUICK_START.md`
- **Complete Guide:** `docs/AI_PRESENTER_MIGRATION_COMPLETE.md`
- **Migration Info:** `MIGRATION_SUMMARY.md`
- **Environment Setup:** `.env.example`
- **README:** `README.md` (overview, setup, deployment)
- **Netlify Functions:** See `netlify/functions/` directory for function-specific docs

## Common Tasks

### Testing a Netlify Function Locally
```bash
# Start Netlify Dev server (includes functions)
netlify dev

# Test health endpoint
curl http://localhost:8888/.netlify/functions/health

# Test AI service
curl -X POST http://localhost:8888/.netlify/functions/ai-service \
  -H "Content-Type: application/json" \
  -d '{"action":"health"}'
```

### Debugging Netlify Functions
1. Check Netlify function logs: Dashboard → Functions → [function-name] → Logs
2. Add console.log statements (visible in Netlify logs)
3. Test locally with `netlify dev`
4. Check environment variables are set in Netlify Dashboard

### Updating Environment Variables
1. Local: Update `.env.local`
2. Netlify: Dashboard → Site Settings → Environment Variables
3. After changing in Netlify: Trigger new deploy or use "Clear cache and deploy site"
