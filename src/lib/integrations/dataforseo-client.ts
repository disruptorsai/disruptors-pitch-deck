/**
 * DataForSEO API Client
 *
 * Provides comprehensive SEO intelligence including domain analytics, keyword rankings,
 * backlinks, and competitor analysis.
 *
 * Rate Limits: 600 requests/minute
 * Pricing: Pay-per-request ($0.25-2.50 per request depending on endpoint)
 * Documentation: https://docs.dataforseo.com/v3/
 *
 * Authentication: Uses Basic Auth with login + password
 */

interface DataForSEODomainAnalytics {
  domain: string;
  metrics: {
    organic: {
      pos_1: number;
      pos_2_3: number;
      pos_4_10: number;
      pos_11_20: number;
      pos_21_30: number;
      pos_31_40: number;
      pos_41_50: number;
      pos_51_60: number;
      pos_61_70: number;
      pos_71_80: number;
      pos_81_90: number;
      pos_91_100: number;
      etv: number; // Estimated traffic value
      count: number; // Total keywords
    };
    paid: {
      count: number;
      etv: number;
    };
  };
  is_new: boolean;
  date_from: string;
  date_to: string;
}

interface DataForSEOBacklinkData {
  target: string;
  total_count: number;
  referring_domains: number;
  referring_main_domains: number;
  backlinks: Array<{
    url_from: string;
    url_to: string;
    domain_from: string;
    anchor: string;
    text_pre: string;
    text_post: string;
    dofollow: boolean;
    page_from_rank: number;
  }>;
}

interface DataForSEOCompetitorData {
  target: string;
  competitors: Array<{
    domain: string;
    avg_position: number;
    sum_position: number;
    intersections: number;
    full_domain_metrics: {
      organic_keywords: number;
      organic_etv: number;
      organic_count: number;
    };
  }>;
}

interface DataForSEOKeywordData {
  keyword: string;
  location_code: number;
  language_code: string;
  search_volume: number;
  competition: number;
  cpc: number;
  monthly_searches: Array<{
    year: number;
    month: number;
    search_volume: number;
  }>;
}

interface DataForSEOResponse<T> {
  version: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  tasks_count: number;
  tasks_error: number;
  tasks: Array<{
    id: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    result_count: number;
    path: string[];
    data: any;
    result: T[];
  }>;
}

class DataForSEOClientError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public cost?: number
  ) {
    super(message);
    this.name = 'DataForSEOClientError';
  }
}

export class DataForSEOClient {
  private login: string;
  private password: string;
  private baseUrl = 'https://api.dataforseo.com/v3';
  private totalCost = 0; // Track total cost for monitoring

  constructor(login?: string, password?: string) {
    this.login = login || process.env.DATAFORSEO_LOGIN || '';
    this.password = password || process.env.DATAFORSEO_PASSWORD || '';

    if (!this.login || !this.password) {
      throw new Error(
        'DataForSEO credentials required. Set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD environment variables.'
      );
    }
  }

  /**
   * Get total API cost for monitoring
   */
  getTotalCost(): number {
    return this.totalCost;
  }

  /**
   * Reset cost counter (useful for tracking daily/monthly costs)
   */
  resetCostCounter(): void {
    this.totalCost = 0;
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
          error instanceof DataForSEOClientError &&
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
          `[DataForSEO] Attempt ${attempt + 1}/${maxRetries} failed. Retrying in ${Math.round(delay)}ms...`
        );
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Make API request with Basic Auth
   */
  private async request<T>(
    endpoint: string,
    data: any[] = []
  ): Promise<DataForSEOResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const auth = Buffer.from(`${this.login}:${this.password}`).toString('base64');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new DataForSEOClientError(
        `DataForSEO API error: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const responseData: DataForSEOResponse<T> = await response.json();

    // Track cost
    if (responseData.cost) {
      this.totalCost += responseData.cost;
      console.log(`[DataForSEO] Request cost: $${responseData.cost.toFixed(4)} | Total: $${this.totalCost.toFixed(4)}`);
    }

    // Check for errors in response
    if (responseData.status_code !== 20000) {
      throw new DataForSEOClientError(
        `DataForSEO error: ${responseData.status_message}`,
        responseData.status_code,
        responseData.cost
      );
    }

    return responseData;
  }

  /**
   * Get domain analytics overview
   */
  async getDomainAnalytics(domain: string, locationCode = 2840): Promise<DataForSEODomainAnalytics | null> {
    return this.retryWithBackoff(async () => {
      console.log(`[DataForSEO] Getting domain analytics for: ${domain}`);

      const response = await this.request<DataForSEODomainAnalytics>(
        '/dataforseo_labs/google/domain_rank_overview/live',
        [
          {
            target: domain,
            location_code: locationCode, // 2840 = United States
            language_code: 'en',
          },
        ]
      );

      if (response.tasks.length === 0 || response.tasks[0].result_count === 0) {
        console.warn(`[DataForSEO] No analytics data found for: ${domain}`);
        return null;
      }

      const result = response.tasks[0].result[0];
      console.log(`[DataForSEO] Found ${result.metrics.organic.count} organic keywords for ${domain}`);

      return result;
    });
  }

  /**
   * Get backlink data
   */
  async getBacklinks(
    domain: string,
    limit = 100
  ): Promise<DataForSEOBacklinkData | null> {
    return this.retryWithBackoff(async () => {
      console.log(`[DataForSEO] Getting backlinks for: ${domain}`);

      const response = await this.request<DataForSEOBacklinkData>(
        '/backlinks/backlinks/live',
        [
          {
            target: domain,
            mode: 'as_is', // Get domain exactly as specified
            limit: limit,
            include_subdomains: true,
            order_by: ['rank:desc'], // Order by page rank descending
          },
        ]
      );

      if (response.tasks.length === 0 || response.tasks[0].result_count === 0) {
        console.warn(`[DataForSEO] No backlink data found for: ${domain}`);
        return null;
      }

      const result = response.tasks[0].result[0];
      console.log(`[DataForSEO] Found ${result.total_count} backlinks for ${domain}`);

      return result;
    });
  }

  /**
   * Get competitor analysis
   */
  async getCompetitors(
    domain: string,
    locationCode = 2840,
    limit = 10
  ): Promise<DataForSEOCompetitorData | null> {
    return this.retryWithBackoff(async () => {
      console.log(`[DataForSEO] Getting competitors for: ${domain}`);

      const response = await this.request<DataForSEOCompetitorData>(
        '/dataforseo_labs/google/domain_competitors/live',
        [
          {
            target: domain,
            location_code: locationCode,
            language_code: 'en',
            limit: limit,
            order_by: ['intersections:desc'], // Order by keyword intersection
          },
        ]
      );

      if (response.tasks.length === 0 || response.tasks[0].result_count === 0) {
        console.warn(`[DataForSEO] No competitor data found for: ${domain}`);
        return null;
      }

      const result = response.tasks[0].result[0];
      console.log(`[DataForSEO] Found ${result.competitors?.length || 0} competitors for ${domain}`);

      return result;
    });
  }

  /**
   * Get keyword data
   */
  async getKeywordData(
    keywords: string[],
    locationCode = 2840
  ): Promise<DataForSEOKeywordData[]> {
    return this.retryWithBackoff(async () => {
      console.log(`[DataForSEO] Getting keyword data for ${keywords.length} keywords`);

      const response = await this.request<DataForSEOKeywordData>(
        '/keywords_data/google_ads/search_volume/live',
        keywords.map(keyword => ({
          keywords: [keyword],
          location_code: locationCode,
          language_code: 'en',
        }))
      );

      const results: DataForSEOKeywordData[] = [];

      response.tasks.forEach(task => {
        if (task.result && task.result.length > 0) {
          results.push(...task.result);
        }
      });

      console.log(`[DataForSEO] Retrieved data for ${results.length} keywords`);

      return results;
    });
  }

  /**
   * Normalize DataForSEO data to our standard format
   */
  normalizeSEOData(
    domainAnalytics: DataForSEODomainAnalytics | null,
    backlinks: DataForSEOBacklinkData | null,
    competitors: DataForSEOCompetitorData | null
  ) {
    return {
      domain: domainAnalytics?.domain || '',
      organicKeywords: domainAnalytics?.metrics.organic.count || 0,
      estimatedTrafficValue: domainAnalytics?.metrics.organic.etv || 0,
      keywordDistribution: domainAnalytics
        ? {
            top1: domainAnalytics.metrics.organic.pos_1,
            top3: domainAnalytics.metrics.organic.pos_2_3,
            top10: domainAnalytics.metrics.organic.pos_4_10,
            top20: domainAnalytics.metrics.organic.pos_11_20,
            top100: domainAnalytics.metrics.organic.pos_21_30 +
              domainAnalytics.metrics.organic.pos_31_40 +
              domainAnalytics.metrics.organic.pos_41_50 +
              domainAnalytics.metrics.organic.pos_51_60 +
              domainAnalytics.metrics.organic.pos_61_70 +
              domainAnalytics.metrics.organic.pos_71_80 +
              domainAnalytics.metrics.organic.pos_81_90 +
              domainAnalytics.metrics.organic.pos_91_100,
          }
        : null,
      backlinks: {
        total: backlinks?.total_count || 0,
        referringDomains: backlinks?.referring_domains || 0,
        referringMainDomains: backlinks?.referring_main_domains || 0,
        topBacklinks: backlinks?.backlinks.slice(0, 10).map(bl => ({
          urlFrom: bl.url_from,
          domainFrom: bl.domain_from,
          anchor: bl.anchor,
          dofollow: bl.dofollow,
          pageRank: bl.page_from_rank,
        })) || [],
      },
      competitors: competitors?.competitors.map(comp => ({
        domain: comp.domain,
        avgPosition: comp.avg_position,
        intersections: comp.intersections,
        organicKeywords: comp.full_domain_metrics.organic_keywords,
        estimatedTrafficValue: comp.full_domain_metrics.organic_etv,
      })) || [],
      dataSource: 'dataforseo',
      retrievedAt: new Date().toISOString(),
    };
  }

  /**
   * Get comprehensive SEO data (all endpoints)
   */
  async getComprehensiveSEOData(domain: string, locationCode = 2840) {
    console.log(`[DataForSEO] Getting comprehensive SEO data for: ${domain}`);

    const [domainAnalytics, backlinks, competitors] = await Promise.allSettled([
      this.getDomainAnalytics(domain, locationCode),
      this.getBacklinks(domain, 100),
      this.getCompetitors(domain, locationCode, 10),
    ]);

    const analyticsData = domainAnalytics.status === 'fulfilled' ? domainAnalytics.value : null;
    const backlinksData = backlinks.status === 'fulfilled' ? backlinks.value : null;
    const competitorsData = competitors.status === 'fulfilled' ? competitors.value : null;

    // Log any failures
    if (domainAnalytics.status === 'rejected') {
      console.error('[DataForSEO] Domain analytics failed:', domainAnalytics.reason);
    }
    if (backlinks.status === 'rejected') {
      console.error('[DataForSEO] Backlinks failed:', backlinks.reason);
    }
    if (competitors.status === 'rejected') {
      console.error('[DataForSEO] Competitors failed:', competitors.reason);
    }

    return this.normalizeSEOData(analyticsData, backlinksData, competitorsData);
  }
}

// Export singleton instance
export const dataForSEOClient = new DataForSEOClient();

// Export for testing with custom credentials
export default DataForSEOClient;
