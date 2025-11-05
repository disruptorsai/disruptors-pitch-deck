/**
 * Supabase Client Configuration
 *
 * Centralized Supabase client instances for AI Presenter
 * Uses single storage key to prevent "Multiple GoTrueClient instances" warning
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
// SERVICE ROLE KEY NO LONGER EXPOSED CLIENT-SIDE FOR SECURITY
// All admin operations now use Netlify Functions (server-side)
// See: netlify/functions/client-management.js for admin operations

// Validate required environment variables
const missingVars: string[] = [];
if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');

// Check if configuration is valid
export const hasValidConfig = missingVars.length === 0;
export const configError = missingVars.length > 0
  ? `Missing required environment variables: ${missingVars.join(', ')}.

The AI Presenter application requires Supabase configuration to function.

For Netlify deployment:
  1. Go to Site settings → Build & deploy → Environment
  2. Add the missing environment variables
  3. Trigger a new deployment with cache cleared

For local development:
  1. Create a .env.local file in the project root
  2. Add the missing variables with your Supabase project credentials
  3. Restart the development server

See DEPLOYMENT_VALIDATION_REPORT.md for detailed instructions.`
  : null;

/**
 * Create a dummy Supabase client interface for when config is missing
 * This prevents initialization errors while allowing the app to detect and display the error
 */
function createDummyClient(): any {
  const errorHandler = () => {
    throw new Error(configError || 'Supabase configuration is invalid');
  };

  return new Proxy({}, {
    get() {
      return errorHandler;
    }
  });
}

/**
 * Public Supabase client (anon key)
 * Used for client-side operations with RLS policies
 */
export const supabase = hasValidConfig
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        storageKey: 'disruptors-ai-auth', // Shared auth storage key
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'X-Client-Info': 'ai-presenter',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    })
  : createDummyClient();

/**
 * @deprecated Admin Supabase client is deprecated for security reasons
 *
 * ⚠️ SECURITY NOTICE: This client is deprecated and should not be used
 *
 * All admin operations now use Netlify Functions (server-side) to keep
 * the service role key secure and never expose it to the browser.
 *
 * Use these secure alternatives:
 * - Client management: /.netlify/functions/client-management
 * - AI operations: /.netlify/functions/ai-service
 * - Personalization: /.netlify/functions/presentation-personalizer
 *
 * This export is maintained for backward compatibility during migration
 * but returns the anon client with limited permissions (respects RLS).
 */
export const supabaseAdmin = supabase; // Now uses anon client for safety

/**
 * Type-safe database types
 * These can be generated automatically using Supabase CLI:
 * npx supabase gen types typescript --project-id [project-id] > src/lib/database.types.ts
 */
export type Database = {
  public: {
    Tables: {
      ai_presenter_clients: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          logo_url: string | null;
          primary_color: string | null;
          secondary_color: string | null;
          website: string | null;
          email: string | null;
          phone: string | null;
          status: 'active' | 'archived' | 'draft';
          settings: any;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          logo_url?: string | null;
          primary_color?: string | null;
          secondary_color?: string | null;
          website?: string | null;
          email?: string | null;
          phone?: string | null;
          status?: 'active' | 'archived' | 'draft';
          settings?: any;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          logo_url?: string | null;
          primary_color?: string | null;
          secondary_color?: string | null;
          website?: string | null;
          email?: string | null;
          phone?: string | null;
          status?: 'active' | 'archived' | 'draft';
          settings?: any;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      // Add other table types as needed
    };
    Views: {};
    Functions: {
      ai_presenter_generate_access_token: {
        Args: {};
        Returns: string;
      };
      ai_presenter_validate_access_token: {
        Args: {
          p_token: string;
          p_password: string | null;
        };
        Returns: any;
      };
    };
    Enums: {
      ai_presenter_client_status: 'active' | 'archived' | 'draft';
      ai_presenter_access_status: 'active' | 'expired' | 'revoked';
      ai_presenter_event_type:
        | 'presentation_view'
        | 'slide_view'
        | 'case_study_view'
        | 'service_view'
        | 'pdf_download'
        | 'link_click'
        | 'form_submit';
    };
  };
};

/**
 * Helper function to check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

/**
 * Helper function to check if admin mode is available
 * @deprecated Admin operations now use Netlify Functions (always available)
 */
export function isAdminModeAvailable(): boolean {
  // Admin operations are now handled by Netlify Functions
  // They're always available in production (server-side)
  return true;
}
