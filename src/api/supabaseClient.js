/**
 * DEPRECATED: This file is deprecated in favor of src/lib/supabase-client.ts
 * Re-exports from the centralized client to prevent multiple GoTrueClient instances
 * Please update imports to use '@/lib/supabase-client' instead of '@/api/supabaseClient'
 */

import { supabase as centralizedSupabase, supabaseAdmin } from '../lib/supabase-client';

// Re-export centralized clients to prevent multiple instances
export const supabase = centralizedSupabase;
export { supabaseAdmin };

// Create a Base44-compatible SDK wrapper for seamless migration
function createEntityWrapper(tableName) {
  return {
    async list(orderBy = 'created_at') {
      try {
        const { data, error } = await centralizedSupabase
          .from(tableName)
          .select('*')
          .order(orderBy, { ascending: true });

        if (error) {
          console.error(`Error fetching ${tableName}:`, error);
          return [];
        }

        return data || [];
      } catch (err) {
        console.error(`Error in ${tableName}.list:`, err);
        return [];
      }
    },

    async get(id) {
      try {
        const { data, error } = await centralizedSupabase
          .from(tableName)
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error(`Error fetching ${tableName} by id:`, error);
          return null;
        }

        return data;
      } catch (err) {
        console.error(`Error in ${tableName}.get:`, err);
        return null;
      }
    },

    async create(data) {
      try {
        const { data: created, error } = await centralizedSupabase
          .from(tableName)
          .insert([data])
          .select()
          .single();

        if (error) {
          console.error(`Error creating ${tableName}:`, error);
          return null;
        }

        return created;
      } catch (err) {
        console.error(`Error in ${tableName}.create:`, err);
        return null;
      }
    },

    async update(id, data) {
      try {
        const { data: updated, error } = await centralizedSupabase
          .from(tableName)
          .update(data)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error(`Error updating ${tableName}:`, error);
          return null;
        }

        return updated;
      } catch (err) {
        console.error(`Error in ${tableName}.update:`, err);
        return null;
      }
    },

    async delete(id) {
      try {
        const { error } = await centralizedSupabase
          .from(tableName)
          .delete()
          .eq('id', id);

        if (error) {
          console.error(`Error deleting ${tableName}:`, error);
          return false;
        }

        return true;
      } catch (err) {
        console.error(`Error in ${tableName}.delete:`, err);
        return false;
      }
    }
  };
}

// Create Base44-compatible client structure
export const supabaseCompat = {
  entities: {
    Client: createEntityWrapper('ai_presenter_clients'),
    CaseStudy: createEntityWrapper('ai_presenter_case_studies'),
    Capability: createEntityWrapper('ai_presenter_services'),
    PricingTier: createEntityWrapper('ai_presenter_pricing_tiers'),
    TeamMember: createEntityWrapper('ai_presenter_team_members'),
  },
  auth: {
    // Stub auth methods for compatibility
    getCurrentUser: () => null,
    signOut: () => Promise.resolve(),
  }
};

export default supabaseCompat;
