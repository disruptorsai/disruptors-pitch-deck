/**
 * AI Presenter Custom SDK
 *
 * TypeScript wrapper to replace @base44/sdk functionality
 * Provides a clean API layer over Supabase with caching, error handling, and type safety
 *
 * @module ai-presenter-sdk
 */

import { supabase, supabaseAdmin } from './supabase-client';
import { aiService } from './ai-service';
import { storageService } from './storage-service';
import { analyticsService } from './analytics-service';
import type {
  Client,
  AccessLink,
  Presentation,
  Slide,
  Service,
  CaseStudy,
  CompetitiveAnalysis,
  TeamMember,
  AnalyticsEvent,
  FileUpload,
  CacheEntry,
  ValidationResult,
  PaginationParams,
  PaginatedResponse,
} from './types';

/**
 * AI Presenter SDK Configuration
 */
interface SDKConfig {
  enableCache?: boolean;
  cacheTimeout?: number; // in seconds
  enableAnalytics?: boolean;
  adminMode?: boolean; // Use admin client for operations
}

class AIPresenterSDK {
  private config: SDKConfig;
  private cache: Map<string, { data: any; expires: number }>;

  constructor(config: SDKConfig = {}) {
    this.config = {
      enableCache: true,
      cacheTimeout: 300, // 5 minutes default
      enableAnalytics: true,
      adminMode: false,
      ...config,
    };
    this.cache = new Map();
  }

  /**
   * Get the appropriate Supabase client based on admin mode
   */
  private getClient() {
    return this.config.adminMode ? supabaseAdmin : supabase;
  }

  /**
   * Cache helper methods
   */
  private getCacheKey(method: string, params: any): string {
    return `${method}:${JSON.stringify(params)}`;
  }

  private getFromCache<T>(key: string): T | null {
    if (!this.config.enableCache) return null;

    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expires) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  private setCache(key: string, data: any): void {
    if (!this.config.enableCache) return;

    this.cache.set(key, {
      data,
      expires: Date.now() + (this.config.cacheTimeout || 300) * 1000,
    });
  }

  private invalidateCache(pattern?: string): void {
    if (pattern) {
      const keysToDelete: string[] = [];
      this.cache.forEach((_, key) => {
        if (key.includes(pattern)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach((key) => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }

  /**
   * Error handling wrapper
   */
  private handleError(error: any, context: string): never {
    console.error(`[AI Presenter SDK] Error in ${context}:`, error);

    throw {
      message: error.message || 'An unexpected error occurred',
      code: error.code || 'UNKNOWN_ERROR',
      context,
      details: error,
    };
  }

  // =====================================================
  // CLIENT OPERATIONS
  // =====================================================

  /**
   * Get a client by slug
   */
  async getClientBySlug(slug: string): Promise<Client | null> {
    const cacheKey = this.getCacheKey('getClientBySlug', { slug });
    const cached = this.getFromCache<Client>(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await this.getClient()
        .from('ai_presenter_clients')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;

      if (!data) return null;

      this.setCache(cacheKey, data);
      return data as Client;
    } catch (error) {
      this.handleError(error, 'getClientBySlug');
    }
  }

  /**
   * Get a client by ID
   */
  async getClientById(id: string): Promise<Client | null> {
    const cacheKey = this.getCacheKey('getClientById', { id });
    const cached = this.getFromCache<Client>(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await this.getClient()
        .from('ai_presenter_clients')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      if (!data) return null;

      this.setCache(cacheKey, data);
      return data as Client;
    } catch (error) {
      this.handleError(error, 'getClientById');
    }
  }

  /**
   * List all clients (admin only)
   */
  async listClients(params?: PaginationParams): Promise<PaginatedResponse<Client>> {
    try {
      const response = await fetch('/.netlify/functions/client-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'list',
          payload: {
            limit: params?.limit || 50,
            offset: params?.offset || 0,
            status: params?.status,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to list clients');
      }

      const result = await response.json();
      return {
        data: result.data as Client[],
        total: result.total,
        limit: result.limit,
        offset: result.offset,
      };
    } catch (error) {
      this.handleError(error, 'listClients');
    }
  }

  /**
   * Create a new client (admin only)
   */
  async createClient(clientData: Partial<Client>): Promise<Client> {
    try {
      const response = await fetch('/.netlify/functions/client-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          payload: clientData,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create client';
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch (parseError) {
          // If JSON parsing fails, use status text
          errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      this.invalidateCache('client');
      return data as Client;
    } catch (error) {
      this.handleError(error, 'createClient');
    }
  }

  /**
   * Update a client (admin only)
   */
  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    try {
      const response = await fetch('/.netlify/functions/client-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          payload: { id, ...updates },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update client');
      }

      const data = await response.json();
      this.invalidateCache('client');
      return data as Client;
    } catch (error) {
      this.handleError(error, 'updateClient');
    }
  }

  /**
   * Delete a client (admin only)
   */
  async deleteClient(id: string): Promise<void> {
    try {
      const response = await fetch('/.netlify/functions/client-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          payload: { id },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete client');
      }

      this.invalidateCache('client');
    } catch (error) {
      this.handleError(error, 'deleteClient');
    }
  }

  // =====================================================
  // ACCESS LINK OPERATIONS
  // =====================================================

  /**
   * Validate an access token
   */
  async validateAccessToken(
    token: string,
    password?: string
  ): Promise<ValidationResult> {
    try {
      const { data, error } = await supabaseAdmin.rpc(
        'ai_presenter_validate_access_token',
        {
          p_token: token,
          p_password: password || null,
        }
      );

      if (error) throw error;

      return data as ValidationResult;
    } catch (error) {
      this.handleError(error, 'validateAccessToken');
    }
  }

  /**
   * Create a new access link (admin only)
   */
  async createAccessLink(
    linkData: Partial<AccessLink>
  ): Promise<AccessLink> {
    try {
      // Generate token if not provided
      if (!linkData.token) {
        const { data: token, error: tokenError } = await supabaseAdmin.rpc(
          'ai_presenter_generate_access_token'
        );

        if (tokenError) throw tokenError;

        linkData.token = token;
      }

      const { data, error } = await supabaseAdmin
        .from('ai_presenter_access_links')
        .insert([linkData])
        .select()
        .single();

      if (error) throw error;

      return data as AccessLink;
    } catch (error) {
      this.handleError(error, 'createAccessLink');
    }
  }

  /**
   * List access links for a client (admin only)
   */
  async listAccessLinks(clientId: string): Promise<AccessLink[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_presenter_access_links')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as AccessLink[];
    } catch (error) {
      this.handleError(error, 'listAccessLinks');
    }
  }

  /**
   * Update an access link (admin only)
   */
  async updateAccessLink(
    id: string,
    updates: Partial<AccessLink>
  ): Promise<AccessLink> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_presenter_access_links')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data as AccessLink;
    } catch (error) {
      this.handleError(error, 'updateAccessLink');
    }
  }

  /**
   * Revoke an access link (admin only)
   */
  async revokeAccessLink(id: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('ai_presenter_access_links')
        .update({ status: 'revoked' })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'revokeAccessLink');
    }
  }

  // =====================================================
  // PRESENTATION OPERATIONS
  // =====================================================

  /**
   * Get presentation for a client
   */
  async getPresentation(clientId: string): Promise<Presentation | null> {
    const cacheKey = this.getCacheKey('getPresentation', { clientId });
    const cached = this.getFromCache<Presentation>(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await this.getClient()
        .from('ai_presenter_presentations')
        .select('*')
        .eq('client_id', clientId)
        .eq('is_default', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) return null;

      this.setCache(cacheKey, data);
      return data as Presentation;
    } catch (error) {
      this.handleError(error, 'getPresentation');
    }
  }

  /**
   * Create a presentation (admin only)
   */
  async createPresentation(
    presentationData: Partial<Presentation>
  ): Promise<Presentation> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_presenter_presentations')
        .insert([presentationData])
        .select()
        .single();

      if (error) throw error;

      this.invalidateCache('presentation');
      return data as Presentation;
    } catch (error) {
      this.handleError(error, 'createPresentation');
    }
  }

  /**
   * Update a presentation (admin only)
   */
  async updatePresentation(
    id: string,
    updates: Partial<Presentation>
  ): Promise<Presentation> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_presenter_presentations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      this.invalidateCache('presentation');
      return data as Presentation;
    } catch (error) {
      this.handleError(error, 'updatePresentation');
    }
  }

  // =====================================================
  // SLIDE OPERATIONS
  // =====================================================

  /**
   * Get slides for a presentation
   */
  async getSlides(presentationId: string): Promise<Slide[]> {
    const cacheKey = this.getCacheKey('getSlides', { presentationId });
    const cached = this.getFromCache<Slide[]>(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await this.getClient()
        .from('ai_presenter_slides')
        .select('*')
        .eq('presentation_id', presentationId)
        .eq('is_visible', true)
        .order('order_index', { ascending: true });

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data as Slide[];
    } catch (error) {
      this.handleError(error, 'getSlides');
    }
  }

  /**
   * Create a slide (admin only)
   */
  async createSlide(slideData: Partial<Slide>): Promise<Slide> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_presenter_slides')
        .insert([slideData])
        .select()
        .single();

      if (error) throw error;

      this.invalidateCache('slide');
      return data as Slide;
    } catch (error) {
      this.handleError(error, 'createSlide');
    }
  }

  /**
   * Update a slide (admin only)
   */
  async updateSlide(id: string, updates: Partial<Slide>): Promise<Slide> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_presenter_slides')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      this.invalidateCache('slide');
      return data as Slide;
    } catch (error) {
      this.handleError(error, 'updateSlide');
    }
  }

  /**
   * Delete a slide (admin only)
   */
  async deleteSlide(id: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('ai_presenter_slides')
        .delete()
        .eq('id', id);

      if (error) throw error;

      this.invalidateCache('slide');
    } catch (error) {
      this.handleError(error, 'deleteSlide');
    }
  }

  /**
   * Reorder slides (admin only)
   */
  async reorderSlides(slideIds: string[]): Promise<void> {
    try {
      const updates = slideIds.map((id, index) => ({
        id,
        order_index: index,
      }));

      for (const update of updates) {
        const { error } = await supabaseAdmin
          .from('ai_presenter_slides')
          .update({ order_index: update.order_index })
          .eq('id', update.id);

        if (error) throw error;
      }

      this.invalidateCache('slide');
    } catch (error) {
      this.handleError(error, 'reorderSlides');
    }
  }

  // =====================================================
  // SERVICE OPERATIONS
  // =====================================================

  /**
   * Get services for a client
   */
  async getServices(clientId: string): Promise<Service[]> {
    const cacheKey = this.getCacheKey('getServices', { clientId });
    const cached = this.getFromCache<Service[]>(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await this.getClient()
        .from('ai_presenter_services')
        .select('*')
        .eq('client_id', clientId)
        .eq('is_visible', true)
        .order('order_index', { ascending: true });

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data as Service[];
    } catch (error) {
      this.handleError(error, 'getServices');
    }
  }

  /**
   * Get a single service by slug
   */
  async getServiceBySlug(
    clientId: string,
    slug: string
  ): Promise<Service | null> {
    const cacheKey = this.getCacheKey('getServiceBySlug', { clientId, slug });
    const cached = this.getFromCache<Service>(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await this.getClient()
        .from('ai_presenter_services')
        .select('*')
        .eq('client_id', clientId)
        .eq('slug', slug)
        .eq('is_visible', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) return null;

      this.setCache(cacheKey, data);
      return data as Service;
    } catch (error) {
      this.handleError(error, 'getServiceBySlug');
    }
  }

  /**
   * Create a service (admin only)
   */
  async createService(serviceData: Partial<Service>): Promise<Service> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_presenter_services')
        .insert([serviceData])
        .select()
        .single();

      if (error) throw error;

      this.invalidateCache('service');
      return data as Service;
    } catch (error) {
      this.handleError(error, 'createService');
    }
  }

  /**
   * Update a service (admin only)
   */
  async updateService(
    id: string,
    updates: Partial<Service>
  ): Promise<Service> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_presenter_services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      this.invalidateCache('service');
      return data as Service;
    } catch (error) {
      this.handleError(error, 'updateService');
    }
  }

  /**
   * Delete a service (admin only)
   */
  async deleteService(id: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('ai_presenter_services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      this.invalidateCache('service');
    } catch (error) {
      this.handleError(error, 'deleteService');
    }
  }

  // =====================================================
  // CASE STUDY OPERATIONS
  // =====================================================

  /**
   * Get case studies for a client
   */
  async getCaseStudies(clientId: string): Promise<CaseStudy[]> {
    const cacheKey = this.getCacheKey('getCaseStudies', { clientId });
    const cached = this.getFromCache<CaseStudy[]>(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await this.getClient()
        .from('ai_presenter_case_studies')
        .select('*')
        .eq('client_id', clientId)
        .eq('is_visible', true)
        .order('order_index', { ascending: true });

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data as CaseStudy[];
    } catch (error) {
      this.handleError(error, 'getCaseStudies');
    }
  }

  /**
   * Get a single case study by slug
   */
  async getCaseStudyBySlug(
    clientId: string,
    slug: string
  ): Promise<CaseStudy | null> {
    const cacheKey = this.getCacheKey('getCaseStudyBySlug', {
      clientId,
      slug,
    });
    const cached = this.getFromCache<CaseStudy>(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await this.getClient()
        .from('ai_presenter_case_studies')
        .select('*')
        .eq('client_id', clientId)
        .eq('slug', slug)
        .eq('is_visible', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) return null;

      this.setCache(cacheKey, data);
      return data as CaseStudy;
    } catch (error) {
      this.handleError(error, 'getCaseStudyBySlug');
    }
  }

  /**
   * Create a case study (admin only)
   */
  async createCaseStudy(
    caseStudyData: Partial<CaseStudy>
  ): Promise<CaseStudy> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_presenter_case_studies')
        .insert([caseStudyData])
        .select()
        .single();

      if (error) throw error;

      this.invalidateCache('caseStudy');
      return data as CaseStudy;
    } catch (error) {
      this.handleError(error, 'createCaseStudy');
    }
  }

  /**
   * Update a case study (admin only)
   */
  async updateCaseStudy(
    id: string,
    updates: Partial<CaseStudy>
  ): Promise<CaseStudy> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_presenter_case_studies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      this.invalidateCache('caseStudy');
      return data as CaseStudy;
    } catch (error) {
      this.handleError(error, 'updateCaseStudy');
    }
  }

  /**
   * Delete a case study (admin only)
   */
  async deleteCaseStudy(id: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('ai_presenter_case_studies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      this.invalidateCache('caseStudy');
    } catch (error) {
      this.handleError(error, 'deleteCaseStudy');
    }
  }

  // =====================================================
  // COMPETITIVE ANALYSIS OPERATIONS
  // =====================================================

  /**
   * Get competitive analysis for a client
   */
  async getCompetitiveAnalysis(
    clientId: string
  ): Promise<CompetitiveAnalysis | null> {
    const cacheKey = this.getCacheKey('getCompetitiveAnalysis', { clientId });
    const cached = this.getFromCache<CompetitiveAnalysis>(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await this.getClient()
        .from('ai_presenter_competitive_analysis')
        .select('*')
        .eq('client_id', clientId)
        .eq('is_visible', true)
        .maybeSingle();

      // maybeSingle() returns null if no rows found (doesn't throw 406)
      if (error) {
        console.warn('[SDK] Competitive analysis query failed:', error.message);
        return null;
      }

      // data will be null if no rows found
      if (!data) {
        return null;
      }

      this.setCache(cacheKey, data);
      return data as CompetitiveAnalysis;
    } catch (error) {
      console.error('[SDK] Error fetching competitive analysis:', error);
      return null; // Return null instead of throwing
    }
  }

  /**
   * Generate competitive analysis using AI (admin only)
   */
  async generateCompetitiveAnalysis(
    clientId: string,
    clientInfo: {
      name: string;
      industry: string;
      description: string;
      competitors?: string[];
    }
  ): Promise<CompetitiveAnalysis> {
    try {
      // Generate analysis using AI service
      const analysis = await aiService.generateCompetitiveAnalysis(clientInfo);

      // Save to database
      const { data, error } = await supabaseAdmin
        .from('ai_presenter_competitive_analysis')
        .upsert([
          {
            client_id: clientId,
            ...analysis,
            generated_by_ai: true,
            generated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      this.invalidateCache('competitiveAnalysis');
      return data as CompetitiveAnalysis;
    } catch (error) {
      this.handleError(error, 'generateCompetitiveAnalysis');
    }
  }

  /**
   * Update competitive analysis (admin only)
   */
  async updateCompetitiveAnalysis(
    id: string,
    updates: Partial<CompetitiveAnalysis>
  ): Promise<CompetitiveAnalysis> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_presenter_competitive_analysis')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      this.invalidateCache('competitiveAnalysis');
      return data as CompetitiveAnalysis;
    } catch (error) {
      this.handleError(error, 'updateCompetitiveAnalysis');
    }
  }

  // =====================================================
  // TEAM MEMBER OPERATIONS
  // =====================================================

  /**
   * Get team members for a client
   */
  async getTeamMembers(clientId: string): Promise<TeamMember[]> {
    const cacheKey = this.getCacheKey('getTeamMembers', { clientId });
    const cached = this.getFromCache<TeamMember[]>(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await this.getClient()
        .from('ai_presenter_team_members')
        .select('*')
        .eq('client_id', clientId)
        .eq('is_visible', true)
        .order('order_index', { ascending: true });

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data as TeamMember[];
    } catch (error) {
      this.handleError(error, 'getTeamMembers');
    }
  }

  /**
   * Create a team member (admin only)
   */
  async createTeamMember(
    teamMemberData: Partial<TeamMember>
  ): Promise<TeamMember> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_presenter_team_members')
        .insert([teamMemberData])
        .select()
        .single();

      if (error) throw error;

      this.invalidateCache('teamMember');
      return data as TeamMember;
    } catch (error) {
      this.handleError(error, 'createTeamMember');
    }
  }

  /**
   * Update a team member (admin only)
   */
  async updateTeamMember(
    id: string,
    updates: Partial<TeamMember>
  ): Promise<TeamMember> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_presenter_team_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      this.invalidateCache('teamMember');
      return data as TeamMember;
    } catch (error) {
      this.handleError(error, 'updateTeamMember');
    }
  }

  /**
   * Delete a team member (admin only)
   */
  async deleteTeamMember(id: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('ai_presenter_team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      this.invalidateCache('teamMember');
    } catch (error) {
      this.handleError(error, 'deleteTeamMember');
    }
  }

  // =====================================================
  // FILE UPLOAD OPERATIONS
  // =====================================================

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(
    clientId: string,
    file: File,
    options?: {
      entityType?: string;
      entityId?: string;
      fileType?: string;
    }
  ): Promise<FileUpload> {
    try {
      const uploadResult = await storageService.uploadFile(
        clientId,
        file,
        options
      );

      // Record in database
      const { data, error } = await supabaseAdmin
        .from('ai_presenter_file_uploads')
        .insert([uploadResult])
        .select()
        .single();

      if (error) throw error;

      return data as FileUpload;
    } catch (error) {
      this.handleError(error, 'uploadFile');
    }
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      // Get file info
      const { data: fileData, error: fetchError } = await supabaseAdmin
        .from('ai_presenter_file_uploads')
        .select('*')
        .eq('id', fileId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      await storageService.deleteFile(fileData.storage_path);

      // Delete from database
      const { error: deleteError } = await supabaseAdmin
        .from('ai_presenter_file_uploads')
        .delete()
        .eq('id', fileId);

      if (deleteError) throw deleteError;
    } catch (error) {
      this.handleError(error, 'deleteFile');
    }
  }

  /**
   * Get files for a client
   */
  async getFiles(clientId: string): Promise<FileUpload[]> {
    try {
      const { data, error } = await this.getClient()
        .from('ai_presenter_file_uploads')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as FileUpload[];
    } catch (error) {
      this.handleError(error, 'getFiles');
    }
  }

  // =====================================================
  // ANALYTICS OPERATIONS
  // =====================================================

  /**
   * Track an analytics event
   */
  async trackEvent(eventData: Partial<AnalyticsEvent>): Promise<void> {
    if (!this.config.enableAnalytics) return;

    try {
      await analyticsService.trackEvent(eventData);
    } catch (error) {
      // Don't throw on analytics errors, just log
      console.error('Failed to track analytics event:', error);
    }
  }

  /**
   * Get analytics for a client (admin only)
   */
  async getAnalytics(
    clientId: string,
    params?: {
      startDate?: string;
      endDate?: string;
      eventType?: string;
      accessLinkId?: string;
    }
  ): Promise<AnalyticsEvent[]> {
    try {
      let query = supabaseAdmin
        .from('ai_presenter_analytics_events')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (params?.startDate) {
        query = query.gte('created_at', params.startDate);
      }

      if (params?.endDate) {
        query = query.lte('created_at', params.endDate);
      }

      if (params?.eventType) {
        query = query.eq('event_type', params.eventType);
      }

      if (params?.accessLinkId) {
        query = query.eq('access_link_id', params.accessLinkId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data as AnalyticsEvent[];
    } catch (error) {
      this.handleError(error, 'getAnalytics');
    }
  }

  /**
   * Get analytics summary for a client (admin only)
   */
  async getAnalyticsSummary(
    clientId: string,
    params?: {
      startDate?: string;
      endDate?: string;
    }
  ): Promise<{
    totalViews: number;
    uniqueSessions: number;
    eventsByType: Record<string, number>;
    topPages: Array<{ page: string; views: number }>;
  }> {
    try {
      const events = await this.getAnalytics(clientId, params);

      const uniqueSessions = new Set(
        events.map((e) => e.session_id).filter(Boolean)
      ).size;

      const eventsByType = events.reduce((acc, event) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const pageViews = events
        .filter((e) => e.page_url)
        .reduce((acc, event) => {
          const page = event.page_url || 'Unknown';
          acc[page] = (acc[page] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

      const topPages = Object.entries(pageViews)
        .map(([page, views]) => ({ page, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      return {
        totalViews: events.length,
        uniqueSessions,
        eventsByType,
        topPages,
      };
    } catch (error) {
      this.handleError(error, 'getAnalyticsSummary');
    }
  }

  // =====================================================
  // VOICE CONVERSATION METHODS (DisruptorBot)
  // =====================================================

  /**
   * Create a new voice conversation session
   */
  async createVoiceSession(params: {
    clientId: string;
    accessLinkId?: string;
    sessionId: string;
    interactionMode?: 'voice' | 'text' | 'hybrid';
    currentSlideSlug?: string;
    elevenlabsConversationId?: string;
    agentId?: string;
  }) {
    try {
      const { data, error } = await this.getClient()
        .from('ai_presenter_voice_sessions')
        .insert({
          client_id: params.clientId,
          access_link_id: params.accessLinkId,
          session_id: params.sessionId,
          interaction_mode: params.interactionMode || 'voice',
          current_slide_slug: params.currentSlideSlug,
          elevenlabs_conversation_id: params.elevenlabsConversationId,
          agent_id: params.agentId,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      this.handleError(error, 'createVoiceSession');
    }
  }

  /**
   * Add a message to a voice conversation
   */
  async addVoiceMessage(params: {
    voiceSessionId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    audioDurationMs?: number;
    audioUrl?: string;
    confidenceScore?: number;
    currentSlideSlug?: string;
    intent?: string;
    topics?: string[];
    sentiment?: string;
    sentimentScore?: number;
    actionTaken?: string;
    actionParams?: any;
    sequenceNumber: number;
  }) {
    try {
      const { data, error } = await this.getClient()
        .from('ai_presenter_voice_messages')
        .insert({
          voice_session_id: params.voiceSessionId,
          role: params.role,
          content: params.content,
          audio_duration_ms: params.audioDurationMs,
          audio_url: params.audioUrl,
          confidence_score: params.confidenceScore,
          current_slide_slug: params.currentSlideSlug,
          intent: params.intent,
          topics: params.topics,
          sentiment: params.sentiment,
          sentiment_score: params.sentimentScore,
          action_taken: params.actionTaken,
          action_params: params.actionParams,
          sequence_number: params.sequenceNumber
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      this.handleError(error, 'addVoiceMessage');
    }
  }

  /**
   * End a voice conversation session
   */
  async endVoiceSession(sessionId: string, durationSeconds?: number) {
    try {
      const { data, error } = await this.getClient()
        .from('ai_presenter_voice_sessions')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString(),
          duration_seconds: durationSeconds
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      // Generate insights when session ends
      if (this.config.adminMode) {
        await this.generateConversationInsights(sessionId);
      }

      return data;
    } catch (error) {
      this.handleError(error, 'endVoiceSession');
    }
  }

  /**
   * Get conversation history for a session
   */
  async getConversationHistory(sessionId: string) {
    try {
      const { data, error } = await this.getClient()
        .from('ai_presenter_voice_messages')
        .select('*')
        .eq('voice_session_id', sessionId)
        .order('sequence_number', { ascending: true });

      if (error) throw error;

      return data;
    } catch (error) {
      this.handleError(error, 'getConversationHistory');
    }
  }

  /**
   * Get active voice session for a browser session
   */
  async getActiveVoiceSession(browserSessionId: string) {
    try {
      const { data, error } = await this.getClient()
        .from('ai_presenter_voice_sessions')
        .select('*')
        .eq('session_id', browserSessionId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows

      return data;
    } catch (error) {
      this.handleError(error, 'getActiveVoiceSession');
    }
  }

  /**
   * Generate conversation insights (admin only)
   */
  async generateConversationInsights(sessionId: string) {
    try {
      const { data, error } = await this.getClient()
        .rpc('ai_presenter_generate_conversation_insights', {
          p_session_id: sessionId
        });

      if (error) throw error;

      return data;
    } catch (error) {
      this.handleError(error, 'generateConversationInsights');
    }
  }

  /**
   * Get conversation insights for a session
   */
  async getConversationInsights(sessionId: string) {
    try {
      const { data, error } = await this.getClient()
        .from('ai_presenter_conversation_insights')
        .select('*')
        .eq('voice_session_id', sessionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data;
    } catch (error) {
      this.handleError(error, 'getConversationInsights');
    }
  }

  /**
   * Update conversation insights manually
   */
  async updateConversationInsights(
    sessionId: string,
    updates: {
      primaryInterests?: string[];
      objectionsRaised?: string[];
      engagementScore?: number;
      interestLevel?: 'high' | 'medium' | 'low';
      readinessToBuy?: 'ready' | 'considering' | 'researching' | 'not_ready';
      servicesDiscussed?: string[];
      recommendedTier?: string;
      suggestedFollowUp?: string;
      nextBestAction?: string;
    }
  ) {
    try {
      const { data, error} = await this.getClient()
        .from('ai_presenter_conversation_insights')
        .update({
          primary_interests: updates.primaryInterests,
          objections_raised: updates.objectionsRaised,
          engagement_score: updates.engagementScore,
          interest_level: updates.interestLevel,
          readiness_to_buy: updates.readinessToBuy,
          services_discussed: updates.servicesDiscussed,
          recommended_tier: updates.recommendedTier,
          suggested_follow_up: updates.suggestedFollowUp,
          next_best_action: updates.nextBestAction,
          updated_at: new Date().toISOString()
        })
        .eq('voice_session_id', sessionId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      this.handleError(error, 'updateConversationInsights');
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.invalidateCache();
  }

  /**
   * Enable/disable analytics
   */
  setAnalyticsEnabled(enabled: boolean): void {
    this.config.enableAnalytics = enabled;
  }

  /**
   * Switch to admin mode
   */
  setAdminMode(enabled: boolean): void {
    this.config.adminMode = enabled;
  }
}

// Export singleton instances
export const sdk = new AIPresenterSDK();
export const adminSDK = new AIPresenterSDK({ adminMode: true });

// Export class for custom instances
export { AIPresenterSDK };
