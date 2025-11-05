/**
 * PresentationViewer Component
 *
 * Main component for viewing token-based presentations
 * Flow:
 * 1. Extract token from URL
 * 2. Validate token (with password if required)
 * 3. Fetch presentation data
 * 4. Display slides with branding
 * 5. Track analytics
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminSDK } from '@/lib/ai-presenter-sdk';
import { BrandingProvider } from '@/contexts/BrandingContext';
import PasswordPrompt from '@/components/PasswordPrompt';
import SlideViewer from '@/components/SlideViewer';
import { Loader2 } from 'lucide-react';

export default function PresentationViewer() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Validate access token
  const {
    data: validationResult,
    isLoading: validating,
    error: validationError,
    refetch: revalidate,
  } = useQuery({
    queryKey: ['validateToken', token, password],
    queryFn: async () => {
      if (!token) throw new Error('No token provided');

      const result = await adminSDK.validateAccessToken(token, password || undefined);

      if (!result.valid) {
        if (result.requires_password && !password) {
          setShowPasswordPrompt(true);
          throw new Error('Password required');
        }
        throw new Error(result.error || 'Invalid access token');
      }

      setValidationAttempted(true);
      setShowPasswordPrompt(false);
      return result;
    },
    retry: false,
    enabled: !!token,
  });

  // Fetch presentation data once validated
  const {
    data: presentationData,
    isLoading: loadingPresentation,
  } = useQuery({
    queryKey: ['presentation', validationResult?.client_id],
    queryFn: async () => {
      const clientId = validationResult.client_id;

      // Fetch all presentation data
      const [client, presentation] = await Promise.all([
        adminSDK.getClient(clientId),
        adminSDK.getPresentation(clientId),
      ]);

      if (!presentation) {
        throw new Error('Presentation not found for this client');
      }

      // Fetch slides for the presentation
      const slides = await adminSDK.getSlides(presentation.id);

      return {
        client,
        presentation,
        slides,
      };
    },
    enabled: !!validationResult?.valid && !!validationResult?.client_id,
    retry: 1,
  });

  // Track presentation view when successfully loaded
  useEffect(() => {
    if (validationResult?.valid && presentationData) {
      // Track presentation view event
      adminSDK.trackEvent({
        client_id: validationResult.client_id,
        access_link_id: validationResult.access_link_id,
        event_type: 'presentation_view',
        event_data: {
          token,
          presentation_id: presentationData.presentation?.id,
          presentation_title: presentationData.presentation?.title,
        },
        page_url: window.location.href,
        session_id: sessionId,
      }).catch(err => {
        console.warn('Failed to track presentation view:', err);
      });
    }
  }, [validationResult, presentationData, sessionId, token]);

  // Handle validation errors
  useEffect(() => {
    if (validationError && validationAttempted) {
      const errorMessage = validationError.message || 'Unknown error';

      // Don't redirect if we're just waiting for password
      if (errorMessage.includes('Password required') || showPasswordPrompt) {
        return;
      }

      // Navigate to error page for other errors
      navigate('/presentation-error', {
        state: {
          error: errorMessage,
          customMessage: validationResult?.custom_message,
        },
        replace: true,
      });
    }
  }, [validationError, validationAttempted, navigate, showPasswordPrompt, validationResult]);

  // Handle password submission
  const handlePasswordSubmit = async (pwd) => {
    setPassword(pwd);
    // Revalidate will trigger automatically due to query key change
  };

  // Handle slide change for analytics
  const handleSlideChange = (slideIndex, slide) => {
    if (validationResult?.valid) {
      adminSDK.trackEvent({
        client_id: validationResult.client_id,
        access_link_id: validationResult.access_link_id,
        event_type: 'slide_view',
        event_data: {
          slide_id: slide.id,
          slide_title: slide.title,
          slide_index: slideIndex,
          slide_type: slide.slide_type,
        },
        page_url: window.location.href,
        session_id: sessionId,
      }).catch(err => {
        console.warn('Failed to track slide view:', err);
      });
    }
  };

  // Loading state
  if (validating || loadingPresentation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-white text-lg">
          {validating ? 'Validating access...' : 'Loading presentation...'}
        </p>
      </div>
    );
  }

  // Password prompt
  if (showPasswordPrompt || (validationError?.message?.includes('Password required') && !password)) {
    return (
      <PasswordPrompt
        onSubmit={handlePasswordSubmit}
        error={password && validationError ? 'Incorrect password. Please try again.' : null}
        customMessage={validationResult?.custom_message}
      />
    );
  }

  // Main presentation view
  if (validationResult?.valid && presentationData) {
    return (
      <BrandingProvider client={presentationData.client}>
        <div className="presentation-viewer-wrapper">
          {/* Custom welcome message */}
          {validationResult.custom_message && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl">
              <div className="bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg animate-fade-in">
                <p className="text-center font-medium">{validationResult.custom_message}</p>
              </div>
            </div>
          )}

          {/* Slide viewer */}
          <SlideViewer
            slides={presentationData.slides}
            presentation={presentationData.presentation}
            onSlideChange={handleSlideChange}
          />
        </div>
      </BrandingProvider>
    );
  }

  // Fallback - shouldn't reach here due to error handling above
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <p className="text-white">Unable to load presentation</p>
    </div>
  );
}
