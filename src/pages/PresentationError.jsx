/**
 * PresentationError Component
 *
 * Generic error page for presentation access issues
 * Handles: invalid tokens, expired links, max views reached, etc.
 */

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PresentationError() {
  const location = useLocation();
  const error = location.state?.error || 'An unknown error occurred';
  const customMessage = location.state?.customMessage;

  // Determine error type and customize message
  const getErrorDetails = () => {
    const errorLower = error.toLowerCase();

    if (errorLower.includes('expired')) {
      return {
        title: 'Link Expired',
        description: 'This presentation link has expired and is no longer accessible.',
        icon: '⏰',
      };
    }

    if (errorLower.includes('max views') || errorLower.includes('view limit')) {
      return {
        title: 'View Limit Reached',
        description: 'This presentation link has reached its maximum number of views.',
        icon: '👁️',
      };
    }

    if (errorLower.includes('invalid') || errorLower.includes('not found')) {
      return {
        title: 'Invalid Link',
        description: 'This presentation link is invalid or has been revoked.',
        icon: '🔗',
      };
    }

    if (errorLower.includes('revoked')) {
      return {
        title: 'Access Revoked',
        description: 'Access to this presentation has been revoked.',
        icon: '🚫',
      };
    }

    return {
      title: 'Access Error',
      description: error,
      icon: '⚠️',
    };
  };

  const errorDetails = getErrorDetails();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 text-4xl">
            {errorDetails.icon}
          </div>
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-500" />
            {errorDetails.title}
          </CardTitle>
          <CardDescription className="mt-4 text-base">
            {errorDetails.description}
          </CardDescription>
          {customMessage && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                {customMessage}
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            If you believe this is an error, please contact the person who shared this link with you.
          </p>

          <Link to="/">
            <Button className="w-full" variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
