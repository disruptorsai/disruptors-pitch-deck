# AI Presenter

**Professional presentation platform with AI-powered competitive analysis, token-based access control, and comprehensive analytics.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![Anthropic](https://img.shields.io/badge/Anthropic-000000?style=flat&logo=anthropic&logoColor=white)](https://www.anthropic.com/)

---

## Overview

AI Presenter is a modern, fully-featured presentation platform built for agencies and consultants who need to create secure, trackable pitch decks and client presentations. Originally built on Base44, it has been completely rewritten as a standalone TypeScript application with advanced features and no external dependencies.

### Key Features

- **Token-Based Access Control** - Secure, shareable links with expiration, view limits, and password protection
- **AI-Powered Analysis** - Generate competitive analysis and market insights using Claude 3.5
- **Comprehensive Analytics** - Track views, engagement, and user behavior with detailed reports
- **File Management** - Organized client file storage with Supabase Storage
- **Type-Safe Architecture** - Full TypeScript implementation with comprehensive type definitions
- **Performance Optimized** - Built-in caching, lazy loading, and prefetching
- **Error Resilient** - React Error Boundaries and comprehensive error handling
- **Production Ready** - Configured for Netlify deployment with environment templates

---

## Quick Start

Get started in 15 minutes:

```bash
# 1. Clone repository
git clone [your-repo-url]
cd ai-presenter

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Apply database migration
# Run the SQL migration in Supabase dashboard

# 5. Start development server
npm run dev
```

**Full setup guide:** [Quick Start Guide](./docs/QUICK_START.md)

---

## Documentation

- **[Quick Start Guide](./docs/QUICK_START.md)** - Get up and running in 15 minutes
- **[Migration Complete Guide](./docs/AI_PRESENTER_MIGRATION_COMPLETE.md)** - Comprehensive migration documentation
- **[API Reference](./docs/AI_PRESENTER_MIGRATION_COMPLETE.md#api-reference)** - Complete SDK documentation
- **[Deployment Guide](./docs/AI_PRESENTER_MIGRATION_COMPLETE.md#deployment-guide)** - Production deployment steps

---

## Tech Stack

### Core Technologies
- **Frontend:** Vite, React 18+, TypeScript
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **AI:** Anthropic Claude 3.5 Sonnet
- **Deployment:** Netlify
- **Styling:** Tailwind CSS

### Key Libraries
- `@supabase/supabase-js` - Database and authentication
- `@anthropic-ai/sdk` - AI-powered features
- React Error Boundaries - Error handling
- Custom hooks for data fetching

---

## Architecture

### Project Structure

```
ai-presenter/
├── docs/                                    # Documentation
│   ├── AI_PRESENTER_MIGRATION_COMPLETE.md  # Complete guide
│   └── QUICK_START.md                       # Quick start
├── src/
│   ├── lib/                                 # Core SDK and services
│   │   ├── ai-presenter-sdk.ts             # Main SDK
│   │   ├── ai-service.ts                   # AI integration
│   │   ├── storage-service.ts              # File storage
│   │   ├── analytics-service.ts            # Analytics
│   │   ├── supabase-client.ts              # Database client
│   │   └── types.ts                        # TypeScript types
│   ├── hooks/                               # React hooks
│   │   └── use-client.ts                   # Data fetching hooks
│   └── components/                          # React components
│       └── error-boundary.tsx              # Error handling
├── supabase/
│   └── migrations/                          # Database migrations
│       └── 20250113_ai_presenter_schema.sql
├── scripts/                                 # Utility scripts
│   └── migrate-from-base44.ts              # Migration tool
├── .env.example                             # Environment template
├── netlify.toml                             # Deployment config
└── package.json                             # Dependencies
```

### Database Schema

11 namespaced tables with Row Level Security:

```
✓ ai_presenter_clients              - Client records
✓ ai_presenter_access_links          - Access tokens
✓ ai_presenter_presentations         - Presentation configs
✓ ai_presenter_slides                - Slide content
✓ ai_presenter_services              - Service offerings
✓ ai_presenter_case_studies          - Case studies
✓ ai_presenter_competitive_analysis  - AI analysis
✓ ai_presenter_team_members          - Team profiles
✓ ai_presenter_analytics_events      - Analytics data
✓ ai_presenter_file_uploads          - File metadata
✓ ai_presenter_cache                 - Performance cache
```

---

## Usage Examples

### Create a Client

```typescript
import { adminSDK } from '@/lib/ai-presenter-sdk';

const client = await adminSDK.createClient({
  name: 'Acme Corporation',
  slug: 'acme-corp',
  description: 'Leading provider of innovative solutions',
  status: 'active',
});
```

### Generate Access Link

```typescript
const accessLink = await adminSDK.createAccessLink({
  client_id: client.id,
  name: 'Investor Preview',
  expires_at: '2025-12-31',
  max_views: 100,
  password: 'secure123', // Optional
});

console.log(`Access URL: https://your-domain.com/p/${accessLink.token}`);
```

### Generate AI Competitive Analysis

```typescript
const analysis = await adminSDK.generateCompetitiveAnalysis(
  client.id,
  {
    name: 'Acme Corp',
    industry: 'Enterprise SaaS',
    description: 'AI-powered workflow automation',
    competitors: ['Competitor A', 'Competitor B'],
  }
);

console.log(analysis.executive_summary);
console.log(analysis.unique_value_proposition);
```

---

## Environment Variables

Required configuration:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Anthropic AI (Required for AI features)
ANTHROPIC_API_KEY=your-anthropic-key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

**Full configuration:** See [.env.example](./.env.example)

---

## Deployment

### Netlify Deployment

```bash
# 1. Configure Netlify
# netlify.toml is already configured

# 2. Set environment variables in Netlify Dashboard
# Settings → Environment Variables → Add all from .env.example

# 3. Deploy
netlify deploy --prod

# Or connect GitHub repository for automatic deployments
```

### Database Setup

```sql
-- 1. Apply migration in Supabase SQL Editor
-- Run contents of: supabase/migrations/20250113_ai_presenter_schema.sql

-- 2. Create storage bucket
-- In Supabase Dashboard: Storage → Create Bucket
-- Name: ai-presenter-files
-- Public: false
```

**Complete deployment guide:** [Deployment Documentation](./docs/AI_PRESENTER_MIGRATION_COMPLETE.md#deployment-guide)

---

## Migration from Base44

Automated migration tool included:

```typescript
// Configure migration
const config: MigrationConfig = {
  clientSlug: 'your-client',
  clientName: 'Your Client Name',
  base44DataPath: 'api/entities.js',
};

// Run migration
npx ts-node scripts/migrate-from-base44.ts
```

**Migration guide:** [Migration Documentation](./docs/AI_PRESENTER_MIGRATION_COMPLETE.md)

---

## Development

### Available Scripts

```bash
npm run dev          # Start development server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linting
```

### Development Workflow

1. **Make changes** - Edit files in `src/`
2. **Test locally** - `npm run dev`
3. **Commit** - Git commit with descriptive message
4. **Deploy** - Push to main branch for automatic Netlify deployment

---

## Security

### Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use `.env.local` for development
   - Rotate keys regularly

2. **Access Control**
   - Generate unique tokens per recipient
   - Set expiration dates
   - Monitor view counts
   - Revoke compromised links

### Security Features

- ✅ Row Level Security (RLS) policies
- ✅ Token-based authentication
- ✅ Password protection (bcrypt)
- ✅ IP whitelisting
- ✅ View count limits
- ✅ Automatic token expiration
- ✅ Signed URLs for files
- ✅ HTTPS enforced

---

## Support

For support:

1. Check [Documentation](./docs/)
2. Review [Troubleshooting Guide](./docs/AI_PRESENTER_MIGRATION_COMPLETE.md#troubleshooting)
3. Contact development team

---

## Roadmap

### Phase 1: Foundation (Complete ✅)
- [x] Database schema
- [x] Custom SDK
- [x] Token-based auth
- [x] AI integration
- [x] Analytics tracking
- [x] File storage
- [x] Documentation

### Phase 2: Admin Interface (In Progress)
- [ ] Client management dashboard
- [ ] Access link generator
- [ ] Analytics dashboard
- [ ] File upload interface
- [ ] Content editor

### Phase 3: Enhancements
- [ ] PDF export
- [ ] Email notifications
- [ ] Custom branding
- [ ] Multi-language support

### Phase 4: Integrations
- [ ] Business Brain integration
- [ ] CRM integration
- [ ] Calendar integration
- [ ] Webhook support

---

**Version:** 1.0.0
**Last Updated:** January 13, 2025
**Status:** Production Ready ✅
