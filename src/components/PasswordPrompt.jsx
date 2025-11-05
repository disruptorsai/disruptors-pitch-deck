/**
 * PasswordPrompt Component
 *
 * Displays a password input form for password-protected presentations
 * Used by PresentationViewer when access link requires password
 */

import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PasswordPrompt({ onSubmit, error, customMessage }) {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsSubmitting(true);
    await onSubmit(password);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Password Protected</CardTitle>
          <CardDescription>
            {customMessage || 'This presentation requires a password to access.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error ? 'border-red-500' : ''}
                autoFocus
                disabled={isSubmitting}
              />
              {error && (
                <p className="text-sm text-red-500">
                  {error.includes('Incorrect') ? 'Incorrect password. Please try again.' : error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!password.trim() || isSubmitting}
            >
              {isSubmitting ? 'Verifying...' : 'Access Presentation'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
