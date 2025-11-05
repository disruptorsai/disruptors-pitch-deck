/**
 * Netlify Function: Health Check
 *
 * Server-side health check endpoint to verify configuration
 * Access at: /.netlify/functions/health
 */

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const envCheck = {
      // Client-side variables (with VITE_ prefix)
      hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.VITE_SUPABASE_ANON_KEY,
      hasElevenLabsKey: !!process.env.VITE_ELEVENLABS_API_KEY,
      hasElevenLabsAgentId: !!process.env.VITE_ELEVENLABS_AGENT_ID,

      // Server-side variables (NO VITE_ prefix)
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      hasSerpApiKey: !!process.env.SERPAPI_KEY,
      hasFirecrawlKey: !!process.env.FIRECRAWL_API_KEY,
      hasBraveApiKey: !!process.env.BRAVE_API_KEY,
    };

    // Calculate overall health status
    const requiredVars = [
      'hasSupabaseUrl',
      'hasSupabaseAnonKey',
      'hasServiceRoleKey',
    ];

    const missingRequired = requiredVars.filter(key => !envCheck[key]);
    const isHealthy = missingRequired.length === 0;

    // Build configuration warnings
    const warnings = [];
    if (!envCheck.hasAnthropicKey) {
      warnings.push('ANTHROPIC_API_KEY not set - AI features will not work');
    }
    if (!envCheck.hasServiceRoleKey) {
      warnings.push('SUPABASE_SERVICE_ROLE_KEY not set - Admin operations will fail');
    }

    const healthStatus = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        netlify: !!process.env.NETLIFY,
      },
      configuration: envCheck,
      warnings: warnings.length > 0 ? warnings : undefined,
      missingRequired: missingRequired.length > 0 ? missingRequired : undefined,
    };

    return {
      statusCode: isHealthy ? 200 : 503,
      headers,
      body: JSON.stringify(healthStatus, null, 2),
    };
  } catch (error) {
    console.error('[Health Check] ERROR:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        timestamp: new Date().toISOString(),
        message: error.message,
      }),
    };
  }
};
