// MIGRATED: This file now uses Supabase instead of Base44 SDK
// Keeping the same export name for backwards compatibility with existing imports

import { supabaseCompat } from './supabaseClient';

// Export as 'base44' for backwards compatibility
// All calls to base44.entities.* will now use Supabase
export const base44 = supabaseCompat;

// Re-export for convenience
export default base44;
