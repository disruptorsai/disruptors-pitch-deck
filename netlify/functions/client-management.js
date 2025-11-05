/**
 * Netlify Function: Client Management
 *
 * Server-side client operations using Supabase service role
 * Keeps service role key secure and prevents RLS issues
 */

import { createClient } from '@supabase/supabase-js';

// Support both naming conventions during transition
// Prefer non-VITE prefix (server-side only) for security
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

// Initialize Supabase admin client
const getSupabaseAdmin = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration missing');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

/**
 * Create a new client
 */
async function createNewClient(supabase, payload) {
  console.log('[Client Management] Creating client:', payload.name);
  console.log('[Client Management] Payload keys:', Object.keys(payload));

  let finalPayload = { ...payload };
  let attempts = 0;
  const maxAttempts = 10;

  // Try to insert, handle duplicate slug by appending number
  while (attempts < maxAttempts) {
    const { data, error } = await supabase
      .from('ai_presenter_clients')
      .insert([finalPayload])
      .select()
      .single();

    if (!error) {
      console.log('[Client Management] Client created successfully:', data.id);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data),
      };
    }

    // If duplicate slug error, generate a new slug with number suffix
    if (error.code === '23505' && error.message.includes('slug')) {
      attempts++;
      const baseSlug = payload.slug.replace(/-\d+$/, ''); // Remove existing number suffix
      finalPayload.slug = `${baseSlug}-${attempts}`;
      console.log(`[Client Management] Slug collision, trying: ${finalPayload.slug}`);
      continue;
    }

    // For other errors, throw immediately
    console.error('[Client Management] Insert error:', error);
    throw error;
  }

  // If we exhausted all attempts
  throw new Error('Could not generate unique slug after 10 attempts');
}

/**
 * Update a client
 */
async function updateClient(supabase, payload) {
  const { id, ...updates } = payload;

  console.log('[Client Management] Updating client:', id);

  const { data, error } = await supabase
    .from('ai_presenter_clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(data),
  };
}

/**
 * Delete a client
 */
async function deleteClient(supabase, payload) {
  const { id } = payload;

  console.log('[Client Management] Deleting client:', id);

  const { error } = await supabase
    .from('ai_presenter_clients')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true }),
  };
}

/**
 * Get a client by ID or slug
 */
async function getClient(supabase, payload) {
  const { id, slug } = payload;

  console.log('[Client Management] Getting client:', id || slug);

  let query = supabase.from('ai_presenter_clients').select('*');

  if (id) {
    query = query.eq('id', id);
  } else if (slug) {
    query = query.eq('slug', slug);
  } else {
    throw new Error('Either id or slug is required');
  }

  const { data, error } = await query.single();

  if (error) throw error;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(data),
  };
}

/**
 * List all clients
 */
async function listClients(supabase, payload) {
  console.log('[Client Management] Listing clients');

  const { limit = 50, offset = 0, status } = payload || {};

  let query = supabase
    .from('ai_presenter_clients')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  if (limit) {
    query = query.limit(limit);
  }

  if (offset) {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      data,
      total: count,
      limit,
      offset,
    }),
  };
}

export const handler = async (event, context) => {
  console.log('[Client Management] Function invoked');
  console.log('[Client Management] HTTP Method:', event.httpMethod);
  console.log('[Client Management] Path:', event.path);

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const { action, payload } = JSON.parse(event.body || '{}');
    console.log('[Client Management] Action:', action);

    // Check environment variables
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[Client Management] Missing Supabase configuration');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Server configuration error',
          message: 'Supabase service role key not configured',
        }),
      };
    }

    const supabase = getSupabaseAdmin();

    switch (action) {
      case 'create':
        return await createNewClient(supabase, payload);

      case 'update':
        return await updateClient(supabase, payload);

      case 'delete':
        return await deleteClient(supabase, payload);

      case 'get':
        return await getClient(supabase, payload);

      case 'list':
        return await listClients(supabase, payload);

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: 'Invalid action',
            availableActions: ['create', 'update', 'delete', 'get', 'list'],
          }),
        };
    }
  } catch (error) {
    console.error('[Client Management] ERROR:', error);
    console.error('[Client Management] Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      stack: error.stack,
    });

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        code: error.code,
        details: error.details,
        hint: error.hint,
      }),
    };
  }
};
