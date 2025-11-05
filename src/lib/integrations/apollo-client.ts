/**
 * Apollo.io API Client
 *
 * Provides company enrichment data including firmographics, contacts, and technologies.
 *
 * Rate Limits: 100 requests/day (Growth plan)
 * Credits: 48 credits/month (2,400/year)
 * Documentation: https://apolloio.github.io/apollo-api-docs/
 */

interface ApolloCompanySearchResult {
  id: string;
  name: string;
  website_url: string;
  domain: string;
  industry: string;
  employee_count: number;
  estimated_num_employees: number;
  revenue: string;
  founded_year: number;
  phone: string;
  linkedin_url: string;
  facebook_url: string;
  twitter_url: string;
  city: string;
  state: string;
  country: string;
  description: string;
  technologies: string[];
}

interface ApolloSearchResponse {
  organizations: ApolloCompanySearchResult[];
  pagination: {
    page: number;
    per_page: number;
    total_entries: number;
    total_pages: number;
  };
}

interface ApolloEnrichmentResult extends ApolloCompanySearchResult {
  // Additional enrichment fields
  seo_description: string;
  logo_url: string;
  primary_phone: {
    number: string;
    sanitized_number: string;
  };
}

interface ApolloErrorResponse {
  error: string;
  message?: string;
}

class ApolloClientError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: ApolloErrorResponse
  ) {
    super(message);
    this.name = 'ApolloClientError';
  }
}

export class ApolloClient {
  private apiKey: string;
  private baseUrl = 'https://api.apollo.io/v1';
  private rateLimitDelay = 1000; // 1 second between requests to avoid rate limits

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.APOLLO_API_KEY || '';

    if (!this.apiKey) {
      throw new Error('Apollo API key is required. Set APOLLO_API_KEY environment variable.');
    }
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
          error instanceof ApolloClientError &&
          error.statusCode &&
          error.statusCode >= 400 &&
          error.statusCode < 500 &&
          error.statusCode !== 429
        ) {
          throw error;
        }

        // Wait before retrying (exponential backoff with jitter)
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        console.warn(
          `[Apollo] Attempt ${attempt + 1}/${maxRetries} failed. Retrying in ${Math.round(delay)}ms...`
        );
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Make API request with error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData: ApolloErrorResponse = await response
        .json()
        .catch(() => ({ error: 'Unknown error' }));

      throw new ApolloClientError(
        errorData.message || errorData.error || `Apollo API error: ${response.status}`,
        response.status,
        errorData
      );
    }

    return response.json();
  }

  /**
   * Search for companies by name or domain
   */
  async searchCompanies(
    query: string,
    options: {
      page?: number;
      perPage?: number;
      searchByDomain?: boolean;
    } = {}
  ): Promise<ApolloSearchResponse> {
    const { page = 1, perPage = 10, searchByDomain = false } = options;

    return this.retryWithBackoff(async () => {
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay));

      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });

      if (searchByDomain) {
        queryParams.append('organization_domains[]', query);
      } else {
        queryParams.append('q_organization_name', query);
      }

      const data = await this.request<ApolloSearchResponse>(
        `/organizations/search?${queryParams.toString()}`,
        { method: 'GET' }
      );

      console.log(`[Apollo] Found ${data.organizations.length} companies for query: ${query}`);

      return data;
    });
  }

  /**
   * Enrich company data by domain
   */
  async enrichCompany(domain: string): Promise<ApolloEnrichmentResult | null> {
    return this.retryWithBackoff(async () => {
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay));

      // First search for the company
      const searchResults = await this.searchCompanies(domain, {
        searchByDomain: true,
        perPage: 1,
      });

      if (searchResults.organizations.length === 0) {
        console.warn(`[Apollo] No company found for domain: ${domain}`);
        return null;
      }

      const company = searchResults.organizations[0];

      // Apollo search already returns enriched data
      // In a full implementation, you might call a separate enrichment endpoint
      console.log(`[Apollo] Enriched company: ${company.name}`);

      return company as ApolloEnrichmentResult;
    });
  }

  /**
   * Get technologies used by a company
   */
  async getTechnologies(domain: string): Promise<string[]> {
    const company = await this.enrichCompany(domain);

    if (!company) {
      return [];
    }

    return company.technologies || [];
  }

  /**
   * Normalize Apollo data to our standard format
   */
  normalizeCompanyData(apolloData: ApolloCompanySearchResult | ApolloEnrichmentResult) {
    return {
      name: apolloData.name,
      domain: apolloData.domain || apolloData.website_url?.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      website: apolloData.website_url,
      industry: apolloData.industry,
      employeeCount: apolloData.estimated_num_employees || apolloData.employee_count,
      revenue: apolloData.revenue,
      foundedYear: apolloData.founded_year,
      description: apolloData.description,
      phone: apolloData.phone,
      location: {
        city: apolloData.city,
        state: apolloData.state,
        country: apolloData.country,
      },
      socialMedia: {
        linkedin: apolloData.linkedin_url,
        facebook: apolloData.facebook_url,
        twitter: apolloData.twitter_url,
      },
      technologies: apolloData.technologies || [],
      dataSource: 'apollo',
      retrievedAt: new Date().toISOString(),
    };
  }

  /**
   * Get comprehensive company data (search + normalize)
   */
  async getCompanyData(domainOrName: string, searchByDomain = true) {
    console.log(`[Apollo] Getting company data for: ${domainOrName}`);

    const searchResults = await this.searchCompanies(domainOrName, {
      searchByDomain,
      perPage: 1,
    });

    if (searchResults.organizations.length === 0) {
      console.warn(`[Apollo] No company found for: ${domainOrName}`);
      return null;
    }

    const company = searchResults.organizations[0];
    return this.normalizeCompanyData(company);
  }
}

// Export singleton instance
export const apolloClient = new ApolloClient();

// Export for testing with custom API key
export default ApolloClient;
