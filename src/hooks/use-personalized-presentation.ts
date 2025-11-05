/**
 * usePersonalizedPresentation Hook
 *
 * Fetches client data and generates personalized presentation content
 * Uses caching to reduce AI generation costs
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { personalizeEntirePresentation } from '@/lib/presentation-personalizer-v2';
import type { Client } from '@/lib/types';
import type { PersonalizedPresentation } from '@/lib/presentation-personalizer-v2';

interface UsePersonalizedPresentationResult {
  client: Client | null;
  personalization: PersonalizedPresentation | null;
  isLoading: boolean;
  isGenerating: boolean;
  error: Error | null;
}

/**
 * Fetch and personalize presentation for active client
 */
export function usePersonalizedPresentation(): UsePersonalizedPresentationResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ['personalizedPresentation', 'active'],
    queryFn: async () => {
      // 1. Fetch active client with all intelligence
      const { data: clients, error: clientError } = await supabase
        .from('ai_presenter_clients')
        .select('*')
        .eq('status', 'active')
        .limit(1);

      if (clientError) {
        console.error('Error fetching active client:', clientError);
        throw new Error(`Failed to fetch active client: ${clientError.message}`);
      }

      // Get the first active client or null
      const client = clients && clients.length > 0 ? clients[0] : null;

      if (!client) {
        console.warn('⚠️ No active client found in database');
        throw new Error('No active client found. Please create a client and set status to "active" in the admin panel.');
      }

      // 2. Check cache first
      const cacheKey = `personalization:${client.id}`;
      const { data: cached, error: cacheError } = await supabase
        .from('ai_presenter_cache')
        .select('cache_value')
        .eq('cache_key', cacheKey)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      // Ignore cache errors (just regenerate if cache fails)
      if (cacheError) {
        console.warn('⚠️ Cache lookup failed:', cacheError.message);
      }

      if (cached?.cache_value) {
        console.log('✅ Using cached personalization');
        return {
          client,
          personalization: cached.cache_value as PersonalizedPresentation,
          fromCache: true,
        };
      }

      // 3. Generate new personalization
      console.log('🎨 Generating new personalization...');
      const personalization = await personalizeEntirePresentation(client as Client);

      // 4. Cache the result (7 day TTL)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await supabase.from('ai_presenter_cache').upsert({
        cache_key: cacheKey,
        cache_value: personalization,
        expires_at: expiresAt.toISOString(),
      }, {
        onConflict: 'cache_key'
      });

      return {
        client,
        personalization,
        fromCache: false,
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error) => {
      // Don't retry if no active client exists
      if (error.message.includes('No active client found')) {
        return false;
      }
      // Retry once for other errors
      return failureCount < 1;
    },
    // Don't refetch on window focus for personalization (expensive operation)
    refetchOnWindowFocus: false,
  });

  return {
    client: data?.client || null,
    personalization: data?.personalization || null,
    isLoading,
    isGenerating: isLoading && !data?.fromCache,
    error: error as Error | null,
  };
}

/**
 * Fetch and personalize presentation for specific client by slug
 */
export function usePersonalizedPresentationBySlug(slug: string): UsePersonalizedPresentationResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ['personalizedPresentation', slug],
    queryFn: async () => {
      // 1. Fetch client by slug
      const { data: client, error: clientError } = await supabase
        .from('ai_presenter_clients')
        .select('*')
        .eq('slug', slug)
        .single();

      if (clientError || !client) {
        throw new Error(`Client not found: ${slug}`);
      }

      // 2. Check cache
      const cacheKey = `personalization:${client.id}`;
      const { data: cached, error: cacheError } = await supabase
        .from('ai_presenter_cache')
        .select('cache_value')
        .eq('cache_key', cacheKey)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (cacheError) {
        console.warn('⚠️ Cache lookup failed for', slug, ':', cacheError.message);
      }

      if (cached?.cache_value) {
        console.log('✅ Using cached personalization for', slug);
        return {
          client,
          personalization: cached.cache_value as PersonalizedPresentation,
          fromCache: true,
        };
      }

      // 3. Generate new personalization
      console.log('🎨 Generating new personalization for', slug);
      const personalization = await personalizeEntirePresentation(client as Client);

      // 4. Cache the result
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await supabase.from('ai_presenter_cache').upsert({
        cache_key: cacheKey,
        cache_value: personalization,
        expires_at: expiresAt.toISOString(),
      });

      return {
        client,
        personalization,
        fromCache: false,
      };
    },
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    retry: 1,
    enabled: !!slug,
  });

  return {
    client: data?.client || null,
    personalization: data?.personalization || null,
    isLoading,
    isGenerating: isLoading && !data?.fromCache,
    error: error as Error | null,
  };
}
