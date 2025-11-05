/**
 * Data Aggregation Service
 *
 * Orchestrates parallel data gathering from multiple APIs and aggregates results.
 * Implements retry logic, error handling, caching, and graceful degradation.
 */

import { apolloClient } from '../integrations/apollo-client';
import { dataForSEOClient } from '../integrations/dataforseo-client';
import { wappalyzerClient } from '../integrations/wappalyzer-client';

interface DataAggregationConfig {
  domain: string;
  companyName: string;
  timeout?: number; // Timeout for each API call (ms)
  skipCache?: boolean; // Skip cache and force fresh data
  enabledSources?: DataSource[]; // Which data sources to use
}

type DataSource =
  | 'apollo'
  | 'dataforseo'
  | 'wappalyzer'
  | 'firecrawl' // Existing
  | 'coresignal' // Phase 2
  | 'brightdata' // Phase 2
  | 'newsapi' // Phase 2
  | 'social' // Phase 3
  | 'financial'; // Phase 3

interface DataSourceResult<T = any> {
  source: DataSource;
  status: 'success' | 'failed' | 'timeout' | 'skipped';
  data?: T;
  error?: string;
  duration: number; // milliseconds
  cost?: number; // API cost if applicable
}

interface AggregatedData {
  domain: string;
  companyName: string;
  aggregatedAt: string;
  totalDuration: number; // Total time for all API calls
  totalCost: number; // Total API cost

  // Data sources
  apollo?: any;
  dataforseo?: any;
  wappalyzer?: any;
  firecrawl?: any;

  // Metadata
  sources: DataSourceResult[];
  successCount: number;
  failureCount: number;
  cacheHit: boolean;
}

interface CacheEntry {
  domain: string;
  data: AggregatedData;
  cachedAt: string;
  expiresAt: string;
}

export class DataAggregationService {
  private cache: Map<string, CacheEntry> = new Map();
  private defaultTimeout = 15000; // 15 seconds per API call
  private cacheTTL = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    // Initialize cache cleanup interval (every hour)
    setInterval(() => this.cleanExpiredCache(), 60 * 60 * 1000);
  }

  /**
   * Clean expired cache entries
   */
  private cleanExpiredCache(): void {
    const now = new Date().toISOString();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < now) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[DataAggregator] Cleaned ${cleaned} expired cache entries`);
    }
  }

  /**
   * Get cache key for a domain
   */
  private getCacheKey(domain: string): string {
    return domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '');
  }

  /**
   * Check if cache exists and is valid
   */
  private checkCache(domain: string): CacheEntry | null {
    const key = this.getCacheKey(domain);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const now = new Date().toISOString();
    if (entry.expiresAt < now) {
      this.cache.delete(key);
      return null;
    }

    return entry;
  }

  /**
   * Store data in cache
   */
  private storeInCache(domain: string, data: AggregatedData): void {
    const key = this.getCacheKey(domain);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.cacheTTL);

    this.cache.set(key, {
      domain: key,
      data,
      cachedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    });

    console.log(`[DataAggregator] Cached data for ${domain} (expires: ${expiresAt.toISOString()})`);
  }

  /**
   * Invalidate cache for a domain
   */
  invalidateCache(domain: string): void {
    const key = this.getCacheKey(domain);
    this.cache.delete(key);
    console.log(`[DataAggregator] Invalidated cache for ${domain}`);
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const now = new Date().toISOString();
    let valid = 0;
    let expired = 0;

    for (const entry of this.cache.values()) {
      if (entry.expiresAt >= now) {
        valid++;
      } else {
        expired++;
      }
    }

    return {
      total: this.cache.size,
      valid,
      expired,
      hitRate: 0, // Would need to track hits/misses separately
    };
  }

  /**
   * Execute API call with timeout
   */
  private async executeWithTimeout<T>(
    source: DataSource,
    fn: () => Promise<T>,
    timeout: number
  ): Promise<DataSourceResult<T>> {
    const startTime = Date.now();

    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), timeout);
      });

      // Race between API call and timeout
      const data = await Promise.race([fn(), timeoutPromise]);

      const duration = Date.now() - startTime;

      return {
        source,
        status: 'success',
        data,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      return {
        source,
        status: errorMessage === 'Timeout' ? 'timeout' : 'failed',
        error: errorMessage,
        duration,
      };
    }
  }

  /**
   * Aggregate data from Apollo.io
   */
  private async aggregateApolloData(
    domain: string,
    timeout: number
  ): Promise<DataSourceResult> {
    console.log(`[DataAggregator] Fetching Apollo.io data for: ${domain}`);

    return this.executeWithTimeout(
      'apollo',
      async () => {
        const data = await apolloClient.getCompanyData(domain, true);
        return data;
      },
      timeout
    );
  }

  /**
   * Aggregate data from DataForSEO
   */
  private async aggregateDataForSEOData(
    domain: string,
    timeout: number
  ): Promise<DataSourceResult> {
    console.log(`[DataAggregator] Fetching DataForSEO data for: ${domain}`);

    return this.executeWithTimeout(
      'dataforseo',
      async () => {
        const data = await dataForSEOClient.getComprehensiveSEOData(domain);

        // Capture cost from DataForSEO client
        const cost = dataForSEOClient.getTotalCost();

        return { data, cost };
      },
      timeout
    ).then(result => ({
      ...result,
      cost: result.data?.cost || 0,
      data: result.data?.data,
    }));
  }

  /**
   * Aggregate data from Wappalyzer
   */
  private async aggregateWappalyzerData(
    domain: string,
    timeout: number
  ): Promise<DataSourceResult> {
    console.log(`[DataAggregator] Fetching Wappalyzer data for: ${domain}`);

    return this.executeWithTimeout(
      'wappalyzer',
      async () => {
        const data = await wappalyzerClient.analyzeTechnologyStack(domain);
        return data;
      },
      timeout
    );
  }

  /**
   * Aggregate data from all sources (parallel execution)
   */
  async aggregateAllData(
    config: DataAggregationConfig
  ): Promise<AggregatedData> {
    const { domain, companyName, timeout = this.defaultTimeout, skipCache = false, enabledSources } = config;

    console.log(`[DataAggregator] Starting data aggregation for: ${domain}`);
    console.log(`[DataAggregator] Company name: ${companyName}`);
    console.log(`[DataAggregator] Timeout: ${timeout}ms per source`);

    const startTime = Date.now();

    // Check cache first
    if (!skipCache) {
      const cached = this.checkCache(domain);
      if (cached) {
        console.log(`[DataAggregator] Cache hit for ${domain}`);
        return {
          ...cached.data,
          cacheHit: true,
        };
      }
    }

    // Determine which sources to fetch
    const defaultSources: DataSource[] = ['apollo', 'dataforseo', 'wappalyzer'];
    const sources = enabledSources || defaultSources;

    console.log(`[DataAggregator] Enabled sources: ${sources.join(', ')}`);

    // Execute all API calls in parallel
    const promises: Promise<DataSourceResult>[] = [];

    if (sources.includes('apollo')) {
      promises.push(this.aggregateApolloData(domain, timeout));
    }

    if (sources.includes('dataforseo')) {
      promises.push(this.aggregateDataForSEOData(domain, timeout));
    }

    if (sources.includes('wappalyzer')) {
      promises.push(this.aggregateWappalyzerData(domain, timeout));
    }

    // Wait for all promises to settle (don't fail if some APIs fail)
    const results = await Promise.allSettled(
      promises.map(p =>
        p.catch(error => ({
          source: 'unknown' as DataSource,
          status: 'failed' as const,
          error: error.message,
          duration: 0,
        }))
      )
    );

    // Process results
    const sourceResults: DataSourceResult[] = [];
    let successCount = 0;
    let failureCount = 0;
    let totalCost = 0;

    const aggregatedData: Record<string, any> = {};

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const sourceResult = result.value;
        sourceResults.push(sourceResult);

        if (sourceResult.status === 'success') {
          successCount++;
          aggregatedData[sourceResult.source] = sourceResult.data;

          if (sourceResult.cost) {
            totalCost += sourceResult.cost;
          }
        } else {
          failureCount++;
        }
      } else {
        failureCount++;
        sourceResults.push({
          source: 'unknown',
          status: 'failed',
          error: result.reason?.message || 'Unknown error',
          duration: 0,
        });
      }
    });

    const totalDuration = Date.now() - startTime;

    const finalData: AggregatedData = {
      domain,
      companyName,
      aggregatedAt: new Date().toISOString(),
      totalDuration,
      totalCost,
      ...aggregatedData,
      sources: sourceResults,
      successCount,
      failureCount,
      cacheHit: false,
    };

    // Store in cache if at least one source succeeded
    if (successCount > 0 && !skipCache) {
      this.storeInCache(domain, finalData);
    }

    console.log(`[DataAggregator] Aggregation complete for ${domain}`);
    console.log(`[DataAggregator] Success: ${successCount}, Failed: ${failureCount}`);
    console.log(`[DataAggregator] Total duration: ${totalDuration}ms`);
    console.log(`[DataAggregator] Total cost: $${totalCost.toFixed(4)}`);

    return finalData;
  }

  /**
   * Get aggregated data with automatic retry on partial failure
   */
  async getComprehensiveData(
    domain: string,
    companyName: string,
    options: {
      skipCache?: boolean;
      retryFailedSources?: boolean;
      timeout?: number;
    } = {}
  ): Promise<AggregatedData> {
    const { skipCache = false, retryFailedSources = true, timeout } = options;

    // First attempt
    const firstAttempt = await this.aggregateAllData({
      domain,
      companyName,
      skipCache,
      timeout,
    });

    // If all sources succeeded or retry disabled, return
    if (firstAttempt.failureCount === 0 || !retryFailedSources) {
      return firstAttempt;
    }

    // Retry only failed sources
    const failedSources = firstAttempt.sources
      .filter(s => s.status !== 'success')
      .map(s => s.source);

    if (failedSources.length === 0) {
      return firstAttempt;
    }

    console.log(`[DataAggregator] Retrying ${failedSources.length} failed sources: ${failedSources.join(', ')}`);

    // Wait a bit before retry
    await new Promise(resolve => setTimeout(resolve, 2000));

    const retryAttempt = await this.aggregateAllData({
      domain,
      companyName,
      skipCache: true, // Don't use cache for retry
      timeout,
      enabledSources: failedSources,
    });

    // Merge results
    const mergedData: AggregatedData = {
      ...firstAttempt,
      ...retryAttempt,
      successCount: firstAttempt.successCount + retryAttempt.successCount,
      failureCount: firstAttempt.failureCount - retryAttempt.successCount,
      totalDuration: firstAttempt.totalDuration + retryAttempt.totalDuration,
      totalCost: firstAttempt.totalCost + retryAttempt.totalCost,
      sources: [
        ...firstAttempt.sources.filter(s => s.status === 'success'),
        ...retryAttempt.sources,
      ],
    };

    return mergedData;
  }

  /**
   * Get data quality score (0-100)
   */
  calculateDataQuality(data: AggregatedData): number {
    const totalSources = data.sources.length;
    const successfulSources = data.successCount;

    if (totalSources === 0) return 0;

    let score = (successfulSources / totalSources) * 100;

    // Bonus points for critical sources
    const hasSEOData = data.sources.find(s => s.source === 'dataforseo' && s.status === 'success');
    const hasCompanyData = data.sources.find(s => s.source === 'apollo' && s.status === 'success');
    const hasTechData = data.sources.find(s => s.source === 'wappalyzer' && s.status === 'success');

    if (hasSEOData) score += 5; // SEO data is critical
    if (hasCompanyData) score += 3;
    if (hasTechData) score += 2;

    return Math.min(score, 100);
  }
}

// Export singleton instance
export const dataAggregator = new DataAggregationService();

// Export class for custom instances
export default DataAggregationService;
