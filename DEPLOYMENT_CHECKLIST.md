# Deployment Checklist

Quick reference checklist for deploying Disruptors AI Pitch Deck to Netlify.

## Pre-Deployment

- [ ] Code builds successfully locally (`npm run build`)
- [ ] No TypeScript errors
- [ ] All environment variables documented in `.env.example`
- [ ] No secrets committed to repository
- [ ] Database migrations ready to run

## Netlify Configuration

### Environment Variables

- [ ] `VITE_SUPABASE_URL` set
- [ ] `VITE_SUPABASE_ANON_KEY` set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set (NO VITE_ prefix)
- [ ] `ANTHROPIC_API_KEY` set (NO VITE_ prefix)
- [ ] `VITE_ELEVENLABS_API_KEY` set (optional)
- [ ] `VITE_ELEVENLABS_AGENT_ID` set (optional)

### Build Settings

- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Functions directory: `netlify/functions`
- [ ] Node version: 18

## Database Setup

- [ ] Supabase project created
- [ ] Schema migration run (`20250113_ai_presenter_schema.sql`)
- [ ] RLS policies applied (`20250117_add_public_read_policy_clean.sql`)
- [ ] Demo data loaded (`20251020_disruptors_healthcare_data_CORRECTED.sql`)
- [ ] Slides populated (`20250117_populate_slides.sql`)
- [ ] Demo client exists (slug: `disruptors-media-demo`)
- [ ] 9 slides exist for demo client

## Post-Deployment Verification

### Health Check

- [ ] Visit `/.netlify/functions/health`
- [ ] Status is "healthy"
- [ ] All required variables show as `true`

### Public Pages

- [ ] Homepage loads without errors
- [ ] Presentation viewer accessible (`/p/disruptors-media-demo`)
- [ ] All 9 slides display correctly
- [ ] Navigation between slides works
- [ ] Images and assets load
- [ ] No JavaScript console errors

### Admin Pages

- [ ] Admin dashboard accessible (`/admin`)
- [ ] Clients list loads (`/admin/clients`)
- [ ] Can view all client statuses (draft, active, archived)
- [ ] Client creation form works (`/admin/clients/new`)
- [ ] Can edit existing clients
- [ ] Can delete clients

### Netlify Functions

- [ ] Check Function logs for errors
- [ ] `client-management` function works
- [ ] `ai-service` function available
- [ ] `business-analyzer` function available
- [ ] `health` function returns 200 OK

### Optional Features

- [ ] DisruptorBot AI assistant loads (if ElevenLabs configured)
- [ ] Voice conversation works
- [ ] AI competitive analysis generates
- [ ] Business intelligence tools work

## Performance Checks

- [ ] Lighthouse score > 90 (Performance)
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] No console errors or warnings
- [ ] All assets optimized and cached

## Security Verification

- [ ] Service role key NOT exposed in browser
- [ ] Anthropic API key NOT exposed in browser
- [ ] RLS policies active on all tables
- [ ] CORS headers properly configured
- [ ] No sensitive data in error messages

## Monitoring Setup

- [ ] Netlify Analytics enabled (optional)
- [ ] Error tracking configured (optional)
- [ ] Uptime monitoring set up (optional)
- [ ] Deploy notifications configured

## Documentation

- [ ] README updated with deployment info
- [ ] DEPLOYMENT_VALIDATION_REPORT.md reviewed
- [ ] NETLIFY_DEPLOYMENT_GUIDE.md available
- [ ] Environment variables documented
- [ ] Known issues documented

## Rollback Plan

- [ ] Previous working deployment identified
- [ ] Rollback procedure tested
- [ ] Database backup available
- [ ] Can revert environment variables if needed

---

## Quick Fix Commands

### Clear Netlify Cache
```bash
# Via Netlify Dashboard
Deploys > Trigger deploy > Clear cache and deploy site
```

### Verify Database
```sql
-- Check demo client exists
SELECT id, name, slug, status
FROM ai_presenter_clients
WHERE slug = 'disruptors-media-demo';

-- Check slides exist
SELECT COUNT(*) as slide_count
FROM ai_presenter_slides s
JOIN ai_presenter_presentations p ON s.presentation_id = p.id
JOIN ai_presenter_clients c ON p.client_id = c.id
WHERE c.slug = 'disruptors-media-demo';
```

### Test Health Endpoint
```bash
curl https://your-site.netlify.app/.netlify/functions/health
```

---

**Last Updated**: 2025-10-20
**Version**: 1.0
