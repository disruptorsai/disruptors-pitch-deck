/**
 * BrandingContext - Dynamic Theme Provider
 *
 * Injects client's brand colors and styling into the application
 * Uses CSS variables for dynamic theming
 */

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import type { Client } from '@/lib/types';

interface BrandingContextValue {
  client: Client | null;
  isLoading: boolean;
}

const BrandingContext = createContext<BrandingContextValue>({
  client: null,
  isLoading: true,
});

export const useBranding = () => useContext(BrandingContext);

interface BrandingProviderProps {
  client: Client | null;
  isLoading?: boolean;
  children: ReactNode;
}

export function BrandingProvider({ client, isLoading = false, children }: BrandingProviderProps) {
  useEffect(() => {
    if (!client) return;

    // Inject brand colors as CSS variables
    const root = document.documentElement;

    root.style.setProperty('--brand-primary', client.primary_color || '#FF6A00');
    root.style.setProperty('--brand-secondary', client.secondary_color || '#9B30FF');
    root.style.setProperty('--brand-tertiary', client.tertiary_color || '#FFD700');

    // Adjust font family based on brand tone
    const fontMap: Record<string, string> = {
      professional: 'Inter, system-ui, sans-serif',
      casual: 'Poppins, system-ui, sans-serif',
      technical: 'JetBrains Mono, monospace',
      friendly: 'Nunito, system-ui, sans-serif',
      corporate: 'IBM Plex Sans, system-ui, sans-serif',
    };

    const brandFont = fontMap[client.brand_tone || 'professional'] || fontMap.professional;
    root.style.setProperty('--brand-font', brandFont);

    // Generate gradient backgrounds
    const primaryColor = client.primary_color || '#FF6A00';
    const secondaryColor = client.secondary_color || '#9B30FF';

    root.style.setProperty(
      '--brand-gradient',
      `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
    );
    root.style.setProperty(
      '--brand-gradient-hover',
      `linear-gradient(135deg, ${primaryColor}dd, ${secondaryColor}dd)`
    );

    // Cleanup on unmount
    return () => {
      root.style.removeProperty('--brand-primary');
      root.style.removeProperty('--brand-secondary');
      root.style.removeProperty('--brand-tertiary');
      root.style.removeProperty('--brand-font');
      root.style.removeProperty('--brand-gradient');
      root.style.removeProperty('--brand-gradient-hover');
    };
  }, [client]);

  return (
    <BrandingContext.Provider value={{ client, isLoading }}>
      {children}
    </BrandingContext.Provider>
  );
}
