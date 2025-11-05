/**
 * React Hooks for AI Presenter Data Access
 *
 * Custom hooks for fetching and managing presentation data
 */

import { useState, useEffect, useCallback } from 'react';
import { sdk } from '@/lib/ai-presenter-sdk';
import type {
  Client,
  PresentationData,
  UseClientResult,
  UsePresentationResult,
  UseAccessLinkResult,
  AccessContext,
} from '@/lib/types';

/**
 * Hook to fetch client data by slug
 */
export function useClient(slug: string): UseClientResult {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchClient = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await sdk.getClientBySlug(slug);
      setClient(data);
    } catch (err) {
      setError(err);
      console.error('Error fetching client:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  return {
    client,
    loading,
    error,
    refetch: fetchClient,
  };
}

/**
 * Hook to fetch complete presentation data
 */
export function usePresentation(clientId: string): UsePresentationResult {
  const [presentation, setPresentation] = useState<PresentationData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchPresentation = useCallback(async () => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        client,
        presentationData,
        services,
        caseStudies,
        competitiveAnalysis,
        teamMembers,
      ] = await Promise.all([
        sdk.getClientById(clientId),
        sdk.getPresentation(clientId),
        sdk.getServices(clientId),
        sdk.getCaseStudies(clientId),
        sdk.getCompetitiveAnalysis(clientId),
        sdk.getTeamMembers(clientId),
      ]);

      if (!client || !presentationData) {
        throw new Error('Client or presentation not found');
      }

      // Fetch slides for the presentation
      const slides = await sdk.getSlides(presentationData.id);

      setPresentation({
        client,
        presentation: presentationData,
        slides,
        services,
        caseStudies,
        competitiveAnalysis: competitiveAnalysis || undefined,
        teamMembers,
      });
    } catch (err) {
      setError(err);
      console.error('Error fetching presentation:', err);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchPresentation();
  }, [fetchPresentation]);

  return {
    presentation,
    loading,
    error,
    refetch: fetchPresentation,
  };
}

/**
 * Hook to validate and manage access links
 */
export function useAccessLink(): UseAccessLinkResult {
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [context, setContext] = useState<AccessContext | null>(null);

  const validate = useCallback(
    async (token: string, password?: string) => {
      try {
        setLoading(true);
        setError(null);

        const result = await sdk.validateAccessToken(token, password);

        if (result.valid) {
          setIsValid(true);
          setContext({
            isValid: true,
            clientId: result.client_id,
            accessLinkId: result.access_link_id,
            allowedSections: result.allowed_sections,
            customMessage: result.custom_message,
          });
        } else {
          setIsValid(false);
          setError(result.error || 'Invalid access token');
          setContext({ isValid: false });
        }
      } catch (err) {
        setIsValid(false);
        setError(
          err instanceof Error ? err.message : 'Failed to validate access link'
        );
        setContext({ isValid: false });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    isValid,
    loading,
    error,
    validate,
    context,
  };
}

/**
 * Hook to track analytics events
 */
export function useAnalytics(clientId?: string, accessLinkId?: string) {
  const trackEvent = useCallback(
    (eventType: string, eventData?: Record<string, any>) => {
      if (clientId) {
        sdk.trackEvent({
          client_id: clientId,
          access_link_id: accessLinkId,
          event_type: eventType as any,
          event_data: eventData,
        });
      }
    },
    [clientId, accessLinkId]
  );

  return { trackEvent };
}

/**
 * Hook for debounced value (useful for search inputs)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook to manage local storage state
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook to detect intersection (for lazy loading)
 */
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options?: IntersectionObserverInit
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}
