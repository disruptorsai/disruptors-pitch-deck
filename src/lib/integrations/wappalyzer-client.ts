/**
 * Wappalyzer API Client
 *
 * Detects technologies used on websites including CMS, frameworks, analytics tools,
 * marketing automation, and more.
 *
 * Rate Limits: No hard limit, quota-based (5,000 lookups/month on Startup plan)
 * Pricing: $250/month (Startup plan), $0.05 per additional lookup
 * Documentation: https://www.wappalyzer.com/docs/api/
 */

interface WappalyzerTechnology {
  slug: string;
  name: string;
  description?: string;
  confidence: number;
  version?: string;
  icon: string;
  website: string;
  cpe?: string;
  categories: Array<{
    id: number;
    slug: string;
    name: string;
  }>;
}

interface WappalyzerLookupResult {
  url: string;
  technologies: WappalyzerTechnology[];
}

interface WappalyzerResponse {
  results: WappalyzerLookupResult[];
  errors: any[];
}

class WappalyzerClientError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'WappalyzerClientError';
  }
}

export class WappalyzerClient {
  private apiKey: string;
  private baseUrl = 'https://api.wappalyzer.com/v2';
  private lookupCount = 0; // Track lookups for monitoring

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.WAPPALYZER_API_KEY || '';

    if (!this.apiKey) {
      throw new Error(
        'Wappalyzer API key is required. Set WAPPALYZER_API_KEY environment variable.'
      );
    }
  }

  /**
   * Get total lookup count for monitoring
   */
  getLookupCount(): number {
    return this.lookupCount;
  }

  /**
   * Reset lookup counter (useful for tracking monthly usage)
   */
  resetLookupCounter(): void {
    this.lookupCount = 0;
  }

  /**
   * Retry logic with exponential backoff
   */
  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx except 429)
        if (
          error instanceof WappalyzerClientError &&
          error.statusCode &&
          error.statusCode >= 400 &&
          error.statusCode < 500 &&
          error.statusCode !== 429
        ) {
          throw error;
        }

        // Wait before retrying
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        console.warn(
          `[Wappalyzer] Attempt ${attempt + 1}/${maxRetries} failed. Retrying in ${Math.round(delay)}ms...`
        );
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Make API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'x-api-key': this.apiKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new WappalyzerClientError(
        `Wappalyzer API error: ${response.status} - ${errorText}`,
        response.status
      );
    }

    return response.json();
  }

  /**
   * Lookup technologies for a single URL
   */
  async lookupTechnologies(url: string): Promise<WappalyzerTechnology[]> {
    return this.retryWithBackoff(async () => {
      // Ensure URL has protocol
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;

      console.log(`[Wappalyzer] Looking up technologies for: ${formattedUrl}`);

      const response = await this.request<WappalyzerResponse>(
        `/lookup/?urls=${encodeURIComponent(formattedUrl)}`,
        { method: 'GET' }
      );

      // Track lookup
      this.lookupCount++;

      if (response.errors && response.errors.length > 0) {
        console.error('[Wappalyzer] Lookup errors:', response.errors);
      }

      if (response.results.length === 0) {
        console.warn(`[Wappalyzer] No results for: ${formattedUrl}`);
        return [];
      }

      const result = response.results[0];
      console.log(`[Wappalyzer] Found ${result.technologies.length} technologies for ${formattedUrl}`);

      return result.technologies;
    });
  }

  /**
   * Categorize technologies by type
   */
  categorizeTechnologies(technologies: WappalyzerTechnology[]) {
    const categories: Record<string, WappalyzerTechnology[]> = {};

    technologies.forEach(tech => {
      tech.categories.forEach(category => {
        if (!categories[category.slug]) {
          categories[category.slug] = [];
        }
        categories[category.slug].push(tech);
      });
    });

    return categories;
  }

  /**
   * Check if specific technology category is present
   */
  hasTechnology(
    technologies: WappalyzerTechnology[],
    categorySlug: string
  ): boolean {
    return technologies.some(tech =>
      tech.categories.some(cat => cat.slug === categorySlug)
    );
  }

  /**
   * Get technologies by category
   */
  getTechnologiesByCategory(
    technologies: WappalyzerTechnology[],
    categorySlug: string
  ): WappalyzerTechnology[] {
    return technologies.filter(tech =>
      tech.categories.some(cat => cat.slug === categorySlug)
    );
  }

  /**
   * Normalize Wappalyzer data to our standard format
   */
  normalizeTechnologyData(technologies: WappalyzerTechnology[]) {
    const categorized = this.categorizeTechnologies(technologies);

    return {
      technologies: technologies.map(tech => ({
        name: tech.name,
        slug: tech.slug,
        description: tech.description,
        confidence: tech.confidence,
        version: tech.version,
        website: tech.website,
        categories: tech.categories.map(cat => cat.name),
      })),
      byCategory: Object.keys(categorized).reduce((acc, key) => {
        acc[key] = categorized[key].map(t => t.name);
        return acc;
      }, {} as Record<string, string[]>),
      summary: {
        cms: this.getTechnologiesByCategory(technologies, 'cms').map(t => t.name),
        frameworks: this.getTechnologiesByCategory(technologies, 'javascript-frameworks').map(t => t.name),
        analytics: this.getTechnologiesByCategory(technologies, 'analytics').map(t => t.name),
        marketingAutomation: this.getTechnologiesByCategory(technologies, 'marketing-automation').map(t => t.name),
        crm: this.getTechnologiesByCategory(technologies, 'crm').map(t => t.name),
        ecommerce: this.getTechnologiesByCategory(technologies, 'ecommerce').map(t => t.name),
        emailServices: this.getTechnologiesByCategory(technologies, 'email').map(t => t.name),
        hosting: this.getTechnologiesByCategory(technologies, 'web-hosting').map(t => t.name),
        cdn: this.getTechnologiesByCategory(technologies, 'cdn').map(t => t.name),
        seo: this.getTechnologiesByCategory(technologies, 'seo').map(t => t.name),
        socialMedia: this.getTechnologiesByCategory(technologies, 'social-media').map(t => t.name),
        liveChat: this.getTechnologiesByCategory(technologies, 'live-chat').map(t => t.name),
      },
      insights: {
        hasMarketingAutomation: this.hasTechnology(technologies, 'marketing-automation'),
        hasCRM: this.hasTechnology(technologies, 'crm'),
        hasAnalytics: this.hasTechnology(technologies, 'analytics'),
        hasLiveChat: this.hasTechnology(technologies, 'live-chat'),
        hasSEOTools: this.hasTechnology(technologies, 'seo'),
        hasEmailMarketing: this.hasTechnology(technologies, 'email'),
      },
      dataSource: 'wappalyzer',
      retrievedAt: new Date().toISOString(),
    };
  }

  /**
   * Get comprehensive technology stack analysis
   */
  async analyzeTechnologyStack(url: string) {
    console.log(`[Wappalyzer] Analyzing technology stack for: ${url}`);

    const technologies = await this.lookupTechnologies(url);

    if (technologies.length === 0) {
      console.warn(`[Wappalyzer] No technologies detected for: ${url}`);
      return this.normalizeTechnologyData([]);
    }

    return this.normalizeTechnologyData(technologies);
  }

  /**
   * Identify missing critical technologies (opportunities)
   */
  identifyMissingTechnologies(technologies: WappalyzerTechnology[]) {
    const insights = this.normalizeTechnologyData(technologies).insights;
    const missing: string[] = [];

    if (!insights.hasMarketingAutomation) {
      missing.push('Marketing Automation (HubSpot, Marketo, ActiveCampaign)');
    }

    if (!insights.hasCRM) {
      missing.push('CRM System (Salesforce, HubSpot CRM, Pipedrive)');
    }

    if (!insights.hasAnalytics) {
      missing.push('Analytics Platform (Google Analytics, Mixpanel, Amplitude)');
    }

    if (!insights.hasLiveChat) {
      missing.push('Live Chat / Chatbot (Intercom, Drift, Zendesk Chat)');
    }

    if (!insights.hasSEOTools) {
      missing.push('SEO Tools (Yoast, Rank Math, Semrush)');
    }

    if (!insights.hasEmailMarketing) {
      missing.push('Email Marketing Platform (Mailchimp, SendGrid, ConvertKit)');
    }

    return missing;
  }
}

// Export singleton instance
export const wappalyzerClient = new WappalyzerClient();

// Export for testing with custom API key
export default WappalyzerClient;
