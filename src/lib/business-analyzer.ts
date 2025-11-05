/**
 * Business Analyzer - Client-side wrapper for Netlify Function
 *
 * This module provides a clean interface for business analysis
 * All API calls are handled server-side via Netlify Functions
 */

const API_BASE = '/.netlify/functions/business-analyzer';

/**
 * Search for a business and verify its URL
 */
export async function searchBusiness(businessName: string, providedUrl?: string) {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'searchBusiness',
        payload: {
          businessName,
          providedUrl,
        },
      }),
    });

    if (!response.ok) {
      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || 'Business search failed');
      } else {
        // Not JSON (likely 404 HTML from missing Netlify function)
        throw new Error('Business analyzer service is not available locally. This feature requires Netlify Functions to be running. You can skip the search and create the client manually.');
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Business search error:', error);
    throw error;
  }
}

/**
 * Analyze a website and extract comprehensive business intelligence
 */
export async function analyzeWebsite(url: string, businessName: string) {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'analyzeWebsite',
        payload: {
          url,
          businessName,
        },
      }),
    });

    if (!response.ok) {
      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || 'Website analysis failed');
      } else {
        // Not JSON (likely 404 HTML from missing Netlify function)
        throw new Error('Business analyzer service is not available locally. This feature requires Netlify Functions to be running.');
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Website analysis error:', error);
    throw error;
  }
}

/**
 * Generate a slug from business name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
