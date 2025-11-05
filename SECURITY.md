# Security Architecture

## Overview

AI Presenter implements a **secure-by-default** architecture that prevents sensitive API keys from being exposed to the browser. All privileged operations (admin, AI) are handled server-side through Netlify Functions.

## Security Principles

### 1. **Never Expose Sensitive Keys Client-Side**

❌ **WRONG** (Old approach - INSECURE):
```typescript
// DON'T DO THIS - Exposes API key in browser bundle
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,  // ❌ VITE_ prefix = exposed!
  dangerouslyAllowBrowser: true,
});
```

✅ **CORRECT** (New approach - SECURE):
```typescript
// Server-side Netlify Function (netlify/functions/ai-service.js)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,  // ✅ No VITE_ prefix = server-only
});

// Client-side code calls the secure endpoint
const response = await fetch('/.netlify/functions/ai-service', {
  method: 'POST',
  body: JSON.stringify({ action: 'generateAnalysis', payload: data }),
});
```

### 2. **Environment Variable Naming Convention**

**Client-Side Variables (Safe to Expose):**
- Prefix: `VITE_*`
- Bundled into browser JavaScript
- Visible in DevTools and source code
- Examples:
  - `VITE_SUPABASE_URL` ✅
  - `VITE_SUPABASE_ANON_KEY` ✅ (public key with RLS restrictions)

**Server-Side Variables (Must Keep Secret):**
- Prefix: NO PREFIX or non-VITE prefix
- Only accessible in Netlify Functions (server-side)
- Never bundled into browser code
- Examples:
  - `SUPABASE_SERVICE_ROLE_KEY` ✅
  - `ANTHROPIC_API_KEY` ✅
  - `SERPAPI_KEY` ✅

### 3. **Netlify Functions Architecture**

All sensitive operations are handled by Netlify Functions:

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Browser   │────────▶│ Netlify Function │────────▶│ External API    │
│  (Client)   │         │   (Server-Side)  │         │ (Anthropic,     │
│             │◀────────│                  │◀────────│  Supabase, etc) │
└─────────────┘         └──────────────────┘         └─────────────────┘
   No API keys          Has API keys                 Protected by
   exposed here         (secure)                     server-side auth
```

## Netlify Functions

### 1. **AI Service** (`/.netlify/functions/ai-service`)

Handles all Anthropic Claude API calls for AI features.

**Actions:**
- `generateCompetitiveAnalysis` - Generate competitive market analysis
- `generatePitchContent` - Generate pitch deck content
- `enhanceContent` - Enhance existing content with AI
- `generateMetaDescription` - Generate SEO meta descriptions

**Usage:**
```typescript
import { aiService } from '@/lib/ai-service';

const analysis = await aiService.generateCompetitiveAnalysis({
  name: 'Acme Corp',
  industry: 'SaaS',
  description: 'B2B productivity software',
  competitors: ['Competitor A', 'Competitor B'],
});
```

### 2. **Client Management** (`/.netlify/functions/client-management`)

Handles admin operations using Supabase service role key.

**Actions:**
- `create` - Create new client
- `update` - Update client details
- `delete` - Delete client
- `get` - Get client by ID or slug
- `list` - List all clients

**Usage:**
```typescript
const response = await fetch('/.netlify/functions/client-management', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'create',
    payload: {
      name: 'New Client',
      slug: 'new-client',
      industry: 'Technology',
      // ... other fields
    },
  }),
});

const client = await response.json();
```

### 3. **Presentation Personalizer** (`/.netlify/functions/presentation-personalizer`)

Handles AI-powered slide personalization.

**Actions:**
- `personalizeHero` - Hero slide personalization
- `personalizeBlueprint` - Blueprint slide personalization
- `personalizeDiagnostic` - Diagnostic slide personalization
- `personalizeIntroduction` - Introduction slide personalization
- `personalizeCapabilities` - Capabilities slide personalization
- `personalizeCaseStudies` - Case studies slide personalization
- `personalizeTheProblem` - Problem slide personalization
- `personalizeWhyAI` - Why AI slide personalization

**Usage:**
```typescript
import { personalizeHero } from '@/lib/presentation-personalizer-secure';

const heroContent = await personalizeHero(clientData, companyIntelligence);
```

### 4. **Business Analyzer** (`/.netlify/functions/business-analyzer`)

Handles business intelligence gathering with web search APIs.

## Client-Side Code Changes

### Before (Insecure):
```typescript
// src/lib/supabase-client.ts
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY; // ❌
export const supabaseAdmin = createClient(url, supabaseServiceRoleKey); // ❌
```

### After (Secure):
```typescript
// src/lib/supabase-client.ts
// Service role key NO LONGER exposed client-side
// All admin operations use Netlify Functions

/**
 * @deprecated Use Netlify Functions for admin operations
 */
export const supabaseAdmin = supabase; // Returns anon client (safe)
```

## Environment Variable Setup

### Local Development (`.env.local`):

```bash
# Client-side (will be bundled)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Server-side (Netlify Functions only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
ANTHROPIC_API_KEY=sk-ant-...
SERPAPI_KEY=your-key...
FIRECRAWL_API_KEY=your-key...
```

### Netlify Deployment:

1. Go to **Site Settings → Environment Variables**
2. Add ALL variables (both `VITE_*` and server-side):

```
VITE_SUPABASE_URL          = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY     = eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY  = eyJhbGc...
ANTHROPIC_API_KEY          = sk-ant-...
SERPAPI_KEY                = your-key...
FIRECRAWL_API_KEY          = your-key...
```

3. **Trigger Deploy** → Clear cache and deploy

## Security Checklist

- [x] ✅ Anthropic API key never exposed client-side
- [x] ✅ Supabase service role key never exposed client-side
- [x] ✅ All AI operations use Netlify Functions
- [x] ✅ All admin operations use Netlify Functions
- [x] ✅ Environment variables properly prefixed (VITE_ vs no prefix)
- [x] ✅ `supabaseAdmin` deprecated with safe fallback
- [x] ✅ Client-side code only has anon key (RLS protected)
- [x] ✅ Documentation updated with security best practices

## Migration Guide

### For Developers Using Old Code:

1. **Replace direct `supabaseAdmin` calls:**

   ```typescript
   // OLD (insecure):
   import { supabaseAdmin } from '@/lib/supabase-client';
   await supabaseAdmin.from('clients').insert(data);

   // NEW (secure):
   const response = await fetch('/.netlify/functions/client-management', {
     method: 'POST',
     body: JSON.stringify({ action: 'create', payload: data }),
   });
   ```

2. **Replace direct Anthropic calls:**

   ```typescript
   // OLD (insecure):
   import Anthropic from '@anthropic-ai/sdk';
   const anthropic = new Anthropic({ apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY });

   // NEW (secure):
   import { aiService } from '@/lib/ai-service';
   await aiService.generateCompetitiveAnalysis(data);
   ```

3. **Update environment variables:**

   - Remove `VITE_` prefix from `VITE_SUPABASE_SERVICE_ROLE_KEY` → `SUPABASE_SERVICE_ROLE_KEY`
   - Remove `VITE_` prefix from `VITE_ANTHROPIC_API_KEY` → `ANTHROPIC_API_KEY`
   - Update Netlify environment variables

## Testing Security

### Verify No Secrets in Build:

```bash
npm run build
grep -r "ANTHROPIC_API_KEY" dist/  # Should return nothing
grep -r "SERVICE_ROLE_KEY" dist/  # Should return nothing
```

### Verify Netlify Functions Work:

```bash
# Test AI service
curl -X POST https://your-site.netlify.app/.netlify/functions/ai-service \
  -H "Content-Type: application/json" \
  -d '{"action":"health"}'

# Should return: {"status":"ok","timestamp":"...","hasApiKey":true}
```

## Support

For security concerns or questions, see:
- This document (SECURITY.md)
- `.env.example` for variable naming
- `netlify/functions/` for function implementations
- README.md for general setup

**Remember: Never commit `.env.local` to git!**
