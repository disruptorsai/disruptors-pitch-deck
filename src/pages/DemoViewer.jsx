/**
 * Demo Viewer Component
 *
 * Simplified viewer for reviewing slides without token validation
 * FOR DEVELOPMENT/REVIEW PURPOSES ONLY - NOT FOR PRODUCTION
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminSDK } from '@/lib/ai-presenter-sdk';
import { BrandingProvider } from '@/contexts/BrandingContext';
import SlideViewer from '@/components/SlideViewer';
import { Loader2 } from 'lucide-react';

export default function DemoViewer() {
  // Hardcoded client ID for demo - this should match your demo data
  const CLIENT_ID = 'c1111111-1111-1111-1111-111111111111';

  // Fetch presentation data
  const {
    data: presentationData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['demo-presentation', CLIENT_ID],
    queryFn: async () => {
      try {
        // Fetch all presentation data
        const [client, presentation] = await Promise.all([
          adminSDK.getClient(CLIENT_ID),
          adminSDK.getPresentation(CLIENT_ID),
        ]);

        if (!client) {
          throw new Error('Demo client not found. Make sure the demo data migration has been run.');
        }

        if (!presentation) {
          throw new Error('Presentation not found for demo client.');
        }

        // Fetch slides for the presentation
        const slides = await adminSDK.getSlides(presentation.id);

        if (!slides || slides.length === 0) {
          throw new Error('No slides found. Make sure the populate_slides migration has been run.');
        }

        console.log('Demo viewer loaded:', {
          client: client.name,
          presentation: presentation.title,
          slideCount: slides.length,
        });

        return {
          client,
          presentation,
          slides,
        };
      } catch (err) {
        console.error('Error loading demo presentation:', err);
        throw err;
      }
    },
    retry: 1,
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-white text-lg">Loading demo presentation...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <div className="max-w-2xl bg-red-900/20 border border-red-500 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Demo</h2>
          <p className="text-white mb-4">{error.message}</p>
          <div className="bg-gray-800 p-4 rounded text-sm text-gray-300">
            <p className="font-semibold mb-2">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Make sure you've run the demo data migration</li>
              <li>Make sure you've run the populate_slides migration</li>
              <li>Check that the Supabase credentials are configured in .env</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Main presentation view
  if (presentationData) {
    return (
      <BrandingProvider client={presentationData.client}>
        <div className="demo-viewer-wrapper">
          {/* Demo Mode Banner */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl">
            <div className="bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-lg">
              <p className="text-center font-medium">
                DEMO MODE - For Review Only | {presentationData.slides.length} Slides Loaded
              </p>
            </div>
          </div>

          {/* Slide viewer */}
          <SlideViewer
            slides={presentationData.slides}
            presentation={presentationData.presentation}
            onSlideChange={(index, slide) => {
              console.log('Slide changed:', index + 1, slide.title);
            }}
          />
        </div>
      </BrandingProvider>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <p className="text-white">Unable to load demo presentation</p>
    </div>
  );
}
