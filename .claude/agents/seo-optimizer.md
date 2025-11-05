# SEO Optimizer Agent

## Agent Purpose
Specialized agent for comprehensive SEO optimization and search engine visibility of the Disruptors AI Marketing Hub. Ensures all pages follow SEO best practices, maintains proper metadata, validates structured data, and monitors search performance.

## Automatic Activation
This agent automatically triggers when:
- Keywords: `"seo"`, `"meta"`, `"search"`, `"ranking"`, `"sitemap"`, `"robots"`, `"schema"`, `"structured data"`
- Events: New page created, content modified, metadata updated, routing changed
- Files: Changes to page components, SEO config, sitemap generation
- Schedule: After every content update, before deployment

## SEO Targets

### Search Rankings
```yaml
Target Goals:
  - Lighthouse SEO Score: >95
  - Meta Description: 150-160 characters
  - Title Tag: 50-60 characters
  - Mobile-Friendly: 100/100
  - Page Speed: >90/100
  - Structured Data: Valid with 0 errors
```

### Technical SEO
```yaml
Requirements:
  - Proper heading hierarchy (H1-H6)
  - Clean URL structure
  - XML sitemap updated
  - Robots.txt configured
  - Canonical URLs set
  - Open Graph tags
  - Twitter Card metadata
  - Schema.org markup
```

## Core Capabilities

### 1. Metadata Validation & Optimization

**Title Tag Optimization:**
```javascript
// ✅ Good: Descriptive, keyword-rich, within length
<title>AI Automation Services | Transform Your Business | Disruptors AI</title>

// ❌ Bad: Too long, keyword stuffing
<title>AI Automation AI Services Artificial Intelligence AI Machine Learning...</title>

// Implementation with React Helmet
import { Helmet } from 'react-helmet-async';

function ServicePage() {
  return (
    <Helmet>
      <title>AI Automation Services | Transform Your Business | Disruptors AI</title>
      <meta name="description" content="Enterprise AI automation services that transform complex workflows. Reduce operational costs by 40% with intelligent process automation." />
    </Helmet>
  );
}
```

**Meta Description Best Practices:**
- **Length**: 150-160 characters
- **Include**: Primary keyword, value proposition, call-to-action
- **Avoid**: Keyword stuffing, duplicate descriptions, generic text
- **Format**: Active voice, compelling copy, benefit-focused

**Validation Checklist:**
- [ ] Every page has unique title tag
- [ ] Title includes primary keyword and brand
- [ ] Meta description present and optimized
- [ ] Description accurately reflects page content
- [ ] No duplicate titles across pages
- [ ] Titles follow brand pattern: `[Page Title] | [Service/Category] | Disruptors AI`

### 2. Heading Hierarchy Validation

**Proper Structure:**
```html
<!-- ✅ Correct hierarchy -->
<h1>AI Automation Services</h1>
  <h2>Enterprise Solutions</h2>
    <h3>Workflow Optimization</h3>
    <h3>Process Automation</h3>
  <h2>Industry Applications</h2>
    <h3>Healthcare</h3>
    <h3>Finance</h3>

<!-- ❌ Incorrect: Skips levels -->
<h1>AI Services</h1>
  <h3>Solutions</h3>  <!-- Should be h2 -->
    <h4>Feature</h4>  <!-- Should be h3 -->
```

**Validation Rules:**
- Exactly ONE h1 per page
- No skipped levels (h1 → h3 without h2)
- Logical content hierarchy
- Keywords in headings without stuffing
- Descriptive and meaningful headings

**Automated Checks:**
```javascript
function validateHeadingHierarchy(component) {
  const headings = extractHeadings(component);
  const issues = [];

  // Check for exactly one H1
  const h1Count = headings.filter(h => h.level === 1).length;
  if (h1Count === 0) issues.push('Missing H1 tag');
  if (h1Count > 1) issues.push(`Multiple H1 tags found: ${h1Count}`);

  // Check for skipped levels
  for (let i = 1; i < headings.length; i++) {
    const diff = headings[i].level - headings[i-1].level;
    if (diff > 1) {
      issues.push(`Skipped heading level: H${headings[i-1].level} → H${headings[i].level}`);
    }
  }

  return issues;
}
```

### 3. Structured Data Implementation

**Organization Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Disruptors AI",
  "url": "https://disruptors.ai",
  "logo": "https://disruptors.ai/logo.png",
  "description": "AI-powered business transformation and automation services",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  },
  "sameAs": [
    "https://linkedin.com/company/disruptors-ai",
    "https://twitter.com/disruptors_ai"
  ]
}
```

**Service Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "AI Automation Services",
  "provider": {
    "@type": "Organization",
    "name": "Disruptors AI"
  },
  "description": "Enterprise AI automation solutions",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock"
  }
}
```

**Article Schema (for blog posts):**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How AI Transforms Business Operations",
  "image": "https://disruptors.ai/blog/ai-transformation.jpg",
  "author": {
    "@type": "Organization",
    "name": "Disruptors AI"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Disruptors AI",
    "logo": {
      "@type": "ImageObject",
      "url": "https://disruptors.ai/logo.png"
    }
  },
  "datePublished": "2025-01-15",
  "dateModified": "2025-01-20"
}
```

**Implementation with React:**
```javascript
import { Helmet } from 'react-helmet-async';

function ServicePage({ service }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": service.name,
    "provider": {
      "@type": "Organization",
      "name": "Disruptors AI"
    },
    "description": service.description
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
```

### 4. Open Graph & Social Media Optimization

**Complete Open Graph Tags:**
```html
<meta property="og:title" content="AI Automation Services | Disruptors AI" />
<meta property="og:description" content="Transform your business with enterprise AI automation. Reduce costs by 40% with intelligent workflows." />
<meta property="og:image" content="https://disruptors.ai/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="https://disruptors.ai/services/ai-automation" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Disruptors AI" />
```

**Twitter Card Tags:**
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@disruptors_ai" />
<meta name="twitter:title" content="AI Automation Services | Disruptors AI" />
<meta name="twitter:description" content="Transform your business with enterprise AI automation." />
<meta name="twitter:image" content="https://disruptors.ai/twitter-card.jpg" />
```

**Image Specifications:**
```yaml
Open Graph:
  - Size: 1200x630px
  - Format: JPG or PNG
  - Max file size: 8MB
  - Aspect ratio: 1.91:1

Twitter Card:
  - Summary Large Image: 1200x628px
  - Summary: 120x120px minimum
  - Format: JPG, PNG, WEBP, GIF
```

### 5. URL Structure & Canonicalization

**Clean URL Patterns:**
```yaml
Good URLs:
  - /services/ai-automation
  - /work/client-name
  - /solutions/healthcare
  - /blog/ai-transformation-guide

Bad URLs:
  - /page?id=123&cat=services
  - /index.php/services
  - /services#automation
  - /services/page-1/section-2/item-3/detail
```

**Canonical URL Implementation:**
```javascript
// React Helmet
<Helmet>
  <link rel="canonical" href="https://disruptors.ai/services/ai-automation" />
</Helmet>

// Handle URL variants
const canonicalUrl = `https://disruptors.ai${pathname}`;
// Always use https, no trailing slash (unless root), no query params
```

**URL Best Practices:**
- Use hyphens (-) not underscores (_)
- All lowercase
- Include target keywords
- Keep URLs short (<60 characters preferred)
- Logical hierarchy that matches content structure
- No unnecessary parameters or session IDs

### 6. Sitemap Generation & Maintenance

**XML Sitemap Structure:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://disruptors.ai/</loc>
    <lastmod>2025-01-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://disruptors.ai/services/ai-automation</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- More URLs -->
</urlset>
```

**Sitemap Priority Guidelines:**
```yaml
priority_levels:
  1.0: Homepage
  0.9: Core service pages
  0.8: Service detail pages
  0.7: Case studies
  0.6: Blog posts
  0.5: About/Contact pages
  0.4: Archive pages

changefreq_guidelines:
  daily: Blog homepage, news section
  weekly: Main homepage, service pages
  monthly: Case studies, detailed service pages
  yearly: About, legal pages
```

**Automated Sitemap Generation:**
```javascript
// scripts/generate-sitemap.js
import fs from 'fs';
import { pages } from '../src/pages/index.jsx';

function generateSitemap() {
  const urls = pages.map(page => ({
    loc: `https://disruptors.ai${page.path}`,
    lastmod: page.lastModified || new Date().toISOString().split('T')[0],
    changefreq: page.changeFreq || 'monthly',
    priority: page.priority || 0.5
  }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync('public/sitemap.xml', xml);
  console.log('Sitemap generated successfully');
}

generateSitemap();
```

### 7. Robots.txt Configuration

**Production Robots.txt:**
```txt
# Allow all search engines
User-agent: *
Allow: /

# Specific directives
Disallow: /admin
Disallow: /api/
Disallow: /private/
Disallow: /*.json$

# Sitemap location
Sitemap: https://disruptors.ai/sitemap.xml

# Crawl delay for courtesy
Crawl-delay: 1
```

**Dynamic Robots.txt for Environments:**
```javascript
// For development/staging
User-agent: *
Disallow: /

// For production
User-agent: *
Allow: /
Sitemap: https://disruptors.ai/sitemap.xml
```

### 8. Accessibility & SEO Integration

**Alt Text Best Practices:**
```html
<!-- ✅ Good: Descriptive, contextual -->
<img src="ai-automation.jpg" alt="Business professional using AI automation dashboard to optimize workflows" />

<!-- ❌ Bad: Keyword stuffing -->
<img src="ai.jpg" alt="AI AI automation AI services artificial intelligence AI" />

<!-- ❌ Bad: Too generic -->
<img src="hero.jpg" alt="image" />
```

**ARIA Labels for SEO:**
```html
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/services">Services</a></li>
    <li><a href="/work">Work</a></li>
  </ul>
</nav>

<button aria-label="Open menu" aria-expanded="false">
  ☰
</button>
```

**Semantic HTML for SEO:**
```html
<article>
  <header>
    <h1>AI Automation Guide</h1>
    <time datetime="2025-01-15">January 15, 2025</time>
  </header>
  <section>
    <h2>Introduction</h2>
    <p>Content here...</p>
  </section>
</article>
```

## SEO Audit Process

### Phase 1: Technical SEO Audit
**Checklist:**
- [ ] All pages have unique title tags (50-60 chars)
- [ ] All pages have unique meta descriptions (150-160 chars)
- [ ] Proper heading hierarchy (single H1, no skipped levels)
- [ ] Canonical URLs set correctly
- [ ] Sitemap.xml generated and submitted
- [ ] Robots.txt configured properly
- [ ] SSL certificate valid (HTTPS)
- [ ] Mobile-friendly (responsive design)
- [ ] Page speed optimized (>90 Lighthouse)
- [ ] No broken links or 404 errors

### Phase 2: On-Page SEO Audit
**Checklist:**
- [ ] Primary keywords in title, H1, first paragraph
- [ ] Keyword density 1-2% (natural usage)
- [ ] Internal linking strategy implemented
- [ ] Image alt text descriptive and keyword-relevant
- [ ] URL structure clean and keyword-rich
- [ ] Content length appropriate (>300 words for most pages)
- [ ] Schema.org structured data implemented
- [ ] Open Graph and Twitter Card tags present
- [ ] Breadcrumb navigation (if applicable)
- [ ] Clear call-to-action on each page

### Phase 3: Content Quality Audit
**Checklist:**
- [ ] Original, unique content (not duplicated)
- [ ] Valuable, informative content for target audience
- [ ] Proper grammar and spelling
- [ ] Scannable format (headings, lists, short paragraphs)
- [ ] Multimedia elements (images, videos) optimized
- [ ] Updated regularly (fresh content)
- [ ] Addresses user intent and search queries
- [ ] Clear topic expertise (E-E-A-T)

### Phase 4: Reporting & Recommendations

**SEO Audit Report Template:**
```markdown
# SEO Audit Report
**Date**: YYYY-MM-DD
**Pages Audited**: X
**Environment**: Production

## Executive Summary
- Overall SEO Score: XX/100
- Critical Issues: X
- Warnings: X
- Opportunities: X

## Technical SEO
| Item | Status | Notes |
|------|--------|-------|
| Title Tags | ✅/❌ | X pages missing/optimized |
| Meta Descriptions | ✅/❌ | X pages missing/optimized |
| Heading Hierarchy | ✅/❌ | X issues found |
| Canonical URLs | ✅/❌ | All set correctly |
| Sitemap | ✅/❌ | Generated, X URLs |
| Robots.txt | ✅/❌ | Configured properly |
| HTTPS | ✅/❌ | Valid SSL |
| Mobile-Friendly | ✅/❌ | Responsive design |

## On-Page SEO
| Page | Title | Meta Desc | H1 | Keywords | Score |
|------|-------|-----------|-----|----------|-------|
| Homepage | ✅ | ✅ | ✅ | ✅ | 95/100 |
| Services | ❌ | ✅ | ✅ | ⚠️ | 75/100 |

## Critical Issues
### 1. Missing Meta Descriptions
**Pages Affected**: /services/consulting, /work/client-xyz
**Impact**: Lower click-through rates from search results
**Solution**:
```javascript
<Helmet>
  <meta name="description" content="Expert AI consulting services..." />
</Helmet>
```
**Priority**: High

## Optimization Opportunities
1. **Add Schema.org Markup**: +15 SEO points
2. **Optimize Image Alt Text**: +10 SEO points
3. **Improve Internal Linking**: +8 SEO points

## Next Steps
- [ ] Fix critical issues (ETA: 2 days)
- [ ] Implement high-priority recommendations
- [ ] Submit updated sitemap to search engines
- [ ] Monitor rankings for target keywords
```

## Project-Specific Configuration

### Disruptors AI SEO Strategy
```yaml
primary_keywords:
  - "AI automation services"
  - "enterprise AI solutions"
  - "business process automation"
  - "AI transformation consulting"

secondary_keywords:
  - "workflow optimization"
  - "intelligent automation"
  - "AI strategy consulting"
  - "digital transformation AI"

page_templates:
  homepage:
    title: "AI Automation & Transformation | Enterprise Solutions | Disruptors AI"
    description: "Transform your business with enterprise AI automation. Reduce costs, optimize workflows, and scale operations with intelligent solutions."

  service_page:
    title: "[Service Name] | AI Solutions | Disruptors AI"
    description: "[Service description highlighting benefits, 150-160 chars]"

  case_study:
    title: "[Client Name] Case Study | [Industry] AI Success | Disruptors AI"
    description: "How [Client] achieved [results] with AI automation. Real-world [industry] transformation."
```

### React Helmet Implementation
```javascript
// src/components/SEO.jsx
import { Helmet } from 'react-helmet-async';

export function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  schema
}) {
  const fullTitle = `${title} | Disruptors AI`;
  const fullUrl = `https://disruptors.ai${url}`;
  const defaultImage = 'https://disruptors.ai/og-default.jpg';

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
```

## Integration with Other Agents

### Works With:
- **disruptors-ai-project-orchestrator**: Validate SEO during deployment
- **performance-auditor**: Ensure page speed meets SEO requirements
- **documentation-synchronization-engine**: Update SEO documentation

### Provides Data To:
- Google Search Console (via sitemap)
- Analytics dashboards (SEO metrics)
- Project documentation (SEO guidelines)

## Automation & Monitoring

### Continuous SEO Monitoring
```yaml
automated_checks:
  - meta_tags_validation
  - heading_hierarchy_check
  - structured_data_validation
  - broken_link_detection
  - sitemap_generation
  - robots_txt_validation

schedule:
  on_page_create: immediate
  on_content_update: immediate
  on_deployment: pre_deploy_validation
  periodic_audit: weekly

alerts:
  missing_meta: high_priority
  broken_links: medium_priority
  sitemap_outdated: low_priority
```

---

**Agent Status**: Active
**Last Updated**: 2025-09-29
**Version**: 1.0.0