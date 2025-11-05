/**
 * ClientLogo Component
 *
 * Displays client logo with fallback to name
 */

import React from 'react';
import { useBranding } from '@/contexts/BrandingContext';

interface ClientLogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const sizeClasses = {
  small: 'h-8',
  medium: 'h-12',
  large: 'h-24',
};

export function ClientLogo({ size = 'medium', className = '' }: ClientLogoProps) {
  const { client } = useBranding();

  if (!client) {
    return null;
  }

  if (!client.logo_url) {
    // Fallback to client name
    return (
      <span className={`font-bold text-white ${className}`}>
        {client.name}
      </span>
    );
  }

  return (
    <img
      src={client.logo_url}
      alt={`${client.name} logo`}
      className={`${sizeClasses[size]} object-contain ${className}`}
    />
  );
}
