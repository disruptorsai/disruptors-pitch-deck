/**
 * Analytics Service - Event Tracking and Reporting
 *
 * Handles all analytics tracking for presentations, views, and user interactions
 */

import { supabaseAdmin } from './supabase-client';
import type { TrackEventOptions, AnalyticsEvent } from './types';

class AnalyticsService {
  private sessionId: string | null = null;

  /**
   * Initialize analytics session
   */
  initSession(): string {
    if (typeof window !== 'undefined') {
      // Generate session ID if not exists
      let sessionId = sessionStorage.getItem('ai-presenter-session-id');

      if (!sessionId) {
        sessionId = this.generateSessionId();
        sessionStorage.setItem('ai-presenter-session-id', sessionId);
      }

      this.sessionId = sessionId;
      return sessionId;
    }

    return '';
  }

  /**
   * Track an analytics event
   */
  async trackEvent(options: TrackEventOptions): Promise<void> {
    try {
      // Ensure session is initialized
      if (!this.sessionId && typeof window !== 'undefined') {
        this.initSession();
      }

      // Get browser and location info
      const browserInfo = this.getBrowserInfo();
      const locationInfo = await this.getLocationInfo();

      // Insert event
      const { error } = await supabaseAdmin
        .from('ai_presenter_analytics_events')
        .insert([
          {
            client_id: options.client_id,
            access_link_id: options.access_link_id,
            event_type: options.event_type,
            event_data: options.event_data || {},
            session_id: this.sessionId || options.session_id,
            ip_address: locationInfo.ip,
            user_agent: browserInfo.userAgent,
            referrer: browserInfo.referrer,
            country: locationInfo.country,
            city: locationInfo.city,
            page_url: options.page_url || browserInfo.currentUrl,
            page_title: options.page_title || browserInfo.pageTitle,
          },
        ]);

      if (error) throw error;
    } catch (error) {
      // Don't throw on analytics errors, just log
      console.error('Analytics tracking error:', error);
    }
  }

  /**
   * Track presentation view
   */
  async trackPresentationView(
    clientId: string,
    accessLinkId?: string
  ): Promise<void> {
    await this.trackEvent({
      client_id: clientId,
      access_link_id: accessLinkId,
      event_type: 'presentation_view',
    });
  }

  /**
   * Track slide view
   */
  async trackSlideView(
    clientId: string,
    slideId: string,
    slideIndex: number,
    accessLinkId?: string
  ): Promise<void> {
    await this.trackEvent({
      client_id: clientId,
      access_link_id: accessLinkId,
      event_type: 'slide_view',
      event_data: {
        slide_id: slideId,
        slide_index: slideIndex,
      },
    });
  }

  /**
   * Track case study view
   */
  async trackCaseStudyView(
    clientId: string,
    caseStudyId: string,
    caseStudySlug: string,
    accessLinkId?: string
  ): Promise<void> {
    await this.trackEvent({
      client_id: clientId,
      access_link_id: accessLinkId,
      event_type: 'case_study_view',
      event_data: {
        case_study_id: caseStudyId,
        case_study_slug: caseStudySlug,
      },
    });
  }

  /**
   * Track service view
   */
  async trackServiceView(
    clientId: string,
    serviceId: string,
    serviceSlug: string,
    accessLinkId?: string
  ): Promise<void> {
    await this.trackEvent({
      client_id: clientId,
      access_link_id: accessLinkId,
      event_type: 'service_view',
      event_data: {
        service_id: serviceId,
        service_slug: serviceSlug,
      },
    });
  }

  /**
   * Track PDF download
   */
  async trackPDFDownload(
    clientId: string,
    pdfName: string,
    accessLinkId?: string
  ): Promise<void> {
    await this.trackEvent({
      client_id: clientId,
      access_link_id: accessLinkId,
      event_type: 'pdf_download',
      event_data: {
        pdf_name: pdfName,
      },
    });
  }

  /**
   * Track link click
   */
  async trackLinkClick(
    clientId: string,
    linkUrl: string,
    linkText: string,
    accessLinkId?: string
  ): Promise<void> {
    await this.trackEvent({
      client_id: clientId,
      access_link_id: accessLinkId,
      event_type: 'link_click',
      event_data: {
        link_url: linkUrl,
        link_text: linkText,
      },
    });
  }

  /**
   * Track form submission
   */
  async trackFormSubmit(
    clientId: string,
    formType: string,
    formData: Record<string, any>,
    accessLinkId?: string
  ): Promise<void> {
    await this.trackEvent({
      client_id: clientId,
      access_link_id: accessLinkId,
      event_type: 'form_submit',
      event_data: {
        form_type: formType,
        ...formData,
      },
    });
  }

  /**
   * Get analytics summary for a client
   */
  async getSummary(
    clientId: string,
    dateRange?: { start: string; end: string }
  ): Promise<{
    totalViews: number;
    uniqueSessions: number;
    eventsByType: Record<string, number>;
    topPages: Array<{ page: string; views: number }>;
    viewsByDay: Array<{ date: string; views: number }>;
  }> {
    try {
      let query = supabaseAdmin
        .from('ai_presenter_analytics_events')
        .select('*')
        .eq('client_id', clientId);

      if (dateRange) {
        query = query.gte('created_at', dateRange.start);
        query = query.lte('created_at', dateRange.end);
      }

      const { data: events, error } = await query;

      if (error) throw error;

      // Calculate metrics
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

      // Group by day
      const viewsByDay = events.reduce((acc, event) => {
        const date = new Date(event.created_at).toISOString().split('T')[0];
        const existing = acc.find((item) => item.date === date);

        if (existing) {
          existing.views++;
        } else {
          acc.push({ date, views: 1 });
        }

        return acc;
      }, [] as Array<{ date: string; views: number }>);

      viewsByDay.sort((a, b) => a.date.localeCompare(b.date));

      return {
        totalViews: events.length,
        uniqueSessions,
        eventsByType,
        topPages,
        viewsByDay,
      };
    } catch (error) {
      console.error('Analytics summary error:', error);
      throw new Error(
        `Failed to get analytics summary: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Get analytics for an access link
   */
  async getAccessLinkAnalytics(
    accessLinkId: string,
    dateRange?: { start: string; end: string }
  ): Promise<{
    totalViews: number;
    uniqueSessions: number;
    eventsByType: Record<string, number>;
    lastAccessed?: string;
  }> {
    try {
      let query = supabaseAdmin
        .from('ai_presenter_analytics_events')
        .select('*')
        .eq('access_link_id', accessLinkId);

      if (dateRange) {
        query = query.gte('created_at', dateRange.start);
        query = query.lte('created_at', dateRange.end);
      }

      const { data: events, error } = await query;

      if (error) throw error;

      const uniqueSessions = new Set(
        events.map((e) => e.session_id).filter(Boolean)
      ).size;

      const eventsByType = events.reduce((acc, event) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const lastAccessed = events.length > 0 ? events[0].created_at : undefined;

      return {
        totalViews: events.length,
        uniqueSessions,
        eventsByType,
        lastAccessed,
      };
    } catch (error) {
      console.error('Analytics error:', error);
      throw new Error(
        `Failed to get access link analytics: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Get real-time active sessions
   */
  async getActiveSessions(clientId: string): Promise<number> {
    try {
      // Get events from last 30 minutes
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

      const { data: events, error } = await supabaseAdmin
        .from('ai_presenter_analytics_events')
        .select('session_id')
        .eq('client_id', clientId)
        .gte('created_at', thirtyMinutesAgo);

      if (error) throw error;

      const uniqueSessions = new Set(
        events.map((e) => e.session_id).filter(Boolean)
      ).size;

      return uniqueSessions;
    } catch (error) {
      console.error('Active sessions error:', error);
      return 0;
    }
  }

  /**
   * Export analytics data to CSV
   */
  async exportToCSV(
    clientId: string,
    dateRange?: { start: string; end: string }
  ): Promise<string> {
    try {
      let query = supabaseAdmin
        .from('ai_presenter_analytics_events')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (dateRange) {
        query = query.gte('created_at', dateRange.start);
        query = query.lte('created_at', dateRange.end);
      }

      const { data: events, error } = await query;

      if (error) throw error;

      // Convert to CSV
      const headers = [
        'Date/Time',
        'Event Type',
        'Session ID',
        'Page URL',
        'User Agent',
        'Country',
        'City',
      ];

      const rows = events.map((event) => [
        event.created_at,
        event.event_type,
        event.session_id || '',
        event.page_url || '',
        event.user_agent || '',
        event.country || '',
        event.city || '',
      ]);

      const csv = [
        headers.join(','),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ),
      ].join('\n');

      return csv;
    } catch (error) {
      console.error('CSV export error:', error);
      throw new Error(
        `Failed to export analytics: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  // =====================================================
  // PRIVATE UTILITY METHODS
  // =====================================================

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get browser information
   */
  private getBrowserInfo(): {
    userAgent: string;
    referrer: string;
    currentUrl: string;
    pageTitle: string;
  } {
    if (typeof window === 'undefined') {
      return {
        userAgent: '',
        referrer: '',
        currentUrl: '',
        pageTitle: '',
      };
    }

    return {
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      currentUrl: window.location.href,
      pageTitle: document.title,
    };
  }

  /**
   * Get location information
   */
  private async getLocationInfo(): Promise<{
    ip: string;
    country: string;
    city: string;
  }> {
    // In a real implementation, you would use a geolocation API
    // For now, return empty values
    return {
      ip: '',
      country: '',
      city: '',
    };
  }

  /**
   * Get session ID
   */
  getSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Check if analytics is enabled
   */
  isEnabled(): boolean {
    // Check if analytics is disabled in environment or settings
    return process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'false';
  }
}

export const analyticsService = new AnalyticsService();
